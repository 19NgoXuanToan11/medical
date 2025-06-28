using DB;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Repo;

public class MedicineRequestRepository : IMedicineRequestRepository
{
    private readonly MedicalContext _context;

    public MedicineRequestRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync()
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .ToListAsync();
    }

    public async Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .FirstOrDefaultAsync(m => m.RequestId == id);
    }

    public async Task<MedicineRequest> CreateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        _context.MedicineRequests.Add(medicineRequest);
        await _context.SaveChangesAsync();
        return medicineRequest;
    }

    public async Task UpdateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        var existingRequest = await _context.MedicineRequests
            .Include(r => r.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.RequestId == medicineRequest.RequestId);

        if (existingRequest == null)
        {
            return; // Or throw an exception, depending on desired behavior
        }

        _context.Entry(existingRequest).CurrentValues.SetValues(medicineRequest);

        // Handle MedicineRequestItems
        var existingItems = existingRequest.MedicineRequestItems.ToList();
        var newItems = medicineRequest.MedicineRequestItems.ToList();

        // Remove items not present in the new list
        foreach (var existingItem in existingItems.Except(newItems, new MedicineRequestItemComparer()))
        {
            _context.MedicineRequestItems.Remove(existingItem);
        }

        // Add or update items
        foreach (var newItem in newItems)
        {
            var existingItem = existingItems.FirstOrDefault(i => i.MedicineRequestItemId == newItem.MedicineRequestItemId);
            if (existingItem == null) // New item
            {
                existingRequest.MedicineRequestItems.Add(newItem);
            }
            else // Update existing item
            {
                _context.Entry(existingItem).CurrentValues.SetValues(newItem);
            }
        }
        
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteMedicineRequestAsync(int id)
    {
        var medicineRequest = await _context.MedicineRequests.FindAsync(id);
        if (medicineRequest == null)
        {
            return false;
        }
        _context.MedicineRequests.Remove(medicineRequest);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.StudentCode == studentCode)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.StaffId == staffId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.Status == status)
            .ToListAsync();
    }

    public async Task<IEnumerable<Staff>> GetAvailableNursesAsync()
    {
        return await _context.Staff
            .Include(s => s.Role)
            .Where(s => s.Role.RoleName == "Nurse" && s.IsActiveForRequest)
            .ToListAsync();
    }

    public async Task<int> GetPendingRequestCountForNurseAsync(int staffId)
    {
        return await _context.MedicineRequests
            .CountAsync(m => m.StaffId == staffId && m.Status == "Pending");
    }

    public async Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync()
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
                .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.Status == "Pending")
            .ToListAsync();
    }

    public async Task<bool> AssignNurseToRequestAsync(int requestId, int staffId)
    {
        var request = await _context.MedicineRequests.FindAsync(requestId);
        if (request == null || request.Status != "Pending")
        {
            return false;
        }

        var pendingCount = await GetPendingRequestCountForNurseAsync(staffId);
        if (pendingCount >= 5)
        {
            return false;
        }

        request.StaffId = staffId;
        request.Status = "Assigned";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteRequestAsync(int requestId, int staffId)
    {
        var request = await _context.MedicineRequests.FindAsync(requestId);
        if (request == null || request.StaffId != staffId)
        {
            return false;
        }

        request.Status = "Completed";
        await _context.SaveChangesAsync();
        return true;
    }

    // New frequency-based methods
    public async Task<RequestResult?> StartMedicineRequestAsync(int requestId, int staffId)
    {
        var request = await _context.MedicineRequests
            .Include(r => r.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.RequestId == requestId);

        if (request == null || request.StaffId != staffId)
        {
            return null;
        }

        // Parse frequency from MedicineRequestItems to determine times per day
        var timesPerDay = ParseFrequencyToTimesPerDay(request.MedicineRequestItems.FirstOrDefault()?.Frequency);

        var requestResult = new RequestResult
        {
            RequestId = requestId,
            Status = "In Progress",
            SubmittedAt = DateTime.UtcNow,
            ActionBy = staffId,
            TimesPerDay = timesPerDay,
            CurrentDayCount = 0,
            CurrentDate = DateOnly.FromDateTime(DateTime.Today),
            AdministeredFrequencies = "[]" // Empty JSON array
        };

        _context.RequestResults.Add(requestResult);
        await _context.SaveChangesAsync();
        return requestResult;
    }

    public async Task<bool> AdministerMedicineByFrequencyAsync(int requestResultId, int medicineRequestItemId, string frequency, int staffId, string? notes = null)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);

        if (medicineItem == null)
        {
            return false;
        }

        // Parse current administered frequencies
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);

        // Check if this frequency was already administered today
        var today = DateOnly.FromDateTime(DateTime.Today);
        if (requestResult.CurrentDate != today)
        {
            // New day, reset counters
            requestResult.CurrentDate = today;
            requestResult.CurrentDayCount = 0;
            administeredFrequencies.Clear();
        }

        // Check if this frequency is already administered
        if (administeredFrequencies.Contains(frequency))
        {
            return false; // Already administered this frequency today
        }

        // Add the frequency to administered list
        administeredFrequencies.Add(frequency);
        requestResult.CurrentDayCount = administeredFrequencies.Count;
        requestResult.AdministeredFrequencies = JsonSerializer.Serialize(administeredFrequencies);
        requestResult.AdministeredTime = DateTime.UtcNow;
        requestResult.AdministeredBy = staffId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsMedicineCompletedForDayAsync(int requestResultId, int medicineRequestItemId)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);

        if (medicineItem == null)
        {
            return false;
        }

        var timesPerDay = ParseFrequencyToTimesPerDay(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);

        return administeredFrequencies.Count >= timesPerDay;
    }

    public async Task<IEnumerable<string>> GetPendingFrequenciesAsync(int requestResultId, int medicineRequestItemId)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return Enumerable.Empty<string>();
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);

        if (medicineItem == null)
        {
            return Enumerable.Empty<string>();
        }

        var allFrequencies = ParseFrequencyToFrequencies(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);

        return allFrequencies.Except(administeredFrequencies);
    }

    public async Task<bool> CompleteMedicineRequestAsync(int requestResultId, int staffId)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        requestResult.Status = "Completed";
        requestResult.ActionBy = staffId;
        await _context.SaveChangesAsync();

        // Also update the main medicine request status
        if (requestResult.Request != null)
        {
            requestResult.Request.Status = "Completed";
            await _context.SaveChangesAsync();
        }

        return true;
    }

    // Helper methods
    private int ParseFrequencyToTimesPerDay(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency))
            return 1;

        var trimmedFrequency = frequency.Trim().ToLower();

        // Handle cases where frequency is just a number or "number lần"
        var numberMatch = Regex.Match(trimmedFrequency, @"^(\d+)\s*lần?$");
        if (numberMatch.Success)
        {
            if (int.TryParse(numberMatch.Groups[1].Value, out var number))
                return number;
        }

        // Handle cases where frequency is just a number
        if (int.TryParse(trimmedFrequency, out var parsedNumber))
            return parsedNumber;

        // Handle different frequency formats with time periods
        if (frequency.Contains("2") || frequency.Contains("hai") || frequency.Contains("two"))
            return 2;
        if (frequency.Contains("3") || frequency.Contains("ba") || frequency.Contains("three"))
            return 3;
        if (frequency.Contains("4") || frequency.Contains("bốn") || frequency.Contains("four"))
            return 4;

        return 1; // Default to once per day
    }

    private List<string> ParseFrequencyToFrequencies(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency))
            return new List<string>();

        var result = new List<string>();
        var trimmedFrequency = frequency.Trim().ToLower();

        // Handle cases where frequency is just a number or "number lần"
        var numberMatch = Regex.Match(trimmedFrequency, @"^(\d+)\s*lần?$");
        if (numberMatch.Success)
        {
            if (int.TryParse(numberMatch.Groups[1].Value, out var number))
            {
                // For simple number format, distribute across standard times
                var times = new[] { "sáng", "trưa", "chiều", "tối" };
                for (int i = 0; i < number && i < times.Length; i++)
                {
                    result.Add(times[i]);
                }
                return result;
            }
        }

        // Handle cases where frequency is just a number
        if (int.TryParse(trimmedFrequency, out var parsedNumber))
        {
            // For simple number format, distribute across standard times
            var times = new[] { "sáng", "trưa", "chiều", "tối" };
            for (int i = 0; i < parsedNumber && i < times.Length; i++)
            {
                result.Add(times[i]);
            }
            return result;
        }

        // Handle complex frequency formats with time periods
        var segments = frequency.Split(',', StringSplitOptions.RemoveEmptyEntries);
        foreach (var segment in segments)
        {
            var part = segment.Trim().ToLower();
            // Match patterns like 'sáng 2 lần', 'trưa 1 lần', etc.
            var match = Regex.Match(part, @"(sáng|trưa|chiều)\s*(\d+)?\s*lần?");
            if (match.Success)
            {
                var timeOfDay = match.Groups[1].Value;
                var countStr = match.Groups[2].Value;
                int count = 1;
                if (!string.IsNullOrEmpty(countStr) && int.TryParse(countStr, out var parsed))
                    count = parsed;
                for (int i = 0; i < count; i++)
                    result.Add(timeOfDay);
            }
            else
            {
                // Fallback: if just 'sáng', 'trưa', etc. (old format)
                if (part == "sáng" || part == "trưa" || part == "chiều" || part == "tối")
                    result.Add(part);
            }
        }
        return result;
    }

    private List<string> ParseAdministeredFrequencies(string? administeredFrequenciesJson)
    {
        if (string.IsNullOrEmpty(administeredFrequenciesJson))
            return new List<string>();

        try
        {
            return JsonSerializer.Deserialize<List<string>>(administeredFrequenciesJson) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    // New failure handling methods
    public async Task<bool> ReportMedicineFailureAsync(int requestResultId, int medicineRequestItemId, string frequency, string failureReason, int staffId, string? notes = null)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);

        if (medicineItem == null)
        {
            return false;
        }

        // Parse current failed frequencies and reasons
        var failedFrequencies = ParseAdministeredFrequencies(requestResult.FailedFrequencies);
        var failureReasons = ParseFailureReasons(requestResult.FailureReasons);

        // Add the failed frequency and reason
        if (!failedFrequencies.Contains(frequency))
        {
            failedFrequencies.Add(frequency);
            failureReasons[frequency] = failureReason;
        }

        requestResult.FailedFrequencies = JsonSerializer.Serialize(failedFrequencies);
        requestResult.FailureReasons = JsonSerializer.Serialize(failureReasons);
        requestResult.LastAttemptTime = DateTime.UtcNow;
        requestResult.FailedAttempts = (requestResult.FailedAttempts ?? 0) + 1;
        requestResult.AdministeredBy = staffId;

        // Check if all frequencies have failed (complete failure)
        var allFrequencies = ParseFrequencyToFrequencies(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);
        var successfulFrequencies = administeredFrequencies.Except(failedFrequencies).ToList();

        if (successfulFrequencies.Count == 0 && failedFrequencies.Count >= allFrequencies.Count)
        {
            // Complete failure - mark as failed
            requestResult.Status = "Failed";
        }
        else if (failedFrequencies.Count > 0)
        {
            // Partial failure - mark as partially failed
            requestResult.Status = "Partially Failed";
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RequestResult?> CreateReRequestAsync(int originalRequestResultId, string reRequestReason, int staffId)
    {
        var originalRequestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == originalRequestResultId);

        if (originalRequestResult == null)
        {
            return null;
        }

        // Check if it's past 5 PM
        var currentTime = DateTime.Now;
        if (currentTime.Hour >= 17) // 5 PM
        {
            return null; // Cannot create re-request after 5 PM
        }

        // Create new request result for re-request
        var reRequest = new RequestResult
        {
            RequestId = originalRequestResult.RequestId,
            Status = "In Progress",
            SubmittedAt = DateTime.UtcNow,
            ActionBy = staffId,
            TimesPerDay = originalRequestResult.TimesPerDay,
            CurrentDayCount = 0,
            CurrentDate = DateOnly.FromDateTime(DateTime.Today),
            AdministeredFrequencies = "[]",
            FailedFrequencies = "[]",
            FailureReasons = "{}",
            IsReRequest = true,
            OriginalRequestResultId = originalRequestResultId,
            ReRequestReason = reRequestReason,
            FailedAttempts = 0
        };

        _context.RequestResults.Add(reRequest);
        await _context.SaveChangesAsync();
        return reRequest;
    }

    public async Task<bool> UpdateTimeBasedStatusAsync()
    {
        var currentTime = DateTime.Now;
        var currentDate = DateOnly.FromDateTime(currentTime.Date);

        // Mark as failed if the day has changed and request is still in progress
        var expiredRequests = await _context.RequestResults
            .Where(r => r.Status == "In Progress" && r.CurrentDate < currentDate)
            .ToListAsync();

        foreach (var request in expiredRequests)
        {
            request.Status = "Failed";
            request.ReRequestReason = "Time Expired - Day Changed";
        }

        // Existing logic: mark as failed if still in progress and past 5 PM today
        var lateTodayRequests = await _context.RequestResults
            .Where(r => r.Status == "In Progress" &&
                       r.CurrentDate == currentDate &&
                       r.LastAttemptTime.HasValue &&
                       r.LastAttemptTime.Value.Hour >= 17)
            .ToListAsync();

        foreach (var request in lateTodayRequests)
        {
            request.Status = "Failed";
            request.ReRequestReason = "Time Expired - Past 5 PM";
        }

        if (expiredRequests.Any() || lateTodayRequests.Any())
        {
            await _context.SaveChangesAsync();
        }

        return true;
    }

    public async Task<IEnumerable<RequestResult>> GetFailedRequestsAsync()
    {
        return await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
            .Include(r => r.ActionByStaff)
            .Where(r => r.Status == "Failed" || r.Status == "Partially Failed")
            .ToListAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetReRequestsAsync(int originalRequestResultId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
            .Include(r => r.ActionByStaff)
            .Where(r => r.OriginalRequestResultId == originalRequestResultId && r.IsReRequest)
            .ToListAsync();
    }

    public async Task<bool> IsRequestEligibleForReRequestAsync(int requestResultId)
    {
        var requestResult = await _context.RequestResults
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        // Check if it's past 5 PM
        var currentTime = DateTime.Now;
        if (currentTime.Hour >= 17)
        {
            return false;
        }

        // Check if request is failed or partially failed
        return requestResult.Status == "Failed" || requestResult.Status == "Partially Failed";
    }

    public async Task<string> GetReRequestReasonAsync(int requestResultId)
    {
        var requestResult = await _context.RequestResults
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return string.Empty;
        }

        if (requestResult.Status == "Failed")
        {
            return "Complete Failure";
        }
        else if (requestResult.Status == "Partially Failed")
        {
            return "Partial Failure";
        }
        else if (requestResult.Status == "Failed" && requestResult.ReRequestReason?.Contains("Time Expired") == true)
        {
            return "Time Expired";
        }

        return string.Empty;
    }

    public async Task<bool> MarkRequestAsFailedAsync(int requestResultId, string reason)
    {
        var requestResult = await _context.RequestResults
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return false;
        }

        requestResult.Status = "Failed";
        requestResult.ReRequestReason = reason;
        requestResult.LastAttemptTime = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int requestResultId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
            .Include(r => r.ActionByStaff)
            .Include(r => r.OriginalRequestResult)
            .Include(r => r.ReRequests)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);
    }

    private Dictionary<string, string> ParseFailureReasons(string? failureReasonsJson)
    {
        if (string.IsNullOrEmpty(failureReasonsJson))
            return new Dictionary<string, string>();

        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(failureReasonsJson) ?? new Dictionary<string, string>();
        }
        catch
        {
            return new Dictionary<string, string>();
        }
    }

    public async Task<(bool isCompleted, IEnumerable<string> pendingFrequencies)> GetProgressInfoAsync(int requestResultId, int medicineRequestItemId)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
            .ThenInclude(r => r!.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);
        if (requestResult == null)
            return (false, Enumerable.Empty<string>());
        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);
        if (medicineItem == null)
            return (false, Enumerable.Empty<string>());
        var allFrequencies = ParseFrequencyToFrequencies(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);
        var pending = allFrequencies.Except(administeredFrequencies).ToList();
        bool isCompleted = pending.Count == 0;
        return (isCompleted, pending);
    }

    public async Task<(bool eligible, string reason)> GetReRequestInfoAsync(int requestResultId)
    {
        var requestResult = await _context.RequestResults
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);
        if (requestResult == null)
            return (false, "Not found");
        var currentTime = DateTime.Now;
        if (currentTime.Hour >= 17)
            return (false, "Time Expired");
        if (requestResult.Status == "Failed")
            return (true, "Complete Failure");
        if (requestResult.Status == "Partially Failed")
            return (true, "Partial Failure");
        return (false, "");
    }
}

public class MedicineRequestItemComparer : IEqualityComparer<MedicineRequestItem>
{
    public bool Equals(MedicineRequestItem? x, MedicineRequestItem? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (ReferenceEquals(x, null) || ReferenceEquals(y, null)) return false;
        return x.MedicineRequestItemId == y.MedicineRequestItemId;
    }

    public int GetHashCode(MedicineRequestItem obj)
    {
        return obj.MedicineRequestItemId.GetHashCode();
    }
} 