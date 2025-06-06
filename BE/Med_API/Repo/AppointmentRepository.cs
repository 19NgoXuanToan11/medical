using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly MedicalContext _context;

    public AppointmentRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync()
    {
        return await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Parent)
            .Include(a => a.Staff)
            .ToListAsync();
    }

    public async Task<Appointment?> GetByIdAsync(int id)
    {
        return await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Parent)
            .Include(a => a.Staff)
            .FirstOrDefaultAsync(a => a.AppointmentId == id);
    }

    public async Task<IEnumerable<Appointment>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Parent)
            .Include(a => a.Staff)
            .Where(a => a.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetByParentIdAsync(int parentId)
    {
        return await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Parent)
            .Include(a => a.Staff)
            .Where(a => a.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetByStaffIdAsync(int staffId)
    {
        return await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Parent)
            .Include(a => a.Staff)
            .Where(a => a.StaffId == staffId)
            .ToListAsync();
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<Appointment> UpdateAsync(Appointment appointment)
    {
        _context.Entry(appointment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task DeleteAsync(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment != null)
        {
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Appointments.AnyAsync(a => a.AppointmentId == id);
    }
} 