import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiClock,
  FiUser,
  FiActivity,
  FiPackage,
  FiCheck,
  FiAlertTriangle,
  FiFileText,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real application, this would come from an API
    setTimeout(() => {
      setEvent({
        id: 1,
        studentName: "Nguyễn Văn An",
        class: "3A",
        type: "illness",
        description: "Sốt nhẹ 37.8°C, đã cấp thuốc hạ sốt",
        time: "2023-06-15T09:30:00",
        status: "resolved",
        actionTaken: "Đã cho uống thuốc hạ sốt và thông báo cho phụ huynh",
        hasMedications: true,
        hasMedicalSupplies: true,
        nurseName: "Y tá Nguyễn Thị Hoa",
        severity: "medium",
        followUpRequired: false,
        details: {
          temperature: "37.8°C",
          pulse: "85 bpm",
          bloodPressure: "110/70 mmHg",
          respiratoryRate: "18/min",
          symptoms: ["Sốt", "Mệt mỏi", "Đau đầu nhẹ"],
          medications: [
            {
              name: "Paracetamol",
              dosage: "250mg",
              time: "09:35",
              administeredBy: "Y tá Nguyễn Thị Hoa",
            },
          ],
          medicalSupplies: [
            {
              name: "Nhiệt kế",
              quantity: 1,
              time: "09:30",
              usedBy: "Y tá Nguyễn Thị Hoa",
            },
          ],
          parentContact: {
            contacted: true,
            time: "09:40",
            person: "Nguyễn Văn Bình (Bố)",
            method: "Điện thoại",
            response: "Đã nhận thông tin, sẽ đến đón con",
          },
          followUp: {
            required: false,
            notes: "Theo dõi thêm 1 ngày, nếu không sốt thì bình thường",
          },
        },
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "illness":
        return "Bệnh tật";
      case "injury":
        return "Chấn thương";
      case "allergy":
        return "Dị ứng";
      case "chronic":
        return "Bệnh mãn tính";
      default:
        return "Khác";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            Đang xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            Đã xử lý
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
            {status}
          </span>
        );
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "low":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            Nhẹ
          </span>
        );
      case "medium":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            Trung bình
          </span>
        );
      case "high":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            Nghiêm trọng
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
            Không xác định
          </span>
        );
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      // In a real application, this would be an API call
      console.log("Deleting event:", id);
      navigate("/manager/health-events");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Không tìm thấy sự kiện
          </h2>
          <Link
            to="/manager/health-events"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/manager/health-events"
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Chi tiết sự kiện y tế
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sự kiện #{event.id} - {event.studentName}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/manager/health-events/${event.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FiEdit className="h-4 w-4" />
            Chỉnh sửa
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiTrash2 className="h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Học sinh
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {event.studentName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lớp
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {event.class}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Thời gian
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(event.time).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Y tá xử lý
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {event.nurseName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loại sự kiện
                </label>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  {getEventTypeLabel(event.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mức độ nghiêm trọng
                </label>
                {getSeverityBadge(event.severity)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Mô tả sự kiện
            </h2>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Taken */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Hành động đã thực hiện
            </h2>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {event.actionTaken}
            </p>
          </div>

          {/* Medical Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Thông số y tế
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhiệt độ
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.details.temperature}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Mạch</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.details.pulse}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Huyết áp
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.details.bloodPressure}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhịp thở
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.details.respiratoryRate}
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          {event.hasMedications && event.details.medications && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Thuốc đã sử dụng
              </h2>
              <div className="space-y-3">
                {event.details.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {medication.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Liều lượng: {medication.dosage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {medication.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {medication.administeredBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Supplies */}
          {event.hasMedicalSupplies && event.details.medicalSupplies && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Vật tư y tế đã sử dụng
              </h2>
              <div className="space-y-3">
                {event.details.medicalSupplies.map((supply, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {supply.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số lượng: {supply.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {supply.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {supply.usedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Trạng thái
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tình trạng:
                </span>
                {getStatusBadge(event.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Mức độ:
                </span>
                {getSeverityBadge(event.severity)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Theo dõi:
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.followUpRequired
                      ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                      : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  }`}
                >
                  {event.followUpRequired ? "Cần theo dõi" : "Không cần"}
                </span>
              </div>
            </div>
          </div>

          {/* Parent Contact */}
          {event.details.parentContact && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Liên hệ phụ huynh
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiCheck className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 dark:text-green-400">
                    Đã liên hệ
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thời gian:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.details.parentContact.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Người liên hệ:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.details.parentContact.person}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phương thức:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.details.parentContact.method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phản hồi:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.details.parentContact.response}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up */}
          {event.details.followUp && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Theo dõi
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {event.details.followUp.required ? (
                    <FiAlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <FiCheck className="h-4 w-4 text-green-600" />
                  )}
                  <span
                    className={
                      event.details.followUp.required
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    {event.details.followUp.required
                      ? "Cần theo dõi"
                      : "Không cần theo dõi"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ghi chú:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.details.followUp.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthEventDetail;
