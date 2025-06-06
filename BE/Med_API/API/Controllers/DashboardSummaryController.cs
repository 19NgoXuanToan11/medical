using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardSummaryController : ControllerBase
{
    private readonly IDashboardSummaryService _dashboardSummaryService;
    private readonly IMapper _mapper;

    public DashboardSummaryController(IDashboardSummaryService dashboardSummaryService, IMapper mapper)
    {
        _dashboardSummaryService = dashboardSummaryService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DashboardSummaryDTO>>> GetAllDashboardSummaries()
    {
        var summaries = await _dashboardSummaryService.GetAllDashboardSummariesAsync();
        return Ok(_mapper.Map<IEnumerable<DashboardSummaryDTO>>(summaries));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DashboardSummaryDTO>> GetDashboardSummaryById(int id)
    {
        var summary = await _dashboardSummaryService.GetDashboardSummaryByIdAsync(id);
        if (summary == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<DashboardSummaryDTO>(summary));
    }

    [HttpPost]
    public async Task<ActionResult<DashboardSummaryDTO>> CreateDashboardSummary(DashboardSummaryDTO summaryDto)
    {
        try
        {
            var dashboardSummary = _mapper.Map<DashboardSummary>(summaryDto);
            var createdSummary = await _dashboardSummaryService.CreateDashboardSummaryAsync(dashboardSummary);
            return CreatedAtAction(
                nameof(GetDashboardSummaryById),
                new { id = createdSummary.SummaryId },
                _mapper.Map<DashboardSummaryDTO>(createdSummary));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDashboardSummary(int id, DashboardSummaryDTO summaryDto)
    {
        if (id != summaryDto.SummaryId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var dashboardSummary = _mapper.Map<DashboardSummary>(summaryDto);
            var success = await _dashboardSummaryService.UpdateDashboardSummaryAsync(dashboardSummary);
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
    public async Task<IActionResult> DeleteDashboardSummary(int id)
    {
        var success = await _dashboardSummaryService.DeleteDashboardSummaryAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<DashboardSummaryDTO>>> GetDashboardSummariesByStaffId(int staffId)
    {
        var summaries = await _dashboardSummaryService.GetDashboardSummariesByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<DashboardSummaryDTO>>(summaries));
    }

    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<DashboardSummaryDTO>>> GetDashboardSummariesByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var summaries = await _dashboardSummaryService.GetDashboardSummariesByDateRangeAsync(startDate, endDate);
            return Ok(_mapper.Map<IEnumerable<DashboardSummaryDTO>>(summaries));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 