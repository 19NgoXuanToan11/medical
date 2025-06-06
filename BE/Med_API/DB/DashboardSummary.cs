using System;
using System.Collections.Generic;

namespace DB;

public partial class DashboardSummary
{
    public int SummaryId { get; set; }

    public int? StaffId { get; set; }

    public DateTime? GeneratedDate { get; set; }

    public int? TotalInjectionParticipants { get; set; }

    public int? TotalInjectionNonParticipants { get; set; }

    public decimal? InjectionParticipationRate { get; set; }

    public int? TotalHealthCheckParticipants { get; set; }

    public int? TotalHealthCheckNonParticipants { get; set; }

    public decimal? HealthCheckParticipationRate { get; set; }

    public int? TotalHealthEvents { get; set; }

    public int? TotalMedicineRequests { get; set; }

    public int? TotalAppointments { get; set; }

    public int? ScheduledAppointments { get; set; }

    public int? CompletedAppointments { get; set; }

    public int? TotalMedicineItems { get; set; }

    public int? TotalSupplyItems { get; set; }

    public int? InjectionFormId { get; set; }

    public int? HealthCheckFormId { get; set; }

    public int? HealthEventId { get; set; }

    public int? MedicineRequestId { get; set; }

    public int? AppointmentId { get; set; }

    public int? MedicineId { get; set; }

    public int? SupplyId { get; set; }

    // Navigation property
    public virtual Staff? Staff { get; set; } = null!;
}
