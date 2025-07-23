using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckFormController : ControllerBase
{
    private readonly IHealthCheckFormService _healthCheckFormService;
    private readonly IMapper _mapper;
    private readonly ILogger<HealthCheckFormController> _logger;

    public HealthCheckFormController(
        IHealthCheckFormService healthCheckFormService, 
        IMapper mapper,
        ILogger<HealthCheckFormController> logger)
    {
        _healthCheckFormService = healthCheckFormService;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetAllHealthCheckForms()
    {
        var forms = await _healthCheckFormService.GetAllHealthCheckFormsAsync();
        return Ok(_mapper.Map<IEnumerable<HealthCheckFormDTO>>(forms));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthCheckFormDTO>> GetHealthCheckFormById(int id)
    {
        var form = await _healthCheckFormService.GetHealthCheckFormByIdAsync(id);
        if (form == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthCheckFormDTO>(form));
    }

    [HttpPost]
    public async Task<ActionResult<HealthCheckFormDTO>> CreateHealthCheckForm(HealthCheckFormDTO formDto)
    {
        // Validate model state
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid model state for HealthCheckForm creation: {Errors}", 
                string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
            return BadRequest(ModelState);
        }

        try
        {
            _logger.LogInformation("Creating HealthCheckForm with Title: {Title}", formDto.Title);
            
            // Set default values for new fields
            if (formDto.CreatedDate == null)
                formDto.CreatedDate = DateTime.Now;
            
            if (string.IsNullOrEmpty(formDto.Status))
                formDto.Status = "Scheduled";
            
            var form = _mapper.Map<HealthCheckForm>(formDto);
            var createdForm = await _healthCheckFormService.CreateHealthCheckFormAsync(form);
            
            _logger.LogInformation("HealthCheckForm created successfully with ID: {FormId}", createdForm.FormId);
            
            return CreatedAtAction(
                nameof(GetHealthCheckFormById),
                new { id = createdForm.FormId },
                _mapper.Map<HealthCheckFormDTO>(createdForm));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating HealthCheckForm with Title: {Title}", formDto.Title);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckForm with Title: {Title}", formDto.Title);
            return StatusCode(500, new { error = "An unexpected error occurred while creating the health check form." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthCheckForm(int id, HealthCheckFormDTO formDto)
    {
        if (id != formDto.FormId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var form = _mapper.Map<HealthCheckForm>(formDto);
            var success = await _healthCheckFormService.UpdateHealthCheckFormAsync(form);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHealthCheckForm(int id)
    {
        var success = await _healthCheckFormService.DeleteHealthCheckFormAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetHealthCheckFormsByStudentId(int studentId)
    {
        var forms = await _healthCheckFormService.GetHealthCheckFormsByStudentIdAsync(studentId);
        return Ok(_mapper.Map<IEnumerable<HealthCheckFormDTO>>(forms));
    }

    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetHealthCheckFormsByParentId(int parentId)
    {
        var forms = await _healthCheckFormService.GetHealthCheckFormsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<HealthCheckFormDTO>>(forms));
    }

    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetHealthCheckFormsByStatus(string status)
    {
        try
        {
            var forms = await _healthCheckFormService.GetHealthCheckFormsByStatusAsync(status);
            return Ok(_mapper.Map<IEnumerable<HealthCheckFormDTO>>(forms));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // New endpoints for health check scheduling
    [HttpGet("schedules")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesAsync();
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving health check schedules." });
        }
    }

    // NEW: Get health check schedules for current nurse's assigned grades only
    [HttpGet("schedules/my-schedules")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetMyHealthCheckSchedules(
        [FromServices] IStaffService staffService)
    {
        try
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
                return Forbid("Only nurses can access their assigned health check schedules");
            }

            // Get nurse's assigned grades
            var gradeNurses = await staffService.GetGradeNursesByStaffIdAsync(staffId);
            var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();

            if (!assignedGrades.Any())
            {
                return Ok(new List<HealthCheckFormDTO>()); // Return empty list if no grades assigned
            }

            // Get schedules filtered by nurse's assigned grades
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesByNurseGradesAsync(assignedGrades, staffId);
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting nurse's health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving nurse's health check schedules." });
        }
    }

    [HttpGet("schedules/{id}")]
    public async Task<ActionResult<HealthCheckFormDTO>> GetHealthCheckScheduleById(int id)
    {
        try
        {
            var schedule = await _healthCheckFormService.GetHealthCheckScheduleByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }
            
            var dto = _mapper.Map<HealthCheckFormDTO>(schedule);
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt", 
                    "scheduled" => "Đã lên lịch",
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Convert all status fields to Vietnamese
            dto.Status = ConvertStatusToVietnamese(dto.Status);
            dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
            dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
            // Parse gradeIds (JSON string) thành mảng grades
            if (!string.IsNullOrEmpty(dto.GradeIds))
            {
                try
                {
                    dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                }
                catch
                {
                    dto.Grades = new List<string>();
                }
            }
            else
            {
                dto.Grades = new List<string>();
            }
            
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting health check schedule with ID: {Id}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the health check schedule." });
        }
    }

    [HttpPost("schedules")]
    public async Task<ActionResult<HealthCheckFormDTO>> CreateHealthCheckSchedule(HealthCheckFormDTO scheduleDto)
    {
        // Debug logging - log the raw request
        _logger.LogInformation("=== DEBUG: Raw request received ===");
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("ScheduledDate: {Date}", scheduleDto.ScheduledDate);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        _logger.LogInformation("Description: {Description}", scheduleDto.Description);
        _logger.LogInformation("Location: {Location}", scheduleDto.Location);
        _logger.LogInformation("Status from frontend: {Status}", scheduleDto.Status);
        Console.WriteLine($"CONTROLLER RECEIVED: Status = '{scheduleDto.Status}'");
        
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid model state for HealthCheckSchedule creation:");
            foreach (var error in ModelState)
            {
                _logger.LogWarning("Field {Field}: {Errors}", error.Key, 
                    string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage)));
            }
            return BadRequest(new { 
                error = "Validation failed", 
                details = ModelState.Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(k => k.Key, v => v.Value.Errors.Select(e => e.ErrorMessage))
            });
        }

        try
        {
            _logger.LogInformation("Creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            _logger.LogInformation("Received data - Title: {Title}, ScheduledDate: {Date}, StartTime: {StartTime}, GradeIds: {GradeIds}", 
                scheduleDto.Title, scheduleDto.ScheduledDate, scheduleDto.StartTime, scheduleDto.GradeIds);
            
            // Validate required fields
            if (string.IsNullOrEmpty(scheduleDto.Title))
                return BadRequest(new { error = "Title is required" });
            
            if (scheduleDto.ScheduledDate == null)
                return BadRequest(new { error = "Scheduled date is required" });
            
            // Check if GradeIds is empty or contains only empty array
            if (string.IsNullOrEmpty(scheduleDto.GradeIds) || scheduleDto.GradeIds.Trim() == "[]")
                return BadRequest(new { error = "At least one grade must be selected" });

            // Set CreatedBy to current user if authenticated (for permission validation)
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int staffId))
            {
                scheduleDto.CreatedBy = staffId;
                
                // Additional validation for nurses - they can only create schedules for their assigned grades
                var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
                if (roleClaim != null && roleClaim.Value.ToLower() == "nurse")
                {
                    // This validation will be done in the service layer
                    _logger.LogInformation("Nurse {StaffId} attempting to create schedule for grades: {GradeIds}", staffId, scheduleDto.GradeIds);
                }
            }

            // Set default values
            scheduleDto.CreatedDate = DateTime.Now;
            // Keep the status from frontend, only set default if empty
            if (string.IsNullOrEmpty(scheduleDto.Status))
                scheduleDto.Status = "pending";
            
            _logger.LogInformation("Final Status after processing: {Status}", scheduleDto.Status);
            Console.WriteLine($"CONTROLLER SENDING TO SERVICE: Status = '{scheduleDto.Status}'");

            // Convert StartTime from string to TimeSpan for mapping
            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            if (!string.IsNullOrEmpty(scheduleDto.StartTime))
            {
                if (TimeSpan.TryParse(scheduleDto.StartTime, out var startTime))
                {
                    schedule.StartTime = startTime;
                }
                else
                {
                    return BadRequest(new { error = "Invalid start time format. Expected HH:mm:ss" });
                }
            }
            var createdSchedule = await _healthCheckFormService.CreateHealthCheckScheduleAsync(schedule);
            
            _logger.LogInformation("HealthCheckSchedule created successfully with ID: {FormId}", createdSchedule.FormId);
            
            // FINAL DEBUG - CHECK WHAT WE'RE RETURNING
            var responseDto = _mapper.Map<HealthCheckFormDTO>(createdSchedule);
            Console.WriteLine($"MAPPED RESPONSE DTO: Status = '{responseDto.Status}'");
            Console.WriteLine($"ORIGINAL ENTITY: Status = '{createdSchedule.Status}'");
            
            return CreatedAtAction(
                nameof(GetHealthCheckScheduleById),
                new { id = createdSchedule.FormId },
                responseDto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            return StatusCode(500, new { error = "An unexpected error occurred while creating the health check schedule." });
        }
    }

    [HttpPut("schedules/{id}")]
    public async Task<IActionResult> UpdateHealthCheckSchedule(int id, HealthCheckFormDTO scheduleDto)
    {
        _logger.LogInformation("=== UPDATE HEALTH CHECK SCHEDULE DEBUG ===");
        _logger.LogInformation("ID from URL: {Id}", id);
        _logger.LogInformation("FormId from DTO: {FormId}", scheduleDto.FormId);
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("Status: {Status}", scheduleDto.Status);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        
        if (id != scheduleDto.FormId)
        {
            _logger.LogWarning("ID mismatch - URL ID: {UrlId}, DTO FormId: {DtoFormId}", id, scheduleDto.FormId);
            return BadRequest("ID mismatch");
        }

        try
        {
            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            _logger.LogInformation("Mapped schedule - FormId: {FormId}, Status: {Status}", schedule.FormId, schedule.Status);
            
            // Convert StartTime from string to TimeSpan for mapping
            if (!string.IsNullOrEmpty(scheduleDto.StartTime))
            {
                if (TimeSpan.TryParse(scheduleDto.StartTime, out var startTime))
                {
                    schedule.StartTime = startTime;
                    _logger.LogInformation("StartTime converted successfully: {StartTime}", startTime);
                }
                else
                {
                    _logger.LogError("Invalid start time format: {StartTime}", scheduleDto.StartTime);
                    return BadRequest(new { error = "Invalid start time format. Expected HH:mm:ss" });
                }
            }
            
            _logger.LogInformation("Calling UpdateHealthCheckScheduleAsync...");
            var success = await _healthCheckFormService.UpdateHealthCheckScheduleAsync(schedule);
            _logger.LogInformation("UpdateHealthCheckScheduleAsync result: {Success}", success);
            
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "InvalidOperationException in UpdateHealthCheckSchedule");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in UpdateHealthCheckSchedule");
            return StatusCode(500, new { error = "An unexpected error occurred while updating the health check schedule." });
        }
    }

    [HttpDelete("schedules/{id}")]
    public async Task<IActionResult> DeleteHealthCheckSchedule(int id)
    {
        var success = await _healthCheckFormService.DeleteHealthCheckScheduleAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // New endpoints for health check scheduling by status
    [HttpGet("schedules/pending")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetPendingHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesByConfirmStatusAsync("pending");
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving pending health check schedules." });
        }
    }

    [HttpGet("schedules/approved")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetApprovedHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesByConfirmStatusAsync("approved");
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting approved health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving approved health check schedules." });
        }
    }

    [HttpGet("schedules/rejected")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetRejectedHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesByConfirmStatusAsync("rejected");
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting rejected health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving rejected health check schedules." });
        }
    }

    [HttpGet("schedules/completed")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetCompletedHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesByStatusAsync("completed");
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            
            // Helper method to convert status to Vietnamese
            string ConvertStatusToVietnamese(string status)
            {
                if (string.IsNullOrEmpty(status)) return "Chưa xác định";
                
                return status.ToLower() switch
                {
                    "pending" => "Chờ duyệt",
                    "approved" => "Đã duyệt",
                    "scheduled" => "Đã lên lịch", 
                    "active" => "Đang thực hiện",
                    "completed" => "Đã hoàn thành",
                    "cancelled" => "Đã hủy",
                    "rejected" => "Đã từ chối",
                    _ => status
                };
            }
            
            // Map status sang tiếng Việt và parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                // Convert all status fields to Vietnamese
                dto.Status = ConvertStatusToVietnamese(dto.Status);
                dto.ConsentStatus = ConvertStatusToVietnamese(dto.ConsentStatus);
                dto.ConfirmStatus = ConvertStatusToVietnamese(dto.ConfirmStatus);
                
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting completed health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving completed health check schedules." });
        }
    }

    // Debug endpoint to test DTO binding
    [HttpPost("debug/test")]
    public ActionResult TestDTOBinding(HealthCheckFormDTO scheduleDto)
    {
        _logger.LogInformation("=== DEBUG TEST ENDPOINT ===");
        _logger.LogInformation("Raw JSON received and parsed successfully");
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("ScheduledDate: {Date}", scheduleDto.ScheduledDate);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        
        return Ok(new { 
            message = "DTO binding successful",
            receivedData = scheduleDto,
            modelStateValid = ModelState.IsValid,
            modelStateErrors = ModelState.Where(x => x.Value.Errors.Count > 0)
                .ToDictionary(k => k.Key, v => v.Value.Errors.Select(e => e.ErrorMessage))
        });
    }

    // Helper endpoints for frontend data
    [HttpGet("grades")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableGrades()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var grades = new[]
            {
                new { id = "1A", name = "Lớp 1A", totalStudents = 28 },
                new { id = "1B", name = "Lớp 1B", totalStudents = 30 },
                new { id = "2A", name = "Lớp 2A", totalStudents = 29 },
                new { id = "2B", name = "Lớp 2B", totalStudents = 31 },
                new { id = "3A", name = "Lớp 3A", totalStudents = 32 },
                new { id = "3B", name = "Lớp 3B", totalStudents = 29 },
                new { id = "3C", name = "Lớp 3C", totalStudents = 27 },
            };
            return Ok(grades);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available grades");
            return StatusCode(500, new { error = "An error occurred while retrieving grades." });
        }
    }

    [HttpGet("stations")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableStations()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var stations = new[]
            {
                new { 
                    id = "height-weight", 
                    name = "Đo chiều cao, cân nặng", 
                    estimatedTime = "5", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "vision", 
                    name = "Kiểm tra thị lực", 
                    estimatedTime = "3", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "general", 
                    name = "Khám tổng quát", 
                    estimatedTime = "7", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "dental", 
                    name = "Khám răng miệng", 
                    estimatedTime = "4", 
                    staffRequired = 1, 
                    required = false 
                },
                new { 
                    id = "blood-pressure", 
                    name = "Đo huyết áp", 
                    estimatedTime = "3", 
                    staffRequired = 1, 
                    required = false 
                },
                new { 
                    id = "hearing", 
                    name = "Kiểm tra thính lực", 
                    estimatedTime = "5", 
                    staffRequired = 1, 
                    required = false 
                },
            };
            return Ok(stations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available stations");
            return StatusCode(500, new { error = "An error occurred while retrieving stations." });
        }
    }

    [HttpGet("staff")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableStaff()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var staff = new[]
            {
                new { id = 1, name = "Y tá Hương", specialization = "Nhi khoa", available = true },
                new { id = 2, name = "Y tá Mai", specialization = "Tổng quát", available = true },
                new { id = 3, name = "Y tá Lan", specialization = "Nhi khoa", available = true },
                new { id = 4, name = "Bác sĩ Tuấn", specialization = "Tổng quát", available = true },
                new { id = 5, name = "Y tá Hoa", specialization = "Răng hàm mặt", available = false },
            };
            return Ok(staff);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available staff");
            return StatusCode(500, new { error = "An error occurred while retrieving staff." });
        }
    }
} 