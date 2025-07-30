using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DB;

public partial class StudentParent
{
    public int StudentParentId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = null!;

    public int ParentId { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Parent Parent { get; set; } = null!;
}
