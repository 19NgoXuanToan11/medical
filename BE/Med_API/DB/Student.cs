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

    // Class relationship
    public int? ClassId { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [Required]
    [StringLength(255)]
    public string Password { get; set; } = null!;

    public bool? IsActive { get; set; }

    // Navigation properties
    public virtual Class? Class { get; set; }

    public virtual ICollection<HealthEvent> HealthEvents { get; set; } = new List<HealthEvent>();

    public virtual ICollection<HealthProfile> HealthProfiles { get; set; } = new List<HealthProfile>();

    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();

    public virtual ICollection<Parent> Parents { get; set; } = new List<Parent>();

    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } = new List<MedicineRequest>();

    public virtual ICollection<InjectionForm> InjectionForms { get; set; } = new List<InjectionForm>();

    public virtual ICollection<InjectionResult> InjectionResults { get; set; } = new List<InjectionResult>();
}
