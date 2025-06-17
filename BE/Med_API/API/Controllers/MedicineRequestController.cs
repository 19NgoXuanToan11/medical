using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicineRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IMedicineRequestService _medicineRequestService;

    public MedicineRequestController(IMapper mapper, IMedicineRequestService medicineRequestService)
    {
        _mapper = mapper;
        _medicineRequestService = medicineRequestService;
    }

    // GET: api/MedicineRequest
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequests()
    {
        var medicineRequests = await _medicineRequestService.GetAllMedicineRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicineRequestDto.ViewModel>> GetMedicineRequest(int id)
    {
        var medicineRequest = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (medicineRequest == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<MedicineRequestDto.ViewModel>(medicineRequest);
        return Ok(viewModel);
    }

    // GET: api/MedicineRequest/student/ABC123
    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStudent(string studentCode)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStudentCodeAsync(studentCode);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/parent/5
    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByParent(int parentId)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByParentIdAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/staff/5
    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStaff(int staffId)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStaffIdAsync(staffId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/status/pending
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetMedicineRequestsByStatus(string status)
    {
        var medicineRequests = await _medicineRequestService.GetMedicineRequestsByStatusAsync(status);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(medicineRequests);
        return Ok(viewModels);
    }

    // POST: api/MedicineRequest
    [HttpPost]
    public async Task<ActionResult<MedicineRequestDto.ViewModel>> CreateMedicineRequest(MedicineRequestDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        if (createDto.MedicineRequestItems == null || !createDto.MedicineRequestItems.Any())
        {
            return BadRequest("Medicine request must contain at least one medicine item.");
        }
        var medicineRequest = _mapper.Map<MedicineRequest>(createDto);
        var created = await _medicineRequestService.CreateMedicineRequestAsync(medicineRequest);
        if (created == null)
        {
            return BadRequest("Failed to create medicine request.");
        }
        var viewModel = _mapper.Map<MedicineRequestDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetMedicineRequest), new { id = viewModel.RequestId }, viewModel);
    }

    // PUT: api/MedicineRequest/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicineRequest(int id, MedicineRequestDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        // Retrieve the existing request to ensure we are updating the correct entity
        var existingRequest = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
        if (existingRequest == null)
        {
            return NotFound();
        }

        _mapper.Map(updateDto, existingRequest);
        existingRequest.RequestId = id; // Ensure ID is set for update

        var success = await _medicineRequestService.UpdateMedicineRequestAsync(existingRequest);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // DELETE: api/MedicineRequest/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicineRequest(int id)
    {
        var success = await _medicineRequestService.DeleteMedicineRequestAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 