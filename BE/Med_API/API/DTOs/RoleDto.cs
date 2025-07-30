using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace API.DTOs;

public static class RoleDto
{
    [SwaggerSchema(Description = "Role view model for API responses")]
    public class ViewModel
    {
        public int RoleId { get; set; }

        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } = null!;

        // Navigation properties
        public int StaffCount { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "Role name can only contain letters and spaces"
        )]
        public string RoleName { get; set; } = null!;
    }

    public class Update
    {
        [Required]
        public int RoleId { get; set; }

        [StringLength(50)]
        [RegularExpression(
            @"^[A-Za-z\s]+$",
            ErrorMessage = "Role name can only contain letters and spaces"
        )]
        public string? RoleName { get; set; }
    }
}
