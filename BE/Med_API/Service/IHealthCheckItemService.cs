using DB;

namespace Service;

public interface IHealthCheckItemService
{
    Task<IEnumerable<HealthCheckItem>> GetAllHealthCheckItemsAsync();
    Task<HealthCheckItem?> GetHealthCheckItemByIdAsync(int id);
    Task<HealthCheckItem?> GetHealthCheckItemByCodeAsync(string code);
    Task<HealthCheckItem?> CreateHealthCheckItemAsync(HealthCheckItem healthCheckItem);
    Task<HealthCheckItem?> UpdateHealthCheckItemAsync(int id, HealthCheckItem healthCheckItem);
    Task<bool> DeleteHealthCheckItemAsync(int id);
    Task<IEnumerable<HealthCheckItem>> GetActiveHealthCheckItemsAsync();
    Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsByCategoryAsync(string category);
    Task<IEnumerable<string>> GetAllCategoriesAsync();
    Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsWithMedicalSuppliesAsync();
    Task<HealthCheckItem?> GetHealthCheckItemWithMedicalSuppliesAsync(int id);
    Task<bool> UpdateHealthCheckItemMedicalSuppliesAsync(int healthCheckItemId, IList<HealthCheckItemMedicalSupply> medicalSupplies);
} 