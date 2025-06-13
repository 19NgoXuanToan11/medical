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
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetStudentParents()
        {
            var studentParents = await _studentParentService.GetAllStudentParentsAsync();
            var viewModels = _mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(studentParents);
            return Ok(viewModels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentParentDto.ViewModel>> GetStudentParent(int id)
        {
            var studentParent = await _studentParentService.GetStudentParentByIdAsync(id);
            if (studentParent == null)
            {
                return NotFound();
            }

            var viewModel = _mapper.Map<StudentParentDto.ViewModel>(studentParent);
            return Ok(viewModel);
        }

        [HttpGet("student/{studentCode}")]
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetStudentParentsByStudentCode(string studentCode)
        {
            var studentParents = await _studentParentService.GetStudentParentsByStudentCodeAsync(studentCode);
            var viewModels = _mapper.Map<IEnumerable<StudentParentDto.ViewModel>>(studentParents);
            return Ok(viewModels);
        }

        [HttpGet("parent/{parentId}")]
        public async Task<ActionResult<IEnumerable<StudentParentDto.ViewModel>>> GetStudentParentsByParentId(int parentId)
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
                return BadRequest("Invalid student code or parent ID.");
            }

            var viewModel = _mapper.Map<StudentParentDto.ViewModel>(createdStudentParent);
            return CreatedAtAction(nameof(GetStudentParent), new { id = viewModel.StudentParentId }, viewModel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudentParent(int id, StudentParentDto.Update updateDto)
        {
            if (id != updateDto.StudentParentId)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studentParent = _mapper.Map<StudentParent>(updateDto);
            var success = await _studentParentService.UpdateStudentParentAsync(studentParent);

            if (!success)
            {
                return NotFound("Student parent relationship not found or invalid student code.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudentParent(int id)
        {
            var success = await _studentParentService.DeleteStudentParentAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
} 