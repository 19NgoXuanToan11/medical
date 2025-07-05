import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiFileText,
  FiPackage,
} from "react-icons/fi";

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockEvent = {
        id: parseInt(id),
        studentName: "Nguyễn Văn An",
        class: "3A",
        type: "illness",
        description: "Sốt nhẹ 37.8°C, đã cấp thuốc hạ sốt",
        time: "2023-06-15T09:30:00",
        status: "resolved",
        actionTaken: "Đã cho uống thuốc hạ sốt và thông báo cho phụ huynh",
        details: [
          "Học sinh có biểu hiện sốt từ sáng",
          "Thân nhiệt đo được: 37.8°C",
          "Không có các triệu chứng khác như ho, đau họng",
          "Đã uống 1 liều Paracetamol 250mg lúc 9:30",
        ],
        vitalSigns: {
          temperature: "37.8°C",
          pulse: "88 lần/phút",
          bloodPressure: "110/70 mmHg",
          respiratoryRate: "20 lần/phút",
        },
        medications: [
          {
            name: "Paracetamol",
            dosage: "250mg",
            time: "09:30",
            administeredBy: "Y tá Trần Thị B",
          },
        ],
        medicalSupplies: [
          {
            name: "Nhiệt kế điện tử",
            quantity: 1,
            time: "09:25",
            usedBy: "Y tá Trần Thị B",
          },
          {
            name: "Băng dính y tế",
            quantity: 2,
            time: "09:30",
            usedBy: "Y tá Trần Thị B",
          },
        ],
        parentContacted: {
          time: "09:45",
          person: "Mẹ - Nguyễn Thị X",
          method: "Điện thoại",
          response: "Đã nắm thông tin, không đón về",
        },
        followUp:
          "Theo dõi sát thân nhiệt, liên hệ lại phụ huynh nếu sốt trên 38.5°C",
      };

      setEvent(mockEvent);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "illness":
        return <FiActivity className="h-5 w-5 text-red-600" />;
      case "injury":
        return <FiActivity className="h-5 w-5 text-orange-600" />;
      case "allergy":
        return <FiActivity className="h-5 w-5 text-purple-600" />;
      case "chronic":
        return <FiActivity className="h-5 w-5 text-blue-600" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-600" />;
    }
  };

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
    if (status === "pending") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Đang xử lý
        </span>
      );
    } else if (status === "resolved") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Đã xử lý
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
  };

  const handleMarkAsResolved = () => {
    // In a real app, this would be an API call
    setEvent({ ...event, status: "resolved" });
    // Display a success message or notification
  };

  const handleDeleteEvent = () => {
    // In a real app, this would be an API call
    // and you'd show a confirmation dialog
    navigate("/nurse/health-events");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/nurse/health-events"
            className="mr-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Chi tiết sự cố y tế
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/nurse/health-events/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-700"
          >
            <FiEdit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
          {event.status === "pending" && (
            <button
              onClick={handleMarkAsResolved}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Đánh dấu đã xử lý
            </button>
          )}
          <button
            onClick={handleDeleteEvent}
            className="inline-flex items-center px-3 py-2 border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-neutral-700"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        {/* Event Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getEventTypeIcon(event.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {getEventTypeLabel(event.type)}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {event.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(event.status)}
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                <FiClock className="mr-1 h-4 w-4" />
                {new Date(event.time).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            <FiUser className="inline mr-2" />
            Thông tin học sinh
          </h3>
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Họ và tên
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {event.studentName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Lớp
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {event.class}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            <FiFileText className="inline mr-2" />
            Chi tiết sự kiện
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Mô tả ngắn
              </p>
              <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                {event.description}
              </p>
            </div>
            {event.details && event.details.length > 0 && (
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  Chi tiết
                </p>
                <ul className="space-y-1">
                  {event.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Hành động đã thực hiện
              </p>
              <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                {event.actionTaken}
              </p>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        {event.vitalSigns && (
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              <FiActivity className="inline mr-2" />
              Dấu hiệu sinh tồn
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Thân nhiệt
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {event.vitalSigns.temperature}
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Mạch
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {event.vitalSigns.pulse}
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Huyết áp
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {event.vitalSigns.bloodPressure}
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Nhịp thở
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {event.vitalSigns.respiratoryRate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Medications Used */}
        {event.medications && event.medications.length > 0 && (
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              <FiPackage className="inline mr-2" />
              Thuốc đã sử dụng
            </h3>
            <div className="space-y-3">
              {event.medications.map((medication, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {medication.name} - {medication.dosage}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Thực hiện bởi: {medication.administeredBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {medication.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Supplies Used */}
        {event.medicalSupplies && event.medicalSupplies.length > 0 && (
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              <FiPackage className="inline mr-2" />
              Vật tư y tế đã sử dụng
            </h3>
            <div className="space-y-3">
              {event.medicalSupplies.map((supply, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {supply.name} - Số lượng: {supply.quantity}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Sử dụng bởi: {supply.usedBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {supply.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Contact */}
        {event.parentContacted && (
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              <FiUser className="inline mr-2" />
              Liên hệ phụ huynh
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Người liên hệ
                  </p>
                  <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                    {event.parentContacted.person}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Phương thức
                  </p>
                  <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                    {event.parentContacted.method}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Thời gian liên hệ
                  </p>
                  <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                    {event.parentContacted.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Phản hồi
                  </p>
                  <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                    {event.parentContacted.response}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up */}
        {event.followUp && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              <FiAlertCircle className="inline mr-2" />
              Theo dõi
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-neutral-900 dark:text-neutral-100">
                {event.followUp}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthEventDetail;
