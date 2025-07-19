using DB;
using Repo;

namespace Service;

public class VaccineService : IVaccineService
{
    private readonly IVaccineRepository _vaccineRepository;

    public VaccineService(IVaccineRepository vaccineRepository)
    {
        _vaccineRepository = vaccineRepository;
    }

    public async Task<IEnumerable<Vaccine>> GetAllVaccinesAsync()
    {
        return await _vaccineRepository.GetAllVaccinesAsync();
    }

    public async Task<Vaccine?> GetVaccineByIdAsync(int id)
    {
        return await _vaccineRepository.GetVaccineByIdAsync(id);
    }

    public async Task<Vaccine?> CreateVaccineAsync(Vaccine vaccine)
    {
        // Check for unique name
        var existing = await _vaccineRepository.GetVaccineByNameAsync(vaccine.Name);
        if (existing != null)
        {
            return null; // Name must be unique
        }
        return await _vaccineRepository.CreateVaccineAsync(vaccine);
    }

    public async Task<bool> UpdateVaccineAsync(Vaccine vaccine)
    {
        var existing = await _vaccineRepository.GetVaccineByIdAsync(vaccine.VaccineId);
        if (existing == null)
        {
            return false;
        }
        // Check for unique name if changed
        if (!string.IsNullOrEmpty(vaccine.Name) && existing.Name != vaccine.Name)
        {
            var withSameName = await _vaccineRepository.GetVaccineByNameAsync(vaccine.Name);
            if (withSameName != null && withSameName.VaccineId != vaccine.VaccineId)
            {
                return false;
            }
        }
        existing.Name = vaccine.Name ?? existing.Name;
        existing.Manufacturer = vaccine.Manufacturer ?? existing.Manufacturer;
        existing.BatchNumber = vaccine.BatchNumber ?? existing.BatchNumber;
        existing.ExpiryDate = vaccine.ExpiryDate ?? existing.ExpiryDate;
        existing.Dose = vaccine.Dose ?? existing.Dose;
        existing.AdministrationMethod = vaccine.AdministrationMethod ?? existing.AdministrationMethod;
        existing.Description = vaccine.Description ?? existing.Description;
        existing.IsActive = vaccine.IsActive ?? existing.IsActive;
        await _vaccineRepository.UpdateVaccineAsync(existing);
        return true;
    }

    public async Task<bool> DeleteVaccineAsync(int id)
    {
        return await _vaccineRepository.DeleteVaccineAsync(id);
    }

    public async Task<Vaccine?> GetVaccineByNameAsync(string name)
    {
        return await _vaccineRepository.GetVaccineByNameAsync(name);
    }

    public async Task<IEnumerable<Vaccine>> GetActiveVaccinesAsync()
    {
        return await _vaccineRepository.GetActiveVaccinesAsync();
    }
} 