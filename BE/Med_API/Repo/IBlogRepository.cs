using System.Collections.Generic;
using System.Threading.Tasks;
using DB;

namespace Repo;

public interface IBlogRepository
{
    Task<IEnumerable<Blog>> GetAllAsync();
    Task<Blog?> GetByIdAsync(int id);
    Task AddAsync(Blog blog);
    Task UpdateAsync(Blog blog);
    Task DeleteAsync(int id);
    Task<IEnumerable<Blog>> SearchAsync(string? query);
}
