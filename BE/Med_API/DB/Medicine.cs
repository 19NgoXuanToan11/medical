using System;
using System.Collections.Generic;

namespace DB;

public partial class Medicine
{
    public int MedicineId { get; set; }

    public string Name { get; set; } = null!;

    public decimal? StockQuantity { get; set; }

    public bool? IsActive { get; set; }
}
