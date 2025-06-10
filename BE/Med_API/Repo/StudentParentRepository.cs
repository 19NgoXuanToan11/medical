using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class StudentParentRepository : IStudentParentRepository
{
    private readonly MedicalContext _context;

    public StudentParentRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<StudentParent?> GetByIdAsync(int id)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .FirstOrDefaultAsync(sp => sp.StudentParentId == id);
    }

    public async Task<IEnumerable<StudentParent>> GetAllAsync()
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .ToListAsync();
    }

    public async Task<StudentParent> CreateAsync(StudentParent studentParent)
    {
        _context.StudentParents.Add(studentParent);
        await _context.SaveChangesAsync();
        return studentParent;
    }

    public async Task<bool> UpdateAsync(StudentParent studentParent)
    {
        var existingStudentParent = await _context.StudentParents.FindAsync(studentParent.StudentParentId);
        if (existingStudentParent == null)
        {
            return false;
        }

        // Since StudentParent is a linking table, we only need to update the IDs if they change
        existingStudentParent.StudentId = studentParent.StudentId;
        existingStudentParent.ParentId = studentParent.ParentId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var studentParent = await _context.StudentParents.FindAsync(id);
        if (studentParent == null)
        {
            return false;
        }

        _context.StudentParents.Remove(studentParent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<StudentParent>> GetByStudentIdAsync(int studentId)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentParent>> GetByParentIdAsync(int parentId)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<StudentParent?> GetByStudentAndParentIdsAsync(int studentId, int parentId)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .FirstOrDefaultAsync(sp => sp.StudentId == studentId && sp.ParentId == parentId);
    }
} 