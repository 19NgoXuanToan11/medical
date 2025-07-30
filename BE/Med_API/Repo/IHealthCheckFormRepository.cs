using DB;

namespace Repo;

public interface IHealthCheckFormRepository
{
    Task<IEnumerable<HealthCheckForm>> GetAllHealthCheckFormsAsync();
    Task<HealthCheckForm?> GetHealthCheckFormByIdAsync(int id);
    Task<HealthCheckForm> CreateHealthCheckFormAsync(HealthCheckForm healthCheckForm);
    Task<bool> UpdateHealthCheckFormAsync(HealthCheckForm healthCheckForm);
    Task<bool> DeleteHealthCheckFormAsync(int id);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStudentIdAsync(int studentId);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByParentIdAsync(int parentId);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStatusAsync(string status);
}
