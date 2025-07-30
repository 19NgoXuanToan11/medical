using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class HealthCheckItemDto
{
    public class ViewModel
    {
        public int ItemId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string? Description { get; set; }
        public int EstimatedTimeMinutes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public List<MedicalSupplyRequirement> RequiredMedicalSupplies { get; set; } = new();
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = null!;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Estimated time must be at least 1 minute")]
        public int EstimatedTimeMinutes { get; set; } = 10;

        public bool IsActive { get; set; } = true;

        public List<MedicalSupplyRequirementCreate> RequiredMedicalSupplies { get; set; } = new();
    }

    public class Update
    {
        [StringLength(50)]
        public string? Code { get; set; }

        [StringLength(200)]
        public string? Name { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Estimated time must be at least 1 minute")]
        public int? EstimatedTimeMinutes { get; set; }

        public bool? IsActive { get; set; }

        public List<MedicalSupplyRequirementCreate>? RequiredMedicalSupplies { get; set; }
    }

    public class MedicalSupplyRequirement
    {
        public int Id { get; set; }
        public int HealthCheckItemId { get; set; }
        public int MedicalSupplyId { get; set; }
        public string MedicalSupplyName { get; set; } = null!;
        public string MedicalSupplyCategory { get; set; } = null!;
        public decimal? StockQuantity { get; set; }
        public bool IsActive { get; set; }
        public decimal QuantityRequired { get; set; }
        public bool IsOptional { get; set; }
        public string? Notes { get; set; }
    }

    public class MedicalSupplyRequirementCreate
    {
        [Required]
        public int MedicalSupplyId { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public decimal QuantityRequired { get; set; } = 1m;

        public bool IsOptional { get; set; } = false;

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class ListViewModel
    {
        public int ItemId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public int EstimatedTimeMinutes { get; set; }
        public bool IsActive { get; set; }
        public int RequiredSuppliesCount { get; set; }
    }
}
