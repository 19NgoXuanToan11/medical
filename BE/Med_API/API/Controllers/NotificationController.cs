using API.DTOs;
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
    public async Task<ActionResult<IEnumerable<NotificationDto.ViewModel>>> GetAllNotifications()
    {
        var notifications = await _notificationService.GetAllNotificationsAsync();
        return Ok(_mapper.Map<IEnumerable<NotificationDto.ViewModel>>(notifications));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NotificationDto.ViewModel>> GetNotificationById(int id)
    {
        var notification = await _notificationService.GetNotificationByIdAsync(id);
        if (notification == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<NotificationDto.ViewModel>(notification));
    }

    [HttpGet("parent/{parentId}")]
    public async Task<ActionResult<IEnumerable<NotificationDto.ViewModel>>> GetNotificationsByParentId(int parentId)
    {
        var notifications = await _notificationService.GetNotificationsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<NotificationDto.ViewModel>>(notifications));
    }

    [HttpGet("parent/{parentId}/unread")]
    public async Task<ActionResult<IEnumerable<NotificationDto.ViewModel>>> GetUnreadNotificationsByParentId(int parentId)
    {
        var notifications = await _notificationService.GetUnreadNotificationsByParentIdAsync(parentId);
        return Ok(_mapper.Map<IEnumerable<NotificationDto.ViewModel>>(notifications));
    }

    [HttpGet("parent/{parentId}/unread-count")]
    public async Task<ActionResult<int>> GetUnreadCountByParentId(int parentId)
    {
        var count = await _notificationService.GetUnreadCountByParentIdAsync(parentId);
        return Ok(count);
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDto.ViewModel>> CreateNotification(NotificationDto.Create createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var notification = _mapper.Map<Notification>(createDto);
            var createdNotification = await _notificationService.CreateNotificationAsync(notification);
            return CreatedAtAction(
                nameof(GetNotificationById),
                new { id = createdNotification.NotificationId },
                _mapper.Map<NotificationDto.ViewModel>(createdNotification));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNotification(int id, NotificationDto.Update updateDto)
    {
        if (id != updateDto.NotificationId)
        {
            return BadRequest("ID mismatch");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var notification = _mapper.Map<Notification>(updateDto);
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

    [HttpPut("{id}/mark-read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var success = await _notificationService.MarkAsReadAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPut("parent/{parentId}/mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead(int parentId)
    {
        var success = await _notificationService.MarkAllAsReadAsync(parentId);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
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

    [HttpPost("health-event/{healthEventId}")]
    public async Task<ActionResult<NotificationDto.ViewModel>> CreateHealthEventNotification(int healthEventId, [FromQuery] string studentCode)
    {
        if (string.IsNullOrEmpty(studentCode))
        {
            return BadRequest("StudentCode is required");
        }

        try
        {
            var notification = await _notificationService.CreateHealthEventNotificationAsync(healthEventId, studentCode);
            return CreatedAtAction(
                nameof(GetNotificationById),
                new { id = notification.NotificationId },
                _mapper.Map<NotificationDto.ViewModel>(notification));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST: api/Notification/injection-form/{formId}/consent
    [HttpPost("injection-form/{formId}/consent")]
    public async Task<ActionResult<NotificationDto.ViewModel>> SendInjectionConsentNotification(int formId, [FromQuery] bool isApproved)
    {
        // Lấy thông tin form tiêm chủng
        var form = await HttpContext.RequestServices.GetService(typeof(Service.IInjectionFormService)) as Service.IInjectionFormService;
        var injectionForm = await form.GetInjectionFormByIdAsync(formId);
        if (injectionForm == null)
        {
            return NotFound("Không tìm thấy phiếu tiêm chủng");
        }
        if (!injectionForm.ParentId.HasValue)
        {
            return BadRequest("Phiếu tiêm chủng không có thông tin phụ huynh");
        }
        var statusText = isApproved ? "đồng ý" : "từ chối";
        var notification = new NotificationDto.Create
        {
            Type = "injection_consent",
            Title = $"Thông báo xác nhận tiêm chủng - {statusText}",
            Message = $"Phiếu tiêm chủng cho học sinh {injectionForm.Student?.LastName} {injectionForm.Student?.FirstName} đã được {statusText}.",
            ParentId = injectionForm.ParentId,
            StudentCode = injectionForm.Student?.StudentCode,
            Priority = "high"
        };
        var notificationEntity = HttpContext.RequestServices.GetService(typeof(Service.INotificationService)) as Service.INotificationService;
        var created = await notificationEntity.CreateNotificationAsync(AutoMapper.Mapper.Map<DB.Notification>(notification));
        return CreatedAtAction(nameof(GetNotificationById), new { id = created.NotificationId }, _mapper.Map<NotificationDto.ViewModel>(created));
    }
} 