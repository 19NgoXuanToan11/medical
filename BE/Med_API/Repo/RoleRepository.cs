using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class RoleRepository : IRoleRepository
{
    private readonly MedicalContext _context;

    public RoleRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Role>> GetAllRolesAsync()
    {
        return await _context.Roles.Include(r => r.Staff).ToListAsync();
    }

    public async Task<Role?> GetRoleByIdAsync(int id)
    {
        return await _context.Roles.Include(r => r.Staff).FirstOrDefaultAsync(r => r.RoleId == id);
    }

    public async Task<Role> CreateRoleAsync(Role role)
    {
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
        return role;
    }

    public async Task UpdateRoleAsync(Role role)
    {
        _context.Roles.Update(role);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteRoleAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
        {
            return false;
        }

        // Check if role is in use
        var staffCount = await _context.Staff.CountAsync(s => s.RoleId == id);
        if (staffCount > 0)
        {
            return false; // Role is in use, cannot delete
        }

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _context
            .Roles.Include(r => r.Staff)
            .FirstOrDefaultAsync(r => r.RoleName == roleName);
    }
}
