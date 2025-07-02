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
        var result = medicineRequests.Select(req => new ParentDto.MedicineRequestProgress
        {
            RequestId = req.RequestId,
            Status = req.Status ?? string.Empty,
            StudentCode = req.StudentCode ?? string.Empty,
            ClassName = req.ClassName,
            ParentId = req.ParentId ?? 0,
            StaffId = req.StaffId,
            Date = req.Date,
            RequestDate = req.RequestDate ?? System.DateTime.MinValue,
            MedicineRequestItems = req.MedicineRequestItems.Select(i => new MedicineRequestItemDto.ViewModel
            {
                MedicineRequestItemId = i.MedicineRequestItemId,
                MedicineRequestId = i.MedicineRequestId,
                MedicineName = i.MedicineName,
                Dosage = i.Dosage,
                Frequency = i.Frequency,
                TimeOfDay = i.TimeOfDay,
                Instructions = i.Instructions
            }).ToList(),
            Progress = req.RequestResults
                .OrderByDescending(r => r.SubmittedAt)
                .Select(r => new RequestResultDto.ViewModel
                {
                    ResultId = r.ResultId,
                    RequestId = r.RequestId ?? 0,
                    AdministeredTime = r.AdministeredTime,
                    Status = r.Status,
                    SubmittedAt = r.SubmittedAt ?? System.DateTime.MinValue,
                    Frequency = r.Frequency,
                    TimesPerDay = r.TimesPerDay,
                    CurrentDayCount = r.CurrentDayCount,
                    CurrentDate = r.CurrentDate,
                    AdministeredFrequencies = string.IsNullOrEmpty(r.AdministeredFrequencies) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.AdministeredFrequencies),
                    FailedFrequencies = string.IsNullOrEmpty(r.FailedFrequencies) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(r.FailedFrequencies),
                    FailureReasons = string.IsNullOrEmpty(r.FailureReasons) ? new Dictionary<string, string>() : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(r.FailureReasons),
                    IsReRequest = r.IsReRequest,
                    OriginalRequestResultId = r.OriginalRequestResultId,
                    LastAttemptTime = r.LastAttemptTime,
                    FailedAttempts = r.FailedAttempts,
                    ReRequestReason = r.ReRequestReason
                }).ToList()
        }).ToList();
        return Ok(result);
    }
}