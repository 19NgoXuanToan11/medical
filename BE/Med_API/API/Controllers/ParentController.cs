using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IParentService _parentService;

    public ParentController(IMapper mapper, IParentService parentService)
    {
        _mapper = mapper;
        _parentService = parentService;
    }

    // GET: api/Parent
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParentDto.ViewModel>>> GetParents()
    {
        var parents = await _parentService.GetAllParentsAsync();
        var parentViewModels = _mapper.Map<IEnumerable<ParentDto.ViewModel>>(parents);
        return Ok(parentViewModels);
    }

    // GET: api/Parent/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ParentDto.ViewModel>> GetParent(int id)
    {
        var parent = await _parentService.GetParentByIdAsync(id);

        if (parent == null)
        {
            return NotFound();
        }

        var parentViewModel = _mapper.Map<ParentDto.ViewModel>(parent);
        return Ok(parentViewModel);
    }

    // GET: api/Parent/student/5
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<ParentDto.ViewModel>>> GetParentsByStudent(int studentId)
    {
        var parents = await _parentService.GetParentsByStudentIdAsync(studentId);
        var parentViewModels = _mapper.Map<IEnumerable<ParentDto.ViewModel>>(parents);
        return Ok(parentViewModels);
    }

    // POST: api/Parent
    [HttpPost]
    public async Task<ActionResult<ParentDto.ViewModel>> CreateParent(ParentDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var parent = _mapper.Map<Parent>(createDto);
        var createdParent = await _parentService.CreateParentAsync(parent);

        if (createdParent == null)
        {
            return BadRequest("Parent must be associated with a student.");
        }

        var parentViewModel = _mapper.Map<ParentDto.ViewModel>(createdParent);
        return CreatedAtAction(nameof(GetParent), new { id = parentViewModel.ParentId }, parentViewModel);
    }

    // PUT: api/Parent/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateParent(int id, ParentDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var parent = _mapper.Map<Parent>(updateDto);
        parent.ParentId = id;

        var success = await _parentService.UpdateParentAsync(parent);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Parent/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParent(int id)
    {
        var success = await _parentService.DeleteParentAsync(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}