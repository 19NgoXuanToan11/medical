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
              status: "completed",
              details: {
                dentalCondition:
                  "Khỏe mạnh, có 1 răng sâu nhẹ ở răng hàm dưới bên phải",
                oralHygiene: "Tốt",
                recommendations:
                  "Cần điều trị sâu răng trong vòng 1 tháng tới. Tăng cường chải răng sau khi ăn.",
                followUp: "Cần tái khám sau 3 tháng",
                attachments: [
                  {
                    id: 1,
                    name: "Phiếu kết quả khám răng miệng.pdf",
                    size: "1.2 MB",
                  },
                  {
                    id: 2,
                    name: "Hướng dẫn chăm sóc răng miệng.pdf",
                    size: "580 KB",
                  },
                ],
              },
              notes:
                "Con bạn có răng khỏe mạnh nhưng cần chú ý vệ sinh răng miệng tốt hơn để tránh sâu răng.",
              hasAbnormalities: true,
              abnormalityDetails:
                "Phát hiện sâu răng nhẹ ở răng hàm dưới bên phải, cần điều trị sớm.",
              recommendations: [
                "Đặt lịch hẹn với nha sĩ để điều trị sâu răng",
                "Chải răng ít nhất 2 lần/ngày",
                "Sử dụng kem đánh răng có fluor",
                "Hạn chế đồ ngọt và đồ ăn dính vào răng",
              ],
            }
          : {
              summary: "Đã tiêm",
              status: "completed",
              details: {
                vaccineName: "Vắc-xin sởi-rubella",
                manufacturer: "GSK",
                batchNumber: "SRV2023-045",
                expiryDate: "12/2024",
                doseNumber: "1/1",
                injectionSite: "Cánh tay trái",
                nextDoseDate: "Không cần (đã hoàn thành liệu trình)",
              },
              reactions: "Không có phản ứng sau tiêm",
              notes:
                "Con bạn đã được tiêm vắc-xin sởi-rubella thành công và không có phản ứng phụ.",
              hasAbnormalities: false,
              attachments: [
                { id: 1, name: "Giấy xác nhận tiêm chủng.pdf", size: "850 KB" },
                {
                  id: 2,
                  name: "Thông tin theo dõi sau tiêm.pdf",
                  size: "420 KB",
                },
              ],
              recommendations: [
                "Theo dõi sức khỏe trong 24 giờ sau tiêm",
                "Có thể dùng thuốc hạ sốt nếu có sốt nhẹ",
                "Liên hệ ngay với bác sĩ nếu xuất hiện các triệu chứng bất thường",
              ],
            },
    };

    // Simulate API request
    setTimeout(() => {
      setEvent(mockEventData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline">
            {" "}
            Không tìm thấy thông tin sự kiện y tế.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <Link
        to="/parent/health-events"
        className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Quay lại danh sách sự kiện
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-neutral-800">
              Kết quả: {event.title}
            </h1>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {event.results.summary}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-600 mb-6">
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaCalendarAlt className="mr-2 text-primary-500" />
              {event.date}
            </div>
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaClock className="mr-2 text-primary-500" />
              {event.time}
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primary-500" />
              {event.location}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Thông tin học sinh
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Họ và tên học sinh</p>
                  <p className="font-medium">{event.childName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Lớp</p>
                  <p className="font-medium">{event.childClass}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Nhân viên y tế phụ trách
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-primary-100 rounded-full p-2">
                    <FaUserMd className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">
                    {event.doctor.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {event.doctor.title} - {event.doctor.hospital}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Kết quả chi tiết
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="space-y-4">
                {id === "3" ? (
                  <>
                    <div>
                      <p className="text-sm text-neutral-500">
                        Tình trạng răng miệng
                      </p>
                      <p className="font-medium">
                        {event.results.details.dentalCondition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">
                        Vệ sinh răng miệng
                      </p>
                      <p className="font-medium">
                        {event.results.details.oralHygiene}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Khuyến nghị</p>
                      <p className="font-medium">
                        {event.results.details.recommendations}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Tái khám</p>
                      <p className="font-medium">
                        {event.results.details.followUp}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-neutral-500">Tên vắc-xin</p>
                      <p className="font-medium">
                        {event.results.details.vaccineName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Nhà sản xuất</p>
                      <p className="font-medium">
                        {event.results.details.manufacturer}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Số lô</p>
                      <p className="font-medium">
                        {event.results.details.batchNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Hạn sử dụng</p>
                      <p className="font-medium">
                        {event.results.details.expiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Liều thứ</p>
                      <p className="font-medium">
                        {event.results.details.doseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Vị trí tiêm</p>
                      <p className="font-medium">
                        {event.results.details.injectionSite}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">
                        Phản ứng sau tiêm
                      </p>
                      <p className="font-medium">{event.results.reactions}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {event.results.hasAbnormalities && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FaExclamationCircle className="text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-neutral-800">
                  Phát hiện bất thường
                </h2>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-700">
                  {event.results.abnormalityDetails}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaNotesMedical className="text-primary-500 mr-2" />
              <h2 className="text-lg font-semibold text-neutral-800">
                Ghi chú
              </h2>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <p className="text-neutral-700">{event.results.notes}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaCheckCircle className="text-primary-500 mr-2" />
              <h2 className="text-lg font-semibold text-neutral-800">
                Khuyến nghị
              </h2>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                {event.results.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          {(event.results.attachments &&
            event.results.attachments.length > 0) ||
          (event.results.details.attachments &&
            event.results.details.attachments.length > 0) ? (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FaFileMedical className="text-primary-500 mr-2" />
                <h2 className="text-lg font-semibold text-neutral-800">
                  Tài liệu đính kèm
                </h2>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <ul className="divide-y divide-neutral-200">
                  {(
                    event.results.attachments ||
                    event.results.details.attachments
                  ).map((attachment) => (
                    <li
                      key={attachment.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <FaFileMedical className="text-neutral-400 mr-3" />
                        <div>
                          <p className="font-medium text-neutral-700">
                            {attachment.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {attachment.size}
                          </p>
                        </div>
                      </div>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <FaFileDownload className="mr-1" /> Tải xuống
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="flex justify-center mt-8">
            <button
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => window.print()}
            >
              <FaFileDownload className="mr-2" />
              In kết quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthEventResultDetail;
