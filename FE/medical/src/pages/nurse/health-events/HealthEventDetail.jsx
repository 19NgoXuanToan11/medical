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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/nurse/health-events"
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết sự kiện y tế
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/nurse/health-events/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
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
            className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-red-100">
                {getEventTypeIcon(event.type)}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {getEventTypeLabel(event.type)}
                  </h2>
                  {getStatusBadge(event.status)}
                </div>
                <p className="text-gray-600 mt-1">{event.description}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1 h-4 w-4" />
                {new Date(event.time).toLocaleDateString("vi-VN")}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FiClock className="mr-1 h-4 w-4" />
                {new Date(event.time).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Thông tin học sinh
          </h3>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium text-gray-800 flex items-center">
                <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                {event.studentName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lớp</p>
              <p className="font-medium text-gray-800">{event.class}</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Chi tiết sự kiện
          </h3>
          <ul className="space-y-2 text-gray-600">
            {event.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <FiAlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vital Signs */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Dấu hiệu sinh tồn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Thân nhiệt</p>
              <p className="font-medium text-gray-800">
                {event.vitalSigns.temperature}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Mạch</p>
              <p className="font-medium text-gray-800">
                {event.vitalSigns.pulse}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Huyết áp</p>
              <p className="font-medium text-gray-800">
                {event.vitalSigns.bloodPressure}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Nhịp thở</p>
              <p className="font-medium text-gray-800">
                {event.vitalSigns.respiratoryRate}
              </p>
            </div>
          </div>
        </div>

        {/* Medication */}
        {event.medications && event.medications.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Thuốc đã sử dụng
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên thuốc
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liều lượng
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người thực hiện
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.medications.map((medication, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                        {medication.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {medication.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {medication.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {medication.administeredBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Medical Supplies */}
        {event.medicalSupplies && event.medicalSupplies.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Vật tư y tế đã sử dụng
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên vật tư
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người sử dụng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.medicalSupplies.map((supply, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                        {supply.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {supply.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {supply.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {supply.usedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Parent Contact */}
        {event.parentContacted && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Liên hệ phụ huynh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium text-gray-800">
                  {event.parentContacted.time}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Người liên hệ</p>
                <p className="font-medium text-gray-800">
                  {event.parentContacted.person}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Phương thức</p>
                <p className="font-medium text-gray-800">
                  {event.parentContacted.method}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Phản hồi</p>
                <p className="font-medium text-gray-800">
                  {event.parentContacted.response}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Taken */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Hành động đã thực hiện
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{event.actionTaken}</p>
          </div>
        </div>

        {/* Follow Up */}
        {event.followUp && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Theo dõi tiếp theo
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex">
                <FiFileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <p className="text-gray-700">{event.followUp}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthEventDetail;
