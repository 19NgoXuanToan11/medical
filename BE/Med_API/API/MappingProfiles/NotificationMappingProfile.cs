using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class NotificationMappingProfile : Profile
{
    public NotificationMappingProfile()
    {
        CreateMap<Notification, NotificationDTO>()
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        CreateMap<NotificationDTO, Notification>();
    }
} 