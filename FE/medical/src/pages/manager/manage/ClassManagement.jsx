import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiSearch,
  FiEye,
  FiAlertTriangle,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiHeart,
} from "react-icons/fi";
import {
  getActiveClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
} from "../../../utils/api/class/classService";
import { getHealthCheckFormsByStatus } from "../../../utils/api/healthCheck/healthCheckService";

const ClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [healthStatuses, setHealthStatuses] = useState({});
  const [newClass, setNewClass] = useState({
    className: "",
    gradeLevel: "",
    section: "",
    maxStudents: 30,
    classTeacher: "",
    classRoom: "",
    description: "",
  });

  // Fetch classes data and health information
  useEffect(() => {
    fetchClasses();
    fetchHealthStatuses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getActiveClasses();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch health status information for all classes
  const fetchHealthStatuses = async () => {
    try {
      const classes = await getActiveClasses();
      const statusPromises = classes.map(async (classItem) => {
        try {
          const students = await getClassStudents(classItem.classId);

          // Mock data for demonstration - replace with actual API calls
          const pendingHealthChecks = Math.floor(Math.random() * 5);
          const poorHealthHistory = Math.floor(Math.random() * 3);
          const recentHealthIssues = Math.floor(Math.random() * 2);

          return {
            classId: classItem.classId,
            pendingHealthChecks,
            poorHealthHistory,
            recentHealthIssues,
            totalStudents:
              students?.length || classItem.currentStudentCount || 0,
            lastHealthCheckDate: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("vi-VN"),
          };
        } catch (error) {
          console.error(
            `Error fetching health status for class ${classItem.classId}:`,
            error
          );
          return {
            classId: classItem.classId,
            pendingHealthChecks: 0,
            poorHealthHistory: 0,
            recentHealthIssues: 0,
            totalStudents: classItem.currentStudentCount || 0,
            lastHealthCheckDate: "Chưa có dữ liệu",
          };
        }
      });

      const results = await Promise.all(statusPromises);
      const statusMap = {};
      results.forEach((result) => {
        statusMap[result.classId] = result;
      });
      setHealthStatuses(statusMap);
    } catch (error) {
      console.error("Error fetching health statuses:", error);
    }
  };

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.gradeLevel.toString().includes(searchTerm) ||
      (classItem.section &&
        classItem.section.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClass = async () => {
    if (newClass.className && newClass.gradeLevel) {
      try {
        await createClass(newClass);
        await fetchClasses();
        await fetchHealthStatuses();
        setNewClass({
          className: "",
          gradeLevel: "",
          section: "",
          maxStudents: 30,
          classTeacher: "",
          classRoom: "",
          description: "",
        });
        setShowAddModal(false);
      } catch (error) {
        console.error("Error creating class:", error);
        alert("Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.");
      }
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setNewClass({
      className: classItem.className,
      gradeLevel: classItem.gradeLevel,
      section: classItem.section || "",
      maxStudents: classItem.maxStudents || 30,
      classTeacher: classItem.classTeacher || "",
      classRoom: classItem.classRoom || "",
      description: classItem.description || "",
    });
    setShowAddModal(true);
  };

  const handleUpdateClass = async () => {
    try {
      await updateClass(editingClass.classId, newClass);
      await fetchClasses();
      await fetchHealthStatuses();
      setEditingClass(null);
      setNewClass({
        className: "",
        gradeLevel: "",
        section: "",
        maxStudents: 30,
        classTeacher: "",
        classRoom: "",
        description: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Có lỗi xảy ra khi cập nhật lớp học. Vui lòng thử lại.");
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp này?")) {
      try {
        await deleteClass(id);
        await fetchClasses();
        await fetchHealthStatuses();
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Có lỗi xảy ra khi xóa lớp học. Vui lòng thử lại.");
      }
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
    setNewClass({
      className: "",
      gradeLevel: "",
      section: "",
      maxStudents: 30,
      classTeacher: "",
      classRoom: "",
      description: "",
    });
  };

  const getHealthStatusColor = (classId) => {
    const status = healthStatuses[classId];
    if (!status) return "bg-gray-100 dark:bg-gray-800";

    if (status.recentHealthIssues > 0 || status.poorHealthHistory > 2) {
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    } else if (status.pendingHealthChecks > 3) {
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    } else {
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    }
  };

  const getHealthStatusIcon = (classId) => {
    const status = healthStatuses[classId];
    if (!status)
      return (
        <FiActivity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      );

    if (status.recentHealthIssues > 0 || status.poorHealthHistory > 2) {
      return (
        <FiAlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
      );
    } else if (status.pendingHealthChecks > 3) {
      return (
        <FiClock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      );
    } else {
      return (
        <FiCheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quản lý lớp học
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Quản lý thông tin các lớp học và theo dõi tình hình sức khỏe học sinh
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="mr-2" />
          Thêm lớp
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => {
          const healthStatus = healthStatuses[classItem.classId];
          return (
            <div
              key={classItem.classId}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${getHealthStatusColor(
                classItem.classId
              )}`}
              onClick={() =>
                navigate(`/manager/class-management/${classItem.classId}`)
              }
            >
              {/* Class Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {classItem.className}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Khối {classItem.gradeLevel} •{" "}
                      {classItem.classTeacher || "Chưa có GVCN"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getHealthStatusIcon(classItem.classId)}
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/manager/class-management/${classItem.classId}`
                          );
                        }}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Xem chi tiết"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClass(classItem);
                        }}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(classItem.classId);
                        }}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Xóa"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student Count */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <FiUsers className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {classItem.currentStudentCount || 0} học sinh
                  </span>
                  {classItem.classRoom && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-sm">{classItem.classRoom}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Health Status */}
              {healthStatus && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FiHeart className="w-4 h-4 mr-1" />
                      Tình hình sức khỏe
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Cập nhật: {healthStatus.lastHealthCheckDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        {healthStatus.pendingHealthChecks}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Cần khám
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {healthStatus.poorHealthHistory}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Cần chú ý
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-lg p-2">
                      <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                        {healthStatus.recentHealthIssues}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Vấn đề gần đây
                      </div>
                    </div>
                  </div>

                  {(healthStatus.pendingHealthChecks > 3 ||
                    healthStatus.poorHealthHistory > 2 ||
                    healthStatus.recentHealthIssues > 0) && (
                    <div className="mt-3 p-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg">
                      <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                        <span className="font-medium">Khuyến nghị:</span> Cần
                        theo dõi sát sao tình hình sức khỏe học sinh
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* View Details Arrow */}
              <div className="px-4 pb-4">
                <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                  Xem chi tiết →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingClass ? "Chỉnh sửa lớp" : "Thêm lớp mới"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên lớp
                </label>
                <input
                  type="text"
                  value={newClass.className}
                  onChange={(e) =>
                    setNewClass({ ...newClass, className: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: Lớp 1A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Khối
                </label>
                <select
                  value={newClass.gradeLevel}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      gradeLevel: parseInt(e.target.value) || "",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Chọn khối</option>
                  <option value="1">Khối 1</option>
                  <option value="2">Khối 2</option>
                  <option value="3">Khối 3</option>
                  <option value="4">Khối 4</option>
                  <option value="5">Khối 5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lớp
                </label>
                <input
                  type="text"
                  value={newClass.section}
                  onChange={(e) =>
                    setNewClass({ ...newClass, section: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: A, B, C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sĩ số tối đa
                </label>
                <input
                  type="number"
                  value={newClass.maxStudents}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      maxStudents: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <input
                  type="text"
                  value={newClass.classTeacher}
                  onChange={(e) =>
                    setNewClass({ ...newClass, classTeacher: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Tên giáo viên chủ nhiệm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phòng học
                </label>
                <input
                  type="text"
                  value={newClass.classRoom}
                  onChange={(e) =>
                    setNewClass({ ...newClass, classRoom: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: Phòng 101"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={editingClass ? handleUpdateClass : handleAddClass}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingClass ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
