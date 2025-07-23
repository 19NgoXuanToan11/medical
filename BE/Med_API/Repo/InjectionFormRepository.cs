using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class InjectionFormRepository : IInjectionFormRepository
{
    private readonly MedicalContext _context;

    public InjectionFormRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InjectionForm>> GetAllInjectionFormsAsync()
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .ToListAsync();
    }

    public async Task<InjectionForm?> GetInjectionFormByIdAsync(int id)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .FirstOrDefaultAsync(f => f.FormId == id);
    }

    public async Task<InjectionForm> CreateInjectionFormAsync(InjectionForm injectionForm)
    {
        _context.InjectionForms.Add(injectionForm);
        await _context.SaveChangesAsync();
        return injectionForm;
    }

    public async Task<bool> UpdateInjectionFormAsync(InjectionForm injectionForm)
    {
        var existingForm = await _context.InjectionForms.FindAsync(injectionForm.FormId);
        if (existingForm == null)
        {
            return false;
        }

        _context.Entry(existingForm).CurrentValues.SetValues(injectionForm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteInjectionFormAsync(int id)
    {
        var injectionForm = await _context.InjectionForms.FindAsync(id);
        if (injectionForm == null)
        {
            return false;
        }
        _context.InjectionForms.Remove(injectionForm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStudentIdAsync(int studentId)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.StudentId == studentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByParentIdAsync(int parentId)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.ParentId == parentId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InjectionForm>> GetInjectionFormsByStatusAsync(string status)
    {
        return await _context.InjectionForms
            .Include(f => f.Student)
            .Include(f => f.Parent)
            .Include(f => f.Vaccine)
            .Where(f => f.ConsentStatus == status)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }
} 