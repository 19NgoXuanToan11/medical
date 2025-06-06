using DB;

namespace Repo;

public interface IMedicineRepository
{
    Task<IEnumerable<Medicine>> GetAllMedicinesAsync();
    Task<Medicine?> GetMedicineByIdAsync(int id);
    Task<Medicine> CreateMedicineAsync(Medicine medicine);
    Task UpdateMedicineAsync(Medicine medicine);
    Task<bool> DeleteMedicineAsync(int id);
    Task<Medicine?> GetMedicineByNameAsync(string name);
    Task<IEnumerable<Medicine>> GetActiveMedicinesAsync();
} 