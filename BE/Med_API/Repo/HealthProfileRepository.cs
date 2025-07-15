using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class HealthProfileRepository : IHealthProfileRepository
{
    private readonly MedicalContext _context;

    public HealthProfileRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthProfile>> GetAllHealthProfilesAsync()
    {
        return await _context.HealthProfiles
            .Include(p => p.Student)
                .ThenInclude(s => s.Class)
            .Include(p => p.Student)
                .ThenInclude(s => s.StudentParents)
                    .ThenInclude(sp => sp.Parent)
            .ToListAsync();
    }

    public async Task<HealthProfile?> GetHealthProfileByIdAsync(int id)
    {
        return await _context.HealthProfiles
            .Include(p => p.Student)
                .ThenInclude(s => s.Class)
            .Include(p => p.Student)
                .ThenInclude(s => s.StudentParents)
                    .ThenInclude(sp => sp.Parent)
            .FirstOrDefaultAsync(p => p.HealthProfileId == id);
    }

    public async Task<HealthProfile?> GetHealthProfileByStudentCodeAsync(string studentCode)
    {
        return await _context.HealthProfiles
            .Include(p => p.Student)
                .ThenInclude(s => s.Class)
            .Include(p => p.Student)
                .ThenInclude(s => s.StudentParents)
                    .ThenInclude(sp => sp.Parent)
            .FirstOrDefaultAsync(p => p.StudentCode == studentCode);
    }

    public async Task<HealthProfile> CreateHealthProfileAsync(HealthProfile healthProfile)
    {
        _context.HealthProfiles.Add(healthProfile);
        await _context.SaveChangesAsync();
        return healthProfile;
    }

    public async Task<bool> UpdateHealthProfileAsync(HealthProfile healthProfile)
    {
        var existingProfile = await _context.HealthProfiles.FindAsync(healthProfile.HealthProfileId);
        if (existingProfile == null)
        {
            return false;
        }

        _context.Entry(existingProfile).CurrentValues.SetValues(healthProfile);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteHealthProfileAsync(int id)
    {
        var healthProfile = await _context.HealthProfiles.FindAsync(id);
        if (healthProfile == null)
        {
            return false;
        }
        _context.HealthProfiles.Remove(healthProfile);
        await _context.SaveChangesAsync();
        return true;
    }
} 