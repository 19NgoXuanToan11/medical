using DB;

namespace Repo;

public interface IStaffRepository
{
    Task<IEnumerable<Staff>> GetAllStaffAsync();
    Task<Staff?> GetStaffByIdAsync(int id);
    Task<Staff> CreateStaffAsync(Staff staff);
    Task UpdateStaffAsync(Staff staff);
    Task<bool> DeleteStaffAsync(int id);
    Task<Staff?> GetStaffByUsernameAsync(string username);
    Task<Staff?> GetStaffByEmailAsync(string email);
    Task<GradeNurse> CreateGradeNurseAsync(GradeNurse gradeNurse);
    Task<bool> DeleteGradeNurseAsync(int gradeNurseId);
    Task<IEnumerable<GradeNurse>> GetGradeNursesByGradeAsync(int grade);
    Task<IEnumerable<GradeNurse>> GetGradeNursesByStaffIdAsync(int staffId);
    Task<IEnumerable<GradeNurse>> GetAllGradeNursesAsync();
} 