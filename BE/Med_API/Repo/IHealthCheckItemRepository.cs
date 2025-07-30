using DB;

namespace Repo;

public interface IHealthCheckItemRepository
{
    Task<IEnumerable<HealthCheckItem>> GetAllHealthCheckItemsAsync();
    Task<HealthCheckItem?> GetHealthCheckItemByIdAsync(int id);
    Task<HealthCheckItem?> GetHealthCheckItemByCodeAsync(string code);
    Task<HealthCheckItem> CreateHealthCheckItemAsync(HealthCheckItem healthCheckItem);
    Task UpdateHealthCheckItemAsync(HealthCheckItem healthCheckItem);
    Task<bool> DeleteHealthCheckItemAsync(int id);
    Task<IEnumerable<HealthCheckItem>> GetActiveHealthCheckItemsAsync();
    Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsByCategoryAsync(string category);
    Task<IEnumerable<string>> GetAllCategoriesAsync();
    Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    Task<IEnumerable<HealthCheckItem>> GetHealthCheckItemsWithMedicalSuppliesAsync();
    Task<HealthCheckItem?> GetHealthCheckItemWithMedicalSuppliesAsync(int id);
}
