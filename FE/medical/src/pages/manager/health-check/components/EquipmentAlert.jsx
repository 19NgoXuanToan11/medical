import React from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const EquipmentAlert = ({
  pendingRequests,
  onViewDetail,
  onSetActiveTab,
  onSetSelectedRequest,
}) => {
  const equipmentIssueRequests = pendingRequests.filter(
    (req) => req.equipmentReport?.requiresAction
  );

  if (equipmentIssueRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-200 dark:bg-yellow-800 rounded-full">
            <FiAlertTriangle className="h-5 w-5 text-yellow-800 dark:text-yellow-200" />
          </div>
          <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
            ⚠️ CẢNH BÁO THIẾT BỊ ({equipmentIssueRequests.length} yêu cầu)
          </h4>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          Các yêu cầu sau đây có vấn đề về thiết bị cần được xem xét trước khi
          phê duyệt:
        </p>
        <div className="space-y-3">
          {equipmentIssueRequests.map((request) => (
            <EquipmentIssueCard
              key={request.id}
              request={request}
              onViewDetail={onViewDetail}
              onSetActiveTab={onSetActiveTab}
              onSetSelectedRequest={onSetSelectedRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const EquipmentIssueCard = ({
  request,
  onViewDetail,
  onSetActiveTab,
  onSetSelectedRequest,
}) => {
  const handleProcess = () => {
    onSetSelectedRequest(request);
    onSetActiveTab("pending");
  };

  return (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
            {request.title}
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            📅 {new Date(request.scheduledDate).toLocaleDateString("vi-VN")} •
            👥 {request.totalStudents} học sinh
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>Vấn đề:</strong> {request.equipmentReport.summary}
          </p>
          <div className="flex gap-4 mt-2 text-xs">
            {request.equipmentReport.hasUnavailable && (
              <span className="text-red-600 dark:text-red-400">
                🚫 {request.equipmentReport.unavailableEquipment?.length || 0}{" "}
                thiết bị không có
              </span>
            )}
            {request.equipmentReport.hasOutOfStock && (
              <span className="text-orange-600 dark:text-orange-400">
                📦 {request.equipmentReport.outOfStockEquipment?.length || 0}{" "}
                thiết bị hết hàng
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onViewDetail(request)}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            Chi tiết
          </button>
          <button
            onClick={handleProcess}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
          >
            Xử lý
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentAlert;
