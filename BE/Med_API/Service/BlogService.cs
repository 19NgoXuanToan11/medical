using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DB;
using Repo;

namespace Service;

public class BlogService : IBlogService
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public BlogService(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<Blog>> GetAllAsync()
    {
        var blogs = await _repo.GetAllAsync();
        return blogs;
    }

    public async Task<Blog?> GetByIdAsync(int id)
    {
        var blog = await _repo.GetByIdAsync(id);
        return blog;
    }

    public async Task<Blog> AddAsync(Blog blog)
    {
        await _repo.AddAsync(blog);
        return blog;
    }

    public async Task<Blog?> UpdateAsync(int id, Blog blog)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            return null;
        _mapper.Map(blog, existing);
        await _repo.UpdateAsync(existing);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
            return false;
        await _repo.DeleteAsync(id);
        return true;
    }

    public async Task<IEnumerable<Blog>> SearchAsync(string? query)
    {
        var blogs = await _repo.SearchAsync(query);
        return blogs;
    }
}
