using System;
using System.Collections.Generic;

namespace DB;

public partial class MedicineRequest
{
    public int RequestId { get; set; }

    public string? StudentCode { get; set; }

    public string? ClassName { get; set; }

    public DateOnly Date { get; set; }

    public string? Status { get; set; }

    public DateTime? RequestDate { get; set; }

    public int? ParentId { get; set; }

    public int? StaffId { get; set; }

    public string? RefusalReason { get; set; }

    public int? AdministrationStartedBy { get; set; }

    public DateTime? AdministrationStartedDate { get; set; }

    public string? AdministrationNotes { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? Staff { get; set; }
    public virtual ICollection<RequestResult> RequestResults { get; set; } =
        new List<RequestResult>();
    public virtual ICollection<MedicineRequestItem> MedicineRequestItems { get; set; } =
        new List<MedicineRequestItem>();
}
