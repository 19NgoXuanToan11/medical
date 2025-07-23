using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthCheckForm
{
    public int FormId { get; set; }

    // Basic Information
    public string? Title { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public TimeSpan? StartTime { get; set; }
    public int? EstimatedDuration { get; set; } // in minutes
    public string? Description { get; set; }
    public string? Location { get; set; }

    // Student and Parent Information
    public int? StudentId { get; set; }
    public int? ParentId { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? CreatedBy { get; set; } // Staff ID who created this schedule

    // Consent and Confirmation
    public string? ConsentStatus { get; set; }
    public DateTime? ConsentDate { get; set; }
    public string? ConfirmStatus { get; set; }
    public int? ConfirmedBy { get; set; }
    public DateTime? ConfirmedDate { get; set; }

    // Grade and Class Information
    public int? GradeLevel { get; set; }
    public string? ClassName { get; set; }
    public string? GradeIds { get; set; } // JSON array of grade IDs
    public int? TotalStudents { get; set; }

    // Settings
    public bool? NotifyParents { get; set; } = true;
    public bool? AutoAdvance { get; set; } = true;
    public bool? SaveResults { get; set; } = true;
    public bool? GenerateReport { get; set; } = true;
    public bool? RequireParentConfirmation { get; set; } = true;

    // Station Information
    public string? SelectedStations { get; set; } // JSON array of station assignments
    public string? StaffAssigned { get; set; } // JSON array of staff assignments

    // Status and Timing
    public string? Status { get; set; } = "pending"; // pending, approved, scheduled, active, completed, cancelled
    public string? EstimatedEndTime { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? ConfirmedByStaff { get; set; }
    public virtual Staff? CreatedByStaff { get; set; } // Navigation to staff who created this
    public virtual ICollection<HealthCheckResult> Results { get; set; } = new List<HealthCheckResult>();
}
