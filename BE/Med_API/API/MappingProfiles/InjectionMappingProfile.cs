using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class InjectionMappingProfile : Profile
{
    public InjectionMappingProfile()
    {
        CreateMap<InjectionForm, InjectionFormDTO>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
            .ForMember(dest => dest.Vaccine, opt => opt.MapFrom(src => src.Vaccine))
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime != null ? src.StartTime.Value.ToString(@"hh\:mm\:ss") : null));

        CreateMap<InjectionFormDTO, InjectionForm>()
            .ForMember(dest => dest.VaccineId, opt => opt.MapFrom(src => src.VaccineId))
            .ForMember(dest => dest.Vaccine, opt => opt.Ignore())
            .ForMember(dest => dest.StartTime, opt => opt.Ignore()); // Handled manually in controller

        CreateMap<InjectionResult, InjectionResultDTO>()
            .ForMember(dest => dest.Form, opt => opt.MapFrom(src => src.Form))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.AdministeredByStaff, opt => opt.MapFrom(src => src.AdministeredByStaff));

        CreateMap<InjectionResultDTO, InjectionResult>();
    }
} 