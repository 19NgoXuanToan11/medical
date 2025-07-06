import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaFileMedical,
  FaNotesMedical,
  FaFileDownload,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const HealthEventResultDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // In a real application, fetch data from an API
    // This is just mock data for demonstration
    const mockEventData = {
      id: parseInt(id),
      title:
        id === "3"
          ? "Khám sức khỏe răng miệng"
          : "Tiêm chủng vắc-xin sởi-rubella",
      date: id === "3" ? "10/03/2023" : "15/02/2023",
      time: id === "3" ? "08:30 - 11:30" : "09:00 - 15:00",
      location: "Phòng Y tế trường học",
      description:
        id === "3"
          ? "Khám răng miệng, phát hiện sâu răng và tư vấn chăm sóc răng miệng cho học sinh."
          : "Chương trình tiêm chủng bổ sung vắc-xin sởi-rubella cho học sinh.",
      childName: "Nguyễn Văn An",
      childClass: "10A1",
      doctor: {
        name: id === "3" ? "BS. Lê Thị Hương" : "BS. Trần Văn Minh",
        title: id === "3" ? "Bác sĩ nha khoa" : "Bác sĩ tiêm chủng",
        hospital:
          id === "3" ? "Trung tâm Y tế Quận 1" : "Trung tâm Y tế Dự phòng",
      },

      results:
        id === "3"
          ? {
              summary: "Đã khám",
              details: {
                dentalCondition:
                  "Phát hiện sâu răng nhẹ ở răng hàm dưới bên phải, cần điều trị sớm.",
                oralHygiene: "Vệ sinh răng miệng",
                recommendations: "Khuyến nghị",
                followUp: "Tái khám",
                attachments: [
                  {
                    id: 1,
                    name: "Phieu_Kham_Rang_Mieng.pdf",
                    size: "1.2 MB",
                  },
                  {
                    id: 2,
                    name: "Hinh_Chup_Rang_Mieng.pdf",
                    size: "580 KB",
                  },
                ],
              },
              hasAbnormalities: true,
              abnormalityDetails:
                "Phát hiện sâu răng nhẹ ở răng hàm dưới bên phải, cần điều trị sớm.",
              notes:
                "Phụ huynh có thể đưa học sinh đến nha khoa để điều trị sâu răng. Cần duy trì vệ sinh răng miệng tốt và hạn chế đồ ngọt.",
              recommendations: [
                "Đánh răng 2 lần/ngày với kem đánh răng có fluoride",
                "Sử dụng chỉ nha khoa để làm sạch kẽ răng",
                "Hạn chế ăn đồ ngọt và nước có ga",
                "Tái khám sau 6 tháng hoặc khi có vấn đề",
              ],
            }
          : {
              summary: "Đã tiêm",
              details: {
                vaccineName: "Vắc-xin sởi-rubella",
                manufacturer: "GSK",
                batchNumber: "ABC123",
                expiryDate: "12/2025",
                doseNumber: "Liều bổ sung",
                injectionSite: "Cánh tay trái",
              },
              reactions: "Không có phản ứng bất thường",
              hasAbnormalities: false,
              notes:
                "Học sinh đã được tiêm chủng thành công. Không có phản ứng bất thường sau tiêm.",
              recommendations: [
                "Theo dõi sức khỏe trong 24h sau tiêm",
                "Liên hệ y tế nếu có triệu chứng bất thường",
                "Giữ ấm vùng tiêm trong ngày đầu",
                "Uống đủ nước và nghỉ ngơi",
              ],
            },
    };

    // Simulate loading
    setTimeout(() => {
      setEvent(mockEventData);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div
            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline">
              {" "}
              Không tìm thấy thông tin sự cố y tế.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
        <Link
          to="/parent/health-events"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại danh sách sự kiện
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Kết quả: {event.title}
              </h1>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {event.results.summary}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center mr-6 mb-2 sm:mb-0">
                <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                {event.date}
              </div>
              <div className="flex items-center mr-6 mb-2 sm:mb-0">
                <FaClock className="mr-2 text-blue-500 dark:text-blue-400" />
                {event.time}
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                {event.location}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Thông tin học sinh
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Họ và tên học sinh
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.childName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lớp
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.childClass}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Nhân viên y tế phụ trách
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                      <FaUserMd className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.doctor.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.doctor.title} - {event.doctor.hospital}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Kết quả chi tiết
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="space-y-4">
                  {id === "3" ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tình trạng răng miệng
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.dentalCondition}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Vệ sinh răng miệng
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.oralHygiene}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Khuyến nghị
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.recommendations}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tái khám
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.followUp}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tên vắc-xin
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.vaccineName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Nhà sản xuất
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.manufacturer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Số lô
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.batchNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Hạn sử dụng
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Liều thứ
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.doseNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Vị trí tiêm
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.details.injectionSite}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Phản ứng sau tiêm
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.results.reactions}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {event.results.hasAbnormalities && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <FaExclamationCircle className="text-yellow-500 dark:text-yellow-400 mr-2" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Phát hiện bất thường
                  </h2>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    {event.results.abnormalityDetails}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FaNotesMedical className="text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Ghi chú
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300">
                  {event.results.notes}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FaCheckCircle className="text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Khuyến nghị
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {event.results.recommendations.map(
                    (recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {(event.results.attachments &&
              event.results.attachments.length > 0) ||
            (event.results.details.attachments &&
              event.results.details.attachments.length > 0) ? (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <FaFileMedical className="text-blue-500 dark:text-blue-400 mr-2" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Tài liệu đính kèm
                  </h2>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {(
                      event.results.attachments ||
                      event.results.details.attachments
                    ).map((attachment) => (
                      <li
                        key={attachment.id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <FaFileMedical className="text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {attachment.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {attachment.size}
                            </p>
                          </div>
                        </div>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors">
                          <FaFileDownload className="mr-1" /> Tải xuống
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthEventResultDetail;
