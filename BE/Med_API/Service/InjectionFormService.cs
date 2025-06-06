using DB;
using Repo;

namespace Service;

public class InjectionFormService : IInjectionFormService
{
    private readonly IInjectionFormRepository _injectionFormRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;

    public InjectionFormService(
        IInjectionFormRepository injectionFormRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository)
    {
        _injectionFormRepository = injectionFormRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
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

        return await _injectionFormRepository.CreateInjectionFormAsync(injectionForm);
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

        return await _injectionFormRepository.UpdateInjectionFormAsync(injectionForm);
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