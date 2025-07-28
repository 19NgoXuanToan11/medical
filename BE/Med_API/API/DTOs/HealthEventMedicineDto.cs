using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class HealthEventMedicineDto
{
    public class ViewModel
    {
        public int HealthEventMedicineId { get; set; }
        public int HealthEventId { get; set; }
        public int MedicineId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string? Dosage { get; set; }
        public string? Time { get; set; }
    }

    public class Create
    {
        [Required]
        public int MedicineId { get; set; }
        
        [StringLength(100)]
        public string? MedicineName { get; set; }
        
        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(50)]
        public string? Time { get; set; }
    }

    public class Update
    {
        public int HealthEventMedicineId { get; set; }

        public int? MedicineId { get; set; }

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(50)]
        public string? Time { get; set; }
    }
} 