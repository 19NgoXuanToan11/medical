import React from "react";

const VaccinationFlowDiagram = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Quy trình tiêm chủng tại trường
      </h1>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Flow diagram */}
          <div className="relative">
            {/* Connection lines */}
            <div className="absolute top-[100px] left-[180px] w-[calc(100%-360px)] h-1 bg-blue-400"></div>

            {/* Steps */}
            <div className="flex justify-between relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  1
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center h-[220px] flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg mb-2">
                    Gửi phiếu thông báo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gửi thông báo đồng ý tiêm chủng đến phụ huynh học sinh
                  </p>
                  <div className="mt-4 bg-blue-100 p-2 rounded-md w-full">
                    <ul className="text-xs text-left list-disc pl-4">
                      <li>Chọn lớp học</li>
                      <li>Chọn loại vaccine</li>
                      <li>Chọn ngày tiêm</li>
                      <li>Soạn nội dung thông báo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  2
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center h-[220px] flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg mb-2">Chuẩn bị danh sách</h3>
                  <p className="text-sm text-gray-600">
                    Tổng hợp phản hồi và lập danh sách học sinh tiêm chủng
                  </p>
                  <div className="mt-4 bg-blue-100 p-2 rounded-md w-full">
                    <ul className="text-xs text-left list-disc pl-4">
                      <li>Theo dõi phản hồi</li>
                      <li>Gửi nhắc nhở</li>
                      <li>Lọc học sinh có đồng ý</li>
                      <li>Tạo danh sách chính thức</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  3
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center h-[220px] flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg mb-2">Tiêm chủng</h3>
                  <p className="text-sm text-gray-600">
                    Thực hiện tiêm chủng và ghi nhận kết quả
                  </p>
                  <div className="mt-4 bg-blue-100 p-2 rounded-md w-full">
                    <ul className="text-xs text-left list-disc pl-4">
                      <li>Xác nhận học sinh</li>
                      <li>Ghi nhận đã tiêm</li>
                      <li>Ghi chú phản ứng</li>
                      <li>Theo dõi tiến độ</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  4
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center h-[220px] flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg mb-2">Theo dõi sau tiêm</h3>
                  <p className="text-sm text-gray-600">
                    Theo dõi phản ứng sau tiêm và báo cáo
                  </p>
                  <div className="mt-4 bg-blue-100 p-2 rounded-md w-full">
                    <ul className="text-xs text-left list-disc pl-4">
                      <li>Theo dõi 30 phút</li>
                      <li>Ghi nhận phản ứng</li>
                      <li>Phân loại mức độ</li>
                      <li>Tạo báo cáo tổng hợp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                <div className="w-32 h-1 bg-blue-500"></div>
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                <div className="w-32 h-1 bg-blue-500"></div>
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* User roles */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">Vai trò người dùng</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-center mb-2">Nhân viên y tế</h3>
                <ul className="text-sm list-disc pl-5">
                  <li>Quản lý toàn bộ quy trình</li>
                  <li>Gửi thông báo và theo dõi phản hồi</li>
                  <li>Lập danh sách và báo cáo</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-center mb-2">Phụ huynh</h3>
                <ul className="text-sm list-disc pl-5">
                  <li>Nhận thông báo tiêm chủng</li>
                  <li>Xem xét thông tin vaccine</li>
                  <li>Đồng ý hoặc từ chối</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-center mb-2">Nhân viên y tế</h3>
                <ul className="text-sm list-disc pl-5">
                  <li>Thực hiện tiêm chủng</li>
                  <li>Ghi nhận kết quả</li>
                  <li>Theo dõi phản ứng sau tiêm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Lợi ích của hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-center mb-2">Tiết kiệm thời gian</h3>
            <p className="text-sm text-center text-gray-600">
              Giảm thời gian xử lý giấy tờ và tổng hợp thông tin
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-center mb-2">Tăng độ chính xác</h3>
            <p className="text-sm text-center text-gray-600">
              Giảm lỗi thủ công và đảm bảo thông tin chính xác
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-center mb-2">Dễ dàng truy cập</h3>
            <p className="text-sm text-center text-gray-600">
              Phụ huynh có thể phản hồi mọi lúc, mọi nơi
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-center mb-2">Báo cáo tức thì</h3>
            <p className="text-sm text-center text-gray-600">
              Tạo báo cáo và thống kê ngay lập tức
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationFlowDiagram;
