# HƯỚNG DẪN SỬ DỤNG MEDICINE REQUEST VÀ REQUEST RESULT API

## Tổng Quan
Hệ thống Medicine Request quản lý việc yêu cầu thuốc từ phụ huynh và quá trình thực hiện bởi y tá. Hệ thống bao gồm:
- **MedicineRequest**: Yêu cầu thuốc từ phụ huynh
- **RequestResult**: Kết quả thực hiện yêu cầu thuốc

## Cấu Trúc Dữ Liệu

### MedicineRequest
```json
{
  "requestId": 1,
  "studentCode": "STU001",
  "className": "Lớp 3A",
  "date": "2024-01-15",
  "status": "Pending",
  "requestDate": "2024-01-15T08:00:00Z",
  "parentId": 1,
  "staffId": 2,
  "refusalReason": null,
  "student": { /* Student info */ },
  "parent": { /* Parent info */ },
  "staff": { /* Staff info */ },
  "medicineRequestItems": [
    {
      "medicineRequestItemId": 1,
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Sáng 2 lần, Trưa 1 lần",
      "timeOfDay": "sáng, trưa",
      "instructions": "Uống sau khi ăn",
      "verificationStatus": "Pending" // Trạng thái xác thực: Pending, Verified, Refused
    },
    {
      "medicineRequestItemId": 2,
      "medicineName": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "Trưa 1 lần, Chiều 1 lần",
      "timeOfDay": "trưa, chiều",
      "instructions": "Uống sau khi ăn trưa",
      "verificationStatus": "Pending"
    }
  ]
}
```

### RequestResult
```json
{
  "resultId": 1,
  "requestId": 1,
  "status": "In Progress",
  "submittedAt": "2024-01-15T08:00:00Z",
  "administeredTime": "2024-01-15T08:30:00Z",
  "administeredBy": 2,
  "actionBy": 2,
  "frequency": "sáng, trưa",
  "timesPerDay": 3,
  "currentDayCount": 1,
  "currentDate": "2024-01-15",
  "administeredFrequencies": ["sáng"],
  "failedFrequencies": [],
  "failureReasons": {},
  "isReRequest": false,
  "originalRequestResultId": null,
  "lastAttemptTime": "2024-01-15T08:30:00Z",
  "failedAttempts": 0,
  "reRequestReason": null
}
```

## API Endpoints

### 1. Medicine Request APIs

#### 1.1 Lấy Danh Sách Tất Cả Yêu Cầu Thuốc
```http
GET /api/MedicineRequest
```
**Mô tả**: Lấy tất cả yêu cầu thuốc trong hệ thống
**Response**: Danh sách MedicineRequest với đầy đủ thông tin

#### 1.2 Lấy Yêu Cầu Thuốc Theo ID
```http
GET /api/MedicineRequest/{id}
```
**Mô tả**: Lấy thông tin chi tiết một yêu cầu thuốc
**Parameters**: `id` - ID của yêu cầu thuốc
**Response**: Thông tin chi tiết MedicineRequest

#### 1.3 Lấy Yêu Cầu Thuốc Theo Mã Học Sinh
```http
GET /api/MedicineRequest/student/{studentCode}
```
**Mô tả**: Lấy tất cả yêu cầu thuốc của một học sinh
**Parameters**: `studentCode` - Mã học sinh
**Response**: Danh sách MedicineRequest của học sinh

#### 1.4 Lấy Yêu Cầu Thuốc Theo ID Phụ Huynh
```http
GET /api/MedicineRequest/parent/{parentId}
```
**Mô tả**: Lấy tất cả yêu cầu thuốc của một phụ huynh
**Parameters**: `parentId` - ID phụ huynh
**Response**: Danh sách MedicineRequest của phụ huynh

#### 1.5 Lấy Yêu Cầu Thuốc Theo Trạng Thái
```http
GET /api/MedicineRequest/status/{status}
```
**Mô tả**: Lấy yêu cầu thuốc theo trạng thái
**Parameters**: `status` - Trạng thái (Pending, Verified, Assigned, Completed, Refused)
**Response**: Danh sách MedicineRequest theo trạng thái

#### 1.6 Lấy Danh Sách Yêu Cầu Đang Chờ
```http
GET /api/MedicineRequest/pending
```
**Mô tả**: Lấy tất cả yêu cầu thuốc đang chờ xử lý
**Response**: Danh sách MedicineRequest với status "Pending"

#### 1.7 Lấy Danh Sách Yêu Cầu Đã Xác Thực
```http
GET /api/MedicineRequest/verified
```
**Mô tả**: Lấy tất cả yêu cầu thuốc đã được xác thực
**Response**: Danh sách MedicineRequest với status "Verified"

#### 1.8 Lấy Danh Sách Yêu Cầu Đã Phân Công
```http
GET /api/MedicineRequest/assigned
```
**Mô tả**: Lấy tất cả yêu cầu thuốc đã được phân công cho y tá
**Response**: Danh sách MedicineRequest với status "Assigned"

#### 1.9 Lấy Danh Sách Yêu Cầu Bị Từ Chối
```http
GET /api/MedicineRequest/refused
```
**Mô tả**: Lấy tất cả yêu cầu thuốc bị từ chối
**Response**: Danh sách MedicineRequest với status "Refused" và lý do từ chối

#### 1.10 Lấy Danh Sách Y Tá Có Sẵn
```http
GET /api/MedicineRequest/available-nurses
```
**Mô tả**: Lấy danh sách y tá có thể phân công
**Response**: Danh sách Staff có role "Nurse" và đang hoạt động

#### 1.11 Tạo Yêu Cầu Thuốc Mới
```http
POST /api/MedicineRequest
```
**Mô tả**: Tạo yêu cầu thuốc mới từ phụ huynh
**Request Body**:
```json
{
  "studentCode": "STU001",
  "className": "Lớp 3A",
  "parentId": 1,
  "date": "2024-01-15",
  "medicineRequestItems": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Sáng 2 lần, Trưa 1 lần",
      "timeOfDay": "sáng, trưa",
      "instructions": "Uống sau khi ăn",
      "verificationStatus": "Pending"
    },
    {
      "medicineName": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "Trưa 1 lần, Chiều 1 lần",
      "timeOfDay": "trưa, chiều",
      "instructions": "Uống sau khi ăn trưa",
      "verificationStatus": "Pending"
    }
  ]
}
```
**Response**: MedicineRequest đã tạo với status "Pending"

#### 1.12 Cập Nhật Yêu Cầu Thuốc
```http
PUT /api/MedicineRequest/{id}
```
**Mô tả**: Cập nhật thông tin yêu cầu thuốc
**Parameters**: `id` - ID yêu cầu thuốc
**Request Body**:
```json
{
  "status": "Verified",
  "className": "Lớp 3A",
  "date": "2024-01-15",
  "medicineRequestItems": [
    {
      "medicineRequestItemId": 1,
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Sáng 2 lần, Trưa 1 lần",
      "timeOfDay": "sáng, trưa",
      "instructions": "Uống sau khi ăn",
      "verificationStatus": "Pending"
    },
    {
      "medicineRequestItemId": 2,
      "medicineName": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "Trưa 1 lần, Chiều 1 lần",
      "timeOfDay": "trưa, chiều",
      "instructions": "Uống sau khi ăn trưa",
      "verificationStatus": "Pending"
    }
  ]
}
```

#### 1.13 Xóa Yêu Cầu Thuốc
```http
DELETE /api/MedicineRequest/{id}
```
**Mô tả**: Xóa yêu cầu thuốc
**Parameters**: `id` - ID yêu cầu thuốc

#### 1.14 Xác Thực Yêu Cầu Thuốc
```http
POST /api/MedicineRequest/{id}/verify
```
**Mô tả**: Y tá xác thực yêu cầu thuốc (kiểm tra thuốc phụ huynh mang đến)
**Parameters**: `id` - ID yêu cầu thuốc
**Request Body**: `staffId` - ID y tá thực hiện xác thực
**Response**: Status "Verified" nếu thành công

#### 1.15 Từ Chối Yêu Cầu Thuốc
```http
POST /api/MedicineRequest/{id}/refuse
```
**Mô tả**: Y tá từ chối yêu cầu thuốc với lý do
**Parameters**: `id` - ID yêu cầu thuốc
**Request Body**:
```json
{
  "staffId": 2,
  "refusalReason": "Phụ huynh không mang thuốc đến"
}
```
**Response**: Status "Refused" với lý do từ chối

#### 1.16 Phân Công Y Tá
```http
POST /api/MedicineRequest/{id}/assign-nurse/{staffId}
```
**Mô tả**: Phân công y tá cho yêu cầu thuốc đã xác thực
**Parameters**: 
- `id` - ID yêu cầu thuốc
- `staffId` - ID y tá được phân công
**Response**: Status "Assigned" nếu thành công

#### 1.17 Hoàn Thành Yêu Cầu Thuốc
```http
POST /api/MedicineRequest/{id}/complete/{staffId}
```
**Mô tả**: Đánh dấu yêu cầu thuốc đã hoàn thành
**Parameters**: 
- `id` - ID yêu cầu thuốc
- `staffId` - ID y tá hoàn thành
**Response**: Status "Completed"

### 2. Request Result APIs (Quản Lý Thực Hiện Thuốc)

#### 2.1 Bắt Đầu Thực Hiện Thuốc
```http
POST /api/MedicineRequest/{id}/start-administration/{staffId}
```
**Mô tả**: Bắt đầu quá trình thực hiện thuốc theo tần suất
**Parameters**: 
- `id` - ID yêu cầu thuốc
- `staffId` - ID y tá thực hiện
**Response**: RequestResult mới với status "In Progress"

#### 2.2 Thực Hiện Thuốc Theo Tần Suất
```http
POST /api/MedicineRequest/administer-frequency
```
**Mô tả**: Ghi nhận việc thực hiện thuốc cho một tần suất cụ thể
**Request Body**:
```json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "staffId": 2,
  "notes": "Học sinh uống thuốc thành công"
}
```

#### 2.3 Lấy Thông Tin Tiến Độ
```http
GET /api/MedicineRequest/{requestResultId}/progress/{medicineRequestItemId}
```
**Mô tả**: Kiểm tra tiến độ thực hiện thuốc
**Parameters**: 
- `requestResultId` - ID kết quả yêu cầu
- `medicineRequestItemId` - ID mục thuốc
**Response**:
```json
{
  "isCompleted": false,
  "pendingFrequencies": ["trưa", "chiều"]
}
```

#### 2.4 Báo Cáo Thất Bại
```http
POST /api/MedicineRequest/report-failure
```
**Mô tả**: Báo cáo thất bại khi thực hiện thuốc
**Request Body**:
```json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "failureReason": "Học sinh nôn mửa sau khi uống",
  "staffId": 2
}
```

#### 2.5 Tạo Yêu Cầu Lại
```http
POST /api/MedicineRequest/create-re-request
```
**Mô tả**: Tạo yêu cầu lại khi thất bại (trước 17h)
**Request Body**:
```json
{
  "originalRequestResultId": 1,
  "reRequestReason": "Complete Failure",
  "staffId": 2
}
```

#### 2.6 Lấy Danh Sách Yêu Cầu Thất Bại
```http
GET /api/MedicineRequest/failed-requests
```
**Mô tả**: Lấy tất cả yêu cầu thất bại
**Response**: Danh sách RequestResult với status "Failed" hoặc "Partially Failed"

#### 2.7 Lấy Danh Sách Yêu Cầu Lại
```http
GET /api/MedicineRequest/{originalRequestResultId}/re-requests
```
**Mô tả**: Lấy tất cả yêu cầu lại của một yêu cầu gốc
**Parameters**: `originalRequestResultId` - ID yêu cầu gốc
**Response**: Danh sách RequestResult là yêu cầu lại

#### 2.8 Cập Nhật Trạng Thái Theo Thời Gian
```http
POST /api/MedicineRequest/update-time-based-status
```
**Mô tả**: Cập nhật trạng thái tự động theo thời gian (quá 17h hoặc sang ngày mới)
**Response**: Cập nhật status thành "Failed" cho các yêu cầu quá hạn

#### 2.9 Lấy Thông Tin Yêu Cầu Lại
```http
GET /api/MedicineRequest/{requestResultId}/re-request-info
```
**Mô tả**: Kiểm tra xem yêu cầu có thể tạo lại không
**Parameters**: `requestResultId` - ID kết quả yêu cầu
**Response**:
```json
{
  "canReRequest": true
}
```

#### 2.10 Đánh Dấu Thất Bại
```http
POST /api/MedicineRequest/{requestResultId}/mark-failed
```
**Mô tả**: Đánh dấu yêu cầu là thất bại
**Parameters**: `requestResultId` - ID kết quả yêu cầu
**Request Body**: `reason` - Lý do thất bại

#### 2.11 Lấy Tóm Tắt Thất Bại
```http
GET /api/MedicineRequest/{requestResultId}/failure-summary
```
**Mô tả**: Lấy thông tin chi tiết về thất bại
**Parameters**: `requestResultId` - ID kết quả yêu cầu
**Response**:
```json
{
  "status": "Failed",
  "failedFrequencies": ["sáng", "trưa"],
  "failureReasons": {
    "sáng": "Học sinh nôn mửa",
    "trưa": "Học sinh từ chối uống"
  },
  "isEligibleForReRequest": true
}
```

### 3. Request Result APIs (CRUD Cơ Bản)

#### 3.1 Lấy Tất Cả Kết Quả Yêu Cầu
```http
GET /api/RequestResult
```
**Mô tả**: Lấy tất cả kết quả yêu cầu
**Response**: Danh sách RequestResult

#### 3.2 Lấy Kết Quả Yêu Cầu Theo ID
```http
GET /api/RequestResult/{id}
```
**Mô tả**: Lấy thông tin chi tiết một kết quả yêu cầu
**Parameters**: `id` - ID kết quả yêu cầu

#### 3.3 Lấy Kết Quả Yêu Cầu Theo Yêu Cầu
```http
GET /api/RequestResult/request/{requestId}
```
**Mô tả**: Lấy tất cả kết quả của một yêu cầu thuốc
**Parameters**: `requestId` - ID yêu cầu thuốc

#### 3.4 Lấy Kết Quả Mới Nhất
```http
GET /api/RequestResult/request/{requestId}/latest
```
**Mô tả**: Lấy kết quả mới nhất của một yêu cầu thuốc
**Parameters**: `requestId` - ID yêu cầu thuốc

#### 3.5 Lấy Kết Quả Theo Trạng Thái
```http
GET /api/RequestResult/status/{status}
```
**Mô tả**: Lấy kết quả theo trạng thái
**Parameters**: `status` - Trạng thái (In Progress, Completed, Failed, Partially Failed)

#### 3.6 Tạo Kết Quả Yêu Cầu
```http
POST /api/RequestResult
```
**Mô tả**: Tạo kết quả yêu cầu mới
**Request Body**:
```json
{
  "requestId": 1,
  "status": "In Progress",
  "frequency": "sáng, trưa",
  "timesPerDay": 2,
  "currentDayCount": 0,
  "currentDate": "2024-01-15",
  "administeredFrequencies": "[]",
  "failedFrequencies": "[]",
  "failureReasons": "{}"
}
```

#### 3.7 Cập Nhật Kết Quả Yêu Cầu
```http
PUT /api/RequestResult/{id}
```
**Mô tả**: Cập nhật thông tin kết quả yêu cầu
**Parameters**: `id` - ID kết quả yêu cầu

#### 3.8 Xóa Kết Quả Yêu Cầu
```http
DELETE /api/RequestResult/{id}
```
**Mô tả**: Xóa kết quả yêu cầu
**Parameters**: `id` - ID kết quả yêu cầu

## Quy Trình Hoạt Động

### 1. Tạo Yêu Cầu Thuốc
1. Phụ huynh tạo yêu cầu thuốc → Status: "Pending"
2. Y tá xác thực thuốc → Status: "Verified" hoặc "Refused"
3. Phân công y tá → Status: "Assigned"
4. Bắt đầu thực hiện → Tạo RequestResult với Status: "In Progress"
5. Thực hiện theo tần suất → Cập nhật AdministeredFrequencies
6. Hoàn thành → Status: "Completed"

### 2. Xử Lý Thất Bại
1. Báo cáo thất bại → Cập nhật FailedFrequencies và FailureReasons
2. Nếu tất cả tần suất thất bại → Status: "Failed"
3. Nếu một số tần suất thất bại → Status: "Partially Failed"
4. Tạo yêu cầu lại (trước 17h) → Tạo RequestResult mới với IsReRequest: true

### 3. Quy Tắc Thời Gian
- Yêu cầu quá 17h → Tự động chuyển thành "Failed"
- Yêu cầu sang ngày mới → Tự động chuyển thành "Failed"
- Chỉ có thể tạo yêu cầu lại trước 17h

## Lưu Ý Quan Trọng

### Validation
- Yêu cầu thuốc phải có ít nhất 1 mục thuốc
- Tần suất phải theo định dạng: "Sáng 2 lần, Trưa 1 lần"
- Y tá chỉ được phân công tối đa 5 yêu cầu đang chờ
- Chỉ yêu cầu "Pending" mới có thể xác thực/từ chối
- Chỉ yêu cầu "Pending" hoặc "Verified" mới có thể phân công
- Mỗi mục thuốc (MedicineRequestItem) có thể có nhiều buổi và số lần uống trong ngày, được mô tả trong trường frequency (VD: "Sáng 2 lần, Trưa 1 lần").
- Backend sẽ tự động phân tích frequency để xác định số lần và buổi cần cho uống, và kiểm tra tiến độ từng buổi.
- Y tá xác thực từng mục thuốc (không cần tách từng buổi thành nhiều item).
- Khi cho uống, nurse chọn buổi (period) và hệ thống sẽ kiểm tra số lần đã cho uống cho từng buổi.
- Chỉ các mục thuốc có verificationStatus == "Verified" mới được phép cho uống.

### Error Handling
- 400 Bad Request: Dữ liệu không hợp lệ
- 404 Not Found: Không tìm thấy yêu cầu
- 500 Internal Server Error: Lỗi hệ thống

### Security
- Tất cả API cần xác thực người dùng
- Y tá chỉ có thể thao tác với yêu cầu được phân công
- Phụ huynh chỉ có thể xem yêu cầu của mình

## Ví Dụ Sử Dụng

### Tạo Yêu Cầu Thuốc
```bash
curl -X POST "https://api.example.com/api/MedicineRequest" \
  -H "Content-Type: application/json" \
  -d '{
    "studentCode": "STU001",
    "className": "Lớp 3A",
    "parentId": 1,
    "date": "2024-01-15",
    "medicineRequestItems": [
      {
        "medicineName": "Paracetamol",
        "dosage": "500mg",
        "frequency": "Sáng 2 lần, Trưa 1 lần",
        "timeOfDay": "sáng, trưa",
        "instructions": "Uống sau khi ăn",
        "verificationStatus": "Pending"
      },
      {
        "medicineName": "Ibuprofen",
        "dosage": "200mg",
        "frequency": "Trưa 1 lần, Chiều 1 lần",
        "timeOfDay": "trưa, chiều",
        "instructions": "Uống sau khi ăn trưa",
        "verificationStatus": "Pending"
      }
    ]
  }'
```

### Xác Thực Yêu Cầu
```bash
curl -X POST "https://api.example.com/api/MedicineRequest/1/verify" \
  -H "Content-Type: application/json" \
  -d '2'
```

### Phân Công Y Tá
```bash
curl -X POST "https://api.example.com/api/MedicineRequest/1/assign-nurse/2"
```

### Bắt Đầu Thực Hiện
```bash
curl -X POST "https://api.example.com/api/MedicineRequest/1/start-administration/2"
```

### Thực Hiện Thuốc
```bash
curl -X POST "https://api.example.com/api/MedicineRequest/administer-frequency" \
  -H "Content-Type: application/json" \
  -d '{
    "requestResultId": 1,
    "medicineRequestItemId": 1,
    "frequency": "sáng",
    "staffId": 2,
    "notes": "Học sinh uống thuốc thành công"
  }'
```

## Mã Lỗi HTTP và Xử Lý

### HTTP Status Codes
- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **204 No Content**: Cập nhật/xóa thành công
- **400 Bad Request**: Dữ liệu không hợp lệ
- **401 Unauthorized**: Chưa xác thực
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy tài nguyên
- **409 Conflict**: Xung đột dữ liệu
- **500 Internal Server Error**: Lỗi hệ thống

### Error Response Format
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "studentCode",
      "message": "Student code is required"
    }
  ],
  "timestamp": "2024-01-15T08:00:00Z"
}
```

## Troubleshooting

### Lỗi Thường Gặp

#### 1. Lỗi Validation
**Vấn đề**: API trả về 400 Bad Request
**Nguyên nhân**: Dữ liệu không đúng format hoặc thiếu trường bắt buộc
**Giải pháp**: 
- Kiểm tra format JSON
- Đảm bảo tất cả trường required được điền
- Kiểm tra định dạng ngày tháng (yyyy-MM-dd)

#### 2. Lỗi Phân Công Y Tá
**Vấn đề**: Không thể phân công y tá
**Nguyên nhân**: 
- Y tá đã có 5 yêu cầu đang chờ
- Yêu cầu không ở trạng thái "Pending" hoặc "Verified"
**Giải pháp**:
- Kiểm tra số lượng yêu cầu hiện tại của y tá
- Đảm bảo yêu cầu đã được xác thực

#### 3. Lỗi Tạo Yêu Cầu Lại
**Vấn đề**: Không thể tạo yêu cầu lại
**Nguyên nhân**: 
- Đã quá 17h
- Yêu cầu không ở trạng thái "Failed"
**Giải pháp**:
- Chỉ tạo yêu cầu lại trước 17h
- Đảm bảo yêu cầu gốc đã thất bại

#### 4. Lỗi Thực Hiện Thuốc
**Vấn đề**: Không thể ghi nhận thực hiện thuốc
**Nguyên nhân**:
- Tần suất đã được thực hiện hôm nay
- Yêu cầu không ở trạng thái "In Progress"
**Giải pháp**:
- Kiểm tra tần suất đã thực hiện
- Đảm bảo yêu cầu đang trong quá trình thực hiện



