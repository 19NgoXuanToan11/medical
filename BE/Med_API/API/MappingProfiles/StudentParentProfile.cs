using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class StudentParentProfile : Profile
{
    public StudentParentProfile()
    {
        CreateMap<StudentParent, StudentParentDto.ViewModel>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => $"{src.Student.FirstName} {src.Student.LastName}"))
            .ForMember(dest => dest.ParentName, opt => opt.MapFrom(src => $"{src.Parent.FirstName} {src.Parent.LastName}"));

        CreateMap<StudentParentDto.Create, StudentParent>();

        CreateMap<StudentParentDto.Update, StudentParent>();
    }
} 