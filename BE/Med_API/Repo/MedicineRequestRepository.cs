using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class MedicineRequestRepository : IMedicineRequestRepository
{
    private readonly MedicalContext _context;

    public MedicineRequestRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync()
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .ToListAsync();
    }

    public async Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .FirstOrDefaultAsync(m => m.RequestId == id);
    }

    public async Task<MedicineRequest> CreateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        _context.MedicineRequests.Add(medicineRequest);
        await _context.SaveChangesAsync();
        return medicineRequest;
    }

    public async Task UpdateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        _context.MedicineRequests.Update(medicineRequest);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteMedicineRequestAsync(int id)
    {
        var medicineRequest = await _context.MedicineRequests.FindAsync(id);
        if (medicineRequest == null)
        {
            return false;
        }
        _context.MedicineRequests.Remove(medicineRequest);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentIdAsync(int studentId)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .Where(m => m.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .Where(m => m.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .Where(m => m.StaffId == staffId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status)
    {
        return await _context.MedicineRequests
            .Include(m => m.Student)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .Where(m => m.Status == status)
            .ToListAsync();
    }
} 