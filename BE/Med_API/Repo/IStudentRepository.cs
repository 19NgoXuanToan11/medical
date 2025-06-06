using DB;

namespace Repo;

public interface IStudentRepository
{
    Task<IEnumerable<Student>> GetAllStudentsAsync();
    Task<Student?> GetStudentByIdAsync(int id);
    Task<Student> CreateStudentAsync(Student student);
    Task UpdateStudentAsync(Student student);
    Task<bool> DeleteStudentAsync(int id);
    Task<Student?> GetStudentByCodeAsync(string studentCode);
} 