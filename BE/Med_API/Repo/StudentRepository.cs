using DB;
using Microsoft.EntityFrameworkCore;

namespace Repo;

public class StudentRepository : IStudentRepository
{
    private readonly MedicalContext _context;

    public StudentRepository(MedicalContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Student>> GetAllStudentsAsync()
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .ToListAsync();
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .FirstOrDefaultAsync(s => s.StudentId == id);
    }

    public async Task<Student> CreateStudentAsync(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return student;
    }

    public async Task<bool> UpdateStudentAsync(Student student)
    {
        var existingStudent = await _context.Students.FindAsync(student.StudentId);
        if (existingStudent == null)
        {
            return false;
        }

        _context.Entry(existingStudent).CurrentValues.SetValues(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteStudentAsync(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            return false;
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Student?> GetStudentByCodeAsync(string studentCode)
    {
        return await _context.Students
            .Include(s => s.Class)
            .Include(s => s.HealthProfiles)
            .Include(s => s.HealthEvents)
            .Include(s => s.StudentParents)
                .ThenInclude(sp => sp.Parent)
            .Include(s => s.Parents)
            .Include(s => s.MedicineRequests)
            .Include(s => s.InjectionForms)
            .Include(s => s.InjectionResults)
            .FirstOrDefaultAsync(s => s.StudentCode == studentCode);
    }

    public async Task<IEnumerable<Student>> GetEligibleStudentsForVaccineAsync(int vaccineId, DateTime injectionDate, IEnumerable<int> studentIds)
    {
        var students = await _context.Students
            .Where(s => studentIds.Contains(s.StudentId))
            .Include(s => s.HealthProfiles)
            .Include(s => s.InjectionForms)
                .ThenInclude(f => f.InjectionResults)
            .ToListAsync();

        var eligible = new List<Student>();
        foreach (var student in students)
        {
            var profile = student.HealthProfiles.FirstOrDefault();
            // 1. Bệnh nền nguy hiểm/chronic disease
            if (profile != null && profile.HasChronicDiseases == true && !string.IsNullOrEmpty(profile.ChronicDetails))
                continue;
            // 2. Dị ứng vaccine/thành phần vaccine
            if (profile != null && profile.HasAllergies == true && !string.IsNullOrEmpty(profile.AllergyDetails))
                continue;
            // 3. Đang mắc bệnh cấp tính/đang sốt (dựa vào HealthCheckResult gần nhất)
            var lastCheck = await _context.HealthCheckResults
                .Where(r => r.StudentId == student.StudentId)
                .OrderByDescending(r => r.ExaminedDate)
                .FirstOrDefaultAsync();
            if (lastCheck != null && !string.IsNullOrEmpty(lastCheck.GeneralFindings) && lastCheck.GeneralFindings.ToLower().Contains("sốt"))
                continue;
            // 4. Đã tiêm vaccine này gần đây (giả sử chống chỉ định 180 ngày)
            var lastInjection = student.InjectionForms
                .Where(f => f.VaccineId == vaccineId && f.ConsentStatus == "Approved")
                .SelectMany(f => f.InjectionResults)
                .OrderByDescending(r => r.AdministeredDate)
                .FirstOrDefault();
            if (lastInjection != null && (injectionDate - lastInjection.AdministeredDate).TotalDays < 180)
                continue;
            // 5. Đang theo dõi sau tiêm vaccine khác
            if (lastInjection != null && lastInjection.FollowUpRequired == true)
                continue;
            // 6. Đang điều trị bệnh đặc biệt
            if (profile != null && profile.HasPreviousTreatment == true && !string.IsNullOrEmpty(profile.TreatmentDetails))
                continue;
            // 7. Các điều kiện khác có thể bổ sung ở đây
            eligible.Add(student);
        }
        return eligible;
    }
} 