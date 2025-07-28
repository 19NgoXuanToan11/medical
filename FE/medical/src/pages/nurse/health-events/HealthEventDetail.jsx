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
  FiPhone,
  FiMail,
  FiMapPin,
  FiUserCheck,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiPackage as FiPill,
  FiShield,
  FiClock as FiTime,
} from "react-icons/fi";
import {
  getHealthEventById,
  deleteHealthEvent,
} from "../../../utils/api/health-events/healthEventService";

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const apiData = await getHealthEventById(id);
        setEvent(apiData);
      } catch (error) {
        console.error("Failed to fetch health event detail:", error);
        setError("Không thể tải thông tin sự cố y tế");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const getEventTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "illness":
        return <FiActivity className="h-5 w-5 text-red-600" />;
      case "injury":
        return <FiAlertCircle className="h-5 w-5 text-orange-600" />;
      case "allergy":
        return <FiShield className="h-5 w-5 text-purple-600" />;
      case "chronic":
        return <FiHeart className="h-5 w-5 text-blue-600" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
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

  const getStatusBadge = (treatment) => {
    if (treatment && treatment.trim() !== "") {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
          <FiCheckCircle className="mr-1 h-4 w-4" />
          Đã xử lý
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
          <FiClock className="mr-1 h-4 w-4" />
          Đang xử lý
        </span>
      );
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự cố y tế này?")) {
      try {
        await deleteHealthEvent(id);
        navigate("/nurse/health-events");
      } catch (error) {
        console.error("Failed to delete health event:", error);
        alert("Không thể xóa sự cố y tế. Vui lòng thử lại.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Đang tải...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">{error}</p>
        <Link
          to="/nurse/health-events"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiFileText className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Không tìm thấy sự cố y tế
        </p>
        <Link
          to="/nurse/health-events"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link
            to="/nurse/health-events"
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chi tiết sự cố y tế
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {event.eventId} | Ngày tạo: {formatDateTime(event.eventDate)}
            </p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to={`/nurse/health-events/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400 transition-colors duration-200"
          >
            <FiEdit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
          <button
            onClick={handleDeleteEvent}
            className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-400 dark:text-red-400 transition-colors duration-200"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getEventTypeIcon(event.eventType)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getEventTypeLabel(event.eventType)}
                  </h2>
                </div>
              </div>
              {getStatusBadge(event.treatment)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Triệu chứng
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {event.symptoms || "Không có mô tả"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Đánh giá
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {event.assessment || "Chưa đánh giá"}
                </p>
              </div>
            </div>

            {event.treatment && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Điều trị
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {event.treatment}
                </p>
              </div>
            )}

            {event.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Ghi chú
                </h3>
                <p className="text-gray-900 dark:text-white">{event.notes}</p>
              </div>
            )}
          </div>

          {/* Medications Used */}
          {event.healthEventMedicines &&
            event.healthEventMedicines.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiPill className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thuốc đã sử dụng
                  </h2>
                </div>
                <div className="space-y-3">
                  {event.healthEventMedicines.map((medicine, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {medicine.medicineName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Liều lượng: {medicine.dosage || "Không rõ"}
                        </p>
                      </div>
                      {medicine.time && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {medicine.time}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Medical Supplies Used */}
          {event.healthEventMedicalSupplies &&
            event.healthEventMedicalSupplies.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiPackage className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Vật tư y tế đã sử dụng
                  </h2>
                </div>
                <div className="space-y-3">
                  {event.healthEventMedicalSupplies.map((supply, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {supply.medicalSupplyName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Số lượng: {supply.quantity || "Không rõ"}
                        </p>
                      </div>
                      {supply.time && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {supply.time}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Insufficient Items Warning */}
          {(event.insufficientItems || event.insufficientItemsNote) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cảnh báo thiếu thuốc/vật tư
                </h2>
              </div>

              {event.insufficientItems && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                    Danh sách thiếu:
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {event.insufficientItems}
                  </p>
                </div>
              )}

              {event.insufficientItemsNote && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Ghi chú từ y tá:
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {event.insufficientItemsNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Student & Staff Info */}
        <div className="space-y-6">
          {/* Student Information */}
          {event.student && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiUser className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thông tin học sinh
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.student.firstName} {event.student.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mã học sinh
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.student.studentCode}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày sinh
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(event.student.dateOfBirth).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Giới tính
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.student.gender}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Lớp học
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.student.className || "Không rõ"}
                  </p>
                </div>
                {event.student.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Địa chỉ
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.student.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Staff Information */}
          {event.staff && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiUserCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Nhân viên xử lý
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.staff.firstName} {event.staff.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {event.staff.username}
                  </p>
                </div>
                {event.staff.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.staff.email}
                    </p>
                  </div>
                )}
                {event.staff.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Số điện thoại
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.staff.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiTrendingUp className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trạng thái xử lý
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Thông báo phụ huynh
                </span>
                {event.parentNotified ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                    <FiCheckCircle className="mr-1 h-3 w-3" />
                    Đã thông báo
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    <FiClock className="mr-1 h-3 w-3" />
                    Chưa thông báo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthEventDetail;
