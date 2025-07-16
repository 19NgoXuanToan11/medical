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
            return BadRequest("Student not found or parent with same phone/email already exists.");
        }

        var parentViewModel = _mapper.Map<ParentDto.ViewModel>(createdParent);
        return CreatedAtAction(nameof(GetParent), new { id = parentViewModel.ParentId }, parentViewModel);
    }

    // PUT: api/Parent/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateParent(int id, ParentDto.Update updateDto)
    {
        if (id != updateDto.ParentId)
        {
            return BadRequest("Parent ID mismatch.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var parent = _mapper.Map<Parent>(updateDto);
        var success = await _parentService.UpdateParentAsync(parent);

        if (!success)
        {
            return NotFound("Parent not found, student not found, or parent with same phone/email already exists.");
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
            return NotFound("Parent not found or has associated records.");
        }

        return NoContent();
    }

    // GET: api/Parent/{parentId}/medicine-request-progress
    [HttpGet("{parentId}/medicine-request-progress")]
    public async Task<ActionResult<IEnumerable<ParentDto.MedicineRequestProgress>>> GetMedicineRequestProgress(int parentId)
    {
        var medicineRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var result = _mapper.Map<IEnumerable<ParentDto.MedicineRequestProgress>>(medicineRequests);
        return Ok(result);
    }

    // GET: api/Parent/{parentId}/refused-medicine-requests
    [HttpGet("{parentId}/refused-medicine-requests")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetRefusedMedicineRequestsByParent(int parentId)
    {
        var refusedRequests = await _parentService.GetRefusedMedicineRequestsByParentIdAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(refusedRequests);
        return Ok(viewModels);
    }

    // GET: api/Parent/{parentId}/failed-request-results
    [HttpGet("{parentId}/failed-request-results")]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetFailedRequestResultsByParent(int parentId)
    {
        var failedResults = await _parentService.GetFailedRequestResultsByParentIdAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(failedResults);
        return Ok(viewModels);
    }
}