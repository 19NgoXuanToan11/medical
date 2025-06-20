import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPlus,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiEdit,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiUser,
} from "react-icons/fi";

const ParentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "all";

  // State for parent accounts
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stats, setStats] = useState({
    total: 0,
    inactive: 0,
  });

  // State for parent creation/editing
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentForm, setParentForm] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    studentId: null,
    relationship: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    isEmergencyContact: false,
    isMainContact: false,
    isActive: true,
    password: "",
    studentName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Filter Dropdown
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const API_URL = "https://localhost:7111/api";

  // Fetch parent accounts
  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${API_URL}/Parent`);
      const items = response.data;
      setParents(items);

      // Calculate stats
      const total = items.length;
      const inactive = items.filter((item) => !item.isActive).length;

      setStats({
        total,
        inactive,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching parents:", error);
      setLoading(false);
    }
  };

  // Create new parent
  const createParent = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        firstName: parentForm.firstName,
        lastName: parentForm.lastName,
        studentId: parentForm.studentId,
        relationship: parentForm.relationship,
        email: parentForm.email,
        phone: parentForm.phone,
        address: parentForm.address,
        occupation: parentForm.occupation,
        isEmergencyContact: parentForm.isEmergencyContact,
        isMainContact: parentForm.isMainContact,
        isActive: parentForm.isActive,
        password: parentForm.password,
        studentName: parentForm.studentName,
      };

      await axios.post(`${API_URL}/Parent`, data);
      fetchParents();
      setShowParentModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating parent:", error);
    }
  };

  // Update parent
  const updateParent = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        parentId: parentForm.id,
        firstName: parentForm.firstName,
        lastName: parentForm.lastName,
        studentId: parentForm.studentId,
        relationship: parentForm.relationship,
        email: parentForm.email,
        phone: parentForm.phone,
        address: parentForm.address,
        occupation: parentForm.occupation,
        isEmergencyContact: parentForm.isEmergencyContact,
        isMainContact: parentForm.isMainContact,
        isActive: parentForm.isActive,
        studentName: parentForm.studentName,
      };

      // Only include password if it's been changed
      if (parentForm.password) {
        data.password = parentForm.password;
      }

      await axios.put(`${API_URL}/Parent/${parentForm.id}`, data);
      fetchParents();
      setShowParentModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating parent:", error);
    }
  };

  // Delete parent
  const deleteParent = async (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tài khoản phụ huynh này không?")
    ) {
      try {
        await axios.delete(`${API_URL}/Parent/${id}`);
        fetchParents();
      } catch (error) {
        console.error("Error deleting parent:", error);
      }
    }
  };

  // Toggle parent active status
  const toggleParentStatus = async (item) => {
    try {
      const data = {
        parentId: item.parentId,
        firstName: item.firstName,
        lastName: item.lastName,
        studentId: item.studentId,
        relationship: item.relationship,
        email: item.email,
        phone: item.phone,
        address: item.address,
        occupation: item.occupation,
        isEmergencyContact: item.isEmergencyContact,
        isMainContact: item.isMainContact,
        isActive: !item.isActive,
        studentName: item.studentName,
      };

      await axios.put(`${API_URL}/Parent/${item.parentId}`, data);
      fetchParents();
    } catch (error) {
      console.error("Error toggling parent status:", error);
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);

    // Update URL
    const params = new URLSearchParams(location.search);
    params.set("filter", status);
    navigate({ search: params.toString() });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterStatus("all");
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");

    // Update URL
    const params = new URLSearchParams(location.search);
    params.delete("filter");
    navigate({ search: params.toString() });
  };

  // Filter parents based on search term and status
  const filteredParents = parents.filter((item) => {
    // Filter by search term
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.parentId && item.parentId.toString().includes(searchTerm));

    // Filter by status
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = item.isActive;
    } else if (filterStatus === "inactive") {
      matchesStatus = !item.isActive;
    }

    return matchesSearch && matchesStatus;
  });

  // Sort parents
  const sortedParents = [...filteredParents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        const fullNameA = `${a.firstName} ${a.lastName}`;
        const fullNameB = `${b.firstName} ${b.lastName}`;
        comparison = fullNameA.localeCompare(fullNameB);
        break;
      case "id":
        comparison = a.parentId - b.parentId;
        break;
      case "email":
        comparison = (a.email || "").localeCompare(b.email || "");
        break;
      case "relationship":
        comparison = (a.relationship || "").localeCompare(b.relationship || "");
        break;
      case "occupation":
        comparison = (a.occupation || "").localeCompare(b.occupation || "");
        break;
      case "address":
        comparison = (a.address || "").localeCompare(b.address || "");
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle sort change
  function handleSortChange(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  // Handle add/edit parent
  const handleAddEditParent = (item = null) => {
    if (item) {
      setParentForm({
        id: item.parentId,
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        studentId: item.studentId,
        relationship: item.relationship || "",
        email: item.email || "",
        phone: item.phone || "",
        address: item.address || "",
        occupation: item.occupation || "",
        isEmergencyContact: item.isEmergencyContact || false,
        isMainContact: item.isMainContact || false,
        isActive: item.isActive,
        password: "", // Don't include the password when editing
        studentName: item.studentName || "",
      });
      setSelectedParent(item);
    } else {
      resetForm();
      setSelectedParent(null);
    }
    setShowParentModal(true);
  };

  // Reset form
  const resetForm = () => {
    setParentForm({
      id: 0,
      firstName: "",
      lastName: "",
      studentId: null,
      relationship: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      isEmergencyContact: false,
      isMainContact: false,
      isActive: true,
      password: "",
      studentName: "",
    });
    setFormErrors({});
    setShowPassword(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!parentForm.firstName.trim()) {
      errors.firstName = "Vui lòng nhập họ";
    }

    if (!parentForm.lastName.trim()) {
      errors.lastName = "Vui lòng nhập tên";
    }

    if (!parentForm.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(parentForm.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!parentForm.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(parentForm.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!parentForm.relationship.trim()) {
      errors.relationship = "Vui lòng nhập mối quan hệ";
    }

    if (!selectedParent && !parentForm.password.trim()) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (parentForm.password && parentForm.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentForm({
      ...parentForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedParent) {
      updateParent();
    } else {
      createParent();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
      <div className="flex flex-col mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Quản lý phụ huynh
          </h2>
          <p className="text-neutral-600 mt-1">
            Theo dõi và quản lý danh sách phụ huynh tại trường
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handleAddEditParent()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FiPlus className="mr-2" />
            Thêm phụ huynh mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 flex justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">
              Tổng số phụ huynh
            </p>
            <p className="text-3xl font-bold text-primary-700">{stats.total}</p>
          </div>
          <div className="bg-primary-100 h-12 w-12 rounded-full flex items-center justify-center">
            <FiUser className="h-6 w-6 text-primary-600" />
          </div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">
              Ngừng hoạt động
            </p>
            <p className="text-3xl font-bold text-neutral-700">
              {stats.inactive}
            </p>
          </div>
          <div className="bg-neutral-200 h-12 w-12 rounded-full flex items-center justify-center">
            <FiX className="h-6 w-6 text-neutral-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-50 p-4 rounded-lg mb-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-neutral-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm phụ huynh..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="md:ml-auto flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-300"
          >
            <FiRefreshCw className="mr-1" />
            Đặt lại
          </button>
        </div>
      </div>

      {/* Parent Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-y border-neutral-200">
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("id")}
              >
                <div className="flex items-center justify-center">
                  ID
                  {sortBy === "id" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("name")}
              >
                <div className="flex items-center justify-center">
                  Họ tên
                  {sortBy === "name" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("relationship")}
              >
                <div className="flex items-center justify-center">
                  Mối quan hệ
                  {sortBy === "relationship" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("email")}
              >
                <div className="flex items-center justify-center">
                  Email
                  {sortBy === "email" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("phone")}
              >
                <div className="flex items-center justify-center">
                  Số điện thoại
                  {sortBy === "phone" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("occupation")}
              >
                <div className="flex items-center justify-center">
                  Nghề nghiệp
                  {sortBy === "occupation" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("address")}
              >
                <div className="flex items-center justify-center">
                  Địa chỉ
                  {sortBy === "address" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider h-14 w-32 min-w-[128px]">
                Liên hệ
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider h-14 w-32 min-w-[128px]">
                Trạng thái
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 uppercase tracking-wider h-14">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-primary-600 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : sortedParents.length > 0 ? (
              sortedParents.map((parent) => (
                <tr
                  key={parent.parentId}
                  className="hover:bg-neutral-50 transition-colors duration-200 h-16"
                >
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.parentId}
                  </td>
                  <td className="py-4 px-6 align-middle">
                    <div className="flex items-center justify-center">
                      <span className="font-medium text-neutral-900">
                        {parent.firstName} {parent.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.relationship}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.email}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.phone}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.occupation}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900">
                    {parent.address}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-32 min-w-[128px]">
                    <div className="flex flex-col items-center space-y-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          parent.isEmergencyContact
                            ? "bg-red-100 text-red-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {parent.isEmergencyContact ? "Khẩn cấp" : "Thường"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          parent.isMainContact
                            ? "bg-blue-100 text-blue-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {parent.isMainContact ? "Chính" : "Phụ"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-32 min-w-[128px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        parent.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {parent.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center align-middle">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleAddEditParent(parent)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Chỉnh sửa"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleParentStatus(parent)}
                        className={`${
                          parent.isActive
                            ? "text-neutral-600 hover:text-neutral-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={
                          parent.isActive
                            ? "Đánh dấu ngừng hoạt động"
                            : "Đánh dấu đang hoạt động"
                        }
                      >
                        {parent.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteParent(parent.parentId)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-neutral-600 text-lg">
                      Không tìm thấy phụ huynh nào phù hợp
                    </p>
                    <p className="text-neutral-500 text-sm mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 bg-primary-100 text-primary-700 hover:bg-primary-200 px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
                    >
                      <FiRefreshCw className="mr-2" />
                      Đặt lại bộ lọc
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Parent Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">
                {selectedParent ? "Chỉnh sửa phụ huynh" : "Thêm phụ huynh mới"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className={`mt-1 block w-full border ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      value={parentForm.firstName}
                      onChange={handleInputChange}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className={`mt-1 block w-full border ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      value={parentForm.lastName}
                      onChange={handleInputChange}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    id="studentId"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={parentForm.studentId || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="studentName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên học sinh
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    id="studentName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={parentForm.studentName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mối quan hệ
                  </label>
                  <select
                    name="relationship"
                    id="relationship"
                    className={`mt-1 block w-full border ${
                      formErrors.relationship
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={parentForm.relationship}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn mối quan hệ --</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Bố">Bố</option>
                    <option value="Ông">Ông</option>
                    <option value="Bà">Bà</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {formErrors.relationship && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.relationship}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`mt-1 block w-full border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={parentForm.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className={`mt-1 block w-full border ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={parentForm.phone}
                    onChange={handleInputChange}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={parentForm.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={parentForm.occupation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {selectedParent
                      ? "Mật khẩu mới (để trống nếu không thay đổi)"
                      : "Mật khẩu"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className={`mt-1 block w-full border ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      value={parentForm.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={parentForm.isActive}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Đang hoạt động
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isEmergencyContact"
                      name="isEmergencyContact"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={parentForm.isEmergencyContact}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="isEmergencyContact"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Liên hệ khẩn cấp
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isMainContact"
                      name="isMainContact"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={parentForm.isMainContact}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="isMainContact"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Liên hệ chính
                    </label>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                    onClick={() => {
                      setShowParentModal(false);
                      resetForm();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                  >
                    {selectedParent ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentManagement;
