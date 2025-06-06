using DB;
using Repo;

namespace Service;

public class InjectionResultService : IInjectionResultService
{
    private readonly IInjectionResultRepository _injectionResultRepository;
    private readonly IInjectionFormRepository _injectionFormRepository;
    private readonly IStudentRepository _studentRepository;

    public InjectionResultService(
        IInjectionResultRepository injectionResultRepository,
        IInjectionFormRepository injectionFormRepository,
        IStudentRepository studentRepository)
    {
        _injectionResultRepository = injectionResultRepository;
        _injectionFormRepository = injectionFormRepository;
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<InjectionResult>> GetAllInjectionResultsAsync()
    {
        return await _injectionResultRepository.GetAllInjectionResultsAsync();
    }

    public async Task<InjectionResult?> GetInjectionResultByIdAsync(int id)
    {
        return await _injectionResultRepository.GetInjectionResultByIdAsync(id);
    }

    public async Task<InjectionResult?> CreateInjectionResultAsync(InjectionResult injectionResult)
    {
        // Validate FormId
        if (!injectionResult.FormId.HasValue)
        {
            throw new InvalidOperationException("FormId is required");
        }

        var form = await _injectionFormRepository.GetInjectionFormByIdAsync(injectionResult.FormId.Value);
        if (form == null)
        {
            throw new InvalidOperationException("Injection form not found");
        }

        // Validate StudentId
        if (!injectionResult.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(injectionResult.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate that the student matches the form
        if (form.StudentId != injectionResult.StudentId)
        {
            throw new InvalidOperationException("Student does not match the injection form");
        }

        // Set default values
        injectionResult.AdministeredDate = DateTime.UtcNow;

        return await _injectionResultRepository.CreateInjectionResultAsync(injectionResult);
    }

    public async Task<bool> UpdateInjectionResultAsync(InjectionResult injectionResult)
    {
        // Validate that the result exists
        var existingResult = await _injectionResultRepository.GetInjectionResultByIdAsync(injectionResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        // Validate FormId
        if (!injectionResult.FormId.HasValue)
        {
            throw new InvalidOperationException("FormId is required");
        }

        var form = await _injectionFormRepository.GetInjectionFormByIdAsync(injectionResult.FormId.Value);
        if (form == null)
        {
            throw new InvalidOperationException("Injection form not found");
        }

        // Validate StudentId
        if (!injectionResult.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(injectionResult.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate that the student matches the form
        if (form.StudentId != injectionResult.StudentId)
        {
            throw new InvalidOperationException("Student does not match the injection form");
        }

        return await _injectionResultRepository.UpdateInjectionResultAsync(injectionResult);
    }

    public async Task<bool> DeleteInjectionResultAsync(int id)
    {
        return await _injectionResultRepository.DeleteInjectionResultAsync(id);
    }

    public async Task<IEnumerable<InjectionResult>> GetInjectionResultsByFormIdAsync(int formId)
    {
        return await _injectionResultRepository.GetInjectionResultsByFormIdAsync(formId);
    }

    public async Task<IEnumerable<InjectionResult>> GetInjectionResultsByStudentIdAsync(int studentId)
    {
        return await _injectionResultRepository.GetInjectionResultsByStudentIdAsync(studentId);
    }

    public async Task<InjectionResult?> GetLatestInjectionResultByFormIdAsync(int formId)
    {
        return await _injectionResultRepository.GetLatestInjectionResultByFormIdAsync(formId);
    }
} 