using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class DashboardSummaryDTO
{
    public int SummaryId { get; set; }

    [Required]
    public int StaffId { get; set; }

    public DateTime? GeneratedDate { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalInjectionParticipants { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalInjectionNonParticipants { get; set; }

    [Range(0, 100)]
    public decimal? InjectionParticipationRate { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalHealthCheckParticipants { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalHealthCheckNonParticipants { get; set; }

    [Range(0, 100)]
    public decimal? HealthCheckParticipationRate { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalHealthEvents { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalMedicineRequests { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalAppointments { get; set; }

    [Range(0, int.MaxValue)]
    public int? ScheduledAppointments { get; set; }

    [Range(0, int.MaxValue)]
    public int? CompletedAppointments { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalMedicineItems { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalSupplyItems { get; set; }

    public int? InjectionFormId { get; set; }
    public int? HealthCheckFormId { get; set; }
    public int? HealthEventId { get; set; }
    public int? MedicineRequestId { get; set; }
    public int? AppointmentId { get; set; }
    public int? MedicineId { get; set; }
    public int? SupplyId { get; set; }

    // Navigation property
    public StaffDto.ViewModel? Staff { get; set; }
}
