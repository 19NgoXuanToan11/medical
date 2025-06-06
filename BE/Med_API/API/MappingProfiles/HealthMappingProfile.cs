using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class HealthMappingProfile : Profile
{
    public HealthMappingProfile()
    {
        CreateMap<HealthEvent, HealthEventDTO>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        CreateMap<HealthEventDTO, HealthEvent>();

        CreateMap<HealthProfile, HealthProfileDTO>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student));

        CreateMap<HealthProfileDTO, HealthProfile>();
    }
} 