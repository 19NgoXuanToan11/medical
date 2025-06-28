using DB;
using Repo;

namespace Service;

public class InjectionFormService : IInjectionFormService
{
    private readonly IInjectionFormRepository _injectionFormRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;
    private readonly INotificationService _notificationService;

    public InjectionFormService(
        IInjectionFormRepository injectionFormRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository,
        INotificationService notificationService)
    {
        _injectionFormRepository = injectionFormRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<InjectionForm>> GetAllInjectionFormsAsync()
    {
        return await _injectionFormRepository.GetAllInjectionFormsAsync();
    }

    public async Task<InjectionForm?> GetInjectionFormByIdAsync(int id)
    {
        return await _injectionFormRepository.GetInjectionFormByIdAsync(id);
    }

    public async Task<InjectionForm?> CreateInjectionFormAsync(InjectionForm injectionForm)
    {
        // Validate StudentId
        if (!injectionForm.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(injectionForm.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate ParentId if provided
        if (injectionForm.ParentId.HasValue)
        {
            var parent = await _parentRepository.GetParentByIdAsync(injectionForm.ParentId.Value);
            if (parent == null)
            {
                throw new InvalidOperationException("Parent not found");
            }
        }

        // Set default values
        injectionForm.CreatedDate = DateTime.UtcNow;
        injectionForm.ConsentStatus ??= "Pending";

        // Validate status
        if (!IsValidConsentStatus(injectionForm.ConsentStatus))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        // Create the injection form
        var createdForm = await _injectionFormRepository.CreateInjectionFormAsync(injectionForm);

        // Create notification for parent if ParentId is provided
        if (createdForm.ParentId.HasValue)
        {
            try
            {
                var studentName = $"{student.FirstName} {student.LastName}";
                await _notificationService.CreateInjectionConsentNotificationAsync(
                    createdForm.FormId,
                    createdForm.ParentId.Value,
                    studentName,
                    createdForm.InjectionName);
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the form creation
                // In a real application, you might want to use a proper logging framework
                Console.WriteLine($"Failed to create notification: {ex.Message}");
            }
        }

        return createdForm;
    }

    public async Task<bool> UpdateInjectionFormAsync(InjectionForm injectionForm)
    {
        // Validate that the form exists
        var existingForm = await _injectionFormRepository.GetInjectionFormByIdAsync(injectionForm.FormId);
        if (existingForm == null)
        {
            return false;
        }

        // Validate StudentId
        if (!injectionForm.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(injectionForm.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate ParentId if provided
        if (injectionForm.ParentId.HasValue)
        {
            var parent = await _parentRepository.GetParentByIdAsync(injectionForm.ParentId.Value);
            if (parent == null)
            {
                throw new InvalidOperationException("Parent not found");
            }
        }

        // Validate status
        if (!IsValidConsentStatus(injectionForm.ConsentStatus))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        // Update the form
        var success = await _injectionFormRepository.UpdateInjectionFormAsync(injectionForm);

        // Update notification status if consent status changed
        if (success && existingForm.ConsentStatus != injectionForm.ConsentStatus)
        {
            try
            {
                await _notificationService.UpdateInjectionConsentNotificationAsync(
                    injectionForm.FormId,
                    injectionForm.ConsentStatus);
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the form update
                Console.WriteLine($"Failed to update notification: {ex.Message}");
            }
        }

        return success;
    }

    public async Task<bool> DeleteInjectionFormAsync(int id)
    {
        return await _injectionFormRepository.DeleteInjectionFormAsync(id);
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStudentIdAsync(int studentId)
    {
        return await _injectionFormRepository.GetInjectionFormsByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByParentIdAsync(int parentId)
    {
        return await _injectionFormRepository.GetInjectionFormsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStatusAsync(string status)
    {
        if (!IsValidConsentStatus(status))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        return await _injectionFormRepository.GetInjectionFormsByStatusAsync(status);
    }

    private bool IsValidConsentStatus(string? status)
    {
        if (string.IsNullOrEmpty(status))
            return false;

        var validStatuses = new[] { "Pending", "Approved", "Rejected", "Cancelled" };
        return validStatuses.Contains(status);
    }
}