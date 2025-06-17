using DB;

namespace Service;

public interface IMedicineRequestService
{
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest?> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
} 