import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiEye,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiShield,
  FiActivity,
  FiPackage,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { vaccineService } from "../../../utils/api/vaccination/vaccinationService";

const VaccineManagement = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    dose: "",
    administrationMethod: "",
    description: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    expiringSoon: 0,
  });

  // Fetch vaccines data
  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await vaccineService.getAllVaccines();
      if (response.success) {
        setVaccines(response.data);
        calculateStats(response.data);
      } else {
        console.error("Error fetching vaccines:", response.message);
      }
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vaccineList) => {
    const total = vaccineList.length;
    const active = vaccineList.filter((v) => v.isActive).length;
    const inactive = total - active;

    // Calculate vaccines expiring within 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const expiringSoon = vaccineList.filter((v) => {
      if (!v.expiryDate) return false;
      const expiryDate = new Date(v.expiryDate);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    }).length;

    setStats({ total, active, inactive, expiringSoon });
  };

  // Filter vaccines based on search and status
  const filteredVaccines = vaccines.filter((vaccine) => {
    const matchesSearch =
      vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && vaccine.isActive) ||
      (statusFilter === "inactive" && !vaccine.isActive);

    return matchesSearch && matchesStatus;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      manufacturer: "",
      batchNumber: "",
      expiryDate: "",
      dose: "",
      administrationMethod: "",
      description: "",
      isActive: true,
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Tên vaccine là bắt buộc";
    }
    if (formData.name.length > 100) {
      errors.name = "Tên vaccine không được vượt quá 100 ký tự";
    }
    if (formData.manufacturer && formData.manufacturer.length > 100) {
      errors.manufacturer = "Nhà sản xuất không được vượt quá 100 ký tự";
    }
    if (formData.batchNumber && formData.batchNumber.length > 100) {
      errors.batchNumber = "Số lô không được vượt quá 100 ký tự";
    }
    if (formData.dose && formData.dose.length > 50) {
      errors.dose = "Liều lượng không được vượt quá 50 ký tự";
    }
    if (
      formData.administrationMethod &&
      formData.administrationMethod.length > 50
    ) {
      errors.administrationMethod =
        "Phương pháp tiêm không được vượt quá 50 ký tự";
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = "Mô tả không được vượt quá 500 ký tự";
    }
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate < today) {
        errors.expiryDate = "Ngày hết hạn không thể trong quá khứ";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create vaccine
  const handleCreateVaccine = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      const response = await vaccineService.createVaccine(formData);
      if (response.success) {
        setShowAddModal(false);
        resetForm();
        fetchVaccines();
        alert("Tạo vaccine mới thành công!");
      } else {
        alert(response.message || "Có lỗi xảy ra khi tạo vaccine");
      }
    } catch (error) {
      console.error("Error creating vaccine:", error);
      alert("Có lỗi xảy ra khi tạo vaccine");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit vaccine
  const handleEditVaccine = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      const response = await vaccineService.updateVaccine(
        selectedVaccine.vaccineId,
        formData
      );
      if (response.success) {
        setShowEditModal(false);
        resetForm();
        setSelectedVaccine(null);
        fetchVaccines();
        alert("Cập nhật vaccine thành công!");
      } else {
        alert(response.message || "Có lỗi xảy ra khi cập nhật vaccine");
      }
    } catch (error) {
      console.error("Error updating vaccine:", error);
      alert("Có lỗi xảy ra khi cập nhật vaccine");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete vaccine
  const handleDeleteVaccine = async () => {
    try {
      setActionLoading(true);
      const response = await vaccineService.deleteVaccine(
        selectedVaccine.vaccineId
      );
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedVaccine(null);
        fetchVaccines();
        alert("Xóa vaccine thành công!");
      } else {
        alert(response.message || "Có lỗi xảy ra khi xóa vaccine");
      }
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      alert("Có lỗi xảy ra khi xóa vaccine");
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setFormData({
      name: vaccine.name,
      manufacturer: vaccine.manufacturer || "",
      batchNumber: vaccine.batchNumber || "",
      expiryDate: vaccine.expiryDate ? vaccine.expiryDate.split("T")[0] : "",
      dose: vaccine.dose || "",
      administrationMethod: vaccine.administrationMethod || "",
      description: vaccine.description || "",
      isActive: vaccine.isActive,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowDeleteModal(true);
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  // Check if vaccine is expiring soon
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiRefreshCw className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Đang tải dữ liệu...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý Vaccine
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý thông tin vaccine trong hệ thống
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng số vaccine
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đang sử dụng
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Ngừng sử dụng
              </p>
              <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                {stats.inactive}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiX className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sắp hết hạn
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.expiringSoon}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm vaccine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Thêm vaccine
          </button>
        </div>
      </div>

      {/* Vaccines Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Tên vaccine
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Nhà sản xuất
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Số lô
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Liều lượng
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Hạn sử dụng
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Trạng thái
                </th>
                <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVaccines.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>Không có vaccine nào</p>
                  </td>
                </tr>
              ) : (
                filteredVaccines.map((vaccine) => (
                  <tr
                    key={vaccine.vaccineId}
                    className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {vaccine.name}
                      </div>
                      {vaccine.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {vaccine.description.length > 50
                            ? `${vaccine.description.substring(0, 50)}...`
                            : vaccine.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {vaccine.manufacturer || "—"}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {vaccine.batchNumber || "—"}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {vaccine.dose || "—"}
                    </td>
                    <td className="py-4 px-6">
                      {vaccine.expiryDate ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-gray-600 dark:text-gray-400 ${
                              isExpiringSoon(vaccine.expiryDate)
                                ? "text-orange-600 dark:text-orange-400"
                                : ""
                            }`}
                          >
                            {new Date(vaccine.expiryDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          {isExpiringSoon(vaccine.expiryDate) && (
                            <FiAlertTriangle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          vaccine.isActive
                        )}`}
                      >
                        {vaccine.isActive ? "Đang sử dụng" : "Ngừng sử dụng"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(vaccine)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(vaccine)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xóa"
                        >
                          <FiTrash2 className="h-4 w-4" />
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Thêm vaccine mới
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên vaccine *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập tên vaccine"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.manufacturer
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập nhà sản xuất"
                  />
                  {formErrors.manufacturer && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.manufacturer}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số lô
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, batchNumber: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.batchNumber
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập số lô"
                  />
                  {formErrors.batchNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.batchNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hạn sử dụng
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.expiryDate
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Liều lượng
                  </label>
                  <input
                    type="text"
                    value={formData.dose}
                    onChange={(e) =>
                      setFormData({ ...formData, dose: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.dose
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="VD: 0.5ml"
                  />
                  {formErrors.dose && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.dose}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phương pháp tiêm
                  </label>
                  <select
                    value={formData.administrationMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        administrationMethod: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.administrationMethod
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Chọn phương pháp</option>
                    <option value="IM">Tiêm bắp (IM)</option>
                    <option value="SC">Tiêm dưới da (SC)</option>
                    <option value="IV">Tiêm tĩnh mạch (IV)</option>
                    <option value="Oral">Uống (Oral)</option>
                  </select>
                  {formErrors.administrationMethod && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.administrationMethod}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Nhập mô tả vaccine"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                >
                  Đang sử dụng
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateVaccine}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && (
                  <FiRefreshCw className="h-4 w-4 animate-spin" />
                )}
                Thêm vaccine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chỉnh sửa vaccine
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên vaccine *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập tên vaccine"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.manufacturer
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập nhà sản xuất"
                  />
                  {formErrors.manufacturer && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.manufacturer}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số lô
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, batchNumber: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.batchNumber
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Nhập số lô"
                  />
                  {formErrors.batchNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.batchNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hạn sử dụng
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.expiryDate
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Liều lượng
                  </label>
                  <input
                    type="text"
                    value={formData.dose}
                    onChange={(e) =>
                      setFormData({ ...formData, dose: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.dose
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="VD: 0.5ml"
                  />
                  {formErrors.dose && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.dose}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phương pháp tiêm
                  </label>
                  <select
                    value={formData.administrationMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        administrationMethod: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                      formErrors.administrationMethod
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Chọn phương pháp</option>
                    <option value="IM">Tiêm bắp (IM)</option>
                    <option value="SC">Tiêm dưới da (SC)</option>
                    <option value="IV">Tiêm tĩnh mạch (IV)</option>
                    <option value="Oral">Uống (Oral)</option>
                  </select>
                  {formErrors.administrationMethod && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.administrationMethod}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Nhập mô tả vaccine"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActiveEdit"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                >
                  Đang sử dụng
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                onClick={handleEditVaccine}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && (
                  <FiRefreshCw className="h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                  <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Xác nhận xóa vaccine
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn có chắc chắn muốn xóa vaccine "{selectedVaccine.name}"? Hành
                động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteVaccine}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading && (
                    <FiRefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineManagement;
