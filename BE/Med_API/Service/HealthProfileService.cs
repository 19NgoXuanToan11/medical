using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DB;
using Repo;

namespace Service;

public class HealthProfileService : IHealthProfileService
{
    private readonly IHealthProfileRepository _healthProfileRepository;
    private readonly IStudentRepository _studentRepository;

    public HealthProfileService(
        IHealthProfileRepository healthProfileRepository,
        IStudentRepository studentRepository
    )
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

    public async Task<HealthProfile?> GetHealthProfileByStudentCodeAsync(string studentCode)
    {
        return await _healthProfileRepository.GetHealthProfileByStudentCodeAsync(studentCode);
    }

    public async Task<HealthProfile?> CreateHealthProfileAsync(HealthProfile healthProfile)
    {
        // Validate StudentCode
        if (string.IsNullOrEmpty(healthProfile.StudentCode))
        {
            throw new InvalidOperationException("StudentCode is required");
        }

        var student = await _studentRepository.GetStudentByCodeAsync(healthProfile.StudentCode);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Check if profile already exists for student
        var existingProfile = await _healthProfileRepository.GetHealthProfileByStudentCodeAsync(
            healthProfile.StudentCode
        );
        if (existingProfile != null)
        {
            throw new InvalidOperationException("Health profile already exists for this student");
        }

        // Validate measurements
        if (
            healthProfile.Height.HasValue
            && (healthProfile.Height < 0 || healthProfile.Height > 300)
        )
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (
            healthProfile.Weight.HasValue
            && (healthProfile.Weight < 0 || healthProfile.Weight > 500)
        )
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        // New validation for HeartRate
        if (
            healthProfile.HeartRate.HasValue
            && (healthProfile.HeartRate < 0 || healthProfile.HeartRate > 250)
        )
        {
            throw new InvalidOperationException("Invalid heart rate value");
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
        var existingProfile = await _healthProfileRepository.GetHealthProfileByIdAsync(
            healthProfile.HealthProfileId
        );
        if (existingProfile == null)
        {
            return false;
        }

        // Validate StudentCode
        if (string.IsNullOrEmpty(healthProfile.StudentCode))
        {
            throw new InvalidOperationException("StudentCode is required");
        }

        var student = await _studentRepository.GetStudentByCodeAsync(healthProfile.StudentCode);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate measurements
        if (
            healthProfile.Height.HasValue
            && (healthProfile.Height < 0 || healthProfile.Height > 300)
        )
        {
            throw new InvalidOperationException("Invalid height value");
        }

        if (
            healthProfile.Weight.HasValue
            && (healthProfile.Weight < 0 || healthProfile.Weight > 500)
        )
        {
            throw new InvalidOperationException("Invalid weight value");
        }

        // New validation for HeartRate
        if (
            healthProfile.HeartRate.HasValue
            && (healthProfile.HeartRate < 0 || healthProfile.HeartRate > 250)
        )
        {
            throw new InvalidOperationException("Invalid heart rate value");
        }

        // Update LastUpdated
        healthProfile.LastUpdated = DateTime.UtcNow;

        return await _healthProfileRepository.UpdateHealthProfileAsync(healthProfile);
    }

    public async Task<bool> DeleteHealthProfileAsync(int id)
    {
        return await _healthProfileRepository.DeleteHealthProfileAsync(id);
    }

    public async Task<IEnumerable<HealthProfile>> GetHealthProfilesByGradeListAsync(
        IEnumerable<int> gradeLevels
    )
    {
        var allProfiles = await _healthProfileRepository.GetAllHealthProfilesAsync();
        return allProfiles.Where(p =>
            p.Student != null
            && p.Student.Class != null
            && gradeLevels.Contains(p.Student.Class.GradeLevel)
        );
    }
}
