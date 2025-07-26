using DB;

namespace Repo;

public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetAllNotificationsAsync();
    Task<Notification?> GetNotificationByIdAsync(int id);
    Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId);
    Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId);
    Task<Notification> CreateNotificationAsync(Notification notification);
    Task<bool> UpdateNotificationAsync(Notification notification);
    Task<bool> DeleteNotificationAsync(int id);
    Task<bool> MarkAsReadAsync(int id);
    Task<bool> MarkAllAsReadAsync(int parentId);
    Task<int> GetUnreadCountByParentIdAsync(int parentId);
} 