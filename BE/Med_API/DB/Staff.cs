using System;
using System.Collections.Generic;

namespace DB;

public partial class Staff
{
    public int StaffId { get; set; }

    public int? RoleId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsActiveForRequest { get; set; } = true;

    // Navigation properties
    public virtual Role? Role { get; set; }
    public virtual ICollection<HealthEvent> HealthEvents { get; set; } = new List<HealthEvent>();
    public virtual ICollection<MedicineRequest> MedicineRequests { get; set; } =
        new List<MedicineRequest>();
    public virtual ICollection<RequestResult> AdministeredRequestResults { get; set; } =
        new List<RequestResult>();
    public virtual ICollection<RequestResult> ActionedRequestResults { get; set; } =
        new List<RequestResult>();
    public virtual ICollection<GradeNurse> GradeNurses { get; set; } = new List<GradeNurse>();
}
