using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DB;

public partial class Parent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    public int ParentId { get; set; }

    // [Required]
    // [StringLength(20)]
    // public string StudentCode { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = null!;

    [Required]
    [StringLength(20)]
    public string Relationship { get; set; } = null!;

    [Required]
    [StringLength(20)]
    public string Phone { get; set; } = null!;

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? Occupation { get; set; }

    [Required]
    [StringLength(255)]
    public string Password { get; set; } = null!;

    public bool? IsEmergencyContact { get; set; }

    public bool? IsMainContact { get; set; }

    public bool? IsActive { get; set; }

    // public virtual Student Student { get; set; } = null!;

    public virtual ICollection<StudentParent> StudentParents { get; set; } =
        new List<StudentParent>();

    // Navigation to Students through StudentParent
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } =
        new List<MedicineRequest>();

    public virtual ICollection<InjectionForm> InjectionForms { get; set; } =
        new List<InjectionForm>();
}
