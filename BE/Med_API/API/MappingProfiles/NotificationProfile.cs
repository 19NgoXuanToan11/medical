using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        // Map from Notification to NotificationDto.ViewModel
        CreateMap<Notification, NotificationDto.ViewModel>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => 
                src.Student != null ? $"{src.Student.FirstName} {src.Student.LastName}" : null))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => 
                src.Staff != null ? $"{src.Staff.FirstName} {src.Staff.LastName}" : null))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => 
                src.Student != null && src.Student.Class != null ? src.Student.Class.ClassName : null));

        // Map from NotificationDto.Create to Notification
        CreateMap<NotificationDto.Create, Notification>()
            .ForMember(dest => dest.NotificationId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "sent"))
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ReadAt, opt => opt.Ignore())
            .ForMember(dest => dest.Parent, opt => opt.Ignore())
            .ForMember(dest => dest.Student, opt => opt.Ignore())
            .ForMember(dest => dest.Staff, opt => opt.Ignore())
            .ForMember(dest => dest.HealthEvent, opt => opt.Ignore());

        // Map from NotificationDto.Update to Notification (for partial updates)
        CreateMap<NotificationDto.Update, Notification>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
} 