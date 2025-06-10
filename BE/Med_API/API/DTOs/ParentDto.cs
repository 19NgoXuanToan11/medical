using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class ParentDto
{
    public class ViewModel
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
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string LastName { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Relationship { get; set; } = null!;

        [Required]
        [StringLength(20)]
        [Phone]
        public string Phone { get; set; } = null!;

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Occupation { get; set; }

        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class Update
    {
        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        public string? FirstName { get; set; }

        [StringLength(50)]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        public string? LastName { get; set; }

        [StringLength(20)]
        public string? Relationship { get; set; }

        [StringLength(20)]
        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Occupation { get; set; }

        public bool? IsEmergencyContact { get; set; }
        public bool? IsMainContact { get; set; }
        public bool? IsActive { get; set; }
    }
} 