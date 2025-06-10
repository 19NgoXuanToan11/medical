using System;
using System.Collections.Generic;

namespace DB;

public partial class Parent
{
    public int ParentId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Relationship { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Occupation { get; set; }

    public bool? IsEmergencyContact { get; set; }

    public bool? IsMainContact { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();

    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } = new List<MedicineRequest>();

    public virtual ICollection<InjectionForm> InjectionForms { get; set; } = new List<InjectionForm>();
}
