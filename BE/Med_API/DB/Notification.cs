using System;

namespace DB;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? RecipientId { get; set; }

    public string RecipientType { get; set; } = null!; // Parent, Staff

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string NotificationType { get; set; } = null!; // InjectionConsent, HealthEvent, MedicineRequest, etc.

    public string? RelatedEntityType { get; set; } // InjectionForm, HealthEvent, etc.

    public int? RelatedEntityId { get; set; }

    public bool IsRead { get; set; } = false;

    public DateTime CreatedDate { get; set; }

    public DateTime? ReadDate { get; set; }

    public string? ActionUrl { get; set; }

    public string? ActionText { get; set; }

    public bool RequiresAction { get; set; } = false;

    public string? Status { get; set; } // Pending, Completed, Cancelled

    // Navigation properties
    public virtual Parent? Parent { get; set; }
    public virtual Staff? Staff { get; set; }
} 