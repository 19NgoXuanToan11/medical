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
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.Parents)
            .ToListAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.Parents)
            .FirstOrDefaultAsync(s => s.StudentId == id);
    }

    public async Task<Student> CreateStudentAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task UpdateStudentAsync(Student student)
    {
        _context.Students.Update(student);
        await _context.SaveChangesAsync();
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
            .FirstOrDefaultAsync(s => s.StudentCode == studentCode);
    }
} 