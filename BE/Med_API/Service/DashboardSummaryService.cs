using DB;
using Repo;

namespace Service;

public class DashboardSummaryService : IDashboardSummaryService
{
    private readonly IDashboardSummaryRepository _dashboardSummaryRepository;
    private readonly IStaffRepository _staffRepository;

    public DashboardSummaryService(
        IDashboardSummaryRepository dashboardSummaryRepository,
        IStaffRepository staffRepository)
    {
        _dashboardSummaryRepository = dashboardSummaryRepository;
        _staffRepository = staffRepository;
    }

    public async Task<IEnumerable<DashboardSummary>> GetAllDashboardSummariesAsync()
    {
        return await _dashboardSummaryRepository.GetAllDashboardSummariesAsync();
    }

    public async Task<DashboardSummary?> GetDashboardSummaryByIdAsync(int id)
    {
        return await _dashboardSummaryRepository.GetDashboardSummaryByIdAsync(id);
    }

    public async Task<DashboardSummary?> CreateDashboardSummaryAsync(DashboardSummary dashboardSummary)
    {
        // Validate StaffId
        if (!dashboardSummary.StaffId.HasValue)
        {
            throw new InvalidOperationException("StaffId is required");
        }

        var staff = await _staffRepository.GetStaffByIdAsync(dashboardSummary.StaffId.Value);
        if (staff == null)
        {
            throw new InvalidOperationException("Staff not found");
        }

        // Set default values
        dashboardSummary.GeneratedDate = DateTime.UtcNow;

        // Initialize counters if not set
        dashboardSummary.TotalInjectionParticipants ??= 0;
        dashboardSummary.TotalInjectionNonParticipants ??= 0;
        dashboardSummary.InjectionParticipationRate ??= 0;
        dashboardSummary.TotalHealthCheckParticipants ??= 0;
        dashboardSummary.TotalHealthCheckNonParticipants ??= 0;
        dashboardSummary.HealthCheckParticipationRate ??= 0;
        dashboardSummary.TotalHealthEvents ??= 0;
        dashboardSummary.TotalMedicineRequests ??= 0;
        dashboardSummary.TotalAppointments ??= 0;
        dashboardSummary.ScheduledAppointments ??= 0;
        dashboardSummary.CompletedAppointments ??= 0;
        dashboardSummary.TotalMedicineItems ??= 0;
        dashboardSummary.TotalSupplyItems ??= 0;

        return await _dashboardSummaryRepository.CreateDashboardSummaryAsync(dashboardSummary);
    }

    public async Task<bool> UpdateDashboardSummaryAsync(DashboardSummary dashboardSummary)
    {
        // Validate that the summary exists
        var existingSummary = await _dashboardSummaryRepository.GetDashboardSummaryByIdAsync(dashboardSummary.SummaryId);
        if (existingSummary == null)
        {
            return false;
        }

        // Validate StaffId
        if (!dashboardSummary.StaffId.HasValue)
        {
            throw new InvalidOperationException("StaffId is required");
        }

        var staff = await _staffRepository.GetStaffByIdAsync(dashboardSummary.StaffId.Value);
        if (staff == null)
        {
            throw new InvalidOperationException("Staff not found");
        }

        return await _dashboardSummaryRepository.UpdateDashboardSummaryAsync(dashboardSummary);
    }

    public async Task<bool> DeleteDashboardSummaryAsync(int id)
    {
        return await _dashboardSummaryRepository.DeleteDashboardSummaryAsync(id);
    }

    public async Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByStaffIdAsync(int staffId)
    {
        return await _dashboardSummaryRepository.GetDashboardSummariesByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            throw new InvalidOperationException("Start date must be before end date");
        }

        return await _dashboardSummaryRepository.GetDashboardSummariesByDateRangeAsync(startDate, endDate);
    }
} 