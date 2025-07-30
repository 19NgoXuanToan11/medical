using System;
using System.Collections.Generic;

namespace DB;

public partial class RequestResult
{
    public int ResultId { get; set; }

    public int? RequestId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? SubmittedAt { get; set; }

    public int? AdministeredBy { get; set; }

    public DateTime? AdministeredTime { get; set; }

    public int? ActionBy { get; set; }

    // New fields for frequency handling
    public string? Frequency { get; set; } // "sáng", "trưa", "chiều", "tối", etc.
    public int? TimesPerDay { get; set; } // 1, 2, 3 times per day
    public int? CurrentDayCount { get; set; } // How many times administered today
    public DateOnly? CurrentDate { get; set; } // Current date being tracked
    public string? AdministeredFrequencies { get; set; } // JSON string to track which frequencies were administered today

    // New fields for failure handling and re-requests
    public string? FailedFrequencies { get; set; } // JSON string to track which frequencies failed
    public string? FailureReasons { get; set; } // JSON string to track reasons for failures
    public bool IsReRequest { get; set; } = false; // Indicates if this is a re-request
    public int? OriginalRequestResultId { get; set; } // Reference to original failed request
    public DateTime? LastAttemptTime { get; set; } // Last time medicine was attempted
    public int? FailedAttempts { get; set; } = 0; // Number of failed attempts
    public string? ReRequestReason { get; set; } // Reason for re-request (complete failure, partial failure, etc.)

    // Navigation properties
    public virtual MedicineRequest? Request { get; set; }
    public virtual Staff? AdministeredByStaff { get; set; }
    public virtual Staff? ActionByStaff { get; set; }
    public virtual RequestResult? OriginalRequestResult { get; set; }
    public virtual ICollection<RequestResult> ReRequests { get; set; } = new List<RequestResult>();
}
