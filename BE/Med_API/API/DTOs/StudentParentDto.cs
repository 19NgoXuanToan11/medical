using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class StudentParentDto
{
    public class Create
    {
        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = null!;

        [Required]
        public int ParentId { get; set; }
    }

    public class Update
    {
        [Required]
        public int StudentParentId { get; set; }

        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = null!;

        [Required]
        public int ParentId { get; set; }
    }

    public class ViewModel
    {
        public int StudentParentId { get; set; }
        public string StudentCode { get; set; } = null!;
        public int ParentId { get; set; }
        public string? StudentName { get; set; }
        public string? ParentName { get; set; }
    }
} 