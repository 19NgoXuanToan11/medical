using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace API.DTOs;

public static class StaffDto
{
    [SwaggerSchema(Description = "Staff view model for API responses")]
    public class ViewModel
    {
        public int StaffId { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = null!;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = null!;

        [StringLength(20)]
        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int RoleId { get; set; }

        // Navigation properties
        public string RoleName { get; set; } = null!;
        public int StudentCount { get; set; }
        public int HealthEventCount { get; set; }
        public int ParentCount { get; set; }
        public int MedicineRequestCount { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores")]
        public string Username { get; set; } = null!;

        [Required]
        [StringLength(100)]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; } = null!;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string LastName { get; set; } = null!;

        [StringLength(20)]
        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int RoleId { get; set; }
    }

    public class Update
    {
        [Required]
        public int StaffId { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores")]
        public string? Username { get; set; }

        [StringLength(100)]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string? Password { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string? FirstName { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string? LastName { get; set; }

        [StringLength(20)]
        [Phone]
        public string? Phone { get; set; }

        public int? RoleId { get; set; }
    }

    public class GradeNurseViewModel
    {
        public int GradeNurseId { get; set; }
        public int StaffId { get; set; }
        public int Grade { get; set; }
        public StaffDto.ViewModel? Nurse { get; set; }
    }

    public class GradeNurseCreate
    {
        public int StaffId { get; set; }
        public int Grade { get; set; }
    }
} 