using DB;
using Repo;

namespace Service;

public class HealthCheckResultService : IHealthCheckResultService
{
    private readonly IHealthCheckResultRepository _healthCheckResultRepository;
    private readonly IHealthCheckFormRepository _healthCheckFormRepository;
    private readonly IStudentRepository _studentRepository;

    public HealthCheckResultService(
        IHealthCheckResultRepository healthCheckResultRepository,
        IHealthCheckFormRepository healthCheckFormRepository,
        IStudentRepository studentRepository)
    {
        _healthCheckResultRepository = healthCheckResultRepository;
        _healthCheckFormRepository = healthCheckFormRepository;
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync()
    {
        return await _healthCheckResultRepository.GetAllHealthCheckResultsAsync();
    }

    public async Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id)
    {
        return await _healthCheckResultRepository.GetHealthCheckResultByIdAsync(id);
    }

    public async Task<HealthCheckResult?> CreateHealthCheckResultAsync(HealthCheckResult healthCheckResult)
    {
        // Validate FormId
        if (!healthCheckResult.FormId.HasValue)
        {
            throw new InvalidOperationException("FormId is required");
        }

        var form = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(healthCheckResult.FormId.Value);
        if (form == null)
        {
            throw new InvalidOperationException("Health check form not found");
        }

        // Validate StudentId
        if (!healthCheckResult.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthCheckResult.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate that the student matches the form
        if (form.StudentId != healthCheckResult.StudentId)
        {
            throw new InvalidOperationException("Student does not match the health check form");
        }

        // Validate measurements
        if (healthCheckResult.Height.HasValue && (healthCheckResult.Height < 0 || healthCheckResult.Height > 300))
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (healthCheckResult.Weight.HasValue && (healthCheckResult.Weight < 0 || healthCheckResult.Weight > 500))
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        if (healthCheckResult.HeartRate.HasValue && (healthCheckResult.HeartRate < 0 || healthCheckResult.HeartRate > 250))
        {
            throw new InvalidOperationException("Invalid heart rate value");
        }

        // Set default values
        healthCheckResult.ExaminedDate = DateTime.UtcNow;

        return await _healthCheckResultRepository.CreateHealthCheckResultAsync(healthCheckResult);
    }

    public async Task<bool> UpdateHealthCheckResultAsync(HealthCheckResult healthCheckResult)
    {
        // Validate that the result exists
        var existingResult = await _healthCheckResultRepository.GetHealthCheckResultByIdAsync(healthCheckResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        // Validate FormId
        if (!healthCheckResult.FormId.HasValue)
        {
            throw new InvalidOperationException("FormId is required");
        }

        var form = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(healthCheckResult.FormId.Value);
        if (form == null)
        {
            throw new InvalidOperationException("Health check form not found");
        }

        // Validate StudentId
        if (!healthCheckResult.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthCheckResult.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate that the student matches the form
        if (form.StudentId != healthCheckResult.StudentId)
        {
            throw new InvalidOperationException("Student does not match the health check form");
        }

        // Validate measurements
        if (healthCheckResult.Height.HasValue && (healthCheckResult.Height < 0 || healthCheckResult.Height > 300))
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (healthCheckResult.Weight.HasValue && (healthCheckResult.Weight < 0 || healthCheckResult.Weight > 500))
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        if (healthCheckResult.HeartRate.HasValue && (healthCheckResult.HeartRate < 0 || healthCheckResult.HeartRate > 250))
        {
            throw new InvalidOperationException("Invalid heart rate value");
        }

        return await _healthCheckResultRepository.UpdateHealthCheckResultAsync(healthCheckResult);
    }

    public async Task<bool> DeleteHealthCheckResultAsync(int id)
    {
        return await _healthCheckResultRepository.DeleteHealthCheckResultAsync(id);
    }

    public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByFormIdAsync(int formId)
    {
        return await _healthCheckResultRepository.GetHealthCheckResultsByFormIdAsync(formId);
    }

    public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByStudentIdAsync(int studentId)
    {
        return await _healthCheckResultRepository.GetHealthCheckResultsByStudentIdAsync(studentId);
    }

    public async Task<HealthCheckResult?> GetLatestHealthCheckResultByFormIdAsync(int formId)
    {
        return await _healthCheckResultRepository.GetLatestHealthCheckResultByFormIdAsync(formId);
    }
} 