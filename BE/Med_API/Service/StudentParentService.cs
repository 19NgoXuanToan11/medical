using DB;
using Repo;

namespace Service;

public class StudentParentService : IStudentParentService
{
    private readonly IStudentParentRepository _studentParentRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IParentRepository _parentRepository;

    public StudentParentService(
        IStudentParentRepository studentParentRepository,
        IStudentRepository studentRepository,
        IParentRepository parentRepository)
    {
        _studentParentRepository = studentParentRepository;
        _studentRepository = studentRepository;
        _parentRepository = parentRepository;
    }

    public async Task<IEnumerable<StudentParent>> GetAllStudentParentsAsync()
    {
        return await _studentParentRepository.GetAllStudentParentsAsync();
    }

    public async Task<StudentParent?> GetStudentParentByIdAsync(int id)
    {
        return await _studentParentRepository.GetStudentParentByIdAsync(id);
    }

    public async Task<StudentParent?> CreateStudentParentAsync(StudentParent studentParent)
    {
        // Verify that both Student and Parent exist
        var student = await _studentRepository.GetStudentByCodeAsync(studentParent.StudentCode);
        var parent = await _parentRepository.GetParentByIdAsync(studentParent.ParentId);

        if (student == null || parent == null)
        {
            return null;
        }

        return await _studentParentRepository.CreateStudentParentAsync(studentParent);
    }

    public async Task<bool> UpdateStudentParentAsync(StudentParent studentParent)
    {
        // Verify that the Student exists
        var student = await _studentRepository.GetStudentByCodeAsync(studentParent.StudentCode);
        if (student == null)
        {
            return false;
        }

        return await _studentParentRepository.UpdateStudentParentAsync(studentParent);
    }

    public async Task<bool> DeleteStudentParentAsync(int id)
    {
        return await _studentParentRepository.DeleteStudentParentAsync(id);
    }

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByStudentCodeAsync(string studentCode)
    {
        return await _studentParentRepository.GetStudentParentsByStudentCodeAsync(studentCode);
    }

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByParentIdAsync(int parentId)
    {
        return await _studentParentRepository.GetStudentParentsByParentIdAsync(parentId);
    }
} 