using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class ClassRepository : IClassRepository
{
    private readonly MedicalContext _context;

    public ClassRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Class>> GetAllClassesAsync()
    {
        return await _context
            .Classes.Include(c => c.Students)
            .ThenInclude(s => s.StudentParents)
            .ThenInclude(sp => sp.Parent)
            .OrderBy(c => c.GradeLevel)
            .ThenBy(c => c.Section)
            .ToListAsync();
    }

    public async Task<Class?> GetClassByIdAsync(int id)
    {
        return await _context
            .Classes.Include(c => c.Students)
            .ThenInclude(s => s.StudentParents)
            .ThenInclude(sp => sp.Parent)
            .FirstOrDefaultAsync(c => c.ClassId == id);
    }

    public async Task<Class?> CreateClassAsync(Class classEntity)
    {
        try
        {
            classEntity.CreatedAt = DateTime.Now;
            classEntity.CurrentStudentCount = 0;

            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();
            return classEntity;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<bool> UpdateClassAsync(Class classEntity)
    {
        try
        {
            var existingClass = await _context.Classes.FindAsync(classEntity.ClassId);
            if (existingClass == null)
                return false;

            existingClass.ClassName = classEntity.ClassName;
            existingClass.GradeLevel = classEntity.GradeLevel;
            existingClass.Section = classEntity.Section;
            existingClass.Description = classEntity.Description;
            existingClass.MaxStudents = classEntity.MaxStudents;
            existingClass.ClassTeacher = classEntity.ClassTeacher;
            existingClass.ClassRoom = classEntity.ClassRoom;
            existingClass.IsActive = classEntity.IsActive;
            existingClass.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> DeleteClassAsync(int id)
    {
        try
        {
            var classEntity = await _context.Classes.FindAsync(id);
            if (classEntity == null)
                return false;

            // Check if class has students
            var hasStudents = await _context.Students.AnyAsync(s => s.ClassId == id);
            if (hasStudents)
            {
                // Soft delete by setting students' ClassId to null
                var students = await _context.Students.Where(s => s.ClassId == id).ToListAsync();
                foreach (var student in students)
                {
                    student.ClassId = null;
                }
            }

            _context.Classes.Remove(classEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<IEnumerable<Class>> GetClassesByGradeLevelAsync(int gradeLevel)
    {
        return await _context
            .Classes.Include(c => c.Students)
            .Where(c => c.GradeLevel == gradeLevel && c.IsActive)
            .OrderBy(c => c.Section)
            .ToListAsync();
    }

    public async Task<IEnumerable<Student>> GetStudentsByClassIdAsync(int classId)
    {
        return await _context
            .Students.Include(s => s.HealthProfiles)
            .Include(s => s.StudentParents)
            .ThenInclude(sp => sp.Parent)
            .Where(s => s.ClassId == classId && s.IsActive == true)
            .OrderBy(s => s.LastName)
            .ThenBy(s => s.FirstName)
            .ToListAsync();
    }

    public async Task<bool> UpdateStudentCountAsync(int classId)
    {
        try
        {
            var classEntity = await _context.Classes.FindAsync(classId);
            if (classEntity == null)
                return false;

            var studentCount = await _context.Students.CountAsync(s =>
                s.ClassId == classId && s.IsActive == true
            );

            classEntity.CurrentStudentCount = studentCount;
            classEntity.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<IEnumerable<Class>> GetActiveClassesAsync()
    {
        return await _context
            .Classes.Include(c => c.Students)
            .Where(c => c.IsActive)
            .OrderBy(c => c.GradeLevel)
            .ThenBy(c => c.Section)
            .ToListAsync();
    }

    public async Task<bool> ClassNameExistsAsync(
        string className,
        int gradeLevel,
        string? section = null,
        int? excludeClassId = null
    )
    {
        var query = _context.Classes.Where(c =>
            c.ClassName == className && c.GradeLevel == gradeLevel
        );

        if (section != null)
        {
            query = query.Where(c => c.Section == section);
        }

        if (excludeClassId.HasValue)
        {
            query = query.Where(c => c.ClassId != excludeClassId.Value);
        }

        return await query.AnyAsync();
    }
}
