using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class VaccineProfile : Profile
{
    public VaccineProfile()
    {
        CreateMap<Vaccine, VaccineDto.ViewModel>();
        CreateMap<VaccineDto.Create, Vaccine>()
            .ForMember(dest => dest.VaccineId, opt => opt.Ignore());
        CreateMap<VaccineDto.Update, Vaccine>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 