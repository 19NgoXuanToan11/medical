using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthProfileController : ControllerBase
{
    private readonly IHealthProfileService _healthProfileService;
    private readonly IMapper _mapper;

    public HealthProfileController(IHealthProfileService healthProfileService, IMapper mapper)
    {
        _healthProfileService = healthProfileService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthProfileDto.ViewModel>>> GetAllHealthProfiles()
    {
        var profiles = await _healthProfileService.GetAllHealthProfilesAsync();
        return Ok(_mapper.Map<IEnumerable<HealthProfileDto.ViewModel>>(profiles));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> GetHealthProfileById(int id)
    {
        var profile = await _healthProfileService.GetHealthProfileByIdAsync(id);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDto.ViewModel>(profile));
    }

    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> GetHealthProfileByStudentCode(string studentCode)
    {
        var profile = await _healthProfileService.GetHealthProfileByStudentCodeAsync(studentCode);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDto.ViewModel>(profile));
    }

    [HttpGet("my-assigned-students")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IEnumerable<HealthProfileDto.ViewModel>>> GetMyAssignedStudentsHealthProfiles([FromServices] IStaffService staffService)
    {
        // Lấy staffId từ JWT
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
        {
            return Unauthorized("Invalid token or user ID not found");
        }
        // Kiểm tra role
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
        if (roleClaim == null || roleClaim.Value.ToLower() != "nurse")
        {
            return Forbid("Only nurses can access their assigned students' health profiles");
        }
        // Lấy danh sách khối nurse phụ trách
        var gradeNurses = await staffService.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();
        if (!assignedGrades.Any())
        {
            return Ok(new List<HealthProfileDto.ViewModel>()); // Không có khối nào
        }
        // Lấy hồ sơ sức khỏe theo khối
        var profiles = await _healthProfileService.GetHealthProfilesByGradeListAsync(assignedGrades);
        return Ok(_mapper.Map<IEnumerable<HealthProfileDto.ViewModel>>(profiles));
    }

    // DEBUG endpoint to check nurse grade assignments
    [HttpGet("debug/nurse-grades/{staffId}")]
    public async Task<ActionResult> GetNurseGradeAssignments(int staffId, [FromServices] IStaffService staffService)
    {
        try
        {
            var staff = await staffService.GetStaffByIdAsync(staffId);
            var gradeNurses = await staffService.GetGradeNursesByStaffIdAsync(staffId);
            var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();
            
            var allProfiles = await _healthProfileService.GetAllHealthProfilesAsync();
            var profilesByGrade = assignedGrades.ToDictionary(
                grade => grade,
                grade => allProfiles.Where(p => p.Student?.Class?.GradeLevel == grade).Count()
            );

            return Ok(new {
                StaffId = staffId,
                StaffName = staff != null ? $"{staff.FirstName} {staff.LastName}" : "Not found",
                Role = staff?.Role?.RoleName,
                AssignedGrades = assignedGrades,
                GradeNurseAssignments = gradeNurses.Select(gn => new {
                    GradeNurseId = gn.GradeNurseId,
                    Grade = gn.Grade,
                    StaffId = gn.StaffId
                }),
                ProfileCountByGrade = profilesByGrade,
                TotalProfiles = profilesByGrade.Values.Sum()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Debug error", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> CreateHealthProfile(HealthProfileDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(createDto);
            var createdProfile = await _healthProfileService.CreateHealthProfileAsync(healthProfile);
            return CreatedAtAction(
                nameof(GetHealthProfileById),
                new { id = createdProfile.HealthProfileId },
                _mapper.Map<HealthProfileDto.ViewModel>(createdProfile));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthProfile(int id, HealthProfileDto.Update updateDto)
    {
        if (id != updateDto.HealthProfileId)
        {
            return BadRequest("ID mismatch");
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(updateDto);
            healthProfile.HealthProfileId = id; // Ensure the ID is set correctly for update
            var success = await _healthProfileService.UpdateHealthProfileAsync(healthProfile);
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
    public async Task<IActionResult> DeleteHealthProfile(int id)
    {
        var success = await _healthProfileService.DeleteHealthProfileAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 