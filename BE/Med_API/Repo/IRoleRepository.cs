using DB;

namespace Repo;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllRolesAsync();
    Task<Role?> GetRoleByIdAsync(int id);
    Task<Role> CreateRoleAsync(Role role);
    Task UpdateRoleAsync(Role role);
    Task<bool> DeleteRoleAsync(int id);
    Task<Role?> GetRoleByNameAsync(string roleName);
} 