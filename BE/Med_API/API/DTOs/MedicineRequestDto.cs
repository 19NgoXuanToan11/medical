using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace API.DTOs;

public static class MedicineRequestDto
{
    public class ViewModel
    {
        public int RequestId { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } = null!;
        public string StudentCode { get; set; } = null!;
        public string? ClassName { get; set; }
        public int ParentId { get; set; }
        public int? StaffId { get; set; }
        public DateOnly Date { get; set; }
        public StudentDto.ViewModel? Student { get; set; }
        public ParentDto.ViewModel? Parent { get; set; }
        public StaffDto.ViewModel? Staff { get; set; }
        public ICollection<MedicineRequestItemDto.ViewModel> MedicineRequestItems { get; set; } = new List<MedicineRequestItemDto.ViewModel>();
    }

    public class Create
    {
        [Required]
        public string StudentCode { get; set; } = null!;

        [StringLength(50)]
        public string? ClassName { get; set; }

        [Required]
        public int ParentId { get; set; }

        public string? Status { get; set; }

        public DateOnly Date { get; set; }

        public ICollection<MedicineRequestItemDto.Create> MedicineRequestItems { get; set; } = new List<MedicineRequestItemDto.Create>();
    }

    public class Update
    {
        [StringLength(20)]
        public string? Status { get; set; }

        [StringLength(50)]
        public string? ClassName { get; set; }

        public DateOnly? Date { get; set; }

        public ICollection<MedicineRequestItemDto.Update>? MedicineRequestItems { get; set; }
    }
}

public static class MedicineRequestItemDto
{
    public class ViewModel
    {
        public int MedicineRequestItemId { get; set; }
        public int MedicineRequestId { get; set; }
        public string MedicineName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Frequency { get; set; } = null!;
        public string? TimeOfDay { get; set; }
        public string? Instructions { get; set; }
    }

    public class Create
    {
        [Required]
        [StringLength(100)]
        public string MedicineName { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Dosage { get; set; } = null!;

        [Required]
        [StringLength(100)]
        [FrequencyValidation]
        public string Frequency { get; set; } = null!;

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }
    }

    public class Update
    {
        public int MedicineRequestItemId { get; set; }

        [StringLength(100)]
        public string? MedicineName { get; set; }

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(100)]
        [FrequencyValidation]
        public string? Frequency { get; set; }

        [StringLength(100)]
        public string? TimeOfDay { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }
    }
}

// Custom validation attribute for frequency
public class FrequencyValidationAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success; // Allow null for Update DTOs
        }

        var frequency = value.ToString();
        if (string.IsNullOrWhiteSpace(frequency))
        {
            return new ValidationResult("Frequency cannot be empty.");
        }

        var trimmedFrequency = frequency.Trim().ToLower();

        // Check for simple number format (e.g., "2", "3")
        if (int.TryParse(trimmedFrequency, out var number))
        {
            if (number < 1 || number > 4)
            {
                return new ValidationResult("Frequency number must be between 1 and 4.");
            }
            return ValidationResult.Success;
        }

        // Check for "number lần" format (e.g., "2 lần", "3 lần")
        var numberMatch = Regex.Match(trimmedFrequency, @"^(\d+)\s*lần?$");
        if (numberMatch.Success)
        {
            if (int.TryParse(numberMatch.Groups[1].Value, out var parsedNumber))
            {
                if (parsedNumber < 1 || parsedNumber > 4)
                {
                    return new ValidationResult("Frequency number must be between 1 and 4.");
                }
                return ValidationResult.Success;
            }
        }

        // Check for time-based format (e.g., "sáng", "sáng, trưa", "sáng 2 lần")
        var segments = frequency.Split(',', StringSplitOptions.RemoveEmptyEntries);
        foreach (var segment in segments)
        {
            var part = segment.Trim().ToLower();
            
            // Check for time period with optional count
            var timeMatch = Regex.Match(part, @"^(sáng|trưa|chiều|tối)\s*(\d+)?\s*lần?$");
            if (timeMatch.Success)
            {
                var countStr = timeMatch.Groups[2].Value;
                if (!string.IsNullOrEmpty(countStr))
                {
                    if (int.TryParse(countStr, out var count) && (count < 1 || count > 3))
                    {
                        return new ValidationResult("Time period count must be between 1 and 3.");
                    }
                }
            }
            else if (part != "sáng" && part != "trưa" && part != "chiều" && part != "tối")
            {
                return new ValidationResult("Invalid frequency format. Use numbers (1-4), 'number lần', or time periods (sáng, trưa, chiều, tối).");
            }
        }

        return ValidationResult.Success;
    }
} 