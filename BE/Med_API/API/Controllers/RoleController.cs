using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly IMapper _mapper;

    public RoleController(IRoleService roleService, IMapper mapper)
    {
        _roleService = roleService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleDto.ViewModel>>> GetRoles()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(_mapper.Map<IEnumerable<RoleDto.ViewModel>>(roles));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleDto.ViewModel>> GetRole(int id)
    {
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<RoleDto.ViewModel>(role));
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto.ViewModel>> CreateRole(RoleDto.Create createDto)
    {
        var role = _mapper.Map<DB.Role>(createDto);
        var createdRole = await _roleService.CreateRoleAsync(role);

        if (createdRole == null)
        {
            return BadRequest("Role name already exists");
        }

        return CreatedAtAction(nameof(GetRole), new { id = createdRole.RoleId }, 
            _mapper.Map<RoleDto.ViewModel>(createdRole));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, RoleDto.Update updateDto)
    {
        if (id != updateDto.RoleId)
        {
            return BadRequest("ID mismatch");
        }

        var role = _mapper.Map<DB.Role>(updateDto);
        var success = await _roleService.UpdateRoleAsync(role);

        if (!success)
        {
            return NotFound("Role not found or update failed");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var success = await _roleService.DeleteRoleAsync(id);
        if (!success)
        {
            return BadRequest("Role is in use and cannot be deleted");
        }

        return NoContent();
    }
} 