using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class HealthCheckItemRepository : IHealthCheckItemRepository
{
    private readonly MedicalContext _context;

    public HealthCheckItemRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthCheckItem>> GetAllHealthCheckItemsAsync()
    {
        return await _context
            .HealthCheckItems.Include(h => h.HealthCheckItemMedicalSupplies)
            .ThenInclude(ms => ms.MedicalSupply)
            .OrderBy(h => h.Name)
            .ToListAsync();
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemByIdAsync(int id)
    {
        return await _context.HealthCheckItems.FirstOrDefaultAsync(h => h.ItemId == id);
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemByCodeAsync(string code)
    {
        return await _context.HealthCheckItems.FirstOrDefaultAsync(h => h.Code == code);
    }

    public async Task<HealthCheckItem> CreateHealthCheckItemAsync(HealthCheckItem healthCheckItem)
    {
        healthCheckItem.CreatedDate = DateTime.Now;
        _context.HealthCheckItems.Add(healthCheckItem);
        await _context.SaveChangesAsync();
        return healthCheckItem;
    }

    public async Task UpdateHealthCheckItemAsync(HealthCheckItem healthCheckItem)
    {
        healthCheckItem.UpdatedDate = DateTime.Now;
        _context.HealthCheckItems.Update(healthCheckItem);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteHealthCheckItemAsync(int id)
    {
        var healthCheckItem = await _context.HealthCheckItems.FindAsync(id);
        if (healthCheckItem == null)
        {
            return false;
        }
        _context.HealthCheckItems.Remove(healthCheckItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<HealthCheckItem>> GetActiveHealthCheckItemsAsync()
    {
        return await _context
            .HealthCheckItems.Where(h => h.IsActive)
            .Include(h => h.HealthCheckItemMedicalSupplies)
            .ThenInclude(ms => ms.MedicalSupply)
            .OrderBy(h => h.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsByCategoryAsync(
        string category
    )
    {
        return await _context
            .HealthCheckItems.Where(h => h.Category == category && h.IsActive)
            .Include(h => h.HealthCheckItemMedicalSupplies)
            .ThenInclude(ms => ms.MedicalSupply)
            .OrderBy(h => h.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllCategoriesAsync()
    {
        return await _context
            .HealthCheckItems.Where(h => h.IsActive)
            .Select(h => h.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
    {
        var query = _context.HealthCheckItems.Where(h => h.Code == code);
        if (excludeId.HasValue)
        {
            query = query.Where(h => h.ItemId != excludeId.Value);
        }
        return await query.AnyAsync();
    }

    public async Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsWithMedicalSuppliesAsync()
    {
        return await _context
            .HealthCheckItems.Include(h => h.HealthCheckItemMedicalSupplies)
            .ThenInclude(ms => ms.MedicalSupply)
            .Where(h => h.IsActive)
            .OrderBy(h => h.Name)
            .ToListAsync();
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemWithMedicalSuppliesAsync(int id)
    {
        return await _context
            .HealthCheckItems.Include(h => h.HealthCheckItemMedicalSupplies)
            .ThenInclude(ms => ms.MedicalSupply)
            .FirstOrDefaultAsync(h => h.ItemId == id);
    }
}
