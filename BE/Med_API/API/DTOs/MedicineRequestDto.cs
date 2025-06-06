using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class MedicineRequestDto
{
    public class ViewModel
    {
        public int RequestId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Instructions { get; set; }
        public string? MealRelation { get; set; }
        public string? TimeOfDay { get; set; }
        public string? MedicationImagePath { get; set; }
        public string? PrescriptionImagePath { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } = null!;
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public int StaffId { get; set; }
        public StudentDto.ViewModel? Student { get; set; }
        public ParentDto.ViewModel? Parent { get; set; }
        public StaffDto.ViewModel? Staff { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string MedicineName { get; set; } = null!;

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(100)]
        public string? Frequency { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }

        [StringLength(50)]
        public string? MealRelation { get; set; }

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(255)]
        public string? MedicationImagePath { get; set; }

        [StringLength(255)]
        public string? PrescriptionImagePath { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ParentId { get; set; }

        [Required]
        public int StaffId { get; set; }

        public string? Status { get; set; }
    }

    public class Update
    {
        [StringLength(100)]
        public string? MedicineName { get; set; }

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(100)]
        public string? Frequency { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }

        [StringLength(50)]
        public string? MealRelation { get; set; }

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(255)]
        public string? MedicationImagePath { get; set; }

        [StringLength(255)]
        public string? PrescriptionImagePath { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }
    }
} 