using Microsoft.AspNetCore.Mvc;
using Service;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IStaffService _staffService;
    private readonly IStudentService _studentService;
    private readonly IParentService _parentService;
    private readonly IConfiguration _configuration;

    public AuthController(
        IStaffService staffService,
        IStudentService studentService,
        IParentService parentService,
        IConfiguration configuration)
    {
        _staffService = staffService;
        _studentService = studentService;
        _parentService = parentService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Kiểm tra role và thực hiện đăng nhập tương ứng
        switch (request.Role.ToLower())
        {
            case "staff":
            case "admin":
            case "manager":
            case "nurse":
                var staff = await _staffService.GetStaffByUsernameAsync(request.Username);
                if (staff != null && await _staffService.ValidateCredentialsAsync(request.Username, request.Password))
                {
                    return Ok(new
                    {
                        Token = GenerateJwtToken(staff.StaffId, request.Username, staff.Email, staff.Role.RoleName),
                        Role = staff.Role.RoleName,
                        Id = staff.StaffId,
                        Username = staff.Username,
                        Email = staff.Email,
                        FirstName = staff.FirstName,
                        LastName = staff.LastName
                    });
                }
                break;

            case "student":
                var student = await _studentService.GetStudentByCodeAsync(request.Username);
                if (student != null && student.StudentCode == request.Username)
                {
                    return Ok(new
                    {
                        Token = GenerateJwtToken(student.StudentId, student.StudentCode, "", "Student"),
                        Role = "Student",
                        Id = student.StudentId,
                        Username = student.StudentCode,
                        FirstName = student.FirstName,
                        LastName = student.LastName
                    });
                }
                break;

            case "parent":
                // Chuyển đổi username thành ID nếu username là số
                if (int.TryParse(request.Username, out int parentId))
                {
                    var parent = await _parentService.GetParentByIdAsync(parentId);
                    if (parent != null)
                    {
                        return Ok(new
                        {
                            Token = GenerateJwtToken(parent.ParentId, parent.Phone, parent.Email ?? "", "Parent"),
                            Role = "Parent",
                            Id = parent.ParentId,
                            Username = parent.Phone,
                            Email = parent.Email,
                            FirstName = parent.FirstName,
                            LastName = parent.LastName
                        });
                    }
                }
                break;

            default:
                return BadRequest("Role không hợp lệ");
        }

        return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    private string GenerateJwtToken(int userId, string username, string email, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!; // "Staff", "Student", "Parent"
}
