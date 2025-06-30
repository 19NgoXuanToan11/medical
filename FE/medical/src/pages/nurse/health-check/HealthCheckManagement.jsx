import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUsers,
  FiClock,
  FiMapPin,
  FiSettings,
  FiAlertTriangle,
  FiCheckCircle,
  FiRotateCcw,
  FiPause,
  FiPlay,
} from "react-icons/fi";

const HealthCheckManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [availableStaff, setAvailableStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    // Mock data
    const mockHealthCheck = {
      id: id,
      title: "Kiểm tra sức khỏe định kỳ học kỳ 2",
      scheduledDate: "2023-06-29",
      grade: "Lớp 3A",
      status: "in-progress",
      totalStudents: 32,
      checkedStudents: 18,
      startTime: "08:00",
      estimatedEndTime: "11:30",
      currentStation: "Đo chiều cao, cân nặng",
      abnormalFound: 2,
      description: "Kiểm tra sức khỏe định kỳ cho học sinh cuối học kỳ 2",
      location: "Phòng y tế trường",
      staffAssigned: [
        {
          id: 1,
          name: "Y tá Hương",
          role: "Trưởng nhóm",
          station: "Đo chiều cao, cân nặng",
        },
        {
          id: 2,
          name: "Y tá Mai",
          role: "Phụ trách",
          station: "Kiểm tra thị lực",
        },
      ],
      stations: [
        {
          id: "height-weight",
          name: "Đo chiều cao, cân nặng",
          status: "active",
          estimatedTime: "5 phút/học sinh",
          staffRequired: 1,
          location: "Bàn số 1",
          queue: 3,
        },
        {
          id: "vision",
          name: "Kiểm tra thị lực",
          status: "waiting",
          estimatedTime: "3 phút/học sinh",
          staffRequired: 1,
          location: "Bàn số 2",
          queue: 8,
        },
        {
          id: "general",
          name: "Khám tổng quát",
          status: "waiting",
          estimatedTime: "7 phút/học sinh",
          staffRequired: 1,
          location: "Bàn số 3",
          queue: 15,
        },
        {
          id: "dental",
          name: "Khám răng miệng",
          status: "waiting",
          estimatedTime: "4 phút/học sinh",
          staffRequired: 1,
          location: "Bàn số 4",
          queue: 20,
        },
      ],
      settings: {
        autoAdvance: true,
        notifyParents: true,
        saveResults: true,
        generateReport: true,
      },
    };

    const mockAvailableStaff = [
      { id: 3, name: "Y tá Lan", specialization: "Nhi khoa", available: true },
      {
        id: 4,
        name: "Bác sĩ Tuấn",
        specialization: "Tổng quát",
        available: true,
      },
      {
        id: 5,
        name: "Y tá Hoa",
        specialization: "Răng hàm mặt",
        available: false,
      },
    ];

    setHealthCheck(mockHealthCheck);
    setEditData({ ...mockHealthCheck });
    setAvailableStaff(mockAvailableStaff);
    setLoading(false);
  }, [id]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStationUpdate = (stationId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      stations: prev.stations.map((station) =>
        station.id === stationId ? { ...station, [field]: value } : station
      ),
    }));
  };

  const handleSave = () => {
    // In real app, this would call an API
    setHealthCheck({ ...editData });
    setEditMode(false);
    alert("Đã lưu thành công!");
  };

  const handleCancel = () => {
    setEditData({ ...healthCheck });
    setEditMode(false);
  };

  const handleAddStaff = (staff) => {
    const newStaff = {
      id: staff.id,
      name: staff.name,
      role: "Phụ trách",
      station: "Chưa phân công",
    };

    setEditData((prev) => ({
      ...prev,
      staffAssigned: [...prev.staffAssigned, newStaff],
    }));
    setShowStaffModal(false);
  };

  const handleRemoveStaff = (staffId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEditData((prev) => ({
        ...prev,
        staffAssigned: prev.staffAssigned.filter(
          (staff) => staff.id !== staffId
        ),
      }));
    }
  };

  const handlePauseResume = () => {
    const newStatus =
      healthCheck.status === "in-progress" ? "paused" : "in-progress";
    setHealthCheck((prev) => ({ ...prev, status: newStatus }));
    alert(
      newStatus === "paused"
        ? "Đã tạm dừng buổi kiểm tra"
        : "Đã tiếp tục buổi kiểm tra"
    );
  };

  const handleRestart = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn khởi động lại buổi kiểm tra? Điều này sẽ reset tất cả tiến độ hiện tại."
      )
    ) {
      setHealthCheck((prev) => ({
        ...prev,
        status: "in-progress",
        checkedStudents: 0,
        startTime: new Date()
          .toLocaleTimeString("vi-VN", { hour12: false })
          .slice(0, 5),
      }));
      alert("Đã khởi động lại buổi kiểm tra");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/nurse/health-check")}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Quản lý buổi kiểm tra - {healthCheck.grade}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {healthCheck.title} |{" "}
              {new Date(healthCheck.scheduledDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <FiEdit className="inline mr-1" />
                Chỉnh sửa
              </button>
              <Link
                to={`/nurse/health-check/${id}/live`}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Theo dõi trực tiếp
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                <FiSave className="inline mr-1" />
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                <FiX className="inline mr-1" />
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border mb-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Điều khiển buổi kiểm tra
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  healthCheck.status === "in-progress"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {healthCheck.status === "in-progress"
                  ? "Đang diễn ra"
                  : "Tạm dừng"}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tiến độ: {healthCheck.checkedStudents}/
                {healthCheck.totalStudents} học sinh
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePauseResume}
                className={`px-3 py-2 rounded-md text-white ${
                  healthCheck.status === "in-progress"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {healthCheck.status === "in-progress" ? (
                  <>
                    <FiPause className="inline mr-1" />
                    Tạm dừng
                  </>
                ) : (
                  <>
                    <FiPlay className="inline mr-1" />
                    Tiếp tục
                  </>
                )}
              </button>
              <button
                onClick={handleRestart}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <FiRotateCcw className="inline mr-1" />
                Khởi động lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Thông tin cơ bản
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiêu đề
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">
                  {healthCheck.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả
              </label>
              {editMode ? (
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">
                  {healthCheck.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thời gian bắt đầu
                </label>
                {editMode ? (
                  <input
                    type="time"
                    value={editData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {healthCheck.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dự kiến kết thúc
                </label>
                {editMode ? (
                  <input
                    type="time"
                    value={editData.estimatedEndTime}
                    onChange={(e) =>
                      handleInputChange("estimatedEndTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {healthCheck.estimatedEndTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa điểm
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">
                  {healthCheck.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Staff Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Nhân viên phụ trách
              </h3>
              {editMode && (
                <button
                  onClick={() => setShowStaffModal(true)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  <FiPlus className="inline mr-1" />
                  Thêm nhân viên
                </button>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {editData.staffAssigned.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="flex items-center">
                      <FiUsers className="mr-2 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {staff.name}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {staff.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Trạm: {staff.station}
                    </p>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stations Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border mt-8">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cấu hình trạm kiểm tra
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editData.stations.map((station) => (
              <div
                key={station.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {station.name}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      station.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {station.status === "active" ? "Hoạt động" : "Chờ"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Thời gian dự kiến:
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={station.estimatedTime}
                        onChange={(e) =>
                          handleStationUpdate(
                            station.id,
                            "estimatedTime",
                            e.target.value
                          )
                        }
                        className="text-right border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">
                        {station.estimatedTime}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Vị trí:
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={station.location}
                        onChange={(e) =>
                          handleStationUpdate(
                            station.id,
                            "location",
                            e.target.value
                          )
                        }
                        className="text-right border border-gray-300 rounded px-2 py-1 w-32"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">
                        {station.location}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Hàng đợi:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {station.queue} học sinh
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Thêm nhân viên
              </h3>
              <button
                onClick={() => setShowStaffModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {availableStaff
                .filter(
                  (staff) =>
                    !editData.staffAssigned.find(
                      (assigned) => assigned.id === staff.id
                    )
                )
                .map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {staff.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {staff.specialization}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddStaff(staff)}
                      disabled={!staff.available}
                      className={`px-3 py-1 rounded-md text-sm ${
                        staff.available
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {staff.available ? "Thêm" : "Không có sẵn"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckManagement;
