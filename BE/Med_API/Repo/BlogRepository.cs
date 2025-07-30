using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class BlogRepository : IBlogRepository
{
    private readonly MedicalContext _context;

    public BlogRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Blog>> GetAllAsync()
    {
        return await _context.Blogs.Include(b => b.Staff).ToListAsync();
    }

    public async Task<Blog?> GetByIdAsync(int id)
    {
        return await _context.Blogs.Include(b => b.Staff).FirstOrDefaultAsync(b => b.BlogId == id);
    }

    public async Task AddAsync(Blog blog)
    {
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Blog blog)
    {
        _context.Blogs.Update(blog);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog != null)
        {
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Blog>> SearchAsync(string? query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return await _context.Blogs.Include(b => b.Staff).ToListAsync();
        var q = query.ToLower();
        return await _context
            .Blogs.Include(b => b.Staff)
            .Where(b =>
                b.Title.ToLower().Contains(q)
                || (b.Category != null && b.Category.ToLower().Contains(q))
            )
            .ToListAsync();
    }
}
