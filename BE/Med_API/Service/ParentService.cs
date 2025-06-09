using DB;
using Repo;

namespace Service;

public class ParentService : IParentService
{
    private readonly IParentRepository _parentRepository;

    public ParentService(IParentRepository parentRepository)
    {
        _parentRepository = parentRepository;
    }

    public async Task<IEnumerable<Parent>> GetAllParentsAsync()
    {
        return await _parentRepository.GetAllParentsAsync();
    }

    public async Task<Parent?> GetParentByIdAsync(int id)
    {
        return await _parentRepository.GetParentByIdAsync(id);
    }

    public async Task<Parent?> CreateParentAsync(Parent parent)
    {
        // Validate required relationships
        if (parent.StudentId == null)
        {
            return null; // Parent must be associated with a student
        }

        return await _parentRepository.CreateParentAsync(parent);
    }

    public async Task<bool> UpdateParentAsync(Parent parent)
    {
        // Check if parent exists
        var existingParent = await _parentRepository.GetParentByIdAsync(parent.ParentId);
        if (existingParent == null)
        {
            return false; // Parent not found
        }

        // Validate required relationships
        if (parent.StudentId == null)
        {
            return false; // Parent must be associated with a student
        }

        // Update only necessary properties
        existingParent.StudentId = parent.StudentId;
        existingParent.FirstName = parent.FirstName;
        existingParent.LastName = parent.LastName;
        existingParent.Relationship = parent.Relationship;
        existingParent.Phone = parent.Phone;
        existingParent.Email = parent.Email;
        existingParent.Address = parent.Address;
        existingParent.Occupation = parent.Occupation;
        existingParent.IsEmergencyContact = parent.IsEmergencyContact;
        existingParent.IsMainContact = parent.IsMainContact;
        existingParent.IsActive = parent.IsActive;

        await _parentRepository.UpdateParentAsync(existingParent);
        return true;
    }

    public async Task<bool> DeleteParentAsync(int id)
    {
        return await _parentRepository.DeleteParentAsync(id);
    }

    public async Task<IEnumerable<Parent>> GetParentsByStudentIdAsync(int studentId)
    {
        return await _parentRepository.GetParentsByStudentIdAsync(studentId);
    }
} 