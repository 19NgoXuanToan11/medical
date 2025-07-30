using API.DTOs;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class ClassProfile : Profile
{
    public ClassProfile()
    {
        // Map from Class to ClassDto.ViewModel
        CreateMap<Class, ClassDto.ViewModel>()
            .ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));

        // Map from Student to ClassDto.StudentWithParents
        CreateMap<Student, ClassDto.StudentWithParents>()
            .ForMember(
                dest => dest.Parents,
                opt =>
                    opt.MapFrom(src =>
                        src.StudentParents.Select(sp => sp.Parent).Where(p => p != null)
                    )
            );

        // Map from Parent to ClassDto.ParentInfo
        CreateMap<Parent, ClassDto.ParentInfo>();

        // Map from ClassDto.Create to Class
        CreateMap<ClassDto.Create, Class>()
            .ForMember(dest => dest.ClassId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CurrentStudentCount, opt => opt.Ignore())
            .ForMember(dest => dest.Students, opt => opt.Ignore());

        // Map from ClassDto.Update to Class
        CreateMap<ClassDto.Update, Class>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CurrentStudentCount, opt => opt.Ignore())
            .ForMember(dest => dest.Students, opt => opt.Ignore());
    }
}
