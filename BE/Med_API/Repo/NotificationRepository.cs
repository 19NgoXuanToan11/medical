using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class NotificationRepository : INotificationRepository
{
    private readonly MedicalContext _context;

    public NotificationRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Notification>> GetAllNotificationsAsync()
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Include(n => n.Staff)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<Notification?> GetNotificationByIdAsync(int id)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Include(n => n.Staff)
            .FirstOrDefaultAsync(n => n.NotificationId == id);
    }

    public async Task<Notification> CreateNotificationAsync(Notification notification)
    {
        notification.CreatedDate = DateTime.UtcNow;
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<bool> UpdateNotificationAsync(Notification notification)
    {
        var existingNotification = await _context.Notifications.FindAsync(notification.NotificationId);
        if (existingNotification == null)
        {
            return false;
        }

        _context.Entry(existingNotification).CurrentValues.SetValues(notification);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null)
        {
            return false;
        }
        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Where(n => n.RecipientId == parentId && n.RecipientType == "Parent")
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByStaffIdAsync(int staffId)
    {
        return await _context.Notifications
            .Include(n => n.Staff)
            .Where(n => n.RecipientId == staffId && n.RecipientType == "Staff")
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Where(n => n.RecipientId == parentId && n.RecipientType == "Parent" && !n.IsRead)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByStaffIdAsync(int staffId)
    {
        return await _context.Notifications
            .Include(n => n.Staff)
            .Where(n => n.RecipientId == staffId && n.RecipientType == "Staff" && !n.IsRead)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<bool> MarkNotificationAsReadAsync(int notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification == null)
        {
            return false;
        }

        notification.IsRead = true;
        notification.ReadDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAllNotificationsAsReadAsync(int recipientId, string recipientType)
    {
        var notifications = await _context.Notifications
            .Where(n => n.RecipientId == recipientId && n.RecipientType == recipientType && !n.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByTypeAsync(string notificationType)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Include(n => n.Staff)
            .Where(n => n.NotificationType == notificationType)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByRelatedEntityAsync(string entityType, int entityId)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Include(n => n.Staff)
            .Where(n => n.RelatedEntityType == entityType && n.RelatedEntityId == entityId)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetPendingActionNotificationsAsync(int recipientId, string recipientType)
    {
        return await _context.Notifications
            .Include(n => n.Parent)
            .Include(n => n.Staff)
            .Where(n => n.RecipientId == recipientId && 
                       n.RecipientType == recipientType && 
                       n.RequiresAction && 
                       n.Status == "Pending")
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }
} 