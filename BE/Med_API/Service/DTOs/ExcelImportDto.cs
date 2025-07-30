using System.ComponentModel.DataAnnotations;

namespace Service.DTOs;

public class ExcelImportDto
{
    public class StudentRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Date of birth is required")]
        public DateOnly DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [RegularExpression("^(Nam|Nữ)$", ErrorMessage = "Gender must be Nam or Nữ")]
        public string Gender { get; set; } = null!;

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string? Address { get; set; }

        [Required(ErrorMessage = "Class name is required")]
        [StringLength(50, ErrorMessage = "Class name cannot exceed 50 characters")]
        public string ClassName { get; set; } = null!;

        [Required(ErrorMessage = "Grade level is required")]
        [Range(1, 5, ErrorMessage = "Grade level must be between 1 and 5")]
        public int GradeLevel { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(
            255,
            MinimumLength = 6,
            ErrorMessage = "Password must be at least 6 characters long"
        )]
        public string Password { get; set; } = null!;
    }

    public class ParentRow
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Relationship is required")]
        [RegularExpression(
            "^(Mother|Father|Guardian|Other)$",
            ErrorMessage = "Relationship must be Mother, Father, Guardian, or Other"
        )]
        public string Relationship { get; set; } = null!;

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\d{10,}$", ErrorMessage = "Phone number must be at least 10 digits")]
        public string Phone { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; } = null!;

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string? Address { get; set; }

        [StringLength(100, ErrorMessage = "Occupation cannot exceed 100 characters")]
        public string? Occupation { get; set; }

        [Required(ErrorMessage = "Emergency contact status is required")]
        public bool IsEmergencyContact { get; set; }

        [Required(ErrorMessage = "Main contact status is required")]
        public bool IsMainContact { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(
            255,
            MinimumLength = 6,
            ErrorMessage = "Password must be at least 6 characters long"
        )]
        public string Password { get; set; } = null!;
    }

    public class StudentParentRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "Parent email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string ParentEmail { get; set; } = null!;

        [Required(ErrorMessage = "Relationship is required")]
        [RegularExpression(
            "^(Mother|Father|Guardian|Other)$",
            ErrorMessage = "Relationship must be Mother, Father, Guardian, or Other"
        )]
        public string Relationship { get; set; } = null!;
    }

    public class HealthProfileRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "Allergy status is required")]
        public bool HasAllergies { get; set; }

        [StringLength(1000, ErrorMessage = "Allergy details cannot exceed 1000 characters")]
        public string? AllergyDetails { get; set; }

        [Required(ErrorMessage = "Chronic disease status is required")]
        public bool HasChronicDiseases { get; set; }

        [StringLength(1000, ErrorMessage = "Chronic details cannot exceed 1000 characters")]
        public string? ChronicDetails { get; set; }

        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid blood type format")]
        [StringLength(5, ErrorMessage = "Blood type cannot exceed 5 characters")]
        public string? BloodType { get; set; }

        [Required(ErrorMessage = "Vision issues status is required")]
        public bool HasVisionIssues { get; set; }

        [StringLength(1000, ErrorMessage = "Vision notes cannot exceed 1000 characters")]
        public string? VisionNotes { get; set; }

        [StringLength(20, ErrorMessage = "Left eye measurement cannot exceed 20 characters")]
        public string? LeftEye { get; set; }

        [StringLength(20, ErrorMessage = "Right eye measurement cannot exceed 20 characters")]
        public string? RightEye { get; set; }

        [Required(ErrorMessage = "Hearing issues status is required")]
        public bool HasHearingIssues { get; set; }

        [StringLength(1000, ErrorMessage = "Hearing notes cannot exceed 1000 characters")]
        public string? HearingNotes { get; set; }

        [StringLength(100, ErrorMessage = "Left ear measurement cannot exceed 100 characters")]
        public string? LeftEar { get; set; }

        [StringLength(100, ErrorMessage = "Right ear measurement cannot exceed 100 characters")]
        public string? RightEar { get; set; }

        [Required(ErrorMessage = "Vaccination status is required")]
        [RegularExpression(
            "^(Yes|No|Partial)$",
            ErrorMessage = "Vaccination status must be Yes, No, or Partial"
        )]
        public string HasCompleteVaccinations { get; set; } = null!;

        [StringLength(1000, ErrorMessage = "Vaccinations list cannot exceed 1000 characters")]
        public string? Vaccinations { get; set; }

        [StringLength(1000, ErrorMessage = "Vaccination details cannot exceed 1000 characters")]
        public string? VaccinationDetails { get; set; }

        [Required(ErrorMessage = "Previous treatment status is required")]
        public bool HasPreviousTreatment { get; set; }

        [StringLength(1000, ErrorMessage = "Treatment details cannot exceed 1000 characters")]
        public string? TreatmentDetails { get; set; }

        [Range(0, 300, ErrorMessage = "Height must be between 0 and 300 cm")]
        public decimal? Height { get; set; }

        [Range(0, 500, ErrorMessage = "Weight must be between 0 and 500 kg")]
        public decimal? Weight { get; set; }

        [StringLength(255, ErrorMessage = "Emergency contact cannot exceed 255 characters")]
        public string? EmergencyContact { get; set; }

        [StringLength(1000, ErrorMessage = "Other information cannot exceed 1000 characters")]
        public string? OtherInfo { get; set; }

        [StringLength(20, ErrorMessage = "Blood pressure cannot exceed 20 characters")]
        public string? BloodPressure { get; set; }

        [Range(0, 250, ErrorMessage = "Heart rate must be between 0 and 250 bpm")]
        public int? HeartRate { get; set; }
    }

    public class ImportResult
    {
        public int TotalRows { get; set; }
        public int SuccessfullyImported { get; set; }
        public int FailedRows { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
