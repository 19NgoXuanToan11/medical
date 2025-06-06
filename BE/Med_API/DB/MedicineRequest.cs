using System;
using System.Collections.Generic;

namespace DB;

public partial class MedicineRequest
{
    public int RequestId { get; set; }

    public int? StudentId { get; set; }

    public string MedicineName { get; set; } = null!;

    public string Dosage { get; set; } = null!;

    public string Frequency { get; set; } = null!;

    public string? TimeOfDay { get; set; }

    public string? MealRelation { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Instructions { get; set; }

    public string? MedicationImagePath { get; set; }

    public string? PrescriptionImagePath { get; set; }

    public string? Status { get; set; }

    public DateTime? RequestDate { get; set; }

    public int? ParentId { get; set; }

    public int? StaffId { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
    public virtual Staff? Staff { get; set; }
    public virtual ICollection<RequestResult> RequestResults { get; set; } = new List<RequestResult>();
}
