using System;
using System.Collections.Generic;

namespace DB;

public partial class Student
{
    public int StudentId { get; set; }

    public string StudentCode { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public string? ClassName { get; set; }

    public int GradeLevel { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<HealthEvent> HealthEvents { get; set; } = new List<HealthEvent>();

    public virtual ICollection<HealthProfile> HealthProfiles { get; set; } = new List<HealthProfile>();

    public virtual ICollection<Parent> Parents { get; set; } = new List<Parent>();

    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } = new List<MedicineRequest>();

    public virtual ICollection<InjectionForm> InjectionForms { get; set; } = new List<InjectionForm>();

    public virtual ICollection<InjectionResult> InjectionResults { get; set; } = new List<InjectionResult>();
}
