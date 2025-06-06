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
        IParentRepository parentRepository)
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
        var existingForm = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(healthCheckForm.FormId);
        if (existingForm == null)
        {
            return false;
        }

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

        // Validate status
        if (!IsValidConsentStatus(healthCheckForm.ConsentStatus))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        return await _healthCheckFormRepository.UpdateHealthCheckFormAsync(healthCheckForm);
    }

    public async Task<bool> DeleteHealthCheckFormAsync(int id)
    {
        return await _healthCheckFormRepository.DeleteHealthCheckFormAsync(id);
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckFormsByStudentIdAsync(int studentId)
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

        var validStatuses = new[] { "Pending", "Approved", "Rejected", "Cancelled" };
        return validStatuses.Contains(status);
    }
} 