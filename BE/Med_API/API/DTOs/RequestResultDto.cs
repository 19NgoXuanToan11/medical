using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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
        
        // New frequency fields
        public string? Frequency { get; set; }
        public int? TimesPerDay { get; set; }
        public int? CurrentDayCount { get; set; }
        public DateOnly? CurrentDate { get; set; }
        public List<string>? AdministeredFrequencies { get; set; }
        
        // New failure handling fields
        public List<string>? FailedFrequencies { get; set; }
        public Dictionary<string, string>? FailureReasons { get; set; }
        public bool IsReRequest { get; set; }
        public int? OriginalRequestResultId { get; set; }
        public DateTime? LastAttemptTime { get; set; }
        public int? FailedAttempts { get; set; }
        public string? ReRequestReason { get; set; }
        
        // Navigation properties
        public MedicineRequestDto.ViewModel? Request { get; set; }
        public StaffDto.ViewModel? AdministeredByStaff { get; set; }
        public StaffDto.ViewModel? ActionByStaff { get; set; }
        [JsonIgnore]
        public RequestResultDto.ViewModel? OriginalRequestResult { get; set; }
        [JsonIgnore]
        public ICollection<RequestResultDto.ViewModel> ReRequests { get; set; } = new List<RequestResultDto.ViewModel>();
    }

    public class Create
    {
        [Required]
        public int RequestId { get; set; }

        public DateTime? AdministeredTime { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = null!;
        
        // New frequency fields
        [FrequencyValidation]
        public string? Frequency { get; set; }
        public int? TimesPerDay { get; set; }
        public int? CurrentDayCount { get; set; }
        public DateOnly? CurrentDate { get; set; }
        public string? AdministeredFrequencies { get; set; }
        
        // New failure handling fields
        public string? FailedFrequencies { get; set; }
        public string? FailureReasons { get; set; }
        public bool IsReRequest { get; set; }
        public int? OriginalRequestResultId { get; set; }
        public DateTime? LastAttemptTime { get; set; }
        public int? FailedAttempts { get; set; }
        public string? ReRequestReason { get; set; }
    }

    public class Update
    {
        public DateTime? AdministeredTime { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }
        
        // New frequency fields
        [FrequencyValidation]
        public string? Frequency { get; set; }
        public int? TimesPerDay { get; set; }
        public int? CurrentDayCount { get; set; }
        public DateOnly? CurrentDate { get; set; }
        public string? AdministeredFrequencies { get; set; }
        
        // New failure handling fields
        public string? FailedFrequencies { get; set; }
        public string? FailureReasons { get; set; }
        public DateTime? LastAttemptTime { get; set; }
        public int? FailedAttempts { get; set; }
    }

    public class FrequencyCompleteRequest
    {
        [Required]
        public int RequestResultId { get; set; }

        [Required]
        public int MedicineRequestItemId { get; set; }

        [Required]
        [StringLength(20)]
        [FrequencyValidation]
        public string Frequency { get; set; } = null!; // "sáng", "trưa", "chiều", "tối"

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public int StaffId { get; set; }
    }

    public class FailureReport
    {
        [Required]
        public int RequestResultId { get; set; }

        [Required]
        public int MedicineRequestItemId { get; set; }

        [Required]
        [StringLength(20)]
        [FrequencyValidation]
        public string Frequency { get; set; } = null!;

        [Required]
        [StringLength(500)]
        public string FailureReason { get; set; } = null!;

        [Required]
        public int StaffId { get; set; }
    }

    public class ReRequestCreate
    {
        [Required]
        public int OriginalRequestResultId { get; set; }

        [Required]
        [StringLength(500)]
        public string ReRequestReason { get; set; } = null!; // "Complete Failure", "Partial Failure", "Time Expired"

        public int? StaffId { get; set; }
    }

    public class TimeBasedStatusUpdate
    {
        public int RequestResultId { get; set; }
        public string Status { get; set; } = null!;
        public string? Reason { get; set; }
    }
} 