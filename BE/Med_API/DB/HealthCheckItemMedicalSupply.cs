using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthCheckItemMedicalSupply
{
    public int Id { get; set; }

    public int HealthCheckItemId { get; set; }

    public int MedicalSupplyId { get; set; }

    public decimal QuantityRequired { get; set; } = 1m;

    public bool IsOptional { get; set; } = false;

    public string? Notes { get; set; }

    public virtual HealthCheckItem HealthCheckItem { get; set; } = null!;

    public virtual MedicalSupply MedicalSupply { get; set; } = null!;
}
