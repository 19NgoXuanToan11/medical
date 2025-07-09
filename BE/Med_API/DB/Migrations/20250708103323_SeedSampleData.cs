using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class SeedSampleData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Thêm dữ liệu lớp học - 15 lớp (5 khối x 3 lớp)
            migrationBuilder.Sql(@"
                INSERT INTO Class (ClassName, GradeLevel, Section, MaxStudents, CurrentStudentCount, ClassTeacher, ClassRoom, IsActive, CreatedAt)
                VALUES 
                ('Lớp 1A', 1, 'A', 30, 25, N'Cô Nguyễn Thị Lan', N'Phòng 101', 1, GETDATE()),
                ('Lớp 1B', 1, 'B', 30, 25, N'Cô Trần Thị Mai', N'Phòng 102', 1, GETDATE()),
                ('Lớp 1C', 1, 'C', 30, 25, N'Cô Lê Thị Hoa', N'Phòng 103', 1, GETDATE()),
                ('Lớp 2A', 2, 'A', 30, 25, N'Cô Phạm Thị Linh', N'Phòng 201', 1, GETDATE()),
                ('Lớp 2B', 2, 'B', 30, 25, N'Cô Vũ Thị Nga', N'Phòng 202', 1, GETDATE()),
                ('Lớp 2C', 2, 'C', 30, 25, N'Cô Đặng Thị Tâm', N'Phòng 203', 1, GETDATE()),
                ('Lớp 3A', 3, 'A', 30, 25, N'Cô Hoàng Thị Thu', N'Phòng 301', 1, GETDATE()),
                ('Lớp 3B', 3, 'B', 30, 25, N'Cô Bùi Thị Vân', N'Phòng 302', 1, GETDATE()),
                ('Lớp 3C', 3, 'C', 30, 25, N'Cô Phan Thị Xuân', N'Phòng 303', 1, GETDATE()),
                ('Lớp 4A', 4, 'A', 30, 25, N'Cô Ngô Thị Yến', N'Phòng 401', 1, GETDATE()),
                ('Lớp 4B', 4, 'B', 30, 25, N'Cô Dương Thị Oanh', N'Phòng 402', 1, GETDATE()),
                ('Lớp 4C', 4, 'C', 30, 25, N'Cô Lý Thị Phượng', N'Phòng 403', 1, GETDATE()),
                ('Lớp 5A', 5, 'A', 30, 25, N'Cô Võ Thị Quỳnh', N'Phòng 501', 1, GETDATE()),
                ('Lớp 5B', 5, 'B', 30, 25, N'Cô Trương Thị Bích', N'Phòng 502', 1, GETDATE()),
                ('Lớp 5C', 5, 'C', 30, 25, N'Cô Đinh Thị Cẩm', N'Phòng 503', 1, GETDATE())
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Xóa dữ liệu
            migrationBuilder.Sql("DELETE FROM Class WHERE ClassName LIKE 'Lớp %'");
        }
    }
}
