using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;
using Microsoft.Extensions.Logging;
using System.Text.Json;

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
            _logger.LogInformation("Creating HealthCheckForm with Title: {Title}", formDto.Title);
            
            // Set default values for new fields
            if (formDto.CreatedDate == null)
                formDto.CreatedDate = DateTime.Now;
            
            if (string.IsNullOrEmpty(formDto.Status))
                formDto.Status = "Scheduled";
            
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
            _logger.LogError(ex, "Error creating HealthCheckForm with Title: {Title}", formDto.Title);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckForm with Title: {Title}", formDto.Title);
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

    // New endpoints for health check scheduling
    [HttpGet("schedules")]
    public async Task<ActionResult<IEnumerable<HealthCheckFormDTO>>> GetHealthCheckSchedules()
    {
        try
        {
            var schedules = await _healthCheckFormService.GetHealthCheckSchedulesAsync();
            var dtos = _mapper.Map<IEnumerable<HealthCheckFormDTO>>(schedules).ToList();
            // Map status về chữ thường cho FE, parse gradeIds thành mảng grades
            foreach (var dto in dtos)
            {
                if (!string.IsNullOrEmpty(dto.Status))
                    dto.Status = dto.Status.ToLower();
                // Parse gradeIds (JSON string) thành mảng grades
                if (!string.IsNullOrEmpty(dto.GradeIds))
                {
                    try
                    {
                        dto.Grades = JsonSerializer.Deserialize<List<string>>(dto.GradeIds);
                    }
                    catch
                    {
                        dto.Grades = new List<string>();
                    }
                }
                else
                {
                    dto.Grades = new List<string>();
                }
            }
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting health check schedules");
            return StatusCode(500, new { error = "An error occurred while retrieving health check schedules." });
        }
    }

    [HttpGet("schedules/{id}")]
    public async Task<ActionResult<HealthCheckFormDTO>> GetHealthCheckScheduleById(int id)
    {
        try
        {
            var schedule = await _healthCheckFormService.GetHealthCheckScheduleByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<HealthCheckFormDTO>(schedule));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting health check schedule with ID: {Id}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the health check schedule." });
        }
    }

    [HttpPost("schedules")]
    public async Task<ActionResult<HealthCheckFormDTO>> CreateHealthCheckSchedule(HealthCheckFormDTO scheduleDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _logger.LogInformation("Creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            
            // Validate required fields
            if (string.IsNullOrEmpty(scheduleDto.Title))
                return BadRequest(new { error = "Title is required" });
            
            if (scheduleDto.ScheduledDate == null)
                return BadRequest(new { error = "Scheduled date is required" });
            
            if (string.IsNullOrEmpty(scheduleDto.GradeIds))
                return BadRequest(new { error = "At least one grade must be selected" });

            // Set default values
            scheduleDto.CreatedDate = DateTime.Now;
            scheduleDto.Status = "Scheduled";

            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            var createdSchedule = await _healthCheckFormService.CreateHealthCheckScheduleAsync(schedule);
            
            _logger.LogInformation("HealthCheckSchedule created successfully with ID: {FormId}", createdSchedule.FormId);
            
            return CreatedAtAction(
                nameof(GetHealthCheckScheduleById),
                new { id = createdSchedule.FormId },
                _mapper.Map<HealthCheckFormDTO>(createdSchedule));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title);
            return StatusCode(500, new { error = "An unexpected error occurred while creating the health check schedule." });
        }
    }

    [HttpPut("schedules/{id}")]
    public async Task<IActionResult> UpdateHealthCheckSchedule(int id, HealthCheckFormDTO scheduleDto)
    {
        if (id != scheduleDto.FormId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            var success = await _healthCheckFormService.UpdateHealthCheckScheduleAsync(schedule);
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

    [HttpDelete("schedules/{id}")]
    public async Task<IActionResult> DeleteHealthCheckSchedule(int id)
    {
        var success = await _healthCheckFormService.DeleteHealthCheckScheduleAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // Helper endpoints for frontend data
    [HttpGet("grades")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableGrades()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var grades = new[]
            {
                new { id = "1A", name = "Lớp 1A", totalStudents = 28 },
                new { id = "1B", name = "Lớp 1B", totalStudents = 30 },
                new { id = "2A", name = "Lớp 2A", totalStudents = 29 },
                new { id = "2B", name = "Lớp 2B", totalStudents = 31 },
                new { id = "3A", name = "Lớp 3A", totalStudents = 32 },
                new { id = "3B", name = "Lớp 3B", totalStudents = 29 },
                new { id = "3C", name = "Lớp 3C", totalStudents = 27 },
            };
            return Ok(grades);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available grades");
            return StatusCode(500, new { error = "An error occurred while retrieving grades." });
        }
    }

    [HttpGet("stations")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableStations()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var stations = new[]
            {
                new { 
                    id = "height-weight", 
                    name = "Đo chiều cao, cân nặng", 
                    estimatedTime = "5", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "vision", 
                    name = "Kiểm tra thị lực", 
                    estimatedTime = "3", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "general", 
                    name = "Khám tổng quát", 
                    estimatedTime = "7", 
                    staffRequired = 1, 
                    required = true 
                },
                new { 
                    id = "dental", 
                    name = "Khám răng miệng", 
                    estimatedTime = "4", 
                    staffRequired = 1, 
                    required = false 
                },
                new { 
                    id = "blood-pressure", 
                    name = "Đo huyết áp", 
                    estimatedTime = "3", 
                    staffRequired = 1, 
                    required = false 
                },
                new { 
                    id = "hearing", 
                    name = "Kiểm tra thính lực", 
                    estimatedTime = "5", 
                    staffRequired = 1, 
                    required = false 
                },
            };
            return Ok(stations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available stations");
            return StatusCode(500, new { error = "An error occurred while retrieving stations." });
        }
    }

    [HttpGet("staff")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableStaff()
    {
        try
        {
            // Mock data - in real application, this would come from database
            var staff = new[]
            {
                new { id = 1, name = "Y tá Hương", specialization = "Nhi khoa", available = true },
                new { id = 2, name = "Y tá Mai", specialization = "Tổng quát", available = true },
                new { id = 3, name = "Y tá Lan", specialization = "Nhi khoa", available = true },
                new { id = 4, name = "Bác sĩ Tuấn", specialization = "Tổng quát", available = true },
                new { id = 5, name = "Y tá Hoa", specialization = "Răng hàm mặt", available = false },
            };
            return Ok(staff);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available staff");
            return StatusCode(500, new { error = "An error occurred while retrieving staff." });
        }
    }
} 