using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthCheckForm
{
    public int FormId { get; set; }

    public int? StudentId { get; set; }

    public int? ParentId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ConsentStatus { get; set; }

    public DateTime? ConsentDate { get; set; }

    public int? GradeLevel { get; set; }

    public string? ClassName { get; set; }

    public string? ConfirmStatus { get; set; }

    public int? ConfirmedBy { get; set; }

    public DateTime? ConfirmedDate { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? ConfirmedByStaff { get; set; }
    public virtual ICollection<HealthCheckResult> Results { get; set; } = new List<HealthCheckResult>();
}
