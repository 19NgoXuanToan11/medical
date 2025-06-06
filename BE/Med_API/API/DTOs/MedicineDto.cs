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
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; } = 0;

        public bool? IsActive { get; set; } = true;
    }

    public class Update
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public decimal? StockQuantity { get; set; }

        public bool? IsActive { get; set; }
    }
} 