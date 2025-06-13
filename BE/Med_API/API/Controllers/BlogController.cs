using API.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Service;
using AutoMapper;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _service;
    private readonly IMapper _mapper;

    public BlogController(IBlogService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var blogs = await _service.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<BlogDTO>>(blogs));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var blog = await _service.GetByIdAsync(id);
        if (blog == null) return NotFound();
        return Ok(_mapper.Map<BlogDTO>(blog));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BlogDTO dto)
    {
        var blog = _mapper.Map<DB.Blog>(dto);
        var created = await _service.AddAsync(blog);
        return CreatedAtAction(nameof(Get), new { id = created.BlogId }, _mapper.Map<BlogDTO>(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BlogDTO dto)
    {
        var blog = _mapper.Map<DB.Blog>(dto);
        var updated = await _service.UpdateAsync(id, blog);
        if (updated == null) return NotFound();
        return Ok(_mapper.Map<BlogDTO>(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? query)
    {
        var blogs = await _service.SearchAsync(query);
        return Ok(_mapper.Map<IEnumerable<BlogDTO>>(blogs));
    }
} 