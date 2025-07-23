using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class HealthCheckFormDTO
{
    public int FormId { get; set; }

    // Basic Information
    [StringLength(200)]
    public string? Title { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public string? StartTime { get; set; } // Accepts "HH:mm:ss" format from frontend
    public int? EstimatedDuration { get; set; } // in minutes
    [StringLength(500)]
    public string? Description { get; set; }
    [StringLength(200)]
    public string? Location { get; set; }

    // Student and Parent Information
    public int? StudentId { get; set; }
    public int? ParentId { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? CreatedBy { get; set; } // Staff ID who created this schedule

    // Consent and Confirmation
    [StringLength(20)]
    public string? ConsentStatus { get; set; }
    public DateTime? ConsentDate { get; set; }
    [StringLength(20)]
    public string? ConfirmStatus { get; set; }
    public int? ConfirmedBy { get; set; }
    public DateTime? ConfirmedDate { get; set; }

    // Grade and Class Information
    [StringLength(50)]
    public string? ClassName { get; set; }
    public string? GradeIds { get; set; } // JSON array of grade IDs
    public int? TotalStudents { get; set; }

    // Settings
    public bool? NotifyParents { get; set; } = true;
    public bool? AutoAdvance { get; set; } = true;
    public bool? SaveResults { get; set; } = true;
    public bool? GenerateReport { get; set; } = true;
    public bool? RequireParentConfirmation { get; set; } = true;

    // Station Information
    public string? SelectedStations { get; set; } // JSON array of station assignments
    public string? StaffAssigned { get; set; } // JSON array of staff assignments

    // Status and Timing
    public string? Status { get; set; } = "pending"; // pending, approved, scheduled, active, completed, cancelled
    public string? EstimatedEndTime { get; set; }

    // Navigation properties
    public StudentDto.ViewModel? Student { get; set; }
    public ParentDto.ViewModel? Parent { get; set; }
    public StaffDto.ViewModel? ConfirmedByStaff { get; set; }
    public ICollection<HealthCheckResultDTO>? Results { get; set; }

    public List<string>? Grades { get; set; } // Mảng lớp cho FE
} 