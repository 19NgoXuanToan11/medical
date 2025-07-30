using DB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedDataController : ControllerBase
    {
        private readonly MedicalContext _context;

        public SeedDataController(MedicalContext context)
        {
            _context = context;
        }

        [HttpPost("seed-sample-students")]
        public async Task<IActionResult> SeedSampleStudents()
        {
            try
            {
                // Kiểm tra nếu đã có dữ liệu
                var existingStudents = await _context.Students.CountAsync();
                if (existingStudents > 0)
                {
                    return Ok(
                        new
                        {
                            message = $"Database đã có {existingStudents} học sinh. Sử dụng endpoint /clear-students để xóa trước khi seed.",
                        }
                    );
                }

                // Seed dữ liệu phụ huynh cho lớp 1A (10 học sinh)
                var parents = new List<Parent>();

                // Dữ liệu mẫu cho 10 học sinh lớp 1A
                var parentData = new[]
                {
                    new
                    {
                        FatherName = "Nguyễn Văn Hùng",
                        MotherName = "Trần Thị Hằng",
                        Address = "100 Nguyễn Huệ, Quận 1, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Lê Quốc Toàn",
                        MotherName = "Phạm Thị Nga",
                        Address = "101 Lê Lợi, Quận 2, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Hoàng Đình Thắng",
                        MotherName = "Vũ Thị Linh",
                        Address = "102 Điện Biên Phủ, Quận 3, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Đặng Minh Tuấn",
                        MotherName = "Bùi Thị Mai",
                        Address = "103 Cách Mạng Tháng 8, Quận 4, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Phan Văn Dũng",
                        MotherName = "Ngô Thị Thu",
                        Address = "104 Nguyễn Văn Cừ, Quận 5, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Vũ Quang Minh",
                        MotherName = "Đặng Thị Lan",
                        Address = "105 Trần Hưng Đạo, Quận 6, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Bùi Thanh Long",
                        MotherName = "Phan Thị Vân",
                        Address = "106 Lê Văn Sỹ, Quận 7, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Ngô Văn Tùng",
                        MotherName = "Dương Thị Xuân",
                        Address = "107 Võ Văn Tần, Quận 8, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Lý Quốc Bảo",
                        MotherName = "Võ Thị Yến",
                        Address = "108 Hai Bà Trưng, Quận 9, TP.HCM",
                    },
                    new
                    {
                        FatherName = "Trương Minh Thiện",
                        MotherName = "Đinh Thị Oanh",
                        Address = "109 Lý Tự Trọng, Quận 10, TP.HCM",
                    },
                };

                var fatherJobs = new[]
                {
                    "Kỹ sư",
                    "Bác sĩ",
                    "Luật sư",
                    "Giảng viên",
                    "Kiến trúc sư",
                    "Công nhân",
                    "Tài xế",
                    "Thợ điện",
                    "Nhà báo",
                    "Thầy thuốc",
                };
                var motherJobs = new[]
                {
                    "Giáo viên",
                    "Y tá",
                    "Kế toán",
                    "Nhân viên văn phòng",
                    "Dược sĩ",
                    "Bán hàng",
                    "Nội trợ",
                    "May mặc",
                    "Thiết kế",
                    "Điều dưỡng",
                };

                for (int i = 0; i < parentData.Length; i++)
                {
                    var data = parentData[i];

                    // Thêm bố
                    var fatherNameParts = data.FatherName.Split(' ');
                    var father = new Parent
                    {
                        FirstName = fatherNameParts[0],
                        LastName = string.Join(" ", fatherNameParts.Skip(1)),
                        Relationship = "Bố",
                        Phone = $"0901{1000000 + i + 1:D6}",
                        Email =
                            $"{fatherNameParts[0].ToLower()}{string.Join("", fatherNameParts.Skip(1)).ToLower()}{i + 1}@email.com",
                        Address = data.Address,
                        Occupation = fatherJobs[i % fatherJobs.Length],
                        Password = "123456",
                        IsEmergencyContact = true,
                        IsMainContact = true,
                        IsActive = true,
                    };
                    parents.Add(father);

                    // Thêm mẹ
                    var motherNameParts = data.MotherName.Split(' ');
                    var mother = new Parent
                    {
                        FirstName = motherNameParts[0],
                        LastName = string.Join(" ", motherNameParts.Skip(1)),
                        Relationship = "Mẹ",
                        Phone = $"0911{1000000 + i + 1:D6}",
                        Email =
                            $"{motherNameParts[0].ToLower()}{string.Join("", motherNameParts.Skip(1)).ToLower()}{i + 1}@email.com",
                        Address = data.Address,
                        Occupation = motherJobs[i % motherJobs.Length],
                        Password = "123456",
                        IsEmergencyContact = true,
                        IsMainContact = false,
                        IsActive = true,
                    };
                    parents.Add(mother);
                }

                _context.Parents.AddRange(parents);
                await _context.SaveChangesAsync();

                // Seed dữ liệu học sinh
                var students = new List<Student>();
                var studentNames = new[]
                {
                    new
                    {
                        Name = "Nguyễn Văn An",
                        Gender = "Nam",
                        DOB = new DateOnly(2018, 3, 15),
                    },
                    new
                    {
                        Name = "Trần Thị Lan",
                        Gender = "Nữ",
                        DOB = new DateOnly(2018, 5, 20),
                    },
                    new
                    {
                        Name = "Lê Minh Đức",
                        Gender = "Nam",
                        DOB = new DateOnly(2018, 7, 10),
                    },
                    new
                    {
                        Name = "Phạm Thị Hoa",
                        Gender = "Nữ",
                        DOB = new DateOnly(2018, 2, 28),
                    },
                    new
                    {
                        Name = "Hoàng Quang Huy",
                        Gender = "Nam",
                        DOB = new DateOnly(2018, 9, 12),
                    },
                    new
                    {
                        Name = "Vũ Thị Nga",
                        Gender = "Nữ",
                        DOB = new DateOnly(2018, 4, 18),
                    },
                    new
                    {
                        Name = "Đặng Văn Phúc",
                        Gender = "Nam",
                        DOB = new DateOnly(2018, 11, 25),
                    },
                    new
                    {
                        Name = "Bùi Thị Tâm",
                        Gender = "Nữ",
                        DOB = new DateOnly(2018, 6, 30),
                    },
                    new
                    {
                        Name = "Phan Thanh Sơn",
                        Gender = "Nam",
                        DOB = new DateOnly(2018, 1, 8),
                    },
                    new
                    {
                        Name = "Ngô Thị Phượng",
                        Gender = "Nữ",
                        DOB = new DateOnly(2018, 12, 14),
                    },
                };

                for (int i = 0; i < studentNames.Length; i++)
                {
                    var studentName = studentNames[i];
                    var nameParts = studentName.Name.Split(' ');

                    var student = new Student
                    {
                        StudentCode = $"HS{i + 1:D3}",
                        FirstName = nameParts[0],
                        LastName = string.Join(" ", nameParts.Skip(1)),
                        DateOfBirth = studentName.DOB,
                        Gender = studentName.Gender,
                        ClassId = 1, // Lớp 1A
                        Address = parentData[i].Address,
                        Password = "123456",
                        IsActive = true,
                    };
                    students.Add(student);
                }

                _context.Students.AddRange(students);
                await _context.SaveChangesAsync();

                // Tạo quan hệ phụ huynh-học sinh
                var studentParents = new List<StudentParent>();
                var addedParents = await _context.Parents.OrderBy(p => p.ParentId).ToListAsync();
                var addedStudents = await _context.Students.OrderBy(s => s.StudentId).ToListAsync();

                for (int i = 0; i < addedStudents.Count; i++)
                {
                    var student = addedStudents[i];
                    var fatherIndex = i * 2;
                    var motherIndex = i * 2 + 1;

                    if (fatherIndex < addedParents.Count)
                    {
                        studentParents.Add(
                            new StudentParent
                            {
                                StudentCode = student.StudentCode,
                                ParentId = addedParents[fatherIndex].ParentId,
                            }
                        );
                    }

                    if (motherIndex < addedParents.Count)
                    {
                        studentParents.Add(
                            new StudentParent
                            {
                                StudentCode = student.StudentCode,
                                ParentId = addedParents[motherIndex].ParentId,
                            }
                        );
                    }
                }

                _context.StudentParents.AddRange(studentParents);
                await _context.SaveChangesAsync();

                // Cập nhật số lượng học sinh trong lớp
                var class1A = await _context.Classes.FirstOrDefaultAsync(c => c.ClassId == 1);
                if (class1A != null)
                {
                    class1A.CurrentStudentCount = 10;
                    await _context.SaveChangesAsync();
                }

                return Ok(
                    new
                    {
                        message = "Đã seed dữ liệu thành công!",
                        data = new
                        {
                            parents = parents.Count,
                            students = students.Count,
                            studentParentRelations = studentParents.Count,
                            classUpdated = 1,
                        },
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "Lỗi khi seed dữ liệu", error = ex.Message }
                );
            }
        }

        [HttpPost("clear-students")]
        public async Task<IActionResult> ClearStudentData()
        {
            try
            {
                // Xóa dữ liệu theo thứ tự đúng (foreign key constraints)
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM StudentParent");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Student");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Parent");
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE Class SET CurrentStudentCount = 0"
                );

                return Ok(new { message = "Đã xóa tất cả dữ liệu học sinh và phụ huynh" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa dữ liệu", error = ex.Message });
            }
        }

        [HttpGet("check-data")]
        public async Task<IActionResult> CheckData()
        {
            try
            {
                var classCount = await _context.Classes.CountAsync();
                var studentCount = await _context.Students.CountAsync();
                var parentCount = await _context.Parents.CountAsync();
                var relationCount = await _context.StudentParents.CountAsync();

                return Ok(
                    new
                    {
                        classes = classCount,
                        students = studentCount,
                        parents = parentCount,
                        studentParentRelations = relationCount,
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new { message = "Lỗi khi kiểm tra dữ liệu", error = ex.Message }
                );
            }
        }
    }
}
