using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class ReportDTO
{
    public int ReportId { get; set; }

    [Required]
    [StringLength(50)]
    public string ReportType { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string ReportName { get; set; } = null!;

    public DateTime? GeneratedDate { get; set; }

    public DateOnly? DateRangeStart { get; set; }

    public DateOnly? DateRangeEnd { get; set; }

    public string? InjectionData { get; set; }

    public string? HealthCheckData { get; set; }

    public string? HealthEventData { get; set; }

    public string? InventoryData { get; set; }

    public string? NonParticipantData { get; set; }

    public string? AppointmentData { get; set; }

    public int? GeneratedBy { get; set; }

    public int? BasedOnDashboardId { get; set; }

    // Navigation properties
    public StaffDto.ViewModel? GeneratedByStaff { get; set; }
    public DashboardSummaryDTO? BasedOnDashboard { get; set; }
} 