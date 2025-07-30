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

    // New methods for vaccination schedules
    Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesAsync();
    Task<InjectionForm?> GetVaccinationScheduleByIdAsync(int id);
    Task<InjectionForm?> CreateVaccinationScheduleAsync(InjectionForm schedule);
    Task<bool> UpdateVaccinationScheduleAsync(InjectionForm schedule);
    Task<bool> DeleteVaccinationScheduleAsync(int id);
    Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByStatusAsync(string status);
    Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByDateRangeAsync(
        DateTime startDate,
        DateTime endDate
    );
    Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByGradeAsync(string gradeId);
    Task<IEnumerable<InjectionForm>> GetVaccinationSchedulesByVaccineAsync(int vaccineId);
    Task<bool> HasScheduleConflictAsync(
        DateTime scheduledDate,
        TimeSpan startTime,
        string location
    );
}
