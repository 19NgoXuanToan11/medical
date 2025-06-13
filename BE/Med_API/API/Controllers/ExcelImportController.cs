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
            using var package = new ExcelPackage();
            
            // Add Students sheet
            var studentSheet = package.Workbook.Worksheets.Add("Students");
            var studentHeaders = new[]
            {
                "StudentCode*", "FirstName*", "LastName*", "DateOfBirth*", "Gender*", 
                "Address", "ClassName*", "GradeLevel*", "Password*"
            };
            AddHeaders(studentSheet, studentHeaders);
            AddStudentExampleData(studentSheet);
            AddStudentValidations(studentSheet);
            studentSheet.Cells.AutoFitColumns();

            // Add Parents sheet
            var parentSheet = package.Workbook.Worksheets.Add("Parents");
            var parentHeaders = new[]
            {
                "StudentCode*", "FirstName*", "LastName*", "Relationship*", "Phone*", 
                "Email*", "Address", "Occupation", "IsEmergencyContact*", "IsMainContact*", "Password*"
            };
            AddHeaders(parentSheet, parentHeaders);
            AddParentExampleData(parentSheet);
            AddParentValidations(parentSheet);
            parentSheet.Cells.AutoFitColumns();

            // Add HealthProfiles sheet
            var healthSheet = package.Workbook.Worksheets.Add("HealthProfiles");
            var healthHeaders = new[]
            {
                "StudentCode*", "HasAllergies*", "AllergyDetails", "HasChronicDiseases*", 
                "ChronicDetails", "BloodType", "HasVisionIssues*", "VisionNotes", 
                "LeftEye", "RightEye", "HasHearingIssues*", "HearingNotes", 
                "LeftEar", "RightEar", "HasCompleteVaccinations*", "Vaccinations", 
                "VaccinationDetails", "HasPreviousTreatment*", "TreatmentDetails", 
                "Height", "Weight", "EmergencyContact", "OtherInfo"
            };
            AddHeaders(healthSheet, healthHeaders);
            AddHealthProfileExampleData(healthSheet);
            AddHealthProfileValidations(healthSheet);
            healthSheet.Cells.AutoFitColumns();

            // Add instructions sheet
            var instructionsSheet = package.Workbook.Worksheets.Add("Instructions");
            AddInstructions(instructionsSheet);
            instructionsSheet.Cells.AutoFitColumns();

            // Set the first sheet as active
            package.Workbook.Worksheets[0].Select();

            // Generate the Excel file
            var content = package.GetAsByteArray();
            var fileName = $"StudentImportTemplate_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Excel template");
            return StatusCode(500, "Error generating template: " + ex.Message);
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
        worksheet.Cells[2, 9].Value = "password123";
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
        worksheet.Cells[2, 11].Value = "password123";
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
        // Gender validation
        var genderValidation = worksheet.DataValidations.AddListValidation("E2:E1000");
        genderValidation.Formula.Values.Add("M");
        genderValidation.Formula.Values.Add("F");
        genderValidation.ShowErrorMessage = true;
        genderValidation.Error = "Please select M or F for gender";

        // Grade level validation (1-12)
        var gradeValidation = worksheet.DataValidations.AddIntegerValidation("H2:H1000");
        gradeValidation.Operator = OfficeOpenXml.DataValidation.ExcelDataValidationOperator.between;
        gradeValidation.Formula.Value = 1;
        gradeValidation.Formula2.Value = 12;
        gradeValidation.ShowErrorMessage = true;
        gradeValidation.Error = "Grade level must be between 1 and 12";

        // Password validation (minimum 6 characters)
        var passwordValidation = worksheet.DataValidations.AddTextLengthValidation("I2:I1000");
        passwordValidation.Operator = OfficeOpenXml.DataValidation.ExcelDataValidationOperator.greaterThanOrEqual;
        passwordValidation.Formula.Value = 6;
        passwordValidation.ShowErrorMessage = true;
        passwordValidation.Error = "Password must be at least 6 characters long";
    }

    private void AddParentValidations(ExcelWorksheet worksheet)
    {
        var relationshipValidation = worksheet.DataValidations.AddListValidation("D2:D1000");
        relationshipValidation.Formula.Values.Add("Mother");
        relationshipValidation.Formula.Values.Add("Father");
        relationshipValidation.Formula.Values.Add("Guardian");
        relationshipValidation.Formula.Values.Add("Other");
        relationshipValidation.ShowErrorMessage = true;
        relationshipValidation.Error = "Please select a valid relationship";

        var boolValidation = worksheet.DataValidations.AddListValidation("I2:J1000");
        boolValidation.Formula.Values.Add("TRUE");
        boolValidation.Formula.Values.Add("FALSE");
        boolValidation.ShowErrorMessage = true;
        boolValidation.Error = "Please select TRUE or FALSE";

        // Email validation
        var emailValidation = worksheet.DataValidations.AddCustomValidation("F2:F1000");
        emailValidation.Formula.ExcelFormula = "=ISNUMBER(MATCH(\"*@*.*\",F2,0))";
        emailValidation.ShowErrorMessage = true;
        emailValidation.Error = "Please enter a valid email address";

        // Phone validation (numbers only)
        var phoneValidation = worksheet.DataValidations.AddTextLengthValidation("E2:E1000");
        phoneValidation.Operator = OfficeOpenXml.DataValidation.ExcelDataValidationOperator.greaterThanOrEqual;
        phoneValidation.Formula.Value = 10;
        phoneValidation.ShowErrorMessage = true;
        phoneValidation.Error = "Phone number must be at least 10 digits";

        // Password validation (minimum 6 characters)
        var passwordValidation = worksheet.DataValidations.AddTextLengthValidation("K2:K1000");
        passwordValidation.Operator = OfficeOpenXml.DataValidation.ExcelDataValidationOperator.greaterThanOrEqual;
        passwordValidation.Formula.Value = 6;
        passwordValidation.ShowErrorMessage = true;
        passwordValidation.Error = "Password must be at least 6 characters long";
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
        worksheet.Cells[1, 1].Value = "Instructions for Excel Import";
        worksheet.Cells[1, 1].Style.Font.Bold = true;
        worksheet.Cells[1, 1].Style.Font.Size = 14;

        int row = 3;
        worksheet.Cells[row++, 1].Value = "General Instructions:";
        worksheet.Cells[row++, 1].Value = "1. All sheets (Students, Parents, HealthProfiles) must be filled out completely.";
        worksheet.Cells[row++, 1].Value = "2. Fields marked with * are required.";
        worksheet.Cells[row++, 1].Value = "3. Each student must have at least one parent and one health profile.";
        worksheet.Cells[row++, 1].Value = "4. StudentCode must be unique and will be used to link students with their parents and health profiles.";
        worksheet.Cells[row++, 1].Value = "5. Passwords for both students and parents must be at least 6 characters long.";
        worksheet.Cells[row++, 1].Value = "6. Grade level must be between 1 and 12.";
        worksheet.Cells[row++, 1].Value = "7. Gender must be either 'M' or 'F'.";
        worksheet.Cells[row++, 1].Value = "8. Relationship must be one of: Mother, Father, Guardian, Other.";
        worksheet.Cells[row++, 1].Value = "9. Email addresses must be in a valid format.";
        worksheet.Cells[row++, 1].Value = "10. Phone numbers must be at least 10 digits.";
        worksheet.Cells[row++, 1].Value = "11. Blood type must be in the format: A+, A-, B+, B-, AB+, AB-, O+, O-";
        worksheet.Cells[row++, 1].Value = "12. Height should be in centimeters (0-300).";
        worksheet.Cells[row++, 1].Value = "13. Weight should be in kilograms (0-500).";
        worksheet.Cells[row++, 1].Value = "14. Boolean fields (HasAllergies, HasChronicDiseases, etc.) must be TRUE or FALSE.";
        worksheet.Cells[row++, 1].Value = "15. Date of birth must be in YYYY-MM-DD format.";

        // Format the instructions
        var range = worksheet.Cells[1, 1, row - 1, 1];
        range.Style.WrapText = true;
        range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
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