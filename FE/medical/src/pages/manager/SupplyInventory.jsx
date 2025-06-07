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
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";

const SupplyInventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "all";

  // State for inventory items
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stats, setStats] = useState({
    total: 0,
    inactive: 0,
    lowStock: 0,
  });

  // State for supply creation/editing
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    id: 0,
    name: "",
    stockQuantity: 0,
    category: "",
    description: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const API_URL = "http://localhost:7111/api";

  // Fetch inventory items
  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/MedicalSupply`);
      const items = response.data;
      setSupplies(items);

      // Calculate stats
      const total = items.length;
      const inactive = items.filter((item) => !item.isActive).length;
      const lowStock = items.filter((item) => item.stockQuantity < 50).length;

      setStats({
        total,
        inactive,
        lowStock,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching supplies:", error);
      setLoading(false);
    }
  };

  // Create new supply
  const createSupply = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        name: itemForm.name,
        category: itemForm.category,
        description: itemForm.description,
        stockQuantity: parseInt(itemForm.stockQuantity),
        isActive: itemForm.isActive,
      };

      await axios.post(`${API_URL}/MedicalSupply`, data);
      fetchSupplies();
      setShowItemModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating supply:", error);
    }
  };

  // Update supply
  const updateSupply = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        supplyId: itemForm.id,
        name: itemForm.name,
        category: itemForm.category,
        description: itemForm.description,
        stockQuantity: parseInt(itemForm.stockQuantity),
        isActive: itemForm.isActive,
      };

      await axios.put(`${API_URL}/MedicalSupply/${itemForm.id}`, data);
      fetchSupplies();
      setShowItemModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating supply:", error);
    }
  };

  // Delete supply
  const deleteSupply = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật tư y tế này không?")) {
      try {
        await axios.delete(`${API_URL}/MedicalSupply/${id}`);
        fetchSupplies();
      } catch (error) {
        console.error("Error deleting supply:", error);
      }
    }
  };

  // Toggle supply active status
  const toggleSupplyStatus = async (item) => {
    try {
      const data = {
        supplyId: item.supplyId,
        name: item.name,
        category: item.category,
        description: item.description,
        stockQuantity: item.stockQuantity,
        isActive: !item.isActive,
      };

      await axios.put(`${API_URL}/MedicalSupply/${item.supplyId}`, data);
      fetchSupplies();
    } catch (error) {
      console.error("Error toggling supply status:", error);
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

  // Filter supplies based on search term and status
  const filteredSupplies = supplies.filter((item) => {
    // Filter by search term
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplyId && item.supplyId.toString().includes(searchTerm)) ||
      (item.category &&
        item.category.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = item.isActive;
    } else if (filterStatus === "inactive") {
      matchesStatus = !item.isActive;
    } else if (filterStatus === "low-stock") {
      matchesStatus = item.stockQuantity < 50;
    }

    return matchesSearch && matchesStatus;
  });

  // Sort supplies
  const sortedSupplies = [...filteredSupplies].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "id":
        comparison = a.supplyId - b.supplyId;
        break;
      case "stock":
        comparison = a.stockQuantity - b.stockQuantity;
        break;
      case "category":
        comparison = (a.category || "").localeCompare(b.category || "");
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Check if supply is low on stock
  function isLowStock(item) {
    return item.stockQuantity < 50;
  }

  // Handle sort change
  function handleSortChange(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  // Handle add/edit supply
  const handleAddEditSupply = (item = null) => {
    if (item) {
      setItemForm({
        id: item.supplyId,
        name: item.name,
        stockQuantity: item.stockQuantity,
        category: item.category || "",
        description: item.description || "",
        isActive: item.isActive,
      });
      setSelectedItem(item);
    } else {
      resetForm();
      setSelectedItem(null);
    }
    setShowItemModal(true);
  };

  // Reset form
  const resetForm = () => {
    setItemForm({
      id: 0,
      name: "",
      stockQuantity: 0,
      category: "",
      description: "",
      isActive: true,
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!itemForm.name.trim()) {
      errors.name = "Tên vật tư không được để trống";
    }
    if (isNaN(itemForm.stockQuantity) || itemForm.stockQuantity < 0) {
      errors.stockQuantity = "Số lượng phải là số dương";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm({
      ...itemForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      updateSupply();
    } else {
      createSupply();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý vật tư y tế
          </h2>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý danh sách vật tư y tế tại trường
          </p>
        </div>
        <button
          onClick={() => handleAddEditSupply()}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
        >
          <FiPlus className="mr-2" />
          Thêm vật tư mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200 flex justify-between">
          <div>
            <p className="text-teal-800 text-sm font-medium">Tổng số vật tư</p>
            <p className="text-3xl font-bold text-teal-900">{stats.total}</p>
          </div>
          <div className="bg-teal-200 h-12 w-12 rounded-full flex items-center justify-center">
            <FiPackage className="h-6 w-6 text-teal-700" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 flex justify-between">
          <div>
            <p className="text-amber-800 text-sm font-medium">Sắp hết hàng</p>
            <p className="text-3xl font-bold text-amber-900">
              {stats.lowStock}
            </p>
          </div>
          <div className="bg-amber-200 h-12 w-12 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="h-6 w-6 text-amber-700" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 flex justify-between">
          <div>
            <p className="text-gray-800 text-sm font-medium">Ngừng sử dụng</p>
            <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
          </div>
          <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
            <FiX className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã hoặc loại vật tư..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
              <option value="low-stock">Sắp hết hàng</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="md:ml-auto flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-300"
          >
            <FiRefreshCw className="mr-1" />
            Đặt lại
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSortChange("id")}
              >
                <div className="flex items-center">
                  Mã vật tư
                  {sortBy === "id" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSortChange("name")}
              >
                <div className="flex items-center">
                  Tên vật tư
                  {sortBy === "name" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSortChange("category")}
              >
                <div className="flex items-center">
                  Loại
                  {sortBy === "category" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSortChange("stock")}
              >
                <div className="flex items-center">
                  Số lượng
                  {sortBy === "stock" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-teal-600 mr-3"
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
            ) : sortedSupplies.length > 0 ? (
              sortedSupplies.map((item) => (
                <tr
                  key={item.supplyId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.supplyId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FiPackage className="h-5 w-5 text-teal-600 mr-2" />
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.category || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span
                        className={`font-medium ${
                          isLowStock(item) ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {item.stockQuantity}
                      </span>
                      {isLowStock(item) && (
                        <FiAlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.isActive ? "Đang sử dụng" : "Ngừng sử dụng"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddEditSupply(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Chỉnh sửa"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleSupplyStatus(item)}
                        className={`${
                          item.isActive
                            ? "text-gray-600 hover:text-gray-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={
                          item.isActive
                            ? "Đánh dấu ngừng sử dụng"
                            : "Đánh dấu đang sử dụng"
                        }
                      >
                        {item.isActive ? (
                          <FiX className="h-5 w-5" />
                        ) : (
                          <FiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteSupply(item.supplyId)}
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
                <td colSpan="6" className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
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
                    <p className="text-gray-600 text-lg">
                      Không có vật tư nào phù hợp
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
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

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedItem ? "Chỉnh sửa vật tư" : "Thêm vật tư mới"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Tên vật tư
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={itemForm.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Loại vật tư
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={itemForm.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={itemForm.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={itemForm.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                      formErrors.stockQuantity
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.stockQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.stockQuantity}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={itemForm.isActive}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-600 focus:ring-2"
                    />
                    <span className="ml-2 text-gray-700">Đang sử dụng</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition-colors duration-300"
                  >
                    {selectedItem ? "Cập nhật" : "Thêm mới"}
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

export default SupplyInventory;
