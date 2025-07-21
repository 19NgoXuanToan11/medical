using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VaccineController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IVaccineService _vaccineService;

    public VaccineController(IMapper mapper, IVaccineService vaccineService)
    {
        _mapper = mapper;
        _vaccineService = vaccineService;
    }

    // GET: api/Vaccine
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccineDto.ViewModel>>> GetVaccines()
    {
        var vaccines = await _vaccineService.GetAllVaccinesAsync();
        var viewModels = _mapper.Map<IEnumerable<VaccineDto.ViewModel>>(vaccines);
        return Ok(viewModels);
    }

    // GET: api/Vaccine/active
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<VaccineDto.ViewModel>>> GetActiveVaccines()
    {
        var vaccines = await _vaccineService.GetActiveVaccinesAsync();
        var viewModels = _mapper.Map<IEnumerable<VaccineDto.ViewModel>>(vaccines);
        return Ok(viewModels);
    }

    // GET: api/Vaccine/5
    [HttpGet("{id}")]
    public async Task<ActionResult<VaccineDto.ViewModel>> GetVaccine(int id)
    {
        var vaccine = await _vaccineService.GetVaccineByIdAsync(id);
        if (vaccine == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<VaccineDto.ViewModel>(vaccine);
        return Ok(viewModel);
    }

    // POST: api/Vaccine
    [HttpPost]
    public async Task<ActionResult<VaccineDto.ViewModel>> CreateVaccine(VaccineDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var vaccine = _mapper.Map<Vaccine>(createDto);
        var created = await _vaccineService.CreateVaccineAsync(vaccine);
        if (created == null)
        {
            return Conflict("Vaccine với tên này đã tồn tại.");
        }
        var viewModel = _mapper.Map<VaccineDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetVaccine), new { id = viewModel.VaccineId }, viewModel);
    }

    // PUT: api/Vaccine/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVaccine(int id, VaccineDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var vaccine = _mapper.Map<Vaccine>(updateDto);
        vaccine.VaccineId = id;
        var success = await _vaccineService.UpdateVaccineAsync(vaccine);
        if (!success)
        {
            return Conflict("Cập nhật thất bại. Tên có thể đã trùng hoặc không tìm thấy vaccine.");
        }
        return NoContent();
    }

    // DELETE: api/Vaccine/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVaccine(int id)
    {
        var success = await _vaccineService.DeleteVaccineAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 