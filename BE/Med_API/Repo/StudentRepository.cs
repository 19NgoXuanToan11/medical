using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class StudentRepository : IStudentRepository
{
    private readonly MedicalContext _context;

    public StudentRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Student>> GetAllStudentsAsync()
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .ToListAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .FirstOrDefaultAsync(s => s.StudentId == id);
    }

    public async Task<Student> CreateStudentAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<bool> UpdateStudentAsync(Student student)
    {
        var existingStudent = await _context.Students.FindAsync(student.StudentId);
        if (existingStudent == null)
        {
            return false;
        }

        _context.Entry(existingStudent).CurrentValues.SetValues(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteStudentAsync(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            return false;
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Student?> GetStudentByCodeAsync(string studentCode)
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .FirstOrDefaultAsync(s => s.StudentCode == studentCode);
    }
} 