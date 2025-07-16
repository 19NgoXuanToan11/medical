using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class HealthCheckFormRepository : IHealthCheckFormRepository
{
    private readonly MedicalContext _context;

    public HealthCheckFormRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthCheckForm>> GetAllHealthCheckFormsAsync()
    {
        return await _context.HealthCheckForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.ConfirmedByStaff)
            .ToListAsync();
    }

    public async Task<HealthCheckForm?> GetHealthCheckFormByIdAsync(int id)
    {
        return await _context.HealthCheckForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.ConfirmedByStaff)
            .FirstOrDefaultAsync(f => f.FormId == id);
    }

    public async Task<HealthCheckForm> CreateHealthCheckFormAsync(HealthCheckForm healthCheckForm)
    {
        _context.HealthCheckForms.Add(healthCheckForm);
        await _context.SaveChangesAsync();
        return healthCheckForm;
    }

    public async Task<bool> UpdateHealthCheckFormAsync(HealthCheckForm healthCheckForm)
    {
        try
        {
            var existingForm = await _context.HealthCheckForms.FindAsync(healthCheckForm.FormId);
            if (existingForm == null)
            {
                Console.WriteLine($"REPO ERROR: HealthCheckForm with ID {healthCheckForm.FormId} not found");
                return false;
            }

            Console.WriteLine($"REPO: Found existing form, updating...");
            Console.WriteLine($"REPO: New Status = {healthCheckForm.Status}");
            Console.WriteLine($"REPO: New ConsentStatus = {healthCheckForm.ConsentStatus}");

            _context.Entry(existingForm).CurrentValues.SetValues(healthCheckForm);
            
            Console.WriteLine($"REPO: Calling SaveChanges...");
            await _context.SaveChangesAsync();
            Console.WriteLine($"REPO: SaveChanges completed successfully");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"REPO ERROR: {ex.Message}");
            Console.WriteLine($"REPO ERROR STACK: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<bool> DeleteHealthCheckFormAsync(int id)
    {
        var healthCheckForm = await _context.HealthCheckForms.FindAsync(id);
        if (healthCheckForm == null)
        {
            return false;
        }
        _context.HealthCheckForms.Remove(healthCheckForm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStudentIdAsync(int studentId)
    {
        return await _context.HealthCheckForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.ConfirmedByStaff)
            .Where(f => f.StudentId == studentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByParentIdAsync(int parentId)
    {
        return await _context.HealthCheckForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.ConfirmedByStaff)
            .Where(f => f.ParentId == parentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStatusAsync(string status)
    {
        return await _context.HealthCheckForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.ConfirmedByStaff)
            .Where(f => f.ConsentStatus == status)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }
} 