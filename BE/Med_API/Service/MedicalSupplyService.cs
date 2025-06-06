using DB;
using Repo;

namespace Service;

public class MedicalSupplyService : IMedicalSupplyService
{
    private readonly IMedicalSupplyRepository _medicalSupplyRepository;

    public MedicalSupplyService(IMedicalSupplyRepository medicalSupplyRepository)
    {
        _medicalSupplyRepository = medicalSupplyRepository;
    }

    public async Task<IEnumerable<MedicalSupply>> GetAllMedicalSuppliesAsync()
    {
        return await _medicalSupplyRepository.GetAllMedicalSuppliesAsync();
    }

    public async Task<MedicalSupply?> GetMedicalSupplyByIdAsync(int id)
    {
        return await _medicalSupplyRepository.GetMedicalSupplyByIdAsync(id);
    }

    public async Task<MedicalSupply?> CreateMedicalSupplyAsync(MedicalSupply medicalSupply)
    {
        // Check for unique name
        var existing = await _medicalSupplyRepository.GetMedicalSupplyByNameAsync(medicalSupply.Name);
        if (existing != null)
        {
            return null; // Name must be unique
        }
        return await _medicalSupplyRepository.CreateMedicalSupplyAsync(medicalSupply);
    }

    public async Task<bool> UpdateMedicalSupplyAsync(MedicalSupply medicalSupply)
    {
        var existing = await _medicalSupplyRepository.GetMedicalSupplyByIdAsync(medicalSupply.SupplyId);
        if (existing == null)
        {
            return false;
        }
        // Check for unique name if changed
        if (!string.IsNullOrEmpty(medicalSupply.Name) && existing.Name != medicalSupply.Name)
        {
            var withSameName = await _medicalSupplyRepository.GetMedicalSupplyByNameAsync(medicalSupply.Name);
            if (withSameName != null && withSameName.SupplyId != medicalSupply.SupplyId)
            {
                return false;
            }
        }
        existing.Name = medicalSupply.Name ?? existing.Name;
        existing.Category = medicalSupply.Category ?? existing.Category;
        existing.Description = medicalSupply.Description ?? existing.Description;
        existing.StockQuantity = medicalSupply.StockQuantity ?? existing.StockQuantity;
        existing.IsActive = medicalSupply.IsActive ?? existing.IsActive;
        await _medicalSupplyRepository.UpdateMedicalSupplyAsync(existing);
        return true;
    }

    public async Task<bool> DeleteMedicalSupplyAsync(int id)
    {
        return await _medicalSupplyRepository.DeleteMedicalSupplyAsync(id);
    }

    public async Task<MedicalSupply?> GetMedicalSupplyByNameAsync(string name)
    {
        return await _medicalSupplyRepository.GetMedicalSupplyByNameAsync(name);
    }

    public async Task<IEnumerable<MedicalSupply>> GetActiveMedicalSuppliesAsync()
    {
        return await _medicalSupplyRepository.GetActiveMedicalSuppliesAsync();
    }
} 