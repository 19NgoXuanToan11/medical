using DB;

namespace Service;

public interface IDashboardSummaryService
{
    Task<IEnumerable<DashboardSummary>> GetAllDashboardSummariesAsync();
    Task<DashboardSummary?> GetDashboardSummaryByIdAsync(int id);
    Task<DashboardSummary?> CreateDashboardSummaryAsync(DashboardSummary dashboardSummary);
    Task<bool> UpdateDashboardSummaryAsync(DashboardSummary dashboardSummary);
    Task<bool> DeleteDashboardSummaryAsync(int id);
    Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByStaffIdAsync(int staffId);
    Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByDateRangeAsync(
        DateTime startDate,
        DateTime endDate
    );
    Task<byte[]> ExportDashboardSummaryToExcelAsync(int id);
}
