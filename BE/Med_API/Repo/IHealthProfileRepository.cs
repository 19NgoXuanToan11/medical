using DB;

namespace Repo;

public interface IHealthProfileRepository
{
    Task<IEnumerable<HealthProfile>> GetAllHealthProfilesAsync();
    Task<HealthProfile?> GetHealthProfileByIdAsync(int id);
    Task<HealthProfile?> GetHealthProfileByStudentCodeAsync(string studentCode);
    Task<HealthProfile> CreateHealthProfileAsync(HealthProfile healthProfile);
    Task<bool> UpdateHealthProfileAsync(HealthProfile healthProfile);
    Task<bool> DeleteHealthProfileAsync(int id);
}
