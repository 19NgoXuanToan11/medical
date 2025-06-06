using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class RequestResultProfile : Profile
{
    public RequestResultProfile()
    {
        // Map from RequestResult to RequestResultDto.ViewModel
        CreateMap<RequestResult, RequestResultDto.ViewModel>();

        // Map from RequestResultDto.Create to RequestResult
        CreateMap<RequestResultDto.Create, RequestResult>()
            .ForMember(dest => dest.ResultId, opt => opt.Ignore())
            .ForMember(dest => dest.SubmittedAt, opt => opt.Ignore());

        // Map from RequestResultDto.Update to RequestResult
        CreateMap<RequestResultDto.Update, RequestResult>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 