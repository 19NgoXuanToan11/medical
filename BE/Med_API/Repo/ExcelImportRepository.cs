using DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Repo;

public class ExcelImportRepository : IExcelImportRepository
{
    private readonly MedicalContext _context;
    private readonly ILogger<ExcelImportRepository> _logger;

    public ExcelImportRepository(MedicalContext context, ILogger<ExcelImportRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<string>> GetExistingStudentCodesAsync()
    {
        _logger.LogInformation("Fetching existing student codes from database");
        var codes = await _context.Students
            .Select(s => s.StudentCode)
            .ToListAsync();
        _logger.LogInformation("Found {Count} existing student codes", codes.Count);
        return codes;
    }

    public async Task<IEnumerable<string>> GetExistingParentEmailsAsync()
    {
        _logger.LogInformation("Fetching existing parent emails from database");
        var emails = await _context.Parents
            .Where(p => !string.IsNullOrEmpty(p.Email))
            .Select(p => p.Email!)
            .ToListAsync();
        _logger.LogInformation("Found {Count} existing parent emails", emails.Count);
        return emails;
    }

    public async Task<IEnumerable<string>> GetExistingParentPhonesAsync()
    {
        _logger.LogInformation("Fetching existing parent phones from database");
        var phones = await _context.Parents
            .Select(p => p.Phone)
            .ToListAsync();
        _logger.LogInformation("Found {Count} existing parent phones", phones.Count);
        return phones;
    }

    public async Task AddStudentWithRelatedDataAsync(Student student, IEnumerable<Parent> parents, HealthProfile healthProfile)
    {
        _logger.LogInformation("Starting database transaction for student {StudentCode}", student.StudentCode);
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Add student
            _logger.LogInformation("Adding student {StudentCode} to database", student.StudentCode);
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Student {StudentCode} added successfully with ID {StudentId}", 
                student.StudentCode, student.StudentId);

            // Add parents
            _logger.LogInformation("Adding {ParentCount} parents to database for student {StudentCode}", parents.Count(), student.StudentCode);
            _context.Parents.AddRange(parents);
            await _context.SaveChangesAsync();

            // Establish Student-Parent relationships
            foreach (var parent in parents)
            {
                var studentParent = new StudentParent
                {
                    StudentId = student.StudentId,
                    ParentId = parent.ParentId
                };
                _context.StudentParents.Add(studentParent);
            }
            await _context.SaveChangesAsync();
            _logger.LogInformation("Added {ParentCount} parent relationships for student {StudentCode}",
                parents.Count(), student.StudentCode);

            // Add health profile with student ID
            healthProfile.StudentId = student.StudentId;
            _context.HealthProfiles.Add(healthProfile);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Added health profile for student {StudentCode}", student.StudentCode);

            await transaction.CommitAsync();
            _logger.LogInformation("Transaction committed successfully for student {StudentCode}", student.StudentCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during database transaction for student {StudentCode}", student.StudentCode);
            await transaction.RollbackAsync();
            _logger.LogInformation("Transaction rolled back for student {StudentCode}", student.StudentCode);
            throw;
        }
    }

    private class StudentParentRelation
    {
        public string StudentCode { get; set; } = null!;
        public string ParentEmail { get; set; } = null!;
    }

    public async Task<IEnumerable<(string StudentCode, string ParentEmail)>> GetExistingStudentParentRelationsAsync()
    {
        var relations = await _context.StudentParents
            .Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.Student != null && sp.Parent != null && sp.Parent.Email != null)
            .Select(sp => new StudentParentRelation 
            { 
                StudentCode = sp.Student.StudentCode, 
                ParentEmail = sp.Parent.Email 
            })
            .ToListAsync();

        return relations.Select(r => (r.StudentCode, r.ParentEmail));
    }
} 