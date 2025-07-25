import React from "react";
import {
  FiActivity,
  FiEye,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiUpload,
} from "react-icons/fi";

const RequestCard = ({
  request,
  onViewDetail,
  onApprovalAction,
  setSelectedRequest,
  showActions = true,
  variant = "pending", // "pending", "upcoming"
  onCompleteHealthCheck, // New prop for completing health check
}) => {
  const getStatusBadge = () => {
    if (variant === "upcoming") {
      if (request.status === "active") {
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Đang thực hiện
          </span>
        );
      } else if (request.status === "Approved") {
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Đã duyệt
          </span>
        );
      } else {
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Đã lên lịch
          </span>
        );
      }
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
          Chờ duyệt
        </span>
      );
    }
  };

  const getIconColor = () => {
    if (variant === "upcoming") {
      if (request.status === "active") {
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      } else if (request.status === "Approved") {
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      } else {
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      }
    } else {
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    }
  };

  const cardClassName = request.equipmentReport?.requiresAction
    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 border-2"
    : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700";

  return (
    <div
      className={`rounded-lg shadow border overflow-hidden ${cardClassName}`}
    >
      <div className="p-6">
        {/* Equipment Priority Banner */}
        {request.equipmentReport?.requiresAction && (
          <div className="mb-4 p-3 bg-yellow-200 dark:bg-yellow-800 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-yellow-800 dark:text-yellow-200" />
              <span className="font-bold text-yellow-800 dark:text-yellow-200">
                ⚠️ YÊU CẦU CÓ THIẾU THIẾT BỊ - CẦN XEM XÉT
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor()}`}
              >
                <FiActivity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {request.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Yêu cầu bởi: {request.requestedBy} •{" "}
                  {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
            {request.urgencyLevel === "high" && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Ưu tiên cao
              </span>
            )}
            {/* Equipment Status Badge */}
            {request.equipmentReport &&
              request.equipmentReport.requiresAction && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                  <FiAlertTriangle className="h-3 w-3" />
                  Cần chú ý thiết bị
                </span>
              )}
            {request.equipmentStatus === "ready" && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                <FiCheck className="h-3 w-3" />
                Thiết bị sẵn sàng
              </span>
            )}
          </div>
        </div>

        {/* Equipment Alert Section - Priority Display */}
        {request.equipmentReport && request.equipmentReport.requiresAction && (
          <EquipmentReportSection equipmentReport={request.equipmentReport} />
        )}

        {/* Equipment Ready Display */}
        {request.equipmentReport && !request.equipmentReport.requiresAction && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center gap-2">
              <FiCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                ✅ Thiết bị đầy đủ và sẵn sàng
              </span>
            </div>
          </div>
        )}

        <RequestDetails request={request} />

        {showActions && (
                  <RequestActions
          request={request}
          onViewDetail={onViewDetail}
          onApprovalAction={onApprovalAction}
          setSelectedRequest={setSelectedRequest}
          variant={variant}
          onCompleteHealthCheck={onCompleteHealthCheck}
        />
        )}
      </div>
    </div>
  );
};

const EquipmentReportSection = ({ equipmentReport }) => (
  <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 border-l-4 border-red-500 rounded-lg shadow-sm">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
        <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-bold text-red-800 dark:text-red-200 text-lg">
            🚨 THIẾT BỊ CẦN XEM XÉT NGAY
          </h4>
          <span className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-xs font-bold animate-pulse">
            PRIORITY
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
            📝 Tóm tắt tình trạng:
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {equipmentReport.summary}
          </p>
        </div>

        {/* Missing Equipment */}
        {equipmentReport.hasUnavailable && (
          <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
            <div className="flex items-center gap-2 mb-2">
              <FiX className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-bold text-red-800 dark:text-red-200">
                🚫 THIẾT BỊ KHÔNG CÓ (
                {equipmentReport.unavailableEquipment?.length || 0} món)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {equipmentReport.unavailableEquipment?.map((eq, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-red-200 dark:bg-red-800 rounded text-sm"
                >
                  <FiX className="h-3 w-3 text-red-700 dark:text-red-300" />
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    {eq.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Out of Stock Equipment */}
        {equipmentReport.hasOutOfStock && (
          <div className="mb-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-bold text-orange-800 dark:text-orange-200">
                📦 THIẾT BỊ HẾT HÀNG (
                {equipmentReport.outOfStockEquipment?.length || 0} món)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {equipmentReport.outOfStockEquipment?.map((eq, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-orange-200 dark:bg-orange-800 rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="h-3 w-3 text-orange-700 dark:text-orange-300" />
                    <span className="text-orange-800 dark:text-orange-200 font-medium">
                      {eq.name}
                    </span>
                  </div>
                  <span className="text-orange-700 dark:text-orange-300 font-bold text-xs px-2 py-1 bg-orange-300 dark:bg-orange-700 rounded">
                    Còn {eq.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Required */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-2">
            <div>
              <p className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-1">
                🔧 Hành động được đề xuất:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {equipmentReport.actionRequired}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RequestDetails = ({ request }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ngày thực hiện
        </p>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {new Date(request.scheduledDate).toLocaleDateString("vi-VN")} •{" "}
          {request.scheduledTime}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Đối tượng</p>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {request.targetGrades.join(", ")} ({request.totalStudents} học sinh)
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thời gian dự kiến
        </p>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {request.estimatedDuration} phút
        </p>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Hạng mục khám
      </p>
      <div className="flex flex-wrap gap-2">
        {request.checkItems.map((item, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs"
          >
            {item}
          </span>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mô tả</p>
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        {request.description}
      </p>
    </div>
  </>
);

const RequestActions = ({
  request,
  onViewDetail,
  onApprovalAction,
  setSelectedRequest,
  variant,
  onCompleteHealthCheck,
}) => (
  <div className="flex justify-end gap-3">
    <button
      onClick={() => onViewDetail(request)}
      className="px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
    >
      <FiEye className="h-4 w-4" />
      Xem chi tiết
    </button>

    {variant === "pending" && (
      <>
        {/* Conditional Approval Buttons based on Equipment Status */}
        {request.equipmentReport && request.equipmentReport.requiresAction ? (
          <>
            <button
              onClick={() => {
                setSelectedRequest(request);
                onApprovalAction("approve");
              }}
              className="px-3 py-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 border border-yellow-200 dark:border-yellow-600 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-1"
            >
              <FiCheck className="h-4 w-4" />
              Duyệt có điều kiện
            </button>
            <button
              onClick={() => {
                setSelectedRequest(request);
                onApprovalAction("reject");
              }}
              className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
            >
              <FiX className="h-4 w-4" />
              Tạm hoãn
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedRequest(request);
                onApprovalAction("approve");
              }}
              className="px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-1"
            >
              <FiCheck className="h-4 w-4" />
              Duyệt
            </button>
            <button
              onClick={() => {
                setSelectedRequest(request);
                onApprovalAction("reject");
              }}
              className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
            >
              <FiX className="h-4 w-4" />
              Từ chối
            </button>
          </>
        )}
      </>
    )}

    {variant === "upcoming" && onCompleteHealthCheck && (
      <button
        onClick={() => onCompleteHealthCheck(request)}
        className="px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-1"
      >
        <FiUpload className="h-4 w-4" />
        Hoàn thành
      </button>
    )}
  </div>
);

export default RequestCard;
