using DB;

namespace Repo;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetAllAsync();
    Task<Appointment?> GetByIdAsync(int id);
    Task<IEnumerable<Appointment>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<Appointment>> GetByParentIdAsync(int parentId);
    Task<IEnumerable<Appointment>> GetByStaffIdAsync(int staffId);
    Task<Appointment> CreateAsync(Appointment appointment);
    Task<Appointment> UpdateAsync(Appointment appointment);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
