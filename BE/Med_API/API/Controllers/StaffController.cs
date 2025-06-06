using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;
    private readonly IMapper _mapper;

    public StaffController(IStaffService staffService, IMapper mapper)
    {
        _staffService = staffService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffDto.ViewModel>>> GetStaff()
    {
        var staff = await _staffService.GetAllStaffAsync();
        return Ok(_mapper.Map<IEnumerable<StaffDto.ViewModel>>(staff));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StaffDto.ViewModel>> GetStaff(int id)
    {
        var staff = await _staffService.GetStaffByIdAsync(id);
        if (staff == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<StaffDto.ViewModel>(staff));
    }

    [HttpPost]
    public async Task<ActionResult<StaffDto.ViewModel>> CreateStaff(StaffDto.Create createDto)
    {
        var staff = _mapper.Map<DB.Staff>(createDto);
        var createdStaff = await _staffService.CreateStaffAsync(staff);

        if (createdStaff == null)
        {
            return BadRequest("Username or email already exists");
        }

        return CreatedAtAction(nameof(GetStaff), new { id = createdStaff.StaffId }, 
            _mapper.Map<StaffDto.ViewModel>(createdStaff));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStaff(int id, StaffDto.Update updateDto)
    {
        if (id != updateDto.StaffId)
        {
            return BadRequest("ID mismatch");
        }

        var staff = _mapper.Map<DB.Staff>(updateDto);
        var success = await _staffService.UpdateStaffAsync(staff);

        if (!success)
        {
            return NotFound("Staff not found or update failed");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var success = await _staffService.DeleteStaffAsync(id);
        if (!success)
        {
            return BadRequest("Staff has associated records and cannot be deleted");
        }

        return NoContent();
    }

    [HttpPost("login")]
    public async Task<ActionResult<StaffDto.ViewModel>> Login([FromBody] StaffDto.Create loginDto)
    {
        var isValid = await _staffService.ValidateCredentialsAsync(loginDto.Username, loginDto.Password);
        if (!isValid)
        {
            return Unauthorized("Invalid username or password");
        }

        var staff = await _staffService.GetStaffByUsernameAsync(loginDto.Username);
        return Ok(_mapper.Map<StaffDto.ViewModel>(staff));
    }
} 