using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class AppointmentProfile : Profile
{
    public AppointmentProfile()
    {
        // Map from Appointment to AppointmentDto.ViewModel
        CreateMap<Appointment, AppointmentDto.ViewModel>()
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student != null ? new StudentDto.ViewModel
            {
                StudentId = src.Student.StudentId,
                FirstName = src.Student.FirstName,
                LastName = src.Student.LastName,
                StudentCode = src.Student.StudentCode,
                ClassName = src.Student.ClassName,
                Gender = src.Student.Gender,
                Address = src.Student.Address,
                IsActive = src.Student.IsActive
            } : null))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent != null ? new ParentDto.ViewModel
            {
                ParentId = src.Parent.ParentId,
                FirstName = src.Parent.FirstName,
                LastName = src.Parent.LastName,
                Email = src.Parent.Email,
                Phone = src.Parent.Phone,
                Address = src.Parent.Address,
                Relationship = src.Parent.Relationship,
                IsMainContact = src.Parent.IsMainContact,
                IsEmergencyContact = src.Parent.IsEmergencyContact,
                IsActive = src.Parent.IsActive
            } : null))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff != null ? new StaffDto.ViewModel
            {
                StaffId = src.Staff.StaffId,
                FirstName = src.Staff.FirstName,
                LastName = src.Staff.LastName,
                Email = src.Staff.Email,
                Phone = src.Staff.Phone,
                Username = src.Staff.Username
            } : null));

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
            .ForMember(dest => dest.AppointmentDate, opt => opt.MapFrom(src => src.AppointmentDate ?? default))
            .ForMember(dest => dest.AppointmentType, opt => opt.MapFrom(src => src.AppointmentType ?? string.Empty))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason ?? string.Empty))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status ?? string.Empty))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes ?? string.Empty));
    }
} 