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
  securityUtils,
} from "../../../utils/staff/staffService";

/**
 * StaffManagement Component
 *
 * SECURITY NOTICE: This component implements strict security measures to prevent
 * unauthorized access to admin accounts:
 * 1. Admin users (roleId: 1) are completely hidden from display
 * 2. Creating/editing admin roles is strictly prohibited
 * 3. Only Manager (roleId: 2) and Nurse (roleId: 3) roles can be managed
 * 4. Multiple validation layers ensure data integrity
 */
const StaffManagement = () => {
  // States for staff list
  const [staffList, setStaffList] = useState([]);
  const [gradeNurses, setGradeNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
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

      // Fetch grade-nurse assignments
      try {
        const gradeNurseResult = await staffService.getAllGradeNurses();
        if (gradeNurseResult.success) {
          setGradeNurses(gradeNurseResult.data);
        }
      } catch (gradeError) {
        console.error("Error fetching grade assignments:", gradeError);
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

  // Get assigned grades for a nurse
  const getAssignedGrades = (staffId) => {
    if (!gradeNurses || gradeNurses.length === 0) return [];
    const assignments = gradeNurses.filter((gn) => gn.staffId === staffId);
    return assignments.map((assignment) => assignment.grade).sort();
  };

  // Format assigned grades display
  const formatAssignedGrades = (grades) => {
    if (!grades || grades.length === 0) {
      return <span className="text-gray-400 text-sm">Chưa phân công</span>;
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {grades.map((grade) => (
          <span
            key={grade}
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              grade === 1
                ? "bg-blue-100 text-blue-800"
                : grade === 2
                ? "bg-green-100 text-green-800"
                : grade === 3
                ? "bg-yellow-100 text-yellow-800"
                : grade === 4
                ? "bg-purple-100 text-purple-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            Khối {grade}
          </span>
        ))}
      </div>
    );
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

    // Additional security check: Prevent creating admin users
    if (parseInt(formData.roleId) === 1) {
      securityUtils.logSecurityViolation("ADMIN_CREATION_ATTEMPT", {
        action: modalMode,
        formData: {
          ...formData,
          password: "[REDACTED]",
          confirmPassword: "[REDACTED]",
        },
      });
      showNotification(
        "Không được phép tạo tài khoản Admin qua giao diện này",
        "error"
      );
      return;
    }

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
        } else if (result.error && result.error.securityViolation) {
          // Log security violation for monitoring
          console.warn(
            "Security violation detected:",
            result.error.securityViolation
          );
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
    // Security check: Additional validation before allowing delete
    if (staff.roleId === 1) {
      securityUtils.logSecurityViolation("ADMIN_DELETE_ATTEMPT", {
        targetStaff: {
          id: staff.staffId,
          username: staff.username,
          roleId: staff.roleId,
        },
      });
      showNotification("Không được phép xóa tài khoản Admin", "error");
      return;
    }

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

    // Security: Filter out Admin users (roleId: 1) from display - CRITICAL SECURITY MEASURE
    filtered = filtered.filter((staff) => {
      // Double check to ensure no admin users are displayed
      return (
        staff.roleId !== 1 &&
        staff.roleName !== "Admin" &&
        staff.roleName !== "Quản trị viên"
      );
    });

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
      // Additional security check: ensure we're not filtering for admin role
      if (selectedRoleId !== 1) {
        filtered = filtered.filter((staff) => staff.roleId === selectedRoleId);
      }
    }

    // Apply grade filter (only for nurses)
    if (filterGrade !== "all") {
      filtered = filtered.filter((staff) => {
        if (staff.roleId !== 3) {
          // For non-nurses, show them only if filter is "none"
          return filterGrade === "none";
        }

        const assignedGrades = getAssignedGrades(staff.staffId);
        if (filterGrade === "none") {
          return assignedGrades.length === 0;
        }

        return assignedGrades.includes(parseInt(filterGrade));
      });
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
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Quản lý nhân viên
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Quản lý tài khoản và thông tin nhân viên y tế
            </p>
          </div>
          <button
            onClick={() => openModal("create")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : notification.type === "error"
              ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
          }`}
        >
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {notification.message}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-neutral-400 dark:text-neutral-500" />
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả vai trò</option>
              {Object.values(MANAGEABLE_ROLES).map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filterGrade}
              onChange={(e) => {
                setFilterGrade(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả khối</option>
              <option value="1">Khối 1</option>
              <option value="2">Khối 2</option>
              <option value="3">Khối 3</option>
              <option value="4">Khối 4</option>
              <option value="5">Khối 5</option>
              <option value="none">Chưa phân công</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="firstName">Tên</option>
              <option value="username">Tên đăng nhập</option>
              <option value="email">Email</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
              title={`Sắp xếp ${sortOrder === "asc" ? "giảm dần" : "tăng dần"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
              <tr className="h-12">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
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
                      className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Người dùng
                      {sortBy === "firstName" && (
                        <span className="text-primary-600 dark:text-primary-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
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
                      className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Tên đăng nhập
                      {sortBy === "username" && (
                        <span className="text-primary-600 dark:text-primary-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Vai trò
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Khối phụ trách
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Số điện thoại
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider align-middle">
                  <div className="flex items-center justify-center h-full">
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {getPaginatedStaff().map((staff) => {
                const roleInfo = getRoleDisplayInfo(staff);
                return (
                  <tr
                    key={staff.staffId}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700 h-16"
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center h-full">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                              {staff.firstName?.charAt(0)}
                              {staff.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100 align-middle text-center">
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
                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.roleId === 3 ? (
                          (() => {
                            const grades = getAssignedGrades(staff.staffId);
                            return formatAssignedGrades(grades);
                          })()
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Không áp dụng
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100 align-middle text-center">
                      <div className="flex items-center justify-center h-full">
                        {staff.phone || "Chưa cập nhật"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium align-middle">
                      <div className="flex items-center justify-center space-x-3 h-full">
                        <button
                          onClick={() => openModal("view", staff)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors p-1 rounded hover:bg-primary-50 dark:hover:bg-primary-700"
                          title="Xem chi tiết"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal("edit", staff)}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-700"
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-100 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-700"
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
          <div className="bg-white dark:bg-neutral-800 px-4 py-3 border-t border-neutral-200 dark:border-neutral-600 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-700 dark:text-neutral-300">
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
                  className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? "bg-primary-600 text-white border-primary-600"
                          : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
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
                  className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-neutral-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-neutral-300 dark:border-neutral-600 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-neutral-800">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-600">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {modalMode === "create"
                    ? "Thêm nhân viên mới"
                    : modalMode === "edit"
                    ? "Chỉnh sửa nhân viên"
                    : "Thông tin nhân viên"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.roleId ? "border-red-500" : "border-gray-300"
                      } ${modalMode === "view" ? "bg-gray-50" : ""}`}
                    >
                      <option value="">Chọn vai trò</option>
                      {Object.values(MANAGEABLE_ROLES).map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      * Chỉ có thể tạo tài khoản Quản lý và Nhân viên y tế
                    </p>
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
