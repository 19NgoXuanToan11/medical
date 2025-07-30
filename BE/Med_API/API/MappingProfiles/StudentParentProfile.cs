using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class StudentParentProfile : Profile
{
    public StudentParentProfile()
    {
        CreateMap<StudentParent, StudentParentDto.ViewModel>()
            .ForMember(
                dest => dest.StudentName,
                opt =>
                    opt.MapFrom(src =>
                        src.Student != null
                            ? $"{src.Student.FirstName} {src.Student.LastName}"
                            : null
                    )
            )
            .ForMember(
                dest => dest.ParentName,
                opt =>
                    opt.MapFrom(src =>
                        src.Parent != null ? $"{src.Parent.FirstName} {src.Parent.LastName}" : null
                    )
            );

        CreateMap<StudentParentDto.Create, StudentParent>()
            .ForMember(dest => dest.StudentParentId, opt => opt.Ignore())
            .ForMember(dest => dest.Student, opt => opt.Ignore())
            .ForMember(dest => dest.Parent, opt => opt.Ignore());

        CreateMap<StudentParentDto.Update, StudentParent>()
            .ForMember(dest => dest.Student, opt => opt.Ignore())
            .ForMember(dest => dest.Parent, opt => opt.Ignore());
    }
}
