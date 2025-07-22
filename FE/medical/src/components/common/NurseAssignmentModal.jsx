import React, { useState, useEffect } from "react";
import {
  FiX,
  FiUser,
  FiUsers,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { medicationService } from "../../utils/api/medication/medicationService";

const NurseAssignmentModal = ({
  show,
  onClose,
  request,
  availableNurses = [],
  onAssignSuccess,
}) => {
  const [assignmentInfo, setAssignmentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualAssignmentAllowed, setManualAssignmentAllowed] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (show && request) {
      loadAssignmentInfo();
      checkManualAssignmentAllowed();
    }
  }, [show, request]);

  const loadAssignmentInfo = async () => {
    if (!request?.studentCode) return;

    setLoading(true);
    setError(null);

    try {
      // Get grade by student code
      const gradeResponse = await medicationService.getGradeByStudentCode(
        request.studentCode
      );

      if (gradeResponse.success && gradeResponse.data?.grade) {
        const grade = gradeResponse.data.grade;

        // Get nurse by grade
        const nurseResponse = await medicationService.getNurseByGrade(grade);

        setAssignmentInfo({
          grade,
          nurse: nurseResponse.success ? nurseResponse.data : null,
          isAutoAssigned: nurseResponse.success,
          error: nurseResponse.success
            ? null
            : "Không tìm thấy nurse phụ trách khối này",
        });
      } else {
        setError("Không thể xác định khối học của học sinh");
      }
    } catch (err) {
      setError("Lỗi khi tải thông tin phân công nurse");
      console.error("Error loading assignment info:", err);
    }

    setLoading(false);
  };

  const checkManualAssignmentAllowed = async () => {
    if (!request?.id) return;

    try {
      const response = await medicationService.checkManualAssignmentAllowed(
        request.id
      );
      setManualAssignmentAllowed(response.success && response.data);
    } catch (err) {
      console.error("Error checking manual assignment:", err);
      setManualAssignmentAllowed(false);
    }
  };

  const handleAssignNurse = async () => {
    if (!selectedNurse || !request?.medicineRequestItems?.[0]) {
      alert("Vui lòng chọn nurse để phân công");
      return;
    }

    setAssigning(true);

    try {
      const medicineRequestItemId =
        request.medicineRequestItems[0].medicineRequestItemId;
      const response = await medicationService.assignNurseToRequestItem(
        medicineRequestItemId,
        parseInt(selectedNurse),
        "sáng" // Default period, có thể customize sau
      );

      if (response.success) {
        alert("Phân công nurse thành công!");
        onAssignSuccess && onAssignSuccess();
        onClose();
      } else {
        alert(response.message || "Không thể phân công nurse");
      }
    } catch (error) {
      console.error("Error assigning nurse:", error);
      alert("Lỗi khi phân công nurse");
    }

    setAssigning(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Thông tin phân công Nurse
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
              <FiUser className="mr-2" />
              Thông tin học sinh
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p>
                <strong>Họ tên:</strong> {request?.studentName || "N/A"}
              </p>
              <p>
                <strong>Mã học sinh:</strong> {request?.studentCode || "N/A"}
              </p>
              <p>
                <strong>Lớp:</strong> {request?.className || "N/A"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">
                Đang tải thông tin phân công...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center">
                <FiAlertTriangle className="text-red-500 mr-2" />
                <span className="text-red-600 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Assignment Info */}
          {assignmentInfo && (
            <div className="space-y-4">
              {/* Grade Info */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FiUsers className="text-green-600 dark:text-green-400 mr-2" />
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Thông tin khối học
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Khối:</strong> Khối {assignmentInfo.grade}
                </p>
              </div>

              {/* Auto Assigned Nurse */}
              {assignmentInfo.nurse ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <h4 className="font-medium text-green-800 dark:text-green-200">
                      Nurse được phân công tự động
                    </h4>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <p>
                      <strong>Họ tên:</strong> {assignmentInfo.nurse.firstName}{" "}
                      {assignmentInfo.nurse.lastName}
                    </p>
                    {assignmentInfo.nurse.email && (
                      <p>
                        <strong>Email:</strong> {assignmentInfo.nurse.email}
                      </p>
                    )}
                    <p>
                      <strong>Loại phân công:</strong> Tự động theo khối
                    </p>
                  </div>

                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-800/30 rounded">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      💡 <strong>Lưu ý:</strong> Nurse này đã được tự động phân
                      công theo khối học. Hệ thống sẽ chặn phân công thủ công để
                      đảm bảo nurse chỉ quản lý 1 khối.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FiAlertTriangle className="text-yellow-500 mr-2" />
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Chưa có nurse phụ trách khối này
                    </h4>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    {assignmentInfo.error ||
                      "Khối này chưa có nurse được phân công."}
                  </p>

                  {/* Manual Assignment */}
                  {manualAssignmentAllowed && availableNurses.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Bạn có thể phân công thủ công:
                      </p>

                      <select
                        value={selectedNurse}
                        onChange={(e) => setSelectedNurse(e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">-- Chọn nurse --</option>
                        {availableNurses.map((nurse) => (
                          <option key={nurse.id} value={nurse.id}>
                            {nurse.firstName} {nurse.lastName}
                          </option>
                        ))}
                      </select>

                      <textarea
                        value={assignmentNotes}
                        onChange={(e) => setAssignmentNotes(e.target.value)}
                        placeholder="Ghi chú phân công (tùy chọn)"
                        className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows="2"
                      />

                      <button
                        onClick={handleAssignNurse}
                        disabled={!selectedNurse || assigning}
                        className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-md transition-colors flex items-center justify-center"
                      >
                        {assigning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang phân công...
                          </>
                        ) : (
                          "Phân công thủ công"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Assignment Blocked */}
              {!manualAssignmentAllowed && assignmentInfo.nurse && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FiAlertTriangle className="text-red-500 mr-2" />
                    <h4 className="font-medium text-red-800 dark:text-red-200">
                      Phân công thủ công bị chặn
                    </h4>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Không thể phân công thủ công vì đã có nurse được phân công
                    tự động theo khối. Điều này đảm bảo mỗi nurse chỉ quản lý 1
                    khối để tối ưu hóa chất lượng chăm sóc.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start">
              <FiInfo className="text-blue-500 mr-2 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Về nghiệp vụ phân công mới:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Mỗi nurse chỉ quản lý 1 khối học cố định</li>
                  <li>
                    • Hệ thống tự động phân công nurse theo khối khi tạo yêu cầu
                  </li>
                  <li>• Chặn phân công thủ công khi đã có nurse theo khối</li>
                  <li>• Đảm bảo chất lượng chăm sóc và tránh nhầm lẫn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NurseAssignmentModal;
