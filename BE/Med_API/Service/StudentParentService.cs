using DB;
using Repo;

namespace Service;

public class StudentParentService : IStudentParentService
{
    private readonly IStudentParentRepository _studentParentRepository;

    public StudentParentService(IStudentParentRepository studentParentRepository)
    {
        _studentParentRepository = studentParentRepository;
    }

    public async Task<IEnumerable<StudentParent>> GetAllStudentParentsAsync()
    {
        return await _studentParentRepository.GetAllAsync();
    }

    public async Task<StudentParent?> GetStudentParentByIdAsync(int id)
    {
        return await _studentParentRepository.GetByIdAsync(id);
    }

    public async Task<StudentParent?> CreateStudentParentAsync(StudentParent studentParent)
    {
        // Check if the relationship already exists
        var existingRelationship = await _studentParentRepository.GetByStudentAndParentIdsAsync(
            studentParent.StudentId, studentParent.ParentId);
        
        if (existingRelationship != null)
        {
            return null; // Relationship already exists
        }

        return await _studentParentRepository.CreateAsync(studentParent);
    }

    public async Task<bool> UpdateStudentParentAsync(StudentParent studentParent)
    {
        // Check if the relationship exists
        var existingRelationship = await _studentParentRepository.GetByIdAsync(studentParent.StudentParentId);
        if (existingRelationship == null)
        {
            return false; // Relationship not found
        }

        // Check if the new relationship would create a duplicate
        if (existingRelationship.StudentId != studentParent.StudentId || 
            existingRelationship.ParentId != studentParent.ParentId)
        {
            var duplicateCheck = await _studentParentRepository.GetByStudentAndParentIdsAsync(
                studentParent.StudentId, studentParent.ParentId);
            
            if (duplicateCheck != null && duplicateCheck.StudentParentId != studentParent.StudentParentId)
            {
                return false; // Would create a duplicate relationship
            }
        }

        return await _studentParentRepository.UpdateAsync(studentParent);
    }

    public async Task<bool> DeleteStudentParentAsync(int id)
    {
        return await _studentParentRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByStudentIdAsync(int studentId)
    {
        return await _studentParentRepository.GetByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<StudentParent>> GetStudentParentsByParentIdAsync(int parentId)
    {
        return await _studentParentRepository.GetByParentIdAsync(parentId);
    }
} 