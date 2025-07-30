using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class MedicineProfile : Profile
{
    public MedicineProfile()
    {
        // Map from Medicine to MedicineDto.ViewModel (all fields are mapped by convention)
        CreateMap<Medicine, MedicineDto.ViewModel>();

        // Map from MedicineDto.Create to Medicine (ignore MedicineId, map all new fields)
        CreateMap<MedicineDto.Create, Medicine>()
            .ForMember(dest => dest.MedicineId, opt => opt.Ignore());

        // Map from MedicineDto.Update to Medicine (map all new fields if not null)
        CreateMap<MedicineDto.Update, Medicine>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
