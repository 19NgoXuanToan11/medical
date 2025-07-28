using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class HealthEventMedicalSupplyDto
{
    public class ViewModel
    {
        public int HealthEventMedicalSupplyId { get; set; }
        public int HealthEventId { get; set; }
        public int MedicalSupplyId { get; set; }
        public string MedicalSupplyName { get; set; } = null!;
        public decimal? Quantity { get; set; }
        public string? Time { get; set; }
    }

    public class Create
    {
        [Required]
        public int MedicalSupplyId { get; set; }

        [StringLength(100)]
        public string? MedicalSupplyName { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Quantity cannot be negative")]
        public decimal? Quantity { get; set; }

        [StringLength(50)]
        public string? Time { get; set; }
    }

    public class Update
    {
        public int HealthEventMedicalSupplyId { get; set; }

        public int? MedicalSupplyId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Quantity cannot be negative")]
        public decimal? Quantity { get; set; }

        [StringLength(50)]
        public string? Time { get; set; }
    }
} 