using DB;
using Repo;
using System.Text.Json;

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
        if (medicineRequest.Date != default)
        {
            existing.Date = medicineRequest.Date;
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

    // New frequency-based methods
    public async Task<RequestResult?> StartMedicineRequestAsync(int requestId, int staffId)
    {
        return await _medicineRequestRepository.StartMedicineRequestAsync(requestId, staffId);
    }

    public async Task<bool> AdministerMedicineByFrequencyAsync(int requestResultId, int medicineRequestItemId, string frequency, int staffId, string? notes = null)
    {
        return await _medicineRequestRepository.AdministerMedicineByFrequencyAsync(requestResultId, medicineRequestItemId, frequency, staffId, notes);
    }

    public async Task<bool> IsMedicineCompletedForDayAsync(int requestResultId, int medicineRequestItemId)
    {
        return await _medicineRequestRepository.IsMedicineCompletedForDayAsync(requestResultId, medicineRequestItemId);
    }

    public async Task<IEnumerable<string>> GetPendingFrequenciesAsync(int requestResultId, int medicineRequestItemId)
    {
        return await _medicineRequestRepository.GetPendingFrequenciesAsync(requestResultId, medicineRequestItemId);
    }

    public async Task<bool> CompleteMedicineRequestAsync(int requestResultId, int staffId)
    {
        return await _medicineRequestRepository.CompleteMedicineRequestAsync(requestResultId, staffId);
    }

    // New failure handling methods
    public async Task<bool> ReportMedicineFailureAsync(int requestResultId, int medicineRequestItemId, string frequency, string failureReason, int staffId, string? notes = null)
    {
        return await _medicineRequestRepository.ReportMedicineFailureAsync(requestResultId, medicineRequestItemId, frequency, failureReason, staffId, notes);
    }

    public async Task<RequestResult?> CreateReRequestAsync(int originalRequestResultId, string reRequestReason, int staffId)
    {
        return await _medicineRequestRepository.CreateReRequestAsync(originalRequestResultId, reRequestReason, staffId);
    }

    public async Task<bool> UpdateTimeBasedStatusAsync()
    {
        return await _medicineRequestRepository.UpdateTimeBasedStatusAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetFailedRequestsAsync()
    {
        return await _medicineRequestRepository.GetFailedRequestsAsync();
    }

    public async Task<IEnumerable<RequestResult>> GetReRequestsAsync(int originalRequestResultId)
    {
        return await _medicineRequestRepository.GetReRequestsAsync(originalRequestResultId);
    }

    public async Task<bool> IsRequestEligibleForReRequestAsync(int requestResultId)
    {
        return await _medicineRequestRepository.IsRequestEligibleForReRequestAsync(requestResultId);
    }

    public async Task<string> GetReRequestReasonAsync(int requestResultId)
    {
        return await _medicineRequestRepository.GetReRequestReasonAsync(requestResultId);
    }

    public async Task<bool> MarkRequestAsFailedAsync(int requestResultId, string reason)
    {
        return await _medicineRequestRepository.MarkRequestAsFailedAsync(requestResultId, reason);
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int requestResultId)
    {
        return await _medicineRequestRepository.GetRequestResultByIdAsync(requestResultId);
    }
} 