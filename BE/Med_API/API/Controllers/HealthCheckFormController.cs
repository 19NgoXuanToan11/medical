using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;
using Microsoft.Extensions.Logging;

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
            _logger.LogInformation("Creating HealthCheckForm for StudentId: {StudentId}", formDto.StudentId);
            
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
            _logger.LogError(ex, "Error creating HealthCheckForm for StudentId: {StudentId}", formDto.StudentId);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckForm for StudentId: {StudentId}", formDto.StudentId);
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
} 