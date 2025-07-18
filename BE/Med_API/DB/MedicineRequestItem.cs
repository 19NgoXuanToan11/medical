using System;
using System.Collections.Generic;

namespace DB;

public partial class MedicineRequestItem
{
    public int MedicineRequestItemId { get; set; }

    public int MedicineRequestId { get; set; }

    public string MedicineName { get; set; } = null!;

    public string Dosage { get; set; } = null!;

    public string? DosageUnit { get; set; }

    public string Frequency { get; set; } = null!;

    public string? TimeOfDay { get; set; }

    public string? Instructions { get; set; }

    // Navigation property
    public virtual MedicineRequest MedicineRequest { get; set; } = null!;
} 