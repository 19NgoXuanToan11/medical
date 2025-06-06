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

        return await _medicineRequestRepository.CreateMedicineRequestAsync(medicineRequest);
    }

    public async Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        var existing = await _medicineRequestRepository.GetMedicineRequestByIdAsync(medicineRequest.RequestId);
        if (existing == null)
        {
            return false;
        }

        // Update only the fields that are provided
        if (!string.IsNullOrEmpty(medicineRequest.Status))
        {
            existing.Status = medicineRequest.Status;
        }
        if (!string.IsNullOrEmpty(medicineRequest.MedicineName))
        {
            existing.MedicineName = medicineRequest.MedicineName;
        }
        if (!string.IsNullOrEmpty(medicineRequest.Dosage))
        {
            existing.Dosage = medicineRequest.Dosage;
        }
        if (!string.IsNullOrEmpty(medicineRequest.Frequency))
        {
            existing.Frequency = medicineRequest.Frequency;
        }
        if (!string.IsNullOrEmpty(medicineRequest.Instructions))
        {
            existing.Instructions = medicineRequest.Instructions;
        }
        if (!string.IsNullOrEmpty(medicineRequest.MealRelation))
        {
            existing.MealRelation = medicineRequest.MealRelation;
        }
        if (!string.IsNullOrEmpty(medicineRequest.TimeOfDay))
        {
            existing.TimeOfDay = medicineRequest.TimeOfDay;
        }
        if (!string.IsNullOrEmpty(medicineRequest.MedicationImagePath))
        {
            existing.MedicationImagePath = medicineRequest.MedicationImagePath;
        }
        if (!string.IsNullOrEmpty(medicineRequest.PrescriptionImagePath))
        {
            existing.PrescriptionImagePath = medicineRequest.PrescriptionImagePath;
        }

        await _medicineRequestRepository.UpdateMedicineRequestAsync(existing);
        return true;
    }

    public async Task<bool> DeleteMedicineRequestAsync(int id)
    {
        return await _medicineRequestRepository.DeleteMedicineRequestAsync(id);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentIdAsync(int studentId)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStudentIdAsync(studentId);
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
} 