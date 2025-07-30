using API.ViewModels;
using AutoMapper;
using DB;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckResultController : ControllerBase
{
    private readonly IHealthCheckResultService _healthCheckResultService;
    private readonly IMapper _mapper;

    public HealthCheckResultController(
        IHealthCheckResultService healthCheckResultService,
        IMapper mapper
    )
    {
        _healthCheckResultService = healthCheckResultService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthCheckResultDTO>>> GetAllHealthCheckResults()
    {
        var results = await _healthCheckResultService.GetAllHealthCheckResultsAsync();
        return Ok(_mapper.Map<IEnumerable<HealthCheckResultDTO>>(results));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthCheckResultDTO>> GetHealthCheckResultById(int id)
    {
        var result = await _healthCheckResultService.GetHealthCheckResultByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthCheckResultDTO>(result));
    }

    [HttpPost]
    public async Task<ActionResult<HealthCheckResultDTO>> CreateHealthCheckResult(
        HealthCheckResultDTO resultDto
    )
    {
        try
        {
            var result = _mapper.Map<HealthCheckResult>(resultDto);
            var createdResult = await _healthCheckResultService.CreateHealthCheckResultAsync(
                result
            );
            return CreatedAtAction(
                nameof(GetHealthCheckResultById),
                new { id = createdResult.ResultId },
                _mapper.Map<HealthCheckResultDTO>(createdResult)
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthCheckResult(int id, HealthCheckResultDTO resultDto)
    {
        if (id != resultDto.ResultId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var result = _mapper.Map<HealthCheckResult>(resultDto);
            var success = await _healthCheckResultService.UpdateHealthCheckResultAsync(result);
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
    public async Task<IActionResult> DeleteHealthCheckResult(int id)
    {
        var success = await _healthCheckResultService.DeleteHealthCheckResultAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("form/{formId}")]
    public async Task<
        ActionResult<IEnumerable<HealthCheckResultDTO>>
    > GetHealthCheckResultsByFormId(int formId)
    {
        var results = await _healthCheckResultService.GetHealthCheckResultsByFormIdAsync(formId);
        return Ok(_mapper.Map<IEnumerable<HealthCheckResultDTO>>(results));
    }

    [HttpGet("student/{studentId}")]
    public async Task<
        ActionResult<IEnumerable<HealthCheckResultDTO>>
    > GetHealthCheckResultsByStudentId(int studentId)
    {
        var results = await _healthCheckResultService.GetHealthCheckResultsByStudentIdAsync(
            studentId
        );
        return Ok(_mapper.Map<IEnumerable<HealthCheckResultDTO>>(results));
    }

    [HttpGet("form/{formId}/latest")]
    public async Task<ActionResult<HealthCheckResultDTO>> GetLatestHealthCheckResultByFormId(
        int formId
    )
    {
        var result = await _healthCheckResultService.GetLatestHealthCheckResultByFormIdAsync(
            formId
        );
        if (result == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthCheckResultDTO>(result));
    }
}
