using DB;
using Repo;
using Microsoft.EntityFrameworkCore;

namespace Service;

public class ParentService : IParentService
{
    private readonly IParentRepository _parentRepository;
    private readonly IStudentRepository _studentRepository;

    public ParentService(IParentRepository parentRepository, IStudentRepository studentRepository)
    {
        _parentRepository = parentRepository;
        _studentRepository = studentRepository;
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
        // Student association is now handled via the StudentParent join table.
        // We assume the student associated with this parent will be created/linked separately.
        // Check for unique phone
        if (!string.IsNullOrEmpty(parent.Phone))
        {
            var existingParentWithPhone = await _parentRepository.GetParentByPhoneAsync(parent.Phone);
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

        try
        {
            return await _parentRepository.CreateParentAsync(parent);
        }
        catch (InvalidOperationException)
        {
            return null; // Other validation error during creation
        }
    }

    public async Task<bool> UpdateParentAsync(Parent parent)
    {
        // Check if parent exists
        var existingParent = await _parentRepository.GetParentByIdAsync(parent.ParentId);
        if (existingParent == null)
        {
            return false; // Parent not found
        }

        // StudentCode is no longer directly on Parent; assume student association is managed by StudentParent
        // if (existingParent.StudentCode != parent.StudentCode)
        // {
        //     var student = await _studentRepository.GetStudentByCodeAsync(parent.StudentCode);
        //     if (student == null)
        //     {
        //         return false; // Student not found
        //     }
        // }

        // Check for unique phone if it's being updated
        if (!string.IsNullOrEmpty(parent.Phone) && existingParent.Phone != parent.Phone)
        {
            var parentWithSamePhone = await _parentRepository.GetParentByPhoneAsync(parent.Phone);
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

    public async Task<Parent?> GetParentByPhoneAsync(string phone)
    {
        return await _parentRepository.GetParentByPhoneAsync(phone);
    }

    public async Task<IEnumerable<DB.MedicineRequest>> GetMedicineRequestProgressAsync(int parentId)
    {
        return await _parentRepository.GetMedicineRequestProgressAsync(parentId);
    }

    public async Task<IEnumerable<DB.MedicineRequest>> GetRefusedMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _parentRepository.GetRefusedMedicineRequestsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<DB.MedicineRequest>> GetFailedMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _parentRepository.GetFailedMedicineRequestsByParentIdAsync(parentId);
    }
} 