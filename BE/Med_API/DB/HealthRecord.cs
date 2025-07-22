using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DB;

public partial class HealthRecord
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecordId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = null!;

    public int? HealthEventId { get; set; } // Liên kết với HealthEvent gốc

    [Required]
    [StringLength(100)]
    public string Title { get; set; } = null!; // Tiêu đề sự cố

    [Required]
    [StringLength(50)]
    public string EventType { get; set; } = null!; // Loại sự cố

    [Required]
    [StringLength(20)]
    public string Severity { get; set; } = null!; // Mức độ nghiêm trọng

    [StringLength(1000)]
    public string? Description { get; set; } // Mô tả chi tiết

    [StringLength(1000)]
    public string? Treatment { get; set; } // Điều trị

    [StringLength(1000)]
    public string? Outcome { get; set; } // Kết quả

    public DateTime EventDate { get; set; } // Ngày xảy ra sự cố

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; } // Staff ID

    public int? UpdatedBy { get; set; } // Staff ID

    [StringLength(500)]
    public string? Notes { get; set; } // Ghi chú thêm

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual HealthEvent? HealthEvent { get; set; }
    public virtual Staff? CreatedByStaff { get; set; }
    public virtual Staff? UpdatedByStaff { get; set; }
} 