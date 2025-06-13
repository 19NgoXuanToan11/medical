using API.ViewModels;
using AutoMapper;
using DB;

namespace API.MappingProfiles;

public class BlogProfile : Profile
{
    public BlogProfile()
    {
        CreateMap<Blog, BlogDTO>();
        CreateMap<BlogDTO, Blog>();
    }
} 