using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class SeedClassDataAndUpdateStudentClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert class data for grades 1-5, sections A, B, C
            var classes = new List<object>();
            int classId = 1;

            for (int grade = 1; grade <= 5; grade++)
            {
                foreach (string section in new[] { "A", "B", "C" })
                {
                    classes.Add(new
                    {
                        ClassId = classId++,
                        ClassName = $"{grade}{section}",
                        GradeLevel = grade,
                        Section = section,
                        Description = $"Lớp {grade}{section}",
                        MaxStudents = 35,
                        CurrentStudentCount = 0,
                        ClassTeacher = "",
                        ClassRoom = $"Phòng {grade}{section}",
                        IsActive = true,
                        CreatedAt = DateTime.Now
                    });
                }
            }

            // Insert classes if they don't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM [Class] WHERE ClassName = '1A')
                BEGIN
                    INSERT INTO [Class] (ClassName, GradeLevel, Section, Description, MaxStudents, CurrentStudentCount, ClassTeacher, ClassRoom, IsActive, CreatedAt)
                    VALUES 
                        ('1A', 1, 'A', 'Lớp 1A', 35, 0, '', 'Phòng 1A', 1, GETDATE()),
                        ('1B', 1, 'B', 'Lớp 1B', 35, 0, '', 'Phòng 1B', 1, GETDATE()),
                        ('1C', 1, 'C', 'Lớp 1C', 35, 0, '', 'Phòng 1C', 1, GETDATE()),
                        ('2A', 2, 'A', 'Lớp 2A', 35, 0, '', 'Phòng 2A', 1, GETDATE()),
                        ('2B', 2, 'B', 'Lớp 2B', 35, 0, '', 'Phòng 2B', 1, GETDATE()),
                        ('2C', 2, 'C', 'Lớp 2C', 35, 0, '', 'Phòng 2C', 1, GETDATE()),
                        ('3A', 3, 'A', 'Lớp 3A', 35, 0, '', 'Phòng 3A', 1, GETDATE()),
                        ('3B', 3, 'B', 'Lớp 3B', 35, 0, '', 'Phòng 3B', 1, GETDATE()),
                        ('3C', 3, 'C', 'Lớp 3C', 35, 0, '', 'Phòng 3C', 1, GETDATE()),
                        ('4A', 4, 'A', 'Lớp 4A', 35, 0, '', 'Phòng 4A', 1, GETDATE()),
                        ('4B', 4, 'B', 'Lớp 4B', 35, 0, '', 'Phòng 4B', 1, GETDATE()),
                        ('4C', 4, 'C', 'Lớp 4C', 35, 0, '', 'Phòng 4C', 1, GETDATE()),
                        ('5A', 5, 'A', 'Lớp 5A', 35, 0, '', 'Phòng 5A', 1, GETDATE()),
                        ('5B', 5, 'B', 'Lớp 5B', 35, 0, '', 'Phòng 5B', 1, GETDATE()),
                        ('5C', 5, 'C', 'Lớp 5C', 35, 0, '', 'Phòng 5C', 1, GETDATE())
                END
            ");

            // Update students' ClassId based on their DateOfBirth
            // Logic: Calculate age and assign to appropriate grade, then distribute among sections A, B, C
            migrationBuilder.Sql(@"
                DECLARE @CurrentDate DATE = GETDATE()
                
                -- Create a temporary table to hold class assignments
                CREATE TABLE #ClassAssignments (
                    StudentId INT,
                    ClassId INT,
                    CalculatedGrade INT
                )
                
                -- Calculate grade for each student based on age
                -- Age 6-7: Grade 1, Age 7-8: Grade 2, etc.
                -- Students born in 2016-2017: Grade 5 (Age 7-8 in 2024)
                -- Students born in 2017-2018: Grade 4 (Age 6-7 in 2024)
                -- Students born in 2018-2019: Grade 3 (Age 5-6 in 2024)
                -- Students born in 2019-2020: Grade 2 (Age 4-5 in 2024)
                -- Students born in 2020-2021: Grade 1 (Age 3-4 in 2024)
                
                INSERT INTO #ClassAssignments (StudentId, CalculatedGrade)
                SELECT 
                    StudentId,
                    CASE 
                        WHEN YEAR(DateOfBirth) <= 2017 THEN 5  -- Oldest students go to grade 5
                        WHEN YEAR(DateOfBirth) = 2018 THEN 4
                        WHEN YEAR(DateOfBirth) = 2019 THEN 3
                        WHEN YEAR(DateOfBirth) = 2020 THEN 2
                        WHEN YEAR(DateOfBirth) >= 2021 THEN 1  -- Youngest students go to grade 1
                        ELSE 1  -- Default to grade 1
                    END as CalculatedGrade
                FROM Student
                WHERE ClassId IS NULL OR ClassId = 0
                
                -- Assign students to classes within their grade level
                -- Distribute evenly among sections A, B, C using ROW_NUMBER
                UPDATE ca
                SET ClassId = c.ClassId
                FROM #ClassAssignments ca
                INNER JOIN (
                    SELECT 
                        ca2.StudentId,
                        ca2.CalculatedGrade,
                        c2.ClassId,
                        ROW_NUMBER() OVER (PARTITION BY ca2.CalculatedGrade ORDER BY ca2.StudentId) as RowNum
                    FROM #ClassAssignments ca2
                    CROSS JOIN (
                        SELECT ClassId, GradeLevel, Section,
                               ROW_NUMBER() OVER (PARTITION BY GradeLevel ORDER BY Section) as SectionOrder
                        FROM Class 
                        WHERE GradeLevel BETWEEN 1 AND 5
                    ) c2
                    WHERE ca2.CalculatedGrade = c2.GradeLevel
                ) ranked ON ca.StudentId = ranked.StudentId
                INNER JOIN Class c ON ranked.ClassId = c.ClassId
                WHERE (ranked.RowNum - 1) % 3 + 1 = (
                    SELECT ROW_NUMBER() OVER (PARTITION BY GradeLevel ORDER BY Section)
                    FROM Class c3 
                    WHERE c3.ClassId = c.ClassId
                )
                
                -- Update the actual Student table
                UPDATE s
                SET ClassId = ca.ClassId
                FROM Student s
                INNER JOIN #ClassAssignments ca ON s.StudentId = ca.StudentId
                WHERE ca.ClassId IS NOT NULL
                
                -- Clean up
                DROP TABLE #ClassAssignments
                
                -- Update CurrentStudentCount for each class
                UPDATE c
                SET CurrentStudentCount = (
                    SELECT COUNT(*)
                    FROM Student s
                    WHERE s.ClassId = c.ClassId
                )
                FROM Class c
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove class assignments from students
            migrationBuilder.Sql(@"
                UPDATE Student SET ClassId = NULL
            ");

            // Remove the seeded classes
            migrationBuilder.Sql(@"
                DELETE FROM [Class] 
                WHERE ClassName IN ('1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C')
            ");
        }
    }
}
