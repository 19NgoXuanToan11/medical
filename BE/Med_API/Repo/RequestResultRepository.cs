using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class RequestResultRepository : IRequestResultRepository
{
    private readonly MedicalContext _context;

    public RequestResultRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RequestResult>> GetAllRequestResultsAsync()
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.StudentParents)
                        .ThenInclude(sp => sp.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.Students)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Staff)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
                .ThenInclude(staff => staff.Role)
            .Include(r => r.ActionByStaff)
                .ThenInclude(staff => staff.Role)
            .ToListAsync();
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int id)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.StudentParents)
                        .ThenInclude(sp => sp.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.Students)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Staff)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
                .ThenInclude(staff => staff.Role)
            .Include(r => r.ActionByStaff)
                .ThenInclude(staff => staff.Role)
            .FirstOrDefaultAsync(r => r.ResultId == id);
    }

    public async Task<RequestResult> CreateRequestResultAsync(RequestResult requestResult)
    {
        _context.RequestResults.Add(requestResult);
        await _context.SaveChangesAsync();
        return requestResult;
    }

    public async Task<bool> UpdateRequestResultAsync(RequestResult requestResult)
    {
        var existingResult = await _context.RequestResults
            .Include(r => r.Request)
            .FirstOrDefaultAsync(r => r.ResultId == requestResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        _context.Entry(existingResult).CurrentValues.SetValues(requestResult);

        // Only synchronize MedicineRequest status if RequestResult is being marked as completed
        // AND the MedicineRequest is not already completed
        if (requestResult.Status == "Completed" && existingResult.Request != null && existingResult.Request.Status != "Completed")
        {
            // Check if the RequestResult is actually completed based on frequency
            var isActuallyCompleted = await IsRequestResultActuallyCompletedAsync(requestResult.ResultId);
            if (isActuallyCompleted)
            {
                existingResult.Request.Status = requestResult.Status;
            }
            else
            {
                // If not actually completed, don't mark as completed
                existingResult.Status = "In Progress";
            }
        }

        await _context.SaveChangesAsync();
        return true;
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

        var medicineItem = requestResult.Request?.MedicineRequestItems.FirstOrDefault();
        if (medicineItem == null)
        {
            return false;
        }

        // Parse frequency to determine required times per day
        var timesPerDay = ParseFrequencyToTimesPerDay(medicineItem.Frequency);
        var administeredFrequencies = ParseAdministeredFrequencies(requestResult.AdministeredFrequencies);

        return administeredFrequencies.Count >= timesPerDay;
    }

    private int ParseFrequencyToTimesPerDay(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency))
            return 1;

        // Handle different frequency formats
        if (frequency.Contains("2") || frequency.Contains("hai") || frequency.Contains("two"))
            return 2;
        if (frequency.Contains("3") || frequency.Contains("ba") || frequency.Contains("three"))
            return 3;
        if (frequency.Contains("4") || frequency.Contains("bốn") || frequency.Contains("four"))
            return 4;

        return 1; // Default to once per day
    }

    private List<string> ParseAdministeredFrequencies(string? administeredFrequenciesJson)
    {
        if (string.IsNullOrEmpty(administeredFrequenciesJson))
            return new List<string>();

        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(administeredFrequenciesJson) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    public async Task<bool> DeleteRequestResultAsync(int id)
    {
        var requestResult = await _context.RequestResults.FindAsync(id);
        if (requestResult == null)
        {
            return false;
        }
        _context.RequestResults.Remove(requestResult);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<RequestResult>> GetRequestResultsByRequestIdAsync(int requestId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.StudentParents)
                        .ThenInclude(sp => sp.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.Students)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Staff)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
                .ThenInclude(staff => staff.Role)
            .Include(r => r.ActionByStaff)
                .ThenInclude(staff => staff.Role)
            .Where(r => r.RequestId == requestId)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetRequestResultsByStatusAsync(string status)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.StudentParents)
                        .ThenInclude(sp => sp.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.Students)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Staff)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
                .ThenInclude(staff => staff.Role)
            .Include(r => r.ActionByStaff)
                .ThenInclude(staff => staff.Role)
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<RequestResult?> GetLatestRequestResultByRequestIdAsync(int requestId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.StudentParents)
                        .ThenInclude(sp => sp.Student)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Parent)
                    .ThenInclude(p => p.Students)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.Staff)
            .Include(r => r.Request)
                .ThenInclude(rq => rq.MedicineRequestItems)
            .Include(r => r.AdministeredByStaff)
                .ThenInclude(staff => staff.Role)
            .Include(r => r.ActionByStaff)
                .ThenInclude(staff => staff.Role)
            .Where(r => r.RequestId == requestId)
            .OrderByDescending(r => r.SubmittedAt)
            .FirstOrDefaultAsync();
    }
} 