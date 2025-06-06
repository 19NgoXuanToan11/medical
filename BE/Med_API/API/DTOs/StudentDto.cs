using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class StudentDto
{
    public class ViewModel
    {
        public int StudentId { get; set; }

        public int? StaffId { get; set; }

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
        [StringLength(1)]
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
        public string? StaffName { get; set; } // Will be mapped from Staff.FirstName + Staff.LastName
        public int HealthProfileCount { get; set; }
        public int HealthEventCount { get; set; }
        public int ParentCount { get; set; }
    }

    public class Create
    {
        [Required]
        public int? StaffId { get; set; }

        [Required]
        [StringLength(20)]
        [RegularExpression(@"^[A-Za-z0-9]+$", ErrorMessage = "Student code can only contain letters and numbers")]
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
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [StringLength(1)]
        [RegularExpression(@"^[MF]$", ErrorMessage = "Gender must be either 'M' or 'F'")]
        public string Gender { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = null!;

        [Required]
        [Range(1, 12, ErrorMessage = "Grade level must be between 1 and 12")]
        public int GradeLevel { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class Update
    {
        [Required]
        public int StudentId { get; set; }

        public int? StaffId { get; set; }

        [StringLength(20)]
        [RegularExpression(@"^[A-Za-z0-9]+$", ErrorMessage = "Student code can only contain letters and numbers")]
        public string? StudentCode { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string? FirstName { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string? LastName { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateOnly? DateOfBirth { get; set; }

        [StringLength(1)]
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