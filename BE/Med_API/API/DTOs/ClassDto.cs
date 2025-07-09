using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ClassDto
{
    public class ViewModel
    {
        public int ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public int GradeLevel { get; set; }
        public string? Section { get; set; }
        public string? Description { get; set; }
        public int? MaxStudents { get; set; }
        public int? CurrentStudentCount { get; set; }
        public string? ClassTeacher { get; set; }
        public string? ClassRoom { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Student information with parent details
        public List<StudentWithParents> Students { get; set; } = new List<StudentWithParents>();
    }

    public class StudentWithParents
    {
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public DateOnly DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public bool? IsActive { get; set; }

        public List<ParentInfo> Parents { get; set; } = new List<ParentInfo>();
    }

    public class ParentInfo
    {
        public int ParentId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Relationship { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsEmergencyContact { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;

        [Required]
        [Range(1, 12)]
        public int GradeLevel { get; set; }

        [StringLength(10)]
        public string? Section { get; set; }

        [StringLength(100)]
        public string? Description { get; set; }

        [Range(1, 50)]
        public int? MaxStudents { get; set; }

        [StringLength(50)]
        public string? ClassTeacher { get; set; }

        [StringLength(50)]
        public string? ClassRoom { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class Update
    {
        [Required]
        public int ClassId { get; set; }

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;

        [Required]
        [Range(1, 12)]
        public int GradeLevel { get; set; }

        [StringLength(10)]
        public string? Section { get; set; }

        [StringLength(100)]
        public string? Description { get; set; }

        [Range(1, 50)]
        public int? MaxStudents { get; set; }

        [StringLength(50)]
        public string? ClassTeacher { get; set; }

        [StringLength(50)]
        public string? ClassRoom { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class AssignStudent
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ClassId { get; set; }
    }
} 