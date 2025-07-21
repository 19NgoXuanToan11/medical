using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB; // Assuming your DB entities are in the DB namespace
using Service; // Reference to your Service layer

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IStudentService _studentService;

    public StudentController(IMapper mapper, IStudentService studentService)
    {
        _mapper = mapper;
        _studentService = studentService;
    }

    // GET: api/Student
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto.ViewModel>>> GetStudents()
    {
        var students = await _studentService.GetAllStudentsAsync();
        var studentViewModels = _mapper.Map<IEnumerable<StudentDto.ViewModel>>(students);
        return Ok(studentViewModels);
    }

    // GET: api/Student/5
    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto.ViewModel>> GetStudent(int id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);

        if (student == null)
        {
            return NotFound();
        }

        var studentViewModel = _mapper.Map<StudentDto.ViewModel>(student);
        return Ok(studentViewModel);
    }

    // POST: api/Student
    [HttpPost]
    public async Task<ActionResult<StudentDto.ViewModel>> CreateStudent(StudentDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var student = _mapper.Map<Student>(createDto);
        var createdStudent = await _studentService.CreateStudentAsync(student);

        if (createdStudent == null)
        {
            // Assuming null indicates a conflict like duplicate student code
            return Conflict("Student with the same code already exists.");
        }

        var studentViewModel = _mapper.Map<StudentDto.ViewModel>(createdStudent);
        return CreatedAtAction(nameof(GetStudent), new { id = studentViewModel.StudentId }, studentViewModel);
    }

    // PUT: api/Student/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, StudentDto.Update updateDto)
    {
        if (id != updateDto.StudentId)
        {
            return BadRequest("Student ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var student = _mapper.Map<Student>(updateDto);
        var success = await _studentService.UpdateStudentAsync(student);

        if (!success)
        {
            return NotFound("Student not found or student code already exists.");
        }

        return NoContent();
    }

    // DELETE: api/Student/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var success = await _studentService.DeleteStudentAsync(id);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    // GET: api/Student/by-grade/{grade}
    [HttpGet("by-grade/{grade}")]
    public async Task<ActionResult<IEnumerable<StudentDto.ViewModel>>> GetStudentsByGrade(int grade)
    {
        var students = await _studentService.GetAllStudentsAsync();
        var filtered = students.Where(s => s.Class != null && s.Class.GradeLevel == grade);
        var studentViewModels = _mapper.Map<IEnumerable<StudentDto.ViewModel>>(filtered);
        return Ok(studentViewModels);
    }

    // GET: api/Student/by-code/{studentCode}
    [HttpGet("by-code/{studentCode}")]
    public async Task<ActionResult<StudentDto.ViewModel>> GetStudentByCode(string studentCode)
    {
        var student = await _studentService.GetStudentByCodeAsync(studentCode);

        if (student == null)
        {
            return NotFound();
        }

        var studentViewModel = _mapper.Map<StudentDto.ViewModel>(student);
        return Ok(studentViewModel);
    }

    // GET: api/Student/eligible-for-vaccine
    [HttpGet("eligible-for-vaccine")]
    public async Task<ActionResult<IEnumerable<StudentDto.ViewModel>>> GetEligibleStudentsForVaccine(
        [FromQuery] int vaccineId,
        [FromQuery] DateTime injectionDate,
        [FromQuery] int? classId,
        [FromQuery] List<int>? studentIds)
    {
        // Lấy danh sách học sinh theo classId hoặc theo list id truyền vào
        IEnumerable<Student> students;
        if (classId.HasValue)
        {
            students = (await _studentService.GetAllStudentsAsync()).Where(s => s.Class != null && s.Class.ClassId == classId.Value);
        }
        else if (studentIds != null && studentIds.Count > 0)
        {
            students = (await _studentService.GetAllStudentsAsync()).Where(s => studentIds.Contains(s.StudentId));
        }
        else
        {
            return BadRequest("Phải truyền classId hoặc danh sách studentIds");
        }
        var eligible = await _studentService.GetEligibleStudentsForVaccineAsync(
            vaccineId,
            injectionDate,
            students.Select(s => s.StudentId)
        );
        var viewModels = _mapper.Map<IEnumerable<StudentDto.ViewModel>>(eligible);
        return Ok(viewModels);
    }
} 