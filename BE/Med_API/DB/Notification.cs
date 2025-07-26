using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DB;

public partial class Notification
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NotificationId { get; set; }

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = null!; // health_event, medication, vaccination, etc.

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = null!;

    // Target recipient information
    public int? ParentId { get; set; }
    
    [StringLength(20)]
    public string? StudentCode { get; set; }

    // Source information
    public int? StaffId { get; set; }
    
    public int? HealthEventId { get; set; }

    // Status and priority
    [StringLength(20)]
    public string Status { get; set; } = "sent"; // sent, read, deleted

    [StringLength(20)]
    public string Priority { get; set; } = "medium"; // low, medium, high, urgent

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ReadAt { get; set; }

    // Additional data (JSON string for flexible data storage)
    [StringLength(2000)]
    public string? AdditionalData { get; set; }

    // Navigation properties
    public virtual Parent? Parent { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Staff? Staff { get; set; }
    public virtual HealthEvent? HealthEvent { get; set; }
} 