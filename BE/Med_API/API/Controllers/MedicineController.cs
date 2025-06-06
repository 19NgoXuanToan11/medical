using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using AutoMapper;
using DB;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicineController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IMedicineService _medicineService;

    public MedicineController(IMapper mapper, IMedicineService medicineService)
    {
        _mapper = mapper;
        _medicineService = medicineService;
    }

    // GET: api/Medicine
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicineDto.ViewModel>>> GetMedicines()
    {
        var medicines = await _medicineService.GetAllMedicinesAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineDto.ViewModel>>(medicines);
        return Ok(viewModels);
    }

    // GET: api/Medicine/active
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<MedicineDto.ViewModel>>> GetActiveMedicines()
    {
        var medicines = await _medicineService.GetActiveMedicinesAsync();
        var viewModels = _mapper.Map<IEnumerable<MedicineDto.ViewModel>>(medicines);
        return Ok(viewModels);
    }

    // GET: api/Medicine/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicineDto.ViewModel>> GetMedicine(int id)
    {
        var medicine = await _medicineService.GetMedicineByIdAsync(id);
        if (medicine == null)
        {
            return NotFound();
        }
        var viewModel = _mapper.Map<MedicineDto.ViewModel>(medicine);
        return Ok(viewModel);
    }

    // POST: api/Medicine
    [HttpPost]
    public async Task<ActionResult<MedicineDto.ViewModel>> CreateMedicine(MedicineDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var medicine = _mapper.Map<Medicine>(createDto);
        var created = await _medicineService.CreateMedicineAsync(medicine);
        if (created == null)
        {
            return Conflict("Medicine with the same name already exists.");
        }
        var viewModel = _mapper.Map<MedicineDto.ViewModel>(created);
        return CreatedAtAction(nameof(GetMedicine), new { id = viewModel.MedicineId }, viewModel);
    }

    // PUT: api/Medicine/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicine(int id, MedicineDto.Update updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var medicine = _mapper.Map<Medicine>(updateDto);
        medicine.MedicineId = id;
        var success = await _medicineService.UpdateMedicineAsync(medicine);
        if (!success)
        {
            return Conflict("Update failed. Name may not be unique or medicine not found.");
        }
        return NoContent();
    }

    // DELETE: api/Medicine/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicine(int id)
    {
        var success = await _medicineService.DeleteMedicineAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
} 