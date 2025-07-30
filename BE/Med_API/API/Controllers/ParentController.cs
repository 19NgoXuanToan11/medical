using API.DTOs;
using AutoMapper;
using DB;
using Microsoft.AspNetCore.Mvc;
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

    public ParentController(
        IMapper mapper,
        IParentService parentService,
        ILogger<ParentController> logger
    )
    {
        _mapper = mapper;
        _parentService = parentService;
        _logger = logger;
    }

    private static bool IsRefusedStatus(object val)
    {
        if (val is string s)
        {
            if (s == "Refused")
                return true;
            if (s.StartsWith("{") && s.Contains("Status"))
            {
                try
                {
                    var jsonElem =
                        System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(
                            s
                        );
                    if (
                        jsonElem.ValueKind == System.Text.Json.JsonValueKind.Object
                        && jsonElem.TryGetProperty("Status", out var statusPropInner)
                        && statusPropInner.GetString() == "Refused"
                    )
                        return true;
                }
                catch { }
            }
        }
        if (
            val is System.Text.Json.JsonElement elem
            && elem.ValueKind == System.Text.Json.JsonValueKind.Object
            && elem.TryGetProperty("Status", out var statusProp)
            && statusProp.GetString() == "Refused"
        )
            return true;
        return false;
    }

    private static bool IsFailedStatus(object val)
    {
        if (val == null)
            return false;

        var valStr = val.ToString();

        // Check for simple "Failed" string
        if (valStr == "Failed")
            return true;

        // Check for JSON string containing "Status":"Failed"
        if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Failed\""))
        {
            try
            {
                var jsonObj =
                    System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(
                        valStr
                    );
                if (
                    jsonObj.TryGetProperty("Status", out var statusProp)
                    && statusProp.GetString() == "Failed"
                )
                    return true;
            }
            catch { }
        }

        // Check for JsonElement object
        if (val is System.Text.Json.JsonElement elem)
        {
            if (
                elem.ValueKind == System.Text.Json.JsonValueKind.Object
                && elem.TryGetProperty("Status", out var statusProp)
                && statusProp.GetString() == "Failed"
            )
                return true;

            // Check for array of status objects
            if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                foreach (var arrElem in elem.EnumerateArray())
                {
                    if (
                        arrElem.ValueKind == System.Text.Json.JsonValueKind.Object
                        && arrElem.TryGetProperty("Status", out var arrStatusProp)
                        && arrStatusProp.GetString() == "Failed"
                    )
                        return true;
                }
            }
        }

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
        return CreatedAtAction(
            nameof(GetParent),
            new { id = parentViewModel.ParentId },
            parentViewModel
        );
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
            return NotFound(
                "Parent not found, student not found, or parent with same phone/email already exists."
            );
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
    public async Task<
        ActionResult<IEnumerable<ParentDto.MedicineRequestProgress>>
    > GetMedicineRequestProgress(int parentId)
    {
        var medicineRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var result = _mapper.Map<IEnumerable<ParentDto.MedicineRequestProgress>>(medicineRequests);
        return Ok(result);
    }

    // GET: api/Parent/{parentId}/refused-medicine-requests
    [HttpGet("{parentId}/refused-medicine-requests")]
    public async Task<ActionResult<IEnumerable<object>>> GetRefusedMedicineRequestsByParent(
        int parentId
    )
    {
        // Get all requests for the parent
        var allRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);

        var refusedPeriods = new List<object>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                if (item.PeriodVerificationStatus == null)
                    continue;
                foreach (var kv in item.PeriodVerificationStatus)
                {
                    var period = kv.Key;
                    var val = kv.Value;

                    if (IsRefusedStatus(val))
                    {
                        string? refusalReason = null;
                        int? staffIdValue = null;
                        DateTime? timestamp = null;

                        // Extract additional info from the status
                        if (
                            val is string strVal
                            && strVal.StartsWith("{")
                            && strVal.Contains("RefusalReason")
                        )
                        {
                            try
                            {
                                var jsonObj =
                                    System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(
                                        strVal
                                    );
                                if (
                                    jsonObj.TryGetProperty(
                                        "RefusalReason",
                                        out var refusalReasonProp
                                    )
                                    && refusalReasonProp.ValueKind
                                        == System.Text.Json.JsonValueKind.String
                                )
                                    refusalReason = refusalReasonProp.GetString();
                                if (
                                    jsonObj.TryGetProperty("StaffId", out var staffIdProp)
                                    && staffIdProp.ValueKind
                                        == System.Text.Json.JsonValueKind.Number
                                )
                                    staffIdValue = staffIdProp.GetInt32();
                                if (
                                    jsonObj.TryGetProperty("Timestamp", out var timestampProp)
                                    && timestampProp.ValueKind
                                        == System.Text.Json.JsonValueKind.String
                                )
                                    timestamp = timestampProp.GetDateTime();
                            }
                            catch { }
                        }
                        else if (
                            val is System.Text.Json.JsonElement elem
                            && elem.ValueKind == System.Text.Json.JsonValueKind.Object
                        )
                        {
                            if (
                                elem.TryGetProperty("RefusalReason", out var refusalReasonProp)
                                && refusalReasonProp.ValueKind
                                    == System.Text.Json.JsonValueKind.String
                            )
                                refusalReason = refusalReasonProp.GetString();
                            if (
                                elem.TryGetProperty("StaffId", out var staffIdProp)
                                && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number
                            )
                                staffIdValue = staffIdProp.GetInt32();
                            if (
                                elem.TryGetProperty("Timestamp", out var timestampProp)
                                && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String
                            )
                                timestamp = timestampProp.GetDateTime();
                        }

                        refusedPeriods.Add(
                            new
                            {
                                studentCode = req.StudentCode,
                                studentName = req.Student != null
                                    ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim()
                                    : null,
                                className = req.ClassName,
                                parentId = req.ParentId,
                                parentName = req.Parent != null
                                    ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim()
                                    : null,
                                medicineRequestItemId = item.MedicineRequestItemId,
                                medicineName = item.MedicineName,
                                dosage = item.Dosage,
                                dosageUnit = item.DosageUnit,
                                frequency = item.Frequency,
                                timeOfDay = item.TimeOfDay,
                                instructions = item.Instructions,
                                period = period,
                                status = "Refused",
                                staffId = staffIdValue,
                                timestamp = timestamp,
                                refusalReason = refusalReason,
                            }
                        );
                    }
                }
            }
        }

        return Ok(refusedPeriods);
    }

    // GET: api/Parent/{parentId}/completed-medicine-requests
    [HttpGet("{parentId}/completed-medicine-requests")]
    public async Task<ActionResult<IEnumerable<object>>> GetCompletedMedicineRequestsByParent(
        int parentId
    )
    {
        // Get all requests for the parent
        var allRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);

        var completedPeriods = new List<object>();
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                if (item.PeriodVerificationStatus == null)
                    continue;
                foreach (var kv in item.PeriodVerificationStatus)
                {
                    var period = kv.Key;
                    var val = kv.Value;

                    if (val == null)
                        continue;

                    var valStr = val.ToString();
                    if (valStr == "Completed")
                    {
                        completedPeriods.Add(
                            new
                            {
                                studentCode = req.StudentCode,
                                studentName = req.Student != null
                                    ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim()
                                    : null,
                                className = req.ClassName,
                                parentId = req.ParentId,
                                parentName = req.Parent != null
                                    ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim()
                                    : null,
                                medicineRequestItemId = item.MedicineRequestItemId,
                                medicineName = item.MedicineName,
                                dosage = item.Dosage,
                                dosageUnit = item.DosageUnit,
                                frequency = item.Frequency,
                                timeOfDay = item.TimeOfDay,
                                instructions = item.Instructions,
                                period = period,
                                status = "Completed",
                                staffId = (int?)null,
                                timestamp = (DateTime?)null,
                            }
                        );
                    }
                    else if (valStr.StartsWith("{") && valStr.Contains("\"Status\":\"Completed\""))
                    {
                        int? staffIdValue = null;
                        DateTime? timestamp = null;

                        // Try to extract StaffId and Timestamp from the JSON string
                        try
                        {
                            var jsonObj =
                                System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(
                                    valStr
                                );
                            if (
                                jsonObj.TryGetProperty("StaffId", out var staffIdProp)
                                && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number
                            )
                                staffIdValue = staffIdProp.GetInt32();
                            if (
                                jsonObj.TryGetProperty("Timestamp", out var timestampProp)
                                && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String
                            )
                                timestamp = timestampProp.GetDateTime();
                        }
                        catch { }

                        completedPeriods.Add(
                            new
                            {
                                studentCode = req.StudentCode,
                                studentName = req.Student != null
                                    ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim()
                                    : null,
                                className = req.ClassName,
                                parentId = req.ParentId,
                                parentName = req.Parent != null
                                    ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim()
                                    : null,
                                medicineRequestItemId = item.MedicineRequestItemId,
                                medicineName = item.MedicineName,
                                dosage = item.Dosage,
                                dosageUnit = item.DosageUnit,
                                frequency = item.Frequency,
                                timeOfDay = item.TimeOfDay,
                                instructions = item.Instructions,
                                period = period,
                                status = "Completed",
                                staffId = staffIdValue,
                                timestamp = timestamp,
                            }
                        );
                    }
                    else if (val is System.Text.Json.JsonElement elem)
                    {
                        if (
                            elem.ValueKind == System.Text.Json.JsonValueKind.Object
                            && elem.TryGetProperty("Status", out var statusProp)
                            && statusProp.GetString() == "Completed"
                        )
                        {
                            int? staffIdValue = null;
                            DateTime? timestamp = null;

                            // Extract StaffId and Timestamp from the JSON object
                            if (
                                elem.TryGetProperty("StaffId", out var staffIdProp)
                                && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number
                            )
                                staffIdValue = staffIdProp.GetInt32();
                            if (
                                elem.TryGetProperty("Timestamp", out var timestampProp)
                                && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String
                            )
                                timestamp = timestampProp.GetDateTime();

                            completedPeriods.Add(
                                new
                                {
                                    studentCode = req.StudentCode,
                                    studentName = req.Student != null
                                        ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim()
                                        : null,
                                    className = req.ClassName,
                                    parentId = req.ParentId,
                                    parentName = req.Parent != null
                                        ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim()
                                        : null,
                                    medicineRequestItemId = item.MedicineRequestItemId,
                                    medicineName = item.MedicineName,
                                    dosage = item.Dosage,
                                    dosageUnit = item.DosageUnit,
                                    frequency = item.Frequency,
                                    timeOfDay = item.TimeOfDay,
                                    instructions = item.Instructions,
                                    period = period,
                                    status = "Completed",
                                    staffId = staffIdValue,
                                    timestamp = timestamp,
                                }
                            );
                        }
                        else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var arrElem in elem.EnumerateArray())
                            {
                                if (
                                    arrElem.ValueKind == System.Text.Json.JsonValueKind.Object
                                    && arrElem.TryGetProperty("Status", out var arrStatusProp)
                                    && arrStatusProp.GetString() == "Completed"
                                )
                                {
                                    int? staffIdValue = null;
                                    DateTime? timestamp = null;

                                    // Extract StaffId and Timestamp from the array element
                                    if (
                                        arrElem.TryGetProperty("StaffId", out var staffIdProp)
                                        && staffIdProp.ValueKind
                                            == System.Text.Json.JsonValueKind.Number
                                    )
                                        staffIdValue = staffIdProp.GetInt32();
                                    if (
                                        arrElem.TryGetProperty("Timestamp", out var timestampProp)
                                        && timestampProp.ValueKind
                                            == System.Text.Json.JsonValueKind.String
                                    )
                                        timestamp = timestampProp.GetDateTime();

                                    completedPeriods.Add(
                                        new
                                        {
                                            studentCode = req.StudentCode,
                                            studentName = req.Student != null
                                                ? (
                                                    $"{req.Student.LastName} {req.Student.FirstName}"
                                                ).Trim()
                                                : null,
                                            className = req.ClassName,
                                            parentId = req.ParentId,
                                            parentName = req.Parent != null
                                                ? (
                                                    $"{req.Parent.LastName} {req.Parent.FirstName}"
                                                ).Trim()
                                                : null,
                                            medicineRequestItemId = item.MedicineRequestItemId,
                                            medicineName = item.MedicineName,
                                            dosage = item.Dosage,
                                            dosageUnit = item.DosageUnit,
                                            frequency = item.Frequency,
                                            timeOfDay = item.TimeOfDay,
                                            instructions = item.Instructions,
                                            period = period,
                                            status = "Completed",
                                            staffId = staffIdValue,
                                            timestamp = timestamp,
                                        }
                                    );
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        return Ok(completedPeriods);
    }

    // GET: api/Parent/{parentId}/failed-request-results
    [HttpGet("{parentId}/failed-request-results")]
    public async Task<ActionResult<IEnumerable<object>>> GetFailedRequestResultsByParent(
        int parentId
    )
    {
        _logger.LogInformation(
            "GET /api/Parent/{ParentId}/failed-request-results endpoint hit!",
            parentId
        );

        var allRequests = await _parentService.GetMedicineRequestProgressAsync(parentId);
        _logger.LogInformation(
            "Found {Count} medicine requests for parent {ParentId}",
            allRequests.Count(),
            parentId
        );

        var viewModels = _mapper.Map<IEnumerable<MedicineRequestDto.ViewModel>>(allRequests);
        var failedPeriods = new List<object>();

        // Debug log before filtering
        foreach (var req in viewModels)
        {
            _logger.LogInformation(
                "[PARENT][BEFORE] RequestId: {RequestId}, ParentId: {ParentId}, Status: {Status}",
                req.RequestId,
                req.ParentId,
                req.Status
            );
            foreach (var item in req.MedicineRequestItems)
            {
                _logger.LogInformation(
                    "[PARENT][BEFORE] ItemId: {ItemId}, PeriodVerificationStatus: {Status}",
                    item.MedicineRequestItemId,
                    System.Text.Json.JsonSerializer.Serialize(item.PeriodVerificationStatus)
                );
            }
        }
        foreach (var req in viewModels)
        {
            foreach (var item in req.MedicineRequestItems)
            {
                if (item.PeriodVerificationStatus == null)
                    continue;
                foreach (var kv in item.PeriodVerificationStatus)
                {
                    var period = kv.Key;
                    var val = kv.Value;

                    if (IsFailedStatus(val))
                    {
                        _logger.LogInformation(
                            "[PARENT][FOUND] Failed status for period {Period}, ItemId: {ItemId}, Value: {Value}",
                            period,
                            item.MedicineRequestItemId,
                            val?.ToString()
                        );

                        string? failureReason = null;
                        int? staffIdValue = null;
                        DateTime? timestamp = null;
                        string? notes = null;

                        // Extract additional info from the status
                        if (val is string strVal && strVal.StartsWith("{"))
                        {
                            try
                            {
                                var jsonObj =
                                    System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(
                                        strVal
                                    );
                                if (
                                    jsonObj.TryGetProperty(
                                        "FailureReason",
                                        out var failureReasonProp
                                    )
                                    && failureReasonProp.ValueKind
                                        == System.Text.Json.JsonValueKind.String
                                )
                                    failureReason = failureReasonProp.GetString();
                                if (
                                    jsonObj.TryGetProperty("StaffId", out var staffIdProp)
                                    && staffIdProp.ValueKind
                                        == System.Text.Json.JsonValueKind.Number
                                )
                                    staffIdValue = staffIdProp.GetInt32();
                                if (
                                    jsonObj.TryGetProperty("Timestamp", out var timestampProp)
                                    && timestampProp.ValueKind
                                        == System.Text.Json.JsonValueKind.String
                                )
                                    timestamp = timestampProp.GetDateTime();
                                if (
                                    jsonObj.TryGetProperty("Notes", out var notesProp)
                                    && notesProp.ValueKind == System.Text.Json.JsonValueKind.String
                                )
                                    notes = notesProp.GetString();
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(
                                    "Failed to parse JSON for period {Period}, ItemId: {ItemId}, JSON: {Json}, Error: {Error}",
                                    period,
                                    item.MedicineRequestItemId,
                                    strVal,
                                    ex.Message
                                );
                            }
                        }
                        else if (
                            val is System.Text.Json.JsonElement elem
                            && elem.ValueKind == System.Text.Json.JsonValueKind.Object
                        )
                        {
                            if (
                                elem.TryGetProperty("FailureReason", out var failureReasonProp)
                                && failureReasonProp.ValueKind
                                    == System.Text.Json.JsonValueKind.String
                            )
                                failureReason = failureReasonProp.GetString();
                            if (
                                elem.TryGetProperty("StaffId", out var staffIdProp)
                                && staffIdProp.ValueKind == System.Text.Json.JsonValueKind.Number
                            )
                                staffIdValue = staffIdProp.GetInt32();
                            if (
                                elem.TryGetProperty("Timestamp", out var timestampProp)
                                && timestampProp.ValueKind == System.Text.Json.JsonValueKind.String
                            )
                                timestamp = timestampProp.GetDateTime();
                            if (
                                elem.TryGetProperty("Notes", out var notesProp)
                                && notesProp.ValueKind == System.Text.Json.JsonValueKind.String
                            )
                                notes = notesProp.GetString();
                        }
                        else if (
                            val is System.Text.Json.JsonElement arrayElem
                            && arrayElem.ValueKind == System.Text.Json.JsonValueKind.Array
                        )
                        {
                            // Handle array of status objects - get the latest failed status
                            foreach (var arrItem in arrayElem.EnumerateArray().Reverse())
                            {
                                if (
                                    arrItem.ValueKind == System.Text.Json.JsonValueKind.Object
                                    && arrItem.TryGetProperty("Status", out var statusProp)
                                    && statusProp.GetString() == "Failed"
                                )
                                {
                                    if (
                                        arrItem.TryGetProperty(
                                            "FailureReason",
                                            out var failureReasonProp
                                        )
                                        && failureReasonProp.ValueKind
                                            == System.Text.Json.JsonValueKind.String
                                    )
                                        failureReason = failureReasonProp.GetString();
                                    if (
                                        arrItem.TryGetProperty("StaffId", out var staffIdProp)
                                        && staffIdProp.ValueKind
                                            == System.Text.Json.JsonValueKind.Number
                                    )
                                        staffIdValue = staffIdProp.GetInt32();
                                    if (
                                        arrItem.TryGetProperty("Timestamp", out var timestampProp)
                                        && timestampProp.ValueKind
                                            == System.Text.Json.JsonValueKind.String
                                    )
                                        timestamp = timestampProp.GetDateTime();
                                    if (
                                        arrItem.TryGetProperty("Notes", out var notesProp)
                                        && notesProp.ValueKind
                                            == System.Text.Json.JsonValueKind.String
                                    )
                                        notes = notesProp.GetString();
                                    break;
                                }
                            }
                        }

                        _logger.LogInformation(
                            "[PARENT][PARSED] Period: {Period}, ItemId: {ItemId}, StaffId: {StaffId}, FailureReason: {FailureReason}, Notes: {Notes}",
                            period,
                            item.MedicineRequestItemId,
                            staffIdValue,
                            failureReason,
                            notes
                        );

                        failedPeriods.Add(
                            new
                            {
                                studentCode = req.StudentCode,
                                studentName = req.Student != null
                                    ? ($"{req.Student.LastName} {req.Student.FirstName}").Trim()
                                    : null,
                                className = req.ClassName,
                                parentId = req.ParentId,
                                parentName = req.Parent != null
                                    ? ($"{req.Parent.LastName} {req.Parent.FirstName}").Trim()
                                    : null,
                                medicineRequestItemId = item.MedicineRequestItemId,
                                medicineName = item.MedicineName,
                                dosage = item.Dosage,
                                dosageUnit = item.DosageUnit,
                                frequency = item.Frequency,
                                timeOfDay = item.TimeOfDay,
                                instructions = item.Instructions,
                                period = period,
                                status = "Failed",
                                staffId = staffIdValue,
                                timestamp = timestamp,
                                failureReason = failureReason,
                                notes = notes,
                            }
                        );
                    }
                }
            }
        }

        // Debug log after filtering
        _logger.LogInformation(
            "[PARENT][AFTER] Found {Count} failed periods for parent {ParentId}",
            failedPeriods.Count,
            parentId
        );

        return Ok(failedPeriods);
    }

    // Helper to get or create a status history array for a period
    private static List<Dictionary<string, object>> GetStatusHistory(
        Dictionary<string, object> periodStatus,
        string period
    )
    {
        if (periodStatus.TryGetValue(period, out var val))
        {
            if (val is string strVal)
            {
                if (strVal.StartsWith("["))
                {
                    // Stringified array
                    return System.Text.Json.JsonSerializer.Deserialize<
                            List<Dictionary<string, object>>
                        >(strVal) ?? new List<Dictionary<string, object>>();
                }
                else if (strVal.StartsWith("{"))
                {
                    // Stringified object
                    var obj = System.Text.Json.JsonSerializer.Deserialize<
                        Dictionary<string, object>
                    >(strVal);
                    return obj != null
                        ? new List<Dictionary<string, object>> { obj }
                        : new List<Dictionary<string, object>>();
                }
            }
            else if (val is System.Text.Json.JsonElement elem)
            {
                if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    return System.Text.Json.JsonSerializer.Deserialize<
                            List<Dictionary<string, object>>
                        >(elem.GetRawText()) ?? new List<Dictionary<string, object>>();
                }
                else if (elem.ValueKind == System.Text.Json.JsonValueKind.Object)
                {
                    var obj = System.Text.Json.JsonSerializer.Deserialize<
                        Dictionary<string, object>
                    >(elem.GetRawText());
                    return obj != null
                        ? new List<Dictionary<string, object>> { obj }
                        : new List<Dictionary<string, object>>();
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
