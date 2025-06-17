using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DB;

public partial class HealthProfile
{
    public int HealthProfileId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = null!;

    public string? BloodType { get; set; }

    public decimal? Height { get; set; }

    public decimal? Weight { get; set; }

    public bool? HasAllergies { get; set; }

    public string? AllergyDetails { get; set; }

    public bool? HasChronicDiseases { get; set; }

    public string? ChronicDetails { get; set; }

    public bool? HasPreviousTreatment { get; set; }

    public string? TreatmentDetails { get; set; }

    public string? HasCompleteVaccinations { get; set; }

    public string? VaccinationDetails { get; set; }

    public string? Vaccinations { get; set; }

    public bool? HasVisionIssues { get; set; }

    public string? LeftEye { get; set; }

    public string? RightEye { get; set; }

    public string? VisionNotes { get; set; }

    public bool? HasHearingIssues { get; set; }

    public string? LeftEar { get; set; }

    public string? RightEar { get; set; }

    public string? HearingNotes { get; set; }

    public string? BloodPressure { get; set; }

    public int? HeartRate { get; set; }

    public string? EmergencyContact { get; set; }

    public string? OtherInfo { get; set; }

    public DateTime? LastUpdated { get; set; }

    public virtual Student? Student { get; set; }
}
