import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiX,
  FiAlertTriangle,
  FiRepeat,
  FiXCircle,
  FiInfo,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";

const FailedRequestManagement = () => {
  const [failedRequests, setFailedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReRequestModal, setShowReRequestModal] = useState(false);
  const [showMarkFailedModal, setShowMarkFailedModal] = useState(false);
  const [showReRequestsModal, setShowReRequestsModal] = useState(false);
  const [reRequestReason, setReRequestReason] = useState("");
  const [markFailedReason, setMarkFailedReason] = useState("");
  const [reRequests, setReRequests] = useState([]);

  // Mock current staff ID - should be from auth context
  const currentStaffId = 1;

  useEffect(() => {
    loadFailedRequests();
  }, []);

  const loadFailedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getFailedMedicationRequests();
      if (response.success) {
        setFailedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading failed requests:", error);
    }
    setLoading(false);
  };

  const loadReRequests = async (originalRequestResultId) => {
    try {
      const response = await medicationService.getReRequests(
        originalRequestResultId
      );
      if (response.success) {
        setReRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading re-requests:", error);
    }
  };

  const handleCreateReRequest = async () => {
    if (!reRequestReason.trim()) {
      alert("Vui lòng nhập lý do tạo yêu cầu lại");
      return;
    }

    if (!selectedRequest) {
      alert("Không có request được chọn");
      return;
    }

    try {
      const response = await medicationService.createReRequest(
        selectedRequest.resultId,
        reRequestReason,
        currentStaffId
      );

      if (response.success) {
        alert("Tạo yêu cầu lại thành công!");
        setShowReRequestModal(false);
        setReRequestReason("");
        loadFailedRequests();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo yêu cầu lại");
      console.error("Error creating re-request:", error);
    }
  };

  const handleMarkAsFailed = async () => {
    if (!markFailedReason.trim()) {
      alert("Vui lòng nhập lý do đánh dấu thất bại");
      return;
    }

    if (!selectedRequest) {
      alert("Không có request được chọn");
      return;
    }

    try {
      const response = await medicationService.markRequestAsFailed(
        selectedRequest.resultId,
        markFailedReason
      );

      if (response.success) {
        alert("Đánh dấu thất bại thành công!");
        setShowMarkFailedModal(false);
        setMarkFailedReason("");
        loadFailedRequests();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đánh dấu thất bại");
      console.error("Error marking as failed:", error);
    }
  };

  const handleViewReRequests = async (request) => {
    setSelectedRequest(request);
    await loadReRequests(request.resultId);
    setShowReRequestsModal(true);
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = `${request.request?.student?.firstName || ""} ${
        request.request?.student?.lastName || ""
      }`.toLowerCase();
      const medicineName =
        request.request?.medicineRequestItems?.[0]?.medicineName?.toLowerCase() ||
        "";
      const resultId = request.resultId?.toString() || "";

      return (
        studentName.includes(searchLower) ||
        medicineName.includes(searchLower) ||
        resultId.includes(searchLower)
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const isAfterCutoffTime = () => {
    const now = new Date();
    const cutoffHour = 17; // 5 PM
    return now.getHours() >= cutoffHour;
  };

  const canCreateReRequest = (request) => {
    // Check if it's before 5 PM
    if (isAfterCutoffTime()) return false;

    // Check if request status allows re-request
    return request.status === "Failed" || request.status === "failed";
  };

  const getFailureInfo = (request) => {
    try {
      const failedFrequencies = JSON.parse(request.failedFrequencies || "[]");
      const failureReasons = JSON.parse(request.failureReasons || "{}");
      return { failedFrequencies, failureReasons };
    } catch (error) {
      console.error("Error parsing failure info:", error);
      return { failedFrequencies: [], failureReasons: {} };
    }
  };

  const filteredRequests = filterRequests(failedRequests);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý thất bại & Tạo lại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các yêu cầu thất bại và tạo yêu cầu lại
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isAfterCutoffTime() && (
            <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
              <FiInfo className="h-3 w-3 mr-1" />
              Sau 17h: Không thể tạo request mới
            </div>
          )}
          <button
            onClick={loadFailedRequests}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
          >
            <FiRefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>
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

      {/* Failed Requests Table */}
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
                  Ngày thất bại
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Buổi thất bại
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
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const medicineItem =
                    request.request?.medicineRequestItems?.[0];
                  const failureInfo = getFailureInfo(request);

                  return (
                    <tr
                      key={request.resultId}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {request.request?.student?.firstName}{" "}
                              {request.request?.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Lớp:{" "}
                              {request.request?.student?.class?.className ||
                                request.request?.className}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <FiTablet className="inline h-4 w-4 mr-1" />
                          {medicineItem?.medicineName || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {medicineItem?.dosage} - {medicineItem?.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                        <FiCalendar className="inline h-4 w-4 mr-1" />
                        {formatDate(request.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {failureInfo.failedFrequencies.map((freq, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full"
                            >
                              {freq}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Thất bại
                        </span>
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
                          <button
                            onClick={() => handleViewReRequests(request)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Xem request lại"
                          >
                            <FiInfo className="h-4 w-4" />
                          </button>
                          {canCreateReRequest(request) && (
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowReRequestModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Tạo yêu cầu lại"
                            >
                              <FiRepeat className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowMarkFailedModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Đánh dấu thất bại"
                          >
                            <FiXCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết thất bại #{selectedRequest.resultId}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Học sinh
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.request?.student?.firstName}{" "}
                    {selectedRequest.request?.student?.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.request?.student?.class?.className ||
                      selectedRequest.request?.className}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày thất bại
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(selectedRequest.submittedAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </label>
                  <span className="mt-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Thất bại
                  </span>
                </div>
              </div>

              {selectedRequest.request?.medicineRequestItems && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thông tin thuốc và lý do thất bại
                  </label>
                  <div className="space-y-3">
                    {selectedRequest.request.medicineRequestItems.map(
                      (item, index) => {
                        const failureInfo = getFailureInfo(selectedRequest);

                        return (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Tên thuốc:
                                </span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {item.medicineName}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Liều lượng:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.dosage}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Tần suất:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.frequency}
                                </p>
                              </div>
                            </div>

                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                                Buổi thất bại và lý do:
                              </span>
                              <div className="space-y-2">
                                {failureInfo.failedFrequencies.map(
                                  (freq, freqIndex) => (
                                    <div
                                      key={freqIndex}
                                      className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                                    >
                                      <div className="flex items-center mb-1">
                                        <FiAlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                          Buổi {freq}
                                        </span>
                                      </div>
                                      <p className="text-sm text-red-700 dark:text-red-300">
                                        {failureInfo.failureReasons[freq] ||
                                          "Không có lý do cụ thể"}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Re-Request Modal */}
      {showReRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Tạo yêu cầu lại
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Tạo yêu cầu lại cho học sinh:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedRequest.request?.student?.firstName}{" "}
                  {selectedRequest.request?.student?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thuốc:{" "}
                  {
                    selectedRequest.request?.medicineRequestItems?.[0]
                      ?.medicineName
                  }
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lý do tạo yêu cầu lại *
                </label>
                <textarea
                  value={reRequestReason}
                  onChange={(e) => setReRequestReason(e.target.value)}
                  placeholder="Nhập lý do tạo yêu cầu lại (ví dụ: học sinh đã trở lại trường...)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  required
                />
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Yêu cầu lại sẽ được tạo và có thể thực hiện lại việc cho uống
                  thuốc. Chỉ có thể tạo trước 17h.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReRequestModal(false);
                    setReRequestReason("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateReRequest}
                  disabled={!reRequestReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                  Tạo yêu cầu lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Failed Modal */}
      {showMarkFailedModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Đánh dấu thất bại
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Đánh dấu yêu cầu thất bại cho học sinh:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedRequest.request?.student?.firstName}{" "}
                  {selectedRequest.request?.student?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thuốc:{" "}
                  {
                    selectedRequest.request?.medicineRequestItems?.[0]
                      ?.medicineName
                  }
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lý do đánh dấu thất bại *
                </label>
                <textarea
                  value={markFailedReason}
                  onChange={(e) => setMarkFailedReason(e.target.value)}
                  placeholder="Nhập lý do đánh dấu thất bại (ví dụ: không thể thực hiện được nữa...)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  required
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Đánh dấu thất bại sẽ kết thúc yêu cầu này và không thể tạo
                  lại.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowMarkFailedModal(false);
                    setMarkFailedReason("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleMarkAsFailed}
                  disabled={!markFailedReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300"
                >
                  Đánh dấu thất bại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-Requests Modal */}
      {showReRequestsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Danh sách yêu cầu lại cho #{selectedRequest.resultId}
                </h3>
                <button
                  onClick={() => setShowReRequestsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              {reRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có yêu cầu lại nào được tạo
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Lý do
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {reRequests.map((reRequest) => (
                        <tr key={reRequest.resultId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{reRequest.resultId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDateTime(reRequest.submittedAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {reRequest.reRequestReason || "Không có lý do"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {reRequest.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FailedRequestManagement;
