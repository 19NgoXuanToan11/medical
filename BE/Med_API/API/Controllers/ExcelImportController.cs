using API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using Service;
using Service.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Hosting;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAll")]
[Produces("application/json")]
public class ExcelImportController : ControllerBase
{
    private readonly IExcelImportService _excelImportService;
    private readonly IMapper _mapper;
    private readonly ILogger<ExcelImportController> _logger;
    private readonly IWebHostEnvironment _environment;

    public ExcelImportController(
        IExcelImportService excelImportService,
        IMapper mapper,
        ILogger<ExcelImportController> logger,
        IWebHostEnvironment environment)
    {
        _excelImportService = excelImportService;
        _mapper = mapper;
        _logger = logger;
        _environment = environment;
    }

    [HttpGet("template")]
    [EnableCors("AllowAll")] // Enable CORS for this specific endpoint
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult DownloadTemplate()
    {
        try
        {
            var templateDir = Path.Combine(Directory.GetCurrentDirectory(), "Templates");
            var filePath = Path.Combine(templateDir, "StudentImportTemplate.xlsx");

            // Create template directory if it doesn't exist
            if (!Directory.Exists(templateDir))
            {
                Directory.CreateDirectory(templateDir);
            }

            // Create template file if it doesn't exist
            if (!System.IO.File.Exists(filePath))
            {
                using var package = new ExcelPackage();
                
                // Create Students sheet
                var studentSheet = package.Workbook.Worksheets.Add("Students");
                AddHeaders(studentSheet, new[] {
                    "StudentCode*", "FirstName*", "LastName*", "DateOfBirth*", "Gender*", 
                    "Address", "ClassName*", "GradeLevel*"
                });
                AddStudentExampleData(studentSheet);
                AddStudentValidations(studentSheet);

                // Create Parents sheet
                var parentSheet = package.Workbook.Worksheets.Add("Parents");
                AddHeaders(parentSheet, new[] {
                    "StudentId*", "FirstName*", "LastName*", "Relationship*", "Phone*", 
                    "Email*", "Address", "Occupation", "IsEmergencyContact*", "IsMainContact*"
                });
                AddParentExampleData(parentSheet);
                AddParentValidations(parentSheet);

                // Create HealthProfiles sheet
                var healthSheet = package.Workbook.Worksheets.Add("HealthProfiles");
                AddHeaders(healthSheet, new[] {
                    "StudentId*", "HasAllergies*", "AllergyDetails", "HasChronicDiseases*", 
                    "ChronicDetails", "BloodType", "HasVisionIssues*", "VisionNotes", 
                    "LeftEye", "RightEye", "HasHearingIssues*", "HearingNotes", 
                    "LeftEar", "RightEar", "HasCompleteVaccinations*", "Vaccinations", 
                    "VaccinationDetails", "HasPreviousTreatment*", "TreatmentDetails", 
                    "Height", "Weight", "EmergencyContact", "OtherInfo"
                });
                AddHealthProfileExampleData(healthSheet);
                AddHealthProfileValidations(healthSheet);

                // Add instructions sheet
                var instructionsSheet = package.Workbook.Worksheets.Add("Instructions");
                AddInstructions(instructionsSheet);

                // Save the template
                package.SaveAs(new FileInfo(filePath));
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(
                fileBytes, 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                "StudentImportTemplate.xlsx",
                enableRangeProcessing: true
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading template");
            return StatusCode(500, "Error downloading template");
        }
    }

    private void AddHeaders(ExcelWorksheet worksheet, string[] headers)
    {
        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cells[1, i + 1].Value = headers[i];
            worksheet.Cells[1, i + 1].Style.Font.Bold = true;
            if (headers[i].EndsWith("*"))
            {
                worksheet.Cells[1, i + 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                worksheet.Cells[1, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightYellow);
            }
        }
    }

    private void AddStudentExampleData(ExcelWorksheet worksheet)
    {
        worksheet.Cells[2, 1].Value = "STU001";
        worksheet.Cells[2, 2].Value = "John";
        worksheet.Cells[2, 3].Value = "Doe";
        worksheet.Cells[2, 4].Value = "2010-01-15";
        worksheet.Cells[2, 5].Value = "M";
        worksheet.Cells[2, 6].Value = "123 Main St";
        worksheet.Cells[2, 7].Value = "Class 5A";
        worksheet.Cells[2, 8].Value = "5";
    }

    private void AddParentExampleData(ExcelWorksheet worksheet)
    {
        worksheet.Cells[2, 1].Value = "STU001";
        worksheet.Cells[2, 2].Value = "Jane";
        worksheet.Cells[2, 3].Value = "Doe";
        worksheet.Cells[2, 4].Value = "Mother";
        worksheet.Cells[2, 5].Value = "1234567890";
        worksheet.Cells[2, 6].Value = "jane.doe@email.com";
        worksheet.Cells[2, 7].Value = "123 Main St";
        worksheet.Cells[2, 8].Value = "Teacher";
        worksheet.Cells[2, 9].Value = "TRUE";
        worksheet.Cells[2, 10].Value = "TRUE";
    }

    private void AddHealthProfileExampleData(ExcelWorksheet worksheet)
    {
        worksheet.Cells[2, 1].Value = "STU001";
        worksheet.Cells[2, 2].Value = "TRUE";
        worksheet.Cells[2, 3].Value = "Peanut allergy";
        worksheet.Cells[2, 4].Value = "FALSE";
        worksheet.Cells[2, 5].Value = "";
        worksheet.Cells[2, 6].Value = "A+";
        worksheet.Cells[2, 7].Value = "FALSE";
        worksheet.Cells[2, 8].Value = "";
        worksheet.Cells[2, 9].Value = "20/20";
        worksheet.Cells[2, 10].Value = "20/20";
        worksheet.Cells[2, 11].Value = "FALSE";
        worksheet.Cells[2, 12].Value = "";
        worksheet.Cells[2, 13].Value = "Normal";
        worksheet.Cells[2, 14].Value = "Normal";
        worksheet.Cells[2, 15].Value = "Yes";
        worksheet.Cells[2, 16].Value = "MMR, DTaP, Polio";
        worksheet.Cells[2, 17].Value = "All vaccinations up to date";
        worksheet.Cells[2, 18].Value = "FALSE";
        worksheet.Cells[2, 19].Value = "";
        worksheet.Cells[2, 20].Value = "150";
        worksheet.Cells[2, 21].Value = "45";
        worksheet.Cells[2, 22].Value = "Jane Doe (Mother) - 1234567890";
        worksheet.Cells[2, 23].Value = "No special notes";
    }

    private void AddStudentValidations(ExcelWorksheet worksheet)
    {
        var genderValidation = worksheet.DataValidations.AddListValidation("E2:E1000");
        genderValidation.Formula.Values.Add("M");
        genderValidation.Formula.Values.Add("F");
    }

    private void AddParentValidations(ExcelWorksheet worksheet)
    {
        var relationshipValidation = worksheet.DataValidations.AddListValidation("D2:D1000");
        relationshipValidation.Formula.Values.Add("Mother");
        relationshipValidation.Formula.Values.Add("Father");
        relationshipValidation.Formula.Values.Add("Guardian");
        relationshipValidation.Formula.Values.Add("Other");

        var boolValidation = worksheet.DataValidations.AddListValidation("I2:J1000");
        boolValidation.Formula.Values.Add("TRUE");
        boolValidation.Formula.Values.Add("FALSE");
    }

    private void AddHealthProfileValidations(ExcelWorksheet worksheet)
    {
        var bloodTypeValidation = worksheet.DataValidations.AddListValidation("F2:F1000");
        bloodTypeValidation.Formula.Values.Add("A+");
        bloodTypeValidation.Formula.Values.Add("A-");
        bloodTypeValidation.Formula.Values.Add("B+");
        bloodTypeValidation.Formula.Values.Add("B-");
        bloodTypeValidation.Formula.Values.Add("AB+");
        bloodTypeValidation.Formula.Values.Add("AB-");
        bloodTypeValidation.Formula.Values.Add("O+");
        bloodTypeValidation.Formula.Values.Add("O-");

        var vaccinationValidation = worksheet.DataValidations.AddListValidation("O2:O1000");
        vaccinationValidation.Formula.Values.Add("Yes");
        vaccinationValidation.Formula.Values.Add("No");
        vaccinationValidation.Formula.Values.Add("Partial");

        var boolValidation1 = worksheet.DataValidations.AddListValidation("B2:B1000");
        boolValidation1.Formula.Values.Add("TRUE");
        boolValidation1.Formula.Values.Add("FALSE");

        var boolValidation2 = worksheet.DataValidations.AddListValidation("D2:D1000");
        boolValidation2.Formula.Values.Add("TRUE");
        boolValidation2.Formula.Values.Add("FALSE");

        var boolValidation3 = worksheet.DataValidations.AddListValidation("G2:G1000");
        boolValidation3.Formula.Values.Add("TRUE");
        boolValidation3.Formula.Values.Add("FALSE");

        var boolValidation4 = worksheet.DataValidations.AddListValidation("K2:K1000");
        boolValidation4.Formula.Values.Add("TRUE");
        boolValidation4.Formula.Values.Add("FALSE");

        var boolValidation5 = worksheet.DataValidations.AddListValidation("R2:R1000");
        boolValidation5.Formula.Values.Add("TRUE");
        boolValidation5.Formula.Values.Add("FALSE");
    }

    private void AddInstructions(ExcelWorksheet worksheet)
    {
        worksheet.Cells[1, 1].Value = "Student Import Template Instructions";
        worksheet.Cells[1, 1].Style.Font.Bold = true;
        worksheet.Cells[1, 1].Style.Font.Size = 14;

        int row = 3;
        worksheet.Cells[row++, 1].Value = "General Instructions:";
        worksheet.Cells[row++, 1].Value = "1. Fields marked with * are required";
        worksheet.Cells[row++, 1].Value = "2. StudentCode must be unique and must match across all sheets";
        worksheet.Cells[row++, 1].Value = "3. Each student can have multiple parents (add multiple rows in Parents sheet)";
        worksheet.Cells[row++, 1].Value = "4. Each student must have exactly one health profile";
        worksheet.Cells[row++, 1].Value = "5. All dates should be in YYYY-MM-DD format";
        worksheet.Cells[row++, 1].Value = "6. Height and Weight are in cm and kg respectively";

        row += 1;
        worksheet.Cells[row++, 1].Value = "Students Sheet:";
        worksheet.Cells[row++, 1].Value = "• Contains basic student information";
        worksheet.Cells[row++, 1].Value = "• Gender must be M or F";
        worksheet.Cells[row++, 1].Value = "• GradeLevel must be a number";

        row += 1;
        worksheet.Cells[row++, 1].Value = "Parents Sheet:";
        worksheet.Cells[row++, 1].Value = "• Contains parent/guardian information";
        worksheet.Cells[row++, 1].Value = "• Relationship must be one of: Mother, Father, Guardian, Other";
        worksheet.Cells[row++, 1].Value = "• IsEmergencyContact and IsMainContact must be TRUE or FALSE";
        worksheet.Cells[row++, 1].Value = "• Email must be a valid email address";
        worksheet.Cells[row++, 1].Value = "• Phone must be a valid phone number";

        row += 1;
        worksheet.Cells[row++, 1].Value = "HealthProfiles Sheet:";
        worksheet.Cells[row++, 1].Value = "• Contains student health information";
        worksheet.Cells[row++, 1].Value = "• BloodType must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-";
        worksheet.Cells[row++, 1].Value = "• HasCompleteVaccinations must be: Yes, No, or Partial";
        worksheet.Cells[row++, 1].Value = "• Boolean fields (TRUE/FALSE) must be exactly as shown";
        worksheet.Cells[row++, 1].Value = "• Vision and hearing measurements should be in standard format (e.g., 20/20)";
    }

    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(API.DTOs.ExcelImportDto.ImportResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [SwaggerOperation(
        Summary = "Import student data from Excel file",
        Description = "Uploads an Excel file containing student, parent, and health profile data. The file must follow the template format.",
        OperationId = "ImportStudentData",
        Tags = new[] { "Excel Import" }
    )]
    public async Task<ActionResult<API.DTOs.ExcelImportDto.ImportResult>> ImportStudentData(
        [FromForm] API.DTOs.ExcelImportDto.FileUploadModel model)
    {
        try
        {
            if (model?.File == null || model.File.Length == 0)
            {
                _logger.LogWarning("Import attempt with no file");
                return BadRequest("No file uploaded");
            }

            var file = model.File;
            if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Import attempt with invalid file type: {FileName}", file.FileName);
                return BadRequest("Only .xlsx files are supported");
            }

            // Log request details for debugging
            _logger.LogInformation("Request details - ContentType: {ContentType}, Length: {Length}, FileName: {FileName}",
                file.ContentType, file.Length, file.FileName);

            _logger.LogInformation("Starting import process for file: {FileName}, Size: {FileSize} bytes", 
                file.FileName, file.Length);

            var serviceResult = await _excelImportService.ImportStudentDataAsync(file);
            
            _logger.LogInformation("Import completed. Total: {Total}, Success: {Success}, Failed: {Failed}, Errors: {ErrorCount}", 
                serviceResult.TotalRows, 
                serviceResult.SuccessfullyImported, 
                serviceResult.FailedRows,
                serviceResult.Errors.Count);

            if (serviceResult.Errors.Any())
            {
                _logger.LogWarning("Import completed with errors: {Errors}", 
                    string.Join(", ", serviceResult.Errors));
            }

            var apiResult = _mapper.Map<API.DTOs.ExcelImportDto.ImportResult>(serviceResult);
            return Ok(apiResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing student data: {Message}", ex.Message);
            return StatusCode(500, $"Error importing student data: {ex.Message}");
        }
    }
} 