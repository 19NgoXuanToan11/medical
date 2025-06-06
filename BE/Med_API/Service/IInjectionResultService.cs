using DB;

namespace Service;

public interface IInjectionResultService
{
    Task<IEnumerable<InjectionResult>> GetAllInjectionResultsAsync();
    Task<InjectionResult?> GetInjectionResultByIdAsync(int id);
    Task<InjectionResult?> CreateInjectionResultAsync(InjectionResult injectionResult);
    Task<bool> UpdateInjectionResultAsync(InjectionResult injectionResult);
    Task<bool> DeleteInjectionResultAsync(int id);
    Task<IEnumerable<InjectionResult>> GetInjectionResultsByFormIdAsync(int formId);
    Task<IEnumerable<InjectionResult>> GetInjectionResultsByStudentIdAsync(int studentId);
    Task<InjectionResult?> GetLatestInjectionResultByFormIdAsync(int formId);
} 