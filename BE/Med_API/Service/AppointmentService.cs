using DB;
using Repo;

namespace Service;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;

    public AppointmentService(IAppointmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Appointment?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Appointment>> GetByStudentIdAsync(int studentId)
    {
        return await _repository.GetByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<Appointment>> GetByParentIdAsync(int parentId)
    {
        return await _repository.GetByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<Appointment>> GetByStaffIdAsync(int staffId)
    {
        return await _repository.GetByStaffIdAsync(staffId);
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
    {
        appointment.CreatedDate = DateTime.UtcNow;
        appointment.Status = "Scheduled";
        return await _repository.CreateAsync(appointment);
    }

    public async Task<Appointment> UpdateAsync(int id, Appointment appointment)
    {
        var existingAppointment = await _repository.GetByIdAsync(id);
        if (existingAppointment == null)
            throw new KeyNotFoundException($"Appointment with ID {id} not found.");

        // Update only the provided fields
        if (appointment.AppointmentDate != default)
            existingAppointment.AppointmentDate = appointment.AppointmentDate;
        if (appointment.AppointmentType != null)
            existingAppointment.AppointmentType = appointment.AppointmentType;
        if (appointment.Reason != null)
            existingAppointment.Reason = appointment.Reason;
        if (appointment.Status != null)
            existingAppointment.Status = appointment.Status;
        if (appointment.Notes != null)
            existingAppointment.Notes = appointment.Notes;

        return await _repository.UpdateAsync(existingAppointment);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _repository.ExistsAsync(id))
            throw new KeyNotFoundException($"Appointment with ID {id} not found.");

        await _repository.DeleteAsync(id);
    }
}
