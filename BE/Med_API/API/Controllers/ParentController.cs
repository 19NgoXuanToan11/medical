using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;
using Service.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IParentService _parentService;
    private readonly ILogger<ParentController> _logger;

    public ParentController(IMapper mapper, IParentService parentService, ILogger<ParentController> logger)
    {
        _mapper = mapper;
        _parentService = parentService;
        _logger = logger;
    }

    private static bool IsRefusedStatus(object val)
    {
        if (val is string s)
        {
            if (s == "Refused") return true;
            if (s.StartsWith("{") && s.Contains("Status"))
            {
                try
                {
                    var jsonElem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(s);
                    if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object &&
                        jsonElem.TryGetProperty("Status", out var statusPropInner) &&
                        statusPropInner.GetString() == "Refused")
                        return true;
                }
                catch { }
            }
        }
        if (val is System.Text.Json.JsonElement elem &&
            elem.ValueKind == System.Text.Json.JsonValueKind.Object &&
            elem.TryGetProperty("Status", out var statusProp) &&
            statusProp.GetString() == "Refused")
            return true;
        return false;
    }

    private static bool IsFailedStatus(object val)
    {
        if (val is string s)
        {
            if (s == "Failed") return true;
            if (s.StartsWith("{") && s.Contains("Status"))
            {
                try
                {
                    var jsonElem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(s);
                    if (jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object &&
                        jsonElem.TryGetProperty("Status", out var statusPropInner) &&
                        statusPropInner.GetString() == "Failed")
                        return true;
                }
                catch { }
            }
        }
        if (val is System.Text.Json.JsonElement elem &&
            elem.ValueKind == System.Text.Json.JsonValueKind.Object &&
            elem.TryGetProperty("Status", out var statusProp) &&
            statusProp.GetString() == "Failed")
            return true;
        return false;
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
        // Get all requests for the parent
        var allRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        // Only keep items with at least one period whose latest status is 'Refused'
        foreach (var req in viewModels)
        {
            req.MedicineRequestItems = req.MedicineRequestItems
                .Where(item => item.PeriodVerificationStatus != null &&
                    item.PeriodVerificationStatus.Values.Any(val => IsRefusedStatus(val))
                ).ToList();
        }
        viewModels = viewModels.Where(r => r.MedicineRequestItems.Any()).ToList();
        return Ok(viewModels);
    }

    // GET: api/Parent/{parentId}/failed-request-results
    [HttpGet("{parentId}/failed-request-results")]
    public async Task<ActionResult<IEnumerable<object>>> GetFailedRequestResultsByParent(int parentId)
    {
        var allRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        var failedPeriods = new List<object>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                if (item.PeriodVerificationStatus == null) continue;
                foreach (var kv in item.PeriodVerificationStatus)
                {
                    var period = kv.Key;
                    var val = kv.Value;
                    _logger.LogInformation("Period: {Period}, Value: {Value}", period, val);
                    var history = GetStatusHistory(item.PeriodVerificationStatus, period);
                    _logger.LogInformation("Parsed history for period {Period}: {History}", period, System.Text.Json.JsonSerializer.Serialize(history));
                    // Include if any status in the history is Failed
                    bool hasFailed = history.Any(h => h.ContainsKey("Status") && h["Status"]?.ToString() == "Failed");
                    _logger.LogInformation("Has any failed for period {Period}: {HasFailed}", period, hasFailed);
                    if (hasFailed)
                    {
                        failedPeriods.Add(new {
                            studentCode = req.StudentCode,
                            studentName = req.Student != null ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim() : null,
                            className = req.ClassName,
                            parentId = req.ParentId,
                            parentName = req.Parent != null ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim() : null,
                            medicineRequestItemId = item.MedicineRequestItemId,
                            medicineName = item.MedicineName,
                            dosage = item.Dosage,
                            frequency = item.Frequency,
                            timeOfDay = item.TimeOfDay,
                            instructions = item.Instructions,
                            period = period,
                            history = history
                        });
                    }
                }
            }
        }
        return Ok(failedPeriods);
    }

    // Helper to get or create a status history array for a period
    private static List<Dictionary<string, object>> GetStatusHistory(Dictionary<string, object> periodStatus, string period)
    {
        if (periodStatus.TryGetValue(period, out var val))
        {
            if (val is string strVal)
            {
                if (strVal.StartsWith("["))
                {
                    // Stringified array
                    return System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(strVal) ?? new List<Dictionary<string, object>>();
                }
                else if (strVal.StartsWith("{"))
                {
                    // Stringified object
                    var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(strVal);
                    return obj != null ? new List<Dictionary<string, object>> { obj } : new List<Dictionary<string, object>>();
                }
            }
            else if (val is System.Text.Json.JsonElement elem)
            {
                if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    return System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(elem.GetRawText()) ?? new List<Dictionary<string, object>>();
                }
                else if (elem.ValueKind == System.Text.Json.JsonValueKind.Object)
                {
                    var obj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(elem.GetRawText());
                    return obj != null ? new List<Dictionary<string, object>> { obj } : new List<Dictionary<string, object>>();
                }
            }
        }
        return new List<Dictionary<string, object>>();
    }

    // GET: api/Parent/{parentId}/statistics
    [HttpGet("{parentId}/statistics")]
    public async Task<ActionResult<ParentDto.ParentStatistics>> GetParentStatistics(int parentId)
    {
        try
        {
            var statistics = await _parentService.GetParentStatisticsAsync(parentId);
            var mappedStatistics = _mapper.Map<ParentDto.ParentStatistics>(statistics);
            return Ok(mappedStatistics);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error retrieving parent statistics: {ex.Message}");
        }
    }
}