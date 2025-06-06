using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class HealthCheckResultDTO
{
    public int ResultId { get; set; }

    [Required]
    public int FormId { get; set; }

    [Required]
    public int StudentId { get; set; }

    public int? ExaminedBy { get; set; }

    public DateTime ExaminedDate { get; set; }

    [Range(0, 300)]
    public decimal? Height { get; set; }

    [Range(0, 500)]
    public decimal? Weight { get; set; }

    [StringLength(20)]
    public string? VisionRight { get; set; }

    [StringLength(20)]
    public string? VisionLeft { get; set; }

    [StringLength(50)]
    public string? HearingStatus { get; set; }

    [StringLength(20)]
    public string? BloodPressure { get; set; }

    [Range(0, 250)]
    public int? HeartRate { get; set; }

    [StringLength(1000)]
    public string? GeneralFindings { get; set; }

    [StringLength(1000)]
    public string? Recommendations { get; set; }

    // Navigation properties
    public HealthCheckFormDTO? Form { get; set; }
    public StudentDto.ViewModel? Student { get; set; }
    public StaffDto.ViewModel? ExaminedByStaff { get; set; }
}