import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiUser,
  FiCalendar,
  FiFileText,
  FiEye,
  FiCheck,
  FiX,
  FiClipboard,
  FiTablet,
} from "react-icons/fi";

const StaffMedicationList = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [medicationRequests, setMedicationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0,
  });

  // Mock data for medication requests
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          id: "MR001",
          studentName: "Nguyễn Văn A",
          studentId: 123,
          medicineName: "Paracetamol 500mg",
          dosage: "1 viên",
          frequency: "3 lần/ngày sau bữa ăn",
          timeOfDay: "morning",
          instructions: "Uống sau bữa ăn",
          status: "pending",
          requestDate: "2024-01-15",
          medicationImagePath: "prescription_mr001.jpg",
          prescriptionImagePath: "prescription_mr001.jpg",
          staffId: 1,
        },
        {
          id: "MR002",
          studentName: "Trần Thị B",
          studentId: 456,
          medicineName: "Vitamin C 1000mg",
          dosage: "1 viên",
          frequency: "1 lần/ngày sau bữa sáng",
          timeOfDay: "morning",
          instructions: "Tăng cường sức đề kháng",
          status: "approved",
          requestDate: "2024-01-14",
          approvedBy: "Y tá Lê Thị C",
          approvedDate: "2024-01-15",
          medicationImagePath: "prescription_mr002.jpg",
          prescriptionImagePath: "prescription_mr002.jpg",
          staffId: 1,
        },
        {
          id: "MR003",
          studentName: "Phạm Văn D",
          studentId: 789,
          medicineName: "Amoxicillin 250mg",
          dosage: "1 viên",
          frequency: "2 lần/ngày",
          timeOfDay: "morning",
          instructions: "Điều trị nhiễm khuẩn",
          status: "rejected",
          requestDate: "2024-01-13",
          rejectedBy: "Y tá Lê Thị C",
          rejectedDate: "2024-01-14",
          rejectionReason: "Cần có đơn thuốc từ bác sĩ",
          medicationImagePath: "prescription_mr003.jpg",
          prescriptionImagePath: "",
          staffId: 1,
        },
      ];

      setMedicationRequests(mockData);

      // Calculate stats
      const stats = {
        pending: mockData.filter((req) => req.status === "pending").length,
        approved: mockData.filter((req) => req.status === "approved").length,
        rejected: mockData.filter((req) => req.status === "rejected").length,
        today: mockData.filter(
          (req) => req.requestDate === new Date().toISOString().split("T")[0]
        ).length,
      };
      setStats(stats);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (requestId) => {
    try {
      // Update request status
      const updatedRequests = medicationRequests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              approvedBy: "Y tá hiện tại",
              approvedDate: new Date().toISOString().split("T")[0],
              approvalNotes: approvalNotes,
            }
          : req
      );
      setMedicationRequests(updatedRequests);

      // Send notification to parent
      await sendParentNotification(requestId, "approved", approvalNotes);

      // Update stats
      updateStats(updatedRequests);

      setShowApprovalModal(false);
      setApprovalNotes("");
      alert("Yêu cầu đã được phê duyệt!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Có lỗi xảy ra khi phê duyệt yêu cầu!");
    }
  };

  const handleReject = async (requestId) => {
    try {
      // Update request status
      const updatedRequests = medicationRequests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected",
              rejectedBy: "Y tá hiện tại",
              rejectedDate: new Date().toISOString().split("T")[0],
              rejectionReason: approvalNotes,
            }
          : req
      );
      setMedicationRequests(updatedRequests);

      // Send notification to parent
      await sendParentNotification(requestId, "rejected", approvalNotes);

      // Update stats
      updateStats(updatedRequests);

      setShowApprovalModal(false);
      setApprovalNotes("");
      alert("Yêu cầu đã bị từ chối!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Có lỗi xảy ra khi từ chối yêu cầu!");
    }
  };

  const sendParentNotification = async (requestId, action, notes) => {
    try {
      const request = medicationRequests.find((req) => req.id === requestId);
      if (!request) return;

      const notificationData = {
        type: "medication_response",
        title:
          action === "approved"
            ? "Yêu cầu thuốc được chấp thuận"
            : "Yêu cầu thuốc bị từ chối",
        message: `Yêu cầu cấp thuốc ${request.medicineName} cho ${
          request.studentName
        } đã ${action === "approved" ? "được chấp thuận" : "bị từ chối"}. ${
          notes ? `Ghi chú: ${notes}` : ""
        }`,
        recipientRole: "parent",
        studentId: request.studentId,
        medicationRequestId: requestId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo (in real app, use proper notification system)
      const existingNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "parentNotifications",
        JSON.stringify(existingNotifications)
      );

      console.log("Parent notification sent:", notificationData);
    } catch (error) {
      console.error("Error sending parent notification:", error);
    }
  };

  const updateStats = (requests) => {
    const newStats = {
      pending: requests.filter((req) => req.status === "pending").length,
      approved: requests.filter((req) => req.status === "approved").length,
      rejected: requests.filter((req) => req.status === "rejected").length,
      today: requests.filter(
        (req) => req.requestDate === new Date().toISOString().split("T")[0]
      ).length,
    };
    setStats(newStats);
  };

  const filteredRequests = medicationRequests.filter((request) => {
    const matchesStatus = activeTab === "all" || request.status === activeTab;
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || request.requestDate === filterDate;

    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "approved":
        return <FiCheckCircle className="h-4 w-4" />;
      case "rejected":
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

  const handleShowApprovalModal = (request, action) => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setApprovalNotes("");
    setShowApprovalModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý yêu cầu thuốc
        </h1>
        <p className="text-gray-600 mt-1">
          Xem xét và phê duyệt các yêu cầu cấp thuốc từ phụ huynh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Chờ xử lý</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Đã phê duyệt</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {stats.approved}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Bị từ chối</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {stats.rejected}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiXCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Hôm nay</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {stats.today}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiCalendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chờ xử lý ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã phê duyệt ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Bị từ chối ({stats.rejected})
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thuốc
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liều lượng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50"
                  style={{ height: "80px" }}
                >
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {request.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex flex-col justify-center items-center min-h-[60px]">
                      <div className="text-sm text-gray-900">
                        {request.medicineName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.frequency}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      {request.dosage}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      {new Date(request.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="ml-1">
                          {request.status === "pending"
                            ? "Chờ xử lý"
                            : request.status === "approved"
                            ? "Đã phê duyệt"
                            : "Bị từ chối"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleShowApprovalModal(request, "approve")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleShowApprovalModal(request, "reject")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FiTablet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có yêu cầu nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Chưa có yêu cầu thuốc nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết yêu cầu #{selectedRequest.id}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Học sinh
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.studentName} (ID:{" "}
                      {selectedRequest.studentId})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày yêu cầu
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRequest.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên thuốc
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.medicineName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Liều lượng
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.dosage}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tần suất
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.frequency}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời điểm dùng
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.timeOfDay === "morning"
                      ? "Buổi sáng"
                      : selectedRequest.timeOfDay === "afternoon"
                      ? "Buổi chiều"
                      : selectedRequest.timeOfDay === "evening"
                      ? "Buổi tối"
                      : "Khi cần thiết"}
                  </p>
                </div>

                {selectedRequest.instructions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hướng dẫn đặc biệt
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.instructions}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedRequest.status
                      )}`}
                    >
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1">
                        {selectedRequest.status === "pending"
                          ? "Chờ xử lý"
                          : selectedRequest.status === "approved"
                          ? "Đã phê duyệt"
                          : "Bị từ chối"}
                      </span>
                    </span>
                  </div>
                </div>

                {selectedRequest.status === "approved" && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>Phê duyệt bởi:</strong>{" "}
                      {selectedRequest.approvedBy}
                    </p>
                    <p className="text-sm text-green-800">
                      <strong>Ngày phê duyệt:</strong>{" "}
                      {new Date(
                        selectedRequest.approvedDate
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    {selectedRequest.approvalNotes && (
                      <p className="text-sm text-green-800">
                        <strong>Ghi chú:</strong>{" "}
                        {selectedRequest.approvalNotes}
                      </p>
                    )}
                  </div>
                )}

                {selectedRequest.status === "rejected" && (
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Từ chối bởi:</strong> {selectedRequest.rejectedBy}
                    </p>
                    <p className="text-sm text-red-800">
                      <strong>Ngày từ chối:</strong>{" "}
                      {new Date(
                        selectedRequest.rejectedDate
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-red-800">
                      <strong>Lý do:</strong> {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleShowApprovalModal(selectedRequest, "approve");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleShowApprovalModal(selectedRequest, "reject");
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {approvalAction === "approve" ? "Phê duyệt" : "Từ chối"} yêu
                  cầu
                </h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn{" "}
                  {approvalAction === "approve" ? "phê duyệt" : "từ chối"} yêu
                  cầu cấp thuốc <strong>{selectedRequest.medicineName}</strong>{" "}
                  cho học sinh <strong>{selectedRequest.studentName}</strong>?
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {approvalAction === "approve"
                    ? "Ghi chú (tùy chọn)"
                    : "Lý do từ chối"}
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    approvalAction === "approve"
                      ? "Nhập ghi chú..."
                      : "Nhập lý do từ chối..."
                  }
                  required={approvalAction === "reject"}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (approvalAction === "approve") {
                      handleApprove(selectedRequest.id);
                    } else {
                      if (!approvalNotes.trim()) {
                        alert("Vui lòng nhập lý do từ chối");
                        return;
                      }
                      handleReject(selectedRequest.id);
                    }
                  }}
                  className={`px-4 py-2 text-white rounded-md ${
                    approvalAction === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {approvalAction === "approve" ? "Phê duyệt" : "Từ chối"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMedicationList;
