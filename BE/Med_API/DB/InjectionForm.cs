using System;
using System.Collections.Generic;

namespace DB;

public partial class InjectionForm
{
    public int FormId { get; set; }

    public int? StudentId { get; set; }

    public int? ParentId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string InjectionName { get; set; } = null!;

    public string? Description { get; set; }

    public string? ConsentStatus { get; set; }

    public DateTime? ConsentDate { get; set; }

    public int? GradeLevel { get; set; }

    public string? ClassName { get; set; }

    public string? ConfirmStatus { get; set; }

    public int? ConfirmedBy { get; set; }

    public DateTime? ConfirmedDate { get; set; }

    public int? VaccineId { get; set; } // Liên kết với Vaccine

    public string? Status { get; set; } // Trạng thái duyệt: pending, approved, rejected, etc
    
    public string? Notes { get; set; } // Ghi chú từ manager khi duyệt/từ chối

    // Vaccination schedule fields (added to support schedule creation)
    public DateTime? ScheduledDate { get; set; }
    public TimeSpan? StartTime { get; set; }
    public int? EstimatedDuration { get; set; }
    public string? Location { get; set; }
    public string? GradeIds { get; set; } // JSON array of grade IDs
    public int? TotalStudents { get; set; }
    public bool? NotifyParents { get; set; }
    public bool? RequireParentConfirmation { get; set; }

    // New fields for storing detailed information as JSON
    public string? ClassDetailsJson { get; set; } // JSON string of class details
    public string? StudentDetailsJson { get; set; } // JSON string of student details
    public string? HealthProfilesJson { get; set; } // JSON string of health profiles

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? ConfirmedByStaff { get; set; }
    public virtual Vaccine? Vaccine { get; set; }
    public virtual ICollection<InjectionResult> InjectionResults { get; set; } = new List<InjectionResult>();
}
