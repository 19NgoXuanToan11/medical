import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const NurseHealthCheckCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    scheduledDate: "",
    startTime: "08:00",
    estimatedDuration: "180", // minutes
    gradeIds: [],
    description: "",
    location: "Phòng y tế trường",
    notifyParents: true,
    // New fields for stations and staff
    selectedStations: [],
    staffAssigned: [],
    // Settings
    settings: {
      autoAdvance: true,
      saveResults: true,
      generateReport: true,
      requireParentConfirmation: true,
    },
  });

  const [grades, setGrades] = useState([]);
  const [availableStations, setAvailableStations] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call to get grades
    setGrades([
      { id: "1A", name: "Lớp 1A", totalStudents: 28 },
      { id: "1B", name: "Lớp 1B", totalStudents: 30 },
      { id: "2A", name: "Lớp 2A", totalStudents: 29 },
      { id: "2B", name: "Lớp 2B", totalStudents: 31 },
      { id: "3A", name: "Lớp 3A", totalStudents: 32 },
      { id: "3B", name: "Lớp 3B", totalStudents: 29 },
      { id: "3C", name: "Lớp 3C", totalStudents: 27 },
    ]);

    // Available health check stations
    setAvailableStations([
      {
        id: "height-weight",
        name: "Đo chiều cao, cân nặng",
        estimatedTime: "5",
        staffRequired: 1,
        required: true,
      },
      {
        id: "vision",
        name: "Kiểm tra thị lực",
        estimatedTime: "3",
        staffRequired: 1,
        required: true,
      },
      {
        id: "general",
        name: "Khám tổng quát",
        estimatedTime: "7",
        staffRequired: 1,
        required: true,
      },
      {
        id: "dental",
        name: "Khám răng miệng",
        estimatedTime: "4",
        staffRequired: 1,
        required: false,
      },
      {
        id: "blood-pressure",
        name: "Đo huyết áp",
        estimatedTime: "3",
        staffRequired: 1,
        required: false,
      },
      {
        id: "hearing",
        name: "Kiểm tra thính lực",
        estimatedTime: "5",
        staffRequired: 1,
        required: false,
      },
    ]);

    // Available staff
    setAvailableStaff([
      {
        id: 1,
        name: "Y tá Hương",
        specialization: "Nhi khoa",
        available: true,
      },
      { id: 2, name: "Y tá Mai", specialization: "Tổng quát", available: true },
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
    ]);

    // Set default required stations
    const requiredStations = availableStations
      .filter((station) => station.required)
      .map((station) => ({
        stationId: station.id,
        location: `Bàn số ${
          availableStations.findIndex((s) => s.id === station.id) + 1
        }`,
        staffId: null,
      }));

    setFormData((prev) => ({
      ...prev,
      selectedStations: requiredStations,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSettingsChange = (setting, value) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value,
      },
    }));
  };

  const handleGradeCheckbox = (e) => {
    const { value, checked } = e.target;
    let newGradeIds = [...formData.gradeIds];
    if (checked) {
      if (newGradeIds.length < 3) {
        newGradeIds.push(value);
      }
    } else {
      newGradeIds = newGradeIds.filter((id) => id !== value);
    }
    setFormData({ ...formData, gradeIds: newGradeIds });
  };

  const handleStationToggle = (stationId) => {
    const station = availableStations.find((s) => s.id === stationId);
    const isSelected = formData.selectedStations.some(
      (s) => s.stationId === stationId
    );

    if (station.required) return; // Cannot unselect required stations

    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        selectedStations: prev.selectedStations.filter(
          (s) => s.stationId !== stationId
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedStations: [
          ...prev.selectedStations,
          {
            stationId: stationId,
            location: `Bàn số ${prev.selectedStations.length + 1}`,
            staffId: null,
          },
        ],
      }));
    }
  };

  const handleStationUpdate = (stationId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      selectedStations: prev.selectedStations.map((station) =>
        station.stationId === stationId
          ? { ...station, [field]: value }
          : station
      ),
    }));
  };

  const calculateTotalStudents = () => {
    return formData.gradeIds.reduce((total, gradeId) => {
      const grade = grades.find((g) => g.id === gradeId);
      return total + (grade?.totalStudents || 0);
    }, 0);
  };

  const calculateEstimatedEndTime = () => {
    if (!formData.startTime || formData.selectedStations.length === 0)
      return "";

    const totalTimePerStudent = formData.selectedStations.reduce(
      (total, selectedStation) => {
        const station = availableStations.find(
          (s) => s.id === selectedStation.stationId
        );
        return total + parseInt(station?.estimatedTime || 0);
      },
      0
    );

    const totalStudents = calculateTotalStudents();
    const totalMinutes =
      (totalTimePerStudent * totalStudents) / formData.selectedStations.length;

    const [startHour, startMinute] = formData.startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(startDate.getTime() + totalMinutes * 60000);
    return endDate.toTimeString().slice(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Enhanced validation
      if (!formData.title.trim()) {
        throw new Error("Vui lòng nhập tiêu đề kiểm tra");
      }
      if (!formData.scheduledDate || formData.gradeIds.length === 0) {
        throw new Error("Vui lòng nhập đầy đủ ngày kiểm tra và chọn lớp");
      }
      if (formData.selectedStations.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một trạm kiểm tra");
      }

      // Check if all stations have assigned staff
      const unassignedStations = formData.selectedStations.filter(
        (s) => !s.staffId
      );
      if (unassignedStations.length > 0) {
        throw new Error(
          "Vui lòng phân công nhân viên cho tất cả các trạm kiểm tra"
        );
      }

      // Simulate API call
      const submitData = {
        ...formData,
        totalStudents: calculateTotalStudents(),
        estimatedEndTime: calculateEstimatedEndTime(),
      };

      console.log("Submitting health check schedule:", submitData);

      // Wait for a moment to simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to health check list
      navigate("/nurse/health-check");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lên lịch kiểm tra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Lên lịch kiểm tra y tế mới
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Tạo lịch kiểm tra sức khỏe định kỳ mới cho học sinh
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiSettings className="mr-2" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tiêu đề kiểm tra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  placeholder="VD: Kiểm tra sức khỏe định kỳ học kỳ 2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ngày kiểm tra <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                {formData.startTime && formData.selectedStations.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Dự kiến kết thúc: {calculateEstimatedEndTime()}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    placeholder="Phòng y tế trường"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Class Selection Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiUsers className="mr-2" />
              Lựa chọn lớp học
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {grades.map((grade) => (
                <label
                  key={grade.id}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${
                    formData.gradeIds.includes(grade.id)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-neutral-600 hover:border-gray-400"
                  } ${
                    !formData.gradeIds.includes(grade.id) &&
                    formData.gradeIds.length >= 3
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      value={grade.id}
                      checked={formData.gradeIds.includes(grade.id)}
                      onChange={handleGradeCheckbox}
                      disabled={
                        !formData.gradeIds.includes(grade.id) &&
                        formData.gradeIds.length >= 3
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">{grade.name}</span>
                      <p className="text-xs text-gray-500">
                        {grade.totalStudents} học sinh
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {formData.gradeIds.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                Vui lòng chọn ít nhất 1 lớp (tối đa 3 lớp)
              </p>
            )}
            {formData.gradeIds.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tổng số học sinh:</strong> {calculateTotalStudents()}{" "}
                  em
                </p>
              </div>
            )}
          </div>

          {/* Health Check Stations Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Các trạm kiểm tra
            </h3>
            <div className="space-y-4">
              {availableStations.map((station) => {
                const isSelected = formData.selectedStations.some(
                  (s) => s.stationId === station.id
                );
                const selectedStation = formData.selectedStations.find(
                  (s) => s.stationId === station.id
                );

                return (
                  <div
                    key={station.id}
                    className={`border rounded-lg p-4 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleStationToggle(station.id)}
                          disabled={station.required}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium">{station.name}</span>
                          {station.required && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Bắt buộc
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            Thời gian ước tính: {station.estimatedTime} phút/học
                            sinh
                          </p>
                        </div>
                      </label>
                    </div>

                    {isSelected && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Vị trí
                          </label>
                          <input
                            type="text"
                            value={selectedStation?.location || ""}
                            onChange={(e) =>
                              handleStationUpdate(
                                station.id,
                                "location",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm"
                            placeholder="VD: Bàn số 1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nhân viên phụ trách{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedStation?.staffId || ""}
                            onChange={(e) =>
                              handleStationUpdate(
                                station.id,
                                "staffId",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm"
                            required
                          >
                            <option value="">Chọn nhân viên</option>
                            {availableStaff
                              .filter((staff) => staff.available)
                              .map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.name} - {staff.specialization}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cài đặt kiểm tra
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifyParents"
                    name="notifyParents"
                    type="checkbox"
                    checked={formData.notifyParents}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 bg-white dark:bg-neutral-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="notifyParents"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Thông báo cho phụ huynh
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Gửi thông báo đến phụ huynh của học sinh trong lớp được chọn
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireParentConfirmation"
                    type="checkbox"
                    checked={formData.settings.requireParentConfirmation}
                    onChange={(e) =>
                      handleSettingsChange(
                        "requireParentConfirmation",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 bg-white dark:bg-neutral-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="requireParentConfirmation"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Yêu cầu xác nhận từ phụ huynh
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Phụ huynh cần xác nhận trước khi tiến hành kiểm tra
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="generateReport"
                    type="checkbox"
                    checked={formData.settings.generateReport}
                    onChange={(e) =>
                      handleSettingsChange("generateReport", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 bg-white dark:bg-neutral-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="generateReport"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Tự động tạo báo cáo
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Tạo báo cáo tổng hợp sau khi hoàn thành kiểm tra
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autoAdvance"
                    type="checkbox"
                    checked={formData.settings.autoAdvance}
                    onChange={(e) =>
                      handleSettingsChange("autoAdvance", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 bg-white dark:bg-neutral-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="autoAdvance"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Tự động chuyển trạm
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Học sinh sẽ tự động chuyển sang trạm tiếp theo sau khi hoàn
                    thành
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Nhập thông tin chi tiết về đợt kiểm tra sức khỏe, mục đích, yêu cầu đặc biệt..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/nurse/health-check")}
              className="px-6 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "Lên lịch kiểm tra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NurseHealthCheckCreate;
