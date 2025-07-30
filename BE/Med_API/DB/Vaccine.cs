using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DB;

public partial class Vaccine
{
    public int VaccineId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string? Manufacturer { get; set; }

    [StringLength(100)]
    public string? BatchNumber { get; set; }

    public DateTime? ExpiryDate { get; set; }

    [StringLength(50)]
    public string? Dose { get; set; } // e.g., "0.5ml"

    [StringLength(50)]
    public string? AdministrationMethod { get; set; } // e.g., "IM", "SC"

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(200)]
    public string? DiseaseType { get; set; } // Loại bệnh mà vaccine phòng ngừa

    public bool? IsActive { get; set; } = true;
} 