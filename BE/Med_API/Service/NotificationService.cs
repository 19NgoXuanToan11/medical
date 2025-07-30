using System.Text.Json;
using DB;
using Microsoft.EntityFrameworkCore;
using Repo;

namespace Service;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IHealthEventRepository _healthEventRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IStudentParentRepository _studentParentRepository;
    private readonly MedicalContext _context;

    public NotificationService(
        INotificationRepository notificationRepository,
        IHealthEventRepository healthEventRepository,
        IStudentRepository studentRepository,
        IStudentParentRepository studentParentRepository,
        MedicalContext context
    )
    {
        _notificationRepository = notificationRepository;
        _healthEventRepository = healthEventRepository;
        _studentRepository = studentRepository;
        _studentParentRepository = studentParentRepository;
        _context = context;
    }

    public async Task<IEnumerable<Notification>> GetAllNotificationsAsync()
    {
        return await _notificationRepository.GetAllNotificationsAsync();
    }

    public async Task<Notification?> GetNotificationByIdAsync(int id)
    {
        return await _notificationRepository.GetNotificationByIdAsync(id);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId)
    {
        return await _notificationRepository.GetNotificationsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId)
    {
        return await _notificationRepository.GetUnreadNotificationsByParentIdAsync(parentId);
    }

    public async Task<Notification> CreateNotificationAsync(Notification notification)
    {
        // Validate required fields
        if (string.IsNullOrEmpty(notification.Type))
        {
            throw new InvalidOperationException("Type is required");
        }

        if (string.IsNullOrEmpty(notification.Title))
        {
            throw new InvalidOperationException("Title is required");
        }

        if (string.IsNullOrEmpty(notification.Message))
        {
            throw new InvalidOperationException("Message is required");
        }

        // Set default values
        notification.CreatedAt = DateTime.UtcNow;
        notification.Status = "sent";
        notification.IsRead = false;

        return await _notificationRepository.CreateNotificationAsync(notification);
    }

    public async Task<bool> UpdateNotificationAsync(Notification notification)
    {
        return await _notificationRepository.UpdateNotificationAsync(notification);
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        return await _notificationRepository.DeleteNotificationAsync(id);
    }

    public async Task<bool> MarkAsReadAsync(int id)
    {
        return await _notificationRepository.MarkAsReadAsync(id);
    }

    public async Task<bool> MarkAllAsReadAsync(int parentId)
    {
        return await _notificationRepository.MarkAllAsReadAsync(parentId);
    }

    public async Task<int> GetUnreadCountByParentIdAsync(int parentId)
    {
        return await _notificationRepository.GetUnreadCountByParentIdAsync(parentId);
    }

    public async Task<Notification> CreateHealthEventNotificationAsync(
        int healthEventId,
        string studentCode
    )
    {
        // Get health event details
        var healthEvent = await _healthEventRepository.GetHealthEventByIdAsync(healthEventId);
        if (healthEvent == null)
        {
            throw new InvalidOperationException("Health event not found");
        }

        // Get student details
        var student = await _studentRepository.GetStudentByCodeAsync(studentCode);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Get all parents of this student
        var studentParents = await _studentParentRepository.GetStudentParentsByStudentCodeAsync(
            studentCode
        );

        var notifications = new List<Notification>();

        foreach (var studentParent in studentParents)
        {
            // Create notification for each parent
            var notification = new Notification
            {
                Type = "health_event",
                Title = $"Thông báo sự cố y tế - {student.FirstName} {student.LastName}",
                Message =
                    $"Học sinh {student.FirstName} {student.LastName} đã có sự cố y tế: {healthEvent.Symptoms}. "
                    + $"{(string.IsNullOrEmpty(healthEvent.Treatment) ? "" : $"Đã xử lý: {healthEvent.Treatment}. ")}"
                    + "Vui lòng liên hệ với trường để biết thêm chi tiết.",
                ParentId = studentParent.ParentId,
                StudentCode = studentCode,
                StaffId = healthEvent.StaffId,
                HealthEventId = healthEventId,
                Priority = GetPriorityFromSeverity(healthEvent.Severity),
                AdditionalData = JsonSerializer.Serialize(
                    new
                    {
                        StudentName = $"{student.FirstName} {student.LastName}",
                        EventType = healthEvent.EventType,
                        Severity = healthEvent.Severity,
                        Symptoms = healthEvent.Symptoms,
                        Treatment = healthEvent.Treatment,
                        EventDate = healthEvent.EventDate,
                        ClassName = student.Class?.ClassName,
                    }
                ),
                CreatedAt = DateTime.UtcNow,
                Status = "sent",
                IsRead = false,
            };

            var createdNotification = await _notificationRepository.CreateNotificationAsync(
                notification
            );
            notifications.Add(createdNotification);
        }

        // Return the first notification (all are similar, just for different parents)
        return notifications.FirstOrDefault()
            ?? throw new InvalidOperationException("No notifications created");
    }

    private string GetPriorityFromSeverity(string severity)
    {
        return severity?.ToLower() switch
        {
            "emergency" => "urgent",
            "severe" => "high",
            "moderate" => "medium",
            "light" => "low",
            _ => "medium",
        };
    }
}
