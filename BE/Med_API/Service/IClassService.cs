using DB;

namespace Service;

public interface IClassService
{
    Task<IEnumerable<Class>> GetAllClassesAsync();
    Task<Class?> GetClassByIdAsync(int id);
    Task<Class?> CreateClassAsync(Class classEntity);
    Task<bool> UpdateClassAsync(Class classEntity);
    Task<bool> DeleteClassAsync(int id);
    Task<IEnumerable<Class>> GetClassesByGradeLevelAsync(int gradeLevel);
    Task<IEnumerable<Student>> GetStudentsByClassIdAsync(int classId);
    Task<bool> AssignStudentToClassAsync(int studentId, int classId);
    Task<bool> RemoveStudentFromClassAsync(int studentId);
    Task<IEnumerable<Class>> GetActiveClassesAsync();
    Task<bool> ValidateClassDataAsync(Class classEntity);
    Task<int> PromoteStudentsToNextClassIfNewYearAsync();
} 