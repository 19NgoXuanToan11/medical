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
        return await _context.Staff
            .Include(s => s.Role)
            .Include(s => s.HealthEvents)
            .ToListAsync();
    }

    public async Task<Staff?> GetStaffByIdAsync(int id)
    {
        return await _context.Staff
            .Include(s => s.Role)
            .Include(s => s.HealthEvents)
            .FirstOrDefaultAsync(s => s.StaffId == id);
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
        var staff = await _context.Staff
            .Include(s => s.HealthEvents)
            .FirstOrDefaultAsync(s => s.StaffId == id);

        if (staff == null)
        {
            return false;
        }

        // Check if staff has any associated records
        if (staff.HealthEvents.Any())
        {
            return false; // Staff has associated records, cannot delete
        }

        _context.Staff.Remove(staff);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Staff?> GetStaffByUsernameAsync(string username)
    {
        return await _context.Staff
            .Include(s => s.Role)
            .FirstOrDefaultAsync(s => s.Username == username);
    }

    public async Task<Staff?> GetStaffByEmailAsync(string email)
    {
        return await _context.Staff
            .Include(s => s.Role)
            .FirstOrDefaultAsync(s => s.Email == email);
    }
} 