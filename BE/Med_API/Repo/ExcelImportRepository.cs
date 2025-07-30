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
        var codes = await _context.Students.Select(s => s.StudentCode).ToListAsync();
        _logger.LogInformation("Found {Count} existing student codes", codes.Count);
        return codes;
    }

    public async Task<IEnumerable<string>> GetExistingParentEmailsAsync()
    {
        _logger.LogInformation("Fetching existing parent emails from database");
        var emails = await _context
            .Parents.Where(p => !string.IsNullOrEmpty(p.Email))
            .Select(p => p.Email!)
            .ToListAsync();
        _logger.LogInformation("Found {Count} existing parent emails", emails.Count);
        return emails;
    }

    public async Task<IEnumerable<string>> GetExistingParentPhonesAsync()
    {
        _logger.LogInformation("Fetching existing parent phones from database");
        var phones = await _context.Parents.Select(p => p.Phone).ToListAsync();
        _logger.LogInformation("Found {Count} existing parent phones", phones.Count);
        return phones;
    }

    public async Task AddStudentWithRelatedDataAsync(
        Student student,
        IEnumerable<Parent> parents,
        IEnumerable<(Parent Parent, string Relationship)> relationships,
        HealthProfile healthProfile
    )
    {
        _logger.LogInformation(
            "Starting database transaction for student {StudentCode}",
            student.StudentCode
        );
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Verify student doesn't already exist
            var existingStudent = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentCode == student.StudentCode
            );
            if (existingStudent != null)
            {
                throw new InvalidOperationException(
                    $"Student with code {student.StudentCode} already exists."
                );
            }

            // Add student first
            _logger.LogInformation("Adding student {StudentCode} to database", student.StudentCode);
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            _logger.LogInformation(
                "Student {StudentCode} added successfully with ID {StudentId}",
                student.StudentCode,
                student.StudentId
            );

            // Process parents and relationships
            var parentList = parents.ToList();
            var relationshipList = relationships.ToList();

            foreach (var (parent, relationship) in relationshipList)
            {
                // Verify parent email and phone are unique if provided
                if (!string.IsNullOrEmpty(parent.Email))
                {
                    var existingEmail = await _context.Parents.FirstOrDefaultAsync(p =>
                        p.Email == parent.Email
                    );
                    if (existingEmail != null)
                    {
                        // Check if this existing parent has the same relationship to this student
                        var existingRelationship = await _context
                            .StudentParents.Include(sp => sp.Parent)
                            .FirstOrDefaultAsync(sp =>
                                sp.StudentCode == student.StudentCode
                                && sp.Parent.Email == parent.Email
                            );

                        if (existingRelationship != null)
                        {
                            throw new InvalidOperationException(
                                $"Student-parent relationship already exists: Student {student.StudentCode} with Parent {parent.Email}"
                            );
                        }

                        // Create new relationship with existing parent
                        var studentParent = new StudentParent
                        {
                            StudentCode = student.StudentCode,
                            ParentId = existingEmail.ParentId,
                        };

                        _context.StudentParents.Add(studentParent);
                        await _context.SaveChangesAsync();

                        _logger.LogInformation(
                            "Created relationship for existing parent {ParentEmail} with student {StudentCode}",
                            parent.Email,
                            student.StudentCode
                        );
                        continue;
                    }
                }

                var existingPhone = await _context.Parents.FirstOrDefaultAsync(p =>
                    p.Phone == parent.Phone
                );
                if (existingPhone != null)
                {
                    throw new InvalidOperationException(
                        $"Parent with phone {parent.Phone} already exists."
                    );
                }

                // Create new parent entity
                var newParent = new Parent
                {
                    FirstName = parent.FirstName,
                    LastName = parent.LastName,
                    Phone = parent.Phone,
                    Email = parent.Email,
                    Address = parent.Address,
                    Occupation = parent.Occupation,
                    IsEmergencyContact = parent.IsEmergencyContact,
                    IsMainContact = parent.IsMainContact,
                    Password = parent.Password,
                    Relationship = parent.Relationship, // Set the relationship from the parent entity
                    IsActive = true,
                };

                _logger.LogInformation(
                    "Adding new parent {FirstName} {LastName} for student {StudentCode}",
                    newParent.FirstName,
                    newParent.LastName,
                    student.StudentCode
                );

                // Add parent and save to get the generated ParentId
                _context.Parents.Add(newParent);
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Parent after SaveChanges - ParentId: {ParentId}",
                    newParent.ParentId
                );

                // Create StudentParent relationship
                var newStudentParent = new StudentParent
                {
                    StudentCode = student.StudentCode,
                    ParentId = newParent.ParentId,
                };

                _context.StudentParents.Add(newStudentParent);
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Created parent relationship for student {StudentCode} with parent {ParentId}",
                    student.StudentCode,
                    newParent.ParentId
                );
            }

            // Add health profile
            _logger.LogInformation(
                "Adding health profile for student {StudentCode}",
                student.StudentCode
            );
            healthProfile.StudentCode = student.StudentCode; // Ensure StudentCode is set
            _context.HealthProfiles.Add(healthProfile);
            await _context.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();
            _logger.LogInformation(
                "Transaction committed successfully for student {StudentCode}",
                student.StudentCode
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error during database transaction for student {StudentCode}. Error details: {ErrorDetails}",
                student.StudentCode,
                ex.ToString()
            );
            await transaction.RollbackAsync();
            _logger.LogInformation(
                "Transaction rolled back for student {StudentCode}",
                student.StudentCode
            );
            throw;
        }
    }

    public async Task<Class> GetOrCreateClassAsync(string className, int gradeLevel)
    {
        className = className.Trim();
        if (className.StartsWith("Class ", StringComparison.OrdinalIgnoreCase))
        {
            className = className.Substring(6).Trim();
        }
        var classEntity = await _context.Classes.FirstOrDefaultAsync(c =>
            c.ClassName.ToUpper() == className.ToUpper() && c.GradeLevel == gradeLevel
        );
        if (classEntity != null)
        {
            return classEntity;
        }
        // Create new class if not found
        classEntity = new Class
        {
            ClassName = className,
            GradeLevel = gradeLevel,
            IsActive = true,
            CreatedAt = DateTime.Now,
        };
        _context.Classes.Add(classEntity);
        await _context.SaveChangesAsync();
        return classEntity;
    }

    private class StudentParentRelation
    {
        public string StudentCode { get; set; } = null!;
        public string ParentEmail { get; set; } = null!;
    }

    public async Task<
        IEnumerable<(string StudentCode, string ParentEmail)>
    > GetExistingStudentParentRelationsAsync()
    {
        var relations = await _context
            .StudentParents.Include(sp => sp.Student)
            .Include(sp => sp.Parent)
            .Where(sp => sp.Student != null && sp.Parent != null && sp.Parent.Email != null)
            .Select(sp => new StudentParentRelation
            {
                StudentCode = sp.Student.StudentCode,
                ParentEmail = sp.Parent.Email,
            })
            .ToListAsync();

        return relations.Select(r => (r.StudentCode, r.ParentEmail));
    }
}
