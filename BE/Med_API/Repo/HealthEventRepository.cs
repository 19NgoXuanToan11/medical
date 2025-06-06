using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class HealthEventRepository : IHealthEventRepository
{
    private readonly MedicalContext _context;

    public HealthEventRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync()
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Staff)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<HealthEvent?> GetHealthEventByIdAsync(int id)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Staff)
            .FirstOrDefaultAsync(e => e.EventId == id);
    }

    public async Task<HealthEvent> CreateHealthEventAsync(HealthEvent healthEvent)
    {
        _context.HealthEvents.Add(healthEvent);
        await _context.SaveChangesAsync();
        return healthEvent;
    }

    public async Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent)
    {
        var existingEvent = await _context.HealthEvents.FindAsync(healthEvent.EventId);
        if (existingEvent == null)
        {
            return false;
        }

        _context.Entry(existingEvent).CurrentValues.SetValues(healthEvent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteHealthEventAsync(int id)
    {
        var healthEvent = await _context.HealthEvents.FindAsync(id);
        if (healthEvent == null)
        {
            return false;
        }
        _context.HealthEvents.Remove(healthEvent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentIdAsync(int studentId)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Staff)
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Staff)
            .Where(e => e.StaffId == staffId)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
            .Include(e => e.Staff)
            .Where(e => e.EventDate >= startDate && e.EventDate <= endDate)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }
} 