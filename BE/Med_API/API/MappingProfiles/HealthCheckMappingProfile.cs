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
            .ForMember(dest => dest.Results, opt => opt.MapFrom(src => src.Results))
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.HasValue ? src.StartTime.Value.ToString(@"hh\:mm\:ss") : null))
            // Explicitly map all status fields to ensure they're included
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.ConsentStatus, opt => opt.MapFrom(src => src.ConsentStatus))
            .ForMember(dest => dest.ConfirmStatus, opt => opt.MapFrom(src => src.ConfirmStatus));

        CreateMap<HealthCheckFormDTO, HealthCheckForm>()
            .ForMember(dest => dest.StartTime, opt => opt.Ignore()) // Handle conversion manually in controller
            // Ensure all status fields are mapped from DTO to entity
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.ConsentStatus, opt => opt.MapFrom(src => src.ConsentStatus))
            .ForMember(dest => dest.ConfirmStatus, opt => opt.MapFrom(src => src.ConfirmStatus));

        CreateMap<HealthCheckResult, HealthCheckResultDTO>()
            .ForMember(dest => dest.Form, opt => opt.MapFrom(src => src.Form))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.ExaminedByStaff, opt => opt.MapFrom(src => src.ExaminedByStaff));

        CreateMap<HealthCheckResultDTO, HealthCheckResult>();
    }
} 