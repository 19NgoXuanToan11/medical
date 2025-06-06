using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalSupplyController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IMedicalSupplyService _medicalSupplyService;

    public MedicalSupplyController(IMapper mapper, IMedicalSupplyService medicalSupplyService)
    {
        _mapper = mapper;
        _medicalSupplyService = medicalSupplyService;
    }

    // GET: api/MedicalSupply
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalSupplyDto.ViewModel>>> GetMedicalSupplies()
    {
        var medicalSupplies = await _medicalSupplyService.GetAllMedicalSuppliesAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicalSupplyDto.ViewModel>>(medicalSupplies);
        return Ok(viewModels);
    }

    // GET: api/MedicalSupply/active
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<MedicalSupplyDto.ViewModel>>> GetActiveMedicalSupplies()
    {
        var medicalSupplies = await _medicalSupplyService.GetActiveMedicalSuppliesAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicalSupplyDto.ViewModel>>(medicalSupplies);
        return Ok(viewModels);
    }

    // GET: api/MedicalSupply/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalSupplyDto.ViewModel>> GetMedicalSupply(int id)
    {
        var medicalSupply = await _medicalSupplyService.GetMedicalSupplyByIdAsync(id);
        if (medicalSupply == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<MedicalSupplyDto.ViewModel>(medicalSupply);
        return Ok(viewModel);
    }

    // POST: api/MedicalSupply
    [HttpPost]
    public async Task<ActionResult<MedicalSupplyDto.ViewModel>> CreateMedicalSupply(MedicalSupplyDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var medicalSupply = _mapper.Map<MedicalSupply>(createDto);
        var created = await _medicalSupplyService.CreateMedicalSupplyAsync(medicalSupply);
        if (created == null)
        {
            return Conflict("Medical supply with the same name already exists.");
        }
        var viewModel = _mapper.Map<MedicalSupplyDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetMedicalSupply), new { id = viewModel.SupplyId }, viewModel);
    }

    // PUT: api/MedicalSupply/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicalSupply(int id, MedicalSupplyDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var medicalSupply = _mapper.Map<MedicalSupply>(updateDto);
        medicalSupply.SupplyId = id;
        var success = await _medicalSupplyService.UpdateMedicalSupplyAsync(medicalSupply);
        if (!success)
        {
            return Conflict("Update failed. Name may not be unique or medical supply not found.");
        }
        return NoContent();
    }

    // DELETE: api/MedicalSupply/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicalSupply(int id)
    {
        var success = await _medicalSupplyService.DeleteMedicalSupplyAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 