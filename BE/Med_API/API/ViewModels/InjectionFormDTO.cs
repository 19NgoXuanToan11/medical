using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class InjectionFormDTO
{
    public int FormId { get; set; }

    // Made optional to support vaccination schedules (where StudentId can be null)
    public int? StudentId { get; set; }

    public int? ParentId { get; set; }

    public DateTime? CreatedDate { get; set; }

    [Required]
    [StringLength(100)]
    public string InjectionName { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(20)]
    public string? ConsentStatus { get; set; }

    public DateTime? ConsentDate { get; set; }

    [StringLength(50)]
    public string? ClassName { get; set; }

    [StringLength(20)]
    public string? ConfirmStatus { get; set; }

    public DateTime? ConfirmedDate { get; set; }

    // Vaccination schedule fields (similar to HealthCheckForm)
    public DateTime? ScheduledDate { get; set; }
    public string? StartTime { get; set; }
    public int? EstimatedDuration { get; set; }
    public string? Location { get; set; }
    public string? GradeIds { get; set; } // JSON array of grade IDs
    public List<string>? Grades { get; set; } // Deserialized GradeIds for frontend
    public int? TotalStudents { get; set; }
    public bool? NotifyParents { get; set; } = true;
    public bool? RequireParentConfirmation { get; set; } = true;
    public string? Status { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; } // Ghi chú từ manager khi duyệt/từ chối

    // Thêm trường vaccine
    public int? VaccineId { get; set; }
    public VaccineDto.ViewModel? Vaccine { get; set; }

    // Navigation properties
    public StudentDto.ViewModel? Student { get; set; }
    public ParentDto.ViewModel? Parent { get; set; }

    // Thêm các trường chi tiết cho vaccination schedule
    public List<ClassDto.ViewModel>? Classes { get; set; } // Danh sách lớp
    public List<StudentDto.ViewModel>? Students { get; set; } // Danh sách học sinh
    public List<HealthProfileDto.ViewModel>? StudentHealthProfiles { get; set; } // Hồ sơ sức khỏe học sinh
}
