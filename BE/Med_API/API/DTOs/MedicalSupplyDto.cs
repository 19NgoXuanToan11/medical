using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class MedicalSupplyDto
{
    public class ViewModel
    {
        public int SupplyId { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string? Description { get; set; }
        public decimal? StockQuantity { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = null!;

        [StringLength(255)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; } = 0;

        public bool? IsActive { get; set; } = true;
    }

    public class Update
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(255)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; }

        public bool? IsActive { get; set; }
    }
} 