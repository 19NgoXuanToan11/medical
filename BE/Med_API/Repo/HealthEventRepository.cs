using DB;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

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
                .ThenInclude(s => s.Class)
            .Include(e => e.Staff)
            .Include(e => e.HealthEventMedicines)
                .ThenInclude(hem => hem.Medicine)
            .Include(e => e.HealthEventMedicalSupplies)
                .ThenInclude(hems => hems.MedicalSupply)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<HealthEvent?> GetHealthEventByIdAsync(int id)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
                .ThenInclude(s => s.Class)
            .Include(e => e.Staff)
            .Include(e => e.HealthEventMedicines)
                .ThenInclude(hem => hem.Medicine)
            .Include(e => e.HealthEventMedicalSupplies)
                .ThenInclude(hems => hems.MedicalSupply)
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
        var existingEvent = await _context.HealthEvents
            .Include(e => e.HealthEventMedicines)
            .Include(e => e.HealthEventMedicalSupplies)
            .FirstOrDefaultAsync(e => e.EventId == healthEvent.EventId);

        if (existingEvent == null)
        {
            return false;
        }

        _context.Entry(existingEvent).CurrentValues.SetValues(healthEvent);

        // Handle HealthEventMedicines
        var existingMedicines = existingEvent.HealthEventMedicines.ToList();
        var newMedicines = healthEvent.HealthEventMedicines?.ToList() ?? new List<HealthEventMedicine>();

        foreach (var existingMedicine in existingMedicines.Except(newMedicines, new HealthEventMedicineComparer()))
        {
            _context.HealthEventMedicines.Remove(existingMedicine);
        }

        foreach (var newMedicine in newMedicines)
        {
            var existingMedicine = existingMedicines.FirstOrDefault(m => m.HealthEventMedicineId == newMedicine.HealthEventMedicineId);
            if (existingMedicine == null || newMedicine.HealthEventMedicineId == 0) // New item (ID 0 or not found)
            {
                existingEvent.HealthEventMedicines.Add(newMedicine);
            }
            else // Update existing item
            {
                _context.Entry(existingMedicine).CurrentValues.SetValues(newMedicine);
            }
        }

        // Handle HealthEventMedicalSupplies
        var existingSupplies = existingEvent.HealthEventMedicalSupplies.ToList();
        var newSupplies = healthEvent.HealthEventMedicalSupplies?.ToList() ?? new List<HealthEventMedicalSupply>();

        foreach (var existingSupply in existingSupplies.Except(newSupplies, new HealthEventMedicalSupplyComparer()))
        {
            _context.HealthEventMedicalSupplies.Remove(existingSupply);
        }

        foreach (var newSupply in newSupplies)
        {
            var existingSupply = existingSupplies.FirstOrDefault(s => s.HealthEventMedicalSupplyId == newSupply.HealthEventMedicalSupplyId);
            if (existingSupply == null || newSupply.HealthEventMedicalSupplyId == 0) // New item (ID 0 or not found)
            {
                existingEvent.HealthEventMedicalSupplies.Add(newSupply);
            }
            else // Update existing item
            {
                _context.Entry(existingSupply).CurrentValues.SetValues(newSupply);
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteHealthEventAsync(int id)
    {
        var healthEvent = await _context.HealthEvents
            .Include(e => e.HealthEventMedicines)
            .Include(e => e.HealthEventMedicalSupplies)
            .FirstOrDefaultAsync(e => e.EventId == id);

        if (healthEvent == null)
        {
            return false;
        }

        // Check if health event has any associated records (medicines or supplies)
        if (healthEvent.HealthEventMedicines.Any() || healthEvent.HealthEventMedicalSupplies.Any())
        {
            // Consider if you want to allow deletion even if items exist and let cascade delete handle it,
            // or explicitly return false if business rule dictates no deletion if associated items exist.
            // For now, based on cascade delete setup, we'll allow it but keep the check here.
        }

        _context.HealthEvents.Remove(healthEvent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentCodeAsync(string studentCode)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
                .ThenInclude(s => s.Class)
            .Include(e => e.Staff)
            .Include(e => e.HealthEventMedicines)
                .ThenInclude(hem => hem.Medicine)
            .Include(e => e.HealthEventMedicalSupplies)
                .ThenInclude(hems => hems.MedicalSupply)
            .Where(e => e.StudentCode == studentCode)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
                .ThenInclude(s => s.Class)
            .Include(e => e.Staff)
            .Include(e => e.HealthEventMedicines)
                .ThenInclude(hem => hem.Medicine)
            .Include(e => e.HealthEventMedicalSupplies)
                .ThenInclude(hems => hems.MedicalSupply)
            .Where(e => e.StaffId == staffId)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.HealthEvents
            .Include(e => e.Student)
                .ThenInclude(s => s.Class)
            .Include(e => e.Staff)
            .Include(e => e.HealthEventMedicines)
                .ThenInclude(hem => hem.Medicine)
            .Include(e => e.HealthEventMedicalSupplies)
                .ThenInclude(hems => hems.MedicalSupply)
            .Where(e => e.EventDate >= startDate && e.EventDate <= endDate)
            .OrderByDescending(e => e.EventDate)
            .ToListAsync();
    }
}

public class HealthEventMedicineComparer : IEqualityComparer<HealthEventMedicine>
{
    public bool Equals(HealthEventMedicine? x, HealthEventMedicine? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (ReferenceEquals(x, null) || ReferenceEquals(y, null)) return false;
        return x.HealthEventMedicineId == y.HealthEventMedicineId;
    }

    public int GetHashCode(HealthEventMedicine obj)
    {
        return obj.HealthEventMedicineId.GetHashCode();
    }
}

public class HealthEventMedicalSupplyComparer : IEqualityComparer<HealthEventMedicalSupply>
{
    public bool Equals(HealthEventMedicalSupply? x, HealthEventMedicalSupply? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (ReferenceEquals(x, null) || ReferenceEquals(y, null)) return false;
        return x.HealthEventMedicalSupplyId == y.HealthEventMedicalSupplyId;
    }

    public int GetHashCode(HealthEventMedicalSupply obj)
    {
        return obj.HealthEventMedicalSupplyId.GetHashCode();
    }
} 