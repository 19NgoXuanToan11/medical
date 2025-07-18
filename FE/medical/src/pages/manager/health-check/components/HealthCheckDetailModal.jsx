import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiInfo } from "react-icons/fi";

const HealthCheckDetailModal = ({
  showModal,
  onClose,
  selectedRequest,
  onApprovalAction,
}) => {
  if (!showModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết yêu cầu khám sức khỏe
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Equipment Status - Priority Section */}
            <EquipmentStatusSection selectedRequest={selectedRequest} />

            {/* Basic Information */}
            <BasicInformation selectedRequest={selectedRequest} />

            {/* Schedule and Location Details */}
            <ScheduleDetails selectedRequest={selectedRequest} />

            {/* Target Information */}
            <TargetInformation selectedRequest={selectedRequest} />

            {/* Check Items */}
            <CheckItems selectedRequest={selectedRequest} />

            {/* Description */}
            <Description selectedRequest={selectedRequest} />

            {/* Action Buttons */}
            <ActionButtons
              selectedRequest={selectedRequest}
              onApprovalAction={onApprovalAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EquipmentStatusSection = ({ selectedRequest }) => {
  if (selectedRequest.equipmentReport?.requiresAction) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-full">
            <FiAlertTriangle className="h-6 w-6 text-yellow-800 dark:text-yellow-200" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">
              ⚠️ CẢNH BÁO THIẾT BỊ
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4 font-medium">
              {selectedRequest.equipmentReport.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Missing Equipment */}
              {selectedRequest.equipmentReport.hasUnavailable && (
                <MissingEquipment
                  unavailableEquipment={
                    selectedRequest.equipmentReport.unavailableEquipment
                  }
                />
              )}

              {/* Out of Stock Equipment */}
              {selectedRequest.equipmentReport.hasOutOfStock && (
                <OutOfStockEquipment
                  outOfStockEquipment={
                    selectedRequest.equipmentReport.outOfStockEquipment
                  }
                />
              )}
            </div>

            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                🔧 Hành động cần thiết:
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                {selectedRequest.equipmentReport.actionRequired}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRequest.equipmentStatus === "ready") {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
            <FiCheck className="h-5 w-5 text-green-800 dark:text-green-200" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              ✅ Thiết bị sẵn sàng
            </h4>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Tất cả thiết bị cần thiết đã có sẵn và đủ số lượng
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const MissingEquipment = ({ unavailableEquipment }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
      <span className="text-lg">🚫</span>
      Thiết bị không có sẵn ({unavailableEquipment?.length || 0})
    </h5>
    <div className="space-y-2">
      {unavailableEquipment?.map((eq, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded"
        >
          <span className="text-red-800 dark:text-red-200 font-medium">
            {eq.name}
          </span>
          <span className="text-xs text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
            Cần mua
          </span>
        </div>
      ))}
    </div>
  </div>
);

const OutOfStockEquipment = ({ outOfStockEquipment }) => (
  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
    <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
      <span className="text-lg">📦</span>
      Thiết bị hết hàng ({outOfStockEquipment?.length || 0})
    </h5>
    <div className="space-y-2">
      {outOfStockEquipment?.map((eq, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded"
        >
          <span className="text-orange-800 dark:text-orange-200 font-medium">
            {eq.name}
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">
            Còn {eq.stock}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BasicInformation = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tiêu đề
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {selectedRequest.title}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Người yêu cầu
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.requestedBy}
      </p>
    </div>
  </div>
);

const ScheduleDetails = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Ngày thực hiện
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {new Date(selectedRequest.scheduledDate).toLocaleDateString("vi-VN")}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Thời gian
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.scheduledTime}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Địa điểm
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.location}
      </p>
    </div>
  </div>
);

const TargetInformation = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Lớp học
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.targetGrades.join(", ")}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Số học sinh
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {selectedRequest.totalStudents} học sinh
      </p>
    </div>
  </div>
);

const CheckItems = ({ selectedRequest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Hạng mục khám
    </label>
    <div className="flex flex-wrap gap-2">
      {selectedRequest.checkItems.map((item, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const Description = ({ selectedRequest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Mô tả chi tiết
    </label>
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
        {selectedRequest.description}
      </p>
    </div>
  </div>
);

const ActionButtons = ({ selectedRequest, onApprovalAction }) => (
  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
    {selectedRequest?.equipmentReport?.requiresAction ? (
      <>
        <button
          onClick={() => onApprovalAction("approve")}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiCheck className="h-5 w-5" />
          Phê duyệt có điều kiện
        </button>
        <button
          onClick={() => onApprovalAction("reject")}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiX className="h-5 w-5" />
          Tạm hoãn
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => onApprovalAction("approve")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiCheck className="h-5 w-5" />
          Phê duyệt
        </button>
        <button
          onClick={() => onApprovalAction("reject")}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiX className="h-5 w-5" />
          Từ chối
        </button>
      </>
    )}
  </div>
);

export default HealthCheckDetailModal;
