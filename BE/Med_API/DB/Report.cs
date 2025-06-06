using System;
using System.Collections.Generic;

namespace DB;

public partial class Report
{
    public int ReportId { get; set; }

    public string ReportType { get; set; } = null!;

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
    public virtual Staff? GeneratedByStaff { get; set; }
    public virtual DashboardSummary? BasedOnDashboard { get; set; }
}
