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
        return await _context
            .Notifications.Include(n => n.Parent)
            .Include(n => n.Student)
            .ThenInclude(s => s.Class)
            .Include(n => n.Staff)
            .Include(n => n.HealthEvent)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetNotificationByIdAsync(int id)
    {
        return await _context
            .Notifications.Include(n => n.Parent)
            .Include(n => n.Student)
            .ThenInclude(s => s.Class)
            .Include(n => n.Staff)
            .Include(n => n.HealthEvent)
            .FirstOrDefaultAsync(n => n.NotificationId == id);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByParentIdAsync(int parentId)
    {
        return await _context
            .Notifications.Include(n => n.Parent)
            .Include(n => n.Student)
            .ThenInclude(s => s.Class)
            .Include(n => n.Staff)
            .Include(n => n.HealthEvent)
            .Where(n => n.ParentId == parentId && n.Status != "deleted")
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByParentIdAsync(int parentId)
    {
        return await _context
            .Notifications.Include(n => n.Parent)
            .Include(n => n.Student)
            .ThenInclude(s => s.Class)
            .Include(n => n.Staff)
            .Include(n => n.HealthEvent)
            .Where(n => n.ParentId == parentId && !n.IsRead && n.Status != "deleted")
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification> CreateNotificationAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<bool> UpdateNotificationAsync(Notification notification)
    {
        var existingNotification = await _context.Notifications.FindAsync(
            notification.NotificationId
        );
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

        // Soft delete - just mark as deleted
        notification.Status = "deleted";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAsReadAsync(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null)
        {
            return false;
        }

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;
        notification.Status = "read";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAllAsReadAsync(int parentId)
    {
        var notifications = await _context
            .Notifications.Where(n => n.ParentId == parentId && !n.IsRead && n.Status != "deleted")
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            notification.Status = "read";
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetUnreadCountByParentIdAsync(int parentId)
    {
        return await _context.Notifications.CountAsync(n =>
            n.ParentId == parentId && !n.IsRead && n.Status != "deleted"
        );
    }
}
