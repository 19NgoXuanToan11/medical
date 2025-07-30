using DB;
using Repo;

namespace Service;

public class HealthCheckFormService : IHealthCheckFormService
{
    private readonly IHealthCheckFormRepository _healthCheckFormRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;

    public HealthCheckFormService(
        IHealthCheckFormRepository healthCheckFormRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository
    )
    {
        _healthCheckFormRepository = healthCheckFormRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
    }

    public async Task<IEnumerable<HealthCheckForm>> GetAllHealthCheckFormsAsync()
    {
        return await _healthCheckFormRepository.GetAllHealthCheckFormsAsync();
    }

    public async Task<HealthCheckForm?> GetHealthCheckFormByIdAsync(int id)
    {
        return await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(id);
    }

    public async Task<HealthCheckForm?> CreateHealthCheckFormAsync(HealthCheckForm healthCheckForm)
    {
        // Validate StudentId
        if (!healthCheckForm.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthCheckForm.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate ParentId if provided
        if (healthCheckForm.ParentId.HasValue)
        {
            var parent = await _parentRepository.GetParentByIdAsync(healthCheckForm.ParentId.Value);
            if (parent == null)
            {
                throw new InvalidOperationException("Parent not found");
            }
        }

        // Set default values
        healthCheckForm.CreatedDate = DateTime.UtcNow;
        healthCheckForm.ConsentStatus ??= "Pending";

        // Validate status
        if (!IsValidConsentStatus(healthCheckForm.ConsentStatus))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        return await _healthCheckFormRepository.CreateHealthCheckFormAsync(healthCheckForm);
    }

    public async Task<bool> UpdateHealthCheckFormAsync(HealthCheckForm healthCheckForm)
    {
        // Validate that the form exists
        var existingForm = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(
            healthCheckForm.FormId
        );
        if (existingForm == null)
        {
            return false;
        }

        // For schedule-type forms (those with Title and ScheduledDate), use different validation
        bool isScheduleForm =
            !string.IsNullOrEmpty(healthCheckForm.Title) && healthCheckForm.ScheduledDate.HasValue;

        if (!isScheduleForm)
        {
            // Original validation for regular health check forms
            // Validate StudentId
            if (!healthCheckForm.StudentId.HasValue)
            {
                throw new InvalidOperationException("StudentId is required");
            }

            var student = await _studentRepository.GetStudentByIdAsync(
                healthCheckForm.StudentId.Value
            );
            if (student == null)
            {
                throw new InvalidOperationException("Student not found");
            }

            // Validate ParentId if provided
            if (healthCheckForm.ParentId.HasValue)
            {
                var parent = await _parentRepository.GetParentByIdAsync(
                    healthCheckForm.ParentId.Value
                );
                if (parent == null)
                {
                    throw new InvalidOperationException("Parent not found");
                }
            }
        }

        // Validate ConsentStatus only if provided
        if (
            !string.IsNullOrEmpty(healthCheckForm.ConsentStatus)
            && !IsValidConsentStatus(healthCheckForm.ConsentStatus)
        )
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        return await _healthCheckFormRepository.UpdateHealthCheckFormAsync(healthCheckForm);
    }

    public async Task<bool> DeleteHealthCheckFormAsync(int id)
    {
        return await _healthCheckFormRepository.DeleteHealthCheckFormAsync(id);
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStudentIdAsync(
        int studentId
    )
    {
        return await _healthCheckFormRepository.GetHealthCheckFormsByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByParentIdAsync(int parentId)
    {
        return await _healthCheckFormRepository.GetHealthCheckFormsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStatusAsync(string status)
    {
        if (!IsValidConsentStatus(status))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        return await _healthCheckFormRepository.GetHealthCheckFormsByStatusAsync(status);
    }

    private bool IsValidConsentStatus(string? status)
    {
        if (string.IsNullOrEmpty(status))
            return false;

        var validStatuses = new[] { "pending", "approved", "rejected", "cancelled" };
        return validStatuses.Contains(status.ToLower());
    }

    // New methods for health check scheduling
    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesAsync()
    {
        // Filter forms that have scheduling information (Title, ScheduledDate, etc.)
        var allForms = await _healthCheckFormRepository.GetAllHealthCheckFormsAsync();
        return allForms.Where(f => !string.IsNullOrEmpty(f.Title) && f.ScheduledDate.HasValue);
    }

    public async Task<HealthCheckForm?> GetHealthCheckScheduleByIdAsync(int id)
    {
        var schedule = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(id);
        if (
            schedule != null
            && !string.IsNullOrEmpty(schedule.Title)
            && schedule.ScheduledDate.HasValue
        )
        {
            return schedule;
        }
        return null;
    }

    public async Task<HealthCheckForm?> CreateHealthCheckScheduleAsync(HealthCheckForm schedule)
    {
        // Validate required fields for scheduling
        if (string.IsNullOrEmpty(schedule.Title))
        {
            throw new InvalidOperationException("Title is required for health check schedule");
        }

        if (!schedule.ScheduledDate.HasValue)
        {
            throw new InvalidOperationException(
                "Scheduled date is required for health check schedule"
            );
        }

        // Check if GradeIds is empty or contains only empty array
        if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
        {
            throw new InvalidOperationException("At least one grade must be selected");
        }

        // Set default values
        schedule.CreatedDate = DateTime.UtcNow;

        // FORCE STATUS TO PENDING - TEST FIX
        schedule.Status = "pending";

        schedule.ConsentStatus = "Pending";

        var result = await _healthCheckFormRepository.CreateHealthCheckFormAsync(schedule);

        return result;
    }

    public async Task<bool> UpdateHealthCheckScheduleAsync(HealthCheckForm schedule)
    {
        // Validate that the schedule exists
        var existingSchedule = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(
            schedule.FormId
        );
        if (existingSchedule == null)
        {
            return false;
        }

        // Validate required fields for scheduling
        if (string.IsNullOrEmpty(schedule.Title))
        {
            throw new InvalidOperationException("Title is required for health check schedule");
        }

        if (!schedule.ScheduledDate.HasValue)
        {
            throw new InvalidOperationException(
                "Scheduled date is required for health check schedule"
            );
        }

        // Check if GradeIds is empty or contains only empty array
        if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
        {
            throw new InvalidOperationException("At least one grade must be selected");
        }

        // Validate ConsentStatus only if it's provided (not Status field)
        if (
            !string.IsNullOrEmpty(schedule.ConsentStatus)
            && !IsValidConsentStatus(schedule.ConsentStatus)
        )
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        try
        {
            var result = await _healthCheckFormRepository.UpdateHealthCheckFormAsync(schedule);
            return result;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteHealthCheckScheduleAsync(int id)
    {
        return await _healthCheckFormRepository.DeleteHealthCheckFormAsync(id);
    }
}
