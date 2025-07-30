using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class HealthEventDTO
{
    public int EventId { get; set; }

    [Required]
    public string StudentCode { get; set; } = null!;

    [Required]
    public int StaffId { get; set; }

    public DateTime EventDate { get; set; }

    [Required]
    [StringLength(50)]
    public string EventType { get; set; } = null!;

    [StringLength(500)]
    public string? Symptoms { get; set; }

    [StringLength(1000)]
    public string? Assessment { get; set; }

    [StringLength(1000)]
    public string? Treatment { get; set; }

    public bool? ParentNotified { get; set; }

    public bool? FollowUpRequired { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

    [StringLength(500)]
    public string? MedicinesUsed { get; set; }

    [StringLength(500)]
    public string? SuppliesUsed { get; set; }

    // Navigation properties
    public StudentDto.ViewModel? Student { get; set; }
    public StaffDto.ViewModel? Staff { get; set; }
}
