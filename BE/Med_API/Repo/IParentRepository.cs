using DB;

namespace Repo;

public interface IParentRepository
{
    Task<IEnumerable<Parent>> GetAllParentsAsync();
    Task<Parent?> GetParentByIdAsync(int id);
    Task<Parent> CreateParentAsync(Parent parent);
    Task UpdateParentAsync(Parent parent);
    Task<bool> DeleteParentAsync(int id);
    Task<IEnumerable<Parent>> GetParentsByStudentIdAsync(int studentId);
    Task<IEnumerable<Parent>> GetParentsByStaffIdAsync(int staffId);
} 