using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicineRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IMedicineRequestService _medicineRequestService;
    private readonly ILogger<MedicineRequestController> _logger;

    public MedicineRequestController(IMapper mapper, IMedicineRequestService medicineRequestService, ILogger<MedicineRequestController> logger)
    {
        _mapper = mapper;
        _medicineRequestService = medicineRequestService;
        _logger = logger;
    }

    // GET: api/MedicineRequest
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequests()
    {
        var medicineRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/student/ABC123
    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStudent(string studentCode)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStudentCodeAsync(studentCode);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/parent/5
    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByParent(int parentId)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByParentIdAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/staff/5
    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStaff(int staffId)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStaffIdAsync(staffId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/status/pending
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStatus(string status)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStatusAsync(status);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/available-nurses
    [HttpGet("available-nurses")]
    public async Task<ActionResult<IEnumerable<StaffDto.ViewModel>>> GetAvailableNurses()
    {
        var nurses = await _medicineRequestService.GetAvailableNursesAsync();
        var viewModels = _mapper.Map<IEnumerable<StaffDto.ViewModel>>(nurses);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/pending
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetPendingRequests()
    {
        var requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        // Only keep items with at least one period whose latest status is 'Pending'
        foreach (var req in viewModels)
        {
            req.MedicineRequestItems = req.MedicineRequestItems
                .Where(item => item.PeriodVerificationStatus != null &&
                    item.PeriodVerificationStatus.Values.Any(val => val != null && val.ToString() == "Pending")
                ).ToList();
        }
        viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/my-assigned-requests - Get requests for current nurse's assigned grades
    [HttpGet("my-assigned-requests")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMyAssignedRequests([FromQuery] string? status = null)
    {
        // Get current user ID from JWT token
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
        {
            return Unauthorized("Invalid token or user ID not found");
        }

        // Get current user role from JWT token
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
        if (roleClaim == null || roleClaim.Value.ToLower() != "nurse")
        {
            return Forbid("Only nurses can access their assigned requests");
        }

        _logger.LogInformation("GetMyAssignedRequests called by staffId={StaffId}, status={Status}", staffId, status);

        try
        {
            var requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId, status);
            var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
            _logger.LogInformation("Returning {Count} requests for staffId={StaffId}", viewModels.Count(), staffId);
            return Ok(viewModels);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting assigned requests for nurse {StaffId}", staffId);
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách yêu cầu thuốc được phân công" });
        }
    }

    // DEBUG endpoint - Get debug info for nurse assignments
    [HttpGet("debug/nurse-assignments/{staffId}")]
    public async Task<IActionResult> GetDebugNurseAssignments(int staffId)
    {
        try
        {
            var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
            var requestsInfo = allRequests.Select(r => new {
                RequestId = r.RequestId,
                StudentCode = r.StudentCode,
                StudentName = r.Student != null ? $"{r.Student.FirstName} {r.Student.LastName}" : "null",
                ClassName = r.Student?.Class?.ClassName ?? "null",
                GradeLevel = r.Student?.Class?.GradeLevel,
                Status = r.Status,
                StaffId = r.StaffId
            }).ToList();

            return Ok(new {
                StaffId = staffId,
                TotalRequests = requestsInfo.Count,
                Requests = requestsInfo
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting debug info for staffId {StaffId}", staffId);
            return StatusCode(500, new { message = "Debug error" });
        }
    }

    // DEBUG endpoint - Test assigned requests without auth
    [HttpGet("debug/test-assigned/{staffId}")]
    public async Task<IActionResult> TestAssignedRequests(int staffId, [FromQuery] string? status = null)
    {
        try
        {
            _logger.LogInformation("DEBUG TestAssignedRequests called: staffId={StaffId}, status={Status}", staffId, status);
            
            var requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId, status);
            var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
            
            _logger.LogInformation("DEBUG TestAssignedRequests returning {Count} requests", viewModels.Count());
            
            return Ok(new {
                StaffId = staffId,
                Status = status,
                Count = viewModels.Count(),
                Requests = viewModels
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TestAssignedRequests for staffId {StaffId}", staffId);
            return StatusCode(500, new { message = "Debug error", error = ex.Message });
        }
    }

    // DEBUG endpoint - Test JWT token validation
    [HttpGet("debug/test-auth")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public Task<IActionResult> TestAuth()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
            var nameClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Name);
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email);

            return Task.FromResult<IActionResult>(Ok(new {
                IsAuthenticated = User.Identity.IsAuthenticated,
                UserId = userIdClaim?.Value,
                Role = roleClaim?.Value,
                Name = nameClaim?.Value,
                Email = emailClaim?.Value,
                Claims = User.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToList()
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TestAuth");
            return Task.FromResult<IActionResult>(StatusCode(500, new { message = "Auth test error", error = ex.Message }));
        }
    }

    // DEBUG endpoint - Check JWT token format without authentication
    [HttpGet("debug/check-token")]
    public Task<IActionResult> CheckToken()
    {
        try
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            return Task.FromResult<IActionResult>(Ok(new {
                HasAuthHeader = authHeader != null,
                AuthHeader = authHeader,
                HasBearerPrefix = authHeader?.StartsWith("Bearer ") == true,
                TokenLength = authHeader?.Replace("Bearer ", "").Length,
                Recommendations = new List<string>
                {
                    authHeader == null ? "Thiếu Authorization header" : null,
                    authHeader != null && !authHeader.StartsWith("Bearer ") ? "Authorization header phải bắt đầu với 'Bearer '" : null,
                    authHeader?.Replace("Bearer ", "").Length < 100 ? "Token có vẻ quá ngắn" : null
                }.Where(r => r != null).ToList()
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CheckToken");
            return Task.FromResult<IActionResult>(StatusCode(500, new { message = "Check token error", error = ex.Message }));
        }
    }

    // POST: api/MedicineRequest
    [HttpPost]
    public async Task<ActionResult<MedicineRequestDto.ViewModel>> CreateMedicineRequest(MedicineRequestDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        if (createDto.MedicineRequestItems == null || !createDto.MedicineRequestItems.Any())
        {
            return BadRequest("Medicine request must contain at least one medicine item.");
        }

        // Map the DTO to entity
        var medicineRequest = _mapper.Map<MedicineRequest>(createDto);
        
        // Set default status to Pending
        medicineRequest.Status = "Pending";
        
        // Set request date to current time
        medicineRequest.RequestDate = DateTime.UtcNow;

        // Check if student code is provided to determine grade for auto nurse assignment
        if (!string.IsNullOrEmpty(medicineRequest.StudentCode))
        {
            var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(medicineRequest.StudentCode);
            if (grade.HasValue)
            {
                var assignedNurse = await _medicineRequestService.GetNurseByGradeAsync(grade.Value);
                if (assignedNurse != null)
                {
                    _logger.LogInformation("Auto-assigned nurse {NurseId} ({NurseName}) to medicine request for student {StudentCode} in grade {Grade}", 
                        assignedNurse.StaffId, $"{assignedNurse.FirstName} {assignedNurse.LastName}", medicineRequest.StudentCode, grade.Value);
                }
                else
                {
                    _logger.LogWarning("No nurse found assigned to grade {Grade} for student {StudentCode}", grade.Value, medicineRequest.StudentCode);
                }
            }
            else
            {
                _logger.LogWarning("Could not determine grade for student {StudentCode}", medicineRequest.StudentCode);
            }
        }

        var created = await _medicineRequestService.CreateMedicineRequestAsync(medicineRequest);
        if (created == null)
        {
            return BadRequest("Failed to create medicine request.");
        }
        var viewModel = _mapper.Map<MedicineRequestDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetMedicineRequest), new { id = viewModel.RequestId }, viewModel);
    }

    // PUT: api/MedicineRequest/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicineRequest(int id, MedicineRequestDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        // Retrieve the existing request to ensure we are updating the correct entity
        var existingRequest = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (existingRequest == null)
        {
            return NotFound();
        }

        _mapper.Map(updateDto, existingRequest);
        existingRequest.RequestId = id; // Ensure ID is set for update

        var success = await _medicineRequestService.UpdateMedicineRequestAsync(existingRequest);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // DELETE: api/MedicineRequest/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicineRequest(int id)
    {
        var success = await _medicineRequestService.DeleteMedicineRequestAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // POST: api/MedicineRequest/item/{medicineRequestItemId}/assign-nurse/{staffId}
    [HttpPost("item/{medicineRequestItemId}/assign-nurse/{staffId}")]
    public async Task<IActionResult> AssignNurseToRequestItem(int medicineRequestItemId, int staffId, [FromQuery] string period)
    {
        if (string.IsNullOrWhiteSpace(period))
            return BadRequest("Period is required for assignment.");

        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(medicineRequestItemId);
        if (item == null)
            return NotFound();

        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null)
            return NotFound("Medicine request not found.");

        // Check if manual assignment is allowed for this request
        var isManualAssignmentAllowed = await _medicineRequestService.IsManualAssignmentAllowedAsync(request.RequestId);
        if (!isManualAssignmentAllowed)
        {
            var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
            var assignedNurse = grade.HasValue ? await _medicineRequestService.GetNurseByGradeAsync(grade.Value) : null;
            return BadRequest($"Manual assignment is not allowed for this request. Student is in grade {grade} which is managed by nurse: {assignedNurse?.FirstName} {assignedNurse?.LastName}");
        }

        // Proceed with manual assignment
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }

        var history = GetStatusHistory(periodStatus, period);
        history.Add(new Dictionary<string, object> {
            { "Status", "Assigned" },
            { "StaffId", staffId },
            { "Timestamp", DateTime.UtcNow }
        });

        periodStatus[period] = history;
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        
        if (!success) return NotFound();
        return NoContent();
    }

    // GET: api/MedicineRequest/student/{studentCode}/grade
    [HttpGet("student/{studentCode}/grade")]
    public async Task<IActionResult> GetGradeByStudentCode(string studentCode)
    {
        try
        {
            var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(studentCode);
            
            if (grade.HasValue)
            {
                return Ok(new { grade = grade.Value });
            }
            
            return NotFound(new { message = "Không tìm thấy thông tin khối học của học sinh này" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting grade for student {StudentCode}", studentCode);
            return StatusCode(500, new { message = "Lỗi khi lấy thông tin khối học" });
        }
    }

    // GET: api/MedicineRequest/grade/{grade}/nurse
    [HttpGet("grade/{grade}/nurse")]
    public async Task<IActionResult> GetNurseByGrade(int grade)
    {
        try
        {
            var nurse = await _medicineRequestService.GetNurseByGradeAsync(grade);
            
            if (nurse != null)
            {
                var nurseViewModel = _mapper.Map<StaffDto.ViewModel>(nurse);
                return Ok(nurseViewModel);
            }
            
            return NotFound(new { message = $"Không tìm thấy nurse phụ trách khối {grade}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting nurse for grade {Grade}", grade);
            return StatusCode(500, new { message = "Lỗi khi lấy thông tin nurse phụ trách khối" });
        }
    }

    // GET: api/MedicineRequest/{id}/manual-assignment-allowed
    [HttpGet("{id}/manual-assignment-allowed")]
    public async Task<IActionResult> CheckManualAssignmentAllowed(int id)
    {
        try
        {
            var allowed = await _medicineRequestService.IsManualAssignmentAllowedAsync(id);
            return Ok(allowed);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking manual assignment for request {RequestId}", id);
            return StatusCode(500, new { message = "Lỗi khi kiểm tra phân công thủ công" });
        }
    }

    // GET: api/MedicineRequest/{id}/auto-assignment-info
    [HttpGet("{id}/auto-assignment-info")]
    public async Task<IActionResult> GetAutoAssignmentInfo(int id)
    {
        try
        {
            var request = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
            if (request == null)
            {
                return NotFound(new { message = "Không tìm thấy yêu cầu thuốc" });
            }

            var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
            if (!grade.HasValue)
            {
                return Ok(new { 
                    grade = (int?)null,
                    nurse = (object)null,
                    isAutoAssigned = false,
                    message = "Không thể xác định khối học"
                });
            }

            var nurse = await _medicineRequestService.GetNurseByGradeAsync(grade.Value);
            
            return Ok(new {
                grade = grade.Value,
                nurse = nurse,
                isAutoAssigned = nurse != null,
                message = nurse != null ? "Đã có nurse được phân công tự động" : "Chưa có nurse phụ trách khối này"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting auto assignment info for request {RequestId}", id);
            return StatusCode(500, new { message = "Lỗi khi lấy thông tin phân công tự động" });
        }
    }

    // POST: api/MedicineRequest/{id}/assign-nurse/{staffId}
    [HttpPost("{id}/assign-nurse/{staffId}")]
    public async Task<IActionResult> AssignNurseToRequest(int id, int staffId)
    {
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (request == null)
            return NotFound();

        // Check if manual assignment is allowed
        var isManualAssignmentAllowed = await _medicineRequestService.IsManualAssignmentAllowedAsync(id);
        if (!isManualAssignmentAllowed)
        {
            var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
            var assignedNurse = grade.HasValue ? await _medicineRequestService.GetNurseByGradeAsync(grade.Value) : null;
            return BadRequest($"Manual assignment is not allowed. Student is in grade {grade} which is automatically managed by nurse: {assignedNurse?.FirstName} {assignedNurse?.LastName}");
        }

        var success = await _medicineRequestService.AssignNurseToRequestAsync(id, staffId);
        if (!success)
        {
            return BadRequest("Assignment failed. Request may not be in correct status or nurse may have reached maximum requests limit.");
        }

        return NoContent();
    }

    // POST: api/MedicineRequest/{id}/start-administration/{staffId}
    [HttpPost("{id}/start-administration/{staffId}")]
    public async Task<ActionResult<object>> StartMedicineAdministration(int id, int staffId)
    {
        var requestResult = await _medicineRequestService.StartMedicineRequestAsync(id, staffId);
        if (requestResult == null)
        {
            return BadRequest("Failed to start medicine administration. Request may not be in correct status.");
        }

        return Ok(new
        {
            requestResultId = requestResult.ResultId,
            status = requestResult.Status,
            message = "Medicine administration started successfully"
        });
    }

    // POST: api/MedicineRequest/administer-frequency
    [HttpPost("administer-frequency")]
    public async Task<IActionResult> AdministerMedicineByFrequency([FromBody] AdministerFrequencyDto dto)
    {
        if (dto == null || dto.RequestResultId <= 0 || dto.MedicineRequestItemId <= 0 || string.IsNullOrEmpty(dto.Frequency) || dto.StaffId <= 0)
            return BadRequest("Missing required fields.");

        var success = await _medicineRequestService.AdministerMedicineByFrequencyAsync(
            dto.RequestResultId, dto.MedicineRequestItemId, dto.Frequency, dto.StaffId, dto.Notes);

        if (!success)
        {
            return BadRequest("Failed to administer medicine. Please check the request status and frequency.");
        }

        return NoContent();
    }

    public class AdministerFrequencyDto
    {
        public int RequestResultId { get; set; }
        public int MedicineRequestItemId { get; set; }
        public string Frequency { get; set; } = null!;
        public int StaffId { get; set; }
        public string? Notes { get; set; }
    }

    public class PeriodActionDto
    {
        public string Period { get; set; } = null!;
        public int? StaffId { get; set; }
        public string? RefusalReason { get; set; }
    }

    public class ReportFailureDto
    {
        public int MedicineRequestItemId { get; set; }
        public string Period { get; set; } = null!;
        public int StaffId { get; set; }
        public string FailureReason { get; set; } = null!;
        public string? Notes { get; set; }
    }

    public class CreateReRequestDto
    {
        public int OriginalRequestResultId { get; set; }
        public string ReRequestReason { get; set; } = null!;
        public int StaffId { get; set; }
    }

    // POST: api/MedicineRequest/create-re-request
    [HttpPost("create-re-request")]
    public async Task<ActionResult<object>> CreateReRequest([FromBody] CreateReRequestDto dto)
    {
        if (dto == null || dto.OriginalRequestResultId <= 0 || string.IsNullOrEmpty(dto.ReRequestReason) || dto.StaffId <= 0)
            return BadRequest("Missing required fields.");

        var requestResult = await _medicineRequestService.CreateReRequestAsync(dto.OriginalRequestResultId, dto.ReRequestReason, dto.StaffId);
        if (requestResult == null)
        {
            return BadRequest("Failed to create re-request. Original request may not be eligible for re-request.");
        }

        return Ok(new
        {
            requestResultId = requestResult.ResultId,
            status = requestResult.Status,
            message = "Re-request created successfully"
        });
    }

    // GET: api/MedicineRequest/failed-requests
    [HttpGet("failed-requests")]
    public async Task<ActionResult<IEnumerable<object>>> GetFailedRequests()
    {
        var failedResults = await _medicineRequestService.GetFailedRequestsAsync();
        return Ok(failedResults.Select(r => new
        {
            requestResultId = r.ResultId,
            requestId = r.RequestId,
            status = r.Status,
            failedAttempts = r.FailedAttempts,
            lastAttemptTime = r.LastAttemptTime,
            student = r.Request?.Student != null ? new
            {
                studentCode = r.Request.Student.StudentCode,
                name = $"{r.Request.Student.FirstName} {r.Request.Student.LastName}"
            } : null
        }));
    }

    // GET: api/MedicineRequest/{originalRequestResultId}/re-requests
    [HttpGet("{originalRequestResultId}/re-requests")]
    public async Task<ActionResult<IEnumerable<object>>> GetReRequests(int originalRequestResultId)
    {
        var reRequests = await _medicineRequestService.GetReRequestsAsync(originalRequestResultId);
        return Ok(reRequests.Select(r => new
        {
            requestResultId = r.ResultId,
            status = r.Status,
            reRequestReason = r.ReRequestReason,
            submittedAt = r.SubmittedAt,
            isReRequest = r.IsReRequest
        }));
    }

    // POST: api/MedicineRequest/update-time-based-status
    [HttpPost("update-time-based-status")]
    public async Task<ActionResult<object>> UpdateTimeBasedStatus()
    {
        var updated = await _medicineRequestService.UpdateTimeBasedStatusAsync();
        return Ok(new
        {
            success = updated,
            message = updated ? "Time-based status updated successfully" : "No updates were made"
        });
    }

    // GET: api/MedicineRequest/{requestResultId}/re-request-info
    [HttpGet("{requestResultId}/re-request-info")]
    public async Task<ActionResult<object>> GetReRequestInfo(int requestResultId)
    {
        var canReRequest = await _medicineRequestService.CanReRequestAsync(requestResultId);
        var requestResult = await _medicineRequestService.GetRequestResultByIdAsync(requestResultId);
        
        if (requestResult == null)
            return NotFound();

        return Ok(new
        {
            canReRequest = canReRequest,
            status = requestResult.Status,
            currentTime = DateTime.UtcNow,
            cutoffTime = DateTime.Today.AddHours(17), // 5 PM cutoff
            isAfterCutoff = DateTime.UtcNow.Hour >= 17
        });
    }

    // POST: api/MedicineRequest/{requestResultId}/mark-failed
    [HttpPost("{requestResultId}/mark-failed")]
    public async Task<IActionResult> MarkRequestAsFailed(int requestResultId, [FromBody] string reason)
    {
        var success = await _medicineRequestService.MarkAsFailedAsync(requestResultId, reason);
        if (!success)
        {
            return BadRequest("Failed to mark request as failed. Request may not exist.");
        }

        return NoContent();
    }

    // GET: api/MedicineRequest/{requestResultId}/failure-summary
    [HttpGet("{requestResultId}/failure-summary")]
    public async Task<ActionResult<object>> GetFailureSummary(int requestResultId)
    {
        var requestResult = await _medicineRequestService.GetRequestResultByIdAsync(requestResultId);
        if (requestResult == null)
            return NotFound();

        var canReRequest = await _medicineRequestService.CanReRequestAsync(requestResultId);

        return Ok(new
        {
            requestResultId = requestResultId,
            status = requestResult.Status,
            failedAttempts = requestResult.FailedAttempts,
            lastAttemptTime = requestResult.LastAttemptTime,
            isEligibleForReRequest = canReRequest,
            failureReasons = requestResult.FailureReasons,
            failedFrequencies = requestResult.FailedFrequencies
        });
    }

    // Helper to extract periods from frequency (same logic as in mapping profile)
    private static List<string> ExtractPeriodsFromFrequency(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency)) return new List<string>();
        var periods = new[] { "Sáng", "Trưa", "Chiều", "Tối" };
        var found = new List<string>();
        foreach (var period in periods)
        {
            if (frequency.IndexOf(period, StringComparison.OrdinalIgnoreCase) >= 0)
                found.Add(period);
        }
        if (found.Count > 0)
            return found;
        // Handle generic cases like '2 lần', '3 lần', etc.
        if (frequency.Contains("2")) return new List<string> { "Sáng", "Trưa" };
        if (frequency.Contains("3")) return new List<string> { "Sáng", "Trưa", "Chiều" };
        if (frequency.Contains("4")) return new List<string> { "Sáng", "Trưa", "Chiều", "Tối" };
        if (frequency.Contains("1")) return new List<string> { "Sáng" };
        return new List<string>();
    }

    // GET: api/MedicineRequest/verified
    [HttpGet("verified")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetVerifiedRequests([FromQuery] string? period = null)
    {
        var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        _logger.LogInformation("Total requests: {Count}", viewModels.Count());
        foreach (var req in viewModels)
        {
            _logger.LogInformation("RequestId: {RequestId}, ItemCount: {ItemCount}", req.RequestId, req.MedicineRequestItems.Count());
            foreach (var item in req.MedicineRequestItems)
            {
                _logger.LogInformation("ItemId: {ItemId}, VerificationStatus: {VerificationStatus}, PeriodVerificationStatus: {PeriodVerificationStatus}",
                    item.MedicineRequestItemId,
                    item.VerificationStatus,
                    System.Text.Json.JsonSerializer.Serialize(item.PeriodVerificationStatus));
            }
        }
        if (!string.IsNullOrEmpty(period))
        {
            foreach (var req in viewModels)
            {
                req.MedicineRequestItems = req.MedicineRequestItems
                    .Where(item => item.PeriodVerificationStatus != null &&
                        item.PeriodVerificationStatus.Any(kv => kv.Key.Trim().Equals(period.Trim(), StringComparison.OrdinalIgnoreCase) && (kv.Value?.ToString() == "Verified")))
                    .ToList();
            }
            viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        }
        else
        {
            foreach (var req in viewModels)
            {
                req.MedicineRequestItems = req.MedicineRequestItems
                    .Where(item => item.PeriodVerificationStatus != null && item.PeriodVerificationStatus.Values.Any(status => status?.ToString() == "Verified"))
                    .ToList();
            }
            viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        }
        return Ok(viewModels);
    }

    private static bool IsRefusedStatus(object val)
    {
        if (val is string s)
        {
            if (s == "Refused") return true;
            if (s.StartsWith("{") && s.Contains("Status"))
            {
                try
                {
                    var jsonElem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(s);
                    if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object &&
                        jsonElem.TryGetProperty("Status", out var statusPropInner) &&
                        statusPropInner.GetString() == "Refused")
                        return true;
                }
                catch { }
            }
        }
        if (val is System.Text.Json.JsonElement elem &&
            elem.ValueKind == System.Text.Json.JsonValueKind.Object &&
            elem.TryGetProperty("Status", out var statusProp) &&
            statusProp.GetString() == "Refused")
            return true;
        return false;
    }

    // GET: api/MedicineRequest/refused
    [HttpGet("refused")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetRefusedRequests([FromQuery] string? period = null)
    {
        var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        foreach (var req in viewModels)
        {
            req.MedicineRequestItems = req.MedicineRequestItems
                .Where(item => item.PeriodVerificationStatus != null &&
                    item.PeriodVerificationStatus.Any(kv =>
                        (string.IsNullOrEmpty(period) || kv.Key.Trim().Equals(period.Trim(), StringComparison.OrdinalIgnoreCase)) &&
                        IsRefusedStatus(kv.Value)
                    )
                ).ToList();
        }
        viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/assigned
    [HttpGet("assigned")]
    public async Task<ActionResult<IEnumerable<object>>> GetAssignedRequests([FromQuery] string? period = null)
    {
        var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);

        var result = new List<object>();
        foreach (var req in viewModels)
        {
            var assignedItems = new List<object>();
            foreach (var item in req.MedicineRequestItems)
            {
                // Debug: log VerificationStatus
                _logger.LogInformation($"ItemId: {item.MedicineRequestItemId}, VerificationStatus: {item.VerificationStatus}, Period: {item.Period}, Frequency: {item.Frequency}");
                var periodStatus = new Dictionary<string, object>();
                bool parsedAsDict = false;
                if (!string.IsNullOrEmpty(item.VerificationStatus))
                {
                    try
                    {
                        periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus);
                        parsedAsDict = true;
                    }
                    catch { }
                }
                _logger.LogInformation($"Parsed periodStatus for ItemId {item.MedicineRequestItemId}: {System.Text.Json.JsonSerializer.Serialize(periodStatus)}");
                var assignedPeriods = new List<object>();
                if (parsedAsDict && periodStatus.Count > 0)
                {
                    foreach (var kv in periodStatus)
                    {
                        try
                        {
                            // Log the type of kv.Value
                            _logger.LogInformation($"kv.Key: '{kv.Key}', kv.Value type: {kv.Value?.GetType().Name}");
                            if (kv.Value is string strVal)
                            {
                                bool handled = false;
                                if (strVal.StartsWith("{") && strVal.Contains("Status"))
                                {
                                    try
                                    {
                                        var elem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(strVal);
                                        var status = elem.TryGetProperty("Status", out var statusProp) && statusProp.ValueKind == System.Text.Json.JsonValueKind.String
                                            ? statusProp.GetString()
                                            : null;
                                        var staffId = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
                                            ? staffProp.GetInt32()
                                            : (int?)null;
                                        var timestamp = elem.TryGetProperty("Timestamp", out var tsProp) && tsProp.ValueKind == System.Text.Json.JsonValueKind.String
                                            ? DateTime.Parse(tsProp.GetString())
                                            : (DateTime?)null;
                                        if (status == "Assigned")
                                        {
                                            var keyNorm = kv.Key?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                            var periodNorm = period?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                            _logger.LogInformation($"Comparing period key: '{kv.Key}' with query period: '{period}'");
                                            if (string.IsNullOrEmpty(periodNorm) || string.Equals(keyNorm, periodNorm, StringComparison.OrdinalIgnoreCase))
                                            {
                                                assignedPeriods.Add(new {
                                                    Period = kv.Key,
                                                    Status = status,
                                                    StaffId = staffId,
                                                    Timestamp = timestamp
                                                });
                                            }
                                            handled = true;
                                        }
                                    }
                                    catch { }
                                }
                                if (!handled && strVal == "Assigned")
                                {
                                    var keyNorm = kv.Key?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                    var periodNorm = period?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                    _logger.LogInformation($"Comparing period key: '{kv.Key}' with query period: '{period}'");
                                    if (string.IsNullOrEmpty(periodNorm) || string.Equals(keyNorm, periodNorm, StringComparison.OrdinalIgnoreCase))
                                    {
                                        assignedPeriods.Add(new {
                                            Period = kv.Key,
                                            Status = strVal,
                                            StaffId = (int?)null,
                                            Timestamp = (string?)null
                                        });
                                    }
                                }
                            }
                            else if (kv.Value is System.Text.Json.JsonElement jsonElem)
                            {
                                // If it's a string JsonElement, extract the string and process as above
                                if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.String)
                                {
                                    var jsonStrVal = jsonElem.GetString(); // Renamed from strVal
                                    _logger.LogInformation($"JsonElement string value for key '{kv.Key}': {jsonStrVal}");
                                    bool handled = false;
                                    if (!string.IsNullOrEmpty(jsonStrVal) && jsonStrVal.StartsWith("{") && jsonStrVal.Contains("Status"))
                                    {
                                        try
                                        {
                                            var elem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(jsonStrVal);
                                            var status = elem.TryGetProperty("Status", out var statusProp) && statusProp.ValueKind == System.Text.Json.JsonValueKind.String
                                                ? statusProp.GetString()
                                                : null;
                                            var staffId = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
                                                ? staffProp.GetInt32()
                                                : (int?)null;
                                            var timestamp = elem.TryGetProperty("Timestamp", out var tsProp) && tsProp.ValueKind == System.Text.Json.JsonValueKind.String
                                                ? DateTime.Parse(tsProp.GetString())
                                                : (DateTime?)null;
                                            if (status == "Assigned")
                                            {
                                                var keyNorm = kv.Key?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                                var periodNorm = period?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                                _logger.LogInformation($"Comparing period key: '{kv.Key}' with query period: '{period}'");
                                                if (string.IsNullOrEmpty(periodNorm) || string.Equals(keyNorm, periodNorm, StringComparison.OrdinalIgnoreCase))
                                                {
                                                    assignedPeriods.Add(new {
                                                        Period = kv.Key,
                                                        Status = status,
                                                        StaffId = staffId,
                                                        Timestamp = timestamp
                                                    });
                                                }
                                                handled = true;
                                            }
                                        }
                                        catch { }
                                    }
                                    if (!handled && jsonStrVal == "Assigned")
                                    {
                                        var keyNorm = kv.Key?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                        var periodNorm = period?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                        _logger.LogInformation($"Comparing period key: '{kv.Key}' with query period: '{period}'");
                                        if (string.IsNullOrEmpty(periodNorm) || string.Equals(keyNorm, periodNorm, StringComparison.OrdinalIgnoreCase))
                                        {
                                            assignedPeriods.Add(new {
                                                Period = kv.Key,
                                                Status = jsonStrVal,
                                                StaffId = (int?)null,
                                                Timestamp = (string?)null
                                            });
                                        }
                                    }
                                }
                                // If it's an object JsonElement, process as before
                                else if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object)
                                {
                                    var elem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(jsonElem.GetRawText());
                                    var status = elem.TryGetProperty("Status", out var statusProp) && statusProp.ValueKind == System.Text.Json.JsonValueKind.String
                                        ? statusProp.GetString()
                                        : null;
                                    var staffId = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
                                        ? staffProp.GetInt32()
                                        : (int?)null;
                                    var timestamp = elem.TryGetProperty("Timestamp", out var tsProp) && tsProp.ValueKind == System.Text.Json.JsonValueKind.String
                                        ? DateTime.Parse(tsProp.GetString())
                                        : (DateTime?)null;
                                    if (status == "Assigned")
                                    {
                                        var keyNorm = kv.Key?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                        var periodNorm = period?.Trim().Normalize(System.Text.NormalizationForm.FormC) ?? string.Empty;
                                        _logger.LogInformation($"Comparing period key: '{kv.Key}' with query period: '{period}'");
                                        if (string.IsNullOrEmpty(periodNorm) || string.Equals(keyNorm, periodNorm, StringComparison.OrdinalIgnoreCase))
                                        {
                                            assignedPeriods.Add(new {
                                                Period = kv.Key,
                                                Status = status,
                                                StaffId = staffId,
                                                Timestamp = timestamp
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                }
                else if (!parsedAsDict && !string.IsNullOrEmpty(item.VerificationStatus))
                {
                    var statusStr = item.VerificationStatus;
                    if (statusStr == "Assigned")
                    {
                        var periods = new List<string>();
                        if (!string.IsNullOrEmpty(item.Period))
                        {
                            periods = item.Period.Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToList();
                        }
                        if (periods.Count == 0 && !string.IsNullOrEmpty(item.Frequency))
                        {
                            periods = ExtractPeriodsFromFrequency(item.Frequency);
                        }
                        if (periods.Count == 0)
                        {
                            periods.Add("Sáng");
                        }
                        foreach (var p in periods)
                        {
                            if (period == null || p.Equals(period, StringComparison.OrdinalIgnoreCase))
                            {
                                assignedPeriods.Add(new {
                                    Period = p,
                                    Status = statusStr,
                                    StaffId = (int?)null,
                                    Timestamp = (string?)null
                                });
                            }
                        }
                    }
                }
                _logger.LogInformation($"AssignedPeriods for ItemId {item.MedicineRequestItemId}: {System.Text.Json.JsonSerializer.Serialize(assignedPeriods)}");
                if (assignedPeriods.Any())
                {
                    assignedItems.Add(new {
                        item.MedicineRequestItemId,
                        item.MedicineRequestId,
                        item.MedicineName,
                        item.Dosage,
                        item.Frequency,
                        item.TimeOfDay,
                        item.Instructions,
                        item.Period,
                        AssignedPeriods = assignedPeriods
                    });
                }
            }
            if (assignedItems.Any())
            {
                result.Add(new {
                    req.RequestId,
                    req.Status,
                    req.StudentCode,
                    req.ClassName,
                    req.Date,
                    req.ParentId,
                    req.StaffId,
                    req.RequestDate,
                    Staff = req.Staff != null ? new {
                        req.Staff.StaffId,
                        req.Staff.FirstName,
                        req.Staff.LastName,
                        req.Staff.Username
                    } : null,
                    StudentName = req.Student != null ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim() : null,
                    ParentName = req.Parent != null ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim() : null,
                    AssignedItems = assignedItems
                });
            }
        }
        return Ok(result);
    }

    // POST: api/MedicineRequest/{id}/complete/{staffId}
    [HttpPost("{medicineRequestItemId}/complete/{staffId}")]
    public async Task<IActionResult> CompleteMedicineRequestItemPeriod(int medicineRequestItemId, int staffId, [FromQuery] string period)
    {
        if (string.IsNullOrEmpty(period)) return BadRequest("Period is required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(medicineRequestItemId);
        if (item == null) return NotFound();
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        var history = GetStatusHistory(periodStatus, period);
        history.Add(new Dictionary<string, object> {
            { "Status", "Completed" },
            { "StaffId", staffId },
            { "Timestamp", DateTime.UtcNow }
        });
        periodStatus[period] = history;
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // GET: api/MedicineRequest/item/{medicineRequestItemId}/period/{period}/re-request-info
    [HttpGet("item/{medicineRequestItemId}/period/{period}/re-request-info")]
    public async Task<ActionResult<object>> GetReRequestInfo(int medicineRequestItemId, string period)
    {
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(medicineRequestItemId);
        if (item == null) return NotFound();
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        var studentName = request?.Student != null ? ($"{request.Student.LastName} {request.Student.FirstName}").Trim() : null;
        var parentName = request?.Parent != null ? ($"{request.Parent.LastName} {request.Parent.FirstName}").Trim() : null;
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        var history = GetStatusHistory(periodStatus, period);
        var last = history.LastOrDefault();
        bool canReRequest = false;
        string? reason = null;
        if (last != null && last.ContainsKey("Status") && last["Status"]?.ToString() == "Failed")
        {
            if (DateTime.UtcNow.Hour < 17)
            {
                canReRequest = true;
            }
            else
            {
                reason = "Too late for re-request";
            }
        }
        else
        {
            reason = "Not failed or already retried";
        }
        return Ok(new {
            canReRequest,
            reason,
            studentCode = request?.StudentCode,
            studentName,
            className = request?.ClassName,
            parentId = request?.ParentId,
            parentName,
            medicineRequestItemId = item.MedicineRequestItemId,
            medicineName = item.MedicineName,
            dosage = item.Dosage,
            frequency = item.Frequency,
            timeOfDay = item.TimeOfDay,
            instructions = item.Instructions,
            period,
            history
        });
    }

    // POST: api/MedicineRequest/report-failure
    [HttpPost("report-failure")]
    public async Task<IActionResult> ReportMedicineFailure([FromBody] ReportFailureDto dto)
    {
        if (dto == null || dto.MedicineRequestItemId <= 0 || string.IsNullOrEmpty(dto.Period) || dto.StaffId <= 0 || string.IsNullOrEmpty(dto.FailureReason))
            return BadRequest("Missing required fields.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(dto.MedicineRequestItemId);
        if (item == null) return NotFound();
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        var history = GetStatusHistory(periodStatus, dto.Period);
        history.Add(new Dictionary<string, object> {
            { "Status", "Failed" },
            { "StaffId", dto.StaffId },
            { "Timestamp", DateTime.UtcNow },
            { "FailureReason", dto.FailureReason },
            { "Notes", dto.Notes }
        });
        periodStatus[dto.Period] = history;
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // POST: api/MedicineRequest/item/{medicineRequestItemId}/rerequest
    [HttpPost("item/{medicineRequestItemId}/rerequest")]
    public async Task<IActionResult> ReRequestPeriod(int medicineRequestItemId, [FromQuery] string period, [FromQuery] int staffId)
    {
        if (string.IsNullOrEmpty(period) || staffId <= 0) return BadRequest("Period and staffId required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(medicineRequestItemId);
        if (item == null) return NotFound();
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        var history = GetStatusHistory(periodStatus, period);
        history.Add(new Dictionary<string, object> {
            { "Status", "Redo" }, // or "Assigned"
            { "StaffId", staffId },
            { "Timestamp", DateTime.UtcNow },
            { "IsReRequest", true }
        });
        periodStatus[period] = history;
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // GET: api/MedicineRequest/item/{medicineRequestItemId}/period/{period}/history
    [HttpGet("item/{medicineRequestItemId}/period/{period}/history")]
    public async Task<ActionResult<object>> GetPeriodHistory(int medicineRequestItemId, string period)
    {
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(medicineRequestItemId);
        if (item == null) return NotFound();
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        var studentName = request?.Student != null ? ($"{request.Student.LastName} {request.Student.FirstName}").Trim() : null;
        var parentName = request?.Parent != null ? ($"{request.Parent.LastName} {request.Parent.FirstName}").Trim() : null;
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        var history = GetStatusHistory(periodStatus, period);
        return Ok(new {
            studentCode = request?.StudentCode,
            studentName,
            className = request?.ClassName,
            parentId = request?.ParentId,
            parentName,
            medicineRequestItemId = item.MedicineRequestItemId,
            medicineName = item.MedicineName,
            dosage = item.Dosage,
            frequency = item.Frequency,
            timeOfDay = item.TimeOfDay,
            instructions = item.Instructions,
            period,
            history
        });
    }

    // GET: api/MedicineRequest/completed
    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<object>>> GetCompletedItems([FromQuery] string? period = null)
    {
        _logger.LogInformation("GET /completed endpoint hit!");
        var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        var completed = new List<dynamic>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                var periodStatus = new Dictionary<string, object>();
                try
                {
                    periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
                }
                catch { }
                foreach (var kv in periodStatus)
                {
                    string status = null;
                    int? staffId = null;
                    DateTime? timestamp = null;
                    if (kv.Value is string strVal)
                    {
                        if (strVal.StartsWith("{") && strVal.Contains("Status"))
                        {
                            try
                            {
                                var elem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(strVal);
                                status = elem.TryGetProperty("Status", out var statusProp) && statusProp.ValueKind == System.Text.Json.JsonValueKind.String
                                    ? statusProp.GetString()
                                    : null;
                                if (elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                    staffId = staffProp.GetInt32();
                                else
                                    staffId = null;
                                if (elem.TryGetProperty("Timestamp", out var tsProp) && tsProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                    timestamp = DateTime.Parse(tsProp.GetString());
                                else
                                    timestamp = null;
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, $"Error parsing stringified object for period '{kv.Key}'");
                            }
                        }
                        else
                        {
                            status = strVal;
                        }
                    }
                    else if (kv.Value is System.Text.Json.JsonElement jsonElem)
                    {
                        if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.String)
                        {
                            var str = jsonElem.GetString();
                            if (!string.IsNullOrEmpty(str) && str.StartsWith("{") && str.Contains("Status"))
                            {
                                try
                                {
                                    var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(str);
                                    status = obj.ContainsKey("Status") ? obj["Status"]?.ToString() : null;
                                    if (obj.ContainsKey("StaffId") && obj["StaffId"] is System.Text.Json.JsonElement staffElem && staffElem.ValueKind == System.Text.Json.JsonValueKind.Number)
                                        staffId = staffElem.GetInt32();
                                    else
                                        staffId = null;
                                    if (obj.ContainsKey("Timestamp") && obj["Timestamp"] is System.Text.Json.JsonElement tsElem && tsElem.ValueKind == System.Text.Json.JsonValueKind.String)
                                        timestamp = DateTime.Parse(tsElem.GetString());
                                    else
                                        timestamp = null;
                                }
                                catch (Exception ex)
                                {
                                    _logger.LogError(ex, $"Error parsing stringified object in JsonElement for period '{kv.Key}'");
                                }
                            }
                            else
                            {
                                status = str;
                            }
                        }
                        else if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object)
                        {
                            try
                            {
                                _logger.LogInformation($"Raw JsonElement for period '{kv.Key}': {jsonElem.GetRawText()}");
                                status = jsonElem.TryGetProperty("Status", out var statusProp) && statusProp.ValueKind == System.Text.Json.JsonValueKind.String
                                    ? statusProp.GetString()
                                    : null;
                                if (jsonElem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                    staffId = staffProp.GetInt32();
                                else
                                    staffId = null;
                                if (jsonElem.TryGetProperty("Timestamp", out var tsProp) && tsProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                    timestamp = DateTime.Parse(tsProp.GetString());
                                else
                                    timestamp = null;
                                _logger.LogInformation($"Extracted for period '{kv.Key}': Status={status}, StaffId={staffId}, Timestamp={timestamp}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, $"Error parsing JsonElement object for period '{kv.Key}'");
                            }
                        }
                    }
                    if (status == "Completed" && (string.IsNullOrEmpty(period) || string.Equals(kv.Key, period, StringComparison.OrdinalIgnoreCase)))
                    {
                        completed.Add(new {
                            RequestId = req.RequestId,
                            StudentCode = req.StudentCode,
                            StudentName = req.Student != null ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim() : null,
                            ClassName = req.ClassName,
                            Date = req.Date,
                            ParentId = req.ParentId,
                            ParentName = req.Parent != null ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim() : null,
                            MedicineRequestItemId = item.MedicineRequestItemId,
                            MedicineName = item.MedicineName,
                            Dosage = item.Dosage,
                            Frequency = item.Frequency,
                            TimeOfDay = item.TimeOfDay,
                            Instructions = item.Instructions,
                            Period = kv.Key,
                            VerifiedStatus = status,
                            VerifiedStaffId = staffId,
                            VerifiedTimestamp = timestamp
                        });
                    }
                }
            }
        }
        IEnumerable<object> result;
        if (!string.IsNullOrEmpty(period))
        {
            result = completed;
        }
        else
        {
            result = completed.GroupBy(x => x.Period)
                .Select(g => new {
                    Period = g.Key,
                    CompletedItems = g.ToList()
                });
        }
        return Ok(result);
    }

    // GET: api/MedicineRequest/{requestResultId}/debug/{medicineRequestItemId}
    [HttpGet("{requestResultId}/debug/{medicineRequestItemId}")]
    public async Task<ActionResult<object>> GetDebugInfo(int requestResultId, int medicineRequestItemId)
    {
        var requestResult = await _medicineRequestService.GetRequestResultByIdAsync(requestResultId);
        if (requestResult == null)
        {
            return NotFound();
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);
        if (medicineItem == null)
        {
            return NotFound();
        }

        // Parse the data manually to see what's happening
        var administeredFrequencies = string.IsNullOrEmpty(requestResult.AdministeredFrequencies)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(requestResult.AdministeredFrequencies);

        var today = DateOnly.FromDateTime(DateTime.Today);
        var isNewDay = requestResult.CurrentDate != today;

        // Get the progress info to see what the system thinks
        var (isCompleted, pendingFrequencies) = await _medicineRequestService.GetProgressInfoAsync(requestResultId, medicineRequestItemId);

        return Ok(new
        {
            RequestResultId = requestResultId,
            MedicineRequestItemId = medicineRequestItemId,
            CurrentDate = requestResult.CurrentDate,
            Today = today,
            IsNewDay = isNewDay,
            CurrentDayCount = requestResult.CurrentDayCount,
            AdministeredFrequencies = administeredFrequencies,
            AdministeredFrequenciesJson = requestResult.AdministeredFrequencies,
            MedicineFrequency = medicineItem.Frequency,
            MedicineTimeOfDay = medicineItem.TimeOfDay,
            Status = requestResult.Status,
            TimesPerDay = requestResult.TimesPerDay,
            
            // Progress calculation details
            IsCompleted = isCompleted,
            PendingFrequencies = pendingFrequencies,
            
            // Additional debugging info
            RequestCreatedAt = requestResult.SubmittedAt,
            RequestStatus = requestResult.Request?.Status,
            MedicineRequestId = requestResult.RequestId
        });
    }

    // DEBUG: GET: api/MedicineRequest/debug/student/{studentCode}
    [HttpGet("debug/student/{studentCode}")]
    public async Task<IActionResult> DebugStudent(string studentCode)
    {
        try
        {
            var student = await _medicineRequestService.GetGradeByStudentCodeAsync(studentCode);
            
            // Get raw student data for debugging
            var studentData = new
            {
                studentCode = studentCode,
                found = student.HasValue,
                grade = student,
                message = student.HasValue ? $"Student found with grade {student}" : "Student not found or no grade"
            };
            
            return Ok(studentData);
        }
        catch (Exception ex)
        {
            return Ok(new
            {
                studentCode = studentCode,
                found = false,
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    // POST: api/MedicineRequest/item/{itemId}/verify
    [HttpPost("item/{itemId}/verify")]
    public async Task<IActionResult> VerifyMedicineRequestItem(int itemId, [FromBody] PeriodActionDto dto)
    {
        if (string.IsNullOrEmpty(dto?.Period)) return BadRequest("Period is required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(itemId);
        if (item == null) return NotFound();
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        // Set verified status with staff and timestamp
        periodStatus[dto.Period] = System.Text.Json.JsonSerializer.Serialize(new {
            Status = "Verified",
            StaffId = (int?)null, // Optionally, get staffId from context or dto
            Timestamp = DateTime.UtcNow
        });
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // POST: api/MedicineRequest/item/{itemId}/refuse
    [HttpPost("item/{itemId}/refuse")]
    public async Task<IActionResult> RefuseMedicineRequestItem(int itemId, [FromBody] PeriodActionDto dto)
    {
        if (string.IsNullOrEmpty(dto?.Period)) return BadRequest("Period is required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(itemId);
        if (item == null) return NotFound();
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        // Set refused status with staff, reason, and timestamp
        periodStatus[dto.Period] = System.Text.Json.JsonSerializer.Serialize(new {
            Status = "Refused",
            StaffId = dto.StaffId,
            RefusalReason = dto.RefusalReason,
            Timestamp = DateTime.UtcNow
        });
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // POST: api/MedicineRequest/{id}/set-status-verified
    [HttpPost("{id}/set-status-verified")]
    public async Task<IActionResult> SetStatusVerified(int id)
    {
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (request == null) return NotFound();
        request.Status = "Verified";
        var success = await _medicineRequestService.UpdateMedicineRequestAsync(request);
        if (!success) return BadRequest("Failed to update status.");
        return NoContent();
    }

    // Helper for JSON parsing
    private static Dictionary<string, string> ParsePeriodVerificationStatus(string? json, string? period = null)
    {
        if (string.IsNullOrEmpty(json)) return new Dictionary<string, string>();
        try
        {
            var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(period) && dict.ContainsKey(period))
            {
                dict[period] = "Assigned"; // Ensure it's "Assigned" for the specific period
            }
            return dict;
        }
        catch
        {
            return new Dictionary<string, string>();
        }
    }

    // Helper to get or create a status history array for a period
    private static List<Dictionary<string, object>> GetStatusHistory(Dictionary<string, object> periodStatus, string period)
    {
        if (periodStatus.TryGetValue(period, out var val))
        {
            if (val is string strVal && strVal.StartsWith("["))
            {
                return System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(strVal) ?? new List<Dictionary<string, object>>();
            }
            else if (val is string strVal2 && strVal2.StartsWith("{"))
            {
                // Legacy: single object, convert to array
                var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(strVal2);
                return obj != null ? new List<Dictionary<string, object>> { obj } : new List<Dictionary<string, object>>();
            }
            else if (val is System.Text.Json.JsonElement elem && elem.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                return System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(elem.GetRawText()) ?? new List<Dictionary<string, object>>();
            }
            else if (val is System.Text.Json.JsonElement elem2 && elem2.ValueKind == System.Text.Json.JsonValueKind.Object)
            {
                var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(elem2.GetRawText());
                return obj != null ? new List<Dictionary<string, object>> { obj } : new List<Dictionary<string, object>>();
            }
        }
        return new List<Dictionary<string, object>>();
    }

    // Restore GET: api/MedicineRequest/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicineRequestDto.ViewModel>> GetMedicineRequest(int id)
    {
        var medicineRequest = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (medicineRequest == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<MedicineRequestDto.ViewModel>(medicineRequest);
        return Ok(viewModel);
    }
} 