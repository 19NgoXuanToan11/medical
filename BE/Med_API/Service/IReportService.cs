using DB;

namespace Service;

public interface IReportService
{
    Task<IEnumerable<Report>> GetAllReportsAsync();
    Task<Report?> GetReportByIdAsync(int id);
    Task<Report?> CreateReportAsync(Report report);
    Task<bool> UpdateReportAsync(Report report);
    Task<bool> DeleteReportAsync(int id);
    Task<IEnumerable<Report>> GetReportsByTypeAsync(string reportType);
    Task<IEnumerable<Report>> GetReportsByStaffIdAsync(int staffId);
    Task<IEnumerable<Report>> GetReportsByDateRangeAsync(DateTime startDate, DateTime endDate);
} 