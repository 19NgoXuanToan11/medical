import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiBookOpen,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { staffService } from "../../../utils/staff/staffService";

const NurseGradeManagement = () => {
  // States for data
  const [nurses, setNurses] = useState([]);
  const [gradeNurses, setGradeNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");

  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Toast notifications
  const [notification, setNotification] = useState(null);

  // Grade levels
  const GRADE_LEVELS = [
    { id: 1, name: "Khối 1", color: "bg-blue-100 text-blue-800" },
    { id: 2, name: "Khối 2", color: "bg-green-100 text-green-800" },
    { id: 3, name: "Khối 3", color: "bg-yellow-100 text-yellow-800" },
    { id: 4, name: "Khối 4", color: "bg-purple-100 text-purple-800" },
    { id: 5, name: "Khối 5", color: "bg-red-100 text-red-800" },
  ];

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch nurses (role ID 3)
      const staffResult = await staffService.getAllStaff();
      if (staffResult.success) {
        const nursesOnly = staffResult.data.filter(
          (staff) => staff.roleId === 3
        );
        setNurses(nursesOnly);
      }

      // Fetch grade-nurse assignments
      const gradeNurseResult = await staffService.getAllGradeNurses();
      if (gradeNurseResult.success) {
        setGradeNurses(gradeNurseResult.data);
      }

      showNotification("Tải dữ liệu thành công", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Có lỗi xảy ra khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle assign nurse to grade
  const handleAssignNurse = async () => {
    if (!selectedNurse || !selectedGrade) {
      showNotification("Vui lòng chọn y tá và khối lớp", "error");
      return;
    }

    // Check if assignment already exists
    const existingAssignment = gradeNurses.find(
      (gn) =>
        gn.staffId === parseInt(selectedNurse) &&
        gn.grade === parseInt(selectedGrade)
    );

    if (existingAssignment) {
      showNotification("Y tá này đã được phân công cho khối lớp này", "error");
      return;
    }

    try {
      setSubmitting(true);

      const result = await staffService.createGradeNurseAssignment(
        selectedNurse,
        selectedGrade
      );

      if (result.success) {
        setGradeNurses((prev) => [...prev, result.data]);
        setShowAssignModal(false);
        setSelectedNurse("");
        setSelectedGrade("");
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error assigning nurse:", error);
      showNotification("Có lỗi xảy ra khi phân công y tá", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle remove assignment
  const handleRemoveAssignment = async (gradeNurseId, nurseName, gradeName) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn hủy phân công ${nurseName} khỏi ${gradeName}?`
      )
    ) {
      return;
    }

    try {
      const result = await staffService.deleteGradeNurseAssignment(
        gradeNurseId
      );

      if (result.success) {
        setGradeNurses((prev) =>
          prev.filter((gn) => gn.gradeNurseId !== gradeNurseId)
        );
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
      showNotification("Có lỗi xảy ra khi hủy phân công", "error");
    }
  };

  // Filter and search logic
  const filteredAssignments = gradeNurses.filter((assignment) => {
    const nurse = assignment.nurse;
    const matchesSearch =
      searchTerm === "" ||
      (nurse &&
        (`${nurse.firstName} ${nurse.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          nurse.email.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesGrade =
      filterGrade === "all" || assignment.grade === parseInt(filterGrade);

    return matchesSearch && matchesGrade;
  });

  // Group assignments by grade
  const assignmentsByGrade = GRADE_LEVELS.map((grade) => ({
    ...grade,
    assignments: filteredAssignments.filter(
      (assignment) => assignment.grade === grade.id
    ),
  }));

  // Get unassigned nurses for a specific grade
  const getUnassignedNurses = (gradeId) => {
    const assignedNurseIds = gradeNurses
      .filter((gn) => gn.grade === gradeId)
      .map((gn) => gn.staffId);

    return nurses.filter((nurse) => !assignedNurseIds.includes(nurse.staffId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Quản lý phân công Y tá theo Khối lớp
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý việc phân công y tá phụ trách các khối lớp từ 1 đến 5
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Làm mới
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus />
              Phân công Y tá
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email y tá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả khối lớp</option>
            {GRADE_LEVELS.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {nurses.length}
            </div>
            <div className="text-sm text-gray-600">Tổng số Y tá</div>
          </div>
          {GRADE_LEVELS.map((grade) => {
            const assignmentCount = gradeNurses.filter(
              (gn) => gn.grade === grade.id
            ).length;
            return (
              <div key={grade.id} className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-gray-900">
                  {assignmentCount}
                </div>
                <div className="text-sm text-gray-600">{grade.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Cards by Grade */}
      <div className="space-y-6">
        {assignmentsByGrade.map((grade) => (
          <div key={grade.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {grade.name}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${grade.color}`}
                  >
                    {grade.assignments.length} y tá được phân công
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {grade.assignments.length === 0 ? (
                <div className="text-center py-8">
                  <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Chưa có y tá nào được phân công cho khối này
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grade.assignments.map((assignment) => (
                    <div
                      key={assignment.gradeNurseId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {assignment.nurse
                              ? `${assignment.nurse.firstName} ${assignment.nurse.lastName}`
                              : "Không xác định"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {assignment.nurse?.email || "Không có email"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {assignment.nurse?.staffId || "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveAssignment(
                              assignment.gradeNurseId,
                              assignment.nurse
                                ? `${assignment.nurse.firstName} ${assignment.nurse.lastName}`
                                : "Không xác định",
                              grade.name
                            )
                          }
                          className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Hủy phân công"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Phân công Y tá</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedNurse("");
                  setSelectedGrade("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Y tá
                </label>
                <select
                  value={selectedNurse}
                  onChange={(e) => setSelectedNurse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn y tá --</option>
                  {nurses.map((nurse) => (
                    <option key={nurse.staffId} value={nurse.staffId}>
                      {nurse.firstName} {nurse.lastName} ({nurse.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Khối lớp
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn khối lớp --</option>
                  {GRADE_LEVELS.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedNurse("");
                  setSelectedGrade("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignNurse}
                disabled={submitting || !selectedNurse || !selectedGrade}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Phân công
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <FiCheck />
            ) : notification.type === "error" ? (
              <FiX />
            ) : (
              <FiAlertCircle />
            )}
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseGradeManagement;
