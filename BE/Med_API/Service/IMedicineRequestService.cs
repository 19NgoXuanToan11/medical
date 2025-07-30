using DB;

namespace Service;

public interface IMedicineRequestService
{
    // Core CRUD operations
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest?> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);

    // Filtering methods
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
    Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync();
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByAssignedGradeAsync(
        int staffId,
        string? status = null
    );

    // Staff and assignment methods
    Task<IEnumerable<Staff>> GetAvailableNursesAsync();
    Task<bool> AssignNurseToRequestAsync(int requestId, int staffId);
    Task<bool> IsManualAssignmentAllowedAsync(int requestId);

    // Auto-assignment by grade methods
    Task<int?> GetGradeByStudentCodeAsync(string studentCode);
    Task<Staff?> GetNurseByGradeAsync(int grade);

    // MedicineRequestItem operations
    Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId);
    Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item);

    // Time-based status updates
    Task<bool> UpdateTimeBasedStatusAsync();
}
