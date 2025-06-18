using DB;
using Repo;

namespace Service;

public class MedicineRequestService : IMedicineRequestService
{
    private readonly IMedicineRequestRepository _medicineRequestRepository;

    public MedicineRequestService(IMedicineRequestRepository medicineRequestRepository)
    {
        _medicineRequestRepository = medicineRequestRepository;
    }

    public async Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync()
    {
        return await _medicineRequestRepository.GetAllMedicineRequestsAsync();
    }

    public async Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id)
    {
        return await _medicineRequestRepository.GetMedicineRequestByIdAsync(id);
    }

    public async Task<MedicineRequest?> CreateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        // Set default status if not provided
        if (string.IsNullOrEmpty(medicineRequest.Status))
        {
            medicineRequest.Status = "Pending";
        }

        // Set request date if not provided
        if (medicineRequest.RequestDate == default)
        {
            medicineRequest.RequestDate = DateTime.UtcNow;
        }

        // Ensure StaffId is null for new requests
        medicineRequest.StaffId = null;

        // Ensure MedicineRequestItems are linked to this request if they are new
        if (medicineRequest.MedicineRequestItems != null)
        {
            foreach (var item in medicineRequest.MedicineRequestItems)
            {
                item.MedicineRequestId = medicineRequest.RequestId; // This will be 0 for new requests, EF will handle
            }
        }

        return await _medicineRequestRepository.CreateMedicineRequestAsync(medicineRequest);
    }

    public async Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        var existing = await _medicineRequestRepository.GetMedicineRequestByIdAsync(medicineRequest.RequestId);
        if (existing == null)
        {
            return false;
        }

        // Update only the fields that are provided for the main MedicineRequest
        if (!string.IsNullOrEmpty(medicineRequest.Status))
        {
            existing.Status = medicineRequest.Status;
        }
        if (medicineRequest.StartDate != default)
        {
            existing.StartDate = medicineRequest.StartDate;
        }
        if (medicineRequest.EndDate != null && medicineRequest.EndDate != default)
        {
            existing.EndDate = medicineRequest.EndDate;
        }
        if (!string.IsNullOrEmpty(medicineRequest.ClassName))
        {
            existing.ClassName = medicineRequest.ClassName;
        }
        
        // Assign the updated collection of items to the existing request object
        // The repository will handle the logic for adding, updating, and removing items.
        existing.MedicineRequestItems = medicineRequest.MedicineRequestItems;

        await _medicineRequestRepository.UpdateMedicineRequestAsync(existing);
        return true;
    }

    public async Task<bool> DeleteMedicineRequestAsync(int id)
    {
        return await _medicineRequestRepository.DeleteMedicineRequestAsync(id);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStudentCodeAsync(studentCode);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStatusAsync(status);
    }

    public async Task<IEnumerable<Staff>> GetAvailableNursesAsync()
    {
        return await _medicineRequestRepository.GetAvailableNursesAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync()
    {
        return await _medicineRequestRepository.GetPendingRequestsAsync();
    }

    public async Task<bool> AssignNurseToRequestAsync(int requestId, int staffId)
    {
        return await _medicineRequestRepository.AssignNurseToRequestAsync(requestId, staffId);
    }

    public async Task<bool> CompleteRequestAsync(int requestId, int staffId)
    {
        return await _medicineRequestRepository.CompleteRequestAsync(requestId, staffId);
    }
} 