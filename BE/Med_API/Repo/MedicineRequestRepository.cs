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
                .ThenInclude(s => s.Class)
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
                .ThenInclude(s => s.Class)
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
            .Include(r => r.RequestResults)
            .FirstOrDefaultAsync(r => r.RequestId == medicineRequest.RequestId);

        if (existingRequest == null)
        {
            return; // Or throw an exception, depending on desired behavior
        }

        _context.Entry(existingRequest).CurrentValues.SetValues(medicineRequest);
        existingRequest.RefusalReason = medicineRequest.RefusalReason;

        // Only synchronize RequestResult status if MedicineRequest is being marked as completed
        // AND the RequestResult is actually completed based on frequency progress
        if (medicineRequest.Status == "Completed")
        {
            var latestResult = existingRequest.RequestResults
                .OrderByDescending(r => r.SubmittedAt)
                .FirstOrDefault();
            
            if (latestResult != null && latestResult.Status == "In Progress")
            {
                // Check if the RequestResult is actually completed based on frequency
                var isActuallyCompleted = await IsRequestResultActuallyCompletedAsync(latestResult.ResultId);
                if (isActuallyCompleted)
                {
                    latestResult.Status = "Completed";
                }
                else
                {
                    // If not actually completed, don't mark MedicineRequest as completed
                    existingRequest.Status = "In Progress";
                }
            }
        }

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
            .ThenInclude(s => s.Class)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.Parent)
                .ThenInclude(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
                .ThenInclude(p => p.Students)
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
        if (request == null || (request.Status != "Pending" && request.Status != "Verified"))
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

        // Find the latest RequestResult for this MedicineRequest
        var latestResult = await _context.RequestResults
            .Where(r => r.RequestId == requestId)
            .OrderByDescending(r => r.SubmittedAt)
            .FirstOrDefaultAsync();

        if (latestResult != null)
        {
            if (latestResult.Status == "Failed")
            {
                request.Status = "Failed";
            }
            else if (latestResult.Status == "Completed")
            {
                // Only mark MedicineRequest as completed if RequestResult is already completed
                request.Status = "Completed";
            }
            else if (latestResult.Status == "In Progress")
            {
                // Check if the RequestResult is actually completed based on frequency
                var isActuallyCompleted = await IsRequestResultActuallyCompletedAsync(latestResult.ResultId);
                if (isActuallyCompleted)
                {
                    latestResult.Status = "Completed";
                    request.Status = "Completed";
                }
                else
                {
                    // Cannot complete if frequency requirements are not met
                    return false;
                }
            }
        }
        else
        {
            // No RequestResult exists, cannot complete
            return false;
        }

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

        if (medicineItem == null || medicineItem.VerificationStatus != "Verified")
        {
            return false; // Not allowed to administer if not verified
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
            // Update the JSON field to reflect the cleared list
            requestResult.AdministeredFrequencies = JsonSerializer.Serialize(administeredFrequencies);
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

        // Check if the RequestResult is actually completed based on frequency
        var isActuallyCompleted = await IsRequestResultActuallyCompletedAsync(requestResultId);
        if (!isActuallyCompleted)
        {
            return false; // Cannot complete if frequency requirements are not met
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
    public int ParseFrequencyToTimesPerDay(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency))
            return 1;

        // First, try to parse the total count from the frequency string
        var totalCount = 0;
        var segments = frequency.Split(',', StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var segment in segments)
        {
            var part = segment.Trim().ToLower();
            // Match patterns like 'sáng 2 lần', 'trưa 1 lần', etc.
            var match = Regex.Match(part, @"(sáng|trưa|chiều|tối)\s*(\d+)?\s*lần?");
            if (match.Success)
            {
                var countStr = match.Groups[2].Value;
                int count = 1;
                if (!string.IsNullOrEmpty(countStr) && int.TryParse(countStr, out var parsed))
                    count = parsed;
                totalCount += count;
            }
            else
            {
                // Fallback: if just 'sáng', 'trưa', etc. (old format)
                if (part == "sáng" || part == "trưa" || part == "chiều" || part == "tối")
                    totalCount += 1;
            }
        }

        // If we couldn't parse any specific counts, fall back to the old logic
        if (totalCount == 0)
        {
            if (frequency.Contains("2") || frequency.Contains("hai") || frequency.Contains("two"))
                return 2;
            if (frequency.Contains("3") || frequency.Contains("ba") || frequency.Contains("three"))
                return 3;
            if (frequency.Contains("4") || frequency.Contains("bốn") || frequency.Contains("four"))
                return 4;
            return 1; // Default to once per day
        }

        return totalCount;
    }

    // Helper method for parsing frequency
    private List<string> ParseFrequencyToFrequencies(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency))
            return new List<string>();

        var frequencies = new List<string>();
        var parts = frequency.Split(',', StringSplitOptions.RemoveEmptyEntries);

        foreach (var part in parts)
        {
            var trimmed = part.Trim().ToLowerInvariant();
            if (trimmed.Contains("sáng"))
                frequencies.Add("sáng");
            else if (trimmed.Contains("trưa"))
                frequencies.Add("trưa");
            else if (trimmed.Contains("chiều"))
                frequencies.Add("chiều");
            else if (trimmed.Contains("tối"))
                frequencies.Add("tối");
        }

        return frequencies.Distinct().ToList();
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

    // Add missing methods to implement the interface
    public async Task<bool> CanReRequestAsync(int requestResultId)
    {
        var requestResult = await _context.RequestResults.FindAsync(requestResultId);
        if (requestResult == null || requestResult.Status != "Failed")
        {
            return false;
        }

        // Check if it's before 5 PM
        return DateTime.UtcNow.Hour < 17;
    }

    public async Task<RequestResult?> CreateReRequestAsync(int originalRequestResultId, string reRequestReason, int staffId)
    {
        var originalResult = await _context.RequestResults.FindAsync(originalRequestResultId);
        if (originalResult == null || !await CanReRequestAsync(originalRequestResultId))
        {
            return null;
        }

        var reRequest = new RequestResult
        {
            RequestId = originalResult.RequestId,
            Status = "In Progress",
            SubmittedAt = DateTime.UtcNow,
            AdministeredBy = staffId,
            ActionBy = staffId,
            Frequency = originalResult.Frequency,
            TimesPerDay = originalResult.TimesPerDay,
            CurrentDayCount = 0,
            CurrentDate = DateOnly.FromDateTime(DateTime.Today),
            AdministeredFrequencies = "[]",
            FailedFrequencies = "[]",
            FailureReasons = "{}",
            IsReRequest = true,
            OriginalRequestResultId = originalRequestResultId,
            ReRequestReason = reRequestReason,
            LastAttemptTime = DateTime.UtcNow,
            FailedAttempts = 0
        };

        _context.RequestResults.Add(reRequest);
        await _context.SaveChangesAsync();
        return reRequest;
    }

    public async Task<IEnumerable<RequestResult>> GetFailedRequestsAsync()
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(m => m.Student)
            .Where(r => r.Status == "Failed" || r.Status == "Partially Failed")
            .ToListAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetReRequestsAsync(int originalRequestResultId)
    {
        return await _context.RequestResults
            .Where(r => r.OriginalRequestResultId == originalRequestResultId && r.IsReRequest == true)
            .ToListAsync();
    }

    public async Task<bool> MarkAsFailedAsync(int requestResultId, string reason)
    {
        var requestResult = await _context.RequestResults.FindAsync(requestResultId);
        if (requestResult == null)
        {
            return false;
        }

        requestResult.Status = "Failed";
        requestResult.LastAttemptTime = DateTime.UtcNow;
        requestResult.FailedAttempts++;
        
        // Update failure reasons
        var failureReasons = new Dictionary<string, string>();
        if (!string.IsNullOrEmpty(requestResult.FailureReasons))
        {
            try
            {
                failureReasons = JsonSerializer.Deserialize<Dictionary<string, string>>(requestResult.FailureReasons) ?? new Dictionary<string, string>();
            }
            catch { }
        }
        failureReasons["general"] = reason;
        requestResult.FailureReasons = JsonSerializer.Serialize(failureReasons);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateTimeBasedStatusAsync()
    {
        var now = DateTime.UtcNow;
        var cutoffTime = DateTime.Today.AddHours(17); // 5 PM today
        var today = DateOnly.FromDateTime(DateTime.Today);

        // Get all in-progress requests that are past cutoff time or from previous days
        var expiredRequests = await _context.RequestResults
            .Where(r => r.Status == "In Progress" && 
                       (r.CurrentDate < today || now > cutoffTime))
            .ToListAsync();

        foreach (var request in expiredRequests)
        {
            request.Status = "Failed";
            request.LastAttemptTime = now;
            request.FailedAttempts++;
            
            var failureReasons = new Dictionary<string, string>
            {
                ["timeout"] = "Request expired due to time limit"
            };
            request.FailureReasons = JsonSerializer.Serialize(failureReasons);
        }

        if (expiredRequests.Any())
        {
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<(bool isCompleted, IEnumerable<string> pendingFrequencies)> GetProgressInfoAsync(int requestResultId, int medicineRequestItemId)
    {
        var requestResult = await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(m => m.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == requestResultId);

        if (requestResult == null)
        {
            return (false, new List<string>());
        }

        var medicineItem = requestResult.Request?.MedicineRequestItems
            .FirstOrDefault(i => i.MedicineRequestItemId == medicineRequestItemId);

        if (medicineItem == null)
        {
            return (false, new List<string>());
        }

        // Parse administered frequencies
        var administeredFrequencies = new List<string>();
        if (!string.IsNullOrEmpty(requestResult.AdministeredFrequencies))
        {
            try
            {
                administeredFrequencies = JsonSerializer.Deserialize<List<string>>(requestResult.AdministeredFrequencies) ?? new List<string>();
            }
            catch { }
        }

        // Parse expected frequencies from medicine item
        var expectedFrequencies = ParseFrequencyToFrequencies(medicineItem.Frequency);
        
        // Calculate pending frequencies
        var pendingFrequencies = expectedFrequencies.Except(administeredFrequencies).ToList();
        var isCompleted = !pendingFrequencies.Any();

        return (isCompleted, pendingFrequencies);
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

    public async Task<IEnumerable<MedicineRequest>> GetRequestsWithFrequencyMoreThanOneAsync()
    {
        var requests = await _context.MedicineRequests
            .Include(r => r.MedicineRequestItems)
            .Include(r => r.Student)
            .Include(r => r.Parent)
            .Include(r => r.Staff)
            .Where(r => (r.Status == "Assigned" || r.Status == "In Progress"))
            .ToListAsync();
        return requests.Where(r => r.MedicineRequestItems.Any(item => ParseFrequencyToTimesPerDay(item.Frequency) > 1)).ToList();
    }

    public async Task<IEnumerable<MedicineRequest>> GetRequestsNeedingTimeOfDayAsync(string timeOfDay)
    {
        timeOfDay = timeOfDay.ToLower();
        var requests = await _context.MedicineRequests
            .Include(r => r.MedicineRequestItems)
            .Include(r => r.Student)
            .Include(r => r.Parent)
            .Include(r => r.Staff)
            .Where(r => (r.Status == "Assigned" || r.Status == "In Progress"))
            .ToListAsync();
        return requests.Where(r => r.MedicineRequestItems.Any(item => ParseFrequencyToFrequencies(item.Frequency).Any(f => f == timeOfDay))).ToList();
    }

    private async Task<bool> IsRequestResultActuallyCompletedAsync(int requestResultId)
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
            .FirstOrDefault(i => i.MedicineRequestItemId == requestResult.Request.MedicineRequestItems.FirstOrDefault()?.MedicineRequestItemId);

        if (medicineItem == null)
        {
            return false;
        }

        var timesPerDay = ParseFrequencyToTimesPerDay(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);

        return administeredFrequencies.Count >= timesPerDay;
    }

    public async Task<bool> UpdateMedicineRequestItemVerificationStatus(int itemId, string status)
    {
        var item = await _context.MedicineRequestItems.FindAsync(itemId);
        if (item == null) return false;
        item.VerificationStatus = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId)
    {
        return await _context.MedicineRequestItems
            .Include(i => i.MedicineRequest)
                .ThenInclude(m => m.Student)
            .FirstOrDefaultAsync(i => i.MedicineRequestItemId == itemId);
    }

    public async Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item)
    {
        _context.MedicineRequestItems.Update(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int resultId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(m => m.Student)
            .Include(r => r.Request)
                .ThenInclude(m => m.MedicineRequestItems)
            .FirstOrDefaultAsync(r => r.ResultId == resultId);
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