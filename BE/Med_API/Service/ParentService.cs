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
        // Check for unique phone
        if (!string.IsNullOrEmpty(parent.Phone))
        {
            var existingParentWithPhone = await _parentRepository.GetParentByIdAsync(parent.ParentId);
            if (existingParentWithPhone != null)
            {
                return null; // Phone number already exists
            }
        }

        // Check for unique email
        if (!string.IsNullOrEmpty(parent.Email))
        {
            var existingParentWithEmail = await _parentRepository.GetParentByEmailAsync(parent.Email);
            if (existingParentWithEmail != null)
            {
                return null; // Email already exists
            }
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

        // Check for unique phone if it's being updated
        if (!string.IsNullOrEmpty(parent.Phone) && existingParent.Phone != parent.Phone)
        {
            var parentWithSamePhone = await _parentRepository.GetParentByIdAsync(parent.ParentId);
            if (parentWithSamePhone != null && parentWithSamePhone.ParentId != parent.ParentId)
            {
                return false; // Phone number not unique
            }
        }

        // Check for unique email if it's being updated
        if (!string.IsNullOrEmpty(parent.Email) && existingParent.Email != parent.Email)
        {
            var parentWithSameEmail = await _parentRepository.GetParentByEmailAsync(parent.Email);
            if (parentWithSameEmail != null && parentWithSameEmail.ParentId != parent.ParentId)
            {
                return false; // Email not unique
            }
        }

        return await _parentRepository.UpdateParentAsync(parent);
    }

    public async Task<bool> DeleteParentAsync(int id)
    {
        return await _parentRepository.DeleteParentAsync(id);
    }

  
} 