import React from "react";
import { FiRefreshCw, FiAlertTriangle, FiInfo } from "react-icons/fi";

const ApprovalModal = ({
  showModal,
  onClose,
  selectedRequest,
  approvalAction,
  approvalNotes,
  setApprovalNotes,
  loading,
  onSubmit,
}) => {
  if (!showModal) return null;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-lg w-full">
        <div className="p-6">
          <ApprovalHeader
            approvalAction={approvalAction}
            selectedRequest={selectedRequest}
          />

          {/* Contextual Information */}
          <ContextualInfo
            selectedRequest={selectedRequest}
            approvalAction={approvalAction}
          />

          {/* Decision Summary */}
          <DecisionSummary
            selectedRequest={selectedRequest}
            approvalAction={approvalAction}
          />

          {/* Notes Input */}
          <NotesInput
            approvalAction={approvalAction}
            selectedRequest={selectedRequest}
            approvalNotes={approvalNotes}
            setApprovalNotes={setApprovalNotes}
          />

          {/* Action Buttons */}
          <ActionButtons
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            approvalAction={approvalAction}
            selectedRequest={selectedRequest}
          />
        </div>
      </div>
    </div>
  );
};

const ApprovalHeader = ({ approvalAction, selectedRequest }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    {approvalAction === "approve"
      ? selectedRequest?.equipmentReport?.requiresAction
        ? "Phê duyệt có điều kiện"
        : "Phê duyệt yêu cầu"
      : selectedRequest?.equipmentReport?.requiresAction
      ? "Tạm hoãn do thiết bị"
      : "Từ chối yêu cầu"}
  </h3>
);

const ContextualInfo = ({ selectedRequest, approvalAction }) => {
  if (!selectedRequest?.equipmentReport?.requiresAction) return null;

  return (
    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
            Vấn đề thiết bị được phát hiện:
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {selectedRequest.equipmentReport.summary}
          </p>
          {approvalAction === "approve" && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 font-medium">
              💡 Phê duyệt có điều kiện có nghĩa là yêu cầu được chấp nhận nhưng
              cần giải quyết vấn đề thiết bị trước khi thực hiện.
            </p>
          )}
          {approvalAction === "reject" && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 font-medium">
              ⏸️ Tạm hoãn để có thời gian chuẩn bị thiết bị cần thiết.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const DecisionSummary = ({ selectedRequest, approvalAction }) => (
  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <p className="text-sm text-gray-700 dark:text-gray-300">
      <strong>Yêu cầu:</strong> {selectedRequest?.title}
    </p>
    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
      <strong>Quyết định:</strong>{" "}
      {approvalAction === "approve"
        ? selectedRequest?.equipmentReport?.requiresAction
          ? "Phê duyệt có điều kiện - Cần giải quyết vấn đề thiết bị"
          : "Phê duyệt - Cho phép thực hiện"
        : selectedRequest?.equipmentReport?.requiresAction
        ? "Tạm hoãn - Chờ chuẩn bị thiết bị"
        : "Từ chối - Không cho phép thực hiện"}
    </p>
  </div>
);

const NotesInput = ({
  approvalAction,
  selectedRequest,
  approvalNotes,
  setApprovalNotes,
}) => {
  const getLabel = () => {
    if (approvalAction === "approve") {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Ghi chú về điều kiện phê duyệt"
        : "Ghi chú phê duyệt (tùy chọn)";
    } else {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Ghi chú về kế hoạch chuẩn bị thiết bị"
        : "Lý do từ chối";
    }
  };

  const getPlaceholder = () => {
    if (approvalAction === "approve") {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Ví dụ: Phê duyệt với điều kiện chuẩn bị đầy đủ thiết bị theo danh sách. Vui lòng liên hệ phòng kỹ thuật để mua sắm/bổ sung thiết bị còn thiếu..."
        : "Ví dụ: Yêu cầu hợp lý, phê duyệt thực hiện theo đúng kế hoạch...";
    } else {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Ví dụ: Tạm hoãn 1-2 tuần để chuẩn bị thiết bị. Dự kiến thực hiện sau khi có đầy đủ thiết bị cần thiết..."
        : "Ví dụ: Không phù hợp với kế hoạch hiện tại, đề nghị lên lại lịch...";
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {getLabel()}
      </label>
      <textarea
        value={approvalNotes}
        onChange={(e) => setApprovalNotes(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
        placeholder={getPlaceholder()}
      />
    </div>
  );
};

const ActionButtons = ({
  onClose,
  onSubmit,
  loading,
  approvalAction,
  selectedRequest,
}) => {
  const getButtonText = () => {
    if (approvalAction === "approve") {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Phê duyệt có điều kiện"
        : "Phê duyệt";
    } else {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "Tạm hoãn"
        : "Từ chối";
    }
  };

  const getButtonClass = () => {
    if (approvalAction === "approve") {
      return selectedRequest?.equipmentReport?.requiresAction
        ? "bg-yellow-600 hover:bg-yellow-700"
        : "bg-green-600 hover:bg-green-700";
    } else {
      return "bg-red-600 hover:bg-red-700";
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Hủy
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className={`flex-1 px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 font-medium ${getButtonClass()} disabled:opacity-50`}
      >
        {loading && <FiRefreshCw className="h-4 w-4 animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  );
};

export default ApprovalModal;
