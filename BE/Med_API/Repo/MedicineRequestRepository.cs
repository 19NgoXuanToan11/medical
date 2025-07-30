using System.Text.Json;
using System.Text.RegularExpressions;
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

    // Core CRUD operations
    public async Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync()
    {
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .ThenInclude(s => s.Class)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .ToListAsync();
    }

    public async Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id)
    {
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .ThenInclude(s => s.Class)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
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
        var existingRequest = await _context
            .MedicineRequests.Include(r => r.MedicineRequestItems)
            .Include(r => r.RequestResults)
            .FirstOrDefaultAsync(r => r.RequestId == medicineRequest.RequestId);

        if (existingRequest == null)
        {
            return; // Or throw an exception, depending on desired behavior
        }

        _context.Entry(existingRequest).CurrentValues.SetValues(medicineRequest);
        existingRequest.RefusalReason = medicineRequest.RefusalReason;

        // Handle MedicineRequestItems
        var existingItems = existingRequest.MedicineRequestItems.ToList();
        var newItems = medicineRequest.MedicineRequestItems.ToList();

        // Remove items not present in the new list
        foreach (
            var existingItem in existingItems.Except(newItems, new MedicineRequestItemComparer())
        )
        {
            _context.MedicineRequestItems.Remove(existingItem);
        }

        // Add or update items
        foreach (var newItem in newItems)
        {
            var existingItem = existingItems.FirstOrDefault(i =>
                i.MedicineRequestItemId == newItem.MedicineRequestItemId
            );
            if (existingItem == null) // New item
            {
                existingRequest.MedicineRequestItems.Add(newItem);
            }
            else // Update existing item
            {
                _context.Entry(existingItem).CurrentValues.SetValues(newItem);
            }
        }

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

    // Filtering methods
    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(
        string studentCode
    )
    {
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.StudentCode == studentCode)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId)
    {
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .Where(m => m.StaffId == staffId)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status)
    {
        // Return all requests, filtering by status will be done in the controller
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .ThenInclude(s => s.Class)
            .Include(m => m.Parent)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.MedicineRequestItems)
            .ToListAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync()
    {
        // Return all requests, filtering by status will be done in the controller
        return await _context
            .MedicineRequests.Include(m => m.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.StudentParents)
            .ThenInclude(sp => sp.Student)
            .Include(m => m.Parent)
            .ThenInclude(p => p.Students)
            .Include(m => m.Staff)
            .ThenInclude(s => s.Role)
            .Include(m => m.MedicineRequestItems)
            .ToListAsync();
    }

    // Staff and assignment methods
    public async Task<IEnumerable<Staff>> GetAvailableNursesAsync()
    {
        return await _context
            .Staff.Include(s => s.Role)
            .Include(s => s.GradeNurses)
            .Where(s => s.Role.RoleName == "Nurse" && s.IsActiveForRequest)
            .ToListAsync();
    }

    public async Task<int> GetPendingRequestCountForNurseAsync(int staffId)
    {
        return await _context.MedicineRequests.CountAsync(m =>
            m.StaffId == staffId && m.Status == "Pending"
        );
    }

    public async Task<bool> AssignNurseToRequestAsync(int requestId, int staffId)
    {
        var request = await _context.MedicineRequests.FindAsync(requestId);
        if (request == null || (request.Status != "Pending" && request.Status != "Verified"))
        {
            return false;
        }

        var pendingCount = await GetPendingRequestCountForNurseAsync(staffId);
        if (pendingCount >= 5)
        {
            return false;
        }

        request.StaffId = staffId;
        request.Status = "Assigned";
        await _context.SaveChangesAsync();
        return true;
    }

    // MedicineRequestItem operations
    public async Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId)
    {
        return await _context
            .MedicineRequestItems.Include(i => i.MedicineRequest)
            .ThenInclude(m => m.Student)
            .FirstOrDefaultAsync(i => i.MedicineRequestItemId == itemId);
    }

    public async Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item)
    {
        _context.MedicineRequestItems.Update(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateMedicineRequestItemVerificationStatus(int itemId, string status)
    {
        var item = await _context.MedicineRequestItems.FindAsync(itemId);
        if (item == null)
            return false;
        item.VerificationStatus = status;
        await _context.SaveChangesAsync();
        return true;
    }

    // Time-based status updates
    public async Task<bool> UpdateTimeBasedStatusAsync()
    {
        var now = DateTime.UtcNow;
        var cutoffTime = DateTime.Today.AddHours(17); // 5 PM today
        var today = DateOnly.FromDateTime(DateTime.Today);

        // Get all in-progress requests that are past cutoff time or from previous days
        var expiredRequests = await _context
            .RequestResults.Where(r =>
                r.Status == "In Progress" && (r.CurrentDate < today || now > cutoffTime)
            )
            .ToListAsync();

        foreach (var request in expiredRequests)
        {
            request.Status = "Failed";
            request.LastAttemptTime = now;
            request.FailedAttempts++;

            var failureReasons = new Dictionary<string, string>
            {
                ["timeout"] = "Request expired due to time limit",
            };
            request.FailureReasons = JsonSerializer.Serialize(failureReasons);
        }

        if (expiredRequests.Any())
        {
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }
}

public class MedicineRequestItemComparer : IEqualityComparer<MedicineRequestItem>
{
    public bool Equals(MedicineRequestItem? x, MedicineRequestItem? y)
    {
        if (ReferenceEquals(x, y))
            return true;
        if (ReferenceEquals(x, null) || ReferenceEquals(y, null))
            return false;
        return x.MedicineRequestItemId == y.MedicineRequestItemId;
    }

    public int GetHashCode(MedicineRequestItem obj)
    {
        return obj.MedicineRequestItemId.GetHashCode();
    }
}
