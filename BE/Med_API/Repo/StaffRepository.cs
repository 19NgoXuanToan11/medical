using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class StaffRepository : IStaffRepository
{
    private readonly MedicalContext _context;

    public StaffRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Staff>> GetAllStaffAsync()
    {
        return await _context
            .Staff.Include(s => s.Role)
            .Include(s => s.HealthEvents)
            .Include(s => s.MedicineRequests)
            .ToListAsync();
    }

    public async Task<Staff?> GetStaffByIdAsync(int id)
    {
        var staff = await _context
            .Staff.Include(s => s.Role)
            .Include(s => s.HealthEvents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.GradeNurses)
            .FirstOrDefaultAsync(s => s.StaffId == id);

        return staff;
    }

    public async Task<Staff> CreateStaffAsync(Staff staff)
    {
        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();
        return staff;
    }

    public async Task UpdateStaffAsync(Staff staff)
    {
        _context.Staff.Update(staff);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteStaffAsync(int id)
    {
        var staff = await _context
            .Staff.Include(s => s.HealthEvents)
            .Include(s => s.MedicineRequests)
            .FirstOrDefaultAsync(s => s.StaffId == id);

        if (staff == null)
        {
            return false;
        }

        // Check if staff has any associated records
        if (staff.HealthEvents.Any() || staff.MedicineRequests.Any())
        {
            return false; // Staff has associated records, cannot delete
        }

        _context.Staff.Remove(staff);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Staff?> GetStaffByUsernameAsync(string username)
    {
        return await _context
            .Staff.Include(s => s.Role)
            .Include(s => s.MedicineRequests)
            .FirstOrDefaultAsync(s => s.Username == username);
    }

    public async Task<Staff?> GetStaffByEmailAsync(string email)
    {
        return await _context
            .Staff.Include(s => s.Role)
            .Include(s => s.MedicineRequests)
            .FirstOrDefaultAsync(s => s.Email == email);
    }

    // GradeNurse management
    public async Task<GradeNurse> CreateGradeNurseAsync(GradeNurse gradeNurse)
    {
        _context.GradeNurses.Add(gradeNurse);
        await _context.SaveChangesAsync();
        return gradeNurse;
    }

    public async Task<bool> DeleteGradeNurseAsync(int gradeNurseId)
    {
        var entity = await _context.GradeNurses.FindAsync(gradeNurseId);
        if (entity == null)
            return false;
        _context.GradeNurses.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<GradeNurse>> GetGradeNursesByGradeAsync(int grade)
    {
        return await _context
            .GradeNurses.Include(g => g.Nurse)
            .Where(g => g.Grade == grade)
            .ToListAsync();
    }

    public async Task<IEnumerable<GradeNurse>> GetGradeNursesByStaffIdAsync(int staffId)
    {
        return await _context
            .GradeNurses.Include(g => g.Nurse)
            .Where(g => g.StaffId == staffId)
            .ToListAsync();
    }

    public async Task<IEnumerable<GradeNurse>> GetAllGradeNursesAsync()
    {
        return await _context.GradeNurses.Include(g => g.Nurse).ToListAsync();
    }
}
