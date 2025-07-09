using DB;
using Repo;
using Microsoft.EntityFrameworkCore;

namespace Service;

public class HealthCheckItemService : IHealthCheckItemService
{
    private readonly IHealthCheckItemRepository _healthCheckItemRepository;
    private readonly MedicalContext _context;

    public HealthCheckItemService(IHealthCheckItemRepository healthCheckItemRepository, MedicalContext context)
    {
        _healthCheckItemRepository = healthCheckItemRepository;
        _context = context;
    }

    public async Task<IEnumerable<HealthCheckItem>> GetAllHealthCheckItemsAsync()
    {
        return await _healthCheckItemRepository.GetAllHealthCheckItemsAsync();
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemByIdAsync(int id)
    {
        return await _healthCheckItemRepository.GetHealthCheckItemByIdAsync(id);
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemByCodeAsync(string code)
    {
        return await _healthCheckItemRepository.GetHealthCheckItemByCodeAsync(code);
    }

    public async Task<HealthCheckItem?> CreateHealthCheckItemAsync(HealthCheckItem healthCheckItem)
    {
        // Check for unique code
        var existingItem = await _healthCheckItemRepository.GetHealthCheckItemByCodeAsync(healthCheckItem.Code);
        if (existingItem != null)
        {
            return null; // Code must be unique
        }

        // Validate medical supplies if provided
        if (healthCheckItem.HealthCheckItemMedicalSupplies?.Any() == true)
        {
            var medicalSupplyIds = healthCheckItem.HealthCheckItemMedicalSupplies.Select(ms => ms.MedicalSupplyId).ToList();
            var existingSupplies = await _context.MedicalSupplies
                .Where(ms => medicalSupplyIds.Contains(ms.SupplyId) && ms.IsActive == true)
                .Select(ms => ms.SupplyId)
                .ToListAsync();

            if (existingSupplies.Count != medicalSupplyIds.Count)
            {
                return null; // Some medical supplies don't exist or are inactive
            }
        }

        return await _healthCheckItemRepository.CreateHealthCheckItemAsync(healthCheckItem);
    }

    public async Task<HealthCheckItem?> UpdateHealthCheckItemAsync(int id, HealthCheckItem healthCheckItem)
    {
        var existingItem = await _healthCheckItemRepository.GetHealthCheckItemByIdAsync(id);
        if (existingItem == null)
        {
            return null;
        }

        // Check for unique code (excluding current item)
        if (!string.IsNullOrEmpty(healthCheckItem.Code) && healthCheckItem.Code != existingItem.Code)
        {
            var codeExists = await _healthCheckItemRepository.CodeExistsAsync(healthCheckItem.Code, id);
            if (codeExists)
            {
                return null; // Code must be unique
            }
        }

        // Update fields
        if (!string.IsNullOrEmpty(healthCheckItem.Code))
            existingItem.Code = healthCheckItem.Code;
        if (!string.IsNullOrEmpty(healthCheckItem.Name))
            existingItem.Name = healthCheckItem.Name;
        if (!string.IsNullOrEmpty(healthCheckItem.Category))
            existingItem.Category = healthCheckItem.Category;
        if (healthCheckItem.Description != null)
            existingItem.Description = healthCheckItem.Description;
        if (healthCheckItem.EstimatedTimeMinutes > 0)
            existingItem.EstimatedTimeMinutes = healthCheckItem.EstimatedTimeMinutes;
        
        existingItem.IsActive = healthCheckItem.IsActive;

        await _healthCheckItemRepository.UpdateHealthCheckItemAsync(existingItem);
        return existingItem;
    }

    public async Task<bool> DeleteHealthCheckItemAsync(int id)
    {
        return await _healthCheckItemRepository.DeleteHealthCheckItemAsync(id);
    }

    public async Task<IEnumerable<HealthCheckItem>> GetActiveHealthCheckItemsAsync()
    {
        return await _healthCheckItemRepository.GetActiveHealthCheckItemsAsync();
    }

    public async Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsByCategoryAsync(string category)
    {
        return await _healthCheckItemRepository.GetHealthCheckItemsByCategoryAsync(category);
    }

    public async Task<IEnumerable<string>> GetAllCategoriesAsync()
    {
        return await _healthCheckItemRepository.GetAllCategoriesAsync();
    }

    public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
    {
        return await _healthCheckItemRepository.CodeExistsAsync(code, excludeId);
    }

    public async Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsWithMedicalSuppliesAsync()
    {
        return await _healthCheckItemRepository.GetHealthCheckItemsWithMedicalSuppliesAsync();
    }

    public async Task<HealthCheckItem?> GetHealthCheckItemWithMedicalSuppliesAsync(int id)
    {
        return await _healthCheckItemRepository.GetHealthCheckItemWithMedicalSuppliesAsync(id);
    }

    public async Task<bool> UpdateHealthCheckItemMedicalSuppliesAsync(int healthCheckItemId, IList<HealthCheckItemMedicalSupply> medicalSupplies)
    {
        var healthCheckItem = await _healthCheckItemRepository.GetHealthCheckItemWithMedicalSuppliesAsync(healthCheckItemId);
        if (healthCheckItem == null)
        {
            return false;
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Remove existing medical supplies
            var existingSupplies = await _context.HealthCheckItemMedicalSupplies
                .Where(ms => ms.HealthCheckItemId == healthCheckItemId)
                .ToListAsync();
            
            _context.HealthCheckItemMedicalSupplies.RemoveRange(existingSupplies);

            // Add new medical supplies
            if (medicalSupplies?.Any() == true)
            {
                // Validate medical supplies
                var medicalSupplyIds = medicalSupplies.Select(ms => ms.MedicalSupplyId).ToList();
                var validSupplies = await _context.MedicalSupplies
                    .Where(ms => medicalSupplyIds.Contains(ms.SupplyId) && ms.IsActive == true)
                    .Select(ms => ms.SupplyId)
                    .ToListAsync();

                if (validSupplies.Count != medicalSupplyIds.Count)
                {
                    await transaction.RollbackAsync();
                    return false; // Some medical supplies don't exist or are inactive
                }

                foreach (var supply in medicalSupplies)
                {
                    supply.HealthCheckItemId = healthCheckItemId;
                }

                await _context.HealthCheckItemMedicalSupplies.AddRangeAsync(medicalSupplies);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            return false;
        }
    }
} 