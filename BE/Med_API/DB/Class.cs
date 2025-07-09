using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DB;

public partial class Class
{
    public int ClassId { get; set; }

    [Required]
    [StringLength(50)]
    public string ClassName { get; set; } = null!;

    public int GradeLevel { get; set; }

    [StringLength(10)]
    public string? Section { get; set; }

    [StringLength(100)]
    public string? Description { get; set; }

    public int? MaxStudents { get; set; }

    public int? CurrentStudentCount { get; set; }

    [StringLength(50)]
    public string? ClassTeacher { get; set; }

    [StringLength(50)]
    public string? ClassRoom { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
} 