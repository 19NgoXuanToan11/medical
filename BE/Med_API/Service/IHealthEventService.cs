using DB;

namespace Service;

public interface IHealthEventService
{
    Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync();
    Task<HealthEvent?> GetHealthEventByIdAsync(int id);
    Task<HealthEvent?> CreateHealthEventAsync(HealthEvent healthEvent);
    Task<BatchResult> CreateBatchHealthEventsAsync(IEnumerable<HealthEvent> healthEvents);
    Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent);
    Task<bool> DeleteHealthEventAsync(int id);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(
        DateTime startDate,
        DateTime endDate
    );
    Task<IEnumerable<HealthEvent>> GetHealthEventsByTypeAsync(string eventType);
    Task<IEnumerable<HealthEvent>> GetRecentHealthEventsAsync(int count);
    Task<IEnumerable<HealthEvent>> GetHealthEventsByGradeAsync(int grade);
    Task<IEnumerable<HealthEvent>> GetHealthEventsForNurseByGradeAsync(int staffId);
    Task<IEnumerable<HealthEvent>> GetCriticalIncidentsByStudentAsync(string studentCode);
}

/// <summary>
/// Result of batch health event creation
/// Kết quả tạo sự cố y tế hàng loạt
/// </summary>
public class BatchResult
{
    public int SuccessfulCount { get; set; }
    public int FailedCount { get; set; }
    public List<string> FailedDetails { get; set; } = new List<string>();
    public List<HealthEvent> CreatedEvents { get; set; } = new List<HealthEvent>();
}
