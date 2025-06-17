using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthProfileController : ControllerBase
{
    private readonly IHealthProfileService _healthProfileService;
    private readonly IMapper _mapper;

    public HealthProfileController(IHealthProfileService healthProfileService, IMapper mapper)
    {
        _healthProfileService = healthProfileService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HealthProfileDto.ViewModel>>> GetAllHealthProfiles()
    {
        var profiles = await _healthProfileService.GetAllHealthProfilesAsync();
        return Ok(_mapper.Map<IEnumerable<HealthProfileDto.ViewModel>>(profiles));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> GetHealthProfileById(int id)
    {
        var profile = await _healthProfileService.GetHealthProfileByIdAsync(id);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDto.ViewModel>(profile));
    }

    [HttpGet("student/{studentCode}")]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> GetHealthProfileByStudentCode(string studentCode)
    {
        var profile = await _healthProfileService.GetHealthProfileByStudentCodeAsync(studentCode);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDto.ViewModel>(profile));
    }

    [HttpPost]
    public async Task<ActionResult<HealthProfileDto.ViewModel>> CreateHealthProfile(HealthProfileDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(createDto);
            var createdProfile = await _healthProfileService.CreateHealthProfileAsync(healthProfile);
            return CreatedAtAction(
                nameof(GetHealthProfileById),
                new { id = createdProfile.HealthProfileId },
                _mapper.Map<HealthProfileDto.ViewModel>(createdProfile));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthProfile(int id, HealthProfileDto.Update updateDto)
    {
        if (id != updateDto.HealthProfileId)
        {
            return BadRequest("ID mismatch");
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(updateDto);
            healthProfile.HealthProfileId = id; // Ensure the ID is set correctly for update
            var success = await _healthProfileService.UpdateHealthProfileAsync(healthProfile);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHealthProfile(int id)
    {
        var success = await _healthProfileService.DeleteHealthProfileAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 