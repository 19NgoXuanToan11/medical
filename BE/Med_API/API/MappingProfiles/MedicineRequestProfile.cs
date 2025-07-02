using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class MedicineRequestProfile : Profile
{
    public MedicineRequestProfile()
    {
        // Map from MedicineRequest to MedicineRequestDto.ViewModel
        CreateMap<MedicineRequest, MedicineRequestDto.ViewModel>()
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.ClassName))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.MedicineRequestItems, opt => opt.MapFrom(src => src.MedicineRequestItems))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        // Map from MedicineRequestDto.Create to MedicineRequest
        CreateMap<MedicineRequestDto.Create, MedicineRequest>()
            .ForMember(dest => dest.RequestId, opt => opt.Ignore())
            .ForMember(dest => dest.RequestDate, opt => opt.Ignore())
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.ClassName))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.MedicineRequestItems, opt => opt.MapFrom(src => src.MedicineRequestItems));

        // Map from MedicineRequestDto.Update to MedicineRequest
        CreateMap<MedicineRequestDto.Update, MedicineRequest>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Map from MedicineRequestItem to MedicineRequestItemDto.ViewModel
        CreateMap<MedicineRequestItem, MedicineRequestItemDto.ViewModel>();

        // Map from MedicineRequestItemDto.Create to MedicineRequestItem
        CreateMap<MedicineRequestItemDto.Create, MedicineRequestItem>()
            .ForMember(dest => dest.MedicineRequestItemId, opt => opt.Ignore())
            .ForMember(dest => dest.MedicineRequest, opt => opt.Ignore());

        // Map from MedicineRequestItemDto.Update to MedicineRequestItem
        CreateMap<MedicineRequestItemDto.Update, MedicineRequestItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 