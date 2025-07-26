using DB;
using Repo;
using System.Text.Json;
using System.Linq;

namespace Service;

public class MedicineRequestService : IMedicineRequestService
{
    private readonly IMedicineRequestRepository _medicineRequestRepository;
    private readonly IMedicineRepository _medicineRepository;
    private readonly IStaffRepository _staffRepository;
    private readonly IStudentRepository _studentRepository;

    public MedicineRequestService(IMedicineRequestRepository medicineRequestRepository, IMedicineRepository medicineRepository, IStaffRepository staffRepository, IStudentRepository studentRepository)
    {
        _medicineRequestRepository = medicineRequestRepository;
        _medicineRepository = medicineRepository;
        _staffRepository = staffRepository;
        _studentRepository = studentRepository;
    }

    // Core CRUD operations
    public async Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync()
    {
        return await _medicineRequestRepository.GetAllMedicineRequestsAsync();
    }

    public async Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id)
    {
        return await _medicineRequestRepository.GetMedicineRequestByIdAsync(id);
    }

    public async Task<MedicineRequest?> CreateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        // Set default status if not provided
        if (string.IsNullOrEmpty(medicineRequest.Status))
        {
            medicineRequest.Status = "Pending";
        }

        // Set request date if not provided
        if (medicineRequest.RequestDate == default)
        {
            medicineRequest.RequestDate = DateTime.UtcNow;
        }

        // Auto-assign nurse based on student's grade level
        if (medicineRequest.StaffId == null && !string.IsNullOrEmpty(medicineRequest.StudentCode))
        {
            var grade = await GetGradeByStudentCodeAsync(medicineRequest.StudentCode);
            if (grade.HasValue)
            {
                var assignedNurse = await GetNurseByGradeAsync(grade.Value);
                if (assignedNurse != null)
                {
                    medicineRequest.StaffId = assignedNurse.StaffId;
                }
            }
        }

        // Ensure MedicineRequestItems are linked to this request if they are new
        if (medicineRequest.MedicineRequestItems != null)
        {
            foreach (var item in medicineRequest.MedicineRequestItems)
            {
                item.MedicineRequestId = medicineRequest.RequestId; // This will be 0 for new requests, EF will handle
            }
        }

        return await _medicineRequestRepository.CreateMedicineRequestAsync(medicineRequest);
    }

    public async Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest)
    {
        var existing = await _medicineRequestRepository.GetMedicineRequestByIdAsync(medicineRequest.RequestId);
        if (existing == null)
        {
            return false;
        }

        // Update only the fields that are provided for the main MedicineRequest
        if (!string.IsNullOrEmpty(medicineRequest.Status))
        {
            existing.Status = medicineRequest.Status;
        }
        if (medicineRequest.Date != default)
        {
            existing.Date = medicineRequest.Date;
        }
        if (!string.IsNullOrEmpty(medicineRequest.ClassName))
        {
            existing.ClassName = medicineRequest.ClassName;
        }
        
        // Assign the updated collection of items to the existing request object
        // The repository will handle the logic for adding, updating, and removing items.
        existing.MedicineRequestItems = medicineRequest.MedicineRequestItems;

        await _medicineRequestRepository.UpdateMedicineRequestAsync(existing);
        return true;
    }

    public async Task<bool> DeleteMedicineRequestAsync(int id)
    {
        return await _medicineRequestRepository.DeleteMedicineRequestAsync(id);
    }

    // Filtering methods
    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStudentCodeAsync(studentCode);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId)
    {
        return await _medicineRequestRepository.GetMedicineRequestsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status)
    {
        // Return all requests, filtering by status will be done in the controller
        return await _medicineRequestRepository.GetAllMedicineRequestsAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync()
    {
        // Return all requests, filtering by status will be done in the controller
        return await _medicineRequestRepository.GetAllMedicineRequestsAsync();
    }

    public async Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByAssignedGradeAsync(int staffId, string? status = null)
    {
        Console.WriteLine($"DEBUG GetMedicineRequestsByAssignedGradeAsync: staffId={staffId}, status={status}");
        
        // Get nurse's assigned grades
        var gradeNurses = await _staffRepository.GetGradeNursesByStaffIdAsync(staffId);
        var assignedGrades = gradeNurses.Select(gn => gn.Grade).ToList();

        Console.WriteLine($"DEBUG: Found {gradeNurses.Count()} grade assignments for staffId {staffId}");
        Console.WriteLine($"DEBUG: Assigned grades: [{string.Join(", ", assignedGrades)}]");

        // Get all medicine requests
        var allRequests = await _medicineRequestRepository.GetAllMedicineRequestsAsync();
        Console.WriteLine($"DEBUG: Found {allRequests.Count()} total medicine requests");

        // If no grades assigned, return all requests (or filter by status if provided)
        if (!assignedGrades.Any())
        {
            Console.WriteLine($"DEBUG: No grades assigned to staffId {staffId}, returning all requests");
            if (!string.IsNullOrEmpty(status))
            {
                var statusFilteredRequests = allRequests.Where(request => 
                    request.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
                Console.WriteLine($"DEBUG: Filtered to {statusFilteredRequests.Count} requests with status '{status}'");
                return statusFilteredRequests;
            }
            return allRequests;
        }

        // Filter requests by assigned grades and status
        var filteredRequests = allRequests.Where(request =>
        {
            Console.WriteLine($"DEBUG: Checking request {request.RequestId}, StudentCode: {request.StudentCode}, Student: {request.Student?.FirstName}, Class: {request.Student?.Class?.ClassName}, GradeLevel: {request.Student?.Class?.GradeLevel}, Status: {request.Status}");
            
            // Check if request belongs to a student in assigned grades
            if (request.Student?.Class?.GradeLevel != null && assignedGrades.Contains(request.Student.Class.GradeLevel))
            {
                Console.WriteLine($"DEBUG: Request {request.RequestId} matches assigned grade {request.Student.Class.GradeLevel}");
                
                // If status filter is provided, apply it
                if (!string.IsNullOrEmpty(status))
                {
                    bool statusMatch = request.Status.Equals(status, StringComparison.OrdinalIgnoreCase);
                    Console.WriteLine($"DEBUG: Status filter '{status}' vs request status '{request.Status}': {statusMatch}");
                    return statusMatch;
                }
                return true;
            }
            return false;
        }).ToList();

        Console.WriteLine($"DEBUG: Filtered to {filteredRequests.Count} requests matching criteria");
        return filteredRequests;
    }

    // Staff and assignment methods
    public async Task<IEnumerable<Staff>> GetAvailableNursesAsync()
    {
        return await _medicineRequestRepository.GetAvailableNursesAsync();
    }

    public async Task<bool> AssignNurseToRequestAsync(int requestId, int staffId)
    {
        return await _medicineRequestRepository.AssignNurseToRequestAsync(requestId, staffId);
    }

    public async Task<bool> IsManualAssignmentAllowedAsync(int requestId)
    {
        var request = await _medicineRequestRepository.GetMedicineRequestByIdAsync(requestId);
        if (request == null || string.IsNullOrEmpty(request.StudentCode))
        {
            return true; // Allow manual assignment if no request or no student code
        }

        var grade = await GetGradeByStudentCodeAsync(request.StudentCode);
        if (!grade.HasValue)
        {
            return true; // Allow manual assignment if cannot determine grade
        }

        var assignedNurse = await GetNurseByGradeAsync(grade.Value);
        return assignedNurse == null; // Only allow manual assignment if no nurse assigned to this grade
    }

    // Auto-assignment by grade methods
    public async Task<int?> GetGradeByStudentCodeAsync(string studentCode)
    {
        try
        {
            var student = await _studentRepository.GetStudentByCodeAsync(studentCode);
            
            if (student == null)
            {
                Console.WriteLine($"DEBUG: Student not found for code: {studentCode}");
                return null;
            }
            
            if (student.Class == null)
            {
                Console.WriteLine($"DEBUG: Class not loaded for student: {studentCode}");
                return null;
            }
            
            Console.WriteLine($"DEBUG: Student {studentCode} found with Class {student.Class.ClassName}, GradeLevel: {student.Class.GradeLevel}");
            return student.Class.GradeLevel;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DEBUG: Error getting grade for student {studentCode}: {ex.Message}");
            return null;
        }
    }

    public async Task<Staff?> GetNurseByGradeAsync(int grade)
    {
        var gradeNurses = await _staffRepository.GetGradeNursesByGradeAsync(grade);
        return gradeNurses.FirstOrDefault()?.Nurse;
    }

    // MedicineRequestItem operations
    public async Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId)
    {
        return await _medicineRequestRepository.GetMedicineRequestItemByIdAsync(itemId);
    }

    public async Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item)
    {
        var result = await _medicineRequestRepository.UpdateMedicineRequestItemAsync(item);
        // After updating the item, update the main status
        await UpdateMedicineRequestMainStatus(item.MedicineRequestId);
        return result;
    }

    // Time-based status updates
    public async Task<bool> UpdateTimeBasedStatusAsync()
    {
        return await _medicineRequestRepository.UpdateTimeBasedStatusAsync();
    }

    // Helper to update the main status of a MedicineRequest
    private async Task UpdateMedicineRequestMainStatus(int medicineRequestId)
    {
        var request = await _medicineRequestRepository.GetMedicineRequestByIdAsync(medicineRequestId);
        if (request == null) return;

        var allLatestStatuses = request.MedicineRequestItems
            .SelectMany(item =>
            {
                var periodStatus = new Dictionary<string, object>();
                try
                {
                    periodStatus = JsonSerializer.Deserialize<Dictionary<string, object>>(item.VerificationStatus ?? "") ?? new Dictionary<string, object>();
                }
                catch { }
                // For each period, get the last status
                return periodStatus.Values
                    .Select(val =>
                    {
                        if (val is string strVal && strVal.StartsWith("{"))
                            return JsonSerializer.Deserialize<JsonElement>(strVal).GetProperty("Status").GetString();
                        if (val is JsonElement elem && elem.ValueKind == JsonValueKind.Object && elem.TryGetProperty("Status", out var statusProp))
                            return statusProp.GetString();
                        return val?.ToString();
                    })
                    .Where(s => !string.IsNullOrEmpty(s))
                    .ToList();
            })
            .SelectMany(x => x)
            .ToList();

        if (allLatestStatuses.Count == 0 || allLatestStatuses.All(s => new List<string> { "Pending", "Refused" }.Contains(Convert.ToString(s))))
            request.Status = "Pending";
        else if (allLatestStatuses.All(s => new List<string> { "Completed", "Failed", "Refused" }.Contains(Convert.ToString(s))))
            request.Status = "Done";
        else if (allLatestStatuses.Any(s => Convert.ToString(s) == "Verified"))
            request.Status = "In-Progress";
        else
            request.Status = "Pending"; // fallback

        await _medicineRequestRepository.UpdateMedicineRequestAsync(request);
    }
}

 