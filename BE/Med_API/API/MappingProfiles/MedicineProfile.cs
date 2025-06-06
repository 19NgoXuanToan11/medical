using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class MedicineProfile : Profile
{
    public MedicineProfile()
    {
        // Map from Medicine to MedicineDto.ViewModel
        CreateMap<Medicine, MedicineDto.ViewModel>();

        // Map from MedicineDto.Create to Medicine
        CreateMap<MedicineDto.Create, Medicine>()
            .ForMember(dest => dest.MedicineId, opt => opt.Ignore());

        // Map from MedicineDto.Update to Medicine
        CreateMap<MedicineDto.Update, Medicine>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 