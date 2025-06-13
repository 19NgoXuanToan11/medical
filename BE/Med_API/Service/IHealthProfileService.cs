using DB;

namespace Service;

public interface IHealthProfileService
{
    Task<IEnumerable<HealthProfile>> GetAllHealthProfilesAsync();
    Task<HealthProfile?> GetHealthProfileByIdAsync(int id);
    Task<HealthProfile?> GetHealthProfileByStudentCodeAsync(string studentCode);
    Task<HealthProfile?> CreateHealthProfileAsync(HealthProfile healthProfile);
    Task<bool> UpdateHealthProfileAsync(HealthProfile healthProfile);
    Task<bool> DeleteHealthProfileAsync(int id);
} 