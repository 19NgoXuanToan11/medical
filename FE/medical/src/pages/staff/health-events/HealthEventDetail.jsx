import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthEvent, setHealthEvent] = useState(null);

  // Mock health event data - in a real app, this would come from an API
  const mockEvent = {
    id: "EV123456",
    studentName: "Nguyễn Văn An",
    studentId: "ST123456",
    class: "3A",
    eventType: "accident",
    eventDate: "2023-10-15T09:30:00",
    description: "Té ngã ở sân chơi, bị trầy xước đầu gối",
    status: "resolved",
    severity: "minor",
    location: "Sân chơi",
    treatedBy: "Nguyễn Thị Hương",
    treatment: "Vệ sinh vết thương, băng vết thương nhẹ",
    notifyParent: true,
    parentNotificationMethod: "phone",
    parentResponse: "Đã thông báo, phụ huynh ghi nhận",
    followUp: "Kiểm tra lại vào ngày mai để thay băng nếu cần",
    createdAt: "2023-10-15T09:35:00",
    updatedAt: "2023-10-15T14:20:00",
    studentInfo: {
      dateOfBirth: "2015-05-10",
      gender: "male",
      bloodType: "O+",
      allergies: "Không",
      emergencyContact: "Nguyễn Văn Bình (Bố) - 0912345678",
    },
    statusHistory: [
      {
        status: "urgent",
        timestamp: "2023-10-15T09:35:00",
        updatedBy: "Nguyễn Thị Hương",
        notes: "Tiếp nhận học sinh, đánh giá ban đầu",
      },
      {
        status: "monitoring",
        timestamp: "2023-10-15T10:15:00",
        updatedBy: "Nguyễn Thị Hương",
        notes: "Đã xử lý vết thương, theo dõi thêm",
      },
      {
        status: "resolved",
        timestamp: "2023-10-15T14:20:00",
        updatedBy: "Nguyễn Thị Hương",
        notes: "Kiểm tra lại, học sinh ổn định, có thể trở lại lớp",
      },
    ],
    attachments: [
      {
        id: "att123",
        name: "Hình ảnh vết thương.jpg",
        type: "image/jpeg",
        size: "1.2MB",
        uploadDate: "2023-10-15T09:40:00",
        url: "https://example.com/attachments/att123",
      },
    ],
  };

  // Fetch health event data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setHealthEvent(mockEvent);
      setLoading(false);
    }, 800);
  }, [id]);

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get event type text
  const getEventTypeText = (type) => {
    switch (type) {
      case "accident":
        return "Tai nạn";
      case "illness":
        return "Ốm đau";
      case "injury":
        return "Chấn thương";
      case "disease":
        return "Dịch bệnh";
      default:
        return "Khác";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "urgent":
        return "Khẩn cấp";
      case "monitoring":
        return "Đang theo dõi";
      case "resolved":
        return "Đã xử lý";
      default:
        return status;
    }
  };

  // Get severity text
  const getSeverityText = (severity) => {
    switch (severity) {
      case "minor":
        return "Nhẹ";
      case "moderate":
        return "Trung bình";
      case "major":
        return "Nặng";
      default:
        return severity;
    }
  };

  // Get notification method text
  const getNotificationMethodText = (method) => {
    switch (method) {
      case "phone":
        return "Điện thoại";
      case "sms":
        return "Tin nhắn SMS";
      case "app":
        return "Thông báo qua ứng dụng";
      case "email":
        return "Email";
      default:
        return "Phương thức khác";
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "monitoring":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get severity badge class
  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "minor":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "major":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Print the health event
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!healthEvent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy sự kiện
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Sự kiện không tồn tại hoặc đã bị xóa.
          </p>
          <div className="mt-6">
            <Link
              to="/staff/health-events"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl print:px-0 print:shadow-none print:py-2">
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 print:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 print:text-xl">
            Chi tiết sự kiện y tế
          </h1>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            In báo cáo
          </button>
          <Link
            to={`/staff/health-events/edit/${healthEvent.id}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="print:border print:p-6 print:border-gray-300 print:mt-2">
        <div className="print:flex print:justify-between print:items-center print:mb-6">
          <div className="hidden print:block">
            <h1 className="text-xl font-bold text-center">
              BÁO CÁO SỰ KIỆN Y TẾ
            </h1>
            <p className="text-sm text-center text-gray-500">
              Mã sự kiện: {healthEvent.id}
            </p>
          </div>
          <div className="hidden print:block text-right">
            <p className="text-sm">
              Ngày in: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Status and severity badges */}
        <div className="flex flex-wrap gap-3 mb-6 print:mb-4">
          <span
            className={`px-3 py-1 ${getStatusBadgeClass(
              healthEvent.status
            )} rounded-full text-sm font-medium`}
          >
            Trạng thái: {getStatusText(healthEvent.status)}
          </span>
          <span
            className={`px-3 py-1 ${getSeverityBadgeClass(
              healthEvent.severity
            )} rounded-full text-sm font-medium`}
          >
            Mức độ: {getSeverityText(healthEvent.severity)}
          </span>
          <span
            className={`px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium`}
          >
            Loại: {getEventTypeText(healthEvent.eventType)}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
            <h2 className="text-lg font-semibold">Thông tin học sinh</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                <p className="font-medium">{healthEvent.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mã học sinh</p>
                <p>{healthEvent.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Lớp</p>
                <p>{healthEvent.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
                <p>{formatDate(healthEvent.studentInfo.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Giới tính</p>
                <p>
                  {healthEvent.studentInfo.gender === "male" ? "Nam" : "Nữ"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nhóm máu</p>
                <p>{healthEvent.studentInfo.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Dị ứng</p>
                <p>{healthEvent.studentInfo.allergies}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Liên hệ khẩn cấp</p>
                <p>{healthEvent.studentInfo.emergencyContact}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300 print:mt-4">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
            <h2 className="text-lg font-semibold">Thông tin sự kiện</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Loại sự kiện</p>
                <p className="font-medium">
                  {getEventTypeText(healthEvent.eventType)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Thời gian xảy ra</p>
                <p>{formatDateTime(healthEvent.eventDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                <p>{healthEvent.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Người xử lý</p>
                <p>{healthEvent.treatedBy}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Mô tả sự kiện</p>
              <p className="bg-gray-50 p-3 rounded-md">
                {healthEvent.description}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                Biện pháp xử lý và điều trị
              </p>
              <p className="bg-gray-50 p-3 rounded-md">
                {healthEvent.treatment}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Theo dõi và tái khám</p>
              <p className="bg-gray-50 p-3 rounded-md">
                {healthEvent.followUp}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300 print:mt-4">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
            <h2 className="text-lg font-semibold">Thông báo cho phụ huynh</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Đã thông báo</p>
                <p>{healthEvent.notifyParent ? "Có" : "Không"}</p>
              </div>
              {healthEvent.notifyParent && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Phương thức thông báo
                  </p>
                  <p>
                    {getNotificationMethodText(
                      healthEvent.parentNotificationMethod
                    )}
                  </p>
                </div>
              )}
            </div>
            {healthEvent.notifyParent && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Phản hồi của phụ huynh
                </p>
                <p className="bg-gray-50 p-3 rounded-md">
                  {healthEvent.parentResponse}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300 print:mt-4">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
            <h2 className="text-lg font-semibold">Lịch sử trạng thái</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {healthEvent.statusHistory.map((status, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== healthEvent.statusHistory.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              status.status === "urgent"
                                ? "bg-red-500"
                                : status.status === "monitoring"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getStatusText(status.status)}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>{status.notes}</p>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{status.updatedBy}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDateTime(status.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {healthEvent.attachments && healthEvent.attachments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300 print:mt-4 print:break-before-page">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
              <h2 className="text-lg font-semibold">Tài liệu đính kèm</h2>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {healthEvent.attachments.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.size} •{" "}
                          {formatDateTime(attachment.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div className="print:hidden">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Xem
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none print:border print:border-gray-300 print:mt-4">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 print:bg-white">
            <h2 className="text-lg font-semibold">Thông tin bổ sung</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                <p>{formatDateTime(healthEvent.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Cập nhật lần cuối</p>
                <p>{formatDateTime(healthEvent.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Người xử lý</p>
              <div className="h-16 mb-1"></div>
              <p className="font-medium">{healthEvent.treatedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Người phụ trách y tế</p>
              <div className="h-16 mb-1"></div>
              <p className="font-medium">_________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthEventDetail;
