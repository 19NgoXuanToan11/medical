import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiUserCheck,
  FiEye,
  FiCalendar,
  FiTablet,
  FiChevronDown,
  FiCheck,
  FiX,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";

const MedicineAssignment = () => {
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("verified");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState("");

  // Mock current staff ID - should be from auth context
  const currentStaffId = 1;

  useEffect(() => {
    loadAllData();
    loadAvailableNurses();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadVerifiedRequests(), loadAssignedRequests()]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadVerifiedRequests = async () => {
    try {
      const response = await medicationService.getVerifiedMedicationRequests();
      if (response.success) {
        setVerifiedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading verified requests:", error);
    }
  };

  const loadAssignedRequests = async () => {
    try {
      const response = await medicationService.getAssignedMedicationRequests();
      if (response.success) {
        setAssignedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading assigned requests:", error);
    }
  };

  const loadAvailableNurses = async () => {
    try {
      const response = await medicationService.getAvailableNurses();
      if (response.success) {
        setAvailableNurses(response.data);
      }
    } catch (error) {
      console.error("Error loading available nurses:", error);
    }
  };

  const handleAssignRequest = async () => {
    if (!selectedNurse) {
      alert("Vui lòng chọn y tá để giao nhiệm vụ");
      return;
    }

    if (!selectedRequest) {
      alert("Không có yêu cầu được chọn");
      return;
    }

    try {
      const response = await medicationService.assignNurseToRequest(
        selectedRequest.requestId,
        parseInt(selectedNurse)
      );

      if (response.success) {
        alert("Giao nhiệm vụ thành công!");
        setShowAssignModal(false);
        setSelectedNurse("");
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi giao nhiệm vụ");
      console.error("Error assigning request:", error);
    }
  };

  const getCurrentData = () => {
    switch (activeSubTab) {
      case "verified":
        return verifiedRequests;
      case "assigned":
        return assignedRequests;
      default:
        return [];
    }
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = `${request.student?.firstName || ""} ${
        request.student?.lastName || ""
      }`.toLowerCase();
      const medicineNames =
        request.medicineRequestItems
          ?.map((item) => item.medicineName?.toLowerCase() || "")
          .join(" ") || "";
      const requestId = request.requestId?.toString() || "";
      const nurseAssigned = request.staff
        ? `${request.staff.firstName || ""} ${
            request.staff.lastName || ""
          }`.toLowerCase()
        : "";

      return (
        studentName.includes(searchLower) ||
        medicineNames.includes(searchLower) ||
        requestId.includes(searchLower) ||
        nurseAssigned.includes(searchLower)
      );
    });
  };

  const getStatusBadge = (status, subTab) => {
    const statusMap = {
      verified: { label: "Đã xác nhận", color: "bg-green-100 text-green-800" },
      assigned: { label: "Đã giao việc", color: "bg-blue-100 text-blue-800" },
    };

    const config = statusMap[subTab] || statusMap.verified;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Function to render medicine names for table
  const renderMedicineNames = (medicineRequestItems) => {
    if (!medicineRequestItems || medicineRequestItems.length === 0) {
      return <span className="text-gray-500">N/A</span>;
    }

    if (medicineRequestItems.length === 1) {
      return <span>{medicineRequestItems[0].medicineName}</span>;
    }

    return (
      <div className="space-y-1">
        {medicineRequestItems.slice(0, 2).map((item, index) => (
          <div key={index} className="text-sm">
            {item.medicineName}
          </div>
        ))}
        {medicineRequestItems.length > 2 && (
          <div className="text-xs text-blue-600 font-medium">
            +{medicineRequestItems.length - 2} thuốc khác
          </div>
        )}
      </div>
    );
  };

  const currentRequests = filterRequests(getCurrentData());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Giao nhiệm vụ cho y tá
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Giao các yêu cầu thuốc đã xác nhận cho y tá thực hiện
          </p>
        </div>
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 p-1 rounded-lg">
        {[
          { key: "verified", label: "Chờ giao việc", icon: FiCheck },
          { key: "assigned", label: "Đã giao việc", icon: FiUserCheck },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              activeSubTab === key
                ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeSubTab === key
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
              }`}
            >
              {getCurrentData().length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, thuốc, ID hoặc y tá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 w-full"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thuốc
                </th>
                {activeSubTab === "assigned" && (
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Y tá phụ trách
                  </th>
                )}
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày gửi yêu cầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày uống thuốc
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
              {currentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeSubTab === "assigned" ? "7" : "6"}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr
                    key={request.requestId}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {request.student?.firstName}{" "}
                            {request.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp:{" "}
                            {request.student?.class?.className ||
                              request.className}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {renderMedicineNames(request.medicineRequestItems)}
                      </div>
                    </td>
                    {activeSubTab === "assigned" && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="ml-2">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {request.staff?.firstName}{" "}
                              {request.staff?.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {request.date
                        ? formatDate(request.date)
                        : formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(request.status, activeSubTab)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        {activeSubTab === "verified" && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAssignModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Giao nhiệm vụ"
                          >
                            <FiUserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-neutral-600">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Chi tiết yêu cầu thuốc #{selectedRequest.requestId}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white dark:hover:bg-neutral-600 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="px-6 py-6 space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Thông tin học sinh
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Họ và tên
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.student?.firstName}{" "}
                        {selectedRequest.student?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lớp học
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.student?.class?.className ||
                          selectedRequest.className}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ngày sinh
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.student?.dateOfBirth
                          ? formatDate(selectedRequest.student.dateOfBirth)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Giới tính
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.student?.gender || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiInfo className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Thông tin yêu cầu
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ngày gửi yêu cầu
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {formatDate(selectedRequest.requestDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ngày uống thuốc
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.date
                          ? formatDate(selectedRequest.date)
                          : formatDate(selectedRequest.requestDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trạng thái
                      </label>
                      <div className="bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {getStatusBadge(selectedRequest.status, activeSubTab)}
                      </div>
                    </div>
                  </div>

                  {selectedRequest.notes && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ghi chú
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.notes}
                      </p>
                    </div>
                  )}

                  {activeSubTab === "assigned" && selectedRequest.staff && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Y tá phụ trách
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-600 px-3 py-2 rounded border">
                        {selectedRequest.staff.firstName}{" "}
                        {selectedRequest.staff.lastName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Medication Information */}
                {selectedRequest.medicineRequestItems && (
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <FiTablet className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Danh sách thuốc (
                        {selectedRequest.medicineRequestItems.length} loại)
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {selectedRequest.medicineRequestItems.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-neutral-600 border border-gray-200 dark:border-gray-500 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                                  Thuốc {index + 1}
                                </span>
                                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.medicineName}
                                </h5>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Tổng liều lượng (viên)
                                </span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                                  {item.dosage || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Tần suất uống (lần/ngày)
                                </span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                                  {item.frequency || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Liều lượng mỗi lần (viên)
                                </span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                                  {(() => {
                                    const totalDosage =
                                      parseInt(item.dosage) || 0;
                                    const frequency =
                                      parseInt(item.frequency) || 1;
                                    if (totalDosage === 0) return "N/A";
                                    const dosagePerTime = Math.ceil(
                                      totalDosage / frequency
                                    );
                                    return dosagePerTime;
                                  })()}
                                </p>
                              </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <FiClock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wide">
                                  Lịch uống thuốc
                                </span>
                              </div>
                              {(() => {
                                const frequency = parseInt(item.frequency) || 1;
                                const totalDosage = parseInt(item.dosage) || 0;
                                const dosagePerTime =
                                  totalDosage > 0
                                    ? Math.ceil(totalDosage / frequency)
                                    : 1;

                                if (frequency === 1) {
                                  return (
                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi sáng (6:00 - 11:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else if (frequency === 2) {
                                  return (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi sáng (6:00 - 11:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi chiều (14:00 - 18:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else if (frequency >= 3) {
                                  return (
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi sáng (6:00 - 11:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi trua (11:00 - 14:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                      <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded text-center">
                                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">
                                          Buổi chiều (14:00 - 18:00)
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs">
                                          {dosagePerTime} viên/lần
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                            {item.instructions && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                                <div className="flex items-start space-x-2">
                                  <FiInfo className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wide">
                                      Hướng dẫn sử dụng
                                    </span>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                      {item.instructions}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(selectedRequest.parentNotes ||
                  selectedRequest.healthCondition) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-3">
                      Thông tin bổ sung
                    </h4>
                    {selectedRequest.healthCondition && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                          Tình trạng sức khỏe
                        </label>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {selectedRequest.healthCondition}
                        </p>
                      </div>
                    )}
                    {selectedRequest.parentNotes && (
                      <div>
                        <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                          Ghi chú từ phụ huynh
                        </label>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {selectedRequest.parentNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-neutral-700">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-500 transition-colors"
                >
                  Đóng
                </button>
                {activeSubTab === "verified" && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowAssignModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Giao nhiệm vụ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-neutral-600">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-700 dark:to-neutral-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Giao nhiệm vụ cho y tá
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4 bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Giao yêu cầu thuốc cho học sinh:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedRequest.student?.firstName}{" "}
                  {selectedRequest.student?.lastName}
                </p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Thuốc:{" "}
                  </span>
                  {selectedRequest.medicineRequestItems &&
                  selectedRequest.medicineRequestItems.length > 1 ? (
                    <div className="mt-1 space-y-1">
                      {selectedRequest.medicineRequestItems.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            • {item.medicineName}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedRequest.medicineRequestItems?.[0]?.medicineName}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn y tá phụ trách *
                </label>
                <div className="relative">
                  <select
                    value={selectedNurse}
                    onChange={(e) => setSelectedNurse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 appearance-none"
                    required
                  >
                    <option value="">-- Chọn y tá --</option>
                    {availableNurses.map((nurse) => (
                      <option key={nurse.staffId} value={nurse.staffId}>
                        {nurse.firstName} {nurse.lastName}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Y tá được chọn sẽ nhận nhiệm vụ cho học sinh uống thuốc theo
                  đúng liều lượng và tần suất.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedNurse("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAssignRequest}
                  disabled={!selectedNurse}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Giao nhiệm vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineAssignment;
