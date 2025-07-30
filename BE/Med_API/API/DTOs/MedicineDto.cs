using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class MedicineDto
{
    public class ViewModel
    {
        public int MedicineId { get; set; }
        public string Name { get; set; } = null!;
        public decimal? StockQuantity { get; set; }
        public bool? IsActive { get; set; }

        // Vaccine-specific fields
        public string? Type { get; set; } // e.g., "Medicine", "Vaccine"
        public string? BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Manufacturer { get; set; }
        public string? Dose { get; set; } // e.g., "0.5ml"
        public string? AdministrationMethod { get; set; } // e.g., "IM", "SC"
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; } = 0;

        public bool? IsActive { get; set; } = true;

        // Vaccine-specific fields
        [StringLength(50)]
        public string? Type { get; set; }

        [StringLength(100)]
        public string? BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }

        [StringLength(100)]
        public string? Manufacturer { get; set; }

        [StringLength(50)]
        public string? Dose { get; set; }

        [StringLength(50)]
        public string? AdministrationMethod { get; set; }
    }

    public class Update
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; }

        public bool? IsActive { get; set; }

        // Vaccine-specific fields
        [StringLength(50)]
        public string? Type { get; set; }

        [StringLength(100)]
        public string? BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }

        [StringLength(100)]
        public string? Manufacturer { get; set; }

        [StringLength(50)]
        public string? Dose { get; set; }

        [StringLength(50)]
        public string? AdministrationMethod { get; set; }
    }
}
