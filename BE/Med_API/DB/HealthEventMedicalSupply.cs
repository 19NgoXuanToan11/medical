using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthEventMedicalSupply
{
    public int HealthEventMedicalSupplyId { get; set; }
    public int HealthEventId { get; set; }
    public int MedicalSupplyId { get; set; }
    public decimal? Quantity { get; set; }
    public string? Time { get; set; }

    public virtual HealthEvent HealthEvent { get; set; } = null!;
    public virtual MedicalSupply MedicalSupply { get; set; } = null!;
} 