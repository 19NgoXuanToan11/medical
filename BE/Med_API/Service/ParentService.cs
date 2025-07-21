using DB;
using Repo;
using Microsoft.EntityFrameworkCore;
using Service.DTOs;

namespace Service;

public class ParentService : IParentService
{
    private readonly IParentRepository _parentRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly MedicalContext _context;

    public ParentService(IParentRepository parentRepository, IStudentRepository studentRepository, MedicalContext context)
    {
        _parentRepository = parentRepository;
        _studentRepository = studentRepository;
        _context = context;
    }

    public async Task<IEnumerable<Parent>> GetAllParentsAsync()
    {
        return await _parentRepository.GetAllParentsAsync();
    }

    public async Task<Parent?> GetParentByIdAsync(int id)
    {
        return await _parentRepository.GetParentByIdAsync(id);
    }

    public async Task<Parent?> CreateParentAsync(Parent parent)
    {
        // Student association is now handled via the StudentParent join table.
        // We assume the student associated with this parent will be created/linked separately.
        // Check for unique phone
        if (!string.IsNullOrEmpty(parent.Phone))
        {
            var existingParentWithPhone = await _parentRepository.GetParentByPhoneAsync(parent.Phone);
            if (existingParentWithPhone != null)
            {
                return null; // Phone number already exists
            }
        }

        // Check for unique email
        if (!string.IsNullOrEmpty(parent.Email))
        {
            var existingParentWithEmail = await _parentRepository.GetParentByEmailAsync(parent.Email);
            if (existingParentWithEmail != null)
            {
                return null; // Email already exists
            }
        }

        try
        {
            return await _parentRepository.CreateParentAsync(parent);
        }
        catch (InvalidOperationException)
        {
            return null; // Other validation error during creation
        }
    }

    public async Task<bool> UpdateParentAsync(Parent parent)
    {
        // Check if parent exists
        var existingParent = await _parentRepository.GetParentByIdAsync(parent.ParentId);
        if (existingParent == null)
        {
            return false; // Parent not found
        }

        // StudentCode is no longer directly on Parent; assume student association is managed by StudentParent
        // if (existingParent.StudentCode != parent.StudentCode)
        // {
        //     var student = await _studentRepository.GetStudentByCodeAsync(parent.StudentCode);
        //     if (student == null)
        //     {
        //         return false; // Student not found
        //     }
        // }

        // Check for unique phone if it's being updated
        if (!string.IsNullOrEmpty(parent.Phone) && existingParent.Phone != parent.Phone)
        {
            var parentWithSamePhone = await _parentRepository.GetParentByPhoneAsync(parent.Phone);
            if (parentWithSamePhone != null && parentWithSamePhone.ParentId != parent.ParentId)
            {
                return false; // Phone number not unique
            }
        }

        // Check for unique email if it's being updated
        if (!string.IsNullOrEmpty(parent.Email) && existingParent.Email != parent.Email)
        {
            var parentWithSameEmail = await _parentRepository.GetParentByEmailAsync(parent.Email);
            if (parentWithSameEmail != null && parentWithSameEmail.ParentId != parent.ParentId)
            {
                return false; // Email not unique
            }
        }

        return await _parentRepository.UpdateParentAsync(parent);
    }

    public async Task<bool> DeleteParentAsync(int id)
    {
        return await _parentRepository.DeleteParentAsync(id);
    }

    public async Task<Parent?> GetParentByPhoneAsync(string phone)
    {
        return await _parentRepository.GetParentByPhoneAsync(phone);
    }

    public async Task<IEnumerable<DB.MedicineRequest>> GetMedicineRequestProgressAsync(int parentId)
    {
        return await _parentRepository.GetMedicineRequestProgressAsync(parentId);
    }

    public async Task<IEnumerable<DB.MedicineRequest>> GetRefusedMedicineRequestsByParentIdAsync(int parentId)
    {
        return await _parentRepository.GetRefusedMedicineRequestsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<RequestResult>> GetFailedRequestResultsByParentIdAsync(int parentId)
    {
        return await _parentRepository.GetFailedRequestResultsByParentIdAsync(parentId);
    }

    public async Task<ParentStatisticsDto> GetParentStatisticsAsync(int parentId)
    {
        // Get all students related to this parent
        var studentParents = await _context.StudentParents
            .Where(sp => sp.ParentId == parentId)
            .Include(sp => sp.Student)
                .ThenInclude(s => s.Class)
            .ToListAsync();

        var studentCodes = studentParents.Select(sp => sp.StudentCode).ToList();
        var studentIds = studentParents.Select(sp => sp.Student?.StudentId).Where(id => id.HasValue).Select(id => id.Value).ToList();

        // Get vaccination statistics
        var vaccinations = await _context.InjectionForms
            .Where(vf => studentIds.Contains(vf.StudentId ?? 0))
            .ToListAsync();

        var vaccinationStats = new VaccinationStats
        {
            Pending = vaccinations.Count(v => v.ConsentStatus == "Pending"),
            Approved = vaccinations.Count(v => v.ConsentStatus == "Approved"),
            Completed = vaccinations.Count(v => v.ConsentStatus == "Completed"),
            Rejected = vaccinations.Count(v => v.ConsentStatus == "Rejected")
        };

        // Get health events statistics
        var healthEvents = await _context.HealthEvents
            .Where(he => studentCodes.Contains(he.StudentCode))
            .ToListAsync();

        var healthEventStats = new HealthEventStats
        {
            Emergency = healthEvents.Count(he => he.EventType?.ToLower() == "emergency"),
            Routine = healthEvents.Count(he => he.EventType?.ToLower() == "routine"),
            FollowUpRequired = healthEvents.Count(he => he.FollowUpRequired == true),
            Resolved = healthEvents.Count(he => he.FollowUpRequired == false)
        };

        // Get health check statistics
        var healthChecks = await _context.HealthCheckForms
            .Where(hcf => studentIds.Contains(hcf.StudentId ?? 0))
            .ToListAsync();

        var healthCheckStats = new HealthCheckStats
        {
            Pending = healthChecks.Count(hc => hc.ConsentStatus == "Pending"),
            Scheduled = healthChecks.Count(hc => hc.Status == "scheduled"),
            Completed = healthChecks.Count(hc => hc.Status == "completed"),
            Cancelled = healthChecks.Count(hc => hc.Status == "cancelled")
        };

        // Get medicine request statistics
        var medicineRequests = await _context.MedicineRequests
            .Where(mr => studentCodes.Contains(mr.StudentCode))
            .ToListAsync();

        var medicineRequestStats = new MedicineRequestStats
        {
            Pending = medicineRequests.Count(mr => mr.Status == "Pending"),
            Approved = medicineRequests.Count(mr => mr.Status == "Approved"),
            Rejected = medicineRequests.Count(mr => mr.Status == "Rejected"),
            InProgress = medicineRequests.Count(mr => mr.Status == "InProgress"),
            Completed = medicineRequests.Count(mr => mr.Status == "Completed")
        };

        // Create children details
        var childrenDetails = new List<ChildStatistic>();
        foreach (var sp in studentParents)
        {
            if (sp.Student == null) continue;

            var student = sp.Student;
            var studentCode = sp.StudentCode;
            var studentId = student.StudentId;

            var lastHealthCheck = await _context.HealthCheckResults
                .Where(hcr => hcr.StudentId == studentId)
                .OrderByDescending(hcr => hcr.ExaminedDate)
                .Select(hcr => hcr.ExaminedDate)
                .FirstOrDefaultAsync();

            var lastHealthEvent = await _context.HealthEvents
                .Where(he => he.StudentCode == studentCode)
                .OrderByDescending(he => he.EventDate)
                .Select(he => he.EventDate)
                .FirstOrDefaultAsync();

            childrenDetails.Add(new ChildStatistic
            {
                StudentId = studentId,
                StudentCode = studentCode,
                StudentName = $"{student.FirstName} {student.LastName}",
                ClassName = student.Class?.ClassName,
                GradeLevel = student.Class?.GradeLevel ?? 1,
                VaccinationCount = vaccinations.Count(v => v.StudentId == studentId),
                HealthEventCount = healthEvents.Count(he => he.StudentCode == studentCode),
                HealthCheckCount = healthChecks.Count(hc => hc.StudentId == studentId),
                MedicineRequestCount = medicineRequests.Count(mr => mr.StudentCode == studentCode),
                LastHealthCheck = lastHealthCheck,
                LastHealthEvent = lastHealthEvent
            });
        }

        return new ParentStatisticsDto
        {
            TotalChildren = studentParents.Count,
            TotalVaccinations = vaccinations.Count,
            TotalHealthEvents = healthEvents.Count,
            TotalHealthChecks = healthChecks.Count,
            TotalMedicineRequests = medicineRequests.Count,
            VaccinationBreakdown = vaccinationStats,
            HealthEventBreakdown = healthEventStats,
            HealthCheckBreakdown = healthCheckStats,
            MedicineRequestBreakdown = medicineRequestStats,
            ChildrenDetails = childrenDetails
        };
    }
} 