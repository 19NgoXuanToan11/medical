using DB;

namespace Repo;

public interface IHealthEventRepository
{
    Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync();
    Task<HealthEvent?> GetHealthEventByIdAsync(int id);
    Task<HealthEvent> CreateHealthEventAsync(HealthEvent healthEvent);
    Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent);
    Task<bool> DeleteHealthEventAsync(int id);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByTypeAsync(string eventType);
    Task<IEnumerable<HealthEvent>> GetRecentHealthEventsAsync(int count);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByGradeAsync(int grade);
    Task<IEnumerable<HealthEvent>> GetHealthEventsForNurseByGradeAsync(int staffId);
} 