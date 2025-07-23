using DB;
using Repo;
using System.Text.Json;

namespace Service;

public class HealthCheckFormService : IHealthCheckFormService
{
    private readonly IHealthCheckFormRepository _healthCheckFormRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;
    private readonly IStaffService _staffService;

    public HealthCheckFormService(
        IHealthCheckFormRepository healthCheckFormRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository,
        IStaffService staffService)
    {
        _healthCheckFormRepository = healthCheckFormRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
        _staffService = staffService;
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

        // For schedule-type forms (those with Title and ScheduledDate), use different validation
        bool isScheduleForm = !string.IsNullOrEmpty(healthCheckForm.Title) && healthCheckForm.ScheduledDate.HasValue;
        
        if (!isScheduleForm)
        {
            // Original validation for regular health check forms
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
        }

        // Validate ConsentStatus only if provided
        if (!string.IsNullOrEmpty(healthCheckForm.ConsentStatus) && !IsValidConsentStatus(healthCheckForm.ConsentStatus))
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

        var validStatuses = new[] { "pending", "approved", "rejected", "cancelled" };
        return validStatuses.Contains(status.ToLower());
    }

    // New methods for health check scheduling
    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesAsync()
    {
        // Filter forms that have scheduling information (Title, ScheduledDate, etc.)
        var allForms = await _healthCheckFormRepository.GetAllHealthCheckFormsAsync();
        return allForms.Where(f => !string.IsNullOrEmpty(f.Title) && f.ScheduledDate.HasValue);
    }

    public async Task<HealthCheckForm?> GetHealthCheckScheduleByIdAsync(int id)
    {
        var schedule = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(id);
        if (schedule != null && !string.IsNullOrEmpty(schedule.Title) && schedule.ScheduledDate.HasValue)
        {
            return schedule;
        }
        return null;
    }

    public async Task<HealthCheckForm?> CreateHealthCheckScheduleAsync(HealthCheckForm schedule)
    {
        // Validate required fields for scheduling
        if (string.IsNullOrEmpty(schedule.Title))
        {
            throw new InvalidOperationException("Title is required for health check schedule");
        }

        if (!schedule.ScheduledDate.HasValue)
        {
            throw new InvalidOperationException("Scheduled date is required for health check schedule");
        }

        // Check if GradeIds is empty or contains only empty array
        if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
        {
            throw new InvalidOperationException("At least one grade must be selected");
        }

        // NEW: Validate that nurse can only create schedules for their assigned grades
        if (schedule.CreatedBy.HasValue)
        {
            await ValidateNurseGradePermissionAsync(schedule.CreatedBy.Value, schedule.GradeIds);
        }

        // Validate nurse schedule conflicts
        await ValidateNurseScheduleConflictAsync(schedule);

        // Set default values
        schedule.CreatedDate = DateTime.UtcNow;
        
        // FORCE STATUS TO PENDING - TEST FIX
        schedule.Status = "pending";
        
        schedule.ConsentStatus = "Pending";

        Console.WriteLine($"FORCED STATUS TO: '{schedule.Status}'");
        
        var result = await _healthCheckFormRepository.CreateHealthCheckFormAsync(schedule);
        
        Console.WriteLine($"RESULT STATUS: '{result.Status}'");
        
        return result;
    }

    public async Task<bool> UpdateHealthCheckScheduleAsync(HealthCheckForm schedule)
    {
        Console.WriteLine("=== SERVICE: UpdateHealthCheckScheduleAsync ===");
        Console.WriteLine($"FormId: {schedule.FormId}");
        Console.WriteLine($"Title: {schedule.Title}");
        Console.WriteLine($"Status: {schedule.Status}");
        Console.WriteLine($"ConsentStatus: {schedule.ConsentStatus}");
        Console.WriteLine($"ScheduledDate: {schedule.ScheduledDate}");
        Console.WriteLine($"GradeIds: {schedule.GradeIds}");
        
        // Validate that the schedule exists
        var existingSchedule = await _healthCheckFormRepository.GetHealthCheckFormByIdAsync(schedule.FormId);
        if (existingSchedule == null)
        {
            Console.WriteLine($"ERROR: Schedule with FormId {schedule.FormId} not found");
            return false;
        }
        
        Console.WriteLine($"Found existing schedule: {existingSchedule.FormId}, Title: {existingSchedule.Title}");

        // Validate required fields for scheduling
        if (string.IsNullOrEmpty(schedule.Title))
        {
            Console.WriteLine("ERROR: Title is empty");
            throw new InvalidOperationException("Title is required for health check schedule");
        }

        if (!schedule.ScheduledDate.HasValue)
        {
            Console.WriteLine("ERROR: ScheduledDate is null");
            throw new InvalidOperationException("Scheduled date is required for health check schedule");
        }

        // Check if GradeIds is empty or contains only empty array
        if (string.IsNullOrEmpty(schedule.GradeIds) || schedule.GradeIds.Trim() == "[]")
        {
            Console.WriteLine($"ERROR: GradeIds is empty or invalid: '{schedule.GradeIds}'");
            throw new InvalidOperationException("At least one grade must be selected");
        }

        // Validate nurse schedule conflicts
        await ValidateNurseScheduleConflictAsync(schedule);

        // Validate ConsentStatus only if it's provided (not Status field)
        if (!string.IsNullOrEmpty(schedule.ConsentStatus) && !IsValidConsentStatus(schedule.ConsentStatus))
        {
            Console.WriteLine($"ERROR: Invalid ConsentStatus: '{schedule.ConsentStatus}'");
            throw new InvalidOperationException("Invalid consent status value");
        }

        // Status field is free-form text for schedules, no validation needed
        Console.WriteLine("All validations passed, calling repository update...");
        try 
        {
            var result = await _healthCheckFormRepository.UpdateHealthCheckFormAsync(schedule);
            Console.WriteLine($"Repository update result: {result}");
            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR in repository update: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<bool> DeleteHealthCheckScheduleAsync(int id)
    {
        return await _healthCheckFormRepository.DeleteHealthCheckFormAsync(id);
    }
    
    // New methods for filtering by status
    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesByConfirmStatusAsync(string confirmStatus)
    {
        var allSchedules = await GetHealthCheckSchedulesAsync();
        return allSchedules.Where(s => 
            string.Equals(s.ConfirmStatus, confirmStatus, StringComparison.OrdinalIgnoreCase) ||
            (string.IsNullOrEmpty(s.ConfirmStatus) && confirmStatus.ToLower() == "pending")
        );
    }

    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesByStatusAsync(string status)
    {
        var allSchedules = await GetHealthCheckSchedulesAsync();
        return allSchedules.Where(s => 
            string.Equals(s.Status, status, StringComparison.OrdinalIgnoreCase)
        );
    }

    // NEW: Get health check schedules filtered by nurse's assigned grades
    public async Task<IEnumerable<HealthCheckForm>> GetHealthCheckSchedulesByNurseGradesAsync(List<int> assignedGrades, int nurseId)
    {
        var allSchedules = await GetHealthCheckSchedulesAsync();
        
        return allSchedules.Where(schedule => 
        {
            // Only show schedules created by this nurse OR schedules for grades this nurse is assigned to
            if (schedule.CreatedBy == nurseId)
            {
                return true; // Nurse can see their own schedules
            }
            
            // Check if any of the schedule's grades match nurse's assigned grades
            if (!string.IsNullOrEmpty(schedule.GradeIds))
            {
                try
                {
                    var scheduleGrades = JsonSerializer.Deserialize<List<int>>(schedule.GradeIds) ?? new List<int>();
                    return scheduleGrades.Any(grade => assignedGrades.Contains(grade));
                }
                catch
                {
                    return false; // Skip if JSON parsing fails
                }
            }
            
            return false; // Don't show if no grade match
        });
    }

    private async Task ValidateNurseScheduleConflictAsync(HealthCheckForm schedule)
    {
        if (!schedule.ScheduledDate.HasValue || !schedule.StartTime.HasValue)
        {
            return; // Skip validation if required fields are missing
        }

        // Parse the selected grades from JSON
        List<int> selectedGrades;
        try
        {
            selectedGrades = JsonSerializer.Deserialize<List<int>>(schedule.GradeIds ?? "[]") ?? new List<int>();
        }
        catch
        {
            return; // Skip validation if JSON parsing fails
        }

        if (!selectedGrades.Any())
        {
            return; // Skip validation if no grades selected
        }

        // Determine session period (morning/afternoon) based on start time
        var startHour = schedule.StartTime.Value.Hours;
        string sessionPeriod = startHour < 12 ? "morning" : "afternoon";

        // Get all existing health check schedules for the same date
        var existingSchedules = await _healthCheckFormRepository.GetAllHealthCheckFormsAsync();
        var conflictingSchedules = existingSchedules.Where(s => 
            s.FormId != schedule.FormId && // Exclude current schedule (for updates)
            s.ScheduledDate.HasValue && 
            s.ScheduledDate.Value.Date == schedule.ScheduledDate.Value.Date &&
            s.StartTime.HasValue &&
            !string.IsNullOrEmpty(s.GradeIds) &&
            (s.Status == "pending" || s.Status == "approved" || s.Status == "scheduled") // Only check active schedules
        ).ToList();

        foreach (var existingSchedule in conflictingSchedules)
        {
            // Parse existing schedule grades
            List<int> existingGrades;
            try
            {
                existingGrades = JsonSerializer.Deserialize<List<int>>(existingSchedule.GradeIds) ?? new List<int>();
            }
            catch
            {
                continue; // Skip if JSON parsing fails
            }

            // Check if there's grade overlap
            if (!selectedGrades.Intersect(existingGrades).Any())
            {
                continue; // No grade overlap, no conflict
            }

            // Determine existing schedule session period
            var existingStartHour = existingSchedule.StartTime.Value.Hours;
            string existingSessionPeriod = existingStartHour < 12 ? "morning" : "afternoon";

            // Check if same session period
            if (sessionPeriod == existingSessionPeriod)
            {
                // Find the nurse responsible for the existing schedule
                var conflictingGrade = selectedGrades.Intersect(existingGrades).First();
                var gradeNurses = await _staffService.GetGradeNursesByGradeAsync(conflictingGrade);
                var responsibleNurse = gradeNurses.FirstOrDefault();

                if (responsibleNurse != null)
                {
                    var sessionText = sessionPeriod == "morning" ? "sáng" : "chiều";
                    var dateText = schedule.ScheduledDate.Value.ToString("dd/MM/yyyy");
                    
                    throw new InvalidOperationException(
                        $"Đã có lịch khám khối {conflictingGrade} vào ca {sessionText} ngày {dateText} " +
                        $"được tạo bởi {responsibleNurse.Nurse?.FirstName} {responsibleNurse.Nurse?.LastName}. " +
                        $"Mỗi khối chỉ được khám một lần trong một ca (sáng hoặc chiều) của cùng một ngày."
                    );
                }
                else
                {
                    var sessionText = sessionPeriod == "morning" ? "sáng" : "chiều";
                    var dateText = schedule.ScheduledDate.Value.ToString("dd/MM/yyyy");
                    
                    throw new InvalidOperationException(
                        $"Đã có lịch khám khối {conflictingGrade} vào ca {sessionText} ngày {dateText}. " +
                        $"Mỗi khối chỉ được khám một lần trong một ca (sáng hoặc chiều) của cùng một ngày."
                    );
                }
            }
        }
    }

    // NEW: Validate that nurse can only create schedules for their assigned grades
    private async Task ValidateNurseGradePermissionAsync(int nurseId, string gradeIds)
    {
        // Parse the selected grades from JSON
        List<int> selectedGrades;
        try
        {
            selectedGrades = JsonSerializer.Deserialize<List<int>>(gradeIds ?? "[]") ?? new List<int>();
        }
        catch
        {
            throw new InvalidOperationException("Invalid grade format");
        }

        if (!selectedGrades.Any())
        {
            return; // No grades to validate
        }

        // Get nurse's assigned grades
        var gradeNurses = await _staffService.GetGradeNursesByStaffIdAsync(nurseId);
        var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();

        // Check if nurse is trying to create schedule for grades they're not assigned to
        var unauthorizedGrades = selectedGrades.Where(grade => !assignedGrades.Contains(grade)).ToList();
        
        if (unauthorizedGrades.Any())
        {
            throw new InvalidOperationException(
                $"Bạn không có quyền tạo lịch khám cho khối {string.Join(", ", unauthorizedGrades)}. " +
                $"Bạn chỉ được phép tạo lịch cho các khối: {string.Join(", ", assignedGrades)}."
            );
        }
    }
} 