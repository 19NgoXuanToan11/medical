import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiPlus,
  FiDownload,
  FiUpload,
  FiClock,
  FiAlertTriangle,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiEdit,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiPackage,
  FiTablet,
} from "react-icons/fi";

const MedicalInventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "all";
  const initialTab = queryParams.get("tab") || "medicine";

  // State for inventory type
  const [activeTab, setActiveTab] = useState(initialTab);

  // State for inventory items
  const [inventory, setInventory] = useState([]);
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

  // State for medicine/supply creation/editing
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    id: 0,
    name: "",
    stockQuantity: 0,
    isActive: true,
    category: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const API_URL = "http://localhost:7111/api";

  // Fetch inventory items based on active tab
  useEffect(() => {
    fetchInventory();
  }, [activeTab]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "medicine" ? "Medicine" : "MedicalSupply";
      const response = await axios.get(`${API_URL}/${endpoint}`);
      const items = response.data;
      setInventory(items);

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
      console.error(`Error fetching ${activeTab}:`, error);
      setLoading(false);
    }
  };

  // Create new item
  const createItem = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = activeTab === "medicine" ? "Medicine" : "MedicalSupply";

      // Prepare data based on item type
      const data =
        activeTab === "medicine"
          ? {
              name: itemForm.name,
              stockQuantity: parseInt(itemForm.stockQuantity),
              isActive: itemForm.isActive,
            }
          : {
              name: itemForm.name,
              category: itemForm.category,
              description: itemForm.description,
              stockQuantity: parseInt(itemForm.stockQuantity),
              isActive: itemForm.isActive,
            };

      await axios.post(`${API_URL}/${endpoint}`, data);
      fetchInventory();
      setShowItemModal(false);
      resetForm();
    } catch (error) {
      console.error(`Error creating ${activeTab}:`, error);
    }
  };

  // Update item
  const updateItem = async () => {
    if (!validateForm()) return;

    try {
      const endpoint = activeTab === "medicine" ? "Medicine" : "MedicalSupply";
      const idField = activeTab === "medicine" ? "medicineId" : "supplyId";

      // Prepare data based on item type
      const data =
        activeTab === "medicine"
          ? {
              medicineId: itemForm.id,
              name: itemForm.name,
              stockQuantity: parseInt(itemForm.stockQuantity),
              isActive: itemForm.isActive,
            }
          : {
              supplyId: itemForm.id,
              name: itemForm.name,
              category: itemForm.category,
              description: itemForm.description,
              stockQuantity: parseInt(itemForm.stockQuantity),
              isActive: itemForm.isActive,
            };

      await axios.put(`${API_URL}/${endpoint}/${itemForm.id}`, data);
      fetchInventory();
      setShowItemModal(false);
      resetForm();
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${
          activeTab === "medicine" ? "thuốc" : "vật tư y tế"
        } này không?`
      )
    ) {
      try {
        const endpoint =
          activeTab === "medicine" ? "Medicine" : "MedicalSupply";
        await axios.delete(`${API_URL}/${endpoint}/${id}`);
        fetchInventory();
      } catch (error) {
        console.error(`Error deleting ${activeTab}:`, error);
      }
    }
  };

  // Toggle item active status
  const toggleItemStatus = async (item) => {
    try {
      const endpoint = activeTab === "medicine" ? "Medicine" : "MedicalSupply";
      const idField = activeTab === "medicine" ? "medicineId" : "supplyId";

      // Prepare data based on item type
      const data =
        activeTab === "medicine"
          ? {
              medicineId: item[idField],
              name: item.name,
              stockQuantity: item.stockQuantity,
              isActive: !item.isActive,
            }
          : {
              supplyId: item[idField],
              name: item.name,
              category: item.category,
              description: item.description,
              stockQuantity: item.stockQuantity,
              isActive: !item.isActive,
            };

      await axios.put(`${API_URL}/${endpoint}/${item[idField]}`, data);
      fetchInventory();
    } catch (error) {
      console.error(`Error toggling ${activeTab} status:`, error);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFilters();

    // Update URL
    const params = new URLSearchParams(location.search);
    params.set("tab", tab);
    navigate({ search: params.toString() });
  };

  // Filter inventory based on search term and status
  const filteredInventory = inventory.filter((item) => {
    // Get ID field based on active tab
    const idField = activeTab === "medicine" ? "medicineId" : "supplyId";

    // Filter by search term
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item[idField] && item[idField].toString().includes(searchTerm));

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

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let comparison = 0;
    const idField = activeTab === "medicine" ? "medicineId" : "supplyId";

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "id":
        comparison = a[idField] - b[idField];
        break;
      case "quantity":
        comparison = a.stockQuantity - b.stockQuantity;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Check if an item is low in stock
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

  // Handle filter change
  function handleFilterChange(status) {
    setFilterStatus(status);

    // Update URL
    const params = new URLSearchParams();
    if (status !== "all") {
      params.set("filter", status);
    }
    if (activeTab !== "medicine") {
      params.set("tab", activeTab);
    }
    navigate({ search: params.toString() });
  }

  // Reset all filters
  function resetFilters() {
    setFilterStatus("all");
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");

    // Update URL to keep only the tab parameter
    const params = new URLSearchParams();
    if (activeTab !== "medicine") {
      params.set("tab", activeTab);
    }
    navigate({ search: params.toString() });
  }

  // Handle add/edit item
  const handleAddEditItem = (item = null) => {
    if (item) {
      const idField = activeTab === "medicine" ? "medicineId" : "supplyId";
      setItemForm({
        id: item[idField],
        name: item.name,
        stockQuantity: item.stockQuantity,
        isActive: item.isActive,
        category: item.category || "",
        description: item.description || "",
      });
      setSelectedItem(item);
    } else {
      resetForm();
    }
    setShowItemModal(true);
  };

  // Reset form
  const resetForm = () => {
    setItemForm({
      id: 0,
      name: "",
      stockQuantity: 0,
      isActive: true,
      category: "",
      description: "",
    });
    setSelectedItem(null);
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!itemForm.name.trim()) {
      errors.name = "Tên không được để trống";
    }

    if (itemForm.stockQuantity < 0) {
      errors.stockQuantity = "Số lượng không thể là số âm";
    }

    if (activeTab === "medicalsupply" && !itemForm.category.trim()) {
      errors.category = "Loại vật tư không được để trống";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm({
      ...itemForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      updateItem();
    } else {
      createItem();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý kho thuốc và vật tư y tế
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý danh sách thuốc, vật tư y tế tại trường
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleAddEditItem()}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            {activeTab === "medicine" ? "Thêm thuốc mới" : "Thêm vật tư mới"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => handleTabChange("medicine")}
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === "medicine"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FiTablet className="inline-block mr-2" />
              Quản lý thuốc
            </button>
            <button
              onClick={() => handleTabChange("medicalsupply")}
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                activeTab === "medicalsupply"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FiPackage className="inline-block mr-2" />
              Quản lý vật tư y tế
            </button>
          </nav>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">
                {activeTab === "medicine" ? "Tổng số thuốc" : "Tổng số vật tư"}
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              {activeTab === "medicine" ? (
                <FiTablet className="h-5 w-5 text-teal-600" />
              ) : (
                <FiPackage className="h-5 w-5 text-teal-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Sắp hết hàng</div>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Ngừng sử dụng</div>
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FiX className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder={`Tìm kiếm theo tên hoặc mã ${
                activeTab === "medicine" ? "thuốc" : "vật tư"
              }...`}
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
              <option value="low-stock">Sắp hết hàng</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("id")}
                    >
                      <div className="flex items-center">
                        Mã {activeTab === "medicine" ? "thuốc" : "vật tư"}
                        {sortBy === "id" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("name")}
                    >
                      <div className="flex items-center">
                        Tên {activeTab === "medicine" ? "thuốc" : "vật tư"}
                        {sortBy === "name" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    {activeTab === "medicalsupply" && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loại
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("quantity")}
                    >
                      <div className="flex items-center">
                        Số lượng
                        {sortBy === "quantity" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    {activeTab === "medicalsupply" && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mô tả
                      </th>
                    )}
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
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInventory.length > 0 ? (
                    sortedInventory.map((item) => {
                      const idField =
                        activeTab === "medicine" ? "medicineId" : "supplyId";
                      return (
                        <tr key={item[idField]} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item[idField]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </td>
                          {activeTab === "medicalsupply" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {item.category}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium ${
                                isLowStock(item)
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.stockQuantity}
                              {isLowStock(item) && (
                                <FiAlertTriangle className="inline-block ml-1 text-red-600" />
                              )}
                            </div>
                          </td>
                          {activeTab === "medicalsupply" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.description}
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.isActive ? "Đang sử dụng" : "Ngừng sử dụng"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => handleAddEditItem(item)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Chỉnh sửa"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => toggleItemStatus(item)}
                                className={`${
                                  item.isActive
                                    ? "text-gray-600 hover:text-gray-900"
                                    : "text-green-600 hover:text-green-900"
                                }`}
                                title={
                                  item.isActive ? "Ngừng sử dụng" : "Kích hoạt"
                                }
                              >
                                {item.isActive ? (
                                  <FiX className="h-5 w-5" />
                                ) : (
                                  <FiCheck className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteItem(item[idField])}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={activeTab === "medicine" ? "5" : "7"}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <FiFilter className="h-12 w-12 mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Không có{" "}
                            {activeTab === "medicine" ? "thuốc" : "vật tư y tế"}{" "}
                            nào phù hợp
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                          </p>
                          <button
                            onClick={resetFilters}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            <FiRefreshCw className="mr-2 h-4 w-4" /> Đặt lại bộ
                            lọc
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedItem
                  ? `Chỉnh sửa ${
                      activeTab === "medicine" ? "thuốc" : "vật tư y tế"
                    }`
                  : `Thêm ${
                      activeTab === "medicine" ? "thuốc" : "vật tư y tế"
                    } mới`}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên {activeTab === "medicine" ? "thuốc" : "vật tư y tế"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={itemForm.name}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${
                      formErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {activeTab === "medicalsupply" && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Loại vật tư
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={itemForm.category}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border ${
                          formErrors.category
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        } shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
                      />
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.category}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mô tả
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={itemForm.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="block w-full rounded-md border border-gray-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số lượng
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={itemForm.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`block w-full rounded-md border ${
                      formErrors.stockQuantity
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
                  />
                  {formErrors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.stockQuantity}
                    </p>
                  )}
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={itemForm.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Đang sử dụng
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {selectedItem ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalInventory;
