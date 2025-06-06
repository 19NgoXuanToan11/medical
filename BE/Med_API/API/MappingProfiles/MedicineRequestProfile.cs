using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class MedicineRequestProfile : Profile
{
    public MedicineRequestProfile()
    {
        // Map from MedicineRequest to MedicineRequestDto.ViewModel
        CreateMap<MedicineRequest, MedicineRequestDto.ViewModel>();

        // Map from MedicineRequestDto.Create to MedicineRequest
        CreateMap<MedicineRequestDto.Create, MedicineRequest>()
            .ForMember(dest => dest.RequestId, opt => opt.Ignore())
            .ForMember(dest => dest.RequestDate, opt => opt.Ignore());

        // Map from MedicineRequestDto.Update to MedicineRequest
        CreateMap<MedicineRequestDto.Update, MedicineRequest>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 