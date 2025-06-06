using System;
using System.Collections.Generic;

namespace DB;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    // Navigation property
    public virtual ICollection<Staff> Staff { get; set; } = new List<Staff>();
}
