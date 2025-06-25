# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG MEDICINE REQUEST VÀ REQUEST RESULT

## **Mục Lục**
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Hướng Dẫn Sử Dụng Cơ Bản](#hướng-dẫn-sử-dụng-cơ-bản)
3. [Xử Lý Thất Bại và Yêu Cầu Lại](#xử-lý-thất-bại-và-yêu-cầu-lại)
4. [Quy Tắc Thời Gian](#quy-tắc-thời-gian)
5. [API Reference](#api-reference)
6. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)

---

## **TỔNG QUAN HỆ THỐNG**

### **Mục Đích**
Hệ thống quản lý yêu cầu thuốc cho học sinh với khả năng:
- Theo dõi tần suất cho thuốc (sáng, trưa, chiều, tối)
- Xử lý thất bại và tạo yêu cầu lại
- Tự động đánh dấu thất bại sau 5 PM
- Quản lý trạng thái chi tiết

### **Các Thành Phần Chính**
- **MedicineRequest**: Yêu cầu thuốc từ phụ huynh
- **RequestResult**: Kết quả thực hiện cho thuốc
- **MedicineRequestItem**: Chi tiết từng loại thuốc
- **Frequency Tracking**: Theo dõi tần suất cho thuốc

---

## **HƯỚNG DẪN SỬ DỤNG CƠ BẢN**

### **1. Tạo, Xem, Sửa, Xóa Yêu Cầu Thuốc (MedicineRequest)**

#### **Tạo Yêu Cầu Thuốc**
**API:** `POST /api/MedicineRequest`
- Body sử dụng `MedicineRequestDto.Create`:
```json
{
  "studentCode": "STU001",
  "className": "Lớp 10A",
  "parentId": 1,
  "medicineRequestItems": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "sáng 1 lần,trưa 2 lần",
      "timeOfDay": "sáng, trưa",
      "instructions": "Uống sau khi ăn, buổi trưa uông trước và sau khi ăn 30 phút"
    }
  ]
}
```
- Trường `medicineRequestItems` là bắt buộc, phải có ít nhất 1 item.
- Trạng thái mặc định: `Pending`.

#### **Xem Danh Sách và Chi Tiết**
- `GET /api/MedicineRequest` — Tất cả yêu cầu
- `GET /api/MedicineRequest/{id}` — Chi tiết theo ID
- `GET /api/MedicineRequest/student/{studentCode}` — Theo học sinh
- `GET /api/MedicineRequest/parent/{parentId}` — Theo phụ huynh
- `GET /api/MedicineRequest/staff/{staffId}` — Theo y tá
- `GET /api/MedicineRequest/status/{status}` — Theo trạng thái
- `GET /api/MedicineRequest/pending` — Danh sách chờ xử lý

#### **Sửa & Xóa**
- `PUT /api/MedicineRequest/{id}` — Cập nhật yêu cầu (body: `MedicineRequestDto.Update`)
- `DELETE /api/MedicineRequest/{id}` — Xóa yêu cầu

### **2. Phân Công Y Tá & Quản Lý Trạng Thái**
- `POST /api/MedicineRequest/{id}/assign-nurse/{staffId}` — Gán y tá cho yêu cầu (chỉ khi trạng thái là Pending, y tá chưa vượt quá 5 yêu cầu chờ)
- `GET /api/MedicineRequest/available-nurses` — Lấy danh sách y tá còn khả dụng
- `POST /api/MedicineRequest/{id}/complete/{staffId}` — Đánh dấu hoàn thành yêu cầu

### **3. Quản Lý Quá Trình Cho Thuốc (RequestResult)**
- `POST /api/MedicineRequest/{id}/start-administration/{staffId}` — Bắt đầu quá trình cho thuốc, sinh ra RequestResult
- `POST /api/MedicineRequest/administer-frequency` — Cho thuốc theo từng tần suất (body: `RequestResultDto.FrequencyCompleteRequest`)
- `GET /api/MedicineRequest/{requestResultId}/progress/{medicineRequestItemId}` — Xem tiến độ từng loại thuốc
- `GET /api/MedicineRequest/{requestResultId}/is-completed/{medicineRequestItemId}` — Kiểm tra hoàn thành
- `POST /api/MedicineRequest/{id}/complete/{staffId}` — Hoàn thành toàn bộ yêu cầu

### **4. Xử Lý Thất Bại & Yêu Cầu Lại**
- `POST /api/MedicineRequest/report-failure` — Báo cáo thất bại (body: `RequestResultDto.FailureReport`)
- `GET /api/MedicineRequest/{requestResultId}/re-request-info` — Kiểm tra điều kiện tạo lại yêu cầu
- `POST /api/MedicineRequest/create-re-request` — Tạo lại yêu cầu (body: `RequestResultDto.ReRequestCreate`)
- `GET /api/MedicineRequest/failed-requests` — Danh sách thất bại
- `GET /api/MedicineRequest/{originalRequestResultId}/re-requests` — Danh sách yêu cầu lại
- `POST /api/MedicineRequest/{requestResultId}/mark-failed` — Đánh dấu thất bại với lý do (body: string reason)
- `GET /api/MedicineRequest/{requestResultId}/failure-summary` — Tổng hợp thất bại

### **5. Cập Nhật Trạng Thái Theo Thời Gian**
- `POST /api/MedicineRequest/update-time-based-status` — Tự động cập nhật trạng thái (ví dụ: sau 17h sẽ đánh dấu thất bại nếu chưa hoàn thành)

---

## **QUY TẮC TRẠNG THÁI**
- `Pending` → `Assigned` (khi gán y tá)
- `Assigned` → `In Progress` (khi bắt đầu cho thuốc)
- `In Progress` → `Completed` (khi hoàn thành đủ tần suất)
- `In Progress` → `Failed` (nếu thất bại toàn bộ hoặc hết thời gian)
- `In Progress` → `Partially Failed` (nếu thất bại một phần)

---

## **API RequestResultController**
- `GET /api/RequestResult` — Danh sách kết quả
- `GET /api/RequestResult/{id}` — Chi tiết kết quả
- `GET /api/RequestResult/request/{requestId}` — Kết quả theo yêu cầu thuốc
- `GET /api/RequestResult/request/{requestId}/latest` — Kết quả mới nhất theo yêu cầu thuốc (dùng MedicineRequest id)
- `GET /api/RequestResult/status/{status}` — Kết quả theo trạng thái (dùng MedicineRequest status: Pending, Approved, Rejected)
- `POST /api/RequestResult` — Tạo mới (body: `RequestResultDto.Create`) 
- `PUT /api/RequestResult/{id}` — Cập nhật (body: `RequestResultDto.Update`)
- `DELETE /api/RequestResult/{id}` — Xóa

---

## **LƯU Ý & ĐIỂM MỚI**
- Các endpoint đều trả về ViewModel/DTO tương ứng.
- Các trường hợp lỗi sẽ trả về thông báo chi tiết (ví dụ: y tá vượt quá số lượng yêu cầu, trạng thái không hợp lệ, v.v.).
- Đảm bảo truyền đúng tham số (ví dụ: `requestResultId`, `medicineRequestItemId`, `staffId`, ...).
- Có thể kiểm tra danh sách y tá còn khả dụng trước khi gán.
- Có thể tạo lại yêu cầu nếu đủ điều kiện (qua endpoint re-request-info).
- Tự động cập nhật trạng thái dựa trên thời gian qua endpoint chuyên biệt.

---

## **VÍ DỤ THỰC TẾ**
### Tạo yêu cầu thuốc:
```http
POST /api/MedicineRequest
Content-Type: application/json
{
  "studentCode": "STU001",
  "className": "Lớp 10A",
  "parentId": 1,
  "medicineRequestItems": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "sáng 1 lần,trưa 2 lần",
      "timeOfDay": "sáng, trưa",
      "instructions": "Uống sau khi ăn, buổi trưa uông trước và sau khi ăn 30 phút"
    }
  ]
}
```
### Gán y tá:
```http
POST /api/MedicineRequest/1/assign-nurse/5
```
### Bắt đầu cho thuốc:
```http
POST /api/MedicineRequest/1/start-administration/5
```
### Cho thuốc theo tần suất:
```http
POST /api/MedicineRequest/administer-frequency
Content-Type: application/json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "notes": "Học sinh uống thuốc bình thường"
}
```
### Báo cáo thất bại:
```http
POST /api/MedicineRequest/report-failure
Content-Type: application/json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "failureReason": "Học sinh từ chối uống thuốc",
  "notes": "Học sinh nói không muốn uống, sẽ thử lại sau"
}
```
### Kiểm tra điều kiện tạo lại yêu cầu:
```http
GET /api/MedicineRequest/1/re-request-info
```
### Tạo lại yêu cầu:
```http
POST /api/MedicineRequest/create-re-request
Content-Type: application/json
{
  "originalRequestResultId": 1,
  "medicineRequestItemIds": [1]
}
```

---

# (Các ví dụ khác giữ nguyên hoặc bổ sung theo thực tế sử dụng)

---

## **CÁC TRẠNG THÁI QUAN TRỌNG**

### **MedicineRequest:**
- **"Pending"**: Chờ gán y tá
- **"Assigned"**: Đã gán y tá
- **"In Progress"**: Đang cho thuốc
- **"Completed"**: Hoàn thành
- **"Failed"**: Thất bại

### **RequestResult:**
- **"In Progress"**: Đang cho thuốc
- **"Completed"**: Hoàn thành
- **"Partially Failed"**: Thất bại một phần
- **"Failed"**: Thất bại hoàn toàn
- **"Time Expired"**: Hết thời gian

---

## **LƯU Ý QUAN TRỌNG**

### **Thời Gian:**
- ⏰ Tất cả yêu cầu phải hoàn thành trước 5 PM
- ⏰ Sau 5 PM: Hệ thống tự động đánh dấu thất bại
- ⏰ Không thể tạo yêu cầu mới sau 5 PM

### **Tần Suất (Frequency):**
- Hệ thống hỗ trợ 2 kiểu nhập tần suất:
  1. **Kiểu cũ:** Chỉ liệt kê các buổi, ví dụ: `"sáng,trưa"` (tương đương mỗi buổi 1 lần)
  2. **Kiểu mới:** Ghi rõ số lần cho từng buổi, ví dụ: `"sáng 1 lần, trưa 2 lần"` (tức là buổi sáng 1 lần, buổi trưa 2 lần)
- Có thể kết hợp nhiều buổi, ví dụ: `"sáng 2 lần, chiều 1 lần"`
- Nếu không ghi số lần, mặc định là 1 lần cho buổi đó.
- Các giá trị hợp lệ cho buổi: `sáng`, `trưa`, `chiều`.

**Ví dụ:**
- `"sáng,trưa"` → Sáng 1 lần, trưa 1 lần
- `"sáng 2 lần, trưa 1 lần"` → Sáng 2 lần, trưa 1 lần
- `"chiều 3 lần"` → Chiều 3 lần

**Lưu ý:**
- Hệ thống sẽ tự động phân tích và lặp lại số lần tương ứng cho từng buổi khi theo dõi và cho thuốc.
- Bạn có thể nhập cả hai kiểu, hệ thống sẽ tự động nhận diện.

### **Thất Bại:**
- ❌ Luôn báo cáo với lý do cụ thể
- ❌ Ghi chú chi tiết để cải thiện
- ❌ Tạo yêu cầu lại khi cần thiết

### **Theo Dõi:**
- 📊 Kiểm tra trạng thái thường xuyên
- 📊 Xem báo cáo thất bại định kỳ
- 📊 Đánh giá hiệu quả quy trình

---

## **TROUBLESHOOTING**

### **Lỗi Thường Gặp:**

1. **"Failed to create re-request"**
   - Kiểm tra: Đã quá 5 PM chưa?
   - Kiểm tra: Yêu cầu có trạng thái "Failed" hoặc "Partially Failed" không?

2. **"Failed to administer medicine"**
   - Kiểm tra: Tần suất này đã được cho chưa?
   - Kiểm tra: RequestResult có tồn tại không?

3. **"Time Expired"**
   - Nguyên nhân: Đã quá 5 PM
   - Giải pháp: Tạo yêu cầu mới vào ngày hôm sau

4. **"Already administered this frequency today"**
   - Nguyên nhân: Tần suất này đã được cho rồi
   - Giải pháp: Kiểm tra lại danh sách đã cho

---



*Tài liệu này được cập nhật lần cuối: 21/12/2024* 