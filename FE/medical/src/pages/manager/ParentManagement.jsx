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
    fullName: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Filter Dropdown
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const API_URL = "http://localhost:7111/api";

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
        fullName: parentForm.fullName,
        email: parentForm.email,
        phone: parentForm.phone,
        address: parentForm.address,
        password: parentForm.password,
        isActive: parentForm.isActive,
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
        fullName: parentForm.fullName,
        email: parentForm.email,
        phone: parentForm.phone,
        address: parentForm.address,
        isActive: parentForm.isActive,
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
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        address: item.address,
        isActive: !item.isActive,
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
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
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
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case "id":
        comparison = a.parentId - b.parentId;
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
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
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        address: item.address || "",
        isActive: item.isActive,
        password: "", // Don't include the password when editing
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
      fullName: "",
      email: "",
      phone: "",
      address: "",
      isActive: true,
      password: "",
    });
    setFormErrors({});
    setShowPassword(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!parentForm.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
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
    <div className="container mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Tổng số phụ huynh</div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <FiUser className="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">
                Tài khoản ngừng hoạt động
              </div>
              <div className="text-3xl font-bold">{stats.inactive}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FiX className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Tìm kiếm phụ huynh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  id="filter-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
                  {filterStatus === "all"
                    ? "Tất cả"
                    : filterStatus === "active"
                    ? "Đang hoạt động"
                    : "Ngừng hoạt động"}
                </button>
              </div>

              {showFilterMenu && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="filter-menu"
                  >
                    <button
                      onClick={() => {
                        handleFilterChange("all");
                        setShowFilterMenu(false);
                      }}
                      className={`${
                        filterStatus === "all"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange("active");
                        setShowFilterMenu(false);
                      }}
                      className={`${
                        filterStatus === "active"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Đang hoạt động
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange("inactive");
                        setShowFilterMenu(false);
                      }}
                      className={`${
                        filterStatus === "inactive"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Ngừng hoạt động
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4 text-gray-500" />
              Đặt lại
            </button>
          </div>

          {/* Add Parent */}
          <button
            onClick={() => handleAddEditParent()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Thêm phụ huynh
          </button>
        </div>
      </div>

      {/* Parent List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="ml-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : sortedParents.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy phụ huynh
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Không tìm thấy phụ huynh nào phù hợp với tìm kiếm của bạn."
                : "Bắt đầu bằng cách thêm phụ huynh mới."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("id")}
                  >
                    ID
                    {sortBy === "id" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("name")}
                  >
                    Họ tên
                    {sortBy === "name" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("email")}
                  >
                    Email
                    {sortBy === "email" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số điện thoại
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
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedParents.map((parent) => (
                  <tr key={parent.parentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parent.parentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {parent.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parent.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parent.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          parent.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {parent.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAddEditParent(parent)}
                        className="text-teal-600 hover:text-teal-900 mr-3"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleParentStatus(parent)}
                        className={`mr-3 ${
                          parent.isActive
                            ? "text-gray-600 hover:text-gray-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                      >
                        {parent.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteParent(parent.parentId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowParentModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedParent ? "Chỉnh sửa phụ huynh" : "Thêm phụ huynh mới"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className={`mt-1 block w-full border ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={parentForm.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.fullName}
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

                <div className="flex items-center mb-4">
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
                    Tài khoản đang hoạt động
                  </label>
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
