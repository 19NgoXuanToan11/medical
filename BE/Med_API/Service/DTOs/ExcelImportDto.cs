using System.ComponentModel.DataAnnotations;

namespace Service.DTOs;

public class ExcelImportDto
{
    public class StudentRow
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [RegularExpression("^(M|F)$", ErrorMessage = "Gender must be 'M' or 'F'")]
        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        [Required]
        public string ClassName { get; set; } = null!;

        [Required]
        [Range(1, 12, ErrorMessage = "GradeLevel must be between 1 and 12")]
        public int GradeLevel { get; set; }
    }

    public class ParentRow
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        public string Relationship { get; set; } = null!;

        [Required]
        [Phone]
        public string Phone { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        public string? Address { get; set; }

        public string? Occupation { get; set; }

        [Required]
        public bool IsEmergencyContact { get; set; }

        [Required]
        public bool IsMainContact { get; set; }
    }

    public class HealthProfileRow
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [Required]
        public bool HasAllergies { get; set; }

        public string? AllergyDetails { get; set; }

        [Required]
        public bool HasChronicDiseases { get; set; }

        public string? ChronicDetails { get; set; }

        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid blood type format")]
        public string? BloodType { get; set; }

        [Required]
        public bool HasVisionIssues { get; set; }

        public string? VisionNotes { get; set; }

        public string? LeftEye { get; set; }

        public string? RightEye { get; set; }

        [Required]
        public bool HasHearingIssues { get; set; }

        public string? HearingNotes { get; set; }

        public string? LeftEar { get; set; }

        public string? RightEar { get; set; }

        [Required]
        public string HasCompleteVaccinations { get; set; } = null!;

        public string? Vaccinations { get; set; }

        public string? VaccinationDetails { get; set; }

        [Required]
        public bool HasPreviousTreatment { get; set; }

        public string? TreatmentDetails { get; set; }

        [Range(0, 300, ErrorMessage = "Height must be between 0 and 300 cm")]
        public decimal? Height { get; set; }

        [Range(0, 500, ErrorMessage = "Weight must be between 0 and 500 kg")]
        public decimal? Weight { get; set; }

        public string? EmergencyContact { get; set; }

        public string? OtherInfo { get; set; }
    }

    public class ImportResult
    {
        public int TotalRows { get; set; }
        public int SuccessfullyImported { get; set; }
        public int FailedRows { get; set; }
        public List<string> Errors { get; set; } = new();
    }
} 