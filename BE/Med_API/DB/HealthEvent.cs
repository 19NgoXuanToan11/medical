using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthEvent
{
    public int EventId { get; set; }

    public int? StudentId { get; set; }

    public int? StaffId { get; set; }

    public DateTime EventDate { get; set; }

    public string EventType { get; set; } = null!;

    public string? Symptoms { get; set; }

    public string? Assessment { get; set; }

    public string? Treatment { get; set; }

    public bool? ParentNotified { get; set; }

    public bool? FollowUpRequired { get; set; }

    public string? Notes { get; set; }

    public string? MedicinesUsed { get; set; }

    public string? SuppliesUsed { get; set; }

    public virtual Staff? Staff { get; set; }

    public virtual Student? Student { get; set; }
}
