using API.DTOs;
using AutoMapper;
using DB;
using Microsoft.EntityFrameworkCore;

namespace API.MappingProfiles;

public class StaffProfile : Profile
{
    public StaffProfile()
    {
        // Map from Staff to StaffDto.ViewModel
        CreateMap<Staff, StaffDto.ViewModel>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName))
            .ForMember(dest => dest.StudentCount, opt => opt.MapFrom(src => 
                src.HealthEvents.Select(e => e.StudentCode).Distinct().Count()))
            .ForMember(dest => dest.HealthEventCount, opt => opt.MapFrom(src => src.HealthEvents.Count))
            .ForMember(dest => dest.ParentCount, opt => opt.MapFrom(src => 
                src.MedicineRequests.Select(m => m.ParentId).Distinct().Count()))
            .ForMember(dest => dest.MedicineRequestCount, opt => opt.MapFrom(src => src.MedicineRequests.Count));

        // Map from StaffDto.Create to Staff
        CreateMap<StaffDto.Create, Staff>()
            .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
            .ForMember(dest => dest.StaffId, opt => opt.Ignore())
            .ForMember(dest => dest.Role, opt => opt.Ignore())
            .ForMember(dest => dest.HealthEvents, opt => opt.Ignore())
            .ForMember(dest => dest.MedicineRequests, opt => opt.Ignore())
            .ForMember(dest => dest.AdministeredRequestResults, opt => opt.Ignore())
            .ForMember(dest => dest.ActionedRequestResults, opt => opt.Ignore());

        // Map from StaffDto.Update to Staff
        CreateMap<StaffDto.Update, Staff>()
            .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
            .ForMember(dest => dest.Role, opt => opt.Ignore())
            .ForMember(dest => dest.HealthEvents, opt => opt.Ignore())
            .ForMember(dest => dest.MedicineRequests, opt => opt.Ignore())
            .ForMember(dest => dest.AdministeredRequestResults, opt => opt.Ignore())
            .ForMember(dest => dest.ActionedRequestResults, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 