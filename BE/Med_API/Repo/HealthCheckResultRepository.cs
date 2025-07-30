using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class HealthCheckResultRepository : IHealthCheckResultRepository
{
    private readonly MedicalContext _context;

    public HealthCheckResultRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync()
    {
        return await _context
            .HealthCheckResults.Include(r => r.Form)
            .Include(r => r.Student)
            .Include(r => r.ExaminedByStaff)
            .ToListAsync();
    }

    public async Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id)
    {
        return await _context
            .HealthCheckResults.Include(r => r.Form)
            .Include(r => r.Student)
            .Include(r => r.ExaminedByStaff)
            .FirstOrDefaultAsync(r => r.ResultId == id);
    }

    public async Task<HealthCheckResult> CreateHealthCheckResultAsync(
        HealthCheckResult healthCheckResult
    )
    {
        _context.HealthCheckResults.Add(healthCheckResult);
        await _context.SaveChangesAsync();
        return healthCheckResult;
    }

    public async Task<bool> UpdateHealthCheckResultAsync(HealthCheckResult healthCheckResult)
    {
        var existingResult = await _context.HealthCheckResults.FindAsync(
            healthCheckResult.ResultId
        );
        if (existingResult == null)
        {
            return false;
        }

        _context.Entry(existingResult).CurrentValues.SetValues(healthCheckResult);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteHealthCheckResultAsync(int id)
    {
        var healthCheckResult = await _context.HealthCheckResults.FindAsync(id);
        if (healthCheckResult == null)
        {
            return false;
        }
        _context.HealthCheckResults.Remove(healthCheckResult);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByFormIdAsync(int formId)
    {
        return await _context
            .HealthCheckResults.Include(r => r.Form)
            .Include(r => r.Student)
            .Include(r => r.ExaminedByStaff)
            .Where(r => r.FormId == formId)
            .OrderByDescending(r => r.ExaminedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByStudentIdAsync(
        int studentId
    )
    {
        return await _context
            .HealthCheckResults.Include(r => r.Form)
            .Include(r => r.Student)
            .Include(r => r.ExaminedByStaff)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.ExaminedDate)
            .ToListAsync();
    }

    public async Task<HealthCheckResult?> GetLatestHealthCheckResultByFormIdAsync(int formId)
    {
        return await _context
            .HealthCheckResults.Include(r => r.Form)
            .Include(r => r.Student)
            .Include(r => r.ExaminedByStaff)
            .Where(r => r.FormId == formId)
            .OrderByDescending(r => r.ExaminedDate)
            .FirstOrDefaultAsync();
    }
}
