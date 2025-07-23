using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InjectionFormController : ControllerBase
{
    private readonly IInjectionFormService _injectionFormService;
    private readonly IMapper _mapper;

    public InjectionFormController(IInjectionFormService injectionFormService, IMapper mapper)
    {
        _injectionFormService = injectionFormService;
        _mapper = mapper;
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

    // API cho manager duyệt phiếu tiêm chủng
    [HttpPost("approve/{formId}")]
    public async Task<IActionResult> ApproveInjectionForm(int formId)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }
        if (form.Status == "approved")
        {
            return BadRequest("Phiếu đã được duyệt trước đó");
        }
        form.Status = "approved";
        var result = await _injectionFormService.UpdateInjectionFormAsync(form);
        if (!result)
        {
            return StatusCode(500, "Lỗi duyệt phiếu tiêm chủng");
        }
        // TODO: Gửi thông báo xác nhận cho phụ huynh ở đây
        return Ok("Phiếu tiêm chủng đã được duyệt và gửi thông báo xác nhận cho phụ huynh");
    }

    // API cho manager từ chối phiếu tiêm chủng
    [HttpPost("reject/{formId}")]
    public async Task<IActionResult> RejectInjectionForm(int formId)
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
        form.Status = "rejected";
        var result = await _injectionFormService.UpdateInjectionFormAsync(form);
        if (!result)
        {
            return StatusCode(500, "Lỗi từ chối phiếu tiêm chủng");
        }
        return Ok("Phiếu tiêm chủng đã bị từ chối");
    }

    // New endpoints for vaccination scheduling (similar to HealthCheckForm)
    [HttpGet("schedules")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetVaccinationSchedules()
    {
        try
        {
            var schedules = await _injectionFormService.GetAllInjectionFormsAsync();
            var dtos = _mapper.Map<IEnumerable<InjectionFormDTO>>(schedules);
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while retrieving vaccination schedules." });
        }
    }

    [HttpPost("schedules")]
    public async Task<ActionResult<InjectionFormDTO>> CreateVaccinationSchedule(InjectionFormDTO scheduleDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { 
                error = "Validation failed", 
                details = ModelState.Where(x => x.Value?.Errors?.Count > 0)
                    .ToDictionary(k => k.Key, v => v.Value?.Errors?.Select(e => e.ErrorMessage) ?? new List<string>())
            });
        }

        try
        {
            // Validate required fields for vaccination schedule
            if (string.IsNullOrEmpty(scheduleDto.InjectionName))
                return BadRequest(new { error = "Injection name is required" });
            
            if (!scheduleDto.VaccineId.HasValue)
                return BadRequest(new { error = "Vaccine is required" });

            // Set default values for vaccination schedule
            scheduleDto.CreatedDate = DateTime.Now;
            if (string.IsNullOrEmpty(scheduleDto.Status))
                scheduleDto.Status = "đang chờ";
            
            if (string.IsNullOrEmpty(scheduleDto.ConsentStatus))
                scheduleDto.ConsentStatus = "đang chờ";

            if (string.IsNullOrEmpty(scheduleDto.ConfirmStatus))
                scheduleDto.ConfirmStatus = "đang chờ";

            var schedule = _mapper.Map<InjectionForm>(scheduleDto);
            
            // Convert StartTime from string to TimeSpan if provided
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

            var createdSchedule = await _injectionFormService.CreateInjectionFormAsync(schedule);
            
            if (createdSchedule == null)
            {
                return StatusCode(500, new { error = "Failed to create vaccination schedule." });
            }
            
            return CreatedAtAction(
                nameof(GetInjectionFormById),
                new { id = createdSchedule.FormId },
                _mapper.Map<InjectionFormDTO>(createdSchedule));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
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
            
            // Convert StartTime from string to TimeSpan if provided
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
            
            var success = await _injectionFormService.UpdateInjectionFormAsync(schedule);
            
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
            return StatusCode(500, new { error = "An unexpected error occurred while updating the vaccination schedule." });
        }
    }

    [HttpDelete("schedules/{id}")]
    public async Task<IActionResult> DeleteVaccinationSchedule(int id)
    {
        var success = await _injectionFormService.DeleteInjectionFormAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 