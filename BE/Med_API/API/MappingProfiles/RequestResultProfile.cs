using AutoMapper;
using DB;
using API.DTOs;
using System.Linq;
using System.Collections.Generic;
using System.Text.Json;

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
                    : null))
            .ForMember(dest => dest.AdministeredFrequencies, opt => opt.MapFrom(src =>
                DeserializeStringList(src.AdministeredFrequencies)))
            .ForMember(dest => dest.FailedFrequencies, opt => opt.MapFrom(src =>
                DeserializeStringList(src.FailedFrequencies)))
            .ForMember(dest => dest.FailureReasons, opt => opt.MapFrom(src =>
                DeserializeStringDict(src.FailureReasons)));

        // Map from RequestResultDto.Create to RequestResult
        CreateMap<RequestResultDto.Create, RequestResult>()
            .ForMember(dest => dest.ResultId, opt => opt.Ignore())
            .ForMember(dest => dest.SubmittedAt, opt => opt.Ignore());

        // Map from RequestResultDto.Update to RequestResult
        CreateMap<RequestResultDto.Update, RequestResult>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }

    private static List<string> DeserializeStringList(string? json)
    {
        return string.IsNullOrEmpty(json)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(json, new System.Text.Json.JsonSerializerOptions());
    }

    private static Dictionary<string, string> DeserializeStringDict(string? json)
    {
        return string.IsNullOrEmpty(json)
            ? new Dictionary<string, string>()
            : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(json, new System.Text.Json.JsonSerializerOptions());
    }
} 