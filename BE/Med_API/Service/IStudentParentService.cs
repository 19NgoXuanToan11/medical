using DB;

namespace Service;

public interface IStudentParentService
{
    Task<IEnumerable<StudentParent>> GetAllStudentParentsAsync();
    Task<StudentParent?> GetStudentParentByIdAsync(int id);
    Task<StudentParent?> CreateStudentParentAsync(StudentParent studentParent);
    Task<bool> UpdateStudentParentAsync(StudentParent studentParent);
    Task<bool> DeleteStudentParentAsync(int id);
    Task<IEnumerable<StudentParent>> GetStudentParentsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<StudentParent>> GetStudentParentsByParentIdAsync(int parentId);
} 