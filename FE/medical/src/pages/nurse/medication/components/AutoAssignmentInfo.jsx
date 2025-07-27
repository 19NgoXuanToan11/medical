import React, { useState, useEffect } from "react";
import { FiInfo, FiUser, FiBookmark } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";

const AutoAssignmentInfo = ({ requestId }) => {
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadAssignmentInfo();
    }
  }, [requestId]);

  const loadAssignmentInfo = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getAutoAssignmentInfo(requestId);
      if (response.success) {
        setAssignmentInfo(response.data);
      }
    } catch (error) {
      console.error("Error loading auto assignment info:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!assignmentInfo) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-medium text-blue-800 dark:text-blue-300">
            Thông tin phân công tự động
          </h4>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <FiBookmark className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Khối học:</strong> {assignmentInfo.gradeLevel || "N/A"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FiUser className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Nurse phụ trách:</strong>{" "}
            {assignmentInfo.assignedNurseName || "Chưa phân công"}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Lý do phân công:</strong>
              {assignmentInfo.autoAssignmentReason ||
                "Tự động phân công theo khối học"}
            </p>
            <p>
              <strong>Thời gian phân công:</strong>
              {assignmentInfo.assignedDate
                ? new Date(assignmentInfo.assignedDate).toLocaleString("vi-VN")
                : "N/A"}
            </p>
            {assignmentInfo.manualAssignmentAllowed === false && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded p-2 mt-2">
                <p className="text-yellow-800 dark:text-yellow-300 text-xs">
                  ⚠️ Không cho phép phân công thủ công vì đã có nurse theo khối
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoAssignmentInfo;
