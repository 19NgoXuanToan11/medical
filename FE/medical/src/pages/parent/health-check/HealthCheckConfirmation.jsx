import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaTimes } from "react-icons/fa";
import appointmentService from "../../../utils/api/appointment/appointmentService";
import { medicationService } from "../../../utils/api/medication/medicationService";

const HealthCheckConfirmation = ({ initialTab = "pending" }) => {
  const [loading, setLoading] = useState(true);
  const [pendingChecks, setPendingChecks] = useState([]);
  const [confirmedChecks, setConfirmedChecks] = useState([]);
  const [completedChecks, setCompletedChecks] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [availableNurses, setAvailableNurses] = useState([]);

  // Modal state
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    studentId: 0,
    parentId: 0,
    staffId: 0,
    appointmentDate: "",
    appointmentType: "",
    reason: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch available nurses from API
  const fetchAvailableNurses = async () => {
    try {
      const result = await medicationService.getAvailableNurses();
      if (result.success) {
        setAvailableNurses(result.data);
      } else {
        console.error("Failed to fetch nurses:", result.message);
      }
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  // Mock data - would be replaced by API calls
  useEffect(() => {
    // Fetch available nurses
    fetchAvailableNurses();

    // Simulate API call to fetch health checks for parent's children
    setTimeout(() => {
      setPendingChecks([
        {
          id: 1,
          childName: "Nguyễn Minh Anh",
          grade: "Lớp 1A",
          scheduledDate: "2023-06-15",
          status: "pending",
        },
      ]);

      setConfirmedChecks([
        {
          id: 2,
          childName: "Nguyễn Minh Bảo",
          grade: "Lớp 2B",
          scheduledDate: "2023-06-22",
          status: "confirmed",
        },
      ]);

      setCompletedChecks([
        {
          id: 3,
          childName: "Nguyễn Minh Anh",
          grade: "Lớp 1A",
          checkDate: "2023-05-10",
          status: "completed",
          hasAbnormality: true,
          appointmentDate: "2023-05-20",
        },
        {
          id: 4,
          childName: "Nguyễn Minh Bảo",
          grade: "Lớp 2B",
          checkDate: "2023-05-10",
          status: "completed",
          hasAbnormality: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const confirmHealthCheck = (checkId) => {
    // In a real app, this would send a confirmation to the backend
    console.log(`Confirming health check ${checkId}`);

    // Update local state to reflect the change
    const checkToMove = pendingChecks.find((check) => check.id === checkId);
    if (checkToMove) {
      checkToMove.status = "confirmed";
      setConfirmedChecks([...confirmedChecks, checkToMove]);
      setPendingChecks(pendingChecks.filter((check) => check.id !== checkId));
    }
  };

  // Handle appointment modal
  const openAppointmentModal = (student) => {
    setSelectedStudent(student);
    setAppointmentForm({
      studentId: student.id,
      parentId: 1, // This should be retrieved from context/auth
      staffId: 0, // To be selected by parent
      appointmentDate: "",
      appointmentType: "",
      reason:
        "Tái khám và theo dõi sức khỏe sau khi kiểm tra y tế định kỳ tại trường phát hiện dấu hiệu bất thường cần được chú ý",
      notes: "",
    });
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedStudent(null);
    setAppointmentForm({
      studentId: 0,
      parentId: 0,
      staffId: 0,
      appointmentDate: "",
      appointmentType: "",
      reason: "",
      notes: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Format the date to match API requirement
      const formData = {
        ...appointmentForm,
        appointmentDate: new Date(
          appointmentForm.appointmentDate
        ).toISOString(),
      };

      // Call API to create appointment using service
      const result = await appointmentService.createAppointment(formData);

      if (result.success) {
        alert(result.message);
        closeAppointmentModal();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Có lỗi xảy ra khi đặt lịch hẹn. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderCheckList = () => {
    let checksToDisplay = [];

    switch (activeTab) {
      case "pending":
        checksToDisplay = pendingChecks;
        break;
      case "confirmed":
        checksToDisplay = confirmedChecks;
        break;
      case "completed":
        checksToDisplay = completedChecks;
        break;
      default:
        checksToDisplay = pendingChecks;
    }

    if (checksToDisplay.length === 0) {
      return (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Không có kiểm tra nào
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {activeTab === "pending"
              ? "Không có kiểm tra y tế nào đang chờ xác nhận"
              : activeTab === "confirmed"
              ? "Không có kiểm tra y tế nào đã xác nhận"
              : "Không có kiểm tra y tế nào đã hoàn thành"}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow-sm rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700">
        {checksToDisplay.map((check) => (
          <div key={check.id} className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {check.childName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                  {check.grade}
                </p>
              </div>
              <div className="ml-2">
                {activeTab === "pending" && (
                  <button
                    onClick={() => confirmHealthCheck(check.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800"
                  >
                    Xác nhận tham gia
                  </button>
                )}
                {activeTab === "confirmed" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Đã xác nhận
                  </span>
                )}
                {activeTab === "completed" && check.hasAbnormality && (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                      Có dấu hiệu bất thường
                    </span>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Lịch hẹn:{" "}
                      {new Date(check.appointmentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                    <button
                      onClick={() => openAppointmentModal(check)}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-800"
                    >
                      <FaCalendarPlus className="mr-1.5" />
                      Đặt lịch hẹn mới
                    </button>
                  </div>
                )}
                {activeTab === "completed" && !check.hasAbnormality && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Kết quả bình thường
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {activeTab === "completed"
                  ? `Kiểm tra ngày: ${new Date(
                      check.checkDate
                    ).toLocaleDateString("vi-VN")}`
                  : `Lịch kiểm tra: ${new Date(
                      check.scheduledDate
                    ).toLocaleDateString("vi-VN")}`}
              </div>
              <div>
                {activeTab === "completed" && (
                  <Link
                    to={`/parent/health-check/${check.id}/results`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Xem chi tiết kết quả
                  </Link>
                )}
                {activeTab === "confirmed" && (
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Chờ đến ngày kiểm tra
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Kiểm tra y tế định kỳ
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Quản lý lịch kiểm tra y tế định kỳ cho con em bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("pending")}
                className={`${
                  activeTab === "pending"
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Chờ xác nhận
                {pendingChecks.length > 0 && (
                  <span className="ml-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 py-0.5 px-2 rounded-full text-xs">
                    {pendingChecks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("confirmed")}
                className={`${
                  activeTab === "confirmed"
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Đã xác nhận
                {confirmedChecks.length > 0 && (
                  <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 py-0.5 px-2 rounded-full text-xs">
                    {confirmedChecks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`${
                  activeTab === "completed"
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Đã hoàn thành
                {completedChecks.length > 0 && (
                  <span className="ml-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 py-0.5 px-2 rounded-full text-xs">
                    {completedChecks.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        renderCheckList()
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Đặt lịch hẹn cho {selectedStudent?.childName}
              </h3>
              <button
                onClick={closeAppointmentModal}
                className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Ngày hẹn *
                </label>
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  value={appointmentForm.appointmentDate}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Loại cuộc hẹn *
                </label>
                <input
                  type="text"
                  name="appointmentType"
                  value={appointmentForm.appointmentType}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                  placeholder="Ví dụ: Tái khám sức khỏe, Tiêm chủng, Khám răng miệng..."
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Nhập loại cuộc hẹn phù hợp với tình trạng sức khỏe của con em
                  bạn
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nhân viên y tế *
                </label>
                <select
                  name="staffId"
                  value={appointmentForm.staffId}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                >
                  <option value="">Chọn nhân viên y tế</option>
                  {availableNurses.map((nurse) => (
                    <option key={nurse.staffId} value={nurse.staffId}>
                      {nurse.firstName} {nurse.lastName} - {nurse.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Lý do khám *
                </label>
                <textarea
                  name="reason"
                  value={appointmentForm.reason}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                  placeholder="Mô tả lý do cần khám..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Ghi chú thêm
                </label>
                <textarea
                  name="notes"
                  value={appointmentForm.notes}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                  placeholder="Ghi chú thêm (không bắt buộc)..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeAppointmentModal}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang xử lý..." : "Đặt lịch hẹn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckConfirmation;
