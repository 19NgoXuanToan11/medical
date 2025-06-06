using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class ReportRepository : IReportRepository
{
    private readonly MedicalContext _context;

    public ReportRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Report>> GetAllReportsAsync()
    {
        return await _context.Reports
            .Include(r => r.GeneratedByStaff)
            .Include(r => r.BasedOnDashboard)
            .OrderByDescending(r => r.GeneratedDate)
            .ToListAsync();
    }

    public async Task<Report?> GetReportByIdAsync(int id)
    {
        return await _context.Reports
            .Include(r => r.GeneratedByStaff)
            .Include(r => r.BasedOnDashboard)
            .FirstOrDefaultAsync(r => r.ReportId == id);
    }

    public async Task<Report> CreateReportAsync(Report report)
    {
        _context.Reports.Add(report);
        await _context.SaveChangesAsync();
        return report;
    }

    public async Task<bool> UpdateReportAsync(Report report)
    {
        var existingReport = await _context.Reports.FindAsync(report.ReportId);
        if (existingReport == null)
        {
            return false;
        }

        _context.Entry(existingReport).CurrentValues.SetValues(report);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteReportAsync(int id)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null)
        {
            return false;
        }
        _context.Reports.Remove(report);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Report>> GetReportsByTypeAsync(string reportType)
    {
        return await _context.Reports
            .Include(r => r.GeneratedByStaff)
            .Include(r => r.BasedOnDashboard)
            .Where(r => r.ReportType == reportType)
            .OrderByDescending(r => r.GeneratedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Report>> GetReportsByStaffIdAsync(int staffId)
    {
        return await _context.Reports
            .Include(r => r.GeneratedByStaff)
            .Include(r => r.BasedOnDashboard)
            .Where(r => r.GeneratedBy == staffId)
            .OrderByDescending(r => r.GeneratedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Report>> GetReportsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Reports
            .Include(r => r.GeneratedByStaff)
            .Include(r => r.BasedOnDashboard)
            .Where(r => r.GeneratedDate >= startDate && r.GeneratedDate <= endDate)
            .OrderByDescending(r => r.GeneratedDate)
            .ToListAsync();
    }
} 