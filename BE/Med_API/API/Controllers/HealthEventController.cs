using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthEventController : ControllerBase
{
    private readonly IHealthEventService _healthEventService;
    private readonly IMapper _mapper;

    public HealthEventController(IHealthEventService healthEventService, IMapper mapper)
    {
        _healthEventService = healthEventService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthEventDTO>>> GetAllHealthEvents()
    {
        var events = await _healthEventService.GetAllHealthEventsAsync();
        return Ok(_mapper.Map<IEnumerable<HealthEventDTO>>(events));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthEventDTO>> GetHealthEventById(int id)
    {
        var healthEvent = await _healthEventService.GetHealthEventByIdAsync(id);
        if (healthEvent == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthEventDTO>(healthEvent));
    }

    [HttpPost]
    public async Task<ActionResult<HealthEventDTO>> CreateHealthEvent(HealthEventDTO eventDto)
    {
        try
        {
            var healthEvent = _mapper.Map<HealthEvent>(eventDto);
            var createdEvent = await _healthEventService.CreateHealthEventAsync(healthEvent);
            return CreatedAtAction(
                nameof(GetHealthEventById),
                new { id = createdEvent.EventId },
                _mapper.Map<HealthEventDTO>(createdEvent));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthEvent(int id, HealthEventDTO eventDto)
    {
        if (id != eventDto.EventId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var healthEvent = _mapper.Map<HealthEvent>(eventDto);
            var success = await _healthEventService.UpdateHealthEventAsync(healthEvent);
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
    public async Task<IActionResult> DeleteHealthEvent(int id)
    {
        var success = await _healthEventService.DeleteHealthEventAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<HealthEventDTO>>> GetHealthEventsByStudentId(int studentId)
    {
        var events = await _healthEventService.GetHealthEventsByStudentIdAsync(studentId);
        return Ok(_mapper.Map<IEnumerable<HealthEventDTO>>(events));
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<HealthEventDTO>>> GetHealthEventsByStaffId(int staffId)
    {
        var events = await _healthEventService.GetHealthEventsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<HealthEventDTO>>(events));
    }

    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<HealthEventDTO>>> GetHealthEventsByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var events = await _healthEventService.GetHealthEventsByDateRangeAsync(startDate, endDate);
            return Ok(_mapper.Map<IEnumerable<HealthEventDTO>>(events));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 