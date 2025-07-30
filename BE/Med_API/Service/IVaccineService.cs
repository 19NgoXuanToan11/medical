using DB;

namespace Service;

public interface IVaccineService
{
    Task<IEnumerable<Vaccine>> GetAllVaccinesAsync();
    Task<Vaccine?> GetVaccineByIdAsync(int id);
    Task<Vaccine?> CreateVaccineAsync(Vaccine vaccine);
    Task<bool> UpdateVaccineAsync(Vaccine vaccine);
    Task<bool> DeleteVaccineAsync(int id);
    Task<Vaccine?> GetVaccineByNameAsync(string name);
    Task<IEnumerable<Vaccine>> GetActiveVaccinesAsync();
}
