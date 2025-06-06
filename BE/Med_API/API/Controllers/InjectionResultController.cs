using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InjectionResultController : ControllerBase
{
    private readonly IInjectionResultService _injectionResultService;
    private readonly IMapper _mapper;

    public InjectionResultController(IInjectionResultService injectionResultService, IMapper mapper)
    {
        _injectionResultService = injectionResultService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InjectionResultDTO>>> GetAllInjectionResults()
    {
        var results = await _injectionResultService.GetAllInjectionResultsAsync();
        return Ok(_mapper.Map<IEnumerable<InjectionResultDTO>>(results));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InjectionResultDTO>> GetInjectionResultById(int id)
    {
        var result = await _injectionResultService.GetInjectionResultByIdAsync(id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<InjectionResultDTO>(result));
    }

    [HttpPost]
    public async Task<ActionResult<InjectionResultDTO>> CreateInjectionResult(InjectionResultDTO resultDto)
    {
        try
        {
            var result = _mapper.Map<InjectionResult>(resultDto);
            var createdResult = await _injectionResultService.CreateInjectionResultAsync(result);
            return CreatedAtAction(
                nameof(GetInjectionResultById),
                new { id = createdResult.ResultId },
                _mapper.Map<InjectionResultDTO>(createdResult));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInjectionResult(int id, InjectionResultDTO resultDto)
    {
        if (id != resultDto.ResultId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var result = _mapper.Map<InjectionResult>(resultDto);
            var success = await _injectionResultService.UpdateInjectionResultAsync(result);
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
    public async Task<IActionResult> DeleteInjectionResult(int id)
    {
        var success = await _injectionResultService.DeleteInjectionResultAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("form/{formId}")]
    public async Task<ActionResult<IEnumerable<InjectionResultDTO>>> GetInjectionResultsByFormId(int formId)
    {
        var results = await _injectionResultService.GetInjectionResultsByFormIdAsync(formId);
        return Ok(_mapper.Map<IEnumerable<InjectionResultDTO>>(results));
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<InjectionResultDTO>>> GetInjectionResultsByStudentId(int studentId)
    {
        var results = await _injectionResultService.GetInjectionResultsByStudentIdAsync(studentId);
        return Ok(_mapper.Map<IEnumerable<InjectionResultDTO>>(results));
    }

    [HttpGet("form/{formId}/latest")]
    public async Task<ActionResult<InjectionResultDTO>> GetLatestInjectionResultByFormId(int formId)
    {
        var result = await _injectionResultService.GetLatestInjectionResultByFormIdAsync(formId);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<InjectionResultDTO>(result));
    }
} 