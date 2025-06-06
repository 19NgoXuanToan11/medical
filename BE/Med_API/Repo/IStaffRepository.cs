using DB;

namespace Repo;

public interface IStaffRepository
{
    Task<IEnumerable<Staff>> GetAllStaffAsync();
    Task<Staff?> GetStaffByIdAsync(int id);
    Task<Staff> CreateStaffAsync(Staff staff);
    Task UpdateStaffAsync(Staff staff);
    Task<bool> DeleteStaffAsync(int id);
    Task<Staff?> GetStaffByUsernameAsync(string username);
    Task<Staff?> GetStaffByEmailAsync(string email);
} 