using DB;

namespace Service;

public interface IParentService
{
    Task<IEnumerable<Parent>> GetAllParentsAsync();
    Task<Parent?> GetParentByIdAsync(int id);
    Task<Parent?> CreateParentAsync(Parent parent);
    Task<bool> UpdateParentAsync(Parent parent);
    Task<bool> DeleteParentAsync(int id);
    Task<Parent?> GetParentByPhoneAsync(string phone);
    Task<IEnumerable<DB.MedicineRequest>> GetMedicineRequestProgressAsync(int parentId);
    Task<IEnumerable<DB.MedicineRequest>> GetRefusedMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<RequestResult>> GetFailedRequestResultsByParentIdAsync(int parentId);
} 