using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class DashboardReportMappingProfile : Profile
{
    public DashboardReportMappingProfile()
    {
        CreateMap<DashboardSummary, DashboardSummaryDTO>()
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        CreateMap<DashboardSummaryDTO, DashboardSummary>();

        CreateMap<Report, ReportDTO>()
            .ForMember(dest => dest.GeneratedByStaff, opt => opt.MapFrom(src => src.GeneratedByStaff))
            .ForMember(dest => dest.BasedOnDashboard, opt => opt.MapFrom(src => src.BasedOnDashboard));

        CreateMap<ReportDTO, Report>();
    }
} 