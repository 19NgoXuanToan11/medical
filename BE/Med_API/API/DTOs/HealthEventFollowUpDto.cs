using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class HealthEventFollowUpDto
{
    public class Create
    {
        [Required]
        public int EventId { get; set; }

        public int StaffId { get; set; }

        [Required]
        [StringLength(100)]
        public string Status { get; set; } = null!;

        [StringLength(500)]
        public string? Note { get; set; }
    }

    public class Update
    {
        [Required]
        public int FollowUpId { get; set; }

        [Required]
        [StringLength(100)]
        public string Status { get; set; } = null!;

        [StringLength(500)]
        public string? Note { get; set; }
    }

    public class ViewModel
    {
        public int FollowUpId { get; set; }
        public int EventId { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public DateTime Timestamp { get; set; }
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
    }
} 