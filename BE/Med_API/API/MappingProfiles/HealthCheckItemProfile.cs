using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class HealthCheckItemProfile : Profile
{
    public HealthCheckItemProfile()
    {
        // Entity to ViewModel
        CreateMap<HealthCheckItem, HealthCheckItemDto.ViewModel>()
            .ForMember(
                dest => dest.RequiredMedicalSupplies,
                opt => opt.MapFrom(src => src.HealthCheckItemMedicalSupplies)
            );

        // Entity to ListViewModel
        CreateMap<HealthCheckItem, HealthCheckItemDto.ListViewModel>()
            .ForMember(
                dest => dest.RequiredSuppliesCount,
                opt => opt.MapFrom(src => src.HealthCheckItemMedicalSupplies.Count)
            );

        // Create DTO to Entity
        CreateMap<HealthCheckItemDto.Create, HealthCheckItem>()
            .ForMember(dest => dest.ItemId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedDate, opt => opt.Ignore())
            .ForMember(
                dest => dest.HealthCheckItemMedicalSupplies,
                opt => opt.MapFrom(src => src.RequiredMedicalSupplies)
            );

        // Update DTO to Entity
        CreateMap<HealthCheckItemDto.Update, HealthCheckItem>()
            .ForMember(dest => dest.ItemId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.HealthCheckItemMedicalSupplies, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // HealthCheckItemMedicalSupply mappings - CẢI THIỆN MAPPING ĐỂ ĐẢM BẢO STOCKQUANTITY CHÍNH XÁC
        CreateMap<HealthCheckItemMedicalSupply, HealthCheckItemDto.MedicalSupplyRequirement>()
            .ForMember(
                dest => dest.MedicalSupplyName,
                opt => opt.MapFrom(src => src.MedicalSupply != null ? src.MedicalSupply.Name : "")
            )
            .ForMember(
                dest => dest.MedicalSupplyCategory,
                opt =>
                    opt.MapFrom(src => src.MedicalSupply != null ? src.MedicalSupply.Category : "")
            )
            .ForMember(
                dest => dest.StockQuantity,
                opt =>
                    opt.MapFrom(src =>
                        src.MedicalSupply != null ? src.MedicalSupply.StockQuantity : 0
                    )
            )
            .ForMember(
                dest => dest.IsActive,
                opt =>
                    opt.MapFrom(src =>
                        src.MedicalSupply != null ? src.MedicalSupply.IsActive : false
                    )
            );

        CreateMap<HealthCheckItemDto.MedicalSupplyRequirementCreate, HealthCheckItemMedicalSupply>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.HealthCheckItemId, opt => opt.Ignore())
            .ForMember(dest => dest.HealthCheckItem, opt => opt.Ignore())
            .ForMember(dest => dest.MedicalSupply, opt => opt.Ignore());
    }
}
