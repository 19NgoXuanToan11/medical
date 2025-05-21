# School Medical Management System (MedSchool)

Hệ thống quản lý y tế trường học toàn diện, được thiết kế để phục vụ nhu cầu quản lý sức khỏe học sinh, tiêm chủng, kiểm tra sức khỏe định kỳ, và quản lý thuốc tại trường học.

## Tính năng chính

- **Quản lý hồ sơ sức khỏe học sinh**: Lưu trữ thông tin sức khỏe, dị ứng, tiền sử bệnh
- **Quản lý tiêm chủng**: Lên lịch, gửi thông báo, theo dõi sự đồng ý, thực hiện tiêm chủng
- **Kiểm tra sức khỏe định kỳ**: Lập kế hoạch, thực hiện và lưu kết quả kiểm tra
- **Quản lý thuốc**: Yêu cầu, duyệt và theo dõi sử dụng thuốc tại trường
- **Quản lý vật tư y tế**: Theo dõi tồn kho, sử dụng và nhập bổ sung
- **Tư vấn sức khỏe**: Cung cấp tài nguyên về dinh dưỡng, phòng bệnh, sức khỏe tâm thần

## Vai trò người dùng

- **Quản trị viên**: Quản lý người dùng, cấu hình hệ thống, báo cáo
- **Nhân viên y tế**: Quản lý sức khỏe, tiêm chủng, thuốc và kiểm tra sức khỏe
- **Giáo viên**: Ghi nhận quan sát sức khỏe, truy cập thông tin y tế quan trọng
- **Phụ huynh**: Xem và cập nhật thông tin sức khỏe con, xem kết quả kiểm tra, đồng ý tiêm chủng
- **Học sinh**: Xem thông tin sức khỏe cá nhân, nhận nhắc nhở uống thuốc

## Cài đặt và Chạy

1. Clone repository
2. Cài đặt dependencies:

```bash
npm install
```

3. Khởi chạy ứng dụng ở môi trường phát triển:

```bash
npm run dev
```

## Công nghệ sử dụng

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- GSAP (Animation)
- JSPDF (PDF generation)
