using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class DashboardSummaryMappingProfile : Profile
{
    public DashboardSummaryMappingProfile()
    {
        CreateMap<DashboardSummary, DashboardSummaryDTO>()
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        CreateMap<DashboardSummaryDTO, DashboardSummary>();
    }
}
