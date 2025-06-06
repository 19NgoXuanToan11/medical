using DB;
using Repo;

namespace Service;

public class HealthProfileService : IHealthProfileService
{
    private readonly IHealthProfileRepository _healthProfileRepository;
    private readonly IStudentRepository _studentRepository;

    public HealthProfileService(
        IHealthProfileRepository healthProfileRepository,
        IStudentRepository studentRepository)
    {
        _healthProfileRepository = healthProfileRepository;
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<HealthProfile>> GetAllHealthProfilesAsync()
    {
        return await _healthProfileRepository.GetAllHealthProfilesAsync();
    }

    public async Task<HealthProfile?> GetHealthProfileByIdAsync(int id)
    {
        return await _healthProfileRepository.GetHealthProfileByIdAsync(id);
    }

    public async Task<HealthProfile?> GetHealthProfileByStudentIdAsync(int studentId)
    {
        return await _healthProfileRepository.GetHealthProfileByStudentIdAsync(studentId);
    }

    public async Task<HealthProfile?> CreateHealthProfileAsync(HealthProfile healthProfile)
    {
        // Validate StudentId
        if (!healthProfile.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthProfile.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Check if profile already exists for student
        var existingProfile = await _healthProfileRepository.GetHealthProfileByStudentIdAsync(healthProfile.StudentId.Value);
        if (existingProfile != null)
        {
            throw new InvalidOperationException("Health profile already exists for this student");
        }

        // Validate measurements
        if (healthProfile.Height.HasValue && (healthProfile.Height < 0 || healthProfile.Height > 300))
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (healthProfile.Weight.HasValue && (healthProfile.Weight < 0 || healthProfile.Weight > 500))
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        // Set default values
        healthProfile.LastUpdated = DateTime.UtcNow;
        healthProfile.HasAllergies ??= false;
        healthProfile.HasChronicDiseases ??= false;
        healthProfile.HasPreviousTreatment ??= false;
        healthProfile.HasVisionIssues ??= false;
        healthProfile.HasHearingIssues ??= false;

        return await _healthProfileRepository.CreateHealthProfileAsync(healthProfile);
    }

    public async Task<bool> UpdateHealthProfileAsync(HealthProfile healthProfile)
    {
        // Validate that the profile exists
        var existingProfile = await _healthProfileRepository.GetHealthProfileByIdAsync(healthProfile.HealthProfileId);
        if (existingProfile == null)
        {
            return false;
        }

        // Validate StudentId
        if (!healthProfile.StudentId.HasValue)
        {
            throw new InvalidOperationException("StudentId is required");
        }

        var student = await _studentRepository.GetStudentByIdAsync(healthProfile.StudentId.Value);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate measurements
        if (healthProfile.Height.HasValue && (healthProfile.Height < 0 || healthProfile.Height > 300))
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (healthProfile.Weight.HasValue && (healthProfile.Weight < 0 || healthProfile.Weight > 500))
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        // Update LastUpdated
        healthProfile.LastUpdated = DateTime.UtcNow;

        return await _healthProfileRepository.UpdateHealthProfileAsync(healthProfile);
    }

    public async Task<bool> DeleteHealthProfileAsync(int id)
    {
        return await _healthProfileRepository.DeleteHealthProfileAsync(id);
    }
} 