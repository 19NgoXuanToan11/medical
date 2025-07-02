using System;
using System.Collections.Generic;

namespace DB;

public partial class Medicine
{
    public int MedicineId { get; set; }

    public string Name { get; set; } = null!;

    public decimal? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public string? Type { get; set; } // e.g., "Medicine", "Vaccine"
    public string? BatchNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Manufacturer { get; set; }
    public string? Dose { get; set; } // e.g., "0.5ml"
    public string? AdministrationMethod { get; set; } // e.g., "IM", "SC"
}
