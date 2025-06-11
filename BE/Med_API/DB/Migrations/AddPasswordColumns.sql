-- Thêm cột Password vào bảng Student
ALTER TABLE Student
ADD Password NVARCHAR(255) NOT NULL DEFAULT '123456';

-- Thêm cột Password vào bảng Parent
ALTER TABLE Parent
ADD Password NVARCHAR(255) NOT NULL DEFAULT '123456'; 