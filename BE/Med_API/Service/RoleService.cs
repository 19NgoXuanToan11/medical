using DB;
using Repo;

namespace Service;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;

    public RoleService(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task<IEnumerable<Role>> GetAllRolesAsync()
    {
        return await _roleRepository.GetAllRolesAsync();
    }

    public async Task<Role?> GetRoleByIdAsync(int id)
    {
        return await _roleRepository.GetRoleByIdAsync(id);
    }

    public async Task<Role?> CreateRoleAsync(Role role)
    {
        // Check for unique role name
        var existingRole = await _roleRepository.GetRoleByNameAsync(role.RoleName);
        if (existingRole != null)
        {
            return null; // Role name already exists
        }

        return await _roleRepository.CreateRoleAsync(role);
    }

    public async Task<bool> UpdateRoleAsync(Role role)
    {
        // Check if role exists
        var existingRole = await _roleRepository.GetRoleByIdAsync(role.RoleId);
        if (existingRole == null)
        {
            return false; // Role not found
        }

        // Check for unique role name if it's being updated
        if (!string.IsNullOrEmpty(role.RoleName) && existingRole.RoleName != role.RoleName)
        {
            var roleWithSameName = await _roleRepository.GetRoleByNameAsync(role.RoleName);
            if (roleWithSameName != null && roleWithSameName.RoleId != role.RoleId)
            {
                return false; // Role name not unique
            }
        }

        // Update only necessary properties
        existingRole.RoleName = role.RoleName;

        await _roleRepository.UpdateRoleAsync(existingRole);
        return true;
    }

    public async Task<bool> DeleteRoleAsync(int id)
    {
        return await _roleRepository.DeleteRoleAsync(id);
    }

    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _roleRepository.GetRoleByNameAsync(roleName);
    }
} 