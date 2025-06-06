using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public static class RequestResultDto
{
    public class ViewModel
    {
        public int ResultId { get; set; }
        public int RequestId { get; set; }
        public DateTime? AdministeredTime { get; set; }
        public string Status { get; set; } = null!;
        public DateTime SubmittedAt { get; set; }
        public MedicineRequestDto.ViewModel? Request { get; set; }
    }

    public class Create
    {
        [Required]
        public int RequestId { get; set; }

        public DateTime? AdministeredTime { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = null!;
    }

    public class Update
    {
        public DateTime? AdministeredTime { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }
    }
} 