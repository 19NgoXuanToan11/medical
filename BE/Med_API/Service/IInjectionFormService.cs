using DB;

namespace Service;

public interface IInjectionFormService
{
    Task<IEnumerable<InjectionForm>> GetAllInjectionFormsAsync();
    Task<InjectionForm?> GetInjectionFormByIdAsync(int id);
    Task<InjectionForm?> CreateInjectionFormAsync(InjectionForm injectionForm);
    Task<bool> UpdateInjectionFormAsync(InjectionForm injectionForm);
    Task<bool> DeleteInjectionFormAsync(int id);
    Task<IEnumerable<InjectionForm>> GetInjectionFormsByStudentIdAsync(int studentId);
    Task<IEnumerable<InjectionForm>> GetInjectionFormsByParentIdAsync(int parentId);
    Task<IEnumerable<InjectionForm>> GetInjectionFormsByStatusAsync(string status);
} 