using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class InjectionFormDTO
{
    public int FormId { get; set; }

    [Required]
    public int StudentId { get; set; }

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

    // Thêm trường vaccine
    public int? VaccineId { get; set; }
    public VaccineDto.ViewModel? Vaccine { get; set; }

    // Navigation properties
    public StudentDto.ViewModel? Student { get; set; }
    public ParentDto.ViewModel? Parent { get; set; }
} 