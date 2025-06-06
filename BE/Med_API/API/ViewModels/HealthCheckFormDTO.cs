using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class HealthCheckFormDTO
{
    public int FormId { get; set; }

    [Required]
    public int StudentId { get; set; }

    public int? ParentId { get; set; }

    public DateTime? CreatedDate { get; set; }

    [StringLength(20)]
    public string? ConsentStatus { get; set; }

    public DateTime? ConsentDate { get; set; }

    [StringLength(50)]
    public string? ClassName { get; set; }

    [StringLength(20)]
    public string? ConfirmStatus { get; set; }

    public int? ConfirmedBy { get; set; }

    public DateTime? ConfirmedDate { get; set; }

    // Navigation properties
    public StudentDto.ViewModel? Student { get; set; }
    public ParentDto.ViewModel? Parent { get; set; }
    public StaffDto.ViewModel? ConfirmedByStaff { get; set; }
    public ICollection<HealthCheckResultDTO>? Results { get; set; }
} 