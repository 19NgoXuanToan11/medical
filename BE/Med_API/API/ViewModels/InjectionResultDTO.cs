using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class InjectionResultDTO
{
    public int ResultId { get; set; }

    [Required]
    public int FormId { get; set; }

    [Required]
    public int StudentId { get; set; }

    public int? AdministeredBy { get; set; }

    public DateTime AdministeredDate { get; set; }

    [StringLength(255)]
    public string? ImmediateReaction { get; set; }

    public bool? FollowUpRequired { get; set; }

    [StringLength(255)]
    public string? FollowUpNotes { get; set; }

    // Navigation properties
    public InjectionFormDTO? Form { get; set; }
    public StudentDto.ViewModel? Student { get; set; }
    public StaffDto.ViewModel? AdministeredByStaff { get; set; }
}
