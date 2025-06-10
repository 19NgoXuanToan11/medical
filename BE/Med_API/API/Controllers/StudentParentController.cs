using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Service;
using API.DTOs;
using DB;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentParentController : ControllerBase
    {
        private readonly IStudentParentService _studentParentService;
        private readonly IMapper _mapper;

        public StudentParentController(IStudentParentService studentParentService, IMapper mapper)
        {
            _studentParentService = studentParentService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetAll()
        {
            var studentParents = await _studentParentService.GetAllStudentParentsAsync();
            var viewModels = _mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(studentParents);
            return Ok(viewModels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentParentDto.ViewModel>> GetById(int id)
        {
            var studentParent = await _studentParentService.GetStudentParentByIdAsync(id);
            if (studentParent == null)
            {
                return NotFound();
            }

            var viewModel = _mapper.Map<StudentParentDto.ViewModel>(studentParent);
            return Ok(viewModel);
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetByStudentId(int studentId)
        {
            var studentParents = await _studentParentService.GetStudentParentsByStudentIdAsync(studentId);
            var viewModels = _mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(studentParents);
            return Ok(viewModels);
        }

        [HttpGet("parent/{parentId}")]
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetByParentId(int parentId)
        {
            var studentParents = await _studentParentService.GetStudentParentsByParentIdAsync(parentId);
            var viewModels = _mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(studentParents);
            return Ok(viewModels);
        }

        [HttpPost]
        public async Task<ActionResult<StudentParentDto.ViewModel>> CreateStudentParent(StudentParentDto.Create createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studentParent = _mapper.Map<StudentParent>(createDto);
            var createdStudentParent = await _studentParentService.CreateStudentParentAsync(studentParent);

            if (createdStudentParent == null)
            {
                return Conflict("Student-Parent relationship already exists or invalid student/parent IDs.");
            }

            var studentParentViewModel = _mapper.Map<StudentParentDto.ViewModel>(createdStudentParent);
            return CreatedAtAction(nameof(GetById), new { id = studentParentViewModel.StudentParentId }, studentParentViewModel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudentParent(int id, StudentParentDto.Update updateDto)
        {
            if (id != updateDto.StudentParentId)
            {
                return BadRequest("StudentParent ID mismatch");
            }

            var studentParent = _mapper.Map<StudentParent>(updateDto);
            var success = await _studentParentService.UpdateStudentParentAsync(studentParent);

            if (!success)
            {
                return NotFound("StudentParent relationship not found or would create a duplicate relationship");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudentParent(int id)
        {
            var success = await _studentParentService.DeleteStudentParentAsync(id);

            if (!success)
            {
                return NotFound("StudentParent relationship not found");
            }

            return NoContent();
        }
    }
} 