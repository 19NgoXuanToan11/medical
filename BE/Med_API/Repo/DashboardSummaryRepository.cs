using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class DashboardSummaryRepository : IDashboardSummaryRepository
{
    private readonly MedicalContext _context;

    public DashboardSummaryRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DashboardSummary>> GetAllDashboardSummariesAsync()
    {
        return await _context.DashboardSummaries
            .Include(d => d.Staff)
            .OrderByDescending(d => d.GeneratedDate)
            .ToListAsync();
    }

    public async Task<DashboardSummary?> GetDashboardSummaryByIdAsync(int id)
    {
        return await _context.DashboardSummaries
            .Include(d => d.Staff)
            .FirstOrDefaultAsync(d => d.SummaryId == id);
    }

    public async Task<DashboardSummary> CreateDashboardSummaryAsync(DashboardSummary dashboardSummary)
    {
        _context.DashboardSummaries.Add(dashboardSummary);
        await _context.SaveChangesAsync();
        return dashboardSummary;
    }

    public async Task<bool> UpdateDashboardSummaryAsync(DashboardSummary dashboardSummary)
    {
        var existingSummary = await _context.DashboardSummaries.FindAsync(dashboardSummary.SummaryId);
        if (existingSummary == null)
        {
            return false;
        }

        _context.Entry(existingSummary).CurrentValues.SetValues(dashboardSummary);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteDashboardSummaryAsync(int id)
    {
        var dashboardSummary = await _context.DashboardSummaries.FindAsync(id);
        if (dashboardSummary == null)
        {
            return false;
        }
        _context.DashboardSummaries.Remove(dashboardSummary);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByStaffIdAsync(int staffId)
    {
        return await _context.DashboardSummaries
            .Include(d => d.Staff)
            .Where(d => d.StaffId == staffId)
            .OrderByDescending(d => d.GeneratedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<DashboardSummary>> GetDashboardSummariesByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.DashboardSummaries
            .Include(d => d.Staff)
            .Where(d => d.GeneratedDate >= startDate && d.GeneratedDate <= endDate)
            .OrderByDescending(d => d.GeneratedDate)
            .ToListAsync();
    }
} 