using API.DTOs;
using AutoMapper;
using DB;
using Microsoft.AspNetCore.Mvc;
using Service;

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
    public async Task<ActionResult<HealthEventDto.ViewModel>> CreateHealthEvent(
        HealthEventDto.Create createDto
    )
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
                _mapper.Map<HealthEventDto.ViewModel>(createdEvent)
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Create multiple health events in batch (for collective incidents)
    /// Tạo nhiều sự cố y tế cùng lúc (cho sự cố tập thể)
    /// </summary>
    [HttpPost("batch")]
    public async Task<ActionResult<object>> CreateBatchHealthEvents(
        List<HealthEventDto.Create> createDtos
    )
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (createDtos == null || !createDtos.Any())
        {
            return BadRequest("Danh sách sự cố y tế không được để trống");
        }

        if (createDtos.Count > 50)
        {
            return BadRequest("Không thể tạo quá 50 sự cố cùng lúc");
        }

        try
        {
            var healthEvents = _mapper.Map<List<HealthEvent>>(createDtos);
            var batchResult = await _healthEventService.CreateBatchHealthEventsAsync(healthEvents);

            return Ok(
                new
                {
                    message = "Tạo sự cố y tế hàng loạt thành công",
                    totalRequested = createDtos.Count,
                    successfullyCreated = batchResult.SuccessfulCount,
                    failedCount = batchResult.FailedCount,
                    failedDetails = batchResult.FailedDetails,
                    createdEvents = _mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(
                        batchResult.CreatedEvents
                    ),
                }
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    message = "Lỗi server nội bộ khi tạo sự cố y tế hàng loạt",
                    error = ex.Message,
                }
            );
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
    public async Task<
        ActionResult<IEnumerable<HealthEventDto.ViewModel>>
    > GetHealthEventsByStudentCode(string studentCode)
    {
        var events = await _healthEventService.GetHealthEventsByStudentCodeAsync(studentCode);
        return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<HealthEventDto.ViewModel>>> GetHealthEventsByStaffId(
        int staffId
    )
    {
        var events = await _healthEventService.GetHealthEventsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
    }

    [HttpGet("daterange")]
    public async Task<
        ActionResult<IEnumerable<HealthEventDto.ViewModel>>
    > GetHealthEventsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var events = await _healthEventService.GetHealthEventsByDateRangeAsync(
                startDate,
                endDate
            );
            return Ok(_mapper.Map<IEnumerable<HealthEventDto.ViewModel>>(events));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("nurse/{staffId}/grade")]
    public async Task<
        ActionResult<IEnumerable<HealthEventDto.ViewModel>>
    > GetHealthEventsByNurseGrade(int staffId)
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

    /// <summary>
    /// Get critical medical incidents for a specific student
    /// Lấy danh sách sự cố y tế nghiêm trọng của học sinh
    /// </summary>
    [HttpGet("student/{studentCode}/critical-incidents")]
    public async Task<ActionResult<object>> GetCriticalIncidentsByStudent(string studentCode)
    {
        try
        {
            var criticalIncidents = await _healthEventService.GetCriticalIncidentsByStudentAsync(
                studentCode
            );

            if (!criticalIncidents.Any())
            {
                return Ok(
                    new
                    {
                        studentCode = studentCode,
                        message = "Không có sự cố nghiêm trọng nào được ghi nhận",
                        incidents = new List<object>(),
                        count = 0,
                    }
                );
            }

            var incidentsData = criticalIncidents
                .Select(incident => new
                {
                    incidentId = incident.EventId,
                    timestamp = incident.EventDate,
                    severityLevel = incident.Severity,
                    description = incident.Symptoms,
                    handledBy = incident.Staff?.FirstName + " " + incident.Staff?.LastName,
                    actionsTaken = incident.Treatment,
                    notifiedParent = incident.ParentNotified,
                    studentName = incident.Student?.FirstName + " " + incident.Student?.LastName,
                    className = incident.Student?.Class?.ClassName,
                    gradeLevel = incident.Student?.Class?.GradeLevel,
                })
                .ToList();

            return Ok(
                new
                {
                    studentCode = studentCode,
                    message = "Lấy danh sách sự cố nghiêm trọng thành công",
                    incidents = incidentsData,
                    count = incidentsData.Count,
                }
            );
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    message = "Lỗi server nội bộ khi lấy danh sách sự cố nghiêm trọng",
                    error = ex.Message,
                }
            );
        }
    }
}
