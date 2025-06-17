import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiSave,
  FiX,
  FiEyeOff,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";
import {
  staffService,
  STAFF_ROLES,
  MANAGEABLE_ROLES,
  validateStaffData,
  getRoleDisplayInfo,
} from "../../../utils/staffService";

const StaffManagement = () => {
  // States for staff list
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    staffId: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState(null);

  // Toast notifications
  const [notification, setNotification] = useState(null);

  // Load staff data on component mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Fetch staff list from API
  const fetchStaffList = async () => {
    try {
      const result = await staffService.getAllStaff();
      if (result.success) {
        setStaffList(result.data);
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi tải danh sách nhân viên", "error");
    } finally {
      setLoading(false);
    }
  };

  // Refresh staff list
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStaffList();
    setRefreshing(false);
  };

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      staffId: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      roleId: "",
    });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Open modal for different modes
  const openModal = (mode, staff = null) => {
    setModalMode(mode);
    setSelectedStaff(staff);

    if (mode === "create") {
      resetForm();
    } else if (mode === "edit" && staff) {
      setFormData({
        staffId: staff.staffId || "",
        username: staff.username || "",
        password: "",
        confirmPassword: "",
        email: staff.email || "",
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        phone: staff.phone || "",
        roleId: staff.roleId || "",
      });
      setFormErrors({});
    } else if (mode === "view" && staff) {
      setFormData({
        staffId: staff.staffId || "",
        username: staff.username || "",
        password: "",
        confirmPassword: "",
        email: staff.email || "",
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        phone: staff.phone || "",
        roleId: staff.roleId || "",
      });
    }

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
    resetForm();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateStaffData(formData, modalMode === "edit");
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      let result;
      if (modalMode === "create") {
        result = await staffService.createStaff(formData);
      } else if (modalMode === "edit") {
        result = await staffService.updateStaff(
          selectedStaff.staffId,
          formData
        );
      }

      if (result.success) {
        showNotification(result.message, "success");
        closeModal();
        await fetchStaffList();
      } else {
        showNotification(result.message, "error");
        if (result.error && result.error.missingFields) {
          const fieldErrors = {};
          result.error.missingFields.forEach((field) => {
            fieldErrors[field] = "Trường này là bắt buộc";
          });
          setFormErrors(fieldErrors);
        }
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi xử lý yêu cầu", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (staff) => {
    setDeletingStaff(staff);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingStaff) return;

    try {
      const result = await staffService.deleteStaff(deletingStaff.staffId);
      if (result.success) {
        showNotification(result.message, "success");
        await fetchStaffList();
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi xóa nhân viên", "error");
    } finally {
      setShowDeleteModal(false);
      setDeletingStaff(null);
    }
  };

  // Filter and sort staff list
  const getFilteredStaff = () => {
    let filtered = [...staffList];

    // Filter out Admin users (roleId: 1) from display
    filtered = filtered.filter((staff) => staff.roleId !== 1);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (staff) =>
          staff.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      const selectedRoleId = parseInt(filterRole);
      filtered = filtered.filter((staff) => staff.roleId === selectedRoleId);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle null/undefined values
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      // Special handling for numeric fields
      if (sortBy === "staffId" || sortBy === "roleId") {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated staff
  const getPaginatedStaff = () => {
    const filtered = getFilteredStaff();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = () => {
    const filtered = getFilteredStaff();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // This function is now imported from staffService as getRoleDisplayInfo

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-600">
            Quản lý tài khoản và thông tin nhân viên
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus />
          Thêm nhân viên
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : notification.type === "error"
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {notification.message}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              {Object.values(MANAGEABLE_ROLES).map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="firstName">Tên</option>
              <option value="staffId">Staff ID</option>
              <option value="username">Tên đăng nhập</option>
              <option value="email">Email</option>
              <option value="roleId">Role ID</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sắp xếp ${sortOrder === "asc" ? "giảm dần" : "tăng dần"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="h-12">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center h-full">
                    <button
                      onClick={() => {
                        if (sortBy === "firstName") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("firstName");
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Người dùng
                      {sortBy === "firstName" && (
                        <span className="text-blue-600">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => {
                        if (sortBy === "staffId") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("staffId");
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Staff ID
                      {sortBy === "staffId" && (
                        <span className="text-blue-600">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => {
                        if (sortBy === "username") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("username");
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Tên đăng nhập
                      {sortBy === "username" && (
                        <span className="text-blue-600">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Vai trò
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => {
                        if (sortBy === "roleId") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("roleId");
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      Role ID
                      {sortBy === "roleId" && (
                        <span className="text-blue-600">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Số điện thoại
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedStaff().map((staff) => {
                const roleInfo = getRoleDisplayInfo(staff);
                return (
                  <tr key={staff.staffId} className="hover:bg-gray-50 h-16">
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center h-full">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {staff.firstName?.charAt(0)}
                              {staff.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.staffId || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-${roleInfo.color}-100 text-${roleInfo.color}-800`}
                        >
                          {roleInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.roleId || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.phone || "Chưa cập nhật"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium align-middle">
                      <div className="flex items-center justify-center space-x-3 h-full">
                        <button
                          onClick={() => openModal("view", staff)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Xem chi tiết"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal("edit", staff)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors p-1 rounded hover:bg-yellow-50"
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {getTotalPages() > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  getFilteredStaff().length
                )}{" "}
                trong tổng số {getFilteredStaff().length} nhân viên
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, getTotalPages())
                    )
                  }
                  disabled={currentPage === getTotalPages()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === "create"
                    ? "Thêm nhân viên mới"
                    : modalMode === "edit"
                    ? "Chỉnh sửa nhân viên"
                    : "Thông tin nhân viên"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Staff ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.staffId
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập Staff ID"
                    />
                    {formErrors.staffId && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.staffId}
                      </p>
                    )}
                  </div>

                  {/* Role ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.roleId ? "border-red-500" : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập Role ID"
                    />
                    {formErrors.roleId && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.roleId}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập tên đăng nhập"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập email"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập tên"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      * Tên không được viết dấu (ví dụ: An thay vì Ân)
                    </p>
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập họ"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      * Họ không được viết dấu (ví dụ: Nguyen thay vì Nguyễn)
                    </p>
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                      placeholder="Nhập số điện thoại"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password (only for create/edit) */}
                  {modalMode !== "view" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu{" "}
                          {modalMode === "create" && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder={
                              modalMode === "edit"
                                ? "Để trống nếu không đổi mật khẩu"
                                : "Nhập mật khẩu"
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FiEyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <FiEye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {formErrors.password && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.password}
                          </p>
                        )}
                      </div>

                      {modalMode === "create" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                formErrors.confirmPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Nhập lại mật khẩu"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? (
                                <FiEyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <FiEye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                              {formErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {modalMode === "view" ? "Đóng" : "Hủy"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          {modalMode === "create" ? "Tạo mới" : "Cập nhật"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xác nhận xóa
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa nhân viên{" "}
                  <strong>
                    {deletingStaff?.firstName} {deletingStaff?.lastName}
                  </strong>{" "}
                  không? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
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

export default StaffManagement;
