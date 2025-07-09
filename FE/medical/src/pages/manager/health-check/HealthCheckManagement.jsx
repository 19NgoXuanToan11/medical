import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiBarChart,
  FiEye,
  FiCheck,
  FiX,
  FiActivity,
  FiRefreshCw,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import {
  getHealthCheckSchedules,
  updateHealthCheckSchedule,
} from "../../../utils/api/healthCheck/healthCheckService.js";

const HealthCheckManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [healthCheckPrograms, setHealthCheckPrograms] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);

  // Stats state - will be calculated from real data
  const [stats, setStats] = useState({
    totalHealthChecks: 0,
    completedToday: 0,
    scheduled: 0,
    pending: 0,
    completionRate: 0,
  });

  // Fetch health check schedules from API
  const fetchHealthCheckSchedules = async () => {
    setFetchingData(true);
    setError(null);
    try {
      const schedules = await getHealthCheckSchedules();
      console.log("Fetched schedules:", schedules);

      // Transform API data to match component structure
      const transformedRequests = schedules.map((schedule) => ({
        id: schedule.formId,
        title: schedule.title || "Khám sức khỏe định kỳ",
        requestedBy: "Y tá", // Default since API doesn't have this field yet
        requestedById: `nurse_${schedule.formId}`,
        requestDate: schedule.createdDate
          ? new Date(schedule.createdDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        scheduledDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toISOString().split("T")[0]
          : "",
        scheduledTime: schedule.startTime
          ? schedule.startTime.substring(0, 5)
          : "08:00", // Convert TimeSpan to HH:mm
        targetGrades: schedule.grades || [],
        totalStudents: schedule.totalStudents || 0,
        location: schedule.location || "Phòng y tế trường",
        estimatedDuration: schedule.estimatedDuration || 60,
        description: schedule.description || "",
        justification:
          schedule.description || "Khám sức khỏe định kỳ theo quy định",
        checkItems: schedule.selectedStations
          ? JSON.parse(schedule.selectedStations)
          : [],
        urgencyLevel:
          schedule.status === "pending_equipment_review" ? "high" : "normal",
        estimatedCost: schedule.totalStudents * 20000 || 0, // Estimate 20k per student
        equipmentNeeded: [], // Will be populated from selectedStations
        followUpRequired: schedule.requireParentConfirmation !== false,
        status: schedule.status || "pending",
        equipmentStatus: schedule.equipmentStatus || "ready",
        requiresManagerReview: schedule.requiresManagerReview || false,
        equipmentReport: schedule.equipmentReport
          ? typeof schedule.equipmentReport === "string"
            ? JSON.parse(schedule.equipmentReport)
            : schedule.equipmentReport
          : null,
        // Map for table display
        name: schedule.title || "Khám sức khỏe định kỳ",
        type: "Định kỳ",
        startDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toLocaleDateString("vi-VN")
          : "",
        endDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toLocaleDateString("vi-VN")
          : "",
        targetStudents: schedule.totalStudents || 0,
        completedStudents: 0, // Will be updated based on results
      }));

      // Filter pending requests (those that need manager approval)
      const pending = transformedRequests.filter(
        (req) =>
          req.status === "pending" ||
          req.status === "pending_equipment_review" ||
          req.status === "scheduled"
      );

      setPendingRequests(pending);
      setHealthCheckPrograms(transformedRequests); // For programs tab

      // Calculate stats
      const newStats = {
        totalHealthChecks: transformedRequests.length,
        completedToday: transformedRequests.filter(
          (req) =>
            req.status === "completed" &&
            req.scheduledDate === new Date().toISOString().split("T")[0]
        ).length,
        scheduled: transformedRequests.filter(
          (req) => req.status === "scheduled"
        ).length,
        pending: pending.length,
        completionRate:
          transformedRequests.length > 0
            ? Math.round(
                (transformedRequests.filter((req) => req.status === "completed")
                  .length /
                  transformedRequests.length) *
                  100
              )
            : 0,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching health check schedules:", error);
      setError("Không thể tải dữ liệu khám sức khỏe. " + error.message);
    } finally {
      setFetchingData(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthCheckSchedules();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchHealthCheckSchedules();
  };

  // Handle view request detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle approval action
  const handleApprovalAction = (action) => {
    setApprovalAction(action);
    setShowDetailModal(false);
    setShowApprovalModal(true);
  };

  // Handle approve/reject request
  const handleApprovalSubmit = async () => {
    setLoading(true);
    try {
      if (!selectedRequest) return;

      // Determine new status based on approval action
      const newStatus = approvalAction === "approve" ? "Approved" : "Rejected";

      // Update the schedule status via API
      const updateData = {
        ...selectedRequest,
        formId: selectedRequest.id,
        scheduledDate: new Date(
          selectedRequest.scheduledDate + "T00:00:00.000Z"
        ).toISOString(),
        startTime: selectedRequest.scheduledTime + ":00",
        gradeIds: JSON.stringify(selectedRequest.targetGrades),
        selectedStations: JSON.stringify(selectedRequest.checkItems),
        status: newStatus,
        confirmedBy: 1, // Manager ID - should be from auth context
        confirmedDate: new Date().toISOString(),
        confirmStatus: approvalAction === "approve" ? "confirmed" : "rejected",
        // Add approval notes to description
        description:
          selectedRequest.description +
          (approvalNotes ? `\n\nGhi chú phê duyệt: ${approvalNotes}` : ""),
      };

      await updateHealthCheckSchedule(selectedRequest.id, updateData);

      const actionText = approvalAction === "approve" ? "duyệt" : "từ chối";
      alert(`Yêu cầu đã được ${actionText} thành công!`);

      // Close modals and reset form
      setShowApprovalModal(false);
      setApprovalNotes("");
      setSelectedRequest(null);

      // Refresh the data
      await fetchHealthCheckSchedules();
    } catch (error) {
      console.error("Error updating health check schedule:", error);
      alert("Có lỗi xảy ra khi cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render pending requests tab
  const renderPendingRequests = () => (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Yêu cầu chờ duyệt ({pendingRequests.length})
        </h3>
        <button
          onClick={handleRefresh}
          disabled={fetchingData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw
            className={`w-4 h-4 ${fetchingData ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {fetchingData && (
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-center">
            <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {!fetchingData && (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm yêu cầu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onChange={(e) => {
                  // Filter logic here if needed
                }}
              >
                <option value="all">Tất cả yêu cầu</option>
                <option value="equipment_issues">⚠️ Có vấn đề thiết bị</option>
                <option value="equipment_ready">✅ Thiết bị sẵn sàng</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center gap-2">
                <FiFilter className="h-4 w-4" />
                Bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Priority Alert */}
      {!fetchingData &&
        pendingRequests.filter((req) => req.equipmentReport?.requiresAction)
          .length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-200 dark:bg-red-800 rounded-full">
                <FiAlertTriangle className="h-5 w-5 text-red-800 dark:text-red-200" />
              </div>
              <h4 className="text-lg font-bold text-red-800 dark:text-red-200">
                🚨 CẦN XEM XÉT NGAY - THIẾU THIẾT BỊ
              </h4>
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">
              {
                pendingRequests.filter(
                  (req) => req.equipmentReport?.requiresAction
                ).length
              }{" "}
              yêu cầu khám sức khỏe bị thiếu thiết bị cần thiết. Vui lòng xem
              xét các yêu cầu này trước khi phê duyệt.
            </p>
            <div className="text-sm text-red-600 dark:text-red-400">
              💡 <strong>Gợi ý:</strong> Có thể phê duyệt có điều kiện hoặc tạm
              hoãn để chuẩn bị thiết bị
            </div>
          </div>
        )}

      {/* Pending Requests List */}
      {!fetchingData && (
        <div className="grid grid-cols-1 gap-6">
          {pendingRequests
            .filter(
              (request) =>
                request.title
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                request.requestedBy
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            // Sort: Equipment issues first, then by date
            .sort((a, b) => {
              // Equipment issues go first
              if (
                a.equipmentReport?.requiresAction &&
                !b.equipmentReport?.requiresAction
              )
                return -1;
              if (
                !a.equipmentReport?.requiresAction &&
                b.equipmentReport?.requiresAction
              )
                return 1;
              // Then sort by date (newest first)
              return new Date(b.requestDate) - new Date(a.requestDate);
            })
            .map((request) => (
              <div
                key={request.id}
                className={`rounded-lg shadow border overflow-hidden ${
                  request.equipmentReport?.requiresAction
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 border-2"
                    : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
                }`}
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
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <FiActivity className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Yêu cầu bởi: {request.requestedBy} •{" "}
                            {new Date(request.requestDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        Chờ duyệt
                      </span>
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
                  {request.equipmentReport &&
                    request.equipmentReport.requiresAction && (
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
                                {request.equipmentReport.summary}
                              </p>
                            </div>

                            {/* Missing Equipment - Enhanced Display */}
                            {request.equipmentReport.hasUnavailable && (
                              <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <FiX className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  <p className="text-sm font-bold text-red-800 dark:text-red-200">
                                    🚫 THIẾT BỊ KHÔNG CÓ (
                                    {request.equipmentReport
                                      .unavailableEquipment?.length || 0}{" "}
                                    món)
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {request.equipmentReport.unavailableEquipment?.map(
                                    (eq, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 p-2 bg-red-200 dark:bg-red-800 rounded text-sm"
                                      >
                                        <FiX className="h-3 w-3 text-red-700 dark:text-red-300" />
                                        <span className="text-red-800 dark:text-red-200 font-medium">
                                          {eq.name}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Out of Stock Equipment - Enhanced Display */}
                            {request.equipmentReport.hasOutOfStock && (
                              <div className="mb-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <FiAlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  <p className="text-sm font-bold text-orange-800 dark:text-orange-200">
                                    📦 THIẾT BỊ HẾT HÀNG (
                                    {request.equipmentReport.outOfStockEquipment
                                      ?.length || 0}{" "}
                                    món)
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {request.equipmentReport.outOfStockEquipment?.map(
                                    (eq, idx) => (
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
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Action Required */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                              <div className="flex items-start gap-2">
                                <FiInfo className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-1">
                                    🔧 Hành động được đề xuất:
                                  </p>
                                  <p className="text-sm text-blue-700 dark:text-blue-300">
                                    {request.equipmentReport.actionRequired}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Equipment Ready Display */}
                  {request.equipmentReport &&
                    !request.equipmentReport.requiresAction && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            ✅ Thiết bị đầy đủ và sẵn sàng
                          </span>
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ngày thực hiện
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(request.scheduledDate).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        • {request.scheduledTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Đối tượng
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {request.targetGrades.join(", ")} (
                        {request.totalStudents} học sinh)
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
                          className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Mô tả
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {request.description}
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleViewDetail(request)}
                      className="px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                    >
                      <FiEye className="h-4 w-4" />
                      Xem chi tiết
                    </button>
                    {/* Conditional Approval Buttons based on Equipment Status */}
                    {request.equipmentReport &&
                    request.equipmentReport.requiresAction ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            handleApprovalAction("approve");
                          }}
                          className="px-3 py-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 border border-yellow-200 dark:border-yellow-600 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-1"
                        >
                          <FiCheck className="h-4 w-4" />
                          Duyệt có điều kiện
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            handleApprovalAction("reject");
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
                            handleApprovalAction("approve");
                          }}
                          className="px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-1"
                        >
                          <FiCheck className="h-4 w-4" />
                          Duyệt
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            handleApprovalAction("reject");
                          }}
                          className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                        >
                          <FiX className="h-4 w-4" />
                          Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {pendingRequests.length === 0 && !error && (
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
              <FiActivity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Không có yêu cầu chờ duyệt
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tất cả yêu cầu kiểm tra sức khỏe đã được xử lý
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tổng quan khám sức khỏe
        </h3>
        <button
          onClick={handleRefresh}
          disabled={fetchingData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw
            className={`w-4 h-4 ${fetchingData ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng lượt khám
              </p>
              <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                {stats.totalHealthChecks}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiHeart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hoàn thành hôm nay
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completedToday}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã lên lịch
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.scheduled}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ duyệt
              </p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.completionRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiBarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Programs Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Chương trình khám gần đây
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
                  <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Tên chương trình
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Loại
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Ngày thực hiện
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Học sinh
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {healthCheckPrograms.slice(0, 5).map((program) => (
                  <tr
                    key={program.id}
                    className="border-b border-gray-100 dark:border-neutral-700"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {program.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {program.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {program.startDate}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {program.targetStudents}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          program.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : program.status === "scheduled"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {program.status === "completed"
                          ? "Hoàn thành"
                          : program.status === "scheduled"
                          ? "Đã lên lịch"
                          : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleViewDetail(program)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Equipment Alerts Section */}
      {pendingRequests.filter((req) => req.equipmentReport?.requiresAction)
        .length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-200 dark:bg-yellow-800 rounded-full">
                <FiAlertTriangle className="h-5 w-5 text-yellow-800 dark:text-yellow-200" />
              </div>
              <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                ⚠️ CẢNH BÁO THIẾT BỊ (
                {
                  pendingRequests.filter(
                    (req) => req.equipmentReport?.requiresAction
                  ).length
                }{" "}
                yêu cầu)
              </h4>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Các yêu cầu sau đây có vấn đề về thiết bị cần được xem xét trước
              khi phê duyệt:
            </p>
            <div className="space-y-3">
              {pendingRequests
                .filter((req) => req.equipmentReport?.requiresAction)
                .map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-yellow-200 dark:border-yellow-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {request.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          📅{" "}
                          {new Date(request.scheduledDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          • 👥 {request.totalStudents} học sinh
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          <strong>Vấn đề:</strong>{" "}
                          {request.equipmentReport.summary}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs">
                          {request.equipmentReport.hasUnavailable && (
                            <span className="text-red-600 dark:text-red-400">
                              🚫{" "}
                              {request.equipmentReport.unavailableEquipment
                                ?.length || 0}{" "}
                              thiết bị không có
                            </span>
                          )}
                          {request.equipmentReport.hasOutOfStock && (
                            <span className="text-orange-600 dark:text-orange-400">
                              📦{" "}
                              {request.equipmentReport.outOfStockEquipment
                                ?.length || 0}{" "}
                              thiết bị hết hàng
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetail(request)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setActiveTab("pending");
                          }}
                          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                        >
                          Xử lý
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Xét duyệt khám sức khỏe
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Xem xét và phê duyệt các yêu cầu khám sức khỏe từ y tá - Đặc
                biệt chú ý tình trạng thiết bị
              </p>
            </div>
            {/* Equipment Summary Alert */}
            <div className="flex flex-col items-end gap-2">
              {pendingRequests.filter(
                (req) => req.equipmentReport?.requiresAction
              ).length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                  <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {
                      pendingRequests.filter(
                        (req) => req.equipmentReport?.requiresAction
                      ).length
                    }{" "}
                    yêu cầu thiếu thiết bị
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {pendingRequests.length} yêu cầu chờ xét duyệt
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-neutral-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiBarChart className="inline-block w-4 h-4 mr-2" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiClock className="inline-block w-4 h-4 mr-2" />
              Chờ duyệt ({pendingRequests.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "pending" && renderPendingRequests()}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Chi tiết yêu cầu khám sức khỏe
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Equipment Status - Priority Section */}
                {selectedRequest.equipmentReport &&
                  selectedRequest.equipmentReport.requiresAction && (
                    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-full">
                          <FiAlertTriangle className="h-6 w-6 text-yellow-800 dark:text-yellow-200" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">
                            ⚠️ CẢNH BÁO THIẾT BỊ
                          </h4>
                          <p className="text-yellow-700 dark:text-yellow-300 mb-4 font-medium">
                            {selectedRequest.equipmentReport.summary}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Missing Equipment */}
                            {selectedRequest.equipmentReport.hasUnavailable && (
                              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                                  <span className="text-lg">🚫</span>
                                  Thiết bị không có sẵn (
                                  {selectedRequest.equipmentReport
                                    .unavailableEquipment?.length || 0}
                                  )
                                </h5>
                                <div className="space-y-2">
                                  {selectedRequest.equipmentReport.unavailableEquipment?.map(
                                    (eq, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded"
                                      >
                                        <span className="text-red-800 dark:text-red-200 font-medium">
                                          {eq.name}
                                        </span>
                                        <span className="text-xs text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
                                          Cần mua
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Out of Stock Equipment */}
                            {selectedRequest.equipmentReport.hasOutOfStock && (
                              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                                  <span className="text-lg">📦</span>
                                  Thiết bị hết hàng (
                                  {selectedRequest.equipmentReport
                                    .outOfStockEquipment?.length || 0}
                                  )
                                </h5>
                                <div className="space-y-2">
                                  {selectedRequest.equipmentReport.outOfStockEquipment?.map(
                                    (eq, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded"
                                      >
                                        <span className="text-orange-800 dark:text-orange-200 font-medium">
                                          {eq.name}
                                        </span>
                                        <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">
                                          Còn {eq.stock}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                              🔧 Hành động cần thiết:
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                              {selectedRequest.equipmentReport.actionRequired}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Equipment Status - Ready */}
                {selectedRequest.equipmentStatus === "ready" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <FiCheck className="h-5 w-5 text-green-800 dark:text-green-200" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">
                          ✅ Thiết bị sẵn sàng
                        </h4>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Tất cả thiết bị cần thiết đã có sẵn và đủ số lượng
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tiêu đề
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedRequest.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Người yêu cầu
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedRequest.requestedBy}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày thực hiện
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(
                        selectedRequest.scheduledDate
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thời gian
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedRequest.scheduledTime}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Địa điểm
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedRequest.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lớp học
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedRequest.targetGrades.join(", ")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số học sinh
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedRequest.totalStudents} học sinh
                    </p>
                  </div>
                </div>

                {/* Check Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hạng mục khám
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.checkItems.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả chi tiết
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  {selectedRequest?.equipmentReport?.requiresAction ? (
                    <>
                      <button
                        onClick={() => handleApprovalAction("approve")}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <FiCheck className="h-5 w-5" />
                        Phê duyệt có điều kiện
                      </button>
                      <button
                        onClick={() => handleApprovalAction("reject")}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <FiX className="h-5 w-5" />
                        Tạm hoãn
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprovalAction("approve")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <FiCheck className="h-5 w-5" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleApprovalAction("reject")}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <FiX className="h-5 w-5" />
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {approvalAction === "approve"
                  ? selectedRequest?.equipmentReport?.requiresAction
                    ? "Phê duyệt có điều kiện"
                    : "Phê duyệt yêu cầu"
                  : selectedRequest?.equipmentReport?.requiresAction
                  ? "Tạm hoãn do thiết bị"
                  : "Từ chối yêu cầu"}
              </h3>

              {/* Contextual Information */}
              {selectedRequest?.equipmentReport?.requiresAction && (
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
                          💡 Phê duyệt có điều kiện có nghĩa là yêu cầu được
                          chấp nhận nhưng cần giải quyết vấn đề thiết bị trước
                          khi thực hiện.
                        </p>
                      )}
                      {approvalAction === "reject" && (
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 font-medium">
                          ⏸️ Tạm hoãn để có thời gian chuẩn bị thiết bị cần
                          thiết.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Decision Summary */}
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {approvalAction === "approve"
                    ? selectedRequest?.equipmentReport?.requiresAction
                      ? "Ghi chú về điều kiện phê duyệt"
                      : "Ghi chú phê duyệt (tùy chọn)"
                    : selectedRequest?.equipmentReport?.requiresAction
                    ? "Ghi chú về kế hoạch chuẩn bị thiết bị"
                    : "Lý do từ chối"}
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  placeholder={
                    approvalAction === "approve"
                      ? selectedRequest?.equipmentReport?.requiresAction
                        ? "Ví dụ: Phê duyệt với điều kiện chuẩn bị đầy đủ thiết bị theo danh sách. Vui lòng liên hệ phòng kỹ thuật để mua sắm/bổ sung thiết bị còn thiếu..."
                        : "Ví dụ: Yêu cầu hợp lý, phê duyệt thực hiện theo đúng kế hoạch..."
                      : selectedRequest?.equipmentReport?.requiresAction
                      ? "Ví dụ: Tạm hoãn 1-2 tuần để chuẩn bị thiết bị. Dự kiến thực hiện sau khi có đầy đủ thiết bị cần thiết..."
                      : "Ví dụ: Không phù hợp với kế hoạch hiện tại, đề nghị lên lại lịch..."
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleApprovalSubmit}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 font-medium ${
                    approvalAction === "approve"
                      ? selectedRequest?.equipmentReport?.requiresAction
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50`}
                >
                  {loading && <FiRefreshCw className="h-4 w-4 animate-spin" />}
                  {approvalAction === "approve"
                    ? selectedRequest?.equipmentReport?.requiresAction
                      ? "Phê duyệt có điều kiện"
                      : "Phê duyệt"
                    : selectedRequest?.equipmentReport?.requiresAction
                    ? "Tạm hoãn"
                    : "Từ chối"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckManagement;
