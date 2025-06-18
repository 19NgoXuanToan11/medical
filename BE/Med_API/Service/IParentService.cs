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
} 