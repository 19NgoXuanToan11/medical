using DB;

namespace Service;

public interface IStaffService
{
    Task<IEnumerable<Staff>> GetAllStaffAsync();
    Task<Staff?> GetStaffByIdAsync(int id);
    Task<Staff?> CreateStaffAsync(Staff staff);
    Task<bool> UpdateStaffAsync(Staff staff);
    Task<bool> DeleteStaffAsync(int id);
    Task<Staff?> GetStaffByUsernameAsync(string username);
    Task<Staff?> GetStaffByEmailAsync(string email);
    Task<bool> ValidateCredentialsAsync(string username, string password);

    // GradeNurse management
    Task<GradeNurse> CreateGradeNurseAsync(GradeNurse gradeNurse);
    Task<bool> DeleteGradeNurseAsync(int gradeNurseId);
    Task<IEnumerable<GradeNurse>> GetGradeNursesByGradeAsync(int grade);
    Task<IEnumerable<GradeNurse>> GetGradeNursesByStaffIdAsync(int staffId);
    Task<IEnumerable<GradeNurse>> GetAllGradeNursesAsync();
    Task<bool> IsNurseAssignedToGradeAsync(int staffId, int grade);
}
