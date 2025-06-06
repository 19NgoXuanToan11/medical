using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IMapper _mapper;

    public ReportController(IReportService reportService, IMapper mapper)
    {
        _reportService = reportService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReportDTO>>> GetAllReports()
    {
        var reports = await _reportService.GetAllReportsAsync();
        return Ok(_mapper.Map<IEnumerable<ReportDTO>>(reports));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReportDTO>> GetReportById(int id)
    {
        var report = await _reportService.GetReportByIdAsync(id);
        if (report == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<ReportDTO>(report));
    }

    [HttpPost]
    public async Task<ActionResult<ReportDTO>> CreateReport(ReportDTO reportDto)
    {
        try
        {
            var report = _mapper.Map<Report>(reportDto);
            var createdReport = await _reportService.CreateReportAsync(report);
            return CreatedAtAction(
                nameof(GetReportById),
                new { id = createdReport.ReportId },
                _mapper.Map<ReportDTO>(createdReport));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReport(int id, ReportDTO reportDto)
    {
        if (id != reportDto.ReportId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var report = _mapper.Map<Report>(reportDto);
            var success = await _reportService.UpdateReportAsync(report);
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
    public async Task<IActionResult> DeleteReport(int id)
    {
        var success = await _reportService.DeleteReportAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("type/{reportType}")]
    public async Task<ActionResult<IEnumerable<ReportDTO>>> GetReportsByType(string reportType)
    {
        try
        {
            var reports = await _reportService.GetReportsByTypeAsync(reportType);
            return Ok(_mapper.Map<IEnumerable<ReportDTO>>(reports));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<ReportDTO>>> GetReportsByStaffId(int staffId)
    {
        var reports = await _reportService.GetReportsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<ReportDTO>>(reports));
    }

    [HttpGet("daterange")]
    public async Task<ActionResult<IEnumerable<ReportDTO>>> GetReportsByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var reports = await _reportService.GetReportsByDateRangeAsync(startDate, endDate);
            return Ok(_mapper.Map<IEnumerable<ReportDTO>>(reports));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 