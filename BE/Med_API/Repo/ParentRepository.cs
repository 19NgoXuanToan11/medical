using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class ParentRepository : IParentRepository
{
    private readonly MedicalContext _context;

    public ParentRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Parent>> GetAllParentsAsync()
    {
        return await _context.Parents
            .Include(p => p.Staff)
            .Include(p => p.Student)
            .ToListAsync();
    }

    public async Task<Parent?> GetParentByIdAsync(int id)
    {
        return await _context.Parents
            .Include(p => p.Staff)
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.ParentId == id);
    }

    public async Task<Parent> CreateParentAsync(Parent parent)
    {
        _context.Parents.Add(parent);
        await _context.SaveChangesAsync();
        return parent;
    }

    public async Task UpdateParentAsync(Parent parent)
    {
        _context.Parents.Update(parent);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteParentAsync(int id)
    {
        var parent = await _context.Parents.FindAsync(id);
        if (parent == null)
        {
            return false;
        }

        // Check if parent has any associated appointments
        var hasAppointments = await _context.Appointments.AnyAsync(a => a.ParentId == id);
        if (hasAppointments)
        {
            return false; // Parent has appointments, cannot delete
        }

        _context.Parents.Remove(parent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Parent>> GetParentsByStudentIdAsync(int studentId)
    {
        return await _context.Parents
            .Include(p => p.Staff)
            .Include(p => p.Student)
            .Where(p => p.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Parent>> GetParentsByStaffIdAsync(int staffId)
    {
        return await _context.Parents
            .Include(p => p.Staff)
            .Include(p => p.Student)
            .Where(p => p.StaffId == staffId)
            .ToListAsync();
    }
} 