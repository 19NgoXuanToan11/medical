using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class HealthCheckMappingProfile : Profile
{
    public HealthCheckMappingProfile()
    {
        CreateMap<HealthCheckForm, HealthCheckFormDTO>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.ConfirmedByStaff, opt => opt.MapFrom(src => src.ConfirmedByStaff))
            .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results));

        CreateMap<HealthCheckFormDTO, HealthCheckForm>();

        CreateMap<HealthCheckResult, HealthCheckResultDTO>()
            .ForMember(dest => dest.Form, opt => opt.MapFrom(src => src.Form))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.ExaminedByStaff, opt => opt.MapFrom(src => src.ExaminedByStaff));

        CreateMap<HealthCheckResultDTO, HealthCheckResult>();
    }
} 