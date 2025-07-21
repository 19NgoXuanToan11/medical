using AutoMapper;
using DB;
using API.DTOs;

namespace API.MappingProfiles;

public class MedicineRequestProfile : Profile
{
    public MedicineRequestProfile()
    {
        // Map from MedicineRequest to MedicineRequestDto.ViewModel
        CreateMap<MedicineRequest, MedicineRequestDto.ViewModel>()
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode ?? (src.Student != null ? src.Student.StudentCode : null)))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.ClassName))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.MedicineRequestItems, opt => opt.MapFrom(src => src.MedicineRequestItems))
            .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent))
            .ForMember(dest => dest.Staff, opt => opt.MapFrom(src => src.Staff));

        // Map from MedicineRequestDto.Create to MedicineRequest
        CreateMap<MedicineRequestDto.Create, MedicineRequest>()
            .ForMember(dest => dest.RequestId, opt => opt.Ignore())
            .ForMember(dest => dest.RequestDate, opt => opt.Ignore())
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.StudentCode))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.ClassName))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.MedicineRequestItems, opt => opt.MapFrom(src => src.MedicineRequestItems));

        // Map from MedicineRequestDto.Update to MedicineRequest
        CreateMap<MedicineRequestDto.Update, MedicineRequest>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Map from MedicineRequestItem to MedicineRequestItemDto.ViewModel
        CreateMap<MedicineRequestItem, MedicineRequestItemDto.ViewModel>()
            .ForMember(dest => dest.Period, opt => opt.MapFrom(src => src.Period))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => NormalizeVerificationStatus(src.VerificationStatus)))
            .ForMember(dest => dest.PeriodVerificationStatus, opt => opt.MapFrom(src => ParsePeriodVerificationStatus(src.VerificationStatus, src.Period)));

        // Map from MedicineRequestItemDto.Create to MedicineRequestItem
        CreateMap<MedicineRequestItemDto.Create, MedicineRequestItem>()
            .ForMember(dest => dest.MedicineRequestItemId, opt => opt.Ignore())
            .ForMember(dest => dest.MedicineRequest, opt => opt.Ignore())
            .ForMember(dest => dest.Period, opt => opt.MapFrom(src => src.TimeOfDay))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => InitPeriodVerificationStatus(src.TimeOfDay)));

        // Map from MedicineRequestItemDto.Update to MedicineRequestItem
        CreateMap<MedicineRequestItemDto.Update, MedicineRequestItem>()
            .ForMember(dest => dest.Period, opt => opt.MapFrom(src => src.TimeOfDay))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => src.VerificationStatus))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }

    private static string? ExtractPeriodsFromFrequency(string? frequency)
    {
        if (string.IsNullOrEmpty(frequency)) return null;
        var periods = new[] { "Sáng", "Trưa", "Chiều", "Tối" };
        var found = new List<string>();
        foreach (var period in periods)
        {
            if (frequency.IndexOf(period, StringComparison.OrdinalIgnoreCase) >= 0)
                found.Add(period);
        }
        if (found.Count > 0)
            return string.Join(", ", found);

        // Handle generic cases like '2 lần', '3 lần', etc.
        if (frequency.Contains("2")) return "Sáng, Trưa";
        if (frequency.Contains("3")) return "Sáng, Trưa, Chiều";
        if (frequency.Contains("4")) return "Sáng, Trưa, Chiều, Tối";
        if (frequency.Contains("1")) return "Sáng";

        return null;
    }

    private static string? NormalizeVerificationStatus(string? status)
    {
        if (string.IsNullOrEmpty(status) || status == "string")
            return "Pending";
        return status;
    }

    // Change from private to public so it can be accessed from controllers
    public static Dictionary<string, object> ParsePeriodVerificationStatus(string? jsonOrStatus, string? periodField = null)
    {
        if (string.IsNullOrEmpty(jsonOrStatus))
            return new Dictionary<string, object>();

        var simpleStatuses = new[] { "Pending", "Verified", "Assigned", "Completed", "Refused" };
        if (simpleStatuses.Contains(jsonOrStatus))
        {
            var periods = new[] { "Sáng", "Trưa", "Chiều", "Tối" };
            if (!string.IsNullOrEmpty(periodField))
            {
                periods = periodField.Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToArray();
            }
            return periods.ToDictionary(p => p, p => (object)jsonOrStatus);
        }

        try
        {
            var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonOrStatus);
            if (dict == null)
                return new Dictionary<string, object>();
            var result = new Dictionary<string, object>();
            foreach (var kv in dict)
            {
                if (kv.Value is System.Text.Json.JsonElement elem)
                {
                    if (elem.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        var strVal = elem.GetString();
                        if (!string.IsNullOrEmpty(strVal) && strVal.StartsWith("["))
                        {
                            // Parse stringified array
                            try
                            {
                                var parsedArr = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(strVal);
                                result[kv.Key] = parsedArr;
                            }
                            catch { result[kv.Key] = strVal; }
                        }
                        else if (!string.IsNullOrEmpty(strVal) && strVal.StartsWith("{") && strVal.Contains("Status"))
                        {
                            // Parse stringified object
                            try
                            {
                                var parsedElem = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(strVal);
                                result[kv.Key] = parsedElem;
                            }
                            catch { result[kv.Key] = strVal; }
                        }
                        else
                        {
                            result[kv.Key] = strVal;
                        }
                    }
                    else if (elem.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        result[kv.Key] = elem;
                    }
                    else if (elem.ValueKind == System.Text.Json.JsonValueKind.Object)
                    {
                        result[kv.Key] = elem;
                    }
                }
            }
            return result;
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }

    private static string InitPeriodVerificationStatus(string? timeOfDay)
    {
        var periods = (timeOfDay ?? "").Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToList();
        var dict = new Dictionary<string, string>();
        foreach (var period in periods)
        {
            dict[period] = "Pending";
        }
        return System.Text.Json.JsonSerializer.Serialize(dict);
    }
} 