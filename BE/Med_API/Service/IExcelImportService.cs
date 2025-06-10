using Microsoft.AspNetCore.Http;
using Service.DTOs;

namespace Service;

public interface IExcelImportService
{
    Task<ExcelImportDto.ImportResult> ImportStudentDataAsync(IFormFile file);
} 