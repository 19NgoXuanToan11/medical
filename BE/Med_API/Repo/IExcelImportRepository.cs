using DB;

namespace Repo;

public interface IExcelImportRepository
{
    Task<IEnumerable<string>> GetExistingStudentCodesAsync();
    Task<IEnumerable<string>> GetExistingParentEmailsAsync();
    Task<IEnumerable<string>> GetExistingParentPhonesAsync();
    Task<IEnumerable<(string StudentCode, string ParentEmail)>> GetExistingStudentParentRelationsAsync();
    Task AddStudentWithRelatedDataAsync(Student student, IEnumerable<Parent> parents, IEnumerable<(Parent Parent, string Relationship)> relationships, HealthProfile healthProfile);
    Task<Class> GetOrCreateClassAsync(string className, int gradeLevel);
} 