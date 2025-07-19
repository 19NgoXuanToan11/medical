using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class VaccineRepository : IVaccineRepository
{
    private readonly MedicalContext _context;

    public VaccineRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vaccine>> GetAllVaccinesAsync()
    {
        return await _context.Vaccines.ToListAsync();
    }

    public async Task<Vaccine?> GetVaccineByIdAsync(int id)
    {
        return await _context.Vaccines.FirstOrDefaultAsync(v => v.VaccineId == id);
    }

    public async Task<Vaccine> CreateVaccineAsync(Vaccine vaccine)
    {
        _context.Vaccines.Add(vaccine);
        await _context.SaveChangesAsync();
        return vaccine;
    }

    public async Task UpdateVaccineAsync(Vaccine vaccine)
    {
        _context.Vaccines.Update(vaccine);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteVaccineAsync(int id)
    {
        var vaccine = await _context.Vaccines.FindAsync(id);
        if (vaccine == null)
        {
            return false;
        }
        _context.Vaccines.Remove(vaccine);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Vaccine?> GetVaccineByNameAsync(string name)
    {
        return await _context.Vaccines.FirstOrDefaultAsync(v => v.Name == name);
    }

    public async Task<IEnumerable<Vaccine>> GetActiveVaccinesAsync()
    {
        return await _context.Vaccines.Where(v => v.IsActive == true).ToListAsync();
    }
} 