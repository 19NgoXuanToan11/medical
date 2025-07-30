# Tính năng Thêm Loại Bệnh cho Vaccine

## Tổng quan
Tính năng này cho phép người dùng thêm thông tin về loại bệnh mà vaccine phòng ngừa khi tạo hoặc chỉnh sửa vaccine trong hệ thống.

## Các thay đổi đã thực hiện

### 1. Backend Changes

#### Database Model (Vaccine.cs)
- Thêm trường `DiseaseType` với kiểu dữ liệu `string` và độ dài tối đa 200 ký tự
- Trường này lưu trữ thông tin về loại bệnh mà vaccine phòng ngừa

#### DTOs (VaccineDto.cs)
- Cập nhật tất cả các DTO classes (ViewModel, Create, Update) để bao gồm trường `DiseaseType`

### 2. Frontend Changes

#### Updated Components
1. **VaccineSelectionStep.jsx**
   - Thêm hiển thị thông tin loại bệnh trong danh sách vaccine
   - Cập nhật tìm kiếm để bao gồm loại bệnh
   - Hiển thị thông tin "Phòng bệnh: [tên bệnh]" cho mỗi vaccine

2. **VaccineManagement.jsx**
   - Thêm cột "Loại bệnh" trong bảng danh sách vaccine
   - Cập nhật form thêm/sửa vaccine để bao gồm trường loại bệnh
   - Cập nhật tìm kiếm để bao gồm loại bệnh
   - Sử dụng input text đơn giản cho trường loại bệnh

## Cách sử dụng

### 1. Thêm vaccine mới
1. Vào trang Quản lý Vaccine
2. Nhấn nút "Thêm vaccine"
3. Điền thông tin cơ bản
4. Trong trường "Loại bệnh phòng ngừa", nhập tên bệnh mà vaccine phòng ngừa
   - Ví dụ: "Sởi", "Viêm gan B", "Cúm", "COVID-19", v.v.

### 2. Chỉnh sửa vaccine
1. Trong danh sách vaccine, nhấn nút chỉnh sửa
2. Cập nhật thông tin loại bệnh tương tự như khi thêm mới

### 3. Tìm kiếm vaccine
- Có thể tìm kiếm vaccine theo tên, nhà sản xuất, hoặc loại bệnh
- Ví dụ: tìm "Sởi" sẽ hiển thị tất cả vaccine phòng bệnh sởi

### 4. Chọn vaccine khi tạo lịch tiêm chủng
- Trong bước chọn vaccine, sẽ hiển thị thông tin "Phòng bệnh: [tên bệnh]" cho mỗi vaccine
- Có thể tìm kiếm vaccine theo loại bệnh

## Lợi ích

1. **Thông tin rõ ràng**: Người dùng biết chính xác vaccine phòng bệnh gì
2. **Tìm kiếm dễ dàng**: Có thể tìm vaccine theo loại bệnh
3. **Quản lý hiệu quả**: Dễ dàng phân loại và quản lý vaccine
4. **Đơn giản và linh hoạt**: Có thể nhập bất kỳ tên bệnh nào mà không bị giới hạn

## Cài đặt Database

### Cách 1: Sử dụng SQL Script
Chạy file `medical/BE/Med_API/DB/Scripts/AddDiseaseTypeColumn.sql`:

```sql
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
```

### Cách 2: Sử dụng Entity Framework Migration
```bash
cd medical/BE/Med_API
dotnet ef migrations add AddDiseaseTypeToVaccine
dotnet ef database update
```

## Lưu ý

- Trường `DiseaseType` là optional, vaccine cũ không có thông tin này vẫn hoạt động bình thường
- Có thể nhập tên bệnh tùy ý, không bị giới hạn bởi danh sách có sẵn
- Tìm kiếm không phân biệt chữ hoa/thường
- Thông tin loại bệnh sẽ được hiển thị rõ ràng trong danh sách vaccine và khi chọn vaccine 