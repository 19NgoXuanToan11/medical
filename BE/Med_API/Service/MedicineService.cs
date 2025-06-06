using DB;
using Repo;

namespace Service;

public class MedicineService : IMedicineService
{
    private readonly IMedicineRepository _medicineRepository;

    public MedicineService(IMedicineRepository medicineRepository)
    {
        _medicineRepository = medicineRepository;
    }

    public async Task<IEnumerable<Medicine>> GetAllMedicinesAsync()
    {
        return await _medicineRepository.GetAllMedicinesAsync();
    }

    public async Task<Medicine?> GetMedicineByIdAsync(int id)
    {
        return await _medicineRepository.GetMedicineByIdAsync(id);
    }

    public async Task<Medicine?> CreateMedicineAsync(Medicine medicine)
    {
        // Check for unique name
        var existing = await _medicineRepository.GetMedicineByNameAsync(medicine.Name);
        if (existing != null)
        {
            return null; // Name must be unique
        }
        return await _medicineRepository.CreateMedicineAsync(medicine);
    }

    public async Task<bool> UpdateMedicineAsync(Medicine medicine)
    {
        var existing = await _medicineRepository.GetMedicineByIdAsync(medicine.MedicineId);
        if (existing == null)
        {
            return false;
        }
        // Check for unique name if changed
        if (!string.IsNullOrEmpty(medicine.Name) && existing.Name != medicine.Name)
        {
            var withSameName = await _medicineRepository.GetMedicineByNameAsync(medicine.Name);
            if (withSameName != null && withSameName.MedicineId != medicine.MedicineId)
            {
                return false;
            }
        }
        existing.Name = medicine.Name ?? existing.Name;
        existing.StockQuantity = medicine.StockQuantity ?? existing.StockQuantity;
        existing.IsActive = medicine.IsActive ?? existing.IsActive;
        await _medicineRepository.UpdateMedicineAsync(existing);
        return true;
    }

    public async Task<bool> DeleteMedicineAsync(int id)
    {
        return await _medicineRepository.DeleteMedicineAsync(id);
    }

    public async Task<Medicine?> GetMedicineByNameAsync(string name)
    {
        return await _medicineRepository.GetMedicineByNameAsync(name);
    }

    public async Task<IEnumerable<Medicine>> GetActiveMedicinesAsync()
    {
        return await _medicineRepository.GetActiveMedicinesAsync();
    }
} 