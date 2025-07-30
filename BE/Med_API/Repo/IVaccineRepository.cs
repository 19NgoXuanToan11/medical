using DB;

namespace Repo;

public interface IVaccineRepository
{
    Task<IEnumerable<Vaccine>> GetAllVaccinesAsync();
    Task<Vaccine?> GetVaccineByIdAsync(int id);
    Task<Vaccine> CreateVaccineAsync(Vaccine vaccine);
    Task UpdateVaccineAsync(Vaccine vaccine);
    Task<bool> DeleteVaccineAsync(int id);
    Task<Vaccine?> GetVaccineByNameAsync(string name);
    Task<IEnumerable<Vaccine>> GetActiveVaccinesAsync();
}
