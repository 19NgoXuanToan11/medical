using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class ParentDto
{
    public class ViewModel
    {
        public int ParentId { get; set; }
        public string StudentCode { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Relationship { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Occupation { get; set; }
        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; }
        
        // Navigation properties - using simplified DTOs to avoid circular references
        public ICollection<StudentSummary>? Students { get; set; }
        public ICollection<StudentParentDto.ViewModel>? StudentParents { get; set; }
    }

    public class StudentSummary
    {
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? ClassName { get; set; }
        public int GradeLevel { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string LastName { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Relationship { get; set; } = null!;

        [Required]
        [StringLength(20)]
        [Phone]
        public string Phone { get; set; } = null!;

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Occupation { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 6)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$", 
            ErrorMessage = "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character")]
        public string Password { get; set; } = null!;

        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class Update
    {
        [Required]
        public int ParentId { get; set; }

        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = null!;

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string? FirstName { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string? LastName { get; set; }

        [StringLength(20)]
        public string? Relationship { get; set; }

        [StringLength(20)]
        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Occupation { get; set; }

        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; }
    }

    public class MedicineRequestProgress
    {
        public int RequestId { get; set; }
        public string StudentCode { get; set; } = null!;
        public string StudentName { get; set; } = null!;
        public string? ClassName { get; set; }
        public DateOnly Date { get; set; }
        public string? Status { get; set; }
        public DateTime? RequestDate { get; set; }
        
        // Add medicine items
        public ICollection<MedicineRequestItemProgress>? MedicineItems { get; set; }
    }

    public class MedicineRequestItemProgress
    {
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string? DosageUnit { get; set; } // Added for displaying dosage unit
        public string Frequency { get; set; } = null!;
        public string? TimeOfDay { get; set; }
        public string? Instructions { get; set; }
        public Dictionary<string, object>? VerifiedStatus { get; set; } // Changed to structured object
    }

    public class ParentStatistics
    {
        public int TotalChildren { get; set; }
        public int TotalVaccinations { get; set; }
        public int TotalHealthEvents { get; set; }
        public int TotalHealthChecks { get; set; }
        public int TotalMedicineRequests { get; set; }
        
        // Breakdown by status
        public VaccinationStats VaccinationBreakdown { get; set; } = new();
        public HealthEventStats HealthEventBreakdown { get; set; } = new();
        public HealthCheckStats HealthCheckBreakdown { get; set; } = new();
        public MedicineRequestStats MedicineRequestBreakdown { get; set; } = new();
        
        // Children details
        public ICollection<ChildStatistic> ChildrenDetails { get; set; } = new List<ChildStatistic>();
    }

    public class VaccinationStats
    {
        public int Pending { get; set; }
        public int Approved { get; set; }
        public int Completed { get; set; }
        public int Rejected { get; set; }
    }

    public class HealthEventStats
    {
        public int Emergency { get; set; }
        public int Routine { get; set; }
        public int FollowUpRequired { get; set; }
        public int Resolved { get; set; }
    }

    public class HealthCheckStats
    {
        public int Scheduled { get; set; }
        public int Completed { get; set; }
        public int Pending { get; set; }
        public int Cancelled { get; set; }
    }

    public class MedicineRequestStats
    {
        public int Pending { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
    }

    public class ChildStatistic
    {
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = null!;
        public string StudentName { get; set; } = null!;
        public string? ClassName { get; set; }
        public int GradeLevel { get; set; }
        public int VaccinationCount { get; set; }
        public int HealthEventCount { get; set; }
        public int HealthCheckCount { get; set; }
        public int MedicineRequestCount { get; set; }
        public DateTime? LastHealthCheck { get; set; }
        public DateTime? LastHealthEvent { get; set; }
    }
} 