using DB;
using Repo;

namespace Service;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;

    public StudentService(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<Student>> GetAllStudentsAsync()
    {
        return await _studentRepository.GetAllStudentsAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
        return await _studentRepository.GetStudentByIdAsync(id);
    }

    public async Task<Student?> CreateStudentAsync(Student student)
    {
        // Check for unique student code
        var existingStudent = await _studentRepository.GetStudentByCodeAsync(student.StudentCode);
        if (existingStudent != null)
        {
            return null; // Indicate that student code is not unique
        }

        return await _studentRepository.CreateStudentAsync(student);
    }

    public async Task<bool> UpdateStudentAsync(Student student)
    {
        // Check if student exists
        var existingStudent = await _studentRepository.GetStudentByIdAsync(student.StudentId);
        if (existingStudent == null)
        {
            return false; // Student not found
        }

        // Check for unique student code if it's being updated
        if (!string.IsNullOrEmpty(student.StudentCode) && existingStudent.StudentCode != student.StudentCode)
        {
            var studentWithSameCode = await _studentRepository.GetStudentByCodeAsync(student.StudentCode);
            if (studentWithSameCode != null && studentWithSameCode.StudentId != student.StudentId)
            {
                return false; // Student code not unique
            }
        }

        // Update only necessary properties
        existingStudent.StaffId = student.StaffId;
        existingStudent.StudentCode = student.StudentCode;
        existingStudent.FirstName = student.FirstName;
        existingStudent.LastName = student.LastName;
        existingStudent.DateOfBirth = student.DateOfBirth;
        existingStudent.Gender = student.Gender;
        existingStudent.ClassName = student.ClassName;
        existingStudent.GradeLevel = student.GradeLevel;
        existingStudent.Address = student.Address;
        existingStudent.IsActive = student.IsActive;

        await _studentRepository.UpdateStudentAsync(existingStudent);
        return true;
    }

    public async Task<bool> DeleteStudentAsync(int id)
    {
        return await _studentRepository.DeleteStudentAsync(id);
    }

    public async Task<Student?> GetStudentByCodeAsync(string studentCode)
    {
        return await _studentRepository.GetStudentByCodeAsync(studentCode);
    }
} 