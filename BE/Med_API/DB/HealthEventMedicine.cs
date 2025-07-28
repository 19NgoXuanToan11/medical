using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthEventMedicine
{
    public int HealthEventMedicineId { get; set; }
    public int HealthEventId { get; set; }
    public int MedicineId { get; set; }
    public string? MedicineName { get; set; }
    public string? Dosage { get; set; }
    public string? Time { get; set; }

    public virtual HealthEvent HealthEvent { get; set; } = null!;
    public virtual Medicine Medicine { get; set; } = null!;
} 