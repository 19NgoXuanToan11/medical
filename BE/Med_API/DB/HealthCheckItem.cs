using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthCheckItem
{
    public int ItemId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string? Description { get; set; }

    public int EstimatedTimeMinutes { get; set; } = 10;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual ICollection<HealthCheckItemMedicalSupply> HealthCheckItemMedicalSupplies { get; set; } = new List<HealthCheckItemMedicalSupply>();
} 