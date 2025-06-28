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
    [HttpGet("pending-students")]
    public async Task<ActionResult<IEnumerable<InjectionFormDTO>>> GetPendingInjectionStudents()
    {
        var forms = await _injectionFormService.GetInjectionFormsByStatusAsync("pending");
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

        if (form.ConsentStatus == "Approved")
        {
            return BadRequest("Phiếu tiêm chủng đã được xác nhận đồng ý trước đó");
        }

        if (form.ConsentStatus == "Rejected")
        {
            return BadRequest("Phiếu tiêm chủng đã bị từ chối trước đó");
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

    // API cho phụ huynh từ chối tiêm chủng
    [HttpPost("parent-reject/{formId}")]
    public async Task<IActionResult> ParentRejectConsent(int formId, [FromBody] string? reason = null)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }

        if (form.ConsentStatus == "Approved")
        {
            return BadRequest("Phiếu tiêm chủng đã được xác nhận đồng ý trước đó");
        }

        if (form.ConsentStatus == "Rejected")
        {
            return BadRequest("Phiếu tiêm chủng đã bị từ chối trước đó");
        }

        form.ConsentStatus = "Rejected";
        form.ConsentDate = DateTime.UtcNow;

        // Thêm lý do từ chối vào description nếu có
        if (!string.IsNullOrEmpty(reason))
        {
            form.Description = string.IsNullOrEmpty(form.Description)
                ? $"Lý do từ chối: {reason}"
                : $"{form.Description}\nLý do từ chối: {reason}";
        }

        var result = await _injectionFormService.UpdateInjectionFormAsync(form);
        if (!result)
        {
            return StatusCode(500, "Lỗi từ chối phiếu tiêm chủng");
        }
        return Ok("Phụ huynh đã từ chối tiêm chủng thành công");
    }

    // API để hủy phiếu tiêm chủng (cho nhân viên y tế)
    [HttpPost("cancel/{formId}")]
    public async Task<IActionResult> CancelInjectionForm(int formId, [FromBody] string? reason = null)
    {
        var form = await _injectionFormService.GetInjectionFormByIdAsync(formId);
        if (form == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }

        if (form.ConsentStatus == "Cancelled")
        {
            return BadRequest("Phiếu tiêm chủng đã bị hủy trước đó");
        }

        form.ConsentStatus = "Cancelled";
        form.ConsentDate = DateTime.UtcNow;

        // Thêm lý do hủy vào description nếu có
        if (!string.IsNullOrEmpty(reason))
        {
            form.Description = string.IsNullOrEmpty(form.Description)
                ? $"Lý do hủy: {reason}"
                : $"{form.Description}\nLý do hủy: {reason}";
        }

        var result = await _injectionFormService.UpdateInjectionFormAsync(form);
        if (!result)
        {
            return StatusCode(500, "Lỗi hủy phiếu tiêm chủng");
        }
        return Ok("Phiếu tiêm chủng đã được hủy thành công");
    }

    // API để lấy thống kê phiếu tiêm chủng
    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetInjectionFormStatistics()
    {
        var allForms = await _injectionFormService.GetAllInjectionFormsAsync();
        var formsList = allForms.ToList();

        var statistics = new
        {
            Total = formsList.Count,
            Pending = formsList.Count(f => f.ConsentStatus == "Pending"),
            Approved = formsList.Count(f => f.ConsentStatus == "Approved"),
            Rejected = formsList.Count(f => f.ConsentStatus == "Rejected"),
            Cancelled = formsList.Count(f => f.ConsentStatus == "Cancelled"),
            TodayCreated = formsList.Count(f => f.CreatedDate?.Date == DateTime.UtcNow.Date),
            ThisWeekCreated = formsList.Count(f => f.CreatedDate >= DateTime.UtcNow.AddDays(-7)),
            ThisMonthCreated = formsList.Count(f => f.CreatedDate >= DateTime.UtcNow.AddMonths(-1))
        };

        return Ok(statistics);
    }
}