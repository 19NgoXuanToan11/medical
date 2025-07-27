import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiUsers,
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { staffService } from "../../utils/staff/staffService";

const NurseAssignmentInfo = ({ studentCode, requestId, className }) => {
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentCode) {
      loadAssignmentInfo();
    }
  }, [studentCode, requestId]);

  const extractGradeFromClassName = (className) => {
    if (!className) return null;

    // Extract grade from class name like "1A", "2B", "3C", etc.
    const match = className.match(/^(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const loadAssignmentInfo = async () => {
    setLoading(true);
    setError(null);

    const fallbackGrade = extractGradeFromClassName(className);

    try {
      // Use staff API to get nurse by grade
      const nurseResponse = await staffService.getNursesByGrade(fallbackGrade);

      if (
        nurseResponse.success &&
        nurseResponse.data &&
        nurseResponse.data.length > 0
      ) {
        const nurseAssignment = nurseResponse.data[0];
        setAssignmentInfo({
          grade: fallbackGrade,
          nurse: nurseAssignment.nurse,
          nurseAssignments: nurseResponse.data,
          isAutoAssigned: true,
          assignmentType: "auto",
        });
      } else {
        setAssignmentInfo({
          grade: fallbackGrade,
          nurse: null,
          isAutoAssigned: false,
          assignmentType: "manual",
          error: "Không tìm thấy nurse phụ trách khối này",
        });
      }
    } catch (err) {
      if (fallbackGrade) {
        setAssignmentInfo({
          grade: fallbackGrade,
          nurse: null,
          isAutoAssigned: false,
          assignmentType: "manual",
          error: "API không khả dụng, sử dụng thông tin từ tên lớp",
          fallback: true,
        });
      } else {
        const errorMsg = "Lỗi khi tải thông tin phân công nurse";
        setError(errorMsg);
        console.error("❌ Error loading assignment info:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Đang tải thông tin phân công...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <FiAlertTriangle className="text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (!assignmentInfo) {
    return null;
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
      <div className="space-y-3">
        {/* Grade Info */}
        <div className="flex items-center space-x-3">
          <FiUsers className="text-green-600 dark:text-green-400" />
          <div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Khối:
            </span>
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">
              {assignmentInfo.grade}
            </span>
          </div>
        </div>

        {/* Nurse Info */}
        {assignmentInfo.nurse ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <FiUser className="text-green-600 dark:text-green-400" />
              <div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Nurse phụ trách:
                </span>
                <span className="text-sm text-green-600 dark:text-green-400 ml-1">
                  {assignmentInfo.nurse.firstName}{" "}
                  {assignmentInfo.nurse.lastName}
                </span>
              </div>
            </div>

            {/* Display additional nurse info if available */}
            {assignmentInfo.nurse.email && (
              <div className="flex items-center space-x-3 ml-6">
                <span className="text-xs text-green-600 dark:text-green-400">
                  📧 {assignmentInfo.nurse.email}
                </span>
              </div>
            )}

            {assignmentInfo.nurse.phone && (
              <div className="flex items-center space-x-3 ml-6">
                <span className="text-xs text-green-600 dark:text-green-400">
                  📞 {assignmentInfo.nurse.phone}
                </span>
              </div>
            )}

            {/* Show if there are multiple nurses for this grade */}
            {assignmentInfo.nurseAssignments &&
              assignmentInfo.nurseAssignments.length > 1 && (
                <div className="flex items-center space-x-3 ml-6">
                  <FiInfo className="text-blue-500 text-xs" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    +{assignmentInfo.nurseAssignments.length - 1} nurse khác
                    cũng phụ trách khối này
                  </span>
                </div>
              )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <FiAlertTriangle className="text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              {assignmentInfo.error ||
                "Chưa có nurse được phân công cho khối này"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseAssignmentInfo;
