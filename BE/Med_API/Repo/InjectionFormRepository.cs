using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class InjectionFormRepository : IInjectionFormRepository
{
    private readonly MedicalContext _context;

    public InjectionFormRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InjectionForm>> GetAllInjectionFormsAsync()
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .ToListAsync();
    }

    public async Task<InjectionForm?> GetInjectionFormByIdAsync(int id)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .FirstOrDefaultAsync(f => f.FormId == id);
    }

    public async Task<InjectionForm> CreateInjectionFormAsync(InjectionForm injectionForm)
    {
        _context.InjectionForms.Add(injectionForm);
        await _context.SaveChangesAsync();
        return injectionForm;
    }

    public async Task<bool> UpdateInjectionFormAsync(InjectionForm injectionForm)
    {
        try
        {
            var existingForm = await _context.InjectionForms.FindAsync(injectionForm.FormId);
            if (existingForm == null)
            {
                return false;
            }

            // Update specific fields instead of all values to avoid issues
            existingForm.Status = injectionForm.Status;
            existingForm.ConfirmedDate = injectionForm.ConfirmedDate;
            existingForm.Notes = injectionForm.Notes;
            existingForm.ConsentStatus = injectionForm.ConsentStatus;
            existingForm.ConsentDate = injectionForm.ConsentDate;
            existingForm.ConfirmStatus = injectionForm.ConfirmStatus;
            existingForm.ConfirmedBy = injectionForm.ConfirmedBy;
            
            // Ensure status consistency - if Status is updated, also update ConsentStatus
            if (!string.IsNullOrEmpty(injectionForm.Status))
            {
                existingForm.ConsentStatus = injectionForm.Status;
            }
            
            // Only update other fields if they are provided
            if (!string.IsNullOrEmpty(injectionForm.InjectionName))
                existingForm.InjectionName = injectionForm.InjectionName;
            if (!string.IsNullOrEmpty(injectionForm.Description))
                existingForm.Description = injectionForm.Description;
            if (injectionForm.VaccineId.HasValue)
                existingForm.VaccineId = injectionForm.VaccineId;
            if (injectionForm.ScheduledDate.HasValue)
                existingForm.ScheduledDate = injectionForm.ScheduledDate;
            if (injectionForm.StartTime.HasValue)
                existingForm.StartTime = injectionForm.StartTime;
            if (injectionForm.EstimatedDuration.HasValue)
                existingForm.EstimatedDuration = injectionForm.EstimatedDuration;
            if (!string.IsNullOrEmpty(injectionForm.Location))
                existingForm.Location = injectionForm.Location;
            if (!string.IsNullOrEmpty(injectionForm.GradeIds))
                existingForm.GradeIds = injectionForm.GradeIds;
            if (injectionForm.TotalStudents.HasValue)
                existingForm.TotalStudents = injectionForm.TotalStudents;
            if (injectionForm.NotifyParents.HasValue)
                existingForm.NotifyParents = injectionForm.NotifyParents;
            if (injectionForm.RequireParentConfirmation.HasValue)
                existingForm.RequireParentConfirmation = injectionForm.RequireParentConfirmation;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            // Log the error but don't expose sensitive information
            Console.WriteLine($"Error updating injection form {injectionForm.FormId}: {ex.Message}");
            throw; // Re-throw to let the service layer handle it
        }
    }

    public async Task<bool> DeleteInjectionFormAsync(int id)
    {
        var injectionForm = await _context.InjectionForms.FindAsync(id);
        if (injectionForm == null)
        {
            return false;
        }
        _context.InjectionForms.Remove(injectionForm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStudentIdAsync(int studentId)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == studentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByParentIdAsync(int parentId)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.ParentId == parentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStatusAsync(string status)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.Status == status || f.ConsentStatus == status)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    // New methods for vaccination schedules
    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesAsync()
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == null) // Vaccination schedules have no specific student
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<InjectionForm?> GetVaccinationScheduleByIdAsync(int id)
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .FirstOrDefaultAsync(f => f.FormId == id && f.StudentId == null);
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByStatusAsync(string status)
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == null && f.Status == status)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == null && 
                       f.ScheduledDate >= startDate && 
                       f.ScheduledDate <= endDate)
            .OrderBy(f => f.ScheduledDate)
            .ThenBy(f => f.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByGradeAsync(string gradeId)
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == null && 
                       f.GradeIds != null && 
                       f.GradeIds.Contains(gradeId))
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByVaccineAsync(int vaccineId)
    {
        return await _context.InjectionForms
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == null && f.VaccineId == vaccineId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<bool> HasScheduleConflictAsync(DateTime scheduledDate, TimeSpan startTime, string location)
    {
        // Check for any schedules that overlap with the given time and location
        var existingSchedules = await _context.InjectionForms
            .Where(f => f.StudentId == null && // Only check vaccination schedules
                       f.ScheduledDate == scheduledDate &&
                       f.Location == location &&
                       f.StartTime == startTime)
            .AnyAsync();

        return existingSchedules;
    }
} 