using API.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using DB;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;

    public NotificationController(INotificationService notificationService, IMapper mapper)
    {
        _notificationService = notificationService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetAllNotifications()
    {
        var notifications = await _notificationService.GetAllNotificationsAsync();
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NotificationDTO>> GetNotificationById(int id)
    {
        var notification = await _notificationService.GetNotificationByIdAsync(id);
        if (notification == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<NotificationDTO>(notification));
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDTO>> CreateNotification(NotificationDTO notificationDto)
    {
        try
        {
            var notification = _mapper.Map<Notification>(notificationDto);
            var createdNotification = await _notificationService.CreateNotificationAsync(notification);
            return CreatedAtAction(
                nameof(GetNotificationById),
                new { id = createdNotification.NotificationId },
                _mapper.Map<NotificationDTO>(createdNotification));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNotification(int id, NotificationDTO notificationDto)
    {
        if (id != notificationDto.NotificationId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var notification = _mapper.Map<Notification>(notificationDto);
            var success = await _notificationService.UpdateNotificationAsync(notification);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(int id)
    {
        var success = await _notificationService.DeleteNotificationAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    // API cho phụ huynh
    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotificationsByParentId(int parentId)
    {
        var notifications = await _notificationService.GetNotificationsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    [HttpGet("parent/{parentId}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetUnreadNotificationsByParentId(int parentId)
    {
        var notifications = await _notificationService.GetUnreadNotificationsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    [HttpGet("parent/{parentId}/pending-actions")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetPendingActionNotificationsByParentId(int parentId)
    {
        var notifications = await _notificationService.GetPendingActionNotificationsAsync(parentId, "Parent");
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    [HttpPost("mark-read/{notificationId}")]
    public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
    {
        var success = await _notificationService.MarkNotificationAsReadAsync(notificationId);
        if (!success)
        {
            return NotFound();
        }
        return Ok("Thông báo đã được đánh dấu là đã đọc");
    }

    [HttpPost("mark-all-read/{recipientId}/{recipientType}")]
    public async Task<IActionResult> MarkAllNotificationsAsRead(int recipientId, string recipientType)
    {
        var success = await _notificationService.MarkAllNotificationsAsReadAsync(recipientId, recipientType);
        if (!success)
        {
            return NotFound();
        }
        return Ok("Tất cả thông báo đã được đánh dấu là đã đọc");
    }

    // API cho nhân viên
    [HttpGet("staff/{staffId}")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotificationsByStaffId(int staffId)
    {
        var notifications = await _notificationService.GetNotificationsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    [HttpGet("staff/{staffId}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetUnreadNotificationsByStaffId(int staffId)
    {
        var notifications = await _notificationService.GetUnreadNotificationsByStaffIdAsync(staffId);
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
    }

    // API đặc biệt cho thông báo tiêm chủng
    [HttpGet("injection-consent/{formId}")]
    public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetInjectionConsentNotifications(int formId)
    {
        var notifications = await _notificationService.GetNotificationsByRelatedEntityAsync("InjectionForm", formId);
        var consentNotifications = notifications.Where(n => n.NotificationType == "InjectionConsent");
        return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(consentNotifications));
    }
} 