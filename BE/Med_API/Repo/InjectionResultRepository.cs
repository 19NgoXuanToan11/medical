using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class InjectionResultRepository : IInjectionResultRepository
{
    private readonly MedicalContext _context;

    public InjectionResultRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InjectionResult>> GetAllInjectionResultsAsync()
    {
        return await _context.InjectionResults
            .Include(r => r.Form)
            .Include(r => r.Student)
            .ToListAsync();
    }

    public async Task<InjectionResult?> GetInjectionResultByIdAsync(int id)
    {
        return await _context.InjectionResults
            .Include(r => r.Form)
            .Include(r => r.Student)
            .FirstOrDefaultAsync(r => r.ResultId == id);
    }

    public async Task<InjectionResult> CreateInjectionResultAsync(InjectionResult injectionResult)
    {
        _context.InjectionResults.Add(injectionResult);
        await _context.SaveChangesAsync();
        return injectionResult;
    }

    public async Task<bool> UpdateInjectionResultAsync(InjectionResult injectionResult)
    {
        var existingResult = await _context.InjectionResults.FindAsync(injectionResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        _context.Entry(existingResult).CurrentValues.SetValues(injectionResult);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteInjectionResultAsync(int id)
    {
        var injectionResult = await _context.InjectionResults.FindAsync(id);
        if (injectionResult == null)
        {
            return false;
        }
        _context.InjectionResults.Remove(injectionResult);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InjectionResult>> GetInjectionResultsByFormIdAsync(int formId)
    {
        return await _context.InjectionResults
            .Include(r => r.Form)
            .Include(r => r.Student)
            .Where(r => r.FormId == formId)
            .OrderByDescending(r => r.AdministeredDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionResult>> GetInjectionResultsByStudentIdAsync(int studentId)
    {
        return await _context.InjectionResults
            .Include(r => r.Form)
            .Include(r => r.Student)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.AdministeredDate)
            .ToListAsync();
    }

    public async Task<InjectionResult?> GetLatestInjectionResultByFormIdAsync(int formId)
    {
        return await _context.InjectionResults
            .Include(r => r.Form)
            .Include(r => r.Student)
            .Where(r => r.FormId == formId)
            .OrderByDescending(r => r.AdministeredDate)
            .FirstOrDefaultAsync();
    }
} 