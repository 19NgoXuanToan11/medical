using DB;

namespace Repo;

public interface IMedicineRequestRepository
{
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
    Task<IEnumerable<Staff>> GetAvailableNursesAsync();
    Task<int> GetPendingRequestCountForNurseAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync();
    Task<bool> AssignNurseToRequestAsync(int requestId, int staffId);
    Task<bool> CompleteRequestAsync(int requestId, int staffId);
} 