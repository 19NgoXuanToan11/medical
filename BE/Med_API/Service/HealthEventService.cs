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
        // Validate StudentCode
        if (string.IsNullOrEmpty(healthEvent.StudentCode))
        {
            throw new InvalidOperationException("StudentCode is required");
        }

        var student = await _studentRepository.GetStudentByCodeAsync(healthEvent.StudentCode);
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

        // Ensure HealthEventMedicines are linked
        if (healthEvent.HealthEventMedicines != null)
        {
            foreach (var item in healthEvent.HealthEventMedicines)
            {
                item.HealthEventId = healthEvent.EventId; // Will be 0 for new event, EF handles
            }
        }

        // Ensure HealthEventMedicalSupplies are linked
        if (healthEvent.HealthEventMedicalSupplies != null)
        {
            foreach (var item in healthEvent.HealthEventMedicalSupplies)
            {
                item.HealthEventId = healthEvent.EventId; // Will be 0 for new event, EF handles
            }
        }

        return await _healthEventRepository.CreateHealthEventAsync(healthEvent);
    }

    public async Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent)
    {
        // Validate that the event exists (repository handles fetching with includes)
        var existingEvent = await _healthEventRepository.GetHealthEventByIdAsync(healthEvent.EventId);
        if (existingEvent == null)
        {
            return false;
        }

        // Validate StudentCode
        if (string.IsNullOrEmpty(healthEvent.StudentCode))
        {
            throw new InvalidOperationException("StudentCode is required");
        }

        var student = await _studentRepository.GetStudentByCodeAsync(healthEvent.StudentCode);
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
        
        // The repository now handles the complex update logic for nested collections.
        // We pass the incoming healthEvent object, and the repository will reconcile it with existing data.
        return await _healthEventRepository.UpdateHealthEventAsync(healthEvent);
    }

    public async Task<bool> DeleteHealthEventAsync(int id)
    {
        return await _healthEventRepository.DeleteHealthEventAsync(id);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentCodeAsync(string studentCode)
    {
        return await _healthEventRepository.GetHealthEventsByStudentCodeAsync(studentCode);
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