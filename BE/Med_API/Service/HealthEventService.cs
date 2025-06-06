using DB;
using Repo;

namespace Service;

public class HealthEventService : IHealthEventService
{
    private readonly IHealthEventRepository _healthEventRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IStaffRepository _staffRepository;

    public HealthEventService(
        IHealthEventRepository healthEventRepository,
        IStudentRepository studentRepository,
        IStaffRepository staffRepository)
    {
        _healthEventRepository = healthEventRepository;
        _studentRepository = studentRepository;
        _staffRepository = staffRepository;
    }

    public async Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync()
    {
        return await _healthEventRepository.GetAllHealthEventsAsync();
    }

    public async Task<HealthEvent?> GetHealthEventByIdAsync(int id)
    {
        return await _healthEventRepository.GetHealthEventByIdAsync(id);
    }

    public async Task<HealthEvent?> CreateHealthEventAsync(HealthEvent healthEvent)
    {
        // Validate StudentId
        if (!healthEvent.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthEvent.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate StaffId
        if (!healthEvent.StaffId.HasValue)
        {
            throw new InvalidOperationException("StaffId is required");
        }

        var staff = await _staffRepository.GetStaffByIdAsync(healthEvent.StaffId.Value);
        if (staff == null)
        {
            throw new InvalidOperationException("Staff not found");
        }

        // Validate EventType
        if (string.IsNullOrEmpty(healthEvent.EventType))
        {
            throw new InvalidOperationException("EventType is required");
        }

        // Set default values
        healthEvent.EventDate = DateTime.UtcNow;
        healthEvent.ParentNotified ??= false;
        healthEvent.FollowUpRequired ??= false;

        return await _healthEventRepository.CreateHealthEventAsync(healthEvent);
    }

    public async Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent)
    {
        // Validate that the event exists
        var existingEvent = await _healthEventRepository.GetHealthEventByIdAsync(healthEvent.EventId);
        if (existingEvent == null)
        {
            return false;
        }

        // Validate StudentId
        if (!healthEvent.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthEvent.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate StaffId
        if (!healthEvent.StaffId.HasValue)
        {
            throw new InvalidOperationException("StaffId is required");
        }

        var staff = await _staffRepository.GetStaffByIdAsync(healthEvent.StaffId.Value);
        if (staff == null)
        {
            throw new InvalidOperationException("Staff not found");
        }

        // Validate EventType
        if (string.IsNullOrEmpty(healthEvent.EventType))
        {
            throw new InvalidOperationException("EventType is required");
        }

        return await _healthEventRepository.UpdateHealthEventAsync(healthEvent);
    }

    public async Task<bool> DeleteHealthEventAsync(int id)
    {
        return await _healthEventRepository.DeleteHealthEventAsync(id);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentIdAsync(int studentId)
    {
        return await _healthEventRepository.GetHealthEventsByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId)
    {
        return await _healthEventRepository.GetHealthEventsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            throw new InvalidOperationException("Start date must be before end date");
        }

        return await _healthEventRepository.GetHealthEventsByDateRangeAsync(startDate, endDate);
    }
} 