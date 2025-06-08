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
} from "react-icons/fi";

const MedicationManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
          studentId: "HS00123",
          studentClass: "10A1",
          medicationName: "Paracetamol 500mg",
          dosage: "1 viên",
          frequency: "3 lần/ngày sau bữa ăn",
          startDate: "2025-07-06",
          endDate: "2025-07-09",
          reason: "Sốt nhẹ, đau đầu",
          status: "pending",
          parentName: "Nguyễn Văn B",
          parentPhone: "0912345678",
          requestDate: "2025-07-05",
          notes: "Học sinh có tiền sử dị ứng với aspirin",
          prescriptionImage: "prescription_mr001.jpg",
        },
        {
          id: "MR002",
          studentName: "Trần Thị C",
          studentId: "HS00456",
          studentClass: "11A2",
          medicationName: "Vitamin C 1000mg",
          dosage: "1 viên",
          frequency: "1 lần/ngày sau bữa sáng",
          startDate: "2025-07-06",
          endDate: "2025-07-20",
          reason: "Tăng cường sức đề kháng",
          status: "approved",
          parentName: "Trần Văn D",
          parentPhone: "0923456789",
          requestDate: "2025-07-04",
          approvedBy: "Lê Thị Y",
          approvedDate: "2025-07-05",
          notes: "",
          prescriptionImage: "prescription_mr002.jpg",
        },
        {
          id: "MR003",
          studentName: "Lê Văn E",
          studentId: "HS00789",
          studentClass: "9B3",
          medicationName: "Thuốc nhỏ mắt Systane",
          dosage: "1 giọt/mắt",
          frequency: "3 lần/ngày",
          startDate: "2025-07-06",
          endDate: "2025-07-13",
          reason: "Mắt khô",
          status: "rejected",
          parentName: "Lê Thị F",
          parentPhone: "0934567890",
          requestDate: "2025-07-05",
          rejectedBy: "Phạm Văn Z",
          rejectedDate: "2025-07-06",
          rejectionReason: "Không có đơn thuốc của bác sĩ kèm theo",
          notes: "",
          prescriptionImage: "",
        },
        {
          id: "MR004",
          studentName: "Phạm Thị G",
          studentId: "HS00321",
          studentClass: "10A3",
          medicationName: "Thuốc chống dị ứng Zyrtec",
          dosage: "1 viên",
          frequency: "1 lần/ngày trước khi đi ngủ",
          startDate: "2025-07-06",
          endDate: "2025-07-16",
          reason: "Dị ứng phấn hoa",
          status: "pending",
          parentName: "Phạm Văn H",
          parentPhone: "0945678901",
          requestDate: "2025-07-05",
          notes: "Học sinh có thể bị buồn ngủ sau khi uống thuốc",
          prescriptionImage: "prescription_mr004.jpg",
        },
        {
          id: "MR005",
          studentName: "Hoàng Văn I",
          studentId: "HS00654",
          studentClass: "12A1",
          medicationName: "Thuốc kháng sinh Amoxicillin",
          dosage: "1 viên 500mg",
          frequency: "2 lần/ngày sau bữa ăn",
          startDate: "2025-07-07",
          endDate: "2025-07-14",
          reason: "Viêm họng",
          status: "approved",
          parentName: "Hoàng Thị K",
          parentPhone: "0956789012",
          requestDate: "2025-07-06",
          approvedBy: "Lê Thị Y",
          approvedDate: "2025-07-06",
          notes: "Uống đủ liều, không được ngưng thuốc giữa chừng",
          prescriptionImage: "prescription_mr005.jpg",
        },
        {
          id: "MR006",
          studentName: "Vũ Thị L",
          studentId: "HS00987",
          studentClass: "11B2",
          medicationName: "Thuốc đau bụng Buscopan",
          dosage: "1 viên",
          frequency: "3 lần/ngày khi đau",
          startDate: "2025-07-07",
          endDate: "2025-07-09",
          reason: "Đau bụng kinh",
          status: "pending",
          parentName: "Vũ Văn M",
          parentPhone: "0967890123",
          requestDate: "2025-07-06",
          notes: "",
          prescriptionImage: "prescription_mr006.jpg",
        },
      ];

      setMedications(mockData);

      // Calculate stats
      const pendingCount = mockData.filter(
        (med) => med.status === "pending"
      ).length;
      const approvedCount = mockData.filter(
        (med) => med.status === "approved"
      ).length;
      const rejectedCount = mockData.filter(
        (med) => med.status === "rejected"
      ).length;

      // Calculate requests for today
      const today = new Date().toISOString().split("T")[0];
      const todayCount = mockData.filter((med) => {
        const requestDate = new Date(med.requestDate)
          .toISOString()
          .split("T")[0];
        return requestDate === today;
      }).length;

      setStats({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        today: todayCount,
      });

      setLoading(false);
    }, 1000);
  }, []);

  // Filter medications based on active tab, search term, and date filter
  const filteredMedications = medications.filter((med) => {
    // Filter by tab (status)
    if (activeTab !== "all" && med.status !== activeTab) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        med.studentName.toLowerCase().includes(searchLower) ||
        med.studentId.toLowerCase().includes(searchLower) ||
        med.studentClass.toLowerCase().includes(searchLower) ||
        med.medicationName.toLowerCase().includes(searchLower) ||
        med.id.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date
    if (filterDate) {
      const requestDate = new Date(med.requestDate).toISOString().split("T")[0];
      return requestDate === filterDate;
    }

    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle approve request
  const handleApprove = (id) => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id
          ? {
              ...med,
              status: "approved",
              approvedBy: "Người dùng hiện tại",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : med
      )
    );

    setShowDetailModal(false);

    // Update stats
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      approved: prev.approved + 1,
    }));
  };

  // Handle reject request
  const handleReject = (id, reason = "Từ chối yêu cầu") => {
    setMedications((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id
          ? {
              ...med,
              status: "rejected",
              rejectedBy: "Người dùng hiện tại",
              rejectedDate: new Date().toISOString().split("T")[0],
              rejectionReason: reason,
            }
          : med
      )
    );

    setShowDetailModal(false);

    // Update stats
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      rejected: prev.rejected + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý thuốc học sinh
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi việc cấp phát thuốc cho học sinh
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
            activeTab === "pending" ? "border-amber-500" : "border-gray-300"
          } cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Chờ xử lý</div>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </div>
            <div
              className={`h-10 w-10 rounded-full ${
                activeTab === "pending" ? "bg-amber-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <FiClock
                className={`h-5 w-5 ${
                  activeTab === "pending" ? "text-amber-600" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
            activeTab === "approved" ? "border-green-500" : "border-gray-300"
          } cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("approved")}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Đã duyệt</div>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </div>
            <div
              className={`h-10 w-10 rounded-full ${
                activeTab === "approved" ? "bg-green-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <FiCheckCircle
                className={`h-5 w-5 ${
                  activeTab === "approved" ? "text-green-600" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
            activeTab === "rejected" ? "border-red-500" : "border-gray-300"
          } cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("rejected")}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Đã từ chối</div>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </div>
            <div
              className={`h-10 w-10 rounded-full ${
                activeTab === "rejected" ? "bg-red-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <FiXCircle
                className={`h-5 w-5 ${
                  activeTab === "rejected" ? "text-red-600" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
            activeTab === "all" ? "border-blue-500" : "border-gray-300"
          } cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("all")}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Tất cả yêu cầu</div>
              <div className="text-2xl font-bold">{medications.length}</div>
            </div>
            <div
              className={`h-10 w-10 rounded-full ${
                activeTab === "all" ? "bg-blue-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <FiClipboard
                className={`h-5 w-5 ${
                  activeTab === "all" ? "text-blue-600" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Tìm kiếm học sinh, lớp, thuốc..."
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Medication request list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mã yêu cầu
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Học sinh
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thuốc
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thời gian
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedications.length > 0 ? (
                    filteredMedications.map((med) => (
                      <tr key={med.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {med.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-teal-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {med.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {med.studentClass} • {med.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {med.medicationName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {med.dosage}, {med.frequency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(med.startDate)} -{" "}
                            {formatDate(med.endDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Yêu cầu: {formatDate(med.requestDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              med.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : med.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {med.status === "approved"
                              ? "Đã duyệt"
                              : med.status === "rejected"
                              ? "Từ chối"
                              : "Chờ duyệt"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleViewDetail(med)}
                              className="text-teal-600 hover:text-teal-900"
                              title="Xem chi tiết"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>

                            {med.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(med.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Duyệt yêu cầu"
                                >
                                  <FiCheck className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleReject(med.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Từ chối yêu cầu"
                                >
                                  <FiX className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FiClipboard className="h-12 w-12 mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Không có yêu cầu thuốc nào
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {activeTab !== "all"
                              ? `Không có yêu cầu nào ở trạng thái "${
                                  activeTab === "pending"
                                    ? "chờ duyệt"
                                    : activeTab === "approved"
                                    ? "đã duyệt"
                                    : "từ chối"
                                }"`
                              : "Không tìm thấy yêu cầu nào phù hợp với bộ lọc"}
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab("all");
                              setSearchTerm("");
                              setFilterDate("");
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <FiFilter className="mr-2 h-4 w-4" /> Xem tất cả yêu
                            cầu
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết yêu cầu thuốc #{selectedRequest.id}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiUser className="mr-2" /> Thông tin học sinh
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-1">
                      <span className="font-medium">Họ tên:</span>{" "}
                      {selectedRequest.studentName}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Mã học sinh:</span>{" "}
                      {selectedRequest.studentId}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Lớp:</span>{" "}
                      {selectedRequest.studentClass}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Phụ huynh:</span>{" "}
                      {selectedRequest.parentName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Liên hệ:</span>{" "}
                      {selectedRequest.parentPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiFileText className="mr-2" /> Thông tin thuốc
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-1">
                      <span className="font-medium">Tên thuốc:</span>{" "}
                      {selectedRequest.medicationName}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Liều lượng:</span>{" "}
                      {selectedRequest.dosage}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Tần suất:</span>{" "}
                      {selectedRequest.frequency}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Từ ngày:</span>{" "}
                      {formatDate(selectedRequest.startDate)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Đến ngày:</span>{" "}
                      {formatDate(selectedRequest.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <FiClipboard className="mr-2" /> Thông tin bổ sung
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Lý do:</span>{" "}
                    {selectedRequest.reason}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {selectedRequest.notes || "Không có ghi chú"}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Ngày yêu cầu:</span>{" "}
                    {formatDate(selectedRequest.requestDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Đơn thuốc/toa thuốc:</span>{" "}
                    {selectedRequest.prescriptionImage ? (
                      <span className="text-blue-600">Đã đính kèm</span>
                    ) : (
                      <span className="text-red-600">Không có</span>
                    )}
                  </p>
                </div>
              </div>

              {selectedRequest.status === "approved" && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <FiCheckCircle className="mr-2" /> Thông tin phê duyệt
                  </h4>
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Người duyệt:</span>{" "}
                    {selectedRequest.approvedBy}
                  </p>
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Ngày duyệt:</span>{" "}
                    {formatDate(selectedRequest.approvedDate)}
                  </p>
                </div>
              )}

              {selectedRequest.status === "rejected" && (
                <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center">
                    <FiXCircle className="mr-2" /> Thông tin từ chối
                  </h4>
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Người từ chối:</span>{" "}
                    {selectedRequest.rejectedBy}
                  </p>
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Ngày từ chối:</span>{" "}
                    {formatDate(selectedRequest.rejectedDate)}
                  </p>
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Lý do từ chối:</span>{" "}
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Đóng
              </button>

              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiCheck className="mr-2 h-4 w-4" />
                    Duyệt yêu cầu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationManagement;
