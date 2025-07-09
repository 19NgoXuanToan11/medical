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

    // GET: api/Class/5/students
    [HttpGet("{id}/students")]
    public async Task<ActionResult<IEnumerable<ClassDto.StudentWithParents>>> GetClassStudents(int id)
    {
        var students = await _classService.GetStudentsByClassIdAsync(id);
        var viewModels = _mapper.Map<IEnumerable<ClassDto.StudentWithParents>>(students);
        return Ok(viewModels);
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
} 