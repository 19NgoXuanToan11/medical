using API.DTOs;
using AutoMapper;
using Service.DTOs;

namespace API.MappingProfiles;

public class ExcelImportProfile : Profile
{
    public ExcelImportProfile()
    {
        // Map from Service DTOs to API DTOs
        CreateMap<Service.DTOs.ExcelImportDto.StudentRow, API.DTOs.ExcelImportDto.StudentRow>();
        CreateMap<Service.DTOs.ExcelImportDto.ParentRow, API.DTOs.ExcelImportDto.ParentRow>();
        CreateMap<Service.DTOs.ExcelImportDto.StudentParentRow, API.DTOs.ExcelImportDto.StudentParentRow>();
        CreateMap<Service.DTOs.ExcelImportDto.HealthProfileRow, API.DTOs.ExcelImportDto.HealthProfileRow>();
        CreateMap<Service.DTOs.ExcelImportDto.ImportResult, API.DTOs.ExcelImportDto.ImportResult>();

        // Map from API DTOs to Service DTOs
        CreateMap<API.DTOs.ExcelImportDto.StudentRow, Service.DTOs.ExcelImportDto.StudentRow>();
        CreateMap<API.DTOs.ExcelImportDto.ParentRow, Service.DTOs.ExcelImportDto.ParentRow>();
        CreateMap<API.DTOs.ExcelImportDto.StudentParentRow, Service.DTOs.ExcelImportDto.StudentParentRow>();
        CreateMap<API.DTOs.ExcelImportDto.HealthProfileRow, Service.DTOs.ExcelImportDto.HealthProfileRow>();
        CreateMap<API.DTOs.ExcelImportDto.ImportResult, Service.DTOs.ExcelImportDto.ImportResult>();
    }
} 