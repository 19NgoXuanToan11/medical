using DB;

namespace Service;

public interface IMedicineService
{
    Task<IEnumerable<Medicine>> GetAllMedicinesAsync();
    Task<Medicine?> GetMedicineByIdAsync(int id);
    Task<Medicine?> CreateMedicineAsync(Medicine medicine);
    Task<bool> UpdateMedicineAsync(Medicine medicine);
    Task<bool> DeleteMedicineAsync(int id);
    Task<Medicine?> GetMedicineByNameAsync(string name);
    Task<IEnumerable<Medicine>> GetActiveMedicinesAsync();
    Task<bool> UpdateStockQuantityAsync(int medicineId, decimal quantityUsed);
} 