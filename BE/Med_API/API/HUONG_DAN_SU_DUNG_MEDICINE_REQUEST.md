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

### **Phần 1: Tạo Yêu Cầu Thuốc (MedicineRequest)**

#### **Bước 1: Tạo Yêu Cầu Thuốc Mới**

**API:** `POST /api/MedicineRequest`

**Body:**
```json
{
  "studentCode": "STU001",
  "className": "Lớp 10A",
  "parentId": 1,
  "status": "Pending",
  "date": "2024-12-21",
  "medicineRequestItems": [
    {
      "medicineName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 lần/ngày",
      "timeOfDay": "sáng, trưa, tối",
      "instructions": "Uống sau khi ăn"
    },
    {
      "medicineName": "Vitamin C",
      "dosage": "100mg",
      "frequency": "1 lần/ngày",
      "timeOfDay": "sáng",
      "instructions": "Uống buổi sáng"
    }
  ]
}
```

**Kết quả:** Tạo yêu cầu thuốc với trạng thái "Pending"

#### **Bước 2: Gán Y Tá Cho Yêu Cầu**

**API:** `POST /api/MedicineRequest/{requestId}/assign-nurse/{staffId}`

**Ví dụ:** `POST /api/MedicineRequest/1/assign-nurse/5`

**Kết quả:** Yêu cầu chuyển từ "Pending" sang "Assigned"

#### **Bước 3: Xem Danh Sách Yêu Cầu**

**API:** `GET /api/MedicineRequest`

**Lọc theo:**
- Theo học sinh: `GET /api/MedicineRequest/student/STU001`
- Theo phụ huynh: `GET /api/MedicineRequest/parent/1`
- Theo y tá: `GET /api/MedicineRequest/staff/5`
- Theo trạng thái: `GET /api/MedicineRequest/status/pending`
- Yêu cầu chờ: `GET /api/MedicineRequest/pending`

### **Phần 2: Bắt Đầu Quá Trình Cho Thuốc (RequestResult)**

#### **Bước 4: Bắt Đầu Cho Thuốc**

**API:** `POST /api/MedicineRequest/{requestId}/start/{staffId}`

**Ví dụ:** `POST /api/MedicineRequest/1/start/5`

**Kết quả:** 
- Tạo RequestResult với trạng thái "In Progress"
- Phân tích tần suất từ MedicineRequestItems
- Thiết lập TimesPerDay và CurrentDayCount = 0

#### **Bước 5: Kiểm Tra Tần Suất Cần Cho**

**API:** `GET /api/MedicineRequest/{requestResultId}/pending-frequencies/{medicineRequestItemId}`

**Ví dụ:** `GET /api/MedicineRequest/1/pending-frequencies/1`

**Kết quả:** `["sáng", "trưa", "tối"]` (cho thuốc 3 lần/ngày)

### **Phần 3: Cho Thuốc Theo Tần Suất**

#### **Bước 6: Cho Thuốc Cho Từng Tần Suất**

**API:** `POST /api/MedicineRequest/administer-frequency`

**Body:**
```json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "notes": "Học sinh uống thuốc bình thường"
}
```

**Lặp lại cho từng tần suất:**
- "sáng" → "trưa" → "tối"

#### **Bước 7: Kiểm Tra Tiến Độ**

**API:** `GET /api/MedicineRequest/{requestResultId}/is-completed/{medicineRequestItemId}`

**Kết quả:** 
- `true`: Đã cho đủ số lần
- `false`: Còn thiếu

#### **Bước 8: Hoàn Thành Yêu Cầu**

**API:** `POST /api/MedicineRequest/{requestResultId}/complete-medicine/{staffId}`

**Kết quả:** 
- RequestResult chuyển sang "Completed"
- MedicineRequest chuyển sang "Completed"

---

## **XỬ LÝ THẤT BẠI VÀ YÊU CẦU LẠI**

### **Phần 4: Xử Lý Thất Bại**

#### **Bước 9: Báo Cáo Thất Bại**

**API:** `POST /api/MedicineRequest/report-failure`

**Body:**
```json
{
  "requestResultId": 1,
  "medicineRequestItemId": 1,
  "frequency": "sáng",
  "failureReason": "Học sinh từ chối uống thuốc",
  "notes": "Học sinh nói không muốn uống, sẽ thử lại sau"
}
```

**Trạng thái sau báo cáo:**
- "Partially Failed": Nếu chỉ một số tần suất thất bại
- "Failed": Nếu tất cả tần suất thất bại

#### **Bước 10: Tạo Yêu Cầu Lại (Nếu Cần)**

**Kiểm tra điều kiện:**
**API:** `GET /api/MedicineRequest/{requestResultId}/eligible-for-re-request`

**Tạo yêu cầu lại:**
**API:** `POST /api/MedicineRequest/create-re-request`

**Body:**
```json
{
  "originalRequestResultId": 1,
  "reRequestReason": "Complete Failure",
  "staffId": 5
}
```

### **Phần 5: Theo Dõi và Báo Cáo**

#### **Bước 11: Xem Báo Cáo Thất Bại**

**API:** `GET /api/MedicineRequest/failed-requests`

**API:** `GET /api/MedicineRequest/{requestResultId}/failure-summary`

#### **Bước 12: Xem Yêu Cầu Lại**

**API:** `GET /api/MedicineRequest/{originalRequestResultId}/re-requests`

---

## **QUY TẮC THỜI GIAN**

### **Trước 5 giờ chiều:**
- ✅ Có thể cho thuốc bình thường
- ✅ Có thể tạo yêu cầu lại
- ✅ Có thể báo cáo thất bại
- ✅ Có thể bắt đầu yêu cầu mới

### **Sau 5 giờ chiều:**
- ❌ Không thể tạo yêu cầu mới
- ❌ Không thể tạo yêu cầu lại
- ✅ Hệ thống tự động đánh dấu thất bại
- ✅ Có thể xem báo cáo

### **Hệ Thống Tự Động:**
- Background service chạy mỗi 5 phút
- Tự động đánh dấu "Failed" cho yêu cầu sau 5 PM
- Lý do: "Time Expired - Past 5 PM"

---

## **API REFERENCE**

### **MedicineRequest APIs**

| Chức Năng | Method | Endpoint | Mô Tả |
|-----------|--------|----------|-------|
| Tạo yêu cầu | POST | `/api/MedicineRequest` | Tạo yêu cầu thuốc mới |
| Xem tất cả | GET | `/api/MedicineRequest` | Lấy danh sách tất cả yêu cầu |
| Xem theo ID | GET | `/api/MedicineRequest/{id}` | Xem chi tiết yêu cầu |
| Cập nhật | PUT | `/api/MedicineRequest/{id}` | Cập nhật yêu cầu |
| Xóa | DELETE | `/api/MedicineRequest/{id}` | Xóa yêu cầu |
| Gán y tá | POST | `/api/MedicineRequest/{id}/assign-nurse/{staffId}` | Gán y tá cho yêu cầu |
| Hoàn thành | POST | `/api/MedicineRequest/{id}/complete/{staffId}` | Hoàn thành yêu cầu |

### **RequestResult APIs**

| Chức Năng | Method | Endpoint | Mô Tả |
|-----------|--------|----------|-------|
| Bắt đầu | POST | `/api/MedicineRequest/{id}/start/{staffId}` | Bắt đầu quá trình cho thuốc |
| Cho thuốc | POST | `/api/MedicineRequest/administer-frequency` | Cho thuốc theo tần suất |
| Kiểm tra hoàn thành | GET | `/api/MedicineRequest/{id}/is-completed/{itemId}` | Kiểm tra đã hoàn thành chưa |
| Tần suất chờ | GET | `/api/MedicineRequest/{id}/pending-frequencies/{itemId}` | Xem tần suất cần cho |
| Hoàn thành | POST | `/api/MedicineRequest/{id}/complete-medicine/{staffId}` | Hoàn thành cho thuốc |

### **Failure Handling APIs**

| Chức Năng | Method | Endpoint | Mô Tả |
|-----------|--------|----------|-------|
| Báo cáo thất bại | POST | `/api/MedicineRequest/report-failure` | Báo cáo thất bại cho thuốc |
| Tạo yêu cầu lại | POST | `/api/MedicineRequest/create-re-request` | Tạo yêu cầu lại |
| Xem thất bại | GET | `/api/MedicineRequest/failed-requests` | Xem danh sách thất bại |
| Kiểm tra điều kiện | GET | `/api/MedicineRequest/{id}/eligible-for-re-request` | Kiểm tra có thể tạo yêu cầu lại |
| Tóm tắt thất bại | GET | `/api/MedicineRequest/{id}/failure-summary` | Xem tóm tắt thất bại |
| Cập nhật thời gian | POST | `/api/MedicineRequest/update-time-based-status` | Cập nhật trạng thái theo thời gian |

---

## **VÍ DỤ THỰC TẾ**

### **Kịch Bản 1: Cho Thuốc 3 Lần/Ngày - Thành Công**

#### **Ngày 1:**
1. **Tạo yêu cầu:** Paracetamol 3 lần/ngày
2. **Gán y tá:** Y tá A được gán
3. **Bắt đầu:** Tạo RequestResult
4. **Cho thuốc sáng:** ✅ Thành công
5. **Cho thuốc trưa:** ✅ Thành công
6. **Cho thuốc tối:** ✅ Thành công
7. **Kết quả:** "Completed"

### **Kịch Bản 2: Thất Bại Một Phần**

#### **Ngày 1:**
1. **Tạo yêu cầu:** Paracetamol 3 lần/ngày
2. **Gán y tá:** Y tá A được gán
3. **Bắt đầu:** Tạo RequestResult
4. **Cho thuốc sáng:** ✅ Thành công
5. **Cho thuốc trưa:** ❌ Thất bại (học sinh vắng)
6. **Báo cáo thất bại:** Ghi nhận "trưa" thất bại
7. **Cho thuốc tối:** ✅ Thành công
8. **Kết quả:** "Partially Failed" (thiếu "trưa")

#### **Ngày 2:**
1. **Tạo yêu cầu lại:** Chỉ cho "trưa"
2. **Cho thuốc trưa:** ✅ Thành công
3. **Kết quả:** "Completed"

### **Kịch Bản 3: Thất Bại Hoàn Toàn**

#### **Ngày 1:**
1. **Tạo yêu cầu:** Paracetamol 2 lần/ngày
2. **Gán y tá:** Y tá A được gán
3. **Bắt đầu:** Tạo RequestResult
4. **Cho thuốc sáng:** ❌ Thất bại (học sinh từ chối)
5. **Báo cáo thất bại:** Ghi nhận "sáng" thất bại
6. **Cho thuốc tối:** ❌ Thất bại (học sinh từ chối)
7. **Báo cáo thất bại:** Ghi nhận "tối" thất bại
8. **Kết quả:** "Failed"

#### **Ngày 2:**
1. **Tạo yêu cầu lại:** Cho lại cả 2 lần
2. **Cho thuốc sáng:** ✅ Thành công
3. **Cho thuốc tối:** ✅ Thành công
4. **Kết quả:** "Completed"

### **Kịch Bản 4: Hết Thời Gian**

#### **Ngày 1:**
1. **Tạo yêu cầu:** Paracetamol 2 lần/ngày
2. **Gán y tá:** Y tá A được gán
3. **Bắt đầu:** Tạo RequestResult
4. **Cho thuốc sáng:** ✅ Thành công
5. **5:05 PM:** Hệ thống tự động đánh dấu "Failed"
6. **Lý do:** "Time Expired - Past 5 PM"
7. **Kết quả:** Không thể tạo yêu cầu lại

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

### **Tần Suất:**
- 📅 Hệ thống tự động phân tích: "2 lần/ngày" → ["sáng", "tối"]
- 📅 "3 lần/ngày" → ["sáng", "trưa", "tối"]
- 📅 "sáng và chiều" → ["sáng", "chiều"]

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

## **LIÊN HỆ HỖ TRỢ**

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
- Email: support@medicalapi.com
- Hotline: 1900-xxxx
- Documentation: /swagger

---

*Tài liệu này được cập nhật lần cuối: 21/12/2024* 