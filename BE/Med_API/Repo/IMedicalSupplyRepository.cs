using DB;

namespace Repo;

public interface IMedicalSupplyRepository
{
    Task<IEnumerable<MedicalSupply>> GetAllMedicalSuppliesAsync();
    Task<MedicalSupply?> GetMedicalSupplyByIdAsync(int id);
    Task<MedicalSupply> CreateMedicalSupplyAsync(MedicalSupply medicalSupply);
    Task UpdateMedicalSupplyAsync(MedicalSupply medicalSupply);
    Task<bool> DeleteMedicalSupplyAsync(int id);
    Task<MedicalSupply?> GetMedicalSupplyByNameAsync(string name);
    Task<IEnumerable<MedicalSupply>> GetActiveMedicalSuppliesAsync();
} 