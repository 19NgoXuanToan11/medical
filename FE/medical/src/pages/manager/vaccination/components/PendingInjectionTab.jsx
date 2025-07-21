import React, { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiActivity,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";
import { injectionFormService } from "../../../../utils/api/injection/injectionService";
import InjectionFormCard from "./InjectionFormCard";
import InjectionFormDetailModal from "./InjectionFormDetailModal";

const PendingInjectionTab = ({ onApprovalAction, setSelectedForm }) => {
  const [injectionForms, setInjectionForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFormForDetail, setSelectedFormForDetail] = useState(null);

  // Load pending injection forms
  const loadPendingInjectionForms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await injectionFormService.getPendingInjectionForms();

      if (response.success) {
        setInjectionForms(response.data || []);
      } else {
        console.error(
          "Error loading pending injection forms:",
          response.message
        );
        setError(
          response.message ||
            "Không thể tải danh sách phiếu tiêm chủng chờ duyệt"
        );
        setInjectionForms([]);
      }
    } catch (error) {
      console.error("Error loading pending injection forms:", error);
      setError("Có lỗi xảy ra khi tải danh sách phiếu tiêm chủng");
      setInjectionForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredForms(injectionForms);
    } else {
      const filtered = injectionForms.filter((form) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          form.injectionName?.toLowerCase().includes(searchLower) ||
          form.student?.fullName?.toLowerCase().includes(searchLower) ||
          form.parent?.fullName?.toLowerCase().includes(searchLower) ||
          form.className?.toLowerCase().includes(searchLower) ||
          form.formId?.toString().includes(searchLower) ||
          form.description?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredForms(filtered);
    }
  }, [searchTerm, injectionForms]);

  // Load data on component mount
  useEffect(() => {
    loadPendingInjectionForms();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadPendingInjectionForms();
  };

  // Handle view detail
  const handleViewDetail = (form) => {
    setSelectedFormForDetail(form);
    setShowDetailModal(true);
  };

  // Handle approval action from detail modal
  const handleApprovalActionFromModal = (action) => {
    setSelectedForm(selectedFormForDetail);
    onApprovalAction(action);
  };

  // Get urgent forms (forms that need immediate attention)
  const urgentForms = filteredForms.filter((form) => {
    if (!form.createdDate) return false;
    const createdDate = new Date(form.createdDate);
    const now = new Date();
    const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
    return hoursDiff > 24; // Forms older than 24 hours
  });

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Phiếu tiêm chủng chờ duyệt ({filteredForms.length})
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && <ErrorMessage error={error} />}

      {/* Search and Filter */}
      <SearchAndFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Urgent Forms Alert */}
      {urgentForms.length > 0 && (
        <UrgentFormsAlert urgentCount={urgentForms.length} />
      )}

      {/* Statistics */}
      <StatisticsCards forms={filteredForms} />

      {/* Injection Forms List */}
      <InjectionFormsList
        forms={filteredForms}
        onViewDetail={handleViewDetail}
        onApprovalAction={onApprovalAction}
        setSelectedForm={setSelectedForm}
        loading={loading}
        error={error}
      />

      {/* Detail Modal */}
      <InjectionFormDetailModal
        showModal={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedForm={selectedFormForDetail}
        onApprovalAction={handleApprovalActionFromModal}
      />
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
    <div className="flex items-center justify-center">
      <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
      <span className="text-gray-600 dark:text-gray-300">
        Đang tải dữ liệu...
      </span>
    </div>
  </div>
);

// Error message component
const ErrorMessage = ({ error }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
    <div className="flex items-center">
      <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
      <div>
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
          Có lỗi xảy ra
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
      </div>
    </div>
  </div>
);

// Search and filter component
const SearchAndFilter = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên vaccine, học sinh, phụ huynh, lớp học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center gap-2">
        <FiFilter className="h-4 w-4" />
        Bộ lọc
      </button>
    </div>
  </div>
);

// Urgent forms alert
const UrgentFormsAlert = ({ urgentCount }) => (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
    <div className="flex items-center">
      <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
      <div>
        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          ⚠️ CẦN XEM XÉT NGAY
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          Có {urgentCount} phiếu tiêm chủng đã chờ duyệt quá 24 giờ. Vui lòng
          xem xét để đảm bảo việc tiêm chủng được thực hiện đúng lịch.
        </p>
      </div>
    </div>
  </div>
);

// Statistics cards
const StatisticsCards = ({ forms }) => {
  const totalForms = forms.length;
  const approvedParents = forms.filter(
    (form) => form.consentStatus?.toLowerCase() === "approved"
  ).length;
  const pendingParents = forms.filter(
    (form) => form.consentStatus?.toLowerCase() === "pending"
  ).length;
  const rejectedParents = forms.filter(
    (form) => form.consentStatus?.toLowerCase() === "rejected"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Tổng phiếu
            </p>
            <p className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">
              {totalForms}
            </p>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FiShield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              PH đồng ý
            </p>
            <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
              {approvedParents}
            </p>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <FiActivity className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Chờ PH</p>
            <p className="text-xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
              {pendingParents}
            </p>
          </div>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <FiRefreshCw className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              PH từ chối
            </p>
            <p className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">
              {rejectedParents}
            </p>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <FiAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Injection forms list
const InjectionFormsList = ({
  forms,
  onViewDetail,
  onApprovalAction,
  setSelectedForm,
  loading,
  error,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (forms.length === 0) {
    return <EmptyState />;
  }

  // Sort forms: urgent first, then by creation date
  const sortedForms = forms.sort((a, b) => {
    const aCreated = new Date(a.createdDate);
    const bCreated = new Date(b.createdDate);
    const now = new Date();

    const aUrgent = (now - aCreated) / (1000 * 60 * 60) > 24;
    const bUrgent = (now - bCreated) / (1000 * 60 * 60) > 24;

    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;

    return bCreated - aCreated; // Newest first
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedForms.map((form) => (
        <InjectionFormCard
          key={form.formId}
          injectionForm={form}
          onViewDetail={onViewDetail}
          onApprovalAction={onApprovalAction}
          setSelectedForm={setSelectedForm}
        />
      ))}
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
    <FiShield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Không có phiếu tiêm chủng chờ duyệt
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Tất cả phiếu tiêm chủng đã được xử lý hoặc chưa có phiếu nào được tạo
    </p>
  </div>
);

export default PendingInjectionTab;
