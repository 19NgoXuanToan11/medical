using DB;

namespace Repo;

public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetAllNotificationsAsync();
    Task<Notification?> GetNotificationByIdAsync(int id);
    Task<Notification> CreateNotificationAsync(Notification notification);
    Task<bool> UpdateNotificationAsync(Notification notification);
    Task<bool> DeleteNotificationAsync(int id);
    
    // Get notifications by recipient
    Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId);
    Task<IEnumerable<Notification>> GetNotificationsByStaffIdAsync(int staffId);
    
    // Get unread notifications
    Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId);
    Task<IEnumerable<Notification>> GetUnreadNotificationsByStaffIdAsync(int staffId);
    
    // Mark as read
    Task<bool> MarkNotificationAsReadAsync(int notificationId);
    Task<bool> MarkAllNotificationsAsReadAsync(int recipientId, string recipientType);
    
    // Get notifications by type
    Task<IEnumerable<Notification>> GetNotificationsByTypeAsync(string notificationType);
    Task<IEnumerable<Notification>> GetNotificationsByRelatedEntityAsync(string entityType, int entityId);
    
    // Get pending action notifications
    Task<IEnumerable<Notification>> GetPendingActionNotificationsAsync(int recipientId, string recipientType);
} 