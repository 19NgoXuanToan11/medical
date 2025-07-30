using DB;

namespace Service;

public interface IMedicalSupplyService
{
    Task<IEnumerable<MedicalSupply>> GetAllMedicalSuppliesAsync();
    Task<MedicalSupply?> GetMedicalSupplyByIdAsync(int id);
    Task<MedicalSupply?> CreateMedicalSupplyAsync(MedicalSupply medicalSupply);
    Task<bool> UpdateMedicalSupplyAsync(MedicalSupply medicalSupply);
    Task<bool> DeleteMedicalSupplyAsync(int id);
    Task<MedicalSupply?> GetMedicalSupplyByNameAsync(string name);
    Task<IEnumerable<MedicalSupply>> GetActiveMedicalSuppliesAsync();
    Task<bool> UpdateStockQuantityAsync(int supplyId, decimal quantityUsed);
}
