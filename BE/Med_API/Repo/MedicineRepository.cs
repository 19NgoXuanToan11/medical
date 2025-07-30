using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class MedicineRepository : IMedicineRepository
{
    private readonly MedicalContext _context;

    public MedicineRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Medicine>> GetAllMedicinesAsync()
    {
        return await _context.Medicines.ToListAsync();
    }

    public async Task<Medicine?> GetMedicineByIdAsync(int id)
    {
        return await _context.Medicines.FirstOrDefaultAsync(m => m.MedicineId == id);
    }

    public async Task<Medicine> CreateMedicineAsync(Medicine medicine)
    {
        _context.Medicines.Add(medicine);
        await _context.SaveChangesAsync();
        return medicine;
    }

    public async Task UpdateMedicineAsync(Medicine medicine)
    {
        _context.Medicines.Update(medicine);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteMedicineAsync(int id)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
        {
            return false;
        }
        _context.Medicines.Remove(medicine);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Medicine?> GetMedicineByNameAsync(string name)
    {
        return await _context.Medicines.FirstOrDefaultAsync(m => m.Name == name);
    }

    public async Task<IEnumerable<Medicine>> GetActiveMedicinesAsync()
    {
        return await _context.Medicines.Where(m => m.IsActive == true).ToListAsync();
    }

    public async Task<bool> UpdateStockQuantityAsync(int medicineId, decimal quantityUsed)
    {
        var medicine = await _context.Medicines.FirstOrDefaultAsync(m =>
            m.MedicineId == medicineId
        );
        if (medicine == null)
        {
            return false;
        }

        // Kiểm tra số lượng có đủ không
        if (medicine.StockQuantity < quantityUsed)
        {
            return false; // Không đủ số lượng trong kho
        }

        // Trừ số lượng đã sử dụng
        medicine.StockQuantity -= quantityUsed;
        await _context.SaveChangesAsync();
        return true;
    }
}
