# Hướng dẫn Test API POST/HealthCheckForm

## 📋 Bước 1: Chuẩn bị dữ liệu test

### 1.1 Dữ liệu thực tế trong database
```sql
-- Students (ID: 4-13)
SELECT StudentId, StudentCode, FirstName, LastName FROM Student;

-- Parents (ID: 13-22)  
SELECT ParentId, FirstName, LastName FROM Parent;

-- Staff (ID: 8-17)
SELECT StaffId, FirstName, LastName FROM Staff;
```

### 1.2 Kiểm tra dữ liệu đã có
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
  "studentId": 4,
  "parentId": 13,
  "consentStatus": "Pending",
  "className": "5A"
}
```
**Expected:** Status 201 Created

#### ❌ **Test Case 2: Thiếu StudentId (bắt buộc)**
```json
{
  "parentId": 13,
  "consentStatus": "Pending",
  "className": "5A"
}
```
**Expected:** Status 400 Bad Request

#### ❌ **Test Case 3: ConsentStatus không hợp lệ**
```json
{
  "studentId": 4,
  "parentId": 13,
  "consentStatus": "InvalidStatus",
  "className": "5A"
}
```
**Expected:** Status 400 Bad Request

#### ❌ **Test Case 4: StudentId không tồn tại**
```json
{
  "studentId": 999,
  "parentId": 13,
  "consentStatus": "Pending",
  "className": "5A"
}
```
**Expected:** Status 400 Bad Request

#### ✅ **Test Case 5: Dữ liệu tối thiểu**
```json
{
  "studentId": 4
}
```
**Expected:** Status 201 Created

#### ✅ **Test Case 6: Tất cả các trường**
```json
{
  "studentId": 5,
  "parentId": 14,
  "consentStatus": "Approved",
  "className": "5A",
  "confirmStatus": "Confirmed",
  "confirmedBy": 8
}
```
**Expected:** Status 201 Created

## 📊 Bước 4: Test các API khác

### 4.1 GET tất cả HealthCheckForms
```
GET /api/HealthCheckForm
```

### 4.2 GET HealthCheckForm theo ID
```
GET /api/HealthCheckForm/1
```

### 4.3 PUT cập nhật HealthCheckForm
```
PUT /api/HealthCheckForm/1
```
**Body:**
```json
{
  "formId": 1,
  "studentId": 4,
  "parentId": 13,
  "consentStatus": "Approved",
  "className": "5A"
}
```

### 4.4 DELETE HealthCheckForm
```
DELETE /api/HealthCheckForm/1
```

### 4.5 GET HealthCheckForms theo StudentId
```
GET /api/HealthCheckForm/student/4
```

### 4.6 GET HealthCheckForms theo ParentId
```
GET /api/HealthCheckForm/parent/13
```

### 4.7 GET HealthCheckForms theo Status
```
GET /api/HealthCheckForm/status/Pending
GET /api/HealthCheckForm/status/Approved
GET /api/HealthCheckForm/status/Rejected
GET /api/HealthCheckForm/status/Cancelled
```

## 📝 Bước 5: Test với PowerShell

### 5.1 Sử dụng script có sẵn
```powershell
cd Med_API
powershell -ExecutionPolicy Bypass -File test_healthcheckform.ps1
```

### 5.2 Test thủ công
```powershell
$uri = "https://localhost:7111/api/HealthCheckForm"
$body = @{
    studentId = 4
    parentId = 13
    consentStatus = "Pending"
    className = "5A"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $body -SkipCertificateCheck
Write-Host "Status: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

## 📝 Bước 6: Test với HTTP file

### 6.1 Sử dụng file test_api.http
- Mở file `Med_API/test_api.http` trong VS Code
- Cài extension "REST Client" nếu chưa có
- Click "Send Request" cho từng test case

### 6.2 Hoặc sử dụng curl
```bash
curl -X POST "https://localhost:7111/api/HealthCheckForm" \
  -H "Content-Type: application/json" \
  -d '{"studentId": 4, "parentId": 13, "consentStatus": "Pending", "className": "5A"}'
```

## 🔍 Bước 7: Kiểm tra kết quả

### 7.1 Kiểm tra database
```sql
-- Xem HealthCheckForm đã tạo
SELECT * FROM Health_Check_Form ORDER BY FormID DESC;

-- Xem HealthCheckForm với thông tin Student và Parent
SELECT 
    hf.FormID,
    hf.StudentID,
    hf.ParentID,
    hf.ConsentStatus,
    hf.ClassName,
    s.FirstName + ' ' + s.LastName as StudentName,
    p.FirstName + ' ' + p.LastName as ParentName
FROM Health_Check_Form hf
JOIN Student s ON hf.StudentID = s.StudentID
LEFT JOIN Parent p ON hf.ParentID = p.ParentID
ORDER BY hf.FormID DESC;
```

### 7.2 Kiểm tra API response
- Status code: 201 Created (thành công) hoặc 400 Bad Request (lỗi)
- Response body: JSON với thông tin HealthCheckForm đã tạo
- Headers: Location header chứa URL để lấy form vừa tạo

## 🎯 Kết quả mong đợi

### ✅ **Thành công:**
- Status: 201 Created
- Response: JSON với thông tin HealthCheckForm
- Database: Record mới được thêm vào bảng Health_Check_Form

### ❌ **Lỗi validation:**
- Status: 400 Bad Request
- Response: JSON với thông tin lỗi
- Database: Không có record mới

## 📚 Tài liệu tham khảo

- File test data: `swagger_test_data.json`
- Script SQL: `seed_test_data.sql`
- PowerShell script: `test_healthcheckform.ps1`
- HTTP test file: `test_api.http`

## ⚠️ Lưu ý quan trọng

### Dữ liệu thực tế trong database:
- **StudentId**: 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
- **ParentId**: 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
- **StaffId**: 8, 9, 10, 11, 12, 13, 14, 15, 16, 17

### ConsentStatus hợp lệ:
- "Pending"
- "Approved"
- "Rejected"
- "Cancelled"

### ConfirmStatus hợp lệ:
- "Confirmed"
- "Unconfirmed"
- null 