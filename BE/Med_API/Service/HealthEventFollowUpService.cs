using AutoMapper;
using DB;
using Repo;
using Service.DTOs;

namespace Service;

public interface IHealthEventFollowUpService
{
    Task<IEnumerable<HealthEventFollowUpDto.ViewModel>> GetFollowUpsByEventIdAsync(int eventId);
    Task<HealthEventFollowUpDto.ViewModel?> GetByIdAsync(int followUpId);
    Task<HealthEventFollowUpDto.ViewModel> CreateAsync(HealthEventFollowUpDto.Create createDto);
    Task<HealthEventFollowUpDto.ViewModel> UpdateAsync(HealthEventFollowUpDto.Update updateDto);
    Task DeleteAsync(int followUpId);
}

public class HealthEventFollowUpService : IHealthEventFollowUpService
{
    private readonly IHealthEventFollowUpRepository _followUpRepository;
    private readonly IHealthEventRepository _healthEventRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;

    public HealthEventFollowUpService(
        IHealthEventFollowUpRepository followUpRepository,
        IHealthEventRepository healthEventRepository,
        IStudentRepository studentRepository,
        INotificationRepository notificationRepository,
        IMapper mapper
    )
    {
        _followUpRepository = followUpRepository;
        _healthEventRepository = healthEventRepository;
        _studentRepository = studentRepository;
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<HealthEventFollowUpDto.ViewModel>> GetFollowUpsByEventIdAsync(
        int eventId
    )
    {
        var followUps = await _followUpRepository.GetFollowUpsByEventIdAsync(eventId);
        return _mapper.Map<IEnumerable<HealthEventFollowUpDto.ViewModel>>(followUps);
    }

    public async Task<HealthEventFollowUpDto.ViewModel?> GetByIdAsync(int followUpId)
    {
        var followUp = await _followUpRepository.GetByIdAsync(followUpId);
        return _mapper.Map<HealthEventFollowUpDto.ViewModel?>(followUp);
    }

    public async Task<HealthEventFollowUpDto.ViewModel> CreateAsync(
        HealthEventFollowUpDto.Create createDto
    )
    {
        // Validate that the health event exists
        var healthEvent = await _healthEventRepository.GetHealthEventByIdAsync(createDto.EventId);
        if (healthEvent == null)
        {
            throw new ArgumentException($"Health event with ID {createDto.EventId} not found");
        }

        var followUp = _mapper.Map<HealthEventFollowUp>(createDto);
        var createdFollowUp = await _followUpRepository.CreateAsync(followUp);

        // Create notification for parents
        await CreateFollowUpNotificationAsync(healthEvent, createdFollowUp);

        // Update health event status for severe/emergency cases
        await UpdateHealthEventStatusAsync(healthEvent, createdFollowUp);

        // Reload with navigation properties
        var reloadedFollowUp = await _followUpRepository.GetByIdAsync(createdFollowUp.FollowUpId);
        return _mapper.Map<HealthEventFollowUpDto.ViewModel>(reloadedFollowUp);
    }

    public async Task<HealthEventFollowUpDto.ViewModel> UpdateAsync(
        HealthEventFollowUpDto.Update updateDto
    )
    {
        var existingFollowUp = await _followUpRepository.GetByIdAsync(updateDto.FollowUpId);
        if (existingFollowUp == null)
        {
            throw new ArgumentException($"Follow-up with ID {updateDto.FollowUpId} not found");
        }

        _mapper.Map(updateDto, existingFollowUp);
        var updatedFollowUp = await _followUpRepository.UpdateAsync(existingFollowUp);

        // Reload with navigation properties
        var reloadedFollowUp = await _followUpRepository.GetByIdAsync(updatedFollowUp.FollowUpId);
        return _mapper.Map<HealthEventFollowUpDto.ViewModel>(reloadedFollowUp);
    }

    public async Task DeleteAsync(int followUpId)
    {
        await _followUpRepository.DeleteAsync(followUpId);
    }

    private async Task CreateFollowUpNotificationAsync(
        HealthEvent healthEvent,
        HealthEventFollowUp followUp
    )
    {
        try
        {
            // Get student's parents
            var student = await _studentRepository.GetStudentByCodeAsync(healthEvent.StudentCode);
            if (student?.StudentParents == null)
                return;

            foreach (var studentParent in student.StudentParents)
            {
                var notification = new Notification
                {
                    Type = "health_event_follow_up",
                    Title =
                        $"Cập nhật tình trạng sức khỏe - {student.FirstName} {student.LastName}",
                    Message =
                        $"Học sinh {student.FirstName} {student.LastName} có cập nhật tình trạng: {followUp.Status}. {followUp.Note}",
                    ParentId = studentParent.ParentId,
                    StudentCode = healthEvent.StudentCode,
                    StaffId = followUp.StaffId,
                    HealthEventId = healthEvent.EventId,
                    Priority = GetNotificationPriority(healthEvent.Severity),
                    Status = "sent",
                    IsRead = false,
                    CreatedAt = DateTime.Now,
                    AdditionalData = System.Text.Json.JsonSerializer.Serialize(
                        new
                        {
                            FollowUpId = followUp.FollowUpId,
                            FollowUpStatus = followUp.Status,
                            FollowUpNote = followUp.Note,
                            HealthEventSeverity = healthEvent.Severity,
                        }
                    ),
                };

                await _notificationRepository.CreateNotificationAsync(notification);
            }
        }
        catch (Exception ex)
        {
            // Log error but don't fail the follow-up creation
            Console.WriteLine($"Error creating follow-up notification: {ex.Message}");
        }
    }

    private async Task UpdateHealthEventStatusAsync(
        HealthEvent healthEvent,
        HealthEventFollowUp followUp
    )
    {
        try
        {
            // Update health event status for severe/emergency cases
            if (healthEvent.Severity == "Nặng" || healthEvent.Severity == "Cấp cứu")
            {
                // Update the health event with the latest follow-up status in Notes
                healthEvent.Notes = $"Cập nhật tình trạng: {followUp.Status}. {followUp.Note}";
                await _healthEventRepository.UpdateHealthEventAsync(healthEvent);
            }
        }
        catch (Exception ex)
        {
            // Log error but don't fail the follow-up creation
            Console.WriteLine($"Error updating health event status: {ex.Message}");
        }
    }

    private string GetNotificationPriority(string severity)
    {
        return severity switch
        {
            "Cấp cứu" => "urgent",
            "Nặng" => "high",
            "Trung bình" => "medium",
            _ => "low",
        };
    }
}
