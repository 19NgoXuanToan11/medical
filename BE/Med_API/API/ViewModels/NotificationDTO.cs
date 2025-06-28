using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API.ViewModels;

public class NotificationDTO
{
    public int NotificationId { get; set; }

    public int? RecipientId { get; set; }

    [Required]
    public string RecipientType { get; set; } = null!;

    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string Message { get; set; } = null!;

    [Required]
    public string NotificationType { get; set; } = null!;

    public string? RelatedEntityType { get; set; }

    public int? RelatedEntityId { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ReadDate { get; set; }

    public string? ActionUrl { get; set; }

    public string? ActionText { get; set; }

    public bool RequiresAction { get; set; }

    public string? Status { get; set; }

    // Navigation properties
    public ParentDto.ViewModel? Parent { get; set; }
    public StaffDto.ViewModel? Staff { get; set; }
} 