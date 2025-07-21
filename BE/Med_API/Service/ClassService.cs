using DB;
using Repo;

namespace Service;

public class ClassService : IClassService
{
    private readonly IClassRepository _classRepository;
    private readonly IStudentRepository _studentRepository;

    public ClassService(IClassRepository classRepository, IStudentRepository studentRepository)
    {
        _classRepository = classRepository;
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<Class>> GetAllClassesAsync()
    {
        return await _classRepository.GetAllClassesAsync();
    }

    public async Task<Class?> GetClassByIdAsync(int id)
    {
        return await _classRepository.GetClassByIdAsync(id);
    }

    public async Task<Class?> CreateClassAsync(Class classEntity)
    {
        // Validate the class data
        var isValid = await ValidateClassDataAsync(classEntity);
        if (!isValid)
            return null;

        // Check for duplicate class name
        var exists = await _classRepository.ClassNameExistsAsync(
            classEntity.ClassName, 
            classEntity.GradeLevel, 
            classEntity.Section);
        
        if (exists)
            return null;

        return await _classRepository.CreateClassAsync(classEntity);
    }

    public async Task<bool> UpdateClassAsync(Class classEntity)
    {
        // Validate the class data
        var isValid = await ValidateClassDataAsync(classEntity);
        if (!isValid)
            return false;

        // Check for duplicate class name (excluding current class)
        var exists = await _classRepository.ClassNameExistsAsync(
            classEntity.ClassName, 
            classEntity.GradeLevel, 
            classEntity.Section,
            classEntity.ClassId);
        
        if (exists)
            return false;

        var success = await _classRepository.UpdateClassAsync(classEntity);
        
        if (success)
        {
            // Update student count after successful update
            await _classRepository.UpdateStudentCountAsync(classEntity.ClassId);
        }

        return success;
    }

    public async Task<bool> DeleteClassAsync(int id)
    {
        return await _classRepository.DeleteClassAsync(id);
    }

    public async Task<IEnumerable<Class>> GetClassesByGradeLevelAsync(int gradeLevel)
    {
        return await _classRepository.GetClassesByGradeLevelAsync(gradeLevel);
    }

    public async Task<IEnumerable<Student>> GetStudentsByClassIdAsync(int classId)
    {
        return await _classRepository.GetStudentsByClassIdAsync(classId);
    }

    public async Task<bool> AssignStudentToClassAsync(int studentId, int classId)
    {
        try
        {
            // Get the student
            var student = await _studentRepository.GetStudentByIdAsync(studentId);
            if (student == null)
                return false;

            // Get the class
            var classEntity = await _classRepository.GetClassByIdAsync(classId);
            if (classEntity == null || !classEntity.IsActive)
                return false;

            // Check if class has capacity
            if (classEntity.MaxStudents.HasValue && 
                classEntity.CurrentStudentCount >= classEntity.MaxStudents.Value)
                return false;

            // Update student's class
            student.ClassId = classId;
            var success = await _studentRepository.UpdateStudentAsync(student);

            if (success)
            {
                // Update student counts for both old and new classes
                if (student.ClassId.HasValue)
                    await _classRepository.UpdateStudentCountAsync(student.ClassId.Value);
                await _classRepository.UpdateStudentCountAsync(classId);
            }

            return success;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> RemoveStudentFromClassAsync(int studentId)
    {
        try
        {
            var student = await _studentRepository.GetStudentByIdAsync(studentId);
            if (student == null)
                return false;

            var oldClassId = student.ClassId;
            student.ClassId = null;
            
            var success = await _studentRepository.UpdateStudentAsync(student);

            if (success && oldClassId.HasValue)
            {
                // Update student count for the old class
                await _classRepository.UpdateStudentCountAsync(oldClassId.Value);
            }

            return success;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<IEnumerable<Class>> GetActiveClassesAsync()
    {
        return await _classRepository.GetActiveClassesAsync();
    }

    public async Task<bool> ValidateClassDataAsync(Class classEntity)
    {
        // Basic validation
        if (string.IsNullOrWhiteSpace(classEntity.ClassName))
            return false;

        if (classEntity.GradeLevel < 1 || classEntity.GradeLevel > 12)
            return false;

        if (classEntity.MaxStudents.HasValue && classEntity.MaxStudents.Value <= 0)
            return false;

        return true;
    }

    // Automatically promote students to the next class at the start of a new school year
    public async Task<int> PromoteStudentsToNextClassIfNewYearAsync()
    {
        // Define the promotion date (e.g., September 1st)
        var now = DateTime.Now;
        var promotionMonth = 8; // September
        var promotionDay = 1;
        var promotionDate = new DateTime(now.Year, promotionMonth, promotionDay);
        if (now < promotionDate)
        {
            // Not time to promote yet this year
            return 0;
        }

        // Get all active classes
        var classes = (await _classRepository.GetActiveClassesAsync()).ToList();
        var maxGrade = classes.Max(c => c.GradeLevel);
        int promotedCount = 0;

        foreach (var currentClass in classes)
        {
            if (currentClass.GradeLevel >= maxGrade) continue; // Skip highest grade
            // Find next grade's class with the same section (if section is used)
            var nextClass = classes.FirstOrDefault(c =>
                c.GradeLevel == currentClass.GradeLevel + 1 &&
                (string.IsNullOrEmpty(c.Section) || c.Section == currentClass.Section));
            if (nextClass == null) continue;

            // Get students in this class
            var students = currentClass.Students.ToList();
            foreach (var student in students)
            {
                student.ClassId = nextClass.ClassId;
                promotedCount++;
                await _studentRepository.UpdateStudentAsync(student);
            }
            // Update student counts for both classes
            await _classRepository.UpdateStudentCountAsync(currentClass.ClassId);
            await _classRepository.UpdateStudentCountAsync(nextClass.ClassId);
        }
        return promotedCount;
    }
} 