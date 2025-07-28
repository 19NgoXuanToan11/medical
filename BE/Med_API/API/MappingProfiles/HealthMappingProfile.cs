using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class HealthMappingProfile : Profile
{
    public HealthMappingProfile()
    {
        // HealthEvent Mappings
        CreateMap<HealthEvent, HealthEventDto.ViewModel>()
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff))
            .ForMember(dest => dest.HealthEventMedicines, opt => opt.MapFrom(src => src.HealthEventMedicines))
            .ForMember(dest => dest.HealthEventMedicalSupplies, opt => opt.MapFrom(src => src.HealthEventMedicalSupplies));

        CreateMap<HealthEventDto.Create, HealthEvent>()
            .ForMember(dest => dest.EventId, opt => opt.Ignore())
            .ForMember(dest => dest.EventDate, opt => opt.Ignore())
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode));

        CreateMap<HealthEventDto.Update, HealthEvent>()
            .ForMember(dest => dest.EventDate, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // HealthEventMedicine Mappings
        CreateMap<HealthEventMedicine, HealthEventMedicineDto.ViewModel>()
            .ForMember(dest => dest.MedicineName, opt => opt.MapFrom(src => src.MedicineName ?? src.Medicine.Name));

        CreateMap<HealthEventMedicineDto.Create, HealthEventMedicine>()
            .ForMember(dest => dest.HealthEventMedicineId, opt => opt.Ignore())
            .ForMember(dest => dest.HealthEvent, opt => opt.Ignore())
            .ForMember(dest => dest.Medicine, opt => opt.Ignore())
            .ForMember(dest => dest.MedicineName, opt => opt.MapFrom(src => src.MedicineName));

        CreateMap<HealthEventMedicineDto.Update, HealthEventMedicine>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // HealthEventMedicalSupply Mappings
        CreateMap<HealthEventMedicalSupply, HealthEventMedicalSupplyDto.ViewModel>()
            .ForMember(dest => dest.MedicalSupplyName, opt => opt.MapFrom(src => src.MedicalSupplyName ?? src.MedicalSupply.Name));

        CreateMap<HealthEventMedicalSupplyDto.Create, HealthEventMedicalSupply>()
            .ForMember(dest => dest.HealthEventMedicalSupplyId, opt => opt.Ignore())
            .ForMember(dest => dest.HealthEvent, opt => opt.Ignore())
            .ForMember(dest => dest.MedicalSupply, opt => opt.Ignore())
            .ForMember(dest => dest.MedicalSupplyName, opt => opt.MapFrom(src => src.MedicalSupplyName));

        CreateMap<HealthEventMedicalSupplyDto.Update, HealthEventMedicalSupply>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // HealthProfile Mappings
        CreateMap<HealthProfile, HealthProfileDto.ViewModel>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parents, opt => opt.MapFrom(src => src.Student != null ? src.Student.StudentParents.Select(sp => sp.Parent) : null));

        CreateMap<HealthProfileDto.Create, HealthProfile>();

        CreateMap<HealthProfileDto.Update, HealthProfile>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Parent Summary Mapping
        CreateMap<Parent, HealthProfileDto.ParentSummary>();
    }
} 