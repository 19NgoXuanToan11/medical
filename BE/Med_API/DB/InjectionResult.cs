using System;
using System.Collections.Generic;

namespace DB;

public partial class InjectionResult
{
    public int ResultId { get; set; }

    public int? FormId { get; set; }

    public int? StudentId { get; set; }

    public int? AdministeredBy { get; set; }

    public DateTime AdministeredDate { get; set; }

    public string? ImmediateReaction { get; set; }

    public bool? FollowUpRequired { get; set; }

    public string? FollowUpNotes { get; set; }

    // Navigation properties
    public virtual InjectionForm? Form { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Staff? AdministeredByStaff { get; set; }
}
