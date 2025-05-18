import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          role: "admin",
          status: "active",
          lastLogin: "2023-05-17T14:30:00",
          createdAt: "2023-01-10T09:00:00",
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@example.com",
          role: "staff",
          status: "active",
          lastLogin: "2023-05-18T09:15:00",
          createdAt: "2023-01-15T10:30:00",
        },
        {
          id: 3,
          name: "Lê Văn C",
          email: "levanc@example.com",
          role: "parent",
          status: "active",
          lastLogin: "2023-05-16T16:45:00",
          createdAt: "2023-02-05T11:20:00",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          email: "phamthid@example.com",
          role: "parent",
          status: "inactive",
          lastLogin: "2023-05-10T13:10:00",
          createdAt: "2023-02-10T14:00:00",
        },
        {
          id: 5,
          name: "Hoàng Văn E",
          email: "hoangvane@example.com",
          role: "staff",
          status: "active",
          lastLogin: "2023-05-18T08:30:00",
          createdAt: "2023-02-20T08:15:00",
        },
        {
          id: 6,
          name: "Ngô Thị F",
          email: "ngothif@example.com",
          role: "parent",
          status: "pending",
          lastLogin: null,
          createdAt: "2023-05-17T16:00:00",
        },
        {
          id: 7,
          name: "Đỗ Văn G",
          email: "dovang@example.com",
          role: "parent",
          status: "active",
          lastLogin: "2023-05-15T10:20:00",
          createdAt: "2023-03-05T09:30:00",
        },
        {
          id: 8,
          name: "Vũ Thị H",
          email: "vuthih@example.com",
          role: "staff",
          status: "active",
          lastLogin: "2023-05-18T11:05:00",
          createdAt: "2023-03-15T13:45:00",
        },
        {
          id: 9,
          name: "Trương Văn I",
          email: "truongvani@example.com",
          role: "teacher",
          status: "active",
          lastLogin: "2023-05-18T15:30:00",
          createdAt: "2023-03-20T10:15:00",
        },
        {
          id: 10,
          name: "Lý Thị K",
          email: "lythik@example.com",
          role: "teacher",
          status: "inactive",
          lastLogin: "2023-05-05T08:45:00",
          createdAt: "2023-04-02T09:20:00",
        },
      ];

      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    // Filter by role
    if (filterRole !== "all" && user.role !== filterRole) {
      return false;
    }

    // Filter by status
    if (filterStatus !== "all" && user.status !== filterStatus) {
      return false;
    }

    // Search by name or email
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    // Handle date columns
    if (sortColumn === "lastLogin" || sortColumn === "createdAt") {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }

    if (valA < valB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (valA > valB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const usersPerPage = 5;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa đăng nhập";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real application, this would make an API call
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "staff":
        return "Nhân viên y tế";
      case "teacher":
        return "Giáo viên";
      case "parent":
        return "Phụ huynh";
      default:
        return role;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "pending":
        return "Chờ xác nhận";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "teacher":
        return "bg-indigo-100 text-indigo-800";
      case "parent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách người dùng
          </h2>
          <p className="text-sm text-gray-600">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <div>
          <Link
            to="/admin/users/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            Thêm người dùng mới
          </Link>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <div className="mr-2 flex items-center">
                <FiFilter className="text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">Vai trò:</span>
              </div>
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="admin">Quản trị viên</option>
                <option value="staff">Nhân viên y tế</option>
                <option value="teacher">Giáo viên</option>
                <option value="parent">Phụ huynh</option>
              </select>
            </div>

            <div className="flex items-center">
              <div className="mr-2 flex items-center">
                <FiFilter className="text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">Trạng thái:</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ xác nhận</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Tên người dùng
                      {sortColumn === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center">
                      Vai trò
                      {sortColumn === "role" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Trạng thái
                      {sortColumn === "status" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("lastLogin")}
                  >
                    <div className="flex items-center">
                      Đăng nhập cuối
                      {sortColumn === "lastLogin" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Ngày tạo
                      {sortColumn === "createdAt" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          user.status
                        )}`}
                      >
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <FiEye className="h-5 w-5" />
                          <span className="sr-only">Xem</span>
                        </Link>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="h-5 w-5" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa người dùng"
                        >
                          <FiTrash2 className="h-5 w-5" />
                          <span className="sr-only">Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && currentUsers.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-600">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && sortedUsers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, sortedUsers.length)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{sortedUsers.length}</span>{" "}
                  người dùng
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === number + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowDeleteModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Xóa người dùng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa người dùng{" "}
                        <span className="font-semibold">
                          {userToDelete?.name}
                        </span>{" "}
                        không? Hành động này không thể được hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
