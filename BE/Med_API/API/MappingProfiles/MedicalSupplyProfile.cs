using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class MedicalSupplyProfile : Profile
{
    public MedicalSupplyProfile()
    {
        // Map from MedicalSupply to MedicalSupplyDto.ViewModel
        CreateMap<MedicalSupply, MedicalSupplyDto.ViewModel>();

        // Map from MedicalSupplyDto.Create to MedicalSupply
        CreateMap<MedicalSupplyDto.Create, MedicalSupply>()
            .ForMember(dest => dest.SupplyId, opt => opt.Ignore());

        // Map from MedicalSupplyDto.Update to MedicalSupply
        CreateMap<MedicalSupplyDto.Update, MedicalSupply>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 