using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;

namespace API.DTOs;

[SwaggerSchema(Description = "Data transfer objects for Excel import operations")]
public static class ExcelImportDto
{
    [SwaggerSchema(Description = "Model for file upload operations")]
    public class FileUploadModel
    {
        [Required(ErrorMessage = "File is required")]
        [SwaggerSchema(Description = "Excel file (.xlsx) containing student data following the template format")]
        public IFormFile File { get; set; } = null!;
    }

    [SwaggerSchema(Description = "Student data row from Excel import")]
    public class StudentRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Student code can only contain uppercase letters and numbers")]
        [SwaggerSchema(Description = "Unique identifier for the student")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        [SwaggerSchema(Description = "Student's first name")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        [SwaggerSchema(Description = "Student's last name")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Date of birth is required")]
        [SwaggerSchema(Description = "Student's date of birth in YYYY-MM-DD format")]
        public DateOnly DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [RegularExpression("^(Nam|Nữ)$", ErrorMessage = "Gender must be 'Nam' or 'Nữ'")]
        [SwaggerSchema(Description = "Student's gender (Nam or Nữ)")]
        public string Gender { get; set; } = null!;

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        [SwaggerSchema(Description = "Student's address")]
        public string? Address { get; set; }

        [Required(ErrorMessage = "Class name is required")]
        [StringLength(50, ErrorMessage = "Class name cannot exceed 50 characters")]
        [SwaggerSchema(Description = "Student's class name")]
        public string ClassName { get; set; } = null!;

        [Required(ErrorMessage = "Grade level is required")]
        [Range(1, 5, ErrorMessage = "Grade level must be between 1 and 5")]
        [SwaggerSchema(Description = "Student's grade level (1-5)")]
        public int GradeLevel { get; set; }
    }

    [SwaggerSchema(Description = "Parent data row from Excel import")]
    public class ParentRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Student code can only contain uppercase letters and numbers")]
        [SwaggerSchema(Description = "Student code this parent is associated with")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "First name can only contain letters and spaces")]
        [SwaggerSchema(Description = "Parent's first name")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Last name can only contain letters and spaces")]
        [SwaggerSchema(Description = "Parent's last name")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Relationship is required")]
        [RegularExpression(@"^(Mother|Father|Guardian|Other)$", ErrorMessage = "Relationship must be one of: Mother, Father, Guardian, Other")]
        [SwaggerSchema(Description = "Parent's relationship to the student")]
        public string Relationship { get; set; } = null!;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        [SwaggerSchema(Description = "Parent's phone number")]
        public string Phone { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        [SwaggerSchema(Description = "Parent's email address")]
        public string Email { get; set; } = null!;

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        [SwaggerSchema(Description = "Parent's address")]
        public string? Address { get; set; }

        [StringLength(100, ErrorMessage = "Occupation cannot exceed 100 characters")]
        [SwaggerSchema(Description = "Parent's occupation")]
        public string? Occupation { get; set; }

        [Required(ErrorMessage = "Emergency contact status is required")]
        [SwaggerSchema(Description = "Whether this parent is an emergency contact")]
        public bool IsEmergencyContact { get; set; }

        [Required(ErrorMessage = "Main contact status is required")]
        [SwaggerSchema(Description = "Whether this parent is the main contact")]
        public bool IsMainContact { get; set; }
    }

    [SwaggerSchema(Description = "Health profile data row from Excel import")]
    public class HealthProfileRow
    {
        [Required(ErrorMessage = "Student code is required")]
        [StringLength(20, ErrorMessage = "Student code cannot exceed 20 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Student code can only contain uppercase letters and numbers")]
        [SwaggerSchema(Description = "Student code this health profile is associated with")]
        public string StudentCode { get; set; } = null!;

        [Required(ErrorMessage = "Allergy status is required")]
        [SwaggerSchema(Description = "Whether the student has any allergies")]
        public bool HasAllergies { get; set; }

        [StringLength(1000, ErrorMessage = "Allergy details cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Details about student's allergies")]
        public string? AllergyDetails { get; set; }

        [Required(ErrorMessage = "Chronic disease status is required")]
        [SwaggerSchema(Description = "Whether the student has any chronic diseases")]
        public bool HasChronicDiseases { get; set; }

        [StringLength(1000, ErrorMessage = "Chronic details cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Details about student's chronic diseases")]
        public string? ChronicDetails { get; set; }

        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid blood type format")]
        [StringLength(5, ErrorMessage = "Blood type cannot exceed 5 characters")]
        [SwaggerSchema(Description = "Student's blood type (e.g., A+, B-, AB+, O-)")]
        public string? BloodType { get; set; }

        [Required(ErrorMessage = "Vision issues status is required")]
        [SwaggerSchema(Description = "Whether the student has any vision issues")]
        public bool HasVisionIssues { get; set; }

        [StringLength(1000, ErrorMessage = "Vision notes cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Notes about student's vision")]
        public string? VisionNotes { get; set; }

        [StringLength(20, ErrorMessage = "Left eye measurement cannot exceed 20 characters")]
        [RegularExpression(@"^(\d+/\d+|[A-Za-z\s]+)$", ErrorMessage = "Invalid vision measurement format")]
        [SwaggerSchema(Description = "Left eye measurement (e.g., 20/20)")]
        public string? LeftEye { get; set; }

        [StringLength(20, ErrorMessage = "Right eye measurement cannot exceed 20 characters")]
        [RegularExpression(@"^(\d+/\d+|[A-Za-z\s]+)$", ErrorMessage = "Invalid vision measurement format")]
        [SwaggerSchema(Description = "Right eye measurement (e.g., 20/20)")]
        public string? RightEye { get; set; }

        [Required(ErrorMessage = "Hearing issues status is required")]
        [SwaggerSchema(Description = "Whether the student has any hearing issues")]
        public bool HasHearingIssues { get; set; }

        [StringLength(1000, ErrorMessage = "Hearing notes cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Notes about student's hearing")]
        public string? HearingNotes { get; set; }

        [StringLength(100, ErrorMessage = "Left ear measurement cannot exceed 100 characters")]
        [SwaggerSchema(Description = "Left ear measurement")]
        public string? LeftEar { get; set; }

        [StringLength(100, ErrorMessage = "Right ear measurement cannot exceed 100 characters")]
        [SwaggerSchema(Description = "Right ear measurement")]
        public string? RightEar { get; set; }

        [Required(ErrorMessage = "Vaccination status is required")]
        [RegularExpression(@"^(Yes|No|Partial)$", ErrorMessage = "Vaccination status must be Yes, No, or Partial")]
        [SwaggerSchema(Description = "Student's vaccination status")]
        public string HasCompleteVaccinations { get; set; } = null!;

        [StringLength(1000, ErrorMessage = "Vaccinations list cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "List of vaccinations received")]
        public string? Vaccinations { get; set; }

        [StringLength(1000, ErrorMessage = "Vaccination details cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Details about student's vaccinations")]
        public string? VaccinationDetails { get; set; }

        [Required(ErrorMessage = "Previous treatment status is required")]
        [SwaggerSchema(Description = "Whether the student has received any previous treatment")]
        public bool HasPreviousTreatment { get; set; }

        [StringLength(1000, ErrorMessage = "Treatment details cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Details about student's previous treatments")]
        public string? TreatmentDetails { get; set; }

        [Range(0, 300, ErrorMessage = "Height must be between 0 and 300 cm")]
        [SwaggerSchema(Description = "Student's height in centimeters")]
        public decimal? Height { get; set; }

        [Range(0, 500, ErrorMessage = "Weight must be between 0 and 500 kg")]
        [SwaggerSchema(Description = "Student's weight in kilograms")]
        public decimal? Weight { get; set; }

        [StringLength(255, ErrorMessage = "Emergency contact cannot exceed 255 characters")]
        [SwaggerSchema(Description = "Emergency contact information")]
        public string? EmergencyContact { get; set; }

        [StringLength(1000, ErrorMessage = "Other information cannot exceed 1000 characters")]
        [SwaggerSchema(Description = "Any additional health-related information")]
        public string? OtherInfo { get; set; }

        [StringLength(20, ErrorMessage = "Blood pressure cannot exceed 20 characters")]
        [SwaggerSchema(Description = "Student's blood pressure (e.g., 120/80)")]
        public string? BloodPressure { get; set; }

        [Range(0, 250, ErrorMessage = "Heart rate must be between 0 and 250 bpm")]
        [SwaggerSchema(Description = "Student's heart rate in beats per minute")]
        public int? HeartRate { get; set; }
    }

    [SwaggerSchema(Description = "Result of the Excel import operation")]
    public class ImportResult
    {
        [SwaggerSchema(Description = "Total number of rows processed")]
        public int TotalRows { get; set; }

        [SwaggerSchema(Description = "Number of rows successfully imported")]
        public int SuccessfullyImported { get; set; }

        [SwaggerSchema(Description = "Number of rows that failed to import")]
        public int FailedRows { get; set; }

        [SwaggerSchema(Description = "List of errors encountered during import")]
        public List<string> Errors { get; set; } = new();
    }
} 