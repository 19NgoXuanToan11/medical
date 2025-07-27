import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiUser,
  FiBookmark,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";

const GradeNurseAssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    gradeLevel: "",
    nurseName: "",
    nurseId: "",
  });

  // Available grade levels
  const gradeLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    loadAssignments();
    loadAvailableNurses();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      // API để lấy danh sách nurse được phân công khối
      const response = await medicationService.getAvailableNurses();
      if (response.success) {
        setAssignments(response.data || []);
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
    }
    setLoading(false);
  };

  const loadAvailableNurses = async () => {
    try {
      // Giả sử có API để lấy tất cả nurses
      const response = await medicationService.getAllNurses();
      if (response.success) {
        setAvailableNurses(response.data || []);
      }
    } catch (error) {
      console.error("Error loading nurses:", error);
      // Fallback với mock data
      setAvailableNurses([
        { id: 1, name: "Nguyễn Thị A", specialization: "Đa khoa" },
        { id: 2, name: "Trần Thị B", specialization: "Nhi khoa" },
        { id: 3, name: "Lê Thị C", specialization: "Đa khoa" },
      ]);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.gradeLevel || !newAssignment.nurseId) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await medicationService.assignNurseToGrade({
        gradeLevel: parseInt(newAssignment.gradeLevel),
        nurseId: parseInt(newAssignment.nurseId),
      });

      if (response.success) {
        setShowAddForm(false);
        setNewAssignment({ gradeLevel: "", nurseName: "", nurseId: "" });
        loadAssignments();
        alert("Phân công thành công!");
      } else {
        alert(response.message || "Không thể phân công");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
      alert("Có lỗi xảy ra khi phân công");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm("Bạn có chắc muốn xóa phân công này?")) return;

    try {
      const response = await medicationService.deleteGradeNurseAssignment(
        assignmentId
      );
      if (response.success) {
        loadAssignments();
        alert("Xóa phân công thành công!");
      } else {
        alert(response.message || "Không thể xóa phân công");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Có lỗi xảy ra khi xóa phân công");
    }
  };

  const getAssignmentsByGrade = (grade) => {
    return assignments.filter(
      (assignment) =>
        assignment.gradeLevel === grade ||
        (assignment.assignedGrades && assignment.assignedGrades.includes(grade))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Quản lý phân công Nurse theo khối
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Phân công nurse phụ trách từng khối học để tự động xử lý yêu cầu
            thuốc
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          <span>Thêm phân công</span>
        </button>
      </div>

      {/* Add Assignment Form */}
      {showAddForm && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
            Thêm phân công mới
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Khối học
              </label>
              <select
                value={newAssignment.gradeLevel}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    gradeLevel: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Chọn khối</option>
                {gradeLevels.map((grade) => (
                  <option key={grade} value={grade}>
                    Khối {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nurse
              </label>
              <select
                value={newAssignment.nurseId}
                onChange={(e) => {
                  const selectedNurse = availableNurses.find(
                    (n) => n.id.toString() === e.target.value
                  );
                  setNewAssignment((prev) => ({
                    ...prev,
                    nurseId: e.target.value,
                    nurseName: selectedNurse?.name || "",
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Chọn nurse</option>
                {availableNurses.map((nurse) => (
                  <option key={nurse.id} value={nurse.id}>
                    {nurse.name} ({nurse.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FiX className="h-4 w-4" />
            </button>
            <button
              onClick={handleAddAssignment}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiSave className="h-4 w-4" />
              <span>Lưu</span>
            </button>
          </div>
        </div>
      )}

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gradeLevels.map((grade) => {
          const gradeAssignments = getAssignmentsByGrade(grade);

          return (
            <div
              key={grade}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FiBookmark className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Khối {grade}
                  </h4>
                </div>
              </div>

              {gradeAssignments.length > 0 ? (
                <div className="space-y-2">
                  {gradeAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white dark:bg-gray-600 rounded-md p-3 border border-gray-200 dark:border-gray-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiUser className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {assignment.nurseName || assignment.staffName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                      {assignment.assignedClasses && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Các lớp: {assignment.assignedClasses.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Chưa có nurse phụ trách
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có phân công nào. Nhấn "Thêm phân công" để bắt đầu.
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeNurseAssignmentManager;
