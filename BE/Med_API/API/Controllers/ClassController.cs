using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Service;
using API.DTOs;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController : ControllerBase
{
    private readonly IClassService _classService;
    private readonly IMapper _mapper;

    public ClassController(IClassService classService, IMapper mapper)
    {
        _classService = classService;
        _mapper = mapper;
    }

    // GET: api/Class
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassDto.ViewModel>>> GetClasses()
    {
        var classes = await _classService.GetAllClassesAsync();
        var viewModels = _mapper.Map<IEnumerable<ClassDto.ViewModel>>(classes);
        return Ok(viewModels);
    }

    // GET: api/Class/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto.ViewModel>> GetClass(int id)
    {
        var classEntity = await _classService.GetClassByIdAsync(id);
        if (classEntity == null)
        {
            return NotFound($"Class with ID {id} not found.");
        }

        var viewModel = _mapper.Map<ClassDto.ViewModel>(classEntity);
        return Ok(viewModel);
    }

    // GET: api/Class/active
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<ClassDto.ViewModel>>> GetActiveClasses()
    {
        var classes = await _classService.GetActiveClassesAsync();
        var viewModels = _mapper.Map<IEnumerable<ClassDto.ViewModel>>(classes);
        return Ok(viewModels);
    }

    // GET: api/Class/grade/5
    [HttpGet("grade/{gradeLevel}")]
    public async Task<ActionResult<IEnumerable<ClassDto.ViewModel>>> GetClassesByGrade(int gradeLevel)
    {
        var classes = await _classService.GetClassesByGradeLevelAsync(gradeLevel);
        var viewModels = _mapper.Map<IEnumerable<ClassDto.ViewModel>>(classes);
        return Ok(viewModels);
    }

    // GET: api/Class/my-assigned-classes - Get classes for current nurse's assigned grade levels
    [HttpGet("my-assigned-classes")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<IEnumerable<ClassDto.ViewModel>>> GetMyAssignedClasses(
        [FromServices] IStaffService staffService)
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
            return Forbid("Only nurses can access their assigned classes");
        }

        // Get nurse's assigned grades
        var gradeNurses = await staffService.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();

        if (!assignedGrades.Any())
        {
            return Ok(new List<ClassDto.ViewModel>()); // Return empty list if no grades assigned
        }

        // Get all classes and filter by assigned grades
        var allClasses = await _classService.GetActiveClassesAsync();
        var assignedClasses = allClasses.Where(c => assignedGrades.Contains(c.GradeLevel));
        var viewModels = _mapper.Map<IEnumerable<ClassDto.ViewModel>>(assignedClasses);
        
        return Ok(viewModels);
    }

    // GET: api/Class/my-assigned-classes-with-students
    [HttpGet("my-assigned-classes-with-students")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult> GetMyAssignedClassesWithStudents([FromServices] IStaffService staffService)
    {
        // Lấy staffId từ JWT
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
        {
            return Unauthorized("Invalid token or user ID not found");
        }
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
        if (roleClaim == null || roleClaim.Value.ToLower() != "nurse")
        {
            return Forbid("Only nurses can access their assigned classes");
        }
        // Lấy khối nurse phụ trách (chỉ lấy 1 khối đầu tiên)
        var gradeNurses = await staffService.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrade = gradeNurses.Select(gn => gn.Grade).FirstOrDefault();
        if (assignedGrade == 0)
        {
            return Ok(new List<object>()); // Không có khối nào
        }
        // Lấy các lớp thuộc khối này
        var allClasses = await _classService.GetActiveClassesAsync();
        var assignedClasses = allClasses.Where(c => c.GradeLevel == assignedGrade).ToList();
        var result = new List<object>();
        foreach (var classEntity in assignedClasses)
        {
            var students = (await _classService.GetStudentsByClassIdAsync(classEntity.ClassId))
                .OrderBy(s => s.LastName).ThenBy(s => s.FirstName)
                .Select((s, idx) => new {
                    SoThuTu = idx + 1,
                    HoTen = $"{s.LastName} {s.FirstName}",
                    MaSoHocSinh = s.StudentCode,
                    GioiTinh = s.Gender,
                    SucKhoe = s.HealthProfiles != null ? s.HealthProfiles.FirstOrDefault() : null
                }).ToList();
            result.Add(new
            {
                ClassId = classEntity.ClassId,
                ClassName = classEntity.ClassName,
                GradeLevel = classEntity.GradeLevel,
                Students = students
            });
        }
        return Ok(result);
    }

    // GET: api/Class/5/students
    [HttpGet("{id}/students")]
    public async Task<ActionResult<IEnumerable<ClassDto.StudentWithParents>>> GetClassStudents(int id)
    {
        var students = await _classService.GetStudentsByClassIdAsync(id);
        var viewModels = _mapper.Map<IEnumerable<ClassDto.StudentWithParents>>(students);
        return Ok(viewModels);
    }

    // GET: api/Class/{classId}/students-with-health
    [HttpGet("{classId}/students-with-health")]
    public async Task<ActionResult> GetClassStudentsWithHealth(int classId)
    {
        var students = await _classService.GetStudentsByClassIdAsync(classId);
        var result = students
            .OrderBy(s => s.LastName).ThenBy(s => s.FirstName)
            .Select((s, idx) => new {
                SoThuTu = idx + 1,
                HoTen = $"{s.LastName} {s.FirstName}",
                MaSoHocSinh = s.StudentCode,
                SucKhoe = s.HealthProfiles != null ? s.HealthProfiles.FirstOrDefault() : null
            }).ToList();
        return Ok(result);
    }

    // POST: api/Class
    [HttpPost]
    public async Task<ActionResult<ClassDto.ViewModel>> CreateClass(ClassDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var classEntity = _mapper.Map<Class>(createDto);
        var createdClass = await _classService.CreateClassAsync(classEntity);

        if (createdClass == null)
        {
            return Conflict("A class with the same name and grade already exists, or the data is invalid.");
        }

        var viewModel = _mapper.Map<ClassDto.ViewModel>(createdClass);
        return CreatedAtAction(nameof(GetClass), new { id = viewModel.ClassId }, viewModel);
    }

    // PUT: api/Class/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClass(int id, ClassDto.Update updateDto)
    {
        if (id != updateDto.ClassId)
        {
            return BadRequest("Class ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var classEntity = _mapper.Map<Class>(updateDto);
        var success = await _classService.UpdateClassAsync(classEntity);

        if (!success)
        {
            return BadRequest("Update failed. Class may not exist or a class with the same name already exists.");
        }

        return NoContent();
    }

    // DELETE: api/Class/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        var success = await _classService.DeleteClassAsync(id);
        if (!success)
        {
            return NotFound($"Class with ID {id} not found.");
        }

        return NoContent();
    }

    // POST: api/Class/assign-student
    [HttpPost("assign-student")]
    public async Task<IActionResult> AssignStudentToClass(ClassDto.AssignStudent assignDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _classService.AssignStudentToClassAsync(assignDto.StudentId, assignDto.ClassId);
        if (!success)
        {
            return BadRequest("Failed to assign student to class. Student may not exist, class may be full, or class may be inactive.");
        }

        return Ok(new { message = "Student successfully assigned to class." });
    }

    // POST: api/Class/remove-student/5
    [HttpPost("remove-student/{studentId}")]
    public async Task<IActionResult> RemoveStudentFromClass(int studentId)
    {
        var success = await _classService.RemoveStudentFromClassAsync(studentId);
        if (!success)
        {
            return BadRequest("Failed to remove student from class. Student may not exist.");
        }

        return Ok(new { message = "Student successfully removed from class." });
    }

    // GET: api/Class/summary
    [HttpGet("summary")]
    public async Task<ActionResult> GetClassSummary()
    {
        var classes = await _classService.GetActiveClassesAsync();
        
        var summary = new
        {
            TotalClasses = classes.Count(),
            TotalStudents = classes.Sum(c => c.CurrentStudentCount ?? 0),
            ClassesByGrade = classes
                .GroupBy(c => c.GradeLevel)
                .Select(g => new
                {
                    Grade = g.Key,
                    ClassCount = g.Count(),
                    StudentCount = g.Sum(c => c.CurrentStudentCount ?? 0)
                })
                .OrderBy(x => x.Grade)
                .ToList()
        };

        return Ok(summary);
    }

    // POST: api/Class/promote-students
    [HttpPost("promote-students")]
    public async Task<IActionResult> PromoteStudentsToNextClass()
    {
        var promotedCount = await _classService.PromoteStudentsToNextClassIfNewYearAsync();
        if (promotedCount == 0)
        {
            return Ok(new { message = "Promotion not performed. It's not yet the start of the new school year." });
        }
        return Ok(new { message = $"{promotedCount} students promoted to the next class." });
    }

    // GET: api/Class/grade/{gradeLevel}/student-count
    [HttpGet("grade/{gradeLevel}/student-count")]
    public async Task<ActionResult> GetStudentCountByGrade(int gradeLevel)
    {
        var classes = await _classService.GetClassesByGradeLevelAsync(gradeLevel);
        int total = classes.SelectMany(c => c.Students).Count();
        return Ok(new { GradeLevel = gradeLevel, StudentCount = total });
    }
} 