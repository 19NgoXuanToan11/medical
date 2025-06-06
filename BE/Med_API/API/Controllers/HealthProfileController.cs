using API.ViewModels;
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
    public async Task<ActionResult<IEnumerable<HealthProfileDTO>>> GetAllHealthProfiles()
    {
        var profiles = await _healthProfileService.GetAllHealthProfilesAsync();
        return Ok(_mapper.Map<IEnumerable<HealthProfileDTO>>(profiles));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HealthProfileDTO>> GetHealthProfileById(int id)
    {
        var profile = await _healthProfileService.GetHealthProfileByIdAsync(id);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDTO>(profile));
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<HealthProfileDTO>> GetHealthProfileByStudentId(int studentId)
    {
        var profile = await _healthProfileService.GetHealthProfileByStudentIdAsync(studentId);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<HealthProfileDTO>(profile));
    }

    [HttpPost]
    public async Task<ActionResult<HealthProfileDTO>> CreateHealthProfile(HealthProfileDTO profileDto)
    {
        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(profileDto);
            var createdProfile = await _healthProfileService.CreateHealthProfileAsync(healthProfile);
            return CreatedAtAction(
                nameof(GetHealthProfileById),
                new { id = createdProfile.HealthProfileId },
                _mapper.Map<HealthProfileDTO>(createdProfile));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHealthProfile(int id, HealthProfileDTO profileDto)
    {
        if (id != profileDto.HealthProfileId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var healthProfile = _mapper.Map<HealthProfile>(profileDto);
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