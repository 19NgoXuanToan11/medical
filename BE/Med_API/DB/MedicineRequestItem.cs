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

    public string? Period { get; set; } // Optional: for UI display only, not used for backend logic
    public string VerificationStatus { get; set; } = "Pending"; // 'Pending', 'Verified', 'Refused'

    // Navigation property
    public virtual MedicineRequest MedicineRequest { get; set; } = null!;
} 