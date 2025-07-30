using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class VaccineDto
{
    public class ViewModel
    {
        public int VaccineId { get; set; }
        public string Name { get; set; } = null!;
        public string? Manufacturer { get; set; }
        public string? BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Dose { get; set; }
        public string? AdministrationMethod { get; set; }
        public string? Description { get; set; }
        public string? DiseaseType { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [StringLength(100)]
        public string? Manufacturer { get; set; }

        [StringLength(100)]
        public string? BatchNumber { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(50)]
        public string? Dose { get; set; }

        [StringLength(50)]
        public string? AdministrationMethod { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? DiseaseType { get; set; }

        public bool? IsActive { get; set; } = true;
    }

    public class Update
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(100)]
        public string? Manufacturer { get; set; }

        [StringLength(100)]
        public string? BatchNumber { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(50)]
        public string? Dose { get; set; }

        [StringLength(50)]
        public string? AdministrationMethod { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? DiseaseType { get; set; }

        public bool? IsActive { get; set; }
    }
}
