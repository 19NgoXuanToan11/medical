using System.ComponentModel.DataAnnotations;
using API.DTOs;
using DB;

namespace API.DTOs;

public static class HealthEventDto
{
    public class ViewModel
    {
        public int EventId { get; set; }
        public string StudentCode { get; set; } = null!;
        public int StaffId { get; set; }
        public DateTime EventDate { get; set; }
        public string EventType { get; set; } = null!;
        public string? Severity { get; set; }
        public string? Symptoms { get; set; }
        public string? Assessment { get; set; }
        public string? Treatment { get; set; }
        public bool? ParentNotified { get; set; }
        public bool? FollowUpRequired { get; set; }
        public string? Notes { get; set; }
        public string? InsufficientItems { get; set; }
        public string? InsufficientItemsNote { get; set; }

        // Navigation properties
        public StudentDto.ViewModel? Student { get; set; }
        public StaffDto.ViewModel? Staff { get; set; }
        public ICollection<HealthEventMedicineDto.ViewModel> HealthEventMedicines { get; set; } = new List<HealthEventMedicineDto.ViewModel>();
        public ICollection<HealthEventMedicalSupplyDto.ViewModel> HealthEventMedicalSupplies { get; set; } = new List<HealthEventMedicalSupplyDto.ViewModel>();
        public ICollection<Service.DTOs.HealthEventFollowUpDto.ViewModel> HealthEventFollowUps { get; set; } = new List<Service.DTOs.HealthEventFollowUpDto.ViewModel>();
    }

    public class Create
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [Required]
        public int StaffId { get; set; }

        [Required]
        [StringLength(50)]
        public string EventType { get; set; } = null!;

        [StringLength(20)]
        public string? Severity { get; set; } = "moderate";

        [StringLength(500)]
        public string? Symptoms { get; set; }

        [StringLength(1000)]
        public string? Assessment { get; set; }

        [StringLength(1000)]
        public string? Treatment { get; set; }

        public bool? ParentNotified { get; set; }

        public bool? FollowUpRequired { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(2000)]
        public string? InsufficientItems { get; set; }

        [StringLength(1000)]
        public string? InsufficientItemsNote { get; set; }

        public ICollection<HealthEventMedicineDto.Create> HealthEventMedicines { get; set; } = new List<HealthEventMedicineDto.Create>();
        public ICollection<HealthEventMedicalSupplyDto.Create> HealthEventMedicalSupplies { get; set; } = new List<HealthEventMedicalSupplyDto.Create>();
    }

    public class Update
    {
        public int EventId { get; set; }

        [Required]
        public string StudentCode { get; set; } = null!;

        [Required]
        public int StaffId { get; set; }

        [Required]
        [StringLength(50)]
        public string EventType { get; set; } = null!;

        [StringLength(20)]
        public string? Severity { get; set; }

        [StringLength(500)]
        public string? Symptoms { get; set; }

        [StringLength(1000)]
        public string? Assessment { get; set; }

        [StringLength(1000)]
        public string? Treatment { get; set; }

        public bool? ParentNotified { get; set; }

        public bool? FollowUpRequired { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(2000)]
        public string? InsufficientItems { get; set; }

        [StringLength(1000)]
        public string? InsufficientItemsNote { get; set; }

        public ICollection<HealthEventMedicineDto.Update>? HealthEventMedicines { get; set; }
        public ICollection<HealthEventMedicalSupplyDto.Update>? HealthEventMedicalSupplies { get; set; }
    }

    /// <summary>
    /// Result of batch health event creation
    /// Kết quả tạo sự cố y tế hàng loạt
    /// </summary>
    public class BatchResult
    {
        public int SuccessfulCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> FailedDetails { get; set; } = new List<string>();
        public List<HealthEvent> CreatedEvents { get; set; } = new List<HealthEvent>();
    }
} 