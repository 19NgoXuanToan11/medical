import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MedicalInventory = () => {
  // State for inventory items
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInventory([
        {
          id: "MED001",
          name: "Paracetamol 500mg",
          category: "medicine",
          currentQuantity: 120,
          unit: "viên",
          minQuantity: 20,
          expiryDate: "2025-12-31",
          location: "Tủ thuốc A",
          lastUpdated: "2023-11-10",
          supplier: "Công ty Dược phẩm ABC",
        },
        {
          id: "MED002",
          name: "Vitamin C 1000mg",
          category: "medicine",
          currentQuantity: 60,
          unit: "viên",
          minQuantity: 15,
          expiryDate: "2025-10-15",
          location: "Tủ thuốc A",
          lastUpdated: "2023-11-08",
          supplier: "Công ty Dược phẩm ABC",
        },
        {
          id: "MED003",
          name: "Thuốc ho Bảo Thanh",
          category: "medicine",
          currentQuantity: 8,
          unit: "chai",
          minQuantity: 5,
          expiryDate: "2024-08-20",
          location: "Tủ thuốc B",
          lastUpdated: "2023-11-05",
          supplier: "Công ty Dược phẩm XYZ",
        },
        {
          id: "SUP001",
          name: "Băng gạc vô trùng",
          category: "supply",
          currentQuantity: 45,
          unit: "gói",
          minQuantity: 10,
          expiryDate: "2026-12-31",
          location: "Tủ Y tế 1",
          lastUpdated: "2023-11-12",
          supplier: "Công ty Thiết bị Y tế 123",
        },
        {
          id: "SUP002",
          name: "Cồn y tế 70%",
          category: "supply",
          currentQuantity: 12,
          unit: "chai",
          minQuantity: 5,
          expiryDate: "2025-06-30",
          location: "Tủ Y tế 1",
          lastUpdated: "2023-11-01",
          supplier: "Công ty Thiết bị Y tế 123",
        },
        {
          id: "SUP003",
          name: "Nhiệt kế điện tử",
          category: "equipment",
          currentQuantity: 4,
          unit: "cái",
          minQuantity: 2,
          expiryDate: null,
          location: "Tủ Y tế 2",
          lastUpdated: "2023-10-20",
          supplier: "Công ty Thiết bị Y tế ABC",
        },
        {
          id: "SUP004",
          name: "Khẩu trang y tế",
          category: "supply",
          currentQuantity: 150,
          unit: "cái",
          minQuantity: 50,
          expiryDate: "2024-12-31",
          location: "Tủ Y tế 1",
          lastUpdated: "2023-11-15",
          supplier: "Công ty Thiết bị Y tế 123",
        },
        {
          id: "EQP001",
          name: "Máy đo huyết áp",
          category: "equipment",
          currentQuantity: 2,
          unit: "cái",
          minQuantity: 1,
          expiryDate: null,
          location: "Phòng y tế chính",
          lastUpdated: "2023-09-10",
          supplier: "Công ty Thiết bị Y tế XYZ",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter inventory based on search term and category
  const filteredInventory = inventory.filter((item) => {
    // Filter by search term
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "quantity":
        comparison = a.currentQuantity - b.currentQuantity;
        break;
      case "expiryDate":
        // Handle null expiry dates (like for equipment)
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        comparison = new Date(a.expiryDate) - new Date(b.expiryDate);
        break;
      case "lastUpdated":
        comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Check if an item is low in stock
  const isLowStock = (item) => {
    return item.currentQuantity <= item.minQuantity;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Check if an item is about to expire (within 30 days)
  const isAboutToExpire = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const expiryDate = new Date(dateString);
    const timeDiff = expiryDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 30;
  };

  // Handle sort change
  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý kho thuốc và vật tư y tế
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý thuốc, vật tư y tế cho các sự kiện y tế tại
            trường
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/staff/medication/inventory/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Thêm mới
          </Link>
          <Link
            to="/staff/medication/inventory/transaction"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            Nhập/Xuất kho
          </Link>
          <Link
            to="/staff/medication/inventory/history"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Lịch sử giao dịch
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tổng số mặt hàng</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : inventory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Hàng sắp hết</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading
                  ? "..."
                  : inventory.filter((item) => isLowStock(item)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Sắp hết hạn</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading
                  ? "..."
                  : inventory.filter((item) => isAboutToExpire(item.expiryDate))
                      .length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cập nhật gần đây</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading
                  ? "..."
                  : inventory.filter(
                      (item) =>
                        new Date(item.lastUpdated) >=
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="medicine">Thuốc</option>
            <option value="supply">Vật tư tiêu hao</option>
            <option value="equipment">Thiết bị y tế</option>
          </select>
        </div>
      </div>

      {/* Inventory table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : sortedInventory.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Không có dữ liệu phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center">
                      Tên sản phẩm
                      {sortBy === "name" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Loại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("quantity")}
                  >
                    <div className="flex items-center">
                      Số lượng
                      {sortBy === "quantity" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("expiryDate")}
                  >
                    <div className="flex items-center">
                      Hạn sử dụng
                      {sortBy === "expiryDate" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vị trí
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedInventory.map((item) => (
                  <tr
                    key={item.id}
                    className={`${
                      isLowStock(item) ? "bg-red-50" : ""
                    } hover:bg-gray-50`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex">
                        {item.category === "medicine" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Thuốc
                          </span>
                        )}
                        {item.category === "supply" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Vật tư
                          </span>
                        )}
                        {item.category === "equipment" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Thiết bị
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          isLowStock(item) ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {item.currentQuantity} {item.unit}
                      </div>
                      {isLowStock(item) && (
                        <div className="text-xs text-red-500">
                          Dưới mức tối thiểu ({item.minQuantity})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          isAboutToExpire(item.expiryDate)
                            ? "text-yellow-600 font-medium"
                            : "text-gray-900"
                        }`}
                      >
                        {formatDate(item.expiryDate)}
                      </div>
                      {isAboutToExpire(item.expiryDate) && (
                        <div className="text-xs text-yellow-500">
                          Sắp hết hạn
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/staff/medication/inventory/detail/${item.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </Link>
                        <Link
                          to={`/staff/medication/inventory/edit/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Sửa
                        </Link>
                        <Link
                          to={`/staff/medication/inventory/transaction/${item.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Nhập/Xuất
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalInventory;
