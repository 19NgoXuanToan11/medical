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
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent));

        CreateMap<InjectionFormDTO, InjectionForm>();

        CreateMap<InjectionResult, InjectionResultDTO>()
            .ForMember(dest => dest.Form, opt => opt.MapFrom(src => src.Form))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.AdministeredByStaff, opt => opt.MapFrom(src => src.AdministeredByStaff));

        CreateMap<InjectionResultDTO, InjectionResult>();
    }
} 