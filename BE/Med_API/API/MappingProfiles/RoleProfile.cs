using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class RoleProfile : Profile
{
    public RoleProfile()
    {
        // Map from Role to RoleDto.ViewModel
        CreateMap<Role, RoleDto.ViewModel>()
            .ForMember(dest => dest.StaffCount, opt => opt.MapFrom(src => src.Staff.Count));

        // Map from RoleDto.Create to Role
        CreateMap<RoleDto.Create, Role>()
            .ForMember(dest => dest.RoleId, opt => opt.Ignore())
            .ForMember(dest => dest.Staff, opt => opt.Ignore());

        // Map from RoleDto.Update to Role
        CreateMap<RoleDto.Update, Role>()
            .ForMember(dest => dest.Staff, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
