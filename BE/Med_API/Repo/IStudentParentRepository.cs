using DB;

namespace Repo;

public interface IStudentParentRepository
{
    Task<StudentParent?> GetByIdAsync(int id);
    Task<IEnumerable<StudentParent>> GetAllAsync();
    Task<StudentParent> CreateAsync(StudentParent studentParent);
    Task<bool> UpdateAsync(StudentParent studentParent);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<StudentParent>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<StudentParent>> GetByParentIdAsync(int parentId);
    Task<StudentParent?> GetByStudentAndParentIdsAsync(int studentId, int parentId);
} 