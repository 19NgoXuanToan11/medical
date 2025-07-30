using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class AppointmentProfile : Profile
{
    public AppointmentProfile()
    {
        // Map from Appointment to AppointmentDto.ViewModel
        CreateMap<Appointment, AppointmentDto.ViewModel>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        // Map from AppointmentDto.Create to Appointment
        CreateMap<AppointmentDto.Create, Appointment>()
            .ForMember(dest => dest.AppointmentId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Student, opt => opt.Ignore())
            .ForMember(dest => dest.Parent, opt => opt.Ignore())
            .ForMember(dest => dest.Staff, opt => opt.Ignore());

        // Map from AppointmentDto.Update to Appointment
        CreateMap<AppointmentDto.Update, Appointment>()
            .ForMember(dest => dest.AppointmentId, opt => opt.Ignore())
            .ForMember(dest => dest.StudentId, opt => opt.Ignore())
            .ForMember(dest => dest.ParentId, opt => opt.Ignore())
            .ForMember(dest => dest.StaffId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.Student, opt => opt.Ignore())
            .ForMember(dest => dest.Parent, opt => opt.Ignore())
            .ForMember(dest => dest.Staff, opt => opt.Ignore())
            .ForMember(
                dest => dest.AppointmentDate,
                opt => opt.MapFrom(src => src.AppointmentDate ?? default)
            )
            .ForMember(
                dest => dest.AppointmentType,
                opt => opt.MapFrom(src => src.AppointmentType ?? string.Empty)
            )
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason ?? string.Empty))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status ?? string.Empty))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes ?? string.Empty));
    }
}
