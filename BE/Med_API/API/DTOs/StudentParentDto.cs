using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class StudentParentDto
{
    public class Create
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ParentId { get; set; }
    }

    public class Update
    {
        [Required]
        public int StudentParentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ParentId { get; set; }
    }

    public class ViewModel
    {
        public int StudentParentId { get; set; }
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public string? StudentName { get; set; }
        public string? ParentName { get; set; }
    }
} 