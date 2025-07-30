import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiAlertTriangle,
  FiRepeat,
  FiTrendingDown,
} from "react-icons/fi";
import { useRequestResults } from "../hooks/useRequestResults";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import {
  transformRequestResultData,
  filterRequestResults,
  filterByStatus,
} from "../utils/requestResultUtils";
import RequestResultTable from "../components/RequestResultTable";
import RequestResultDetailModal from "../components/RequestResultDetailModal";

const FailedAdministrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Load failed administrations using medicationService
  const loadFailedAdministrations = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getFailedMedicationRequests();
      if (response.success) {
        setResults(response.data);
      } else {
        console.error(
          "Error loading failed administrations:",
          response.message
        );
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading failed administrations:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Load failed administrations on mount
  useEffect(() => {
    loadFailedAdministrations();
  }, []);

  // Filter results directly (no need to transform since we're getting the right data structure)
  const filteredResults = results.filter((result) => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = result.studentName?.toLowerCase() || "";
    const medicineName = result.medicineName?.toLowerCase() || "";
    const className = result.className?.toLowerCase() || "";
    const requestId = result.requestId?.toString() || "";

    const matchesSearch =
      !searchTerm ||
      studentName.includes(searchLower) ||
      medicineName.includes(searchLower) ||
      className.includes(searchLower) ||
      requestId.includes(searchLower);

    const matchesDate =
      !filterDate || (result.date && result.date.startsWith(filterDate));

    return matchesSearch && matchesDate;
  });

  // Handle create re-request
  const handleCreateReRequest = async (result) => {
    const reason = window.prompt(
      `Lý do tạo yêu cầu lại cho thuốc ${result.medicineName}:`
    );

    if (reason && reason.trim()) {
      try {
        // You might need to implement this in medicationService if not already available
        // For now, just show a message
        alert("Chức năng tạo yêu cầu lại đang được phát triển");
        setShowDetailModal(false);
        // Reload failed data
        loadFailedAdministrations();
      } catch (error) {
        alert("Có lỗi xảy ra khi tạo yêu cầu lại");
      }
    }
  };

  // Handle view detail
  const handleViewDetail = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadFailedAdministrations();
  };

  // Calculate statistics
  const today = new Date().toISOString().split("T")[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayFailed = filteredResults.filter((result) => {
    const timestamp = result.timestamp || result.failedTimestamp;
    return (
      timestamp && new Date(timestamp).toISOString().split("T")[0] === today
    );
  }).length;

  const multipleFailures = filteredResults.filter(
    (result) => result.failedAttempts > 1
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 dark:border-red-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
            Cấp thuốc thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các lần cấp thuốc không thành công và cần xử lý
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Kiểm tra lại
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">
                Tổng thất bại
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">
                {filteredResults.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiTrendingDown className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Hôm nay
              </p>
              <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                {todayFailed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiRepeat className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Thất bại nhiều lần
              </p>
              <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {multipleFailures}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for failures */}
      {filteredResults.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Cần xử lý {filteredResults.length} trường hợp thất bại
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Vui lòng xem xét các lý do thất bại và tạo yêu cầu lại nếu cần
                thiết.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, thuốc, mã học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày thất bại
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Hiển thị {filteredResults.length} trường hợp thất bại
          {searchTerm && ` cho "${searchTerm}"`}
          {filterDate &&
            ` vào ngày ${new Date(filterDate).toLocaleDateString("vi-VN")}`}
        </span>
        {(searchTerm || filterDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Critical Failures Alert */}
      {filteredResults.some((result) => result.failedAttempts >= 3) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠️ Có trường hợp thất bại nghiêm trọng
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Một số trường hợp đã thất bại 3 lần trở lên. Cần liên hệ phụ
                huynh hoặc báo cáo lên cấp trên.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Học sinh & Lớp
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thuốc
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày thất bại
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lý do thất bại
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr
                    key={`${result.requestId}-${result.medicineRequestItemId}`}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    {/* Học sinh & Lớp */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {result.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp: {result.className}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Thuốc */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.medicineName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.dosage} {result.dosageUnit} - {result.frequency}{" "}
                        lần/ngày
                      </div>
                    </td>

                    {/* Ngày thất bại */}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {result.timestamp
                        ? new Date(result.timestamp).toLocaleDateString("vi-VN")
                        : result.failedTimestamp
                        ? new Date(result.failedTimestamp).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </td>

                    {/* Lý do thất bại */}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {result.failureReason || "Không có thông tin"}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        {result.status || result.failedStatus || "Failed"}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4 text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(result)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <FiAlertTriangle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCreateReRequest(result)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Tạo yêu cầu lại"
                        >
                          <FiRepeat className="h-4 w-4" />
                        </button>
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
      <RequestResultDetailModal
        result={selectedResult}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onCreateReRequest={handleCreateReRequest}
      />

      {/* Empty State */}
      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Không có trường hợp thất bại nào
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterDate
              ? "Không tìm thấy trường hợp thất bại nào với bộ lọc hiện tại."
              : "Tuyệt vời! Hiện tại không có trường hợp cấp thuốc thất bại nào."}
          </p>
        </div>
      )}
    </div>
  );
};

export default FailedAdministrations;
