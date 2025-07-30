using DB;

namespace Repo;

public interface IMedicineRequestRepository
{
    // Core CRUD operations
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);

    // Filtering methods
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
    Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync();

    // Staff and assignment methods
    Task<IEnumerable<Staff>> GetAvailableNursesAsync();
    Task<int> GetPendingRequestCountForNurseAsync(int staffId);
    Task<bool> AssignNurseToRequestAsync(int requestId, int staffId);

    // MedicineRequestItem operations
    Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId);
    Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item);
    Task<bool> UpdateMedicineRequestItemVerificationStatus(int itemId, string status);

    // Time-based status updates
    Task<bool> UpdateTimeBasedStatusAsync();
}
