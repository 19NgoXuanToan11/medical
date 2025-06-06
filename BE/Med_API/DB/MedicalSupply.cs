using System;
using System.Collections.Generic;

namespace DB;

public partial class MedicalSupply
{
    public int SupplyId { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string? Description { get; set; }

    public decimal? StockQuantity { get; set; }

    public bool? IsActive { get; set; }
}
