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

    public async Task<IEnumerable<StudentParent>> GetAllStudentParentsAsync()
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .ToListAsync();
    }

    public async Task<StudentParent?> GetStudentParentByIdAsync(int id)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .FirstOrDefaultAsync(sp => sp.StudentParentId == id);
    }

    public async Task<StudentParent?> CreateStudentParentAsync(StudentParent studentParent)
    {
        // Verify that both Student and Parent exist
        var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentCode == studentParent.StudentCode);
        var parent = await _context.Parents.FirstOrDefaultAsync(p => p.ParentId == studentParent.ParentId);

        if (student == null || parent == null)
        {
            return null;
        }

        _context.StudentParents.Add(studentParent);
        await _context.SaveChangesAsync();
        return studentParent;
    }

    public async Task<bool> UpdateStudentParentAsync(StudentParent studentParent)
    {
        var existingStudentParent = await _context.StudentParents.FindAsync(studentParent.StudentParentId);
        if (existingStudentParent == null)
        {
            return false;
        }

        // Verify that the new Student exists
        var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentCode == studentParent.StudentCode);
        if (student == null)
        {
            return false;
        }

        _context.Entry(existingStudentParent).CurrentValues.SetValues(studentParent);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteStudentParentAsync(int id)
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

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByStudentCodeAsync(string studentCode)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.StudentCode == studentCode)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByParentIdAsync(int parentId)
    {
        return await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.ParentId == parentId)
            .ToListAsync();
    }
} 