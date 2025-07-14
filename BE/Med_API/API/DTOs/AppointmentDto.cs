using System.ComponentModel.DataAnnotations;
using API.ViewModels;

namespace API.DTOs;

public static class AppointmentDto
{
    public class Create
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ParentId { get; set; }

        [Required]
        public int StaffId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [StringLength(50)]
        public string AppointmentType { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string Reason { get; set; } = null!;

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class Update
    {
        public DateTime? AppointmentDate { get; set; }
        public string? AppointmentType { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }

    public class ViewModel
    {
        public int AppointmentId { get; set; }
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public int StaffId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentType { get; set; } = null!;
        public string Reason { get; set; } = null!;
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedDate { get; set; }

        // Navigation properties
        public StudentDto.ViewModel? Student { get; set; }
        public ParentDto.ViewModel? Parent { get; set; }
        public StaffDto.ViewModel? Staff { get; set; }
    }

    public class AppointmentStatusUpdateDto
    {
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }
} 