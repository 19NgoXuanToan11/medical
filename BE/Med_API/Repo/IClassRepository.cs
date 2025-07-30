using DB;

namespace Repo;

public interface IClassRepository
{
    Task<IEnumerable<Class>> GetAllClassesAsync();
    Task<Class?> GetClassByIdAsync(int id);
    Task<Class?> CreateClassAsync(Class classEntity);
    Task<bool> UpdateClassAsync(Class classEntity);
    Task<bool> DeleteClassAsync(int id);
    Task<IEnumerable<Class>> GetClassesByGradeLevelAsync(int gradeLevel);
    Task<IEnumerable<Student>> GetStudentsByClassIdAsync(int classId);
    Task<bool> UpdateStudentCountAsync(int classId);
    Task<IEnumerable<Class>> GetActiveClassesAsync();
    Task<bool> ClassNameExistsAsync(
        string className,
        int gradeLevel,
        string? section = null,
        int? excludeClassId = null
    );
}
