using API.DTOs;
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
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetAllHealthEvents()
    {
        var events = await _healthEventService.GetAllHealthEventsAsync();
        return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthEventDto.ViewModel>> GetHealthEventById(int id)
    {
        var healthEvent = await _healthEventService.GetHealthEventByIdAsync(id);
        if (healthEvent == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthEventDto.ViewModel>(healthEvent));
    }

    [HttpPost]
    public async Task<ActionResult<HealthEventDto.ViewModel>> CreateHealthEvent(HealthEventDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        try
        {
            var healthEvent = _mapper.Map<HealthEvent>(createDto);
            var createdEvent = await _healthEventService.CreateHealthEventAsync(healthEvent);
            return CreatedAtAction(
                nameof(GetHealthEventById),
                new { id = createdEvent.EventId },
                _mapper.Map<HealthEventDto.ViewModel>(createdEvent));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthEvent(int id, HealthEventDto.Update updateDto)
    {
        if (id != updateDto.EventId)
        {
            return BadRequest("ID mismatch");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Fetch the existing entity with its collections
            var existingHealthEvent = await _healthEventService.GetHealthEventByIdAsync(id);
            if (existingHealthEvent == null)
            {
                return NotFound();
            }

            // Map updated values from DTO to the existing entity
            _mapper.Map(updateDto, existingHealthEvent);

            var success = await _healthEventService.UpdateHealthEventAsync(existingHealthEvent);
            if (!success)
            {
                return NotFound("Health event not found or update failed.");
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

    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetHealthEventsByStudentCode(string studentCode)
    {
        var events = await _healthEventService.GetHealthEventsByStudentCodeAsync(studentCode);
        return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetHealthEventsByStaffId(int staffId)
    {
        var events = await _healthEventService.GetHealthEventsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
    }

    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetHealthEventsByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var events = await _healthEventService.GetHealthEventsByDateRangeAsync(startDate, endDate);
            return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("nurse/{staffId}/grade")]
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetHealthEventsByNurseGrade(int staffId)
    {
        try
        {
            var events = await _healthEventService.GetHealthEventsForNurseByGradeAsync(staffId);
            return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 