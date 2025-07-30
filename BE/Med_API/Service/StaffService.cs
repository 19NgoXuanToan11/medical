using System.Security.Cryptography;
using System.Text;
using DB;
using Repo;

namespace Service;

public class StaffService : IStaffService
{
    private readonly IStaffRepository _staffRepository;

    public StaffService(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }

    public async Task<IEnumerable<Staff>> GetAllStaffAsync()
    {
        return await _staffRepository.GetAllStaffAsync();
    }

    public async Task<Staff?> GetStaffByIdAsync(int id)
    {
        return await _staffRepository.GetStaffByIdAsync(id);
    }

    public async Task<Staff?> CreateStaffAsync(Staff staff)
    {
        // Check for unique username
        var existingStaff = await _staffRepository.GetStaffByUsernameAsync(staff.Username);
        if (existingStaff != null)
        {
            return null; // Username already exists
        }

        // Check for unique email
        existingStaff = await _staffRepository.GetStaffByEmailAsync(staff.Email);
        if (existingStaff != null)
        {
            return null; // Email already exists
        }

        // Hash the password
        staff.PasswordHash = HashPassword(staff.PasswordHash);

        return await _staffRepository.CreateStaffAsync(staff);
    }

    public async Task<bool> UpdateStaffAsync(Staff staff)
    {
        // Check if staff exists
        var existingStaff = await _staffRepository.GetStaffByIdAsync(staff.StaffId);
        if (existingStaff == null)
        {
            return false; // Staff not found
        }

        // Check for unique username if it's being updated
        if (!string.IsNullOrEmpty(staff.Username) && existingStaff.Username != staff.Username)
        {
            var staffWithSameUsername = await _staffRepository.GetStaffByUsernameAsync(
                staff.Username
            );
            if (staffWithSameUsername != null && staffWithSameUsername.StaffId != staff.StaffId)
            {
                return false; // Username not unique
            }
        }

        // Check for unique email if it's being updated
        if (!string.IsNullOrEmpty(staff.Email) && existingStaff.Email != staff.Email)
        {
            var staffWithSameEmail = await _staffRepository.GetStaffByEmailAsync(staff.Email);
            if (staffWithSameEmail != null && staffWithSameEmail.StaffId != staff.StaffId)
            {
                return false; // Email not unique
            }
        }

        // Update password if provided
        if (!string.IsNullOrEmpty(staff.PasswordHash))
        {
            staff.PasswordHash = HashPassword(staff.PasswordHash);
        }
        else
        {
            staff.PasswordHash = existingStaff.PasswordHash;
        }

        // Update only necessary properties
        existingStaff.Username = staff.Username;
        existingStaff.Email = staff.Email;
        existingStaff.FirstName = staff.FirstName;
        existingStaff.LastName = staff.LastName;
        existingStaff.Phone = staff.Phone;
        existingStaff.RoleId = staff.RoleId;
        existingStaff.PasswordHash = staff.PasswordHash;

        await _staffRepository.UpdateStaffAsync(existingStaff);
        return true;
    }

    public async Task<bool> DeleteStaffAsync(int id)
    {
        return await _staffRepository.DeleteStaffAsync(id);
    }

    public async Task<Staff?> GetStaffByUsernameAsync(string username)
    {
        return await _staffRepository.GetStaffByUsernameAsync(username);
    }

    public async Task<Staff?> GetStaffByEmailAsync(string email)
    {
        return await _staffRepository.GetStaffByEmailAsync(email);
    }

    public async Task<bool> ValidateCredentialsAsync(string username, string password)
    {
        var staff = await _staffRepository.GetStaffByUsernameAsync(username);
        if (staff == null)
        {
            return false;
        }

        var hashedPassword = HashPassword(password);
        return staff.PasswordHash == hashedPassword;
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    // GradeNurse management
    public async Task<GradeNurse> CreateGradeNurseAsync(GradeNurse gradeNurse)
    {
        return await _staffRepository.CreateGradeNurseAsync(gradeNurse);
    }

    public async Task<bool> DeleteGradeNurseAsync(int gradeNurseId)
    {
        return await _staffRepository.DeleteGradeNurseAsync(gradeNurseId);
    }

    public async Task<IEnumerable<GradeNurse>> GetGradeNursesByGradeAsync(int grade)
    {
        return await _staffRepository.GetGradeNursesByGradeAsync(grade);
    }

    public async Task<IEnumerable<GradeNurse>> GetGradeNursesByStaffIdAsync(int staffId)
    {
        return await _staffRepository.GetGradeNursesByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<GradeNurse>> GetAllGradeNursesAsync()
    {
        return await _staffRepository.GetAllGradeNursesAsync();
    }

    public async Task<bool> IsNurseAssignedToGradeAsync(int staffId, int grade)
    {
        var grades = await GetGradeNursesByStaffIdAsync(staffId);
        return grades.Any(g => g.Grade == grade);
    }
}
