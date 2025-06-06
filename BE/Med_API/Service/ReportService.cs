using DB;
using Repo;

namespace Service;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly IStaffRepository _staffRepository;
    private readonly IDashboardSummaryRepository _dashboardSummaryRepository;

    public ReportService(
        IReportRepository reportRepository,
        IStaffRepository staffRepository,
        IDashboardSummaryRepository dashboardSummaryRepository)
    {
        _reportRepository = reportRepository;
        _staffRepository = staffRepository;
        _dashboardSummaryRepository = dashboardSummaryRepository;
    }

    public async Task<IEnumerable<Report>> GetAllReportsAsync()
    {
        return await _reportRepository.GetAllReportsAsync();
    }

    public async Task<Report?> GetReportByIdAsync(int id)
    {
        return await _reportRepository.GetReportByIdAsync(id);
    }

    public async Task<Report?> CreateReportAsync(Report report)
    {
        // Validate required fields
        if (string.IsNullOrEmpty(report.ReportType))
        {
            throw new InvalidOperationException("ReportType is required");
        }

        if (string.IsNullOrEmpty(report.ReportName))
        {
            throw new InvalidOperationException("ReportName is required");
        }

        // Validate StaffId if provided
        if (report.GeneratedBy.HasValue)
        {
            var staff = await _staffRepository.GetStaffByIdAsync(report.GeneratedBy.Value);
            if (staff == null)
            {
                throw new InvalidOperationException("Staff not found");
            }
        }

        // Validate DashboardSummaryId if provided
        if (report.BasedOnDashboardId.HasValue)
        {
            var dashboard = await _dashboardSummaryRepository.GetDashboardSummaryByIdAsync(report.BasedOnDashboardId.Value);
            if (dashboard == null)
            {
                throw new InvalidOperationException("Dashboard summary not found");
            }
        }

        // Set default values
        report.GeneratedDate = DateTime.UtcNow;

        return await _reportRepository.CreateReportAsync(report);
    }

    public async Task<bool> UpdateReportAsync(Report report)
    {
        // Validate that the report exists
        var existingReport = await _reportRepository.GetReportByIdAsync(report.ReportId);
        if (existingReport == null)
        {
            return false;
        }

        // Validate required fields
        if (string.IsNullOrEmpty(report.ReportType))
        {
            throw new InvalidOperationException("ReportType is required");
        }

        if (string.IsNullOrEmpty(report.ReportName))
        {
            throw new InvalidOperationException("ReportName is required");
        }

        // Validate StaffId if provided
        if (report.GeneratedBy.HasValue)
        {
            var staff = await _staffRepository.GetStaffByIdAsync(report.GeneratedBy.Value);
            if (staff == null)
            {
                throw new InvalidOperationException("Staff not found");
            }
        }

        // Validate DashboardSummaryId if provided
        if (report.BasedOnDashboardId.HasValue)
        {
            var dashboard = await _dashboardSummaryRepository.GetDashboardSummaryByIdAsync(report.BasedOnDashboardId.Value);
            if (dashboard == null)
            {
                throw new InvalidOperationException("Dashboard summary not found");
            }
        }

        return await _reportRepository.UpdateReportAsync(report);
    }

    public async Task<bool> DeleteReportAsync(int id)
    {
        return await _reportRepository.DeleteReportAsync(id);
    }

    public async Task<IEnumerable<Report>> GetReportsByTypeAsync(string reportType)
    {
        if (string.IsNullOrEmpty(reportType))
        {
            throw new InvalidOperationException("ReportType is required");
        }

        return await _reportRepository.GetReportsByTypeAsync(reportType);
    }

    public async Task<IEnumerable<Report>> GetReportsByStaffIdAsync(int staffId)
    {
        return await _reportRepository.GetReportsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<Report>> GetReportsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            throw new InvalidOperationException("Start date must be before end date");
        }

        return await _reportRepository.GetReportsByDateRangeAsync(startDate, endDate);
    }
} 