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
            .ToListAsync();
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int id)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
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
        var existingResult = await _context.RequestResults.FindAsync(requestResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        _context.Entry(existingResult).CurrentValues.SetValues(requestResult);
        await _context.SaveChangesAsync();
        return true;
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
            .Where(r => r.RequestId == requestId)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetRequestResultsByStatusAsync(string status)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync();
    }

    public async Task<RequestResult?> GetLatestRequestResultByRequestIdAsync(int requestId)
    {
        return await _context.RequestResults
            .Include(r => r.Request)
            .Where(r => r.RequestId == requestId)
            .OrderByDescending(r => r.SubmittedAt)
            .FirstOrDefaultAsync();
    }
} 