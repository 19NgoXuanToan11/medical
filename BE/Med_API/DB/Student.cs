using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DB;

public partial class Student
{
    public int StudentId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    [StringLength(10)]
    public string? Gender { get; set; }

    public int GradeLevel { get; set; }

    [StringLength(50)]
    public string? ClassName { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [Required]
    [StringLength(255)]
    public string Password { get; set; } = null!;

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
