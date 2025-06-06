using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthCheckResult
{
    public int ResultId { get; set; }

    public int? FormId { get; set; }

    public int? StudentId { get; set; }

    public int? ExaminedBy { get; set; }

    public DateTime ExaminedDate { get; set; }

    public decimal? Height { get; set; }

    public decimal? Weight { get; set; }

    public string? VisionRight { get; set; }

    public string? VisionLeft { get; set; }

    public string? HearingStatus { get; set; }

    public string? BloodPressure { get; set; }

    public int? HeartRate { get; set; }

    public string? GeneralFindings { get; set; }

    public string? Recommendations { get; set; }

    // Navigation properties
    public virtual HealthCheckForm? Form { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Staff? ExaminedByStaff { get; set; }
}
