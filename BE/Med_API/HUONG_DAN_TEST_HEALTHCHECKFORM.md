# Hướng dẫn Test API POST/HealthCheckForm

## 📋 Bước 1: Chuẩn bị dữ liệu test

### 1.1 Chạy script SQL để thêm dữ liệu test
```sql
-- Chạy file: seed_test_data.sql
-- Script này sẽ thêm:
-- - 3 Students (ID: 1, 2, 3)
-- - 4 Parents (ID: 1, 2, 3, 4)
-- - 2 Staff (ID: 1, 2)
-- - 2 Roles (ID: 1, 2)
-- - Liên kết Student-Parent
-- - HealthProfile cho các students
```

### 1.2 Kiểm tra dữ liệu đã được thêm
```sql
SELECT 'Students' as TableName, COUNT(*) as Count FROM Student
UNION ALL
SELECT 'Parents' as TableName, COUNT(*) as Count FROM Parent
UNION ALL
SELECT 'Staff' as TableName, COUNT(*) as Count FROM Staff;
```

## 🚀 Bước 2: Khởi động API

```bash
cd Med_API/API
dotnet run
```

API sẽ chạy tại: `https://localhost:7111`

## 🧪 Bước 3: Test với Swagger UI

### 3.1 Truy cập Swagger UI
- Mở trình duyệt: `https://localhost:7111/swagger`
- Tìm endpoint: `POST /api/HealthCheckForm`

### 3.2 Test Cases

#### ✅ **Test Case 1: Tạo HealthCheckForm thành công**
```json
{
  "studentId": 1,
  "parentId": 1,
  "consentStatus": "Pending",
  "className": "10A"
}
```
**Expected:** Status 201 Created

#### ❌ **Test Case 2: Thiếu StudentId (bắt buộc)**
```json
{
  "parentId": 1,
  "consentStatus": "Pending",
  "className": "10A"
}
```
**Expected:** Status 400 Bad Request

#### ❌ **Test Case 3: ConsentStatus không hợp lệ**
```json
{
  "studentId": 1,
  "parentId": 1,
  "consentStatus": "InvalidStatus",
  "className": "10A"
}
```
**Expected:** Status 400 Bad Request

#### ❌ **Test Case 4: StudentId không tồn tại**
```json
{
  "studentId": 999,
  "parentId": 1,
  "consentStatus": "Pending",
  "className": "10A"
}
```
**Expected:** Status 400 Bad Request

#### ✅ **Test Case 5: Dữ liệu tối thiểu**
```json
{
  "studentId": 1
}
```
**Expected:** Status 201 Created

#### ✅ **Test Case 6: Tất cả các trường**
```json
{
  "studentId": 2,
  "parentId": 3,
  "consentStatus": "Approved",
  "className": "10A",
  "confirmStatus": "Confirmed",
  "confirmedBy": 1
}
```
**Expected:** Status 201 Created

## 📊 Bước 4: Test với PowerShell

### 4.1 Sử dụng script có sẵn
```powershell
cd Med_API
powershell -ExecutionPolicy Bypass -File test_healthcheckform.ps1
```

### 4.2 Test thủ công
```powershell
$uri = "https://localhost:7111/api/HealthCheckForm"
$body = @{
    studentId = 1
    parentId = 1
    consentStatus = "Pending"
    className = "10A"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $body -SkipCertificateCheck
Write-Host "Status: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

## 📝 Bước 5: Test với HTTP file

### 5.1 Sử dụng file test_api.http
- Mở file `test_api.http` trong VS Code
- Cài extension "REST Client" nếu chưa có
- Click "Send Request" cho từng test case

### 5.2 Hoặc sử dụng curl
```bash
curl -X POST "https://localhost:7111/api/HealthCheckForm" \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "parentId": 1, "consentStatus": "Pending", "className": "10A"}'
```

## 🔍 Bước 6: Kiểm tra kết quả

### 6.1 Kiểm tra database
```sql
-- Xem HealthCheckForm đã tạo
SELECT * FROM HealthCheckForm ORDER BY FormId DESC;

-- Xem HealthCheckForm với thông tin Student và Parent
SELECT 
    hf.FormId,
    hf.StudentId,
    hf.ParentId,
    hf.ConsentStatus,
    hf.ClassName,
    s.FirstName + ' ' + s.LastName as StudentName,
    p.FirstName + ' ' + p.LastName as ParentName
FROM HealthCheckForm hf
JOIN Student s ON hf.StudentId = s.StudentId
LEFT JOIN Parent p ON hf.ParentId = p.ParentId
ORDER BY hf.FormId DESC;
```

### 6.2 Kiểm tra API response
- Status code: 201 Created (thành công) hoặc 400 Bad Request (lỗi)
- Response body: JSON với thông tin HealthCheckForm đã tạo
- Headers: Location header chứa URL để lấy form vừa tạo

## 🎯 Kết quả mong đợi

### ✅ **Thành công:**
- Status: 201 Created
- Response: JSON với thông tin HealthCheckForm
- Database: Record mới được thêm vào bảng HealthCheckForm

### ❌ **Lỗi validation:**
- Status: 400 Bad Request
- Response: JSON với thông tin lỗi
- Database: Không có record mới

## 📚 Tài liệu tham khảo

- File test data: `swagger_test_data.json`
- Script SQL: `seed_test_data.sql`
- PowerShell script: `test_healthcheckform.ps1`
- HTTP test file: `test_api.http` 