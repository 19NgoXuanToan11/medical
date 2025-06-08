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

const StudentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "all";

  // State for student accounts
  const [students, setStudents] = useState([]);
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

  // State for student creation/editing
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    id: 0,
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    parentId: "",
    classId: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter Dropdown
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const API_URL = "http://localhost:7111/api";

  // Fetch student accounts and parent list for dropdown
  useEffect(() => {
    Promise.all([fetchStudents(), fetchParents()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const fetchStudents = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${API_URL}/Student`);
      const items = response.data;
      setStudents(items);

      // Calculate stats
      const total = items.length;
      const inactive = items.filter((item) => !item.isActive).length;

      setStats({
        total,
        inactive,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await axios.get(`${API_URL}/Parent`);
      setParents(response.data.filter((parent) => parent.isActive));
    } catch (error) {
      console.error("Error fetching parents:", error);
    }
  };

  // Create new student
  const createStudent = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        fullName: studentForm.fullName,
        dateOfBirth: studentForm.dateOfBirth,
        gender: studentForm.gender,
        parentId: parseInt(studentForm.parentId),
        classId: studentForm.classId ? parseInt(studentForm.classId) : null,
        isActive: studentForm.isActive,
      };

      await axios.post(`${API_URL}/Student`, data);
      fetchStudents();
      setShowStudentModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  // Update student
  const updateStudent = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        studentId: studentForm.id,
        fullName: studentForm.fullName,
        dateOfBirth: studentForm.dateOfBirth,
        gender: studentForm.gender,
        parentId: parseInt(studentForm.parentId),
        classId: studentForm.classId ? parseInt(studentForm.classId) : null,
        isActive: studentForm.isActive,
      };

      await axios.put(`${API_URL}/Student/${studentForm.id}`, data);
      fetchStudents();
      setShowStudentModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này không?")) {
      try {
        await axios.delete(`${API_URL}/Student/${id}`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  // Toggle student active status
  const toggleStudentStatus = async (item) => {
    try {
      const data = {
        studentId: item.studentId,
        fullName: item.fullName,
        dateOfBirth: item.dateOfBirth,
        gender: item.gender,
        parentId: item.parentId,
        classId: item.classId,
        isActive: !item.isActive,
      };

      await axios.put(`${API_URL}/Student/${item.studentId}`, data);
      fetchStudents();
    } catch (error) {
      console.error("Error toggling student status:", error);
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

  // Filter students based on search term and status
  const filteredStudents = students.filter((item) => {
    // Filter by search term
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.studentId && item.studentId.toString().includes(searchTerm));

    // Filter by status
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = item.isActive;
    } else if (filterStatus === "inactive") {
      matchesStatus = !item.isActive;
    }

    return matchesSearch && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case "id":
        comparison = a.studentId - b.studentId;
        break;
      case "dob":
        comparison = new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
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

  // Handle add/edit student
  const handleAddEditStudent = (item = null) => {
    if (item) {
      setStudentForm({
        id: item.studentId,
        fullName: item.fullName,
        dateOfBirth: item.dateOfBirth ? item.dateOfBirth.split("T")[0] : "",
        gender: item.gender || "Nam",
        parentId: item.parentId.toString(),
        classId: item.classId ? item.classId.toString() : "",
        isActive: item.isActive,
      });
      setSelectedStudent(item);
    } else {
      resetForm();
      setSelectedStudent(null);
    }
    setShowStudentModal(true);
  };

  // Reset form
  const resetForm = () => {
    setStudentForm({
      id: 0,
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      parentId: "",
      classId: "",
      isActive: true,
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!studentForm.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
    }

    if (!studentForm.dateOfBirth) {
      errors.dateOfBirth = "Vui lòng chọn ngày sinh";
    }

    if (!studentForm.parentId) {
      errors.parentId = "Vui lòng chọn phụ huynh";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentForm({
      ...studentForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      updateStudent();
    } else {
      createStudent();
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Get parent name
  const getParentName = (parentId) => {
    const parent = parents.find((p) => p.parentId === parentId);
    return parent ? parent.fullName : "Không xác định";
  };

  return (
    <div className="container mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Tổng số học sinh</div>
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
                Học sinh ngừng hoạt động
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
                placeholder="Tìm kiếm học sinh..."
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

          {/* Add Student */}
          <button
            onClick={() => handleAddEditStudent()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="ml-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : sortedStudents.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy học sinh
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Không tìm thấy học sinh nào phù hợp với tìm kiếm của bạn."
                : "Bắt đầu bằng cách thêm học sinh mới."}
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
                    onClick={() => handleSortChange("dob")}
                  >
                    Ngày sinh
                    {sortBy === "dob" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giới tính
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phụ huynh
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
                {sortedStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getParentName(student.parentId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAddEditStudent(student)}
                        className="text-teal-600 hover:text-teal-900 mr-3"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleStudentStatus(student)}
                        className={`mr-3 ${
                          student.isActive
                            ? "text-gray-600 hover:text-gray-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                      >
                        {student.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteStudent(student.studentId)}
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
      {showStudentModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowStudentModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedStudent ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
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
                    value={studentForm.fullName}
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
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className={`mt-1 block w-full border ${
                      formErrors.dateOfBirth
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={studentForm.dateOfBirth}
                    onChange={handleInputChange}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={studentForm.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="parentId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phụ huynh
                  </label>
                  <select
                    id="parentId"
                    name="parentId"
                    className={`mt-1 block w-full border ${
                      formErrors.parentId ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    value={studentForm.parentId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn phụ huynh --</option>
                    {parents.map((parent) => (
                      <option key={parent.parentId} value={parent.parentId}>
                        {parent.fullName} ({parent.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.parentId && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.parentId}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="classId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lớp học (nếu có)
                  </label>
                  <input
                    type="text"
                    name="classId"
                    id="classId"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={studentForm.classId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center mb-4">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={studentForm.isActive}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Học sinh đang hoạt động
                  </label>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                    onClick={() => {
                      setShowStudentModal(false);
                      resetForm();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                  >
                    {selectedStudent ? "Cập nhật" : "Thêm"}
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

export default StudentManagement;
