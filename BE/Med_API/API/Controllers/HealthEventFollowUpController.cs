using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HealthEventFollowUpController : ControllerBase
{
    private readonly IHealthEventFollowUpService _followUpService;

    public HealthEventFollowUpController(IHealthEventFollowUpService followUpService)
    {
        _followUpService = followUpService;
    }

    [HttpGet("event/{eventId}")]
    public async Task<
        ActionResult<IEnumerable<HealthEventFollowUpDto.ViewModel>>
    > GetFollowUpsByEventId(int eventId)
    {
        try
        {
            var followUps = await _followUpService.GetFollowUpsByEventIdAsync(eventId);
            return Ok(followUps);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{followUpId}")]
    public async Task<ActionResult<HealthEventFollowUpDto.ViewModel>> GetById(int followUpId)
    {
        try
        {
            var followUp = await _followUpService.GetByIdAsync(followUpId);
            if (followUp == null)
            {
                return NotFound(new { message = "Follow-up not found" });
            }
            return Ok(followUp);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<HealthEventFollowUpDto.ViewModel>> Create(
        [FromBody] HealthEventFollowUpDto.Create createDto
    )
    {
        try
        {
            // Get StaffId from JWT token
            var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (staffIdClaim == null || !int.TryParse(staffIdClaim.Value, out int staffId))
            {
                return BadRequest(new { message = "Invalid user token" });
            }

            // Override the StaffId from the request with the one from JWT token
            createDto.StaffId = staffId;

            var createdFollowUp = await _followUpService.CreateAsync(createDto);
            return CreatedAtAction(
                nameof(GetById),
                new { followUpId = createdFollowUp.FollowUpId },
                createdFollowUp
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{followUpId}")]
    public async Task<ActionResult<HealthEventFollowUpDto.ViewModel>> Update(
        int followUpId,
        [FromBody] HealthEventFollowUpDto.Update updateDto
    )
    {
        try
        {
            if (followUpId != updateDto.FollowUpId)
            {
                return BadRequest(new { message = "Follow-up ID mismatch" });
            }

            var updatedFollowUp = await _followUpService.UpdateAsync(updateDto);
            return Ok(updatedFollowUp);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{followUpId}")]
    public async Task<ActionResult> Delete(int followUpId)
    {
        try
        {
            await _followUpService.DeleteAsync(followUpId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
