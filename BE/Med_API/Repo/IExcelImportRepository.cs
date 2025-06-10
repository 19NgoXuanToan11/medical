using DB;

namespace Repo;

public interface IExcelImportRepository
{
    Task<IEnumerable<string>> GetExistingStudentCodesAsync();
    Task<IEnumerable<string>> GetExistingParentEmailsAsync();
    Task<IEnumerable<string>> GetExistingParentPhonesAsync();
    Task<IEnumerable<(string StudentCode, string ParentEmail)>> GetExistingStudentParentRelationsAsync();
    Task AddStudentWithRelatedDataAsync(Student student, IEnumerable<Parent> parents, HealthProfile healthProfile);
} 