using System;
using System.Collections.Generic;

namespace DB;

public partial class RequestResult
{
    public int ResultId { get; set; }

    public int? RequestId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? SubmittedAt { get; set; }

    public int? AdministeredBy { get; set; }

    public DateTime? AdministeredTime { get; set; }

    public int? ActionBy { get; set; }

    // Navigation properties
    public virtual MedicineRequest? Request { get; set; }
    public virtual Staff? AdministeredByStaff { get; set; }
    public virtual Staff? ActionByStaff { get; set; }
}
