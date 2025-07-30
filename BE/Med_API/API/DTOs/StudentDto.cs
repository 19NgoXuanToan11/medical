using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class StudentDto
{
    public class ViewModel
    {
        public int StudentId { get; set; }

        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = null!;

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [StringLength(10)]
        public string Gender { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = null!;

        [Required]
        [Range(1, 12)]
        public int GradeLevel { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        public bool? IsActive { get; set; }

        // Navigation properties that might be useful in the API
        public int HealthProfileCount { get; set; }
        public int HealthEventCount { get; set; }
        public int ParentCount { get; set; }

        // Navigation properties - using simplified DTOs to avoid circular references
        public ICollection<ParentSummary>? Parents { get; set; }
        public ICollection<StudentParentDto.ViewModel>? StudentParents { get; set; }

        // Thêm trường sức khỏe
        public HealthProfileDto.ViewModel? HealthProfile { get; set; }
    }

    public class ParentSummary
    {
        public int ParentId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Relationship { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(20)]
        [RegularExpression(
            @"^[A-Za-z0-9]+$",
            ErrorMessage = "Student code can only contain letters and numbers"
        )]
        public string StudentCode { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "First name can only contain letters and spaces"
        )]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "Last name can only contain letters and spaces"
        )]
        public string LastName { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [StringLength(10)]
        [RegularExpression(@"^[MF]$", ErrorMessage = "Gender must be either 'Male' or 'Female'")]
        public string Gender { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = null!;

        [Required]
        [Range(1, 12, ErrorMessage = "Grade level must be between 1 and 12")]
        public int GradeLevel { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 6)]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$",
            ErrorMessage = "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
        )]
        public string Password { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }

    public class Update
    {
        [Required]
        public int StudentId { get; set; }

        [StringLength(20)]
        [RegularExpression(
            @"^[A-Za-z0-9]+$",
            ErrorMessage = "Student code can only contain letters and numbers"
        )]
        public string? StudentCode { get; set; }

        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "First name can only contain letters and spaces"
        )]
        public string? FirstName { get; set; }

        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "Last name can only contain letters and spaces"
        )]
        public string? LastName { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateOnly? DateOfBirth { get; set; }

        [StringLength(10)]
        [RegularExpression(@"^[MF]$", ErrorMessage = "Gender must be either 'M' or 'F'")]
        public string? Gender { get; set; }

        [StringLength(50)]
        public string? ClassName { get; set; }

        [Range(1, 12, ErrorMessage = "Grade level must be between 1 and 12")]
        public int? GradeLevel { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        public bool? IsActive { get; set; }
    }
}
