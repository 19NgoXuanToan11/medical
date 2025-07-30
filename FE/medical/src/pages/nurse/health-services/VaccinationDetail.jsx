import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiActivity,
  FiCheckCircle,
  FiUser,
  FiFileText,
  FiShield,
  FiInfo,
  FiEdit,
  FiEye,
  FiTarget,
  FiPackage,
} from "react-icons/fi";
import { injectionFormService } from "../../../utils/api/injection/injectionService";

const VaccinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vaccinationData, setVaccinationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVaccinationDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id && id !== "undefined") {
          const result = await injectionFormService.getInjectionFormById(id);
          if (result.success && result.data) {
            setVaccinationData(result.data);
          } else {
            throw new Error(
              result.message || "Không thể tải thông tin tiêm chủng"
            );
          }
        } else {
          throw new Error("ID không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tiêm chủng:", err);
        setError(err.message);
      }
      setLoading(false);
    };

    loadVaccinationDetail();
  }, [id]);

  // Helper function to format grade IDs
  const formatGradeIds = (gradeIds) => {
    try {
      if (typeof gradeIds === "string") {
        const parsed = JSON.parse(gradeIds);
        return parsed.map((id) => id.replace("grade-", "")).join(", ");
      }
      return gradeIds;
    } catch {
      return gradeIds || "Không có thông tin";
    }
  };

  // Helper function to format status
  const getStatusBadge = (status) => {
    const statusMap = {
      "đang chờ": {
        color: "bg-yellow-100 text-yellow-800",
        label: "Đang chờ duyệt",
      },
      "đã duyệt": { color: "bg-green-100 text-green-800", label: "Đã duyệt" },
      "hoàn thành": { color: "bg-blue-100 text-blue-800", label: "Hoàn thành" },
      hủy: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Đang chờ duyệt",
      },
      approved: { color: "bg-green-100 text-green-800", label: "Đã duyệt" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Hoàn thành" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800",
      label: status || "Chưa xác định",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải thông tin tiêm chủng...
          </p>
        </div>
      </div>
    );
  }

  if (error || !vaccinationData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <FiInfo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {error || "Không tìm thấy thông tin tiêm chủng"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-600"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Chi tiết tiêm chủng
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getStatusBadge(vaccinationData.status)}
              <Link
                to={`/nurse/health-services/edit/${id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-start">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Tên tiêm chủng
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {vaccinationData.injectionName || "Không có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Ngày thực hiện
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {vaccinationData.scheduledDate
                          ? new Date(
                              vaccinationData.scheduledDate
                            ).toLocaleDateString("vi-VN")
                          : "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Thời gian
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {vaccinationData.startTime || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Địa điểm
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {vaccinationData.location || "Phòng y tế trường"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccine Information Card */}
          {vaccinationData.vaccine && (
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiPackage className="h-5 w-5 mr-2 text-green-600" />
                  Thông tin vaccine
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Chi tiết vaccine
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tên vaccine
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.name || "Không có thông tin"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Nhà sản xuất
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.manufacturer ||
                            "Không có thông tin"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Liều lượng
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.dose || "Theo hướng dẫn"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Thông tin bổ sung
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Cách tiêm
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.administrationMethod ||
                            "Tiêm bắp"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Lô sản xuất
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.batchNumber ||
                            "Không có thông tin"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Hạn sử dụng
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.vaccine.expiryDate
                            ? new Date(
                                vaccinationData.vaccine.expiryDate
                              ).toLocaleDateString("vi-VN")
                            : "Không có thông tin"}
                        </p>
                      </div>
                      {/* Đưa mô tả ra giữa hai cột */}
                    </div>
                  </div>
                </div>
                {/* Mô tả ở giữa hai cột */}
                <div className="flex justify-center mt-6">
                  <div className="w-full md:w-2/3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Mô tả
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white font-medium text-center">
                      {vaccinationData.vaccine.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Target Classes Card */}
          {vaccinationData.gradeIds && (
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiTarget className="h-5 w-5 mr-2 text-purple-600" />
                  Đối tượng tiêm chủng
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Khối lớp
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {formatGradeIds(vaccinationData.gradeIds)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tổng số học sinh
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.totalStudents || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Yêu cầu đồng ý phụ huynh
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.requireParentConfirmation
                            ? "Có"
                            : "Không"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Thông báo phụ huynh
                        </span>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {vaccinationData.notifyParents ? "Có" : "Không"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Card */}
          {vaccinationData.description && (
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiFileText className="h-5 w-5 mr-2 text-gray-600" />
                  Mô tả
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {vaccinationData.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationDetail;
