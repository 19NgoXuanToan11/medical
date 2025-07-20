import React from "react";
import {
  FiX,
  FiShield,
  FiUser,
  FiUsers,
  FiCalendar,
  FiClock,
  FiFileText,
  FiCheck,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

const InjectionFormDetailModal = ({
  showModal,
  onClose,
  selectedForm,
  onApprovalAction,
}) => {
  if (!showModal || !selectedForm) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ duyệt",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        icon: FiClock,
      },
      approved: {
        label: "Đã duyệt",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: FiCheck,
      },
      rejected: {
        label: "Đã từ chối",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: FiX,
      },
    };

    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const getConsentStatusInfo = (consentStatus) => {
    const statusMap = {
      pending: {
        label: "Chờ phụ huynh đồng ý",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: FiClock,
      },
      approved: {
        label: "Phụ huynh đã đồng ý",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: FiCheck,
      },
      rejected: {
        label: "Phụ huynh từ chối",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: FiX,
      },
    };

    return statusMap[consentStatus?.toLowerCase()] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(selectedForm.status);
  const consentInfo = getConsentStatusInfo(selectedForm.consentStatus);
  const StatusIcon = statusInfo.icon;
  const ConsentIcon = consentInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiShield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chi tiết phiếu tiêm chủng
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: #{selectedForm.formId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Trạng thái
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <StatusIcon className="h-5 w-5" />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ConsentIcon className="h-5 w-5" />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${consentInfo.className}`}
                >
                  {consentInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Thông tin cơ bản
            </h3>
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tên vaccine
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.injectionName || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày tạo phiếu
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDate(selectedForm.createdDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Lớp học
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.className || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày đồng ý
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.consentDate
                      ? formatDate(selectedForm.consentDate)
                      : "Chưa có"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FiUser className="h-5 w-5" />
              Thông tin học sinh
            </h3>
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.student?.fullName || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mã học sinh
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.student?.studentCode || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày sinh
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.student?.dateOfBirth
                      ? formatDateOnly(selectedForm.student.dateOfBirth)
                      : "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Giới tính
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.student?.gender || "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FiUsers className="h-5 w-5" />
              Thông tin phụ huynh
            </h3>
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.parent?.fullName || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.parent?.phoneNumber || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.parent?.email || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Địa chỉ
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedForm.parent?.address || "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedForm.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FiFileText className="h-5 w-5" />
                Mô tả
              </h3>
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedForm.description}
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Information */}
          {selectedForm.confirmedBy && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FiInfo className="h-5 w-5" />
                Thông tin xác nhận
              </h3>
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Người xác nhận
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedForm.confirmedByStaff?.fullName ||
                        `ID: ${selectedForm.confirmedBy}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày xác nhận
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedForm.confirmedDate
                        ? formatDate(selectedForm.confirmedDate)
                        : "Chưa xác nhận"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Trạng thái xác nhận
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedForm.confirmStatus || "Chưa xác nhận"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700"
          >
            Đóng
          </button>

          {selectedForm.status?.toLowerCase() === "pending" && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onApprovalAction("reject");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2"
              >
                <FiX className="h-4 w-4" />
                Từ chối
              </button>
              <button
                onClick={() => {
                  onClose();
                  onApprovalAction("approve");
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2"
              >
                <FiCheck className="h-4 w-4" />
                Duyệt phiếu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InjectionFormDetailModal;
