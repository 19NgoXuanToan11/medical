import React from "react";
import {
  FiShield,
  FiEye,
  FiCheck,
  FiX,
  FiCalendar,
  FiUsers,
  FiUser,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

const InjectionFormCard = ({
  injectionForm,
  onViewDetail,
  onApprovalAction,
  setSelectedForm,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ duyệt",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      },
      approved: {
        label: "Đã duyệt",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      rejected: {
        label: "Đã từ chối",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getConsentStatusBadge = (consentStatus) => {
    const statusMap = {
      pending: {
        label: "Chờ phụ huynh",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      approved: {
        label: "PH đồng ý",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      rejected: {
        label: "PH từ chối",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };

    const statusInfo =
      statusMap[consentStatus?.toLowerCase()] || statusMap.pending;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {injectionForm.injectionName || "Phiếu tiêm chủng"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: #{injectionForm.formId} • Tạo ngày{" "}
                  {formatDate(injectionForm.createdDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(injectionForm.status)}
            {getConsentStatusBadge(injectionForm.consentStatus)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiUser className="h-4 w-4" />
              Học sinh
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {injectionForm.student?.fullName || "Chưa có thông tin"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Khối:{" "}
              {injectionForm.className ||
                injectionForm.student?.className ||
                "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiUsers className="h-4 w-4" />
              Phụ huynh
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {injectionForm.parent?.fullName || "Chưa có thông tin"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {injectionForm.parent?.phoneNumber || ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiClock className="h-4 w-4" />
              Ngày đồng ý
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {injectionForm.consentDate
                ? formatDate(injectionForm.consentDate)
                : "Chưa đồng ý"}
            </p>
          </div>
        </div>

        {injectionForm.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Mô tả
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {injectionForm.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onViewDetail(injectionForm)}
            className="px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
          >
            <FiEye className="h-4 w-4" />
            Xem chi tiết
          </button>

          {injectionForm.status?.toLowerCase() === "pending" && (
            <>
              <button
                onClick={() => {
                  setSelectedForm(injectionForm);
                  onApprovalAction("approve");
                }}
                className="px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-1"
              >
                <FiCheck className="h-4 w-4" />
                Duyệt
              </button>
              <button
                onClick={() => {
                  setSelectedForm(injectionForm);
                  onApprovalAction("reject");
                }}
                className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Từ chối
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InjectionFormCard;
