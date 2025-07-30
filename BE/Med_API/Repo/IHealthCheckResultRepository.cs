using DB;

namespace Repo;

public interface IHealthCheckResultRepository
{
    Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync();
    Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id);
    Task<HealthCheckResult> CreateHealthCheckResultAsync(HealthCheckResult healthCheckResult);
    Task<bool> UpdateHealthCheckResultAsync(HealthCheckResult healthCheckResult);
    Task<bool> DeleteHealthCheckResultAsync(int id);
    Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByFormIdAsync(int formId);
    Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByStudentIdAsync(int studentId);
    Task<HealthCheckResult?> GetLatestHealthCheckResultByFormIdAsync(int formId);
}
