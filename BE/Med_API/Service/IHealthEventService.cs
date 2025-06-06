using DB;

namespace Service;

public interface IHealthEventService
{
    Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync();
    Task<HealthEvent?> GetHealthEventByIdAsync(int id);
    Task<HealthEvent?> CreateHealthEventAsync(HealthEvent healthEvent);
    Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent);
    Task<bool> DeleteHealthEventAsync(int id);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentIdAsync(int studentId);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
} 