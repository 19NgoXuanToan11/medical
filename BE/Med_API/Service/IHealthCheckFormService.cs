using DB;

namespace Service;

public interface IHealthCheckFormService
{
    Task<IEnumerable<HealthCheckForm>> GetAllHealthCheckFormsAsync();
    Task<HealthCheckForm?> GetHealthCheckFormByIdAsync(int id);
    Task<HealthCheckForm?> CreateHealthCheckFormAsync(HealthCheckForm healthCheckForm);
    Task<bool> UpdateHealthCheckFormAsync(HealthCheckForm healthCheckForm);
    Task<bool> DeleteHealthCheckFormAsync(int id);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStudentIdAsync(int studentId);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByParentIdAsync(int parentId);
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStatusAsync(string status);

    // New methods for health check scheduling
    Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesAsync();
    Task<HealthCheckForm?> GetHealthCheckScheduleByIdAsync(int id);
    Task<HealthCheckForm?> CreateHealthCheckScheduleAsync(HealthCheckForm schedule);
    Task<bool> UpdateHealthCheckScheduleAsync(HealthCheckForm schedule);
    Task<bool> DeleteHealthCheckScheduleAsync(int id);
} 