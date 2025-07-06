using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class HealthProfileDTO
{
    public int HealthProfileId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = null!;

    [StringLength(5)]
    public string? BloodType { get; set; }

    [Range(0, 300)]
    public decimal? Height { get; set; }

    [Range(0, 500)]
    public decimal? Weight { get; set; }

    public bool? HasAllergies { get; set; }

    [StringLength(1000)]
    public string? AllergyDetails { get; set; }

    public bool? HasChronicDiseases { get; set; }

    [StringLength(1000)]
    public string? ChronicDetails { get; set; }

    public bool? HasPreviousTreatment { get; set; }

    [StringLength(1000)]
    public string? TreatmentDetails { get; set; }

    [StringLength(10)]
    public string? HasCompleteVaccinations { get; set; }

    [StringLength(1000)]
    public string? VaccinationDetails { get; set; }

    [StringLength(1000)]
    public string? Vaccinations { get; set; }

    public bool? HasVisionIssues { get; set; }

    [StringLength(20)]
    public string? LeftEye { get; set; }

    [StringLength(20)]
    public string? RightEye { get; set; }

    [StringLength(1000)]
    public string? VisionNotes { get; set; }

    public bool? HasHearingIssues { get; set; }

    [StringLength(100)]
    public string? LeftEar { get; set; }

    [StringLength(100)]
    public string? RightEar { get; set; }

    [StringLength(1000)]
    public string? HearingNotes { get; set; }

    [StringLength(20)]
    public string? BloodPressure { get; set; }

    [Range(0, 250)]
    public int? HeartRate { get; set; }

    [StringLength(255)]
    public string? EmergencyContact { get; set; }

    [StringLength(1000)]
    public string? OtherInfo { get; set; }

    public DateTime? LastUpdated { get; set; }

    // Navigation property
    public StudentDto.ViewModel? Student { get; set; }
    
    // Parent information
    public ICollection<ParentSummary>? Parents { get; set; }
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