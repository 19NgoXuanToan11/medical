-- Thêm cột DiseaseType vào bảng Vaccine
ALTER TABLE Vaccine 
ADD DiseaseType NVARCHAR(200) NULL;

-- Thêm comment cho cột mới
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Loại bệnh mà vaccine phòng ngừa', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'Vaccine', 
    @level2type = N'COLUMN', @level2name = N'DiseaseType'; 