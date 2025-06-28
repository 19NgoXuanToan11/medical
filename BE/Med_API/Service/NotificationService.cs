using DB;
using Repo;

namespace Service;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IInjectionFormRepository _injectionFormRepository;
    private readonly IParentRepository _parentRepository;

    public NotificationService(
        INotificationRepository notificationRepository,
        IInjectionFormRepository injectionFormRepository,
        IParentRepository parentRepository)
    {
        _notificationRepository = notificationRepository;
        _injectionFormRepository = injectionFormRepository;
        _parentRepository = parentRepository;
    }

    public async Task<IEnumerable<Notification>> GetAllNotificationsAsync()
    {
        return await _notificationRepository.GetAllNotificationsAsync();
    }

    public async Task<Notification?> GetNotificationByIdAsync(int id)
    {
        return await _notificationRepository.GetNotificationByIdAsync(id);
    }

    public async Task<Notification?> CreateNotificationAsync(Notification notification)
    {
        // Validate recipient
        if (string.IsNullOrEmpty(notification.RecipientType))
        {
            throw new InvalidOperationException("RecipientType is required");
        }

        if (!notification.RecipientId.HasValue)
        {
            throw new InvalidOperationException("RecipientId is required");
        }

        // Validate based on recipient type
        switch (notification.RecipientType.ToLower())
        {
            case "parent":
                var parent = await _parentRepository.GetParentByIdAsync(notification.RecipientId.Value);
                if (parent == null)
                {
                    throw new InvalidOperationException("Parent not found");
                }
                break;
            // Add other recipient type validations as needed
        }

        // Set default values
        notification.CreatedDate = DateTime.UtcNow;
        notification.IsRead = false;
        notification.Status ??= "Pending";

        return await _notificationRepository.CreateNotificationAsync(notification);
    }

    public async Task<bool> UpdateNotificationAsync(Notification notification)
    {
        var existingNotification = await _notificationRepository.GetNotificationByIdAsync(notification.NotificationId);
        if (existingNotification == null)
        {
            return false;
        }

        return await _notificationRepository.UpdateNotificationAsync(notification);
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        return await _notificationRepository.DeleteNotificationAsync(id);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId)
    {
        return await _notificationRepository.GetNotificationsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByStaffIdAsync(int staffId)
    {
        return await _notificationRepository.GetNotificationsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId)
    {
        return await _notificationRepository.GetUnreadNotificationsByParentIdAsync(parentId);
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByStaffIdAsync(int staffId)
    {
        return await _notificationRepository.GetUnreadNotificationsByStaffIdAsync(staffId);
    }

    public async Task<bool> MarkNotificationAsReadAsync(int notificationId)
    {
        return await _notificationRepository.MarkNotificationAsReadAsync(notificationId);
    }

    public async Task<bool> MarkAllNotificationsAsReadAsync(int recipientId, string recipientType)
    {
        return await _notificationRepository.MarkAllNotificationsAsReadAsync(recipientId, recipientType);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByTypeAsync(string notificationType)
    {
        return await _notificationRepository.GetNotificationsByTypeAsync(notificationType);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByRelatedEntityAsync(string entityType, int entityId)
    {
        return await _notificationRepository.GetNotificationsByRelatedEntityAsync(entityType, entityId);
    }

    public async Task<IEnumerable<Notification>> GetPendingActionNotificationsAsync(int recipientId, string recipientType)
    {
        return await _notificationRepository.GetPendingActionNotificationsAsync(recipientId, recipientType);
    }

    public async Task<Notification?> CreateInjectionConsentNotificationAsync(int formId, int parentId, string studentName, string injectionName)
    {
        var notification = new Notification
        {
            RecipientId = parentId,
            RecipientType = "Parent",
            Title = "Yêu cầu đồng ý tiêm chủng",
            Message = $"Con của bạn {studentName} cần được tiêm chủng {injectionName}. Vui lòng xác nhận đồng ý để tiến hành tiêm chủng.",
            NotificationType = "InjectionConsent",
            RelatedEntityType = "InjectionForm",
            RelatedEntityId = formId,
            RequiresAction = true,
            ActionUrl = $"/injection-consent/{formId}",
            ActionText = "Xác nhận đồng ý",
            Status = "Pending"
        };

        return await CreateNotificationAsync(notification);
    }

    public async Task<bool> UpdateInjectionConsentNotificationAsync(int formId, string status)
    {
        var notifications = await _notificationRepository.GetNotificationsByRelatedEntityAsync("InjectionForm", formId);
        var consentNotification = notifications.FirstOrDefault(n => n.NotificationType == "InjectionConsent");

        if (consentNotification == null)
        {
            return false;
        }

        consentNotification.Status = status;
        consentNotification.IsRead = true;
        consentNotification.ReadDate = DateTime.UtcNow;

        if (status == "Approved")
        {
            consentNotification.ActionText = "Đã đồng ý";
            consentNotification.Message += " - Phụ huynh đã xác nhận đồng ý.";
        }
        else if (status == "Rejected")
        {
            consentNotification.ActionText = "Đã từ chối";
            consentNotification.Message += " - Phụ huynh đã từ chối.";
        }

        return await _notificationRepository.UpdateNotificationAsync(consentNotification);
    }
} 