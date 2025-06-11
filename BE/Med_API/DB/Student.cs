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

    // Thông tin đăng nhập
    public string? Username { get; set; }
    public string? PasswordHash { get; set; }
    public string? Email { get; set; }
    public DateTime? LastLogin { get; set; }

    public virtual ICollection<HealthEvent> HealthEvents { get; set; } = new List<HealthEvent>();

    public virtual ICollection<HealthProfile> HealthProfiles { get; set; } = new List<HealthProfile>();

    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();

    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } = new List<MedicineRequest>();

    public virtual ICollection<InjectionForm> InjectionForms { get; set; } = new List<InjectionForm>();

    public virtual ICollection<InjectionResult> InjectionResults { get; set; } = new List<InjectionResult>();
}
