using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class NotificationDto
{
    public class ViewModel
    {
        public int NotificationId { get; set; }
        public string Type { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public int? ParentId { get; set; }
        public string? StudentCode { get; set; }
        public int? StaffId { get; set; }
        public int? HealthEventId { get; set; }
        public string Status { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public string? AdditionalData { get; set; }

        // Navigation properties
        public string? StudentName { get; set; }
        public string? StaffName { get; set; }
        public string? ClassName { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [StringLength(1000)]
        public string Message { get; set; } = null!;

        public int? ParentId { get; set; }

        [StringLength(20)]
        public string? StudentCode { get; set; }

        public int? StaffId { get; set; }

        public int? HealthEventId { get; set; }

        [StringLength(20)]
        public string Priority { get; set; } = "medium";

        [StringLength(2000)]
        public string? AdditionalData { get; set; }
    }

    public class Update
    {
        [Required]
        public int NotificationId { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }

        public bool? IsRead { get; set; }

        public DateTime? ReadAt { get; set; }
    }
} 