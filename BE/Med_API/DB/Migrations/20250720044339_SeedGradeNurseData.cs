using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class SeedGradeNurseData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Seed GradeNurse assignments: Assign 5 nurses to 5 grades
            migrationBuilder.Sql(@"
                -- Clear existing GradeNurse assignments to avoid duplicates
                DELETE FROM GradeNurse;
                
                -- First check if we have enough nurses
                DECLARE @nurseCount INT = (
                    SELECT COUNT(*) FROM Staff s 
                    INNER JOIN Role r ON s.RoleId = r.RoleId 
                    WHERE r.RoleName = 'Nurse' AND s.IsActiveForRequest = 1
                );
                
                DECLARE @nurseRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Nurse');
                
                -- Create additional nurses if needed
                WHILE @nurseCount < 5
                BEGIN
                    SET @nurseCount = @nurseCount + 1;
                    
                    INSERT INTO Staff (RoleId, FirstName, LastName, Email, Phone, Username, PasswordHash, IsActiveForRequest)
                    VALUES (
                        @nurseRoleId,
                        N'Y tá',
                        N'Khối ' + CAST(@nurseCount AS NVARCHAR),
                        'nurse' + CAST(@nurseCount AS NVARCHAR) + '@school.edu.vn',
                        '012345678' + CAST(@nurseCount AS NVARCHAR),
                        'nurse' + CAST(@nurseCount AS NVARCHAR),
                        'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=', -- password: 123456
                        1
                    );
                END
                
                -- Now assign the first 5 nurses to grades 1-5
                INSERT INTO GradeNurse (StaffId, Grade)
                SELECT StaffId, ROW_NUMBER() OVER (ORDER BY StaffId) as Grade
                FROM (
                    SELECT TOP 5 s.StaffId
                    FROM Staff s
                    INNER JOIN Role r ON s.RoleId = r.RoleId
                    WHERE r.RoleName = 'Nurse' AND s.IsActiveForRequest = 1
                    ORDER BY s.StaffId
                ) AS TopNurses;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove the seeded GradeNurse data
            migrationBuilder.Sql(@"
                DELETE FROM GradeNurse;
            ");
        }
    }
}
