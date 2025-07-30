using System.Text.Json;
using DB;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service;

public class InjectionFormService : IInjectionFormService
{
    private readonly IInjectionFormRepository _injectionFormRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;
    private readonly IClassRepository _classRepository;
    private readonly IHealthProfileRepository _healthProfileRepository;
    private readonly ILogger<InjectionFormService> _logger;

    public InjectionFormService(
        IInjectionFormRepository injectionFormRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository,
        IClassRepository classRepository,
        IHealthProfileRepository healthProfileRepository,
        ILogger<InjectionFormService> logger
    )
    {
        _injectionFormRepository = injectionFormRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
        _classRepository = classRepository;
        _healthProfileRepository = healthProfileRepository;
        _logger = logger;
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
        // For vaccination schedules (when StudentId is null or 0), skip student validation
        if (injectionForm.StudentId.HasValue && injectionForm.StudentId.Value > 0)
        {
            var student = await _studentRepository.GetStudentByIdAsync(
                injectionForm.StudentId.Value
            );
            if (student == null)
            {
                throw new InvalidOperationException("Student not found");
            }
        }
        else
        {
            // For vaccination schedules, set StudentId to null
            injectionForm.StudentId = null;
        }

        // Validate ParentId if provided
        if (injectionForm.ParentId.HasValue && injectionForm.ParentId.Value > 0)
        {
            var parent = await _parentRepository.GetParentByIdAsync(injectionForm.ParentId.Value);
            if (parent == null)
            {
                throw new InvalidOperationException("Parent not found");
            }
        }
        else
        {
            // For vaccination schedules, set ParentId to null
            injectionForm.ParentId = null;
        }

        // Set default values
        injectionForm.CreatedDate = DateTime.UtcNow;
        injectionForm.ConsentStatus ??= "Pending";

        // Validate status
        if (!IsValidConsentStatus(injectionForm.ConsentStatus))
        {
            throw new InvalidOperationException("Invalid consent status value");
        }

        var createdForm = await _injectionFormRepository.CreateInjectionFormAsync(injectionForm);

        // Reload the form with all relationships including Vaccine
        var reloadedForm = await _injectionFormRepository.GetInjectionFormByIdAsync(
            createdForm.FormId
        );
        return reloadedForm ?? createdForm;
    }

    public async Task<bool> UpdateInjectionFormAsync(InjectionForm injectionForm)
    {
        try
        {
            // Validate that the form exists
            var existingForm = await _injectionFormRepository.GetInjectionFormByIdAsync(
                injectionForm.FormId
            );
            if (existingForm == null)
            {
                _logger.LogWarning(
                    "InjectionForm with ID {FormId} not found",
                    injectionForm.FormId
                );
                return false;
            }

            // Validate StudentId only for individual forms (not vaccination schedules)
            if (injectionForm.StudentId.HasValue && injectionForm.StudentId.Value > 0)
            {
                var student = await _studentRepository.GetStudentByIdAsync(
                    injectionForm.StudentId.Value
                );
                if (student == null)
                {
                    _logger.LogWarning(
                        "Student with ID {StudentId} not found",
                        injectionForm.StudentId.Value
                    );
                    throw new InvalidOperationException("Student not found");
                }
            }

            // Validate ParentId if provided
            if (injectionForm.ParentId.HasValue && injectionForm.ParentId.Value > 0)
            {
                var parent = await _parentRepository.GetParentByIdAsync(
                    injectionForm.ParentId.Value
                );
                if (parent == null)
                {
                    _logger.LogWarning(
                        "Parent with ID {ParentId} not found",
                        injectionForm.ParentId.Value
                    );
                    throw new InvalidOperationException("Parent not found");
                }
            }

            // Validate status only if ConsentStatus is provided
            if (
                !string.IsNullOrEmpty(injectionForm.ConsentStatus)
                && !IsValidConsentStatus(injectionForm.ConsentStatus)
            )
            {
                _logger.LogWarning(
                    "Invalid consent status: {ConsentStatus}",
                    injectionForm.ConsentStatus
                );
                throw new InvalidOperationException("Invalid consent status value");
            }

            return await _injectionFormRepository.UpdateInjectionFormAsync(injectionForm);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error updating injection form with ID {FormId}",
                injectionForm.FormId
            );
            throw;
        }
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

        var validStatuses = new[] { "pending", "approved", "rejected", "cancelled" };
        return validStatuses.Contains(status.ToLower());
    }

    // New methods for vaccination schedules
    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesAsync()
    {
        return await _injectionFormRepository.GetVaccinationSchedulesAsync();
    }

    public async Task<InjectionForm?> GetVaccinationScheduleByIdAsync(int id)
    {
        return await _injectionFormRepository.GetVaccinationScheduleByIdAsync(id);
    }

    public async Task<InjectionForm?> CreateVaccinationScheduleAsync(InjectionForm schedule)
    {
        try
        {
            // Validate required fields
            if (string.IsNullOrEmpty(schedule.InjectionName))
                throw new InvalidOperationException("Injection name is required");

            if (schedule.ScheduledDate == null)
                throw new InvalidOperationException("Scheduled date is required");

            if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
                throw new InvalidOperationException("At least one grade must be selected");

            if (schedule.VaccineId == null || schedule.VaccineId <= 0)
                throw new InvalidOperationException("Valid vaccine ID is required");

            // Parse grade IDs
            List<string> gradeIds;
            try
            {
                gradeIds =
                    JsonSerializer.Deserialize<List<string>>(schedule.GradeIds)
                    ?? new List<string>();
            }
            catch
            {
                throw new InvalidOperationException("Invalid grade IDs format");
            }

            // Fetch detailed information for each grade
            var allClasses = new List<object>();
            var allStudents = new List<object>();
            var allHealthProfiles = new List<object>();
            int totalStudentCount = 0;

            foreach (var gradeId in gradeIds)
            {
                // Parse grade level from gradeId (assuming format like "grade-2")
                if (
                    gradeId.StartsWith("grade-")
                    && int.TryParse(gradeId.Substring(6), out int gradeLevel)
                )
                {
                    // Get classes for this grade level
                    var classes = await _classRepository.GetClassesByGradeLevelAsync(gradeLevel);

                    foreach (var classItem in classes)
                    {
                        // Add class details
                        allClasses.Add(
                            new
                            {
                                ClassId = classItem.ClassId,
                                ClassName = classItem.ClassName,
                                GradeLevel = classItem.GradeLevel,
                                StudentCount = classItem.CurrentStudentCount,
                                ClassTeacher = classItem.ClassTeacher,
                            }
                        );

                        // Get students in this class
                        var studentsInClass = await _classRepository.GetStudentsByClassIdAsync(
                            classItem.ClassId
                        );

                        foreach (var student in studentsInClass)
                        {
                            // Add student details
                            allStudents.Add(
                                new
                                {
                                    StudentId = student.StudentId,
                                    StudentCode = student.StudentCode,
                                    FirstName = student.FirstName,
                                    LastName = student.LastName,
                                    FullName = $"{student.LastName} {student.FirstName}",
                                    DateOfBirth = student.DateOfBirth,
                                    Gender = student.Gender,
                                    ClassId = student.ClassId,
                                    ClassName = classItem.ClassName,
                                    GradeLevel = classItem.GradeLevel,
                                }
                            );

                            // Get health profile for this student
                            var healthProfile =
                                await _healthProfileRepository.GetHealthProfileByStudentCodeAsync(
                                    student.StudentCode
                                );
                            if (healthProfile != null)
                            {
                                allHealthProfiles.Add(
                                    new
                                    {
                                        ProfileId = healthProfile.HealthProfileId,
                                        StudentId = student.StudentId,
                                        StudentCode = student.StudentCode,
                                        StudentName = $"{student.LastName} {student.FirstName}",
                                        Height = healthProfile.Height,
                                        Weight = healthProfile.Weight,
                                        BloodType = healthProfile.BloodType,
                                        Allergies = healthProfile.AllergyDetails,
                                        MedicalHistory = healthProfile.ChronicDetails,
                                        EmergencyContact = healthProfile.EmergencyContact,
                                        Notes = healthProfile.OtherInfo,
                                        LastUpdated = healthProfile.LastUpdated,
                                    }
                                );
                            }

                            totalStudentCount++;
                        }
                    }
                }
            }

            // Set default values
            schedule.CreatedDate = DateTime.UtcNow;
            schedule.Status = "pending";
            schedule.ConsentStatus = "Pending";
            schedule.StudentId = null; // Ensure this is a schedule, not an individual form
            schedule.ParentId = null;
            schedule.TotalStudents = totalStudentCount;

            // Store detailed information as JSON
            schedule.ClassDetailsJson = JsonSerializer.Serialize(allClasses);
            schedule.StudentDetailsJson = JsonSerializer.Serialize(allStudents);
            schedule.HealthProfilesJson = JsonSerializer.Serialize(allHealthProfiles);

            // Check for schedule conflicts
            if (
                schedule.ScheduledDate.HasValue
                && schedule.StartTime.HasValue
                && !string.IsNullOrEmpty(schedule.Location)
            )
            {
                var hasConflict = await HasScheduleConflictAsync(
                    schedule.ScheduledDate.Value,
                    schedule.StartTime.Value,
                    schedule.Location
                );

                if (hasConflict)
                {
                    throw new InvalidOperationException(
                        "A schedule already exists at this time and location"
                    );
                }
            }

            // Create the schedule
            var createdSchedule = await _injectionFormRepository.CreateInjectionFormAsync(schedule);
            _logger.LogInformation(
                "Created vaccination schedule with ID {ScheduleId} for {StudentCount} students across {ClassCount} classes",
                createdSchedule.FormId,
                totalStudentCount,
                allClasses.Count
            );

            return createdSchedule;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating vaccination schedule");
            throw;
        }
    }

    public async Task<bool> UpdateVaccinationScheduleAsync(InjectionForm schedule)
    {
        try
        {
            // Verify this is a vaccination schedule
            var existingSchedule = await _injectionFormRepository.GetVaccinationScheduleByIdAsync(
                schedule.FormId
            );
            if (existingSchedule == null)
            {
                throw new InvalidOperationException(
                    "Schedule not found or is not a vaccination schedule"
                );
            }

            // Validate required fields
            if (string.IsNullOrEmpty(schedule.InjectionName))
                throw new InvalidOperationException("Injection name is required");

            if (schedule.ScheduledDate == null)
                throw new InvalidOperationException("Scheduled date is required");

            if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
                throw new InvalidOperationException("At least one grade must be selected");

            if (schedule.VaccineId == null || schedule.VaccineId <= 0)
                throw new InvalidOperationException("Valid vaccine ID is required");

            // Check for schedule conflicts (only if time/location changed)
            if (
                schedule.ScheduledDate != existingSchedule.ScheduledDate
                || schedule.StartTime != existingSchedule.StartTime
                || schedule.Location != existingSchedule.Location
            )
            {
                if (
                    schedule.ScheduledDate.HasValue
                    && schedule.StartTime.HasValue
                    && !string.IsNullOrEmpty(schedule.Location)
                )
                {
                    var hasConflict = await HasScheduleConflictAsync(
                        schedule.ScheduledDate.Value,
                        schedule.StartTime.Value,
                        schedule.Location
                    );

                    if (hasConflict)
                    {
                        throw new InvalidOperationException(
                            "A schedule already exists at this time and location"
                        );
                    }
                }
            }

            // Ensure this remains a schedule
            schedule.StudentId = null;
            schedule.ParentId = null;

            // Update the schedule
            var success = await _injectionFormRepository.UpdateInjectionFormAsync(schedule);
            if (success)
            {
                _logger.LogInformation(
                    "Updated vaccination schedule with ID {ScheduleId}",
                    schedule.FormId
                );
            }
            else
            {
                _logger.LogWarning(
                    "Failed to update vaccination schedule with ID {ScheduleId}",
                    schedule.FormId
                );
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error updating vaccination schedule with ID {ScheduleId}",
                schedule.FormId
            );
            throw;
        }
    }

    public async Task<bool> DeleteVaccinationScheduleAsync(int id)
    {
        try
        {
            // Verify this is a vaccination schedule
            var schedule = await _injectionFormRepository.GetVaccinationScheduleByIdAsync(id);
            if (schedule == null)
            {
                throw new InvalidOperationException(
                    "Schedule not found or is not a vaccination schedule"
                );
            }

            var success = await _injectionFormRepository.DeleteInjectionFormAsync(id);
            if (success)
            {
                _logger.LogInformation("Deleted vaccination schedule with ID {ScheduleId}", id);
            }
            else
            {
                _logger.LogWarning(
                    "Failed to delete vaccination schedule with ID {ScheduleId}",
                    id
                );
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting vaccination schedule with ID {ScheduleId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByStatusAsync(
        string status
    )
    {
        return await _injectionFormRepository.GetVaccinationSchedulesByStatusAsync(status);
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByDateRangeAsync(
        DateTime startDate,
        DateTime endDate
    )
    {
        return await _injectionFormRepository.GetVaccinationSchedulesByDateRangeAsync(
            startDate,
            endDate
        );
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByGradeAsync(
        string gradeId
    )
    {
        return await _injectionFormRepository.GetVaccinationSchedulesByGradeAsync(gradeId);
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByVaccineAsync(
        int vaccineId
    )
    {
        return await _injectionFormRepository.GetVaccinationSchedulesByVaccineAsync(vaccineId);
    }

    public async Task<bool> HasScheduleConflictAsync(
        DateTime scheduledDate,
        TimeSpan startTime,
        string location
    )
    {
        return await _injectionFormRepository.HasScheduleConflictAsync(
            scheduledDate,
            startTime,
            location
        );
    }
}
