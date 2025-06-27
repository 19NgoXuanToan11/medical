-- Script để thêm dữ liệu test cho API HealthCheckForm
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

-- 1. Thêm Student test
INSERT INTO Student (StudentCode, FirstName, LastName, DateOfBirth, Gender, ClassName, GradeLevel, Address, Password, IsActive)
VALUES 
('ST001', N'Nguyễn', N'Văn A', '2010-05-15', N'Nam', N'10A', 10, N'123 Đường ABC, Quận 1, TP.HCM', 'password123', 1),
('ST002', N'Trần', N'Thị B', '2010-08-20', N'Nữ', N'10A', 10, N'456 Đường XYZ, Quận 2, TP.HCM', 'password123', 1),
('ST003', N'Lê', N'Văn C', '2010-03-10', N'Nam', N'10B', 10, N'789 Đường DEF, Quận 3, TP.HCM', 'password123', 1);

-- 2. Thêm Parent test
INSERT INTO Parent (FirstName, LastName, Relationship, Phone, Email, Address, Occupation, Password, IsEmergencyContact, IsMainContact, IsActive)
VALUES 
(N'Nguyễn', N'Văn Cha', N'Cha', '0901234567', 'cha.nguyen@email.com', N'123 Đường ABC, Quận 1, TP.HCM', N'Kỹ sư', 'password123', 1, 1, 1),
(N'Trần', N'Thị Mẹ', N'Mẹ', '0901234568', 'me.tran@email.com', N'123 Đường ABC, Quận 1, TP.HCM', N'Giáo viên', 'password123', 1, 0, 1),
(N'Trần', N'Văn Cha2', N'Cha', '0901234569', 'cha2.tran@email.com', N'456 Đường XYZ, Quận 2, TP.HCM', N'Bác sĩ', 'password123', 1, 1, 1),
(N'Lê', N'Thị Mẹ2', N'Mẹ', '0901234570', 'me2.le@email.com', N'789 Đường DEF, Quận 3, TP.HCM', N'Luật sư', 'password123', 1, 1, 1);

-- 3. Thêm Staff test (để có thể confirm HealthCheckForm)
INSERT INTO Staff (Username, Email, FirstName, LastName, Phone, Password, RoleId, IsActive)
VALUES 
('doctor1', 'doctor1@school.com', N'Bác sĩ', N'Nguyễn Văn D', '0901234571', 'password123', 1, 1),
('nurse1', 'nurse1@school.com', N'Y tá', N'Trần Thị E', '0901234572', 'password123', 2, 1);

-- 4. Thêm Role test (nếu chưa có)
IF NOT EXISTS (SELECT * FROM Role WHERE RoleId = 1)
BEGIN
    INSERT INTO Role (RoleName, Description, IsActive)
    VALUES (N'Bác sĩ', N'Bác sĩ y tế học đường', 1);
END

IF NOT EXISTS (SELECT * FROM Role WHERE RoleId = 2)
BEGIN
    INSERT INTO Role (RoleName, Description, IsActive)
    VALUES (N'Y tá', N'Y tá học đường', 1);
END

-- 5. Liên kết Student với Parent
INSERT INTO Student_Parent (StudentCode, ParentID)
VALUES 
('ST001', 1), -- Nguyễn Văn A với Nguyễn Văn Cha
('ST001', 2), -- Nguyễn Văn A với Trần Thị Mẹ
('ST002', 3), -- Trần Thị B với Trần Văn Cha2
('ST003', 4); -- Lê Văn C với Lê Thị Mẹ2

-- 6. Thêm HealthProfile test
INSERT INTO HealthProfile (StudentCode, Height, Weight, BloodPressure, HeartRate, LastUpdated)
VALUES 
('ST001', 165.5, 55.2, '120/80', 75, GETDATE()),
('ST002', 160.0, 50.0, '110/70', 72, GETDATE()),
('ST003', 170.0, 60.0, '125/85', 78, GETDATE());

-- Kiểm tra dữ liệu đã thêm
SELECT 'Students' as TableName, COUNT(*) as Count FROM Student
UNION ALL
SELECT 'Parents' as TableName, COUNT(*) as Count FROM Parent
UNION ALL
SELECT 'Staff' as TableName, COUNT(*) as Count FROM Staff
UNION ALL
SELECT 'Student_Parent' as TableName, COUNT(*) as Count FROM Student_Parent
UNION ALL
SELECT 'HealthProfile' as TableName, COUNT(*) as Count FROM HealthProfile; 