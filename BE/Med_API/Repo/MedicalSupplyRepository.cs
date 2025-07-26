using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class MedicalSupplyRepository : IMedicalSupplyRepository
{
    private readonly MedicalContext _context;

    public MedicalSupplyRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MedicalSupply>> GetAllMedicalSuppliesAsync()
    {
        return await _context.MedicalSupplies.ToListAsync();
    }

    public async Task<MedicalSupply?> GetMedicalSupplyByIdAsync(int id)
    {
        return await _context.MedicalSupplies.FirstOrDefaultAsync(m => m.SupplyId == id);
    }

    public async Task<MedicalSupply> CreateMedicalSupplyAsync(MedicalSupply medicalSupply)
    {
        _context.MedicalSupplies.Add(medicalSupply);
        await _context.SaveChangesAsync();
        return medicalSupply;
    }

    public async Task UpdateMedicalSupplyAsync(MedicalSupply medicalSupply)
    {
        _context.MedicalSupplies.Update(medicalSupply);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteMedicalSupplyAsync(int id)
    {
        var medicalSupply = await _context.MedicalSupplies.FindAsync(id);
        if (medicalSupply == null)
        {
            return false;
        }
        _context.MedicalSupplies.Remove(medicalSupply);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<MedicalSupply?> GetMedicalSupplyByNameAsync(string name)
    {
        return await _context.MedicalSupplies.FirstOrDefaultAsync(m => m.Name == name);
    }

    public async Task<IEnumerable<MedicalSupply>> GetActiveMedicalSuppliesAsync()
    {
        return await _context.MedicalSupplies.Where(m => m.IsActive == true).ToListAsync();
    }

    public async Task<bool> UpdateStockQuantityAsync(int supplyId, decimal quantityUsed)
    {
        var medicalSupply = await _context.MedicalSupplies.FirstOrDefaultAsync(m => m.SupplyId == supplyId);
        if (medicalSupply == null)
        {
            return false;
        }

        // Kiểm tra số lượng có đủ không
        if (medicalSupply.StockQuantity < quantityUsed)
        {
            return false; // Không đủ số lượng trong kho
        }

        // Trừ số lượng đã sử dụng
        medicalSupply.StockQuantity -= quantityUsed;
        await _context.SaveChangesAsync();
        return true;
    }
} 