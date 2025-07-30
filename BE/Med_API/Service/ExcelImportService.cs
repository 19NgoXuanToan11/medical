using System.ComponentModel.DataAnnotations;
using DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Repo;
using Service.DTOs;

namespace Service;

public class ExcelImportService : IExcelImportService
{
    private readonly IExcelImportRepository _repository;
    private readonly ILogger<ExcelImportService> _logger;

    public ExcelImportService(IExcelImportRepository repository, ILogger<ExcelImportService> logger)
    {
        _repository = repository;
        _logger = logger;
        // Set EPPlus license for non-commercial use
        ExcelPackage.License.SetNonCommercialPersonal("Medical API");
    }

    public async Task<ExcelImportDto.ImportResult> ImportStudentDataAsync(IFormFile file)
    {
        var result = new ExcelImportDto.ImportResult();
        var studentRows = new List<ExcelImportDto.StudentRow>();
        var parentRows = new List<ExcelImportDto.ParentRow>();
        var studentParentRows = new List<ExcelImportDto.StudentParentRow>();
        var healthProfileRows = new List<ExcelImportDto.HealthProfileRow>();

        try
        {
            _logger.LogInformation("Starting to process Excel file");

            // Read Excel file
            using var stream = file.OpenReadStream();
            using var package = new ExcelPackage(stream);

            // Read Students sheet
            var studentSheet = package.Workbook.Worksheets["Students"];
            if (studentSheet == null)
            {
                throw new Exception("Students sheet not found");
            }
            _logger.LogInformation(
                "Reading Students sheet with {RowCount} rows",
                studentSheet.Dimension.End.Row - 1
            );
            var studentHeaders = studentSheet
                .Cells[1, 1, 1, studentSheet.Dimension.End.Column]
                .Select(c => c.Text)
                .ToList();
            for (int row = 2; row <= studentSheet.Dimension.End.Row; row++)
            {
                var studentRow = new ExcelImportDto.StudentRow
                {
                    StudentCode = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "StudentCode*")]
                        .Text,
                    FirstName = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "FirstName*")]
                        .Text,
                    LastName = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "LastName*")]
                        .Text,
                    DateOfBirth = DateOnly.Parse(
                        studentSheet.Cells[row, GetColumnIndex(studentHeaders, "DateOfBirth*")].Text
                    ),
                    Gender = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "Gender*")]
                        .Text,
                    Address = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "Address")]
                        .Text,
                    ClassName = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "ClassName*")]
                        .Text,
                    GradeLevel = int.Parse(
                        studentSheet.Cells[row, GetColumnIndex(studentHeaders, "GradeLevel*")].Text
                    ),
                    Password = studentSheet
                        .Cells[row, GetColumnIndex(studentHeaders, "Password*")]
                        .Text,
                };
                studentRows.Add(studentRow);
            }

            // Read Parents sheet
            var parentSheet = package.Workbook.Worksheets["Parents"];
            if (parentSheet == null)
            {
                throw new Exception("Parents sheet not found");
            }
            _logger.LogInformation(
                "Reading Parents sheet with {RowCount} rows",
                parentSheet.Dimension.End.Row - 1
            );
            var parentHeaders = parentSheet
                .Cells[1, 1, 1, parentSheet.Dimension.End.Column]
                .Select(c => c.Text)
                .ToList();
            for (int row = 2; row <= parentSheet.Dimension.End.Row; row++)
            {
                var parentRow = new ExcelImportDto.ParentRow
                {
                    FirstName = parentSheet
                        .Cells[row, GetColumnIndex(parentHeaders, "FirstName*")]
                        .Text,
                    LastName = parentSheet
                        .Cells[row, GetColumnIndex(parentHeaders, "LastName*")]
                        .Text,
                    Relationship = parentSheet
                        .Cells[row, GetColumnIndex(parentHeaders, "Relationship*")]
                        .Text,
                    Phone = parentSheet.Cells[row, GetColumnIndex(parentHeaders, "Phone*")].Text,
                    Email = parentSheet.Cells[row, GetColumnIndex(parentHeaders, "Email*")].Text,
                    Address = parentSheet.Cells[row, GetColumnIndex(parentHeaders, "Address")].Text,
                    Occupation = parentSheet
                        .Cells[row, GetColumnIndex(parentHeaders, "Occupation")]
                        .Text,
                    IsEmergencyContact = bool.Parse(
                        parentSheet
                            .Cells[row, GetColumnIndex(parentHeaders, "IsEmergencyContact*")]
                            .Text
                    ),
                    IsMainContact = bool.Parse(
                        parentSheet.Cells[row, GetColumnIndex(parentHeaders, "IsMainContact*")].Text
                    ),
                    Password = parentSheet
                        .Cells[row, GetColumnIndex(parentHeaders, "Password*")]
                        .Text,
                };
                parentRows.Add(parentRow);
            }

            // Read StudentParentRelationships sheet
            var relationshipSheet = package.Workbook.Worksheets["StudentParentRelationships"];
            if (relationshipSheet == null)
            {
                throw new Exception("StudentParentRelationships sheet not found");
            }
            _logger.LogInformation(
                "Reading StudentParentRelationships sheet with {RowCount} rows",
                relationshipSheet.Dimension.End.Row - 1
            );
            var relationshipHeaders = relationshipSheet
                .Cells[1, 1, 1, relationshipSheet.Dimension.End.Column]
                .Select(c => c.Text)
                .ToList();
            for (int row = 2; row <= relationshipSheet.Dimension.End.Row; row++)
            {
                var relationshipRow = new ExcelImportDto.StudentParentRow
                {
                    StudentCode = relationshipSheet
                        .Cells[row, GetColumnIndex(relationshipHeaders, "StudentCode*")]
                        .Text,
                    ParentEmail = relationshipSheet
                        .Cells[row, GetColumnIndex(relationshipHeaders, "ParentEmail*")]
                        .Text,
                };
                studentParentRows.Add(relationshipRow);
            }

            // Read HealthProfiles sheet
            var healthSheet = package.Workbook.Worksheets["HealthProfiles"];
            if (healthSheet == null)
            {
                throw new Exception("HealthProfiles sheet not found");
            }
            _logger.LogInformation(
                "Reading HealthProfiles sheet with {RowCount} rows",
                healthSheet.Dimension.End.Row - 1
            );
            var healthHeaders = healthSheet
                .Cells[1, 1, 1, healthSheet.Dimension.End.Column]
                .Select(c => c.Text)
                .ToList();
            for (int row = 2; row <= healthSheet.Dimension.End.Row; row++)
            {
                var healthRow = new ExcelImportDto.HealthProfileRow
                {
                    StudentCode = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "StudentCode*")]
                        .Text,
                    HasAllergies = bool.Parse(
                        healthSheet.Cells[row, GetColumnIndex(healthHeaders, "HasAllergies*")].Text
                    ),
                    AllergyDetails = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "AllergyDetails")]
                        .Text,
                    HasChronicDiseases = bool.Parse(
                        healthSheet
                            .Cells[row, GetColumnIndex(healthHeaders, "HasChronicDiseases*")]
                            .Text
                    ),
                    ChronicDetails = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "ChronicDetails")]
                        .Text,
                    BloodType = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "BloodType")]
                        .Text,
                    HasVisionIssues = bool.Parse(
                        healthSheet
                            .Cells[row, GetColumnIndex(healthHeaders, "HasVisionIssues*")]
                            .Text
                    ),
                    VisionNotes = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "VisionNotes")]
                        .Text,
                    LeftEye = healthSheet.Cells[row, GetColumnIndex(healthHeaders, "LeftEye")].Text,
                    RightEye = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "RightEye")]
                        .Text,
                    HasHearingIssues = bool.Parse(
                        healthSheet
                            .Cells[row, GetColumnIndex(healthHeaders, "HasHearingIssues*")]
                            .Text
                    ),
                    HearingNotes = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "HearingNotes")]
                        .Text,
                    LeftEar = healthSheet.Cells[row, GetColumnIndex(healthHeaders, "LeftEar")].Text,
                    RightEar = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "RightEar")]
                        .Text,
                    HasCompleteVaccinations = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "HasCompleteVaccinations*")]
                        .Text,
                    Vaccinations = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "Vaccinations")]
                        .Text,
                    VaccinationDetails = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "VaccinationDetails")]
                        .Text,
                    HasPreviousTreatment = bool.Parse(
                        healthSheet
                            .Cells[row, GetColumnIndex(healthHeaders, "HasPreviousTreatment*")]
                            .Text
                    ),
                    TreatmentDetails = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "TreatmentDetails")]
                        .Text,
                    Height = decimal.TryParse(
                        healthSheet.Cells[row, GetColumnIndex(healthHeaders, "Height")].Text,
                        out var height
                    )
                        ? height
                        : null,
                    Weight = decimal.TryParse(
                        healthSheet.Cells[row, GetColumnIndex(healthHeaders, "Weight")].Text,
                        out var weight
                    )
                        ? weight
                        : null,
                    EmergencyContact = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "EmergencyContact")]
                        .Text,
                    OtherInfo = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "OtherInfo")]
                        .Text,
                    BloodPressure = healthSheet
                        .Cells[row, GetColumnIndex(healthHeaders, "BloodPressure")]
                        .Text,
                    HeartRate = int.TryParse(
                        healthSheet.Cells[row, GetColumnIndex(healthHeaders, "HeartRate")].Text,
                        out var heartRate
                    )
                        ? heartRate
                        : null,
                };
                healthProfileRows.Add(healthRow);
            }

            result.TotalRows = studentRows.Count;
            _logger.LogInformation(
                "Found {StudentCount} students, {ParentCount} parents, {RelationshipCount} relationships, {HealthProfileCount} health profiles",
                studentRows.Count,
                parentRows.Count,
                studentParentRows.Count,
                healthProfileRows.Count
            );

            // Check for duplicates in database
            _logger.LogInformation("Checking for database duplicates");
            await CheckDatabaseDuplicatesAsync(studentRows, parentRows, studentParentRows, result);

            // Validate data consistency
            _logger.LogInformation("Validating data consistency");
            ValidateDataConsistency(
                studentRows,
                parentRows,
                studentParentRows,
                healthProfileRows,
                result
            );

            if (result.Errors.Any())
            {
                _logger.LogWarning(
                    "Validation failed with {ErrorCount} errors",
                    result.Errors.Count
                );
                return result;
            }

            // Process rows in batches of 50
            _logger.LogInformation(
                "Starting batch processing of {TotalRows} rows",
                studentRows.Count
            );
            for (int i = 0; i < studentRows.Count; i += 50)
            {
                var studentBatch = studentRows.Skip(i).Take(50).ToList();
                var parentBatch = parentRows.ToList(); // Process all parents
                var relationshipBatch = studentParentRows
                    .Where(r => studentBatch.Select(s => s.StudentCode).Contains(r.StudentCode))
                    .ToList();
                var healthBatch = healthProfileRows
                    .Where(h => studentBatch.Select(s => s.StudentCode).Contains(h.StudentCode))
                    .ToList();

                _logger.LogInformation(
                    "Processing batch {BatchNumber} with {StudentCount} students",
                    (i / 50) + 1,
                    studentBatch.Count
                );

                await ProcessBatchAsync(
                    studentBatch,
                    parentBatch,
                    relationshipBatch,
                    healthBatch,
                    result
                );
            }

            _logger.LogInformation(
                "Import completed successfully. Imported {SuccessCount} out of {TotalCount} rows",
                result.SuccessfullyImported,
                result.TotalRows
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Excel file");
            result.Errors.Add($"Error processing file: {ex.Message}");
        }

        return result;
    }

    private async Task CheckDatabaseDuplicatesAsync(
        List<ExcelImportDto.StudentRow> students,
        List<ExcelImportDto.ParentRow> parents,
        List<ExcelImportDto.StudentParentRow> relationships,
        ExcelImportDto.ImportResult result
    )
    {
        // Get existing data from database
        var existingStudentCodes = (await _repository.GetExistingStudentCodesAsync()).ToList();
        var existingParentEmails = (await _repository.GetExistingParentEmailsAsync()).ToList();
        var existingParentPhones = (await _repository.GetExistingParentPhonesAsync()).ToList();
        var existingStudentParentRelations =
            await _repository.GetExistingStudentParentRelationsAsync();

        // Check for duplicate student codes in import file
        var duplicateStudentCodes = students
            .GroupBy(s => s.StudentCode)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        foreach (var code in duplicateStudentCodes)
        {
            result.Errors.Add($"Duplicate student code found in import file: {code}");
            result.FailedRows++;
        }

        // Check for duplicate parent emails in import file
        var duplicateParentEmails = parents
            .GroupBy(p => p.Email)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        foreach (var email in duplicateParentEmails)
        {
            result.Errors.Add($"Duplicate parent email found in import file: {email}");
            result.FailedRows++;
        }

        // Check for duplicate parent phones in import file
        var duplicateParentPhones = parents
            .GroupBy(p => p.Phone)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        foreach (var phone in duplicateParentPhones)
        {
            result.Errors.Add($"Duplicate parent phone found in import file: {phone}");
            result.FailedRows++;
        }

        // Check for duplicate relationships in import file
        var duplicateRelationships = relationships
            .GroupBy(r => new { r.StudentCode, r.ParentEmail })
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        foreach (var relation in duplicateRelationships)
        {
            result.Errors.Add(
                $"Duplicate student-parent relationship found in import file: Student {relation.StudentCode} with Parent {relation.ParentEmail}"
            );
            result.FailedRows++;
        }

        // Check for existing student-parent relationships in database
        foreach (var relationship in relationships)
        {
            var studentCode = relationship.StudentCode;
            var parentEmail = relationship.ParentEmail;

            if (
                existingStudentParentRelations.Any(r =>
                    r.StudentCode == studentCode && r.ParentEmail == parentEmail
                )
            )
            {
                result.Errors.Add(
                    $"Student-parent relationship already exists in database: Student {studentCode} with Parent {parentEmail}"
                );
                result.FailedRows++;
            }
        }
    }

    private void ValidateDataConsistency(
        List<ExcelImportDto.StudentRow> students,
        List<ExcelImportDto.ParentRow> parents,
        List<ExcelImportDto.StudentParentRow> relationships,
        List<ExcelImportDto.HealthProfileRow> healthProfiles,
        ExcelImportDto.ImportResult result
    )
    {
        // Check for duplicate student codes within the file
        var duplicateStudentCodes = students
            .GroupBy(s => s.StudentCode)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key);
        foreach (var code in duplicateStudentCodes)
        {
            result.Errors.Add($"Duplicate StudentCode found in file: {code}");
        }

        // Check for students without relationships
        var studentsWithoutRelationships = students
            .Select(s => s.StudentCode)
            .Except(relationships.Select(r => r.StudentCode));
        foreach (var code in studentsWithoutRelationships)
        {
            result.Errors.Add($"Student {code} has no parent relationships");
        }

        // Check for students without health profiles
        var studentsWithoutHealthProfiles = students
            .Select(s => s.StudentCode)
            .Except(healthProfiles.Select(h => h.StudentCode));
        foreach (var code in studentsWithoutHealthProfiles)
        {
            result.Errors.Add($"Student {code} has no health profile information");
        }

        // Check for duplicate health profiles
        var duplicateHealthProfiles = healthProfiles
            .GroupBy(h => h.StudentCode)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key);
        foreach (var code in duplicateHealthProfiles)
        {
            result.Errors.Add($"Student {code} has multiple health profiles");
        }

        // Check for orphaned relationship records
        var validStudentCodes = students.Select(s => s.StudentCode).ToHashSet();
        var validParentEmails = parents.Select(p => p.Email).ToHashSet();

        var orphanedRelationships = relationships.Where(r =>
            !validStudentCodes.Contains(r.StudentCode) || !validParentEmails.Contains(r.ParentEmail)
        );

        foreach (var relationship in orphanedRelationships)
        {
            if (!validStudentCodes.Contains(relationship.StudentCode))
            {
                result.Errors.Add(
                    $"Relationship record for non-existent student: {relationship.StudentCode}"
                );
            }
            if (!validParentEmails.Contains(relationship.ParentEmail))
            {
                result.Errors.Add(
                    $"Relationship record for non-existent parent: {relationship.ParentEmail}"
                );
            }
        }

        var orphanedHealthProfiles = healthProfiles
            .Where(h => !validStudentCodes.Contains(h.StudentCode))
            .Select(h => h.StudentCode);
        foreach (var code in orphanedHealthProfiles)
        {
            result.Errors.Add($"Health profile for non-existent student: {code}");
        }

        // Check for duplicate parent emails within the file
        var duplicateParentEmails = parents
            .Where(p => !string.IsNullOrEmpty(p.Email))
            .GroupBy(p => p.Email)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key);
        foreach (var email in duplicateParentEmails)
        {
            result.Errors.Add($"Duplicate parent email found in file: {email}");
        }

        // Check for duplicate parent phones within the file
        var duplicateParentPhones = parents
            .GroupBy(p => p.Phone)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key);
        foreach (var phone in duplicateParentPhones)
        {
            result.Errors.Add($"Duplicate parent phone number found in file: {phone}");
        }

        // Update failed rows count
        result.FailedRows +=
            duplicateStudentCodes.Count()
            + studentsWithoutRelationships.Count()
            + studentsWithoutHealthProfiles.Count()
            + duplicateHealthProfiles.Count()
            + orphanedRelationships.Count()
            + orphanedHealthProfiles.Count()
            + duplicateParentEmails.Count()
            + duplicateParentPhones.Count();
    }

    private async Task ProcessBatchAsync(
        List<ExcelImportDto.StudentRow> studentBatch,
        List<ExcelImportDto.ParentRow> parentBatch,
        List<ExcelImportDto.StudentParentRow> relationshipBatch,
        List<ExcelImportDto.HealthProfileRow> healthBatch,
        ExcelImportDto.ImportResult result
    )
    {
        // Create a mapping of parent email to parent data for reuse
        var parentEmailToParentData = parentBatch.ToDictionary(p => p.Email, p => p);

        // Then process each student
        foreach (var studentRow in studentBatch)
        {
            try
            {
                _logger.LogInformation("Processing student {StudentCode}", studentRow.StudentCode);

                // Ensure ClassId is set by looking up or creating the class
                var classEntity = await _repository.GetOrCreateClassAsync(
                    studentRow.ClassName,
                    studentRow.GradeLevel
                );
                if (classEntity == null)
                {
                    result.FailedRows++;
                    result.Errors.Add(
                        $"Class '{studentRow.ClassName}' (Grade {studentRow.GradeLevel}) not found or could not be created for student {studentRow.StudentCode}"
                    );
                    continue;
                }

                // Validate student data
                var validationContext = new ValidationContext(studentRow);
                var validationResults = new List<ValidationResult>();
                if (
                    !Validator.TryValidateObject(
                        studentRow,
                        validationContext,
                        validationResults,
                        true
                    )
                )
                {
                    result.FailedRows++;
                    var errors = string.Join(", ", validationResults.Select(r => r.ErrorMessage));
                    _logger.LogWarning(
                        "Validation failed for student {StudentCode}: {Errors}",
                        studentRow.StudentCode,
                        errors
                    );
                    result.Errors.Add($"Student {studentRow.StudentCode}: {errors}");
                    continue;
                }

                // Create student entity
                var student = new Student
                {
                    StudentCode = studentRow.StudentCode,
                    FirstName = studentRow.FirstName,
                    LastName = studentRow.LastName,
                    DateOfBirth = studentRow.DateOfBirth,
                    Gender = studentRow.Gender,
                    Address = studentRow.Address,
                    ClassId = classEntity.ClassId, // Set ClassId here
                    Password = studentRow.Password,
                    IsActive = true,
                };

                // Get relationships for this student
                var studentRelationships = relationshipBatch
                    .Where(r => r.StudentCode == studentRow.StudentCode)
                    .ToList();

                if (!studentRelationships.Any())
                {
                    result.FailedRows++;
                    result.Errors.Add(
                        $"Student {studentRow.StudentCode} has no parent relationships"
                    );
                    continue;
                }

                // Get parents for this student
                var studentParents = new List<Parent>();
                var studentParentRelationships = new List<(Parent Parent, string Relationship)>();

                foreach (var relationship in studentRelationships)
                {
                    if (
                        !parentEmailToParentData.TryGetValue(
                            relationship.ParentEmail,
                            out var parentData
                        )
                    )
                    {
                        result.Errors.Add(
                            $"Parent with email {relationship.ParentEmail} not found for student {studentRow.StudentCode}"
                        );
                        continue;
                    }

                    // Create a new parent record for this relationship (since Parent has Relationship field)
                    var parent = new Parent
                    {
                        FirstName = parentData.FirstName,
                        LastName = parentData.LastName,
                        Phone = parentData.Phone,
                        Email = parentData.Email,
                        Address = parentData.Address,
                        Occupation = parentData.Occupation,
                        IsEmergencyContact = parentData.IsEmergencyContact,
                        IsMainContact = parentData.IsMainContact,
                        Password = parentData.Password,
                        Relationship = parentData.Relationship, // Set the relationship from the relationship sheet
                        IsActive = true,
                    };

                    studentParents.Add(parent);
                    studentParentRelationships.Add((parent, parentData.Relationship));
                }

                if (!studentParents.Any())
                {
                    result.FailedRows++;
                    result.Errors.Add(
                        $"No valid parents found for student {studentRow.StudentCode}"
                    );
                    continue;
                }

                // Get and validate health profile
                var healthProfileRow = healthBatch.FirstOrDefault(h =>
                    h.StudentCode == studentRow.StudentCode
                );

                if (healthProfileRow == null)
                {
                    result.FailedRows++;
                    result.Errors.Add(
                        $"Student {studentRow.StudentCode} has no health profile information"
                    );
                    continue;
                }

                var healthValidationContext = new ValidationContext(healthProfileRow);
                var healthValidationResults = new List<ValidationResult>();
                if (
                    !Validator.TryValidateObject(
                        healthProfileRow,
                        healthValidationContext,
                        healthValidationResults,
                        true
                    )
                )
                {
                    result.FailedRows++;
                    var errors = string.Join(
                        ", ",
                        healthValidationResults.Select(r => r.ErrorMessage)
                    );
                    _logger.LogWarning(
                        "Validation failed for health profile of student {StudentCode}: {Errors}",
                        studentRow.StudentCode,
                        errors
                    );
                    result.Errors.Add(
                        $"Health profile for student {studentRow.StudentCode}: {errors}"
                    );
                    continue;
                }

                var healthProfile = new HealthProfile
                {
                    StudentCode = studentRow.StudentCode,
                    HasAllergies = healthProfileRow.HasAllergies,
                    AllergyDetails = healthProfileRow.AllergyDetails,
                    HasChronicDiseases = healthProfileRow.HasChronicDiseases,
                    ChronicDetails = healthProfileRow.ChronicDetails,
                    BloodType = healthProfileRow.BloodType,
                    HasVisionIssues = healthProfileRow.HasVisionIssues,
                    VisionNotes = healthProfileRow.VisionNotes,
                    LeftEye = healthProfileRow.LeftEye,
                    RightEye = healthProfileRow.RightEye,
                    HasHearingIssues = healthProfileRow.HasHearingIssues,
                    HearingNotes = healthProfileRow.HearingNotes,
                    LeftEar = healthProfileRow.LeftEar,
                    RightEar = healthProfileRow.RightEar,
                    HasCompleteVaccinations = healthProfileRow.HasCompleteVaccinations,
                    Vaccinations = healthProfileRow.Vaccinations,
                    VaccinationDetails = healthProfileRow.VaccinationDetails,
                    HasPreviousTreatment = healthProfileRow.HasPreviousTreatment,
                    TreatmentDetails = healthProfileRow.TreatmentDetails,
                    Height = healthProfileRow.Height,
                    Weight = healthProfileRow.Weight,
                    EmergencyContact = healthProfileRow.EmergencyContact,
                    OtherInfo = healthProfileRow.OtherInfo,
                    BloodPressure = healthProfileRow.BloodPressure,
                    HeartRate = healthProfileRow.HeartRate,
                    LastUpdated = DateTime.Now,
                };

                _logger.LogInformation(
                    "Adding student {StudentCode} to database with {ParentCount} parents",
                    student.StudentCode,
                    studentParents.Count
                );

                // Add to database using repository
                await _repository.AddStudentWithRelatedDataAsync(
                    student,
                    studentParents,
                    studentParentRelationships,
                    healthProfile
                );
                result.SuccessfullyImported++;

                _logger.LogInformation(
                    "Successfully added student {StudentCode} to database",
                    student.StudentCode
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error processing student {StudentCode}",
                    studentRow.StudentCode
                );
                result.FailedRows++;
                result.Errors.Add($"Student {studentRow.StudentCode}: {ex.Message}");
            }
        }
    }

    private int GetColumnIndex(List<string> headers, string columnName)
    {
        var index = headers.FindIndex(h =>
            h.Equals(columnName, StringComparison.OrdinalIgnoreCase)
        );
        if (index == -1)
        {
            throw new Exception($"Column '{columnName}' not found in Excel file");
        }
        return index + 1; // Excel is 1-based
    }
}
