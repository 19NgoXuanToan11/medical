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
} 