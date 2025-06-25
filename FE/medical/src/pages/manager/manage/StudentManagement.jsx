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
  FiAlertTriangle,
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
    studentId: 0,
    studentCode: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Nam",
    className: "",
    gradeLevel: "",
    address: "",
    parentId: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const API_URL = "https://localhost:7111/api";

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
        studentCode: studentForm.studentCode,
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        dateOfBirth: studentForm.dateOfBirth,
        gender: studentForm.gender,
        className: studentForm.className,
        gradeLevel: parseInt(studentForm.gradeLevel) || 0,
        address: studentForm.address,
        parentId: parseInt(studentForm.parentId),
        isActive: true,
      };

      const response = await axios.post(`${API_URL}/Student`, data);
      if (response.status === 200) {
        alert("Thêm học sinh thành công");
        fetchStudents();
        setShowStudentModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Có lỗi xảy ra khi thêm học sinh. Vui lòng thử lại!");
    }
  };

  // Update student
  const updateStudent = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        studentId: studentForm.studentId,
        studentCode: studentForm.studentCode,
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        dateOfBirth: studentForm.dateOfBirth,
        gender: studentForm.gender,
        className: studentForm.className,
        gradeLevel: parseInt(studentForm.gradeLevel) || 0,
        address: studentForm.address,
        parentId: parseInt(studentForm.parentId),
      };

      await axios.put(`${API_URL}/Student/${studentForm.studentId}`, data);
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
        studentCode: item.studentCode,
        firstName: item.firstName,
        lastName: item.lastName,
        dateOfBirth: item.dateOfBirth,
        gender: item.gender,
        className: item.className,
        gradeLevel: item.gradeLevel,
        address: item.address,
        parentId: item.parentId,
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
    const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim();
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.studentCode &&
        item.studentCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        const fullNameA = `${a.lastName || ""} ${a.firstName || ""}`.trim();
        const fullNameB = `${b.lastName || ""} ${b.firstName || ""}`.trim();
        comparison = fullNameA.localeCompare(fullNameB);
        break;
      case "id":
        comparison = a.studentId - b.studentId;
        break;
      case "dob":
        comparison = new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
        break;
      case "gradeLevel":
        comparison = a.gradeLevel - b.gradeLevel;
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
        studentId: item.studentId,
        studentCode: item.studentCode || "",
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        dateOfBirth: item.dateOfBirth ? item.dateOfBirth.split("T")[0] : "",
        gender: item.gender || "Nam",
        className: item.className || "",
        gradeLevel: item.gradeLevel ? item.gradeLevel.toString() : "",
        address: item.address || "",
        parentId: item.parentId ? item.parentId.toString() : "",
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
      studentId: 0,
      studentCode: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "Nam",
      className: "",
      gradeLevel: "",
      address: "",
      parentId: "",
      isActive: true,
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!studentForm.firstName.trim()) {
      errors.firstName = "Họ không được để trống";
    }
    if (!studentForm.lastName.trim()) {
      errors.lastName = "Tên không được để trống";
    }
    if (!studentForm.dateOfBirth) {
      errors.dateOfBirth = "Ngày sinh không được để trống";
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

  // Get full name
  const getFullName = (student) => {
    return `${student.firstName || ""} ${student.lastName || ""}`.trim();
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
      <div className="flex flex-col mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            Quản lý học sinh
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1">
            Theo dõi và quản lý danh sách học sinh tại trường
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handleAddEditStudent()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FiPlus className="mr-2" />
            Thêm học sinh mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg border border-primary-100 dark:border-primary-800 flex justify-between">
          <div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">
              Tổng số học sinh
            </p>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">
              {stats.total}
            </p>
          </div>
          <div className="bg-primary-100 dark:bg-primary-800 h-12 w-12 rounded-full flex items-center justify-center">
            <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 flex justify-between">
          <div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">
              Ngừng hoạt động
            </p>
            <p className="text-3xl font-bold text-neutral-700 dark:text-neutral-200">
              {stats.inactive}
            </p>
          </div>
          <div className="bg-neutral-200 h-12 w-12 rounded-full flex items-center justify-center">
            <FiX className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg mb-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-neutral-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white dark:bg-neutral-700"
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

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-neutral-800 border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-600">
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-200 h-14">
                <div className="flex items-center justify-center">
                  MÃ HỌC SINH
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("name")}
              >
                <div className="flex items-center justify-center">
                  HỌ TÊN
                  {sortBy === "name" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("dob")}
              >
                <div className="flex items-center justify-center">
                  NGÀY SINH
                  {sortBy === "dob" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14">
                GIỚI TÍNH
              </th>
              <th
                className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-200 h-14"
                onClick={() => handleSortChange("gradeLevel")}
              >
                <div className="flex items-center justify-center">
                  LỚP
                  {sortBy === "gradeLevel" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14">
                KHỐI
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14">
                ĐỊA CHỈ
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14">
                PHỤ HUYNH
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14 w-32 min-w-[128px]">
                TRẠNG THÁI
              </th>
              <th className="py-4 px-6 text-center align-middle text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider h-14">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
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
            ) : sortedStudents.length > 0 ? (
              sortedStudents.map((student) => (
                <tr
                  key={student.studentId}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200 h-16"
                >
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {student.studentCode}
                  </td>
                  <td className="py-4 px-6 align-middle">
                    <div className="flex items-center justify-center">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {getFullName(student)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {formatDate(student.dateOfBirth)}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {student.gender}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {student.className}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {student.gradeLevel}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100 max-w-xs truncate">
                    {student.address}
                  </td>
                  <td className="py-4 px-6 text-center align-middle text-sm text-neutral-900 dark:text-neutral-100">
                    {getParentName(student.parentId)}
                  </td>
                  <td className="py-4 px-6 text-center align-middle w-32 min-w-[128px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        student.isActive
                          ? "bg-green-100 dark:bg-green-800 text-white"
                          : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      {student.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center align-middle">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleAddEditStudent(student)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Chỉnh sửa"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleStudentStatus(student)}
                        className={`${
                          student.isActive
                            ? "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:text-neutral-100"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={
                          student.isActive
                            ? "Đánh dấu ngừng hoạt động"
                            : "Đánh dấu đang hoạt động"
                        }
                      >
                        {student.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteStudent(student.studentId)}
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
                    <p className="text-neutral-600 dark:text-neutral-300 text-lg">
                      Không tìm thấy học sinh nào phù hợp
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
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

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {selectedStudent ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    name="studentCode"
                    value={studentForm.studentCode}
                    onChange={handleInputChange}
                    placeholder="Tự động tạo nếu để trống"
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={studentForm.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={studentForm.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={studentForm.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      formErrors.dateOfBirth
                        ? "border-red-500"
                        : "border-neutral-300"
                    }`}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={studentForm.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                      Lớp học
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={studentForm.className}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="VD: 1A, 2B, 3C..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                      Khối lớp
                    </label>
                    <select
                      name="gradeLevel"
                      value={studentForm.gradeLevel}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="">-- Chọn khối --</option>
                      <option value="1">Khối 1</option>
                      <option value="2">Khối 2</option>
                      <option value="3">Khối 3</option>
                      <option value="4">Khối 4</option>
                      <option value="5">Khối 5</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    value={studentForm.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    rows="2"
                    placeholder="Nhập địa chỉ học sinh"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">
                    Phụ huynh
                  </label>
                  <select
                    name="parentId"
                    value={studentForm.parentId}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      formErrors.parentId
                        ? "border-red-500"
                        : "border-neutral-300"
                    }`}
                  >
                    <option value="">-- Chọn phụ huynh --</option>
                    {parents.map((parent) => (
                      <option key={parent.parentId} value={parent.parentId}>
                        {parent.fullName ||
                          `${parent.firstName} ${parent.lastName}`}{" "}
                        {parent.email ? `(${parent.email})` : ""}
                      </option>
                    ))}
                  </select>
                  {formErrors.parentId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.parentId}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowStudentModal(false)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 rounded-lg text-white hover:bg-primary-700 transition-colors duration-300"
                  >
                    {selectedStudent ? "Cập nhật" : "Thêm mới"}
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
