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
            _logger.LogInformation("Creating HealthCheckForm with Title: {Title}", formDto.Title ?? "Unknown");
            
            // Set default values for new fields
            if (formDto.CreatedDate == null)
                formDto.CreatedDate = DateTime.Now;
            
            if (string.IsNullOrEmpty(formDto.Status))
                formDto.Status = "Scheduled";
            
            var form = _mapper.Map<HealthCheckForm>(formDto);
            var createdForm = await _healthCheckFormService.CreateHealthCheckFormAsync(form);
            
            if (createdForm == null)
            {
                return StatusCode(500, new { error = "Failed to create health check form." });
            }
            
            _logger.LogInformation("HealthCheckForm created successfully with ID: {FormId}", createdForm.FormId);
            
            return CreatedAtAction(
                nameof(GetHealthCheckFormById),
                new { id = createdForm.FormId },
                _mapper.Map<HealthCheckFormDTO>(createdForm));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating HealthCheckForm with Title: {Title}", formDto.Title ?? "Unknown");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckForm with Title: {Title}", formDto.Title ?? "Unknown");
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
            
            var dto = _mapper.Map<HealthCheckFormDTO>(schedule);
            
            // Map status về chữ thường cho FE
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
            
            return Ok(dto);
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
        // Debug logging - log the raw request
        _logger.LogInformation("=== DEBUG: Raw request received ===");
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("ScheduledDate: {Date}", scheduleDto.ScheduledDate);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        _logger.LogInformation("Description: {Description}", scheduleDto.Description);
        _logger.LogInformation("Location: {Location}", scheduleDto.Location);
        _logger.LogInformation("Status from frontend: {Status}", scheduleDto.Status);
        Console.WriteLine($"CONTROLLER RECEIVED: Status = '{scheduleDto.Status}'");
        
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Invalid model state for HealthCheckSchedule creation:");
            foreach (var error in ModelState)
            {
                _logger.LogWarning("Field {Field}: {Errors}", error.Key, 
                    string.Join(", ", error.Value?.Errors?.Select(e => e.ErrorMessage) ?? new List<string>()));
            }
            return BadRequest(new { 
                error = "Validation failed", 
                details = ModelState.Where(x => x.Value?.Errors?.Count > 0)
                    .ToDictionary(k => k.Key, v => v.Value?.Errors?.Select(e => e.ErrorMessage) ?? new List<string>())
            });
        }

        try
        {
            _logger.LogInformation("Creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title ?? "Unknown");
            _logger.LogInformation("Received data - Title: {Title}, ScheduledDate: {Date}, StartTime: {StartTime}, GradeIds: {GradeIds}", 
                scheduleDto.Title, scheduleDto.ScheduledDate, scheduleDto.StartTime, scheduleDto.GradeIds);
            
            // Validate required fields
            if (string.IsNullOrEmpty(scheduleDto.Title))
                return BadRequest(new { error = "Title is required" });
            
            if (scheduleDto.ScheduledDate == null)
                return BadRequest(new { error = "Scheduled date is required" });
            
            // Check if GradeIds is empty or contains only empty array
            if (string.IsNullOrEmpty(scheduleDto.GradeIds) || scheduleDto.GradeIds.Trim() == "[]")
                return BadRequest(new { error = "At least one grade must be selected" });

            // Set default values
            scheduleDto.CreatedDate = DateTime.Now;
            // Keep the status from frontend, only set default if empty
            if (string.IsNullOrEmpty(scheduleDto.Status))
                scheduleDto.Status = "pending";
            
            _logger.LogInformation("Final Status after processing: {Status}", scheduleDto.Status);
            Console.WriteLine($"CONTROLLER SENDING TO SERVICE: Status = '{scheduleDto.Status}'");

            // Convert StartTime from string to TimeSpan for mapping
            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            if (!string.IsNullOrEmpty(scheduleDto.StartTime))
            {
                if (TimeSpan.TryParse(scheduleDto.StartTime, out var startTime))
                {
                    schedule.StartTime = startTime;
                }
                else
                {
                    return BadRequest(new { error = "Invalid start time format. Expected HH:mm:ss" });
                }
            }
            var createdSchedule = await _healthCheckFormService.CreateHealthCheckScheduleAsync(schedule);
            
            if (createdSchedule == null)
            {
                return StatusCode(500, new { error = "Failed to create health check schedule." });
            }
            
            _logger.LogInformation("HealthCheckSchedule created successfully with ID: {FormId}", createdSchedule.FormId);
            
            // FINAL DEBUG - CHECK WHAT WE'RE RETURNING
            var responseDto = _mapper.Map<HealthCheckFormDTO>(createdSchedule);
            Console.WriteLine($"MAPPED RESPONSE DTO: Status = '{responseDto.Status}'");
            Console.WriteLine($"ORIGINAL ENTITY: Status = '{createdSchedule.Status}'");
            
            return CreatedAtAction(
                nameof(GetHealthCheckScheduleById),
                new { id = createdSchedule.FormId },
                responseDto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title ?? "Unknown");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating HealthCheckSchedule with Title: {Title}", scheduleDto.Title ?? "Unknown");
            return StatusCode(500, new { error = "An unexpected error occurred while creating the health check schedule." });
        }
    }

    [HttpPut("schedules/{id}")]
    public async Task<IActionResult> UpdateHealthCheckSchedule(int id, HealthCheckFormDTO scheduleDto)
    {
        _logger.LogInformation("=== UPDATE HEALTH CHECK SCHEDULE DEBUG ===");
        _logger.LogInformation("ID from URL: {Id}", id);
        _logger.LogInformation("FormId from DTO: {FormId}", scheduleDto.FormId);
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("Status: {Status}", scheduleDto.Status);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        
        if (id != scheduleDto.FormId)
        {
            _logger.LogWarning("ID mismatch - URL ID: {UrlId}, DTO FormId: {DtoFormId}", id, scheduleDto.FormId);
            return BadRequest("ID mismatch");
        }

        try
        {
            var schedule = _mapper.Map<HealthCheckForm>(scheduleDto);
            _logger.LogInformation("Mapped schedule - FormId: {FormId}, Status: {Status}", schedule.FormId, schedule.Status);
            
            // Convert StartTime from string to TimeSpan for mapping
            if (!string.IsNullOrEmpty(scheduleDto.StartTime))
            {
                if (TimeSpan.TryParse(scheduleDto.StartTime, out var startTime))
                {
                    schedule.StartTime = startTime;
                    _logger.LogInformation("StartTime converted successfully: {StartTime}", startTime);
                }
                else
                {
                    _logger.LogError("Invalid start time format: {StartTime}", scheduleDto.StartTime);
                    return BadRequest(new { error = "Invalid start time format. Expected HH:mm:ss" });
                }
            }
            
            _logger.LogInformation("Calling UpdateHealthCheckScheduleAsync...");
            var success = await _healthCheckFormService.UpdateHealthCheckScheduleAsync(schedule);
            _logger.LogInformation("UpdateHealthCheckScheduleAsync result: {Success}", success);
            
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "InvalidOperationException in UpdateHealthCheckSchedule");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in UpdateHealthCheckSchedule");
            return StatusCode(500, new { error = "An unexpected error occurred while updating the health check schedule." });
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

    // Debug endpoint to test DTO binding
    [HttpPost("debug/test")]
    public ActionResult TestDTOBinding(HealthCheckFormDTO scheduleDto)
    {
        _logger.LogInformation("=== DEBUG TEST ENDPOINT ===");
        _logger.LogInformation("Raw JSON received and parsed successfully");
        _logger.LogInformation("Title: {Title}", scheduleDto.Title);
        _logger.LogInformation("ScheduledDate: {Date}", scheduleDto.ScheduledDate);
        _logger.LogInformation("StartTime: {StartTime}", scheduleDto.StartTime);
        _logger.LogInformation("GradeIds: {GradeIds}", scheduleDto.GradeIds);
        
        return Ok(new { 
            message = "DTO binding successful",
            receivedData = scheduleDto,
            modelStateValid = ModelState.IsValid,
            modelStateErrors = ModelState.Where(x => x.Value?.Errors?.Count > 0)
                .ToDictionary(k => k.Key, v => v.Value?.Errors?.Select(e => e.ErrorMessage) ?? new List<string>())
        });
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
            await Task.CompletedTask; // Add await to fix async warning
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
            await Task.CompletedTask; // Add await to fix async warning
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
            await Task.CompletedTask; // Add await to fix async warning
            return Ok(staff);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available staff");
            return StatusCode(500, new { error = "An error occurred while retrieving staff." });
        }
    }
} 