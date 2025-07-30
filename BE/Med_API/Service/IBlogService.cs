using System.Collections.Generic;
using System.Threading.Tasks;
using DB;

namespace Service;

public interface IBlogService
{
    Task<IEnumerable<Blog>> GetAllAsync();
    Task<Blog?> GetByIdAsync(int id);
    Task<Blog> AddAsync(Blog blog);
    Task<Blog?> UpdateAsync(int id, Blog blog);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Blog>> SearchAsync(string? query);
}
