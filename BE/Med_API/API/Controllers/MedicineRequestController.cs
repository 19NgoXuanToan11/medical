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
    private readonly IStaffService _staffService;

    public MedicineRequestController(IMapper mapper, IMedicineRequestService medicineRequestService, ILogger<MedicineRequestController> logger, IStaffService staffService)
    {
        _mapper = mapper;
        _medicineRequestService = medicineRequestService;
        _logger = logger;
        _staffService = staffService;
    }

    // GET: api/MedicineRequest
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequests([FromQuery] int? staffId = null)
    {
        _logger.LogInformation("GetMedicineRequests called with staffId: {StaffId}", staffId);
        
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            _logger.LogInformation("Getting requests for staffId: {StaffId}", staffId.Value);
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
            _logger.LogInformation("Found {Count} requests for staffId {StaffId}", requests.Count(), staffId.Value);
        }
        else
        {
            _logger.LogInformation("Getting all requests (no staffId filter)");
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
            _logger.LogInformation("Found {Count} total requests", requests.Count());
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        _logger.LogInformation("Returning {Count} view models", viewModels.Count());
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/student/{studentCode}
    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStudent(string studentCode, [FromQuery] int? staffId = null)
    {
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            // Get all requests for the student first, then filter by staff's assigned grades
            var allStudentRequests = await _medicineRequestService.GetMedicineRequestsByStudentCodeAsync(studentCode);
            var staffRequests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
            
            // Get the intersection of student requests and staff's assigned grade requests
            var studentRequestIds = allStudentRequests.Select(r => r.RequestId).ToHashSet();
            requests = staffRequests.Where(r => studentRequestIds.Contains(r.RequestId));
        }
        else
        {
            requests = await _medicineRequestService.GetMedicineRequestsByStudentCodeAsync(studentCode);
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/status/{status}
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<object>>> GetMedicineRequestsByStatus(string status, [FromQuery] int? staffId = null)
    {
        _logger.LogInformation("GET /status/{Status} endpoint hit!", status);
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetMedicineRequestsByStatusAsync(status);
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        
        var statusItems = new List<dynamic>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                var periodStatus = item.PeriodVerificationStatus;
                if (periodStatus == null) continue;
                
                foreach (var kv in periodStatus)
                {
                    string currentStatus = null;
                    int? staffIdValue = null;
                    DateTime? timestamp = null;
                    string? refusalReason = null;
                    string? failureReason = null;
                    string? notes = null;
                    bool? isReRequest = null;
                    
                    var val = kv.Value;
                    if (val == null) continue;
                    
                    var valStr = val.ToString();
                    if (valStr.Equals(status, StringComparison.OrdinalIgnoreCase)) 
                    {
                        currentStatus = status;
                    }
                    else if (valStr.StartsWith("{") && valStr.Contains($"\"Status\":\"{status}\"", StringComparison.OrdinalIgnoreCase)) 
                    {
                        currentStatus = status;
                        // Try to extract additional info from the JSON string
                        try
                        {
                            var jsonObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(valStr);
                            if (jsonObj.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (jsonObj.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                            if (jsonObj.TryGetProperty("RefusalReason", out var refusalReasonProp) && refusalReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                refusalReason = refusalReasonProp.GetString();
                            if (jsonObj.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                failureReason = failureReasonProp.GetString();
                            if (jsonObj.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                notes = notesProp.GetString();
                            if (jsonObj.TryGetProperty("IsReRequest", out var isReRequestProp) && isReRequestProp.ValueKind == System.Text.Json.JsonValueKind.True)
                                isReRequest = isReRequestProp.GetBoolean();
                        }
                        catch { }
                    }
                    else if (val is System.Text.Json.JsonElement elem)
                    {
                        if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && elem.TryGetProperty("Status", out var statusProp) && statusProp.GetString()?.Equals(status, StringComparison.OrdinalIgnoreCase) == true)
                        {
                            currentStatus = status;
                            // Extract additional info from the JSON object
                            if (elem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (elem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                            if (elem.TryGetProperty("RefusalReason", out var refusalReasonProp) && refusalReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                refusalReason = refusalReasonProp.GetString();
                            if (elem.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                failureReason = failureReasonProp.GetString();
                            if (elem.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                notes = notesProp.GetString();
                            if (elem.TryGetProperty("IsReRequest", out var isReRequestProp) && isReRequestProp.ValueKind == System.Text.Json.JsonValueKind.True)
                                isReRequest = isReRequestProp.GetBoolean();
                        }
                        else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var arrElem in elem.EnumerateArray())
                            {
                                if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && arrElem.TryGetProperty("Status", out var arrStatusProp) && arrStatusProp.GetString()?.Equals(status, StringComparison.OrdinalIgnoreCase) == true)
                                {
                                    currentStatus = status;
                                    // Extract additional info from the array element
                                    if (arrElem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                        staffIdValue = staffIdProp.GetInt32();
                                    if (arrElem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        timestamp = timestampProp.GetDateTime();
                                    if (arrElem.TryGetProperty("RefusalReason", out var refusalReasonProp) && refusalReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        refusalReason = refusalReasonProp.GetString();
                                    if (arrElem.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        failureReason = failureReasonProp.GetString();
                                    if (arrElem.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        notes = notesProp.GetString();
                                    if (arrElem.TryGetProperty("IsReRequest", out var isReRequestProp) && isReRequestProp.ValueKind == System.Text.Json.JsonValueKind.True)
                                        isReRequest = isReRequestProp.GetBoolean();
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (currentStatus != null)
                    {
                        statusItems.Add(new {
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
                            DosageUnit = item.DosageUnit,
                            Frequency = item.Frequency,
                            TimeOfDay = item.TimeOfDay,
                            Instructions = item.Instructions,
                            Period = kv.Key,
                            Status = currentStatus,
                            StaffId = staffIdValue,
                            Timestamp = timestamp,
                            RefusalReason = refusalReason,
                            FailureReason = failureReason,
                            Notes = notes,
                            IsReRequest = isReRequest
                        });
                    }
                }
            }
        }
        
        // Debug log after filtering
        _logger.LogInformation("[STATUS] Found {Count} items with status '{Status}'", statusItems.Count, status);
        
        return Ok(statusItems);
    }

    // GET: api/MedicineRequest/available-nurses
    [HttpGet("available-nurses")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableNurses()
    {
        var nurses = await _medicineRequestService.GetAvailableNursesAsync();
        // Include all active nurses, with or without grade assignments
        var filtered = nurses.Where(n => n.IsActiveForRequest).ToList();
        var result = filtered.Select(n => new {
            n.StaffId,
            n.FirstName,
            n.LastName,
            n.Username,
            n.Email,
            n.Phone,
            n.IsActiveForRequest,
            AssignedGrades = n.GradeNurses?.Select(g => g.Grade).ToList() ?? new List<int>()
        });
        return Ok(result);
    }

    // GET: api/MedicineRequest/pending
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetPendingRequests([FromQuery] int? staffId = null)
    {
        _logger.LogInformation("GET /pending endpoint hit!");
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetPendingRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        
        // Filter based on PeriodVerificationStatus instead of main request status
        foreach (var req in viewModels)
        {
            req.MedicineRequestItems = req.MedicineRequestItems
                .Where(item => item.PeriodVerificationStatus != null &&
                    item.PeriodVerificationStatus.Values.Any(val => 
                    {
                        if (val == null) return false;
                        var valStr = val.ToString();
                        if (valStr.Equals("Pending", StringComparison.OrdinalIgnoreCase)) return true;
                        if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Pending\"", StringComparison.OrdinalIgnoreCase)) return true;
                        if (val is System.Text.Json.JsonElement elem)
                        {
                            if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && elem.TryGetProperty("Status", out var statusProp) && statusProp.GetString()?.Equals("Pending", StringComparison.OrdinalIgnoreCase) == true)
                                return true;
                            else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                            {
                                foreach (var arrElem in elem.EnumerateArray())
                                {
                                    if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && arrElem.TryGetProperty("Status", out var arrStatusProp) && arrStatusProp.GetString()?.Equals("Pending", StringComparison.OrdinalIgnoreCase) == true)
                                        return true;
                                }
                            }
                        }
                        return false;
                    })
                ).ToList();
        }
        
        // Remove requests that have no matching items
        viewModels = viewModels.Where(req => req.MedicineRequestItems.Any()).ToList();
        
        // Debug log after filtering
        foreach (var req in viewModels)
        {
            _logger.LogInformation("[PENDING] API Response: RequestId: {RequestId}, Status: {Status}, ItemCount: {ItemCount}", req.RequestId, req.Status, req.MedicineRequestItems.Count);
        }
        
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

        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (!grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(staffId, grade.Value))
            return Forbid("You are not assigned to this grade.");



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

    

    



    public class PeriodActionDto
    {
        public string Period { get; set; } = null!;
        public int? StaffId { get; set; }
    }

    public class RefuseActionDto
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


    // POST: api/MedicineRequest/update-time-based-status
    [HttpPost("update-time-based-status")]
    public async Task<ActionResult<object>> UpdateTimeBasedStatus()
    {
        _logger.LogInformation("POST /update-time-based-status endpoint hit!");
        
        try
        {
            var currentTime = DateTime.Now;
            var currentHour = currentTime.Hour;
            var currentDate = DateOnly.FromDateTime(currentTime.Date);
            
            _logger.LogInformation("Current time: {CurrentTime}, Hour: {Hour}", currentTime, currentHour);
            
            // Get all medicine requests with their items
            var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
            var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
            
            var updatedItems = new List<object>();
            var autoFailedItems = new List<object>();
            
            foreach (var req in viewModels)
            {
                foreach (var item in req.MedicineRequestItems)
                {
                    if (item.PeriodVerificationStatus == null) continue;
                    
                    var updatedPeriods = new List<string>();
                    var failedPeriods = new List<string>();
                    
                    foreach (var kv in item.PeriodVerificationStatus)
                    {
                        var period = kv.Key;
                        var val = kv.Value;
                        
                        // Determine if this period should be auto-failed based on time
                        bool shouldAutoFail = ShouldAutoFailPeriod(period, currentHour, currentDate);
                        
                        if (shouldAutoFail)
                        {
                            // Check if the period is still in "Pending" status
                            bool isPending = IsPeriodPending(val);
                            
                            if (isPending)
                            {
                                // Auto-fail this period
                                var updatedStatus = UpdatePeriodStatusToFailed(val, currentTime);
                                item.PeriodVerificationStatus[kv.Key] = updatedStatus;
                                
                                failedPeriods.Add(period);
                                autoFailedItems.Add(new
                                {
                                    RequestId = req.RequestId,
                                    ItemId = item.MedicineRequestItemId,
                                    Period = period,
                                    Reason = "Auto-failed due to time expiration",
                                    Timestamp = currentTime
                                });
                                
                                _logger.LogInformation("Auto-failed period {Period} for RequestId {RequestId}, ItemId {ItemId}", 
                                    period, req.RequestId, item.MedicineRequestItemId);
                            }
                        }
                        
                        if (failedPeriods.Any())
                        {
                            updatedPeriods.AddRange(failedPeriods);
                        }
                    }
                    
                    if (updatedPeriods.Any())
                    {
                        // Update the item in the database
                        var dbItem = await _medicineRequestService.GetMedicineRequestItemByIdAsync(item.MedicineRequestItemId);
                        if (dbItem != null)
                        {
                            dbItem.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(item.PeriodVerificationStatus);
                            await _medicineRequestService.UpdateMedicineRequestItemAsync(dbItem);
                            
                            updatedItems.Add(new
                            {
                                RequestId = req.RequestId,
                                ItemId = item.MedicineRequestItemId,
                                UpdatedPeriods = updatedPeriods,
                                Timestamp = currentTime
                            });
                        }
                    }
                }
            }
            
            // Also run the original time-based status update for RequestResults
            var originalUpdated = await _medicineRequestService.UpdateTimeBasedStatusAsync();
            
            var result = new
            {
                success = true,
                message = "Time-based status update completed",
                currentTime = currentTime,
                updatedItemsCount = updatedItems.Count,
                autoFailedItemsCount = autoFailedItems.Count,
                originalUpdateResult = originalUpdated,
                updatedItems = updatedItems,
                autoFailedItems = autoFailedItems
            };
            
            _logger.LogInformation("Time-based status update completed. Updated {UpdatedCount} items, Auto-failed {FailedCount} periods", 
                updatedItems.Count, autoFailedItems.Count);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during time-based status update");
            return StatusCode(500, new { success = false, message = "Error during time-based status update", error = ex.Message });
        }
    }
    
    private static bool ShouldAutoFailPeriod(string period, int currentHour, DateOnly currentDate)
    {
        // Define time windows for each period
        var periodTimeWindows = new Dictionary<string, (int startHour, int endHour)>
        {
            { "Sáng", (6, 11) },    // 6 AM - 11 AM
            { "Trưa", (11, 14) },   // 11 AM - 2 PM
            { "Chiều", (14, 18) }   // 2 PM - 6 PM
        };
        
        if (!periodTimeWindows.ContainsKey(period))
            return false;
            
        var (startHour, endHour) = periodTimeWindows[period];
        
        // If current time is past the end hour of this period, it should be auto-failed
        return currentHour > endHour;
    }
    
    private static bool IsPeriodPending(object val)
    {
        if (val == null) return false;
        
        var valStr = val.ToString();
        if (valStr == "Pending") return true;
        
        if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Pending\"")) return true;
        
        if (val is System.Text.Json.JsonElement elem)
        {
            if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && 
                elem.TryGetProperty("Status", out var statusProp) && 
                statusProp.GetString() == "Pending")
                return true;
                
            if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                foreach (var arrElem in elem.EnumerateArray())
                {
                    if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && 
                        arrElem.TryGetProperty("Status", out var arrStatusProp) && 
                        arrStatusProp.GetString() == "Pending")
                        return true;
                }
            }
        }
        
        return false;
    }
    
    private static object UpdatePeriodStatusToFailed(object currentVal, DateTime timestamp)
    {
        var failedStatus = new
        {
            Status = "Failed",
            StaffId = (int?)null,
            Timestamp = timestamp,
            FailureReason = "Auto-failed due to time expiration",
            Notes = "Automatically marked as failed by system"
        };
        
        // If current value is a simple string, convert to object
        if (currentVal is string strVal && strVal == "Pending")
        {
            return failedStatus;
        }
        
        // If current value is a JSON string, parse and update
        if (currentVal is string jsonStr && jsonStr.StartsWith("{"))
        {
            try
            {
                var jsonObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(jsonStr);
                if (jsonObj.ValueKind == System.Text.Json.JsonValueKind.Object)
                {
                    return failedStatus;
                }
            }
            catch { }
        }
        
        // If current value is a JsonElement object, return the failed status
        if (currentVal is System.Text.Json.JsonElement elem && elem.ValueKind == System.Text.Json.JsonValueKind.Object)
        {
            return failedStatus;
        }
        
        // If current value is an array, add the failed status to the array
        if (currentVal is System.Text.Json.JsonElement arrayElem && arrayElem.ValueKind == System.Text.Json.JsonValueKind.Array)
        {
            var statusList = new List<object>();
            foreach (var arrElem in arrayElem.EnumerateArray())
            {
                statusList.Add(arrElem);
            }
            statusList.Add(failedStatus);
            return statusList;
        }
        
        // Default fallback
        return failedStatus;
    }

   

    // Helper to extract periods from frequency (same logic as in mapping profile)
    private static List<string> ExtractPeriodsFromFrequency(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency)) return new List<string>();
        var periods = new[] { "Sáng", "Trưa", "Chiều" };
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
        if (frequency.Contains("1")) return new List<string> { "Sáng" };
        return new List<string>();
    }

    // GET: api/MedicineRequest/failed
    [HttpGet("failed")]
    public async Task<ActionResult<IEnumerable<object>>> GetFailedRequests([FromQuery] string? period = null, [FromQuery] int? staffId = null)
    {
        _logger.LogInformation("GET /failed endpoint hit!");
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        
        // Debug log before filtering
        foreach (var req in viewModels)
        {
            _logger.LogInformation("[FAILED][BEFORE] RequestId: {RequestId}, Status: {Status}", req.RequestId, req.Status);
            foreach (var item in req.MedicineRequestItems)
            {
                _logger.LogInformation("[FAILED][BEFORE] ItemId: {ItemId}, PeriodVerificationStatus: {Status}", item.MedicineRequestItemId, System.Text.Json.JsonSerializer.Serialize(item.PeriodVerificationStatus));
            }
        }
        
        var failedItems = new List<dynamic>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                var periodStatus = item.PeriodVerificationStatus;
                if (periodStatus == null) continue;
                
                foreach (var kv in periodStatus)
                {
                    string status = null;
                    int? staffIdValue = null;
                    DateTime? timestamp = null;
                    string? failureReason = null;
                    string? notes = null;
                    
                    var val = kv.Value;
                    if (val == null) continue;
                    
                    var valStr = val.ToString();
                    if (valStr == "Failed") 
                    {
                        status = "Failed";
                    }
                    else if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Failed\"")) 
                    {
                        status = "Failed";
                        // Try to extract additional info from the JSON string
                        try
                        {
                            var jsonObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(valStr);
                            if (jsonObj.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (jsonObj.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                            if (jsonObj.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                failureReason = failureReasonProp.GetString();
                            if (jsonObj.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                notes = notesProp.GetString();
                        }
                        catch { }
                    }
                    else if (val is System.Text.Json.JsonElement elem)
                    {
                        if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && elem.TryGetProperty("Status", out var statusProp) && statusProp.GetString() == "Failed")
                        {
                            status = "Failed";
                            // Extract additional info from the JSON object
                            if (elem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (elem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                            if (elem.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                failureReason = failureReasonProp.GetString();
                            if (elem.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                notes = notesProp.GetString();
                        }
                        else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var arrElem in elem.EnumerateArray())
                            {
                                if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && arrElem.TryGetProperty("Status", out var arrStatusProp) && arrStatusProp.GetString() == "Failed")
                                {
                                    status = "Failed";
                                    // Extract additional info from the array element
                                    if (arrElem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                        staffIdValue = staffIdProp.GetInt32();
                                    if (arrElem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        timestamp = timestampProp.GetDateTime();
                                    if (arrElem.TryGetProperty("FailureReason", out var failureReasonProp) && failureReasonProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        failureReason = failureReasonProp.GetString();
                                    if (arrElem.TryGetProperty("Notes", out var notesProp) && notesProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        notes = notesProp.GetString();
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (status == "Failed" && (string.IsNullOrEmpty(period) || string.Equals(kv.Key, period, StringComparison.OrdinalIgnoreCase)))
                    {
                        failedItems.Add(new {
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
                            DosageUnit = item.DosageUnit,
                            Frequency = item.Frequency,
                            TimeOfDay = item.TimeOfDay,
                            Instructions = item.Instructions,
                            Period = kv.Key,
                            FailedStatus = status,
                            FailedStaffId = staffIdValue,
                            FailedTimestamp = timestamp,
                            FailureReason = failureReason,
                            Notes = notes
                        });
                    }
                }
            }
        }
        
        // Debug log after filtering
        _logger.LogInformation("[FAILED][AFTER] Found {Count} failed items", failedItems.Count);
        
        return Ok(failedItems);
    }

    // GET: api/MedicineRequest/verified
    [HttpGet("verified")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetVerifiedRequests([FromQuery] string? period = null, [FromQuery] int? staffId = null)
    {
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
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
        
        // Helper function to check if a value represents "Verified" status
        bool IsVerifiedStatus(object val)
        {
            if (val == null) return false;
            
            var valStr = val.ToString();
            if (valStr == "Verified") return true;
            
            // Check if it's a JSON string containing "Verified" status
            if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Verified\"")) return true;
            
            // Check if it's a JsonElement object
            if (val is System.Text.Json.JsonElement elem)
            {
                if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && 
                    elem.TryGetProperty("Status", out var statusProp) && 
                    statusProp.GetString() == "Verified")
                    return true;
                    
                if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    foreach (var arrElem in elem.EnumerateArray())
                    {
                        if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && 
                            arrElem.TryGetProperty("Status", out var arrStatusProp) && 
                            arrStatusProp.GetString() == "Verified")
                            return true;
                    }
                }
            }
            
            return false;
        }
        
        if (!string.IsNullOrEmpty(period))
        {
            foreach (var req in viewModels)
            {
                req.MedicineRequestItems = req.MedicineRequestItems
                    .Where(item => item.PeriodVerificationStatus != null &&
                        item.PeriodVerificationStatus.Any(kv => 
                            kv.Key.Trim().Equals(period.Trim(), StringComparison.OrdinalIgnoreCase) && 
                            IsVerifiedStatus(kv.Value)))
                    .Select(item => new MedicineRequestItemDto.ViewModel
                    {
                        MedicineRequestItemId = item.MedicineRequestItemId,
                        MedicineRequestId = item.MedicineRequestId,
                        MedicineName = item.MedicineName,
                        Dosage = item.Dosage,
                        DosageUnit = item.DosageUnit,
                        Frequency = item.Frequency,
                        TimeOfDay = item.TimeOfDay,
                        Instructions = item.Instructions,
                        Period = item.Period,
                        VerificationStatus = item.VerificationStatus,
                        PeriodVerificationStatus = item.PeriodVerificationStatus
                            .Where(kv => kv.Key.Trim().Equals(period.Trim(), StringComparison.OrdinalIgnoreCase) && IsVerifiedStatus(kv.Value))
                            .ToDictionary(kv => kv.Key, kv => kv.Value)
                    })
                    .ToList();
            }
            viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        }
        else
        {
            foreach (var req in viewModels)
            {
                req.MedicineRequestItems = req.MedicineRequestItems
                    .Where(item => item.PeriodVerificationStatus != null && 
                        item.PeriodVerificationStatus.Values.Any(val => IsVerifiedStatus(val)))
                    .Select(item => new MedicineRequestItemDto.ViewModel
                    {
                        MedicineRequestItemId = item.MedicineRequestItemId,
                        MedicineRequestId = item.MedicineRequestId,
                        MedicineName = item.MedicineName,
                        Dosage = item.Dosage,
                        DosageUnit = item.DosageUnit,
                        Frequency = item.Frequency,
                        TimeOfDay = item.TimeOfDay,
                        Instructions = item.Instructions,
                        Period = item.Period,
                        VerificationStatus = item.VerificationStatus,
                        PeriodVerificationStatus = item.PeriodVerificationStatus
                            .Where(kv => IsVerifiedStatus(kv.Value))
                            .ToDictionary(kv => kv.Key, kv => kv.Value)
                    })
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
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetRefusedRequests([FromQuery] string? period = null, [FromQuery] int? staffId = null)
    {
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
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
    public async Task<ActionResult<IEnumerable<object>>> GetAssignedRequests([FromQuery] string? period = null, [FromQuery] int? staffId = null)
    {
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);

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
                                        var staffIdValue = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
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
                                                    StaffId = staffIdValue,
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
                                            var staffIdValue = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
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
                                                        StaffId = staffIdValue,
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
                                    var staffIdValue = elem.TryGetProperty("StaffId", out var staffProp) && staffProp.ValueKind == System.Text.Json.JsonValueKind.Number
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
                                                StaffId = staffIdValue,
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
                        item.DosageUnit,
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
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null) return NotFound();
        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (!grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(staffId, grade.Value))
            return Forbid("You are not assigned to this grade.");
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
            dosageUnit = item.DosageUnit,
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
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null) return NotFound();
        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (!grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(dto.StaffId, grade.Value))
            return Forbid("You are not assigned to this grade.");
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
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null) return NotFound();
        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (!grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(staffId, grade.Value))
            return Forbid("You are not assigned to this grade.");
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
            dosageUnit = item.DosageUnit,
            frequency = item.Frequency,
            timeOfDay = item.TimeOfDay,
            instructions = item.Instructions,
            period,
            history
        });
    }

    // GET: api/MedicineRequest/completed
    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<object>>> GetCompletedItems([FromQuery] string? period = null, [FromQuery] int? staffId = null)
    {
        _logger.LogInformation("GET /completed endpoint hit!");
        IEnumerable<MedicineRequest> requests;
        if (staffId.HasValue)
        {
            requests = await _medicineRequestService.GetMedicineRequestsByAssignedGradeAsync(staffId.Value);
        }
        else
        {
            requests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        }
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        // Debug log before filtering
        foreach (var req in viewModels)
        {
            _logger.LogInformation("[COMPLETED][BEFORE] RequestId: {RequestId}, Status: {Status}", req.RequestId, req.Status);
            foreach (var item in req.MedicineRequestItems)
            {
                _logger.LogInformation("[COMPLETED][BEFORE] ItemId: {ItemId}, PeriodVerificationStatus: {Status}", item.MedicineRequestItemId, System.Text.Json.JsonSerializer.Serialize(item.PeriodVerificationStatus));
            }
        }
        var completed = new List<dynamic>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                var periodStatus = item.PeriodVerificationStatus;
                if (periodStatus == null) continue;
                foreach (var kv in periodStatus)
                {
                    string status = null;
                    int? staffIdValue = null;
                    DateTime? timestamp = null;
                    var val = kv.Value;
                    if (val == null) continue;
                    var valStr = val.ToString();
                    if (valStr == "Completed") 
                    {
                        status = "Completed";
                    }
                    else if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Completed\"")) 
                    {
                        status = "Completed";
                        // Try to extract StaffId and Timestamp from the JSON string
                        try
                        {
                            var jsonObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(valStr);
                            if (jsonObj.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (jsonObj.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                        }
                        catch { }
                    }
                    else if (val is System.Text.Json.JsonElement elem)
                    {
                        if (elem.ValueKind == System.Text.Json.JsonValueKind.Object && elem.TryGetProperty("Status", out var statusProp) && statusProp.GetString() == "Completed")
                        {
                            status = "Completed";
                            // Extract StaffId and Timestamp from the JSON object
                            if (elem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                staffIdValue = staffIdProp.GetInt32();
                            if (elem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                timestamp = timestampProp.GetDateTime();
                        }
                        else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var arrElem in elem.EnumerateArray())
                            {
                                if (arrElem.ValueKind == System.Text.Json.JsonValueKind.Object && arrElem.TryGetProperty("Status", out var arrStatusProp) && arrStatusProp.GetString() == "Completed")
                                {
                                    status = "Completed";
                                    // Extract StaffId and Timestamp from the array element
                                    if (arrElem.TryGetProperty("StaffId", out var staffIdProp) && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number)
                                        staffIdValue = staffIdProp.GetInt32();
                                    if (arrElem.TryGetProperty("Timestamp", out var timestampProp) && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                        timestamp = timestampProp.GetDateTime();
                                    break;
                                }
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
                            DosageUnit = item.DosageUnit,
                            Frequency = item.Frequency,
                            TimeOfDay = item.TimeOfDay,
                            Instructions = item.Instructions,
                            Period = kv.Key,
                            VerifiedStatus = status,
                            VerifiedStaffId = staffIdValue,
                            VerifiedTimestamp = timestamp
                        });
                        // Debug log after filtering
                        _logger.LogInformation("[COMPLETED][AFTER] API Response: RequestId: {RequestId}, ItemId: {ItemId}, Period: {Period}, PeriodVerificationStatus: {Status}", req.RequestId, item.MedicineRequestItemId, kv.Key, System.Text.Json.JsonSerializer.Serialize(periodStatus));
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

    
    // POST: api/MedicineRequest/item/{itemId}/verify
    [HttpPost("item/{itemId}/verify")]
    public async Task<IActionResult> VerifyMedicineRequestItem(int itemId, [FromBody] PeriodActionDto dto)
    {
        if (string.IsNullOrEmpty(dto?.Period)) return BadRequest("Period is required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(itemId);
        if (item == null) return NotFound();
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null) return NotFound();
        var staffId = dto.StaffId ?? 0;
        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (staffId <= 0 || !grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(staffId, grade.Value))
            return Forbid("You are not assigned to this grade.");
        var periodStatus = new Dictionary<string, object>();
        try
        {
            periodStatus = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
        }
        catch { }
        // Set verified status with staff and timestamp
        periodStatus[dto.Period] = System.Text.Json.JsonSerializer.Serialize(new {
            Status = "Verified",
            StaffId = staffId,
            Timestamp = DateTime.UtcNow
        });
        item.VerificationStatus = System.Text.Json.JsonSerializer.Serialize(periodStatus);
        var success = await _medicineRequestService.UpdateMedicineRequestItemAsync(item);
        if (!success) return NotFound();
        return NoContent();
    }

    // POST: api/MedicineRequest/item/{itemId}/refuse
    [HttpPost("item/{itemId}/refuse")]
    public async Task<IActionResult> RefuseMedicineRequestItem(int itemId, [FromBody] RefuseActionDto dto)
    {
        if (string.IsNullOrEmpty(dto?.Period)) return BadRequest("Period is required.");
        var item = await _medicineRequestService.GetMedicineRequestItemByIdAsync(itemId);
        if (item == null) return NotFound();
        var request = await _medicineRequestService.GetMedicineRequestByIdAsync(item.MedicineRequestId);
        if (request == null) return NotFound();
        var staffId = dto.StaffId ?? 0;
        var grade = await _medicineRequestService.GetGradeByStudentCodeAsync(request.StudentCode);
        if (staffId <= 0 || !grade.HasValue || !await _staffService.IsNurseAssignedToGradeAsync(staffId, grade.Value))
            return Forbid("You are not assigned to this grade.");
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

    // GET: api/MedicineRequest/debug/staff/{staffId}/grades
    [HttpGet("debug/staff/{staffId}/grades")]
    public async Task<ActionResult<object>> GetStaffGradeAssignments(int staffId)
    {
        _logger.LogInformation("Checking grade assignments for staffId: {StaffId}", staffId);
        
        var gradeNurses = await _staffService.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrades = gradeNurses.Select(g => g.Grade).ToList();
        
        _logger.LogInformation("Staff {StaffId} has {Count} grade assignments: {Grades}", 
            staffId, assignedGrades.Count, string.Join(", ", assignedGrades));
        
        return Ok(new {
            StaffId = staffId,
            GradeAssignments = assignedGrades,
            GradeNurses = gradeNurses.Select(gn => new {
                GradeNurseId = gn.GradeNurseId,
                Grade = gn.Grade,
                NurseId = gn.StaffId
            })
        });
    }

    // GET: api/MedicineRequest/debug/students
    [HttpGet("debug/students")]
    public async Task<ActionResult<object>> GetStudentsWithGrades()
    {
        _logger.LogInformation("Getting all students with their grade levels");
        
        var allRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var studentsWithGrades = allRequests
            .Where(r => r.Student != null)
            .Select(r => new {
                RequestId = r.RequestId,
                StudentCode = r.StudentCode,
                StudentName = r.Student != null ? $"{r.Student.LastName} {r.Student.FirstName}" : null,
                ClassName = r.Student?.Class?.ClassName,
                GradeLevel = r.Student?.Class?.GradeLevel,
                Status = r.Status
            })
            .Distinct()
            .ToList();
        
        _logger.LogInformation("Found {Count} unique students with medicine requests", studentsWithGrades.Count);
        
        return Ok(new {
            TotalStudents = studentsWithGrades.Count,
            Students = studentsWithGrades
        });
    }
} 