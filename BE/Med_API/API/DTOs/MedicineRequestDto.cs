using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class MedicineRequestDto
{
    public class ViewModel
    {
        public int RequestId { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } = null!;
        public string StudentCode { get; set; } = null!;
        public string? ClassName { get; set; }
        public int ParentId { get; set; }
        public int? StaffId { get; set; }
        public DateOnly Date { get; set; }
        public StudentDto.ViewModel? Student { get; set; }
        public ParentDto.ViewModel? Parent { get; set; }
        public StaffDto.ViewModel? Staff { get; set; }
        public ICollection<MedicineRequestItemDto.ViewModel> MedicineRequestItems { get; set; } = new List<MedicineRequestItemDto.ViewModel>();
    }

    public class Create
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [StringLength(50)]
        public string? ClassName { get; set; }

        [Required]
        public int ParentId { get; set; }

        public string? Status { get; set; }

        public DateOnly Date { get; set; }

        public ICollection<MedicineRequestItemDto.Create> MedicineRequestItems { get; set; } = new List<MedicineRequestItemDto.Create>();
    }

    public class Update
    {
        [StringLength(20)]
        public string? Status { get; set; }

        [StringLength(50)]
        public string? ClassName { get; set; }

        public DateOnly? Date { get; set; }

        public ICollection<MedicineRequestItemDto.Update>? MedicineRequestItems { get; set; }
    }
}

public static class MedicineRequestItemDto
{
    public class ViewModel
    {
        public int MedicineRequestItemId { get; set; }
        public int MedicineRequestId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string? TimeOfDay { get; set; }
        public string? Instructions { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string MedicineName { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Dosage { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Frequency { get; set; } = null!;

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }
    }

    public class Update
    {
        public int MedicineRequestItemId { get; set; }

        [StringLength(100)]
        public string? MedicineName { get; set; }

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(100)]
        public string? Frequency { get; set; }

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }
    }
} 