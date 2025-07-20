using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;
    private readonly IMapper _mapper;

    public StaffController(IStaffService staffService, IMapper mapper)
    {
        _staffService = staffService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffDto.ViewModel>>> GetStaff()
    {
        var staff = await _staffService.GetAllStaffAsync();
        return Ok(_mapper.Map<IEnumerable<StaffDto.ViewModel>>(staff));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StaffDto.ViewModel>> GetStaff(int id)
    {
        var staff = await _staffService.GetStaffByIdAsync(id);
        if (staff == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<StaffDto.ViewModel>(staff));
    }

    [HttpPost]
    public async Task<ActionResult<StaffDto.ViewModel>> CreateStaff(StaffDto.Create createDto)
    {
        var staff = _mapper.Map<DB.Staff>(createDto);
        var createdStaff = await _staffService.CreateStaffAsync(staff);

        if (createdStaff == null)
        {
            return BadRequest("Username or email already exists");
        }

        return CreatedAtAction(nameof(GetStaff), new { id = createdStaff.StaffId }, 
            _mapper.Map<StaffDto.ViewModel>(createdStaff));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStaff(int id, StaffDto.Update updateDto)
    {
        if (id != updateDto.StaffId)
        {
            return BadRequest("ID mismatch");
        }

        var staff = _mapper.Map<DB.Staff>(updateDto);
        var success = await _staffService.UpdateStaffAsync(staff);

        if (!success)
        {
            return NotFound("Staff not found or update failed");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var success = await _staffService.DeleteStaffAsync(id);
        if (!success)
        {
            return BadRequest("Staff has associated records and cannot be deleted");
        }

        return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult<StaffDto.ViewModel>> Login([FromBody] StaffDto.Create loginDto)
    {
        var isValid = await _staffService.ValidateCredentialsAsync(loginDto.Username, loginDto.Password);
        if (!isValid)
        {
            return Unauthorized("Invalid username or password");
        }

        var staff = await _staffService.GetStaffByUsernameAsync(loginDto.Username);
        return Ok(_mapper.Map<StaffDto.ViewModel>(staff));
    }

    // --- GradeNurse management ---
    [HttpPost("grade-nurse")]
    public async Task<ActionResult<StaffDto.GradeNurseViewModel>> CreateGradeNurse([FromBody] StaffDto.GradeNurseCreate dto)
    {
        var entity = _mapper.Map<DB.GradeNurse>(dto);
        var created = await _staffService.CreateGradeNurseAsync(entity);
        var result = _mapper.Map<StaffDto.GradeNurseViewModel>(created);
        return CreatedAtAction(nameof(GetGradeNurseById), new { id = result.GradeNurseId }, result);
    }

    // GET: api/Staff/my-assigned-grades - Get current nurse's assigned grade levels
    [HttpGet("my-assigned-grades")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IEnumerable<int>>> GetMyAssignedGrades()
    {
        // Get current user ID from JWT token
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
        {
            return Unauthorized("Invalid token or user ID not found");
        }

        // Get current user role from JWT token
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
        if (roleClaim == null || roleClaim.Value.ToLower() != "nurse")
        {
            return Forbid("Only nurses can access their assigned grades");
        }

        // Get nurse's assigned grades
        var gradeNurses = await _staffService.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();
        
        return Ok(assignedGrades);
    }

    [HttpDelete("grade-nurse/{id}")]
    public async Task<IActionResult> DeleteGradeNurse(int id)
    {
        var success = await _staffService.DeleteGradeNurseAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpGet("grade-nurse/by-grade/{grade}")]
    public async Task<ActionResult<IEnumerable<StaffDto.GradeNurseViewModel>>> GetGradeNursesByGrade(int grade)
    {
        var list = await _staffService.GetGradeNursesByGradeAsync(grade);
        return Ok(_mapper.Map<IEnumerable<StaffDto.GradeNurseViewModel>>(list));
    }

    [HttpGet("grade-nurse/by-staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<StaffDto.GradeNurseViewModel>>> GetGradeNursesByStaffId(int staffId)
    {
        var list = await _staffService.GetGradeNursesByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<StaffDto.GradeNurseViewModel>>(list));
    }

    [HttpGet("grade-nurse")]
    public async Task<ActionResult<IEnumerable<StaffDto.GradeNurseViewModel>>> GetAllGradeNurses()
    {
        var list = await _staffService.GetAllGradeNursesAsync();
        return Ok(_mapper.Map<IEnumerable<StaffDto.GradeNurseViewModel>>(list));
    }

    [HttpGet("grade-nurse/{id}")]
    public async Task<ActionResult<StaffDto.GradeNurseViewModel>> GetGradeNurseById(int id)
    {
        var all = await _staffService.GetAllGradeNursesAsync();
        var entity = all.FirstOrDefault(x => x.GradeNurseId == id);
        if (entity == null) return NotFound();
        return Ok(_mapper.Map<StaffDto.GradeNurseViewModel>(entity));
    }

    public class GradeStudentParentResponse
    {
        public IEnumerable<StudentDto.ViewModel> Students { get; set; } = new List<StudentDto.ViewModel>();
        public IEnumerable<StudentParentDto.ViewModel> StudentParents { get; set; } = new List<StudentParentDto.ViewModel>();
    }

    [HttpGet("grade/{grade}/students-parents")]
    public async Task<ActionResult<GradeStudentParentResponse>> GetStudentsAndParentsByGrade(int grade,
        [FromServices] IStudentService studentService,
        [FromServices] IStudentParentService studentParentService,
        [FromServices] IMapper mapper)
    {
        var students = await studentService.GetAllStudentsAsync();
        var filteredStudents = students.Where(s => s.Class != null && s.Class.GradeLevel == grade);
        var studentViewModels = mapper.Map<IEnumerable<StudentDto.ViewModel>>(filteredStudents);

        var studentParents = await studentParentService.GetAllStudentParentsAsync();
        var filteredStudentParents = studentParents.Where(sp => sp.Student != null && sp.Student.Class != null && sp.Student.Class.GradeLevel == grade);
        var studentParentViewModels = mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(filteredStudentParents);

        var response = new GradeStudentParentResponse
        {
            Students = studentViewModels,
            StudentParents = studentParentViewModels
        };
        return Ok(response);
    }
} 