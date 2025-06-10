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
            .Include(p => p.StudentParents)
                .ThenInclude(sp => sp.Student)
            .Include(p => p.MedicineRequests)
            .Include(p => p.InjectionForms)
            .ToListAsync();
    }

    public async Task<Parent?> GetParentByIdAsync(int id)
    {
        return await _context.Parents
            .Include(p => p.StudentParents)
                .ThenInclude(sp => sp.Student)
            .Include(p => p.MedicineRequests)
            .Include(p => p.InjectionForms)
            .FirstOrDefaultAsync(p => p.ParentId == id);
    }

    public async Task<Parent> CreateParentAsync(Parent parent)
    {
        _context.Parents.Add(parent);
        await _context.SaveChangesAsync();
        return parent;
    }

    public async Task<bool> UpdateParentAsync(Parent parent)
    {
        var existingParent = await _context.Parents.FindAsync(parent.ParentId);
        if (existingParent == null)
        {
            return false;
        }

        _context.Entry(existingParent).CurrentValues.SetValues(parent);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteParentAsync(int id)
    {
        var parent = await _context.Parents
            .Include(p => p.StudentParents)
            .Include(p => p.MedicineRequests)
            .Include(p => p.InjectionForms)
            .FirstOrDefaultAsync(p => p.ParentId == id);

        if (parent == null)
        {
            return false;
        }

        // Check if parent has any associated records
        if (parent.StudentParents.Any() || parent.MedicineRequests.Any() || parent.InjectionForms.Any())
        {
            return false; // Parent has associated records, cannot delete
        }

        _context.Parents.Remove(parent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Parent?> GetParentByPhoneAsync(string phone)
    {
        return await _context.Parents
            .Include(p => p.StudentParents)
                .ThenInclude(sp => sp.Student)
            .Include(p => p.MedicineRequests)
            .Include(p => p.InjectionForms)
            .FirstOrDefaultAsync(p => p.Phone == phone);
    }

    public async Task<Parent?> GetParentByEmailAsync(string email)
    {
        return await _context.Parents
            .Include(p => p.StudentParents)
                .ThenInclude(sp => sp.Student)
            .Include(p => p.MedicineRequests)
            .Include(p => p.InjectionForms)
            .FirstOrDefaultAsync(p => p.Email == email);
    }
} 