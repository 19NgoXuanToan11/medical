using API.DTOs;
using AutoMapper;
using DB;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _service;
    private readonly IMapper _mapper;

    public AppointmentController(IAppointmentService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentDto.ViewModel>>> GetAll()
    {
        var appointments = await _service.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<AppointmentDto.ViewModel>>(appointments));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentDto.ViewModel>> GetById(int id)
    {
        var appointment = await _service.GetByIdAsync(id);
        if (appointment == null)
            return NotFound();

        return Ok(_mapper.Map<AppointmentDto.ViewModel>(appointment));
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<AppointmentDto.ViewModel>>> GetByStudentId(int studentId)
    {
        var appointments = await _service.GetByStudentIdAsync(studentId);
        return Ok(_mapper.Map<IEnumerable<AppointmentDto.ViewModel>>(appointments));
    }

    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<AppointmentDto.ViewModel>>> GetByParentId(int parentId)
    {
        var appointments = await _service.GetByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<AppointmentDto.ViewModel>>(appointments));
    }

    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<AppointmentDto.ViewModel>>> GetByStaffId(int staffId)
    {
        var appointments = await _service.GetByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<AppointmentDto.ViewModel>>(appointments));
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentDto.ViewModel>> Create(AppointmentDto.Create dto)
    {
        try
        {
            var appointment = _mapper.Map<Appointment>(dto);
            appointment = await _service.CreateAsync(appointment);
            var viewModel = _mapper.Map<AppointmentDto.ViewModel>(appointment);
            return CreatedAtAction(nameof(GetById), new { id = viewModel.AppointmentId }, viewModel);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AppointmentDto.ViewModel>> Update(int id, AppointmentDto.Update dto)
    {
        try
        {
            var appointment = _mapper.Map<Appointment>(dto);
            appointment = await _service.UpdateAsync(id, appointment);
            return Ok(_mapper.Map<AppointmentDto.ViewModel>(appointment));
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
} 