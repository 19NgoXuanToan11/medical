using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public interface IHealthEventFollowUpRepository
{
    Task<IEnumerable<HealthEventFollowUp>> GetFollowUpsByEventIdAsync(int eventId);
    Task<HealthEventFollowUp?> GetByIdAsync(int followUpId);
    Task<HealthEventFollowUp> CreateAsync(HealthEventFollowUp followUp);
    Task<HealthEventFollowUp> UpdateAsync(HealthEventFollowUp followUp);
    Task DeleteAsync(int followUpId);
}

public class HealthEventFollowUpRepository : IHealthEventFollowUpRepository
{
    private readonly MedicalContext _context;

    public HealthEventFollowUpRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthEventFollowUp>> GetFollowUpsByEventIdAsync(int eventId)
    {
        return await _context
            .HealthEventFollowUps.Include(f => f.Staff)
            .Where(f => f.EventId == eventId)
            .OrderByDescending(f => f.Timestamp)
            .ToListAsync();
    }

    public async Task<HealthEventFollowUp?> GetByIdAsync(int followUpId)
    {
        return await _context
            .HealthEventFollowUps.Include(f => f.Staff)
            .FirstOrDefaultAsync(f => f.FollowUpId == followUpId);
    }

    public async Task<HealthEventFollowUp> CreateAsync(HealthEventFollowUp followUp)
    {
        followUp.Timestamp = DateTime.Now;
        _context.HealthEventFollowUps.Add(followUp);
        await _context.SaveChangesAsync();
        return followUp;
    }

    public async Task<HealthEventFollowUp> UpdateAsync(HealthEventFollowUp followUp)
    {
        _context.HealthEventFollowUps.Update(followUp);
        await _context.SaveChangesAsync();
        return followUp;
    }

    public async Task DeleteAsync(int followUpId)
    {
        var followUp = await _context.HealthEventFollowUps.FindAsync(followUpId);
        if (followUp != null)
        {
            _context.HealthEventFollowUps.Remove(followUp);
            await _context.SaveChangesAsync();
        }
    }
}
