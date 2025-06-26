using AutoMapper;
using DB;
using API.DTOs;
using System.Linq;

namespace API.MappingProfiles;

public class RequestResultProfile : Profile
{
    public RequestResultProfile()
    {
        // Map from RequestResult to RequestResultDto.ViewModel
        CreateMap<RequestResult, RequestResultDto.ViewModel>()
            .ForMember(dest => dest.Frequency, opt => opt.MapFrom(src =>
                src.Request != null && src.Request.MedicineRequestItems != null && src.Request.MedicineRequestItems.Any()
                    ? string.Join(",", src.Request.MedicineRequestItems.Select(i => i.Frequency))
                    : null));

        // Map from RequestResultDto.Create to RequestResult
        CreateMap<RequestResultDto.Create, RequestResult>()
            .ForMember(dest => dest.ResultId, opt => opt.Ignore())
            .ForMember(dest => dest.SubmittedAt, opt => opt.Ignore());

        // Map from RequestResultDto.Update to RequestResult
        CreateMap<RequestResultDto.Update, RequestResult>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 