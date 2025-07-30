using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InjectionFormController : ControllerBase
{
    private readonly IInjectionFormService _injectionFormService;
    private readonly IMapper _mapper;
    private readonly ILogger<InjectionFormController> _logger;

    public InjectionFormController(
        IInjectionFormService injectionFormService, 
        IMapper mapper,
        ILogger<InjectionFormController> logger)
    {
        _injectionFormService = injectionFormService;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetAllInjectionForms()
    {
        var forms = await _injectionFormService.GetAllInjectionFormsAsync();
        return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(forms));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InjectionFormDTO>> GetInjectionFormById(int id)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(id);
        if (form == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<InjectionFormDTO>(form));
    }

    [HttpPost]
    public async Task<ActionResult<InjectionFormDTO>> CreateInjectionForm(InjectionFormDTO formDto)
    {
        try
        {
            var form = _mapper.Map<InjectionForm>(formDto);
            var createdForm = await _injectionFormService.CreateInjectionFormAsync(form);
            return CreatedAtAction(
                nameof(GetInjectionFormById),
                new { id = createdForm.FormId },
                _mapper.Map<InjectionFormDTO>(createdForm));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInjectionForm(int id, InjectionFormDTO formDto)
    {
        if (id != formDto.FormId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var form = _mapper.Map<InjectionForm>(formDto);
            var success = await _injectionFormService.UpdateInjectionFormAsync(form);
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
    public async Task<IActionResult> DeleteInjectionForm(int id)
    {
        var success = await _injectionFormService.DeleteInjectionFormAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetInjectionFormsByStudentId(int studentId)
    {
        var forms = await _injectionFormService.GetInjectionFormsByStudentIdAsync(studentId);
        return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(forms));
    }

    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetInjectionFormsByParentId(int parentId)
    {
        var forms = await _injectionFormService.GetInjectionFormsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(forms));
    }

    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetInjectionFormsByStatus(string status)
    {
        try
        {
            var forms = await _injectionFormService.GetInjectionFormsByStatusAsync(status);
            return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(forms));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("approved-students")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetApprovedInjectionStudents()
    {
        var forms = await _injectionFormService.GetInjectionFormsByStatusAsync("Approved");
        return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(forms));
    }
    [HttpGet("parent-read/{formId}")]
    public async Task<ActionResult<InjectionFormDTO>> GetInjectionFormForParent(int formId)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }
        return Ok(_mapper.Map<InjectionFormDTO>(form));
    }

    // API cho phụ huynh xác nhận đồng ý tiêm chủng
    [HttpPost("parent-confirm/{formId}")]
    public async Task<IActionResult> ParentConfirmConsent(int formId)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }
        form.ConsentStatus = "Approved";
        form.ConsentDate = DateTime.UtcNow;
        var result = await _injectionFormService.UpdateInjectionFormAsync(form);
        if (!result)
        {
            return StatusCode(500, "Lỗi xác nhận phiếu tiêm chủng");
        }
        return Ok("Phụ huynh đã xác nhận đồng ý tiêm chủng thành công");
    }

    // POST: api/InjectionForm/approve/{formId}
    [HttpPost("approve/{formId}")]
    public async Task<IActionResult> ApproveInjectionForm(int formId, [FromBody] ApprovalRequestDto request = null, [FromServices] INotificationService notificationService = null)
    {
        try
        {
            _logger.LogInformation("Starting approval process for injection form ID: {FormId}", formId);
            
            var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
            if (form == null)
            {
                _logger.LogWarning("Injection form with ID {FormId} not found", formId);
                return NotFound("Không tìm thấy phiếu tiêm chủng");
            }

            _logger.LogInformation("Found injection form: {FormId}, Current Status: {Status}", form.FormId, form.Status);

            // Update form status to approved
            form.Status = "approved";
            form.ConsentStatus = "approved"; // Also update ConsentStatus for consistency
            form.ConfirmedDate = DateTime.UtcNow;
            
            // Add notes if provided
            if (request != null && !string.IsNullOrEmpty(request.Notes))
            {
                form.Notes = request.Notes;
                _logger.LogInformation("Added notes to form {FormId}: {Notes}", formId, request.Notes);
            }

            _logger.LogInformation("Attempting to update injection form {FormId} to approved status", formId);
            var result = await _injectionFormService.UpdateInjectionFormAsync(form);
            if (!result)
            {
                _logger.LogError("Failed to update injection form {FormId} - UpdateInjectionFormAsync returned false", formId);
                return StatusCode(500, "Lỗi khi duyệt phiếu tiêm chủng - không thể cập nhật database");
            }

            _logger.LogInformation("Successfully updated injection form {FormId} to approved status", formId);

            // Send notification to parents if ParentId exists
            if (form.ParentId.HasValue && notificationService != null)
            {
                try
                {
                    _logger.LogInformation("Sending notification to parent {ParentId} for form {FormId}", form.ParentId.Value, formId);
                    var notification = new API.DTOs.NotificationDto.Create
                    {
                        Type = "injection_approved",
                        Title = "Phiếu tiêm chủng được duyệt",
                        Message = $"Phiếu tiêm chủng cho học sinh {form.Student?.LastName} {form.Student?.FirstName} đã được duyệt và sẽ được thực hiện theo lịch đã định.",
                        ParentId = form.ParentId.Value,
                        StudentCode = form.Student?.StudentCode,
                        Priority = "high"
                    };
                    await notificationService.CreateNotificationAsync(_mapper.Map<DB.Notification>(notification));
                    _logger.LogInformation("Successfully sent notification to parent {ParentId}", form.ParentId.Value);
                }
                catch (Exception ex)
                {
                    // Log notification error but don't fail the approval
                    _logger.LogError(ex, "Error sending notification to parent {ParentId} for form {FormId}", form.ParentId.Value, formId);
                }
            }

            return Ok(new { 
                success = true,
                message = "Phiếu tiêm chủng đã được duyệt thành công",
                status = "approved" 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving injection form {FormId}: {ErrorMessage}", formId, ex.Message);
            return StatusCode(500, new { 
                error = "Có lỗi xảy ra khi duyệt phiếu tiêm chủng",
                message = ex.Message,
                success = false 
            });
        }
    }

    // API cho manager từ chối phiếu tiêm chủng
    [HttpPost("reject/{formId}")]
    public async Task<IActionResult> RejectInjectionForm(int formId, [FromBody] ApprovalRequestDto request = null)
    {
        try
        {
            var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
            if (form == null)
            {
                return NotFound("Không tìm thấy phiếu tiêm chủng");
            }
            
            if (form.Status == "rejected")
            {
                return BadRequest("Phiếu đã bị từ chối trước đó");
            }
            
            // Update form status to rejected
            form.Status = "rejected";
            form.ConsentStatus = "rejected"; // Also update ConsentStatus for consistency
            form.ConfirmedDate = DateTime.UtcNow;
            
            // Add rejection notes if provided
            if (request != null && !string.IsNullOrEmpty(request.Notes))
            {
                form.Notes = request.Notes;
            }
            
            var result = await _injectionFormService.UpdateInjectionFormAsync(form);
            if (!result)
            {
                return StatusCode(500, "Lỗi từ chối phiếu tiêm chủng");
            }
            
            return Ok(new { 
                success = true,
                message = "Phiếu tiêm chủng đã bị từ chối",
                status = "rejected" 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting injection form {FormId}: {ErrorMessage}", formId, ex.Message);
            return StatusCode(500, new { 
                error = "Có lỗi xảy ra khi từ chối phiếu tiêm chủng",
                message = ex.Message,
                success = false 
            });
        }
    }

    // POST: api/InjectionForm/parent-consent/{formId}
    [HttpPost("parent-consent/{formId}")]
    public async Task<IActionResult> ParentConsentInjectionForm(int formId, [FromQuery] bool isApproved = true)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }
        if (form.Status != "waiting_parent")
        {
            return BadRequest("Phiếu tiêm chủng không ở trạng thái chờ phụ huynh xác nhận");
        }
        if (isApproved)
        {
            form.Status = "approved";
        }
        else
        {
            form.Status = "parent_rejected";
        }
        await _injectionFormService.UpdateInjectionFormAsync(form);
        return Ok(new { status = form.Status });
    }

    // New endpoint for creating vaccination schedules


    // Vaccination schedule endpoints
    [HttpGet("schedules")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedules()
    {
        try
        {
            var schedules = await _injectionFormService.GetVaccinationSchedulesAsync();
            var dtos = _mapper.Map<IEnumerable<InjectionFormDTO>>(schedules).ToList();
            
            // Map status to lowercase for frontend consistency
            foreach (var dto in dtos)
            {
                if (!string.IsNullOrEmpty(dto.Status))
                    dto.Status = dto.Status.ToLower();
                
                // Parse gradeIds (JSON string) into array
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = System.Text.Json.JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
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
            _logger.LogError(ex, "Error getting vaccination schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpGet("schedules/{id}")]
    public async Task<ActionResult<InjectionFormDTO>> GetVaccinationScheduleById(int id)
    {
        try
        {
            var schedule = await _injectionFormService.GetVaccinationScheduleByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }
            
            var dto = _mapper.Map<InjectionFormDTO>(schedule);
            
            // Map status to lowercase for frontend consistency
            if (!string.IsNullOrEmpty(dto.Status))
                dto.Status = dto.Status.ToLower();
                
            // Parse gradeIds (JSON string) into array
            if (!string.IsNullOrEmpty(dto.GradeIds))
            {
                try
                {
                    dto.Grades = System.Text.Json.JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
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

            // Deserialize detailed information from JSON fields
            if (!string.IsNullOrEmpty(schedule.ClassDetailsJson))
            {
                try
                {
                    var classDetails = System.Text.Json.JsonSerializer.Deserialize<List<dynamic>>(schedule.ClassDetailsJson);
                    dto.Classes = classDetails?.Select(c => new ClassDto.ViewModel
                    {
                        ClassId = ((JsonElement)c).GetProperty("ClassId").GetInt32(),
                        ClassName = ((JsonElement)c).GetProperty("ClassName").GetString() ?? "",
                        GradeLevel = ((JsonElement)c).GetProperty("GradeLevel").GetInt32(),
                        CurrentStudentCount = ((JsonElement)c).GetProperty("StudentCount").GetInt32(),
                        ClassTeacher = ((JsonElement)c).TryGetProperty("ClassTeacher", out var teacher) ? teacher.GetString() : null
                    }).ToList();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to deserialize class details for schedule {ScheduleId}", id);
                    dto.Classes = new List<ClassDto.ViewModel>();
                }
            }

            if (!string.IsNullOrEmpty(schedule.StudentDetailsJson))
            {
                try
                {
                    var studentDetails = System.Text.Json.JsonSerializer.Deserialize<List<dynamic>>(schedule.StudentDetailsJson);
                    dto.Students = studentDetails?.Select(s => new StudentDto.ViewModel
                    {
                        StudentId = ((JsonElement)s).GetProperty("StudentId").GetInt32(),
                        StudentCode = ((JsonElement)s).GetProperty("StudentCode").GetString() ?? "",
                        FirstName = ((JsonElement)s).GetProperty("FirstName").GetString() ?? "",
                        LastName = ((JsonElement)s).GetProperty("LastName").GetString() ?? "",
                        DateOfBirth = ((JsonElement)s).TryGetProperty("DateOfBirth", out var dob) && dob.ValueKind != JsonValueKind.Null 
                            ? DateOnly.FromDateTime(dob.GetDateTime()) : new DateOnly(),
                        Gender = ((JsonElement)s).TryGetProperty("Gender", out var gender) ? gender.GetString() : null
                    }).ToList();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to deserialize student details for schedule {ScheduleId}", id);
                    dto.Students = new List<StudentDto.ViewModel>();
                }
            }

            if (!string.IsNullOrEmpty(schedule.HealthProfilesJson))
            {
                try
                {
                    var healthProfiles = System.Text.Json.JsonSerializer.Deserialize<List<dynamic>>(schedule.HealthProfilesJson);
                    dto.StudentHealthProfiles = healthProfiles?.Select(h => new HealthProfileDto.ViewModel
                    {
                        HealthProfileId = ((JsonElement)h).GetProperty("ProfileId").GetInt32(),
                        StudentCode = ((JsonElement)h).TryGetProperty("StudentCode", out var code) ? code.GetString() ?? "" : "",
                        Height = ((JsonElement)h).TryGetProperty("Height", out var height) && height.ValueKind != JsonValueKind.Null 
                            ? height.GetDecimal() : (decimal?)null,
                        Weight = ((JsonElement)h).TryGetProperty("Weight", out var weight) && weight.ValueKind != JsonValueKind.Null 
                            ? weight.GetDecimal() : (decimal?)null,
                        BloodType = ((JsonElement)h).TryGetProperty("BloodType", out var bloodType) ? bloodType.GetString() : null,
                        AllergyDetails = ((JsonElement)h).TryGetProperty("Allergies", out var allergies) ? allergies.GetString() : null,
                        ChronicDetails = ((JsonElement)h).TryGetProperty("MedicalHistory", out var history) ? history.GetString() : null,
                        EmergencyContact = ((JsonElement)h).TryGetProperty("EmergencyContact", out var contact) ? contact.GetString() : null,
                        OtherInfo = ((JsonElement)h).TryGetProperty("Notes", out var notes) ? notes.GetString() : null,
                        LastUpdated = ((JsonElement)h).TryGetProperty("LastUpdated", out var updated) && updated.ValueKind != JsonValueKind.Null 
                            ? updated.GetDateTime() : (DateTime?)null
                    }).ToList();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to deserialize health profiles for schedule {ScheduleId}", id);
                    dto.StudentHealthProfiles = new List<HealthProfileDto.ViewModel>();
                }
            }
            
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vaccination schedule with ID: {Id}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the vaccination schedule." });
        }
    }

    [HttpPost("schedules")]
    public async Task<ActionResult<InjectionFormDTO>> CreateVaccinationSchedule(InjectionFormDTO scheduleDto)
    {
        try
        {
            _logger.LogInformation("Creating vaccination schedule with Title: {Title}", scheduleDto.InjectionName ?? "Unknown");
            
            // Set default values
            if (scheduleDto.CreatedDate == null)
                scheduleDto.CreatedDate = DateTime.Now;
            
            if (string.IsNullOrEmpty(scheduleDto.Status))
                scheduleDto.Status = "pending";

            // Validate required fields
            if (string.IsNullOrEmpty(scheduleDto.InjectionName))
                return BadRequest(new { error = "Injection name is required" });
            
            if (scheduleDto.ScheduledDate == null)
                return BadRequest(new { error = "Scheduled date is required" });
            
            if (string.IsNullOrEmpty(scheduleDto.GradeIds) || scheduleDto.GradeIds.Trim() == "[]")
                return BadRequest(new { error = "At least one grade must be selected" });

            if (scheduleDto.VaccineId == null || scheduleDto.VaccineId <= 0)
                return BadRequest(new { error = "Valid vaccine ID is required" });
            
            var schedule = _mapper.Map<InjectionForm>(scheduleDto);
            var createdSchedule = await _injectionFormService.CreateVaccinationScheduleAsync(schedule);
            
            if (createdSchedule == null)
            {
                return StatusCode(500, new { error = "Failed to create vaccination schedule." });
            }
            
            _logger.LogInformation("Vaccination schedule created successfully with ID: {FormId}", createdSchedule.FormId);
            
            var responseDto = _mapper.Map<InjectionFormDTO>(createdSchedule);
            
            // Map status to lowercase for frontend consistency
            if (!string.IsNullOrEmpty(responseDto.Status))
                responseDto.Status = responseDto.Status.ToLower();
            
            return CreatedAtAction(
                nameof(GetVaccinationScheduleById),
                new { id = createdSchedule.FormId },
                responseDto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating vaccination schedule with Title: {Title}", scheduleDto.InjectionName ?? "Unknown");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating vaccination schedule with Title: {Title}", scheduleDto.InjectionName ?? "Unknown");
            return StatusCode(500, new { error = "An unexpected error occurred while creating the vaccination schedule." });
        }
    }

    [HttpPut("schedules/{id}")]
    public async Task<IActionResult> UpdateVaccinationSchedule(int id, InjectionFormDTO scheduleDto)
    {
        if (id != scheduleDto.FormId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var schedule = _mapper.Map<InjectionForm>(scheduleDto);
            var success = await _injectionFormService.UpdateVaccinationScheduleAsync(schedule);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating vaccination schedule with ID: {Id}", id);
            return StatusCode(500, new { error = "An unexpected error occurred while updating the vaccination schedule." });
        }
    }

    [HttpDelete("schedules/{id}")]
    public async Task<IActionResult> DeleteVaccinationSchedule(int id)
    {
        try
        {
            var success = await _injectionFormService.DeleteVaccinationScheduleAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting vaccination schedule with ID: {Id}", id);
            return StatusCode(500, new { error = "An unexpected error occurred while deleting the vaccination schedule." });
        }
    }

    // Additional endpoints for filtering schedules
    [HttpGet("schedules/status/{status}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedulesByStatus(string status)
    {
        try
        {
            var schedules = await _injectionFormService.GetVaccinationSchedulesByStatusAsync(status);
            return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(schedules));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vaccination schedules by status: {Status}", status);
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpGet("schedules/date-range")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedulesByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var schedules = await _injectionFormService.GetVaccinationSchedulesByDateRangeAsync(startDate, endDate);
            return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(schedules));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vaccination schedules by date range");
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpGet("schedules/grade/{gradeId}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedulesByGrade(string gradeId)
    {
        try
        {
            var schedules = await _injectionFormService.GetVaccinationSchedulesByGradeAsync(gradeId);
            return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(schedules));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vaccination schedules by grade: {GradeId}", gradeId);
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpGet("schedules/vaccine/{vaccineId}")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedulesByVaccine(int vaccineId)
    {
        try
        {
            var schedules = await _injectionFormService.GetVaccinationSchedulesByVaccineAsync(vaccineId);
            return Ok(_mapper.Map<IEnumerable<InjectionFormDTO>>(schedules));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vaccination schedules by vaccine: {VaccineId}", vaccineId);
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpGet("schedules/check-conflict")]
    public async Task<ActionResult<bool>> CheckScheduleConflict(
        [FromQuery] DateTime scheduledDate,
        [FromQuery] string startTime,
        [FromQuery] string location)
    {
        try
        {
            if (!TimeSpan.TryParse(startTime, out var timeSpan))
            {
                return BadRequest(new { error = "Invalid start time format. Expected HH:mm:ss" });
            }

            var hasConflict = await _injectionFormService.HasScheduleConflictAsync(scheduledDate, timeSpan, location);
            return Ok(new { hasConflict = hasConflict });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking schedule conflict");
            return StatusCode(500, new { error = "An error occurred while checking for schedule conflicts." });
        }
    }
} 