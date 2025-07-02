using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;
using System.Text.Json;

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

    // GET: api/MedicineRequest/available-nurses
    [HttpGet("available-nurses")]
    public async Task<ActionResult<IEnumerable<StaffDto.ViewModel>>> GetAvailableNurses()
    {
        var nurses = await _medicineRequestService.GetAvailableNursesAsync();
        var viewModels = _mapper.Map<IEnumerable<StaffDto.ViewModel>>(nurses);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/pending
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetPendingRequests()
    {
        var requests = await _medicineRequestService.GetPendingRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
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

        // Map the DTO to entity
        var medicineRequest = _mapper.Map<MedicineRequest>(createDto);
        
        // Set default status to Pending
        medicineRequest.Status = "Pending";
        
        // Set request date to current time
        medicineRequest.RequestDate = DateTime.UtcNow;

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

    // POST: api/MedicineRequest/{id}/assign-nurse/{staffId}
    [HttpPost("{id}/assign-nurse/{staffId}")]
    public async Task<IActionResult> AssignNurseToRequest(int id, int staffId)
    {
        var success = await _medicineRequestService.AssignNurseToRequestAsync(id, staffId);
        if (!success)
        {
            return BadRequest("Failed to assign nurse. The nurse might have reached the maximum limit of 5 pending requests or the request is not in pending status.");
        }
        return NoContent();
    }

    // POST: api/MedicineRequest/{id}/complete/{staffId}
    [HttpPost("{id}/complete/{staffId}")]
    public async Task<IActionResult> CompleteRequest(int id, int staffId)
    {
        var success = await _medicineRequestService.CompleteRequestAsync(id, staffId);
        if (!success)
        {
            return BadRequest("Failed to complete request. The request might not exist or you might not be assigned to it.");
        }
        return NoContent();
    }

    // New frequency-based endpoints

    // POST: api/MedicineRequest/{id}/start-administration/{staffId}
    [HttpPost("{id}/start-administration/{staffId}")]
    public async Task<ActionResult<RequestResultDto.ViewModel>> StartMedicineRequest(int id, int staffId)
    {
        var requestResult = await _medicineRequestService.StartMedicineRequestAsync(id, staffId);
        if (requestResult == null)
        {
            return BadRequest("Failed to start medicine request. The request might not exist or you might not be assigned to it.");
        }
        var viewModel = _mapper.Map<RequestResultDto.ViewModel>(requestResult);
        return Ok(viewModel);
    }

    // POST: api/MedicineRequest/administer-frequency
    [HttpPost("administer-frequency")]
    public async Task<IActionResult> AdministerMedicineByFrequency(RequestResultDto.FrequencyCompleteRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _medicineRequestService.AdministerMedicineByFrequencyAsync(
            request.RequestResultId, 
            request.MedicineRequestItemId, 
            request.Frequency, 
            request.StaffId,
            request.Notes);

        if (!success)
        {
            return BadRequest("Failed to administer medicine. This frequency might have already been administered today.");
        }
        return NoContent();
    }

    // GET: api/MedicineRequest/{requestResultId}/progress/{medicineRequestItemId}
    [HttpGet("{requestResultId}/progress/{medicineRequestItemId}")]
    public async Task<ActionResult<object>> GetProgressInfo(int requestResultId, int medicineRequestItemId)
    {
        var (isCompleted, pendingFrequencies) = await _medicineRequestService.GetProgressInfoAsync(requestResultId, medicineRequestItemId);
        return Ok(new { isCompleted, pendingFrequencies });
    }

    // GET: api/MedicineRequest/{requestResultId}/re-request-info
    [HttpGet("{requestResultId}/re-request-info")]
    public async Task<ActionResult<object>> GetReRequestInfo(int requestResultId)
    {
        var (canReRequest, _) = await _medicineRequestService.GetReRequestInfoAsync(requestResultId);
        return Ok(new { canReRequest });
    }

    // POST: api/MedicineRequest/report-failure
    [HttpPost("report-failure")]
    public async Task<IActionResult> ReportMedicineFailure(RequestResultDto.FailureReport request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _medicineRequestService.ReportMedicineFailureAsync(
            request.RequestResultId,
            request.MedicineRequestItemId,
            request.Frequency,
            request.FailureReason,
            request.StaffId
        );

        if (!success)
        {
            return BadRequest("Failed to report medicine failure.");
        }
        return NoContent();
    }

    // POST: api/MedicineRequest/create-re-request
    [HttpPost("create-re-request")]
    public async Task<ActionResult<RequestResultDto.ViewModel>> CreateReRequest(RequestResultDto.ReRequestCreate request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var reRequest = await _medicineRequestService.CreateReRequestAsync(
            request.OriginalRequestResultId,
            request.ReRequestReason,
            request.StaffId ?? 1); // TODO: Get actual staff ID from authentication

        if (reRequest == null)
        {
            return BadRequest("Failed to create re-request. It might be past 5 PM or the original request doesn't exist.");
        }

        var viewModel = _mapper.Map<RequestResultDto.ViewModel>(reRequest);
        return Ok(viewModel);
    }

    // POST: api/MedicineRequest/update-time-based-status
    [HttpPost("update-time-based-status")]
    public async Task<IActionResult> UpdateTimeBasedStatus()
    {
        var success = await _medicineRequestService.UpdateTimeBasedStatusAsync();
        if (!success)
        {
            return BadRequest("Failed to update time-based status.");
        }
        return NoContent();
    }

    // GET: api/MedicineRequest/failed-requests
    [HttpGet("failed-requests")]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetFailedRequests()
    {
        var failedRequests = await _medicineRequestService.GetFailedRequestsAsync();
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(failedRequests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/{originalRequestResultId}/re-requests
    [HttpGet("{originalRequestResultId}/re-requests")]
    public async Task<ActionResult<IEnumerable<RequestResultDto.ViewModel>>> GetReRequests(int originalRequestResultId)
    {
        var reRequests = await _medicineRequestService.GetReRequestsAsync(originalRequestResultId);
        var viewModels = _mapper.Map<IEnumerable<RequestResultDto.ViewModel>>(reRequests);
        return Ok(viewModels);
    }

    // POST: api/MedicineRequest/{requestResultId}/mark-failed
    [HttpPost("{requestResultId}/mark-failed")]
    public async Task<IActionResult> MarkRequestAsFailed(int requestResultId, [FromBody] string reason)
    {
        var success = await _medicineRequestService.MarkRequestAsFailedAsync(requestResultId, reason);
        if (!success)
        {
            return BadRequest("Failed to mark request as failed.");
        }
        return NoContent();
    }

    // GET: api/MedicineRequest/{requestResultId}/failure-summary
    [HttpGet("{requestResultId}/failure-summary")]
    public async Task<ActionResult<object>> GetFailureSummary(int requestResultId)
    {
        var requestResult = await _medicineRequestService.GetRequestResultByIdAsync(requestResultId);
        if (requestResult == null)
        {
            return NotFound();
        }
        // Parse JSON string to object for FailedFrequencies and FailureReasons
        var failedFrequencies = string.IsNullOrEmpty(requestResult.FailedFrequencies)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(requestResult.FailedFrequencies);
        var failureReasons = string.IsNullOrEmpty(requestResult.FailureReasons)
            ? new Dictionary<string, string>()
            : JsonSerializer.Deserialize<Dictionary<string, string>>(requestResult.FailureReasons);
        var summary = new
        {
            Status = requestResult.Status,
            FailedFrequencies = failedFrequencies,
            FailureReasons = failureReasons,
            IsEligibleForReRequest = await _medicineRequestService.IsRequestEligibleForReRequestAsync(requestResultId)
        };
        return Ok(summary);
    }

    // GET: api/MedicineRequest/frequency/more-than-one
    [HttpGet("frequency/more-than-one")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetRequestsWithFrequencyMoreThanOne()
    {
        var requests = await _medicineRequestService.GetRequestsWithFrequencyMoreThanOneAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        return Ok(viewModels);
    }

    // GET: api/MedicineRequest/frequency/need-time-of-day
    [HttpGet("frequency/need-time-of-day")]
    public async Task<ActionResult<IEnumerable<MedicineRequestDto.ViewModel>>> GetRequestsNeedingTimeOfDay([FromQuery] string time)
    {
        var requests = await _medicineRequestService.GetRequestsNeedingTimeOfDayAsync(time);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(requests);
        return Ok(viewModels);
    }
} 