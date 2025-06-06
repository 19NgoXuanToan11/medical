using System;
using System.Collections.Generic;

namespace DB;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? StudentId { get; set; }

    public int? ParentId { get; set; }

    public int? StaffId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string AppointmentType { get; set; } = null!;

    public string Reason { get; set; } = null!;

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? Staff { get; set; }
}
