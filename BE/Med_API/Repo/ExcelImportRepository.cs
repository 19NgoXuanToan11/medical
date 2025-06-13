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
        // Enable SQL logging
        _context.Database.SetCommandTimeout(120); // Increase timeout to 2 minutes
        _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
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
            // Verify student doesn't already exist
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentCode == student.StudentCode);
            if (existingStudent != null)
            {
                throw new InvalidOperationException($"Student with code {student.StudentCode} already exists.");
            }

            // Add student first
            _logger.LogInformation("Adding student {StudentCode} to database", student.StudentCode);
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Student {StudentCode} added successfully with ID {StudentId}", 
                student.StudentCode, student.StudentId);

            // Add parents one by one to ensure proper identity generation and relationship creation
            var parentList = parents.ToList();
            foreach (var parent in parentList)
            {
                // Verify parent email and phone are unique if provided
                if (!string.IsNullOrEmpty(parent.Email))
                {
                    var existingEmail = await _context.Parents
                        .FirstOrDefaultAsync(p => p.Email == parent.Email);
                    if (existingEmail != null)
                    {
                        throw new InvalidOperationException($"Parent with email {parent.Email} already exists.");
                    }
                }

                var existingPhone = await _context.Parents
                    .FirstOrDefaultAsync(p => p.Phone == parent.Phone);
                if (existingPhone != null)
                {
                    throw new InvalidOperationException($"Parent with phone {parent.Phone} already exists.");
                }

                // Create new parent entity
                var newParent = new Parent
                {
                    // StudentCode = student.StudentCode, // This links to the student we just created
                    FirstName = parent.FirstName,
                    LastName = parent.LastName,
                    Relationship = parent.Relationship,
                    Phone = parent.Phone,
                    Email = parent.Email,
                    Address = parent.Address,
                    Occupation = parent.Occupation,
                    IsEmergencyContact = parent.IsEmergencyContact,
                    IsMainContact = parent.IsMainContact,
                    Password = parent.Password,
                    IsActive = true
                };

                // Removed direct reference to StudentCode for Parent. Use student.StudentCode for logging student context.
                _logger.LogInformation("Adding parent {FirstName} {LastName} for student {StudentCode}", 
                    newParent.FirstName, newParent.LastName, student.StudentCode);
                
                // Detailed logging for Parent properties before adding to context
                _logger.LogInformation("Parent before Add - ParentId: {ParentId}, FirstName: {FirstName}, LastName: {LastName}, Relationship: {Relationship}, Phone: {Phone}, Email: {Email}, Password: {Password}",
                    newParent.ParentId,
                    newParent.FirstName,
                    newParent.LastName,
                    newParent.Relationship,
                    newParent.Phone,
                    newParent.Email,
                    newParent.Password);

                // Add parent and save to get the generated ParentId
                _context.Parents.Add(newParent);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Parent after SaveChanges - ParentId: {ParentId}", newParent.ParentId);

                // Create StudentParent relationship
                var studentParent = new StudentParent
                {
                    StudentCode = student.StudentCode, // StudentCode comes from the student entity
                    ParentId = newParent.ParentId // This will now have the correct generated ID
                };

                _context.StudentParents.Add(studentParent);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created parent relationship for student {StudentCode} with parent {ParentId}", 
                    student.StudentCode, newParent.ParentId);
            }

            // Add health profile
            _logger.LogInformation("Adding health profile for student {StudentCode}", student.StudentCode);
            healthProfile.StudentCode = student.StudentCode; // Ensure StudentCode is set
            _context.HealthProfiles.Add(healthProfile);
            await _context.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();
            _logger.LogInformation("Transaction committed successfully for student {StudentCode}", student.StudentCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during database transaction for student {StudentCode}. Error details: {ErrorDetails}", 
                student.StudentCode, ex.ToString());
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