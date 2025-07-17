import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiEye,
  FiClipboard,
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import { getMedicineUnit } from "../../../../utils/medicineUnits";
import {
  calculateDosagePerAdministration,
  calculateDosagePerTime,
  formatTotalDosage,
  formatFrequencyDisplay,
} from "../../../../utils/api/medication/medicationUtils";

const MedicineVerification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [refusedRequests, setRefusedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPendingRequests(),
        loadVerifiedRequests(),
        loadRefusedRequests(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadPendingRequests = async () => {
    try {
      const response = await medicationService.getPendingMedicationRequests();
      if (response.success) {
        setPendingRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading pending requests:", error);
    }
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

  const loadRefusedRequests = async () => {
    try {
      const response = await medicationService.getRefusedMedicationRequests();
      if (response.success) {
        setRefusedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading refused requests:", error);
    }
  };

  const handleVerifyRequest = async (request) => {
    try {
      const response = await medicationService.verifyRequest(
        request.requestId,
        currentStaffId
      );
      if (response.success) {
        alert("Xác nhận yêu cầu thuốc thành công!");
        setShowVerifyModal(false);
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xác nhận yêu cầu thuốc");
    }
  };

  const handleRefuseRequest = async (request) => {
    if (!refusalReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      const response = await medicationService.refuseRequest(
        request.requestId,
        currentStaffId,
        refusalReason
      );
      if (response.success) {
        alert("Từ chối yêu cầu thuốc thành công!");
        setShowRefuseModal(false);
        setRefusalReason("");
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi từ chối yêu cầu thuốc");
    }
  };

  const getCurrentData = () => {
    switch (activeSubTab) {
      case "pending":
        return pendingRequests;
      case "verified":
        return verifiedRequests;
      case "refused":
        return refusedRequests;
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

      // Search through all medicine names
      const medicineNames =
        request.medicineRequestItems
          ?.map((item) => item.medicineName?.toLowerCase() || "")
          .join(" ") || "";

      const requestId = request.requestId?.toString() || "";

      return (
        studentName.includes(searchLower) ||
        medicineNames.includes(searchLower) ||
        requestId.includes(searchLower)
      );
    });
  };

  const getStatusBadge = (status, subTab) => {
    const statusMap = {
      pending: {
        label: "Chờ kiểm tra",
        color: "bg-yellow-100 text-yellow-800",
      },
      verified: { label: "Đã xác nhận", color: "bg-green-100 text-green-800" },
      refused: { label: "Đã từ chối", color: "bg-red-100 text-red-800" },
    };

    const config = statusMap[subTab] || statusMap.pending;
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

  // Function to render multiple medicines in table
  const renderMedicinesList = (medicineItems) => {
    if (!medicineItems || medicineItems.length === 0) {
      return <span className="text-gray-500">N/A</span>;
    }

    if (medicineItems.length === 1) {
      return (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {medicineItems[0].medicineName}
        </span>
      );
    }

    return (
      <div className="space-y-1">
        {medicineItems.map((item, index) => (
          <div key={index} className="text-sm text-gray-900 dark:text-gray-100">
            <span className="font-medium">{item.medicineName}</span>
          </div>
        ))}
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
            Kiểm tra số lượng thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kiểm tra số lượng thuốc và xác nhận/từ chối yêu cầu thuốc
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
          { key: "pending", label: "Chờ kiểm tra", icon: FiClipboard },
          { key: "verified", label: "Đã xác nhận", icon: FiCheck },
          { key: "refused", label: "Đã từ chối", icon: FiX },
        ].map(({ key, label, icon: Icon }) => {
          // Get the correct count for each tab
          const getTabCount = (tabKey) => {
            switch (tabKey) {
              case "pending":
                return pendingRequests.length;
              case "verified":
                return verifiedRequests.length;
              case "refused":
                return refusedRequests.length;
              default:
                return 0;
            }
          };

          return (
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
                {getTabCount(key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, thuốc hoặc ID..."
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
                    colSpan="6"
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
                      {renderMedicinesList(request.medicineRequestItems)}
                    </td>
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
                        {activeSubTab === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowVerifyModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Xác nhận đủ thuốc"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRefuseModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Từ chối thiếu thuốc"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
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

      {/* Enhanced Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full overflow-y-auto border border-gray-300 dark:border-gray-600"
            style={{
              maxWidth: "64rem",
              maxHeight: "calc(100vh - 2rem)",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu thuốc #{selectedRequest.requestId}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Student and Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Học sinh
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.student?.firstName}{" "}
                    {selectedRequest.student?.lastName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Lớp:{" "}
                    {selectedRequest.student?.class?.className ||
                      selectedRequest.className}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày gửi yêu cầu
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(selectedRequest.requestDate)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày uống thuốc
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.date
                      ? formatDate(selectedRequest.date)
                      : formatDate(selectedRequest.requestDate)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Phụ huynh
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.parent
                      ? `${selectedRequest.parent.firstName} ${selectedRequest.parent.lastName}`
                      : selectedRequest.parentName || "N/A"}
                  </div>
                </div>
              </div>

              {/* Medicine Information */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Danh sách thuốc yêu cầu
                </h4>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tên thuốc
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tổng liều lượng
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tần suất uống
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Liều lượng mỗi lần
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {selectedRequest.medicineRequestItems?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {formatTotalDosage(
                                item.totalQuantity || item.dosage,
                                item.dosageUnit ||
                                  getMedicineUnit(item.medicineName)
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {formatFrequencyDisplay(item.frequency)}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {calculateDosagePerTime(
                                item.dosage,
                                item.dosageUnit ||
                                  getMedicineUnit(item.medicineName),
                                item.frequency
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refusal Reason Section - Only show for refused requests */}
              {(selectedRequest.status === "refused" ||
                selectedRequest.status === "Refused" ||
                selectedRequest.status === "rejected") && (
                <div className="mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="text-md font-medium text-red-800 dark:text-red-300 mb-3 flex items-center">
                      <FiXCircle className="h-5 w-5 mr-2" />
                      Lý do từ chối
                    </h4>
                    <div className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                      <p className="text-red-700 dark:text-red-300 font-medium">
                        {selectedRequest.refusalReason ||
                          selectedRequest.rejectionReason ||
                          selectedRequest.reason ||
                          "Không có lý do cụ thể"}
                      </p>
                    </div>
                    {/* Additional rejection info */}
                    {(selectedRequest.rejectedBy ||
                      selectedRequest.rejectedDate ||
                      selectedRequest.staff) && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedRequest.rejectedBy && (
                          <div>
                            <label className="text-sm font-medium text-red-700 dark:text-red-300">
                              Từ chối bởi:
                            </label>
                            <p className="text-red-800 dark:text-red-200">
                              {selectedRequest.rejectedBy}
                            </p>
                          </div>
                        )}
                        {selectedRequest.rejectedDate && (
                          <div>
                            <label className="text-sm font-medium text-red-700 dark:text-red-300">
                              Ngày từ chối:
                            </label>
                            <p className="text-red-800 dark:text-red-200">
                              {formatDate(selectedRequest.rejectedDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Usage Instructions */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Hướng dẫn sử dụng
                </h4>

                {selectedRequest.medicineRequestItems?.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.medicineName}:
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                      {item.instructions ||
                        (() => {
                          if (item.dosage && item.frequency) {
                            const dosagePerTime = item.dosage / item.frequency;
                            const roundedDosage =
                              dosagePerTime % 1 === 0
                                ? dosagePerTime.toString()
                                : dosagePerTime.toFixed(1);
                            const unit =
                              item.dosageUnit ||
                              getMedicineUnit(item.medicineName);
                            return `Uống ${roundedDosage} ${unit} mỗi lần theo toa`;
                          }
                          return `Uống ${item.dosagePerTime || "1"} ${
                            item.dosageUnit ||
                            getMedicineUnit(item.medicineName)
                          } mỗi lần theo toa`;
                        })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Medication Schedule */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Lịch uống thuốc:
                </h4>

                {selectedRequest.medicineRequestItems?.map((item, index) => {
                  // Parse timeOfDay to determine which time periods to show
                  const timeOfDay = item.timeOfDay || "";
                  const timeSlots = timeOfDay
                    .split(",")
                    .map((time) => time.trim().toLowerCase());

                  const timeSlotConfig = {
                    morning: {
                      label: "Buổi sáng (6:00 - 11:00)",
                      show: timeSlots.includes("morning"),
                    },
                    noon: {
                      label: "Buổi trưa (11:00 - 14:00)",
                      show: timeSlots.includes("noon"),
                    },
                    afternoon: {
                      label: "Buổi chiều (14:00 - 18:00)",
                      show: timeSlots.includes("afternoon"),
                    },
                    evening: {
                      label: "Buổi tối (18:00 - 22:00)",
                      show: timeSlots.includes("evening"),
                    },
                  };

                  const activeSlots = Object.values(timeSlotConfig).filter(
                    (slot) => slot.show
                  );
                  const dosagePerTime =
                    item.dosage && item.frequency
                      ? calculateDosagePerTime(
                          item.dosage,
                          item.dosageUnit || getMedicineUnit(item.medicineName),
                          item.frequency
                        )
                      : `${item.dosagePerTime || "1"} ${
                          item.dosageUnit || getMedicineUnit(item.medicineName)
                        }/lần`;

                  return (
                    <div key={index} className="mb-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {item.medicineName}
                      </div>

                      {activeSlots.length > 0 ? (
                        <div
                          className={`grid grid-cols-1 ${
                            activeSlots.length === 2
                              ? "md:grid-cols-2"
                              : activeSlots.length === 3
                              ? "md:grid-cols-3"
                              : activeSlots.length === 4
                              ? "md:grid-cols-4"
                              : "md:grid-cols-3"
                          } gap-3`}
                        >
                          {Object.entries(timeSlotConfig).map(
                            ([key, config]) =>
                              config.show && (
                                <div
                                  key={key}
                                  className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center"
                                >
                                  <div className="text-green-600 dark:text-green-400 font-medium">
                                    {config.label}
                                  </div>
                                  <div className="text-sm text-green-700 dark:text-green-300">
                                    {dosagePerTime}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      ) : (
                        // Fallback if no timeOfDay specified
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg text-center">
                          <div className="text-gray-600 dark:text-gray-400 font-medium">
                            Thời gian uống thuốc
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {dosagePerTime}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Theo chỉ định của bác sĩ
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái:
                    </span>
                    <span className="ml-2">
                      {getStatusBadge(selectedRequest.status, activeSubTab)}
                    </span>
                  </div>
                </div>

                {activeSubTab === "pending" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowRefuseModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                    >
                      <FiX className="h-4 w-4 mr-2" />
                      Từ chối
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowVerifyModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <FiCheck className="h-4 w-4 mr-2" />
                      Xác nhận
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full border border-gray-300 dark:border-gray-600"
            style={{
              maxWidth: "28rem",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Xác nhận đủ thuốc
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Xác nhận yêu cầu thuốc cho học sinh:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Bạn xác nhận rằng có đủ thuốc để thực hiện yêu cầu này?
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleVerifyRequest(selectedRequest)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refuse Modal */}
      {showRefuseModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full border border-gray-300 dark:border-gray-600"
            style={{
              maxWidth: "28rem",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Từ chối yêu cầu thuốc
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Từ chối yêu cầu thuốc cho học sinh:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  value={refusalReason}
                  onChange={(e) => setRefusalReason(e.target.value)}
                  placeholder="Nhập lý do từ chối (ví dụ: thiếu thuốc, hết hạn sử dụng...)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRefuseModal(false);
                    setRefusalReason("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleRefuseRequest(selectedRequest)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineVerification;
