import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiClipboard,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiTablet,
  FiActivity,
  FiBarChart,
} from "react-icons/fi";
import { inventoryService } from "../../../utils/api/medication/inventoryService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [inventoryStats, setInventoryStats] = useState({
    totalMedicines: 0,
    totalSupplies: 0,
    inactiveMedicines: 0,
    inactiveSupplies: 0,
    lowStockMedicines: 0,
    lowStockSupplies: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from APIs
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch medicines and medical supplies in parallel
      const [medicinesResponse, suppliesResponse] = await Promise.all([
        inventoryService.getAllMedicines(),
        inventoryService.getAllMedicalSupplies(),
      ]);

      if (medicinesResponse.success) {
        setMedicines(medicinesResponse.data);
      } else {
        console.error("Failed to fetch medicines:", medicinesResponse.message);
      }

      if (suppliesResponse.success) {
        setMedicalSupplies(suppliesResponse.data);
      } else {
        console.error(
          "Failed to fetch medical supplies:",
          suppliesResponse.message
        );
      }

      // Process the data for statistics
      processInventoryStats(
        medicinesResponse.success ? medicinesResponse.data : [],
        suppliesResponse.success ? suppliesResponse.data : []
      );
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError("Không thể tải dữ liệu kho. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Process inventory statistics
  const processInventoryStats = (medicinesData, suppliesData) => {
    // Process medicines
    const totalMedicines = medicinesData.length;
    const inactiveMedicines = medicinesData.filter(
      (med) => !med.isActive
    ).length;
    const lowStockMedicines = medicinesData.filter(
      (med) => med.stockQuantity < 50 && med.isActive
    ).length;

    // Process supplies
    const totalSupplies = suppliesData.length;
    const inactiveSupplies = suppliesData.filter(
      (supply) => !supply.isActive
    ).length;
    const lowStockSupplies = suppliesData.filter(
      (supply) => supply.stockQuantity < 30 && supply.isActive
    ).length;

    // Find low stock items for the sidebar
    const lowStockMeds = medicinesData
      .filter((med) => med.stockQuantity < 50 && med.isActive)
      .map((med) => ({
        id: med.medicineId,
        name: med.name,
        quantity: med.stockQuantity,
        type: "medicine",
        threshold: 50,
      }))
      .slice(0, 3);

    const lowStockSupps = suppliesData
      .filter((supply) => supply.stockQuantity < 30 && supply.isActive)
      .map((supply) => ({
        id: supply.supplyId,
        name: supply.name,
        quantity: supply.stockQuantity,
        type: "supply",
        threshold: 30,
      }))
      .slice(0, 3);

    // Update states
    setInventoryStats({
      totalMedicines,
      totalSupplies,
      inactiveMedicines,
      inactiveSupplies,
      lowStockMedicines,
      lowStockSupplies,
    });

    setLowStockItems([...lowStockMeds, ...lowStockSupps]);

    // Generate recent activities based on real data
    generateRecentActivities(medicinesData, suppliesData);
  };

  // Generate recent activities from real data
  const generateRecentActivities = (medicinesData, suppliesData) => {
    const activities = [];

    // Add some recent medicine activities
    medicinesData.slice(0, 3).forEach((med, index) => {
      activities.push({
        id: activities.length + 1,
        action: med.isActive ? "Cập nhật thuốc" : "Ngưng sử dụng thuốc",
        item: med.name,
        quantity: med.stockQuantity,
        user: "Hệ thống",
        timestamp: new Date(Date.now() - index * 3600000).toLocaleString(
          "vi-VN"
        ),
      });
    });

    // Add some recent supply activities
    suppliesData.slice(0, 2).forEach((supply, index) => {
      activities.push({
        id: activities.length + 1,
        action: supply.isActive ? "Cập nhật vật tư" : "Ngưng sử dụng vật tư",
        item: supply.name,
        quantity: supply.stockQuantity,
        user: "Hệ thống",
        timestamp: new Date(Date.now() - (index + 3) * 3600000).toLocaleString(
          "vi-VN"
        ),
      });
    });

    setRecentActivities(activities.slice(0, 5));
  };

  // Load data from APIs on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          <p className="ml-2 text-neutral-500">
            Đang tải dữ liệu kho thuốc và vật tư...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
              <button
                onClick={fetchInventoryData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Quản lý kho thuốc và vật tư y tế
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        Tổng số mặt hàng
                      </div>
                      <div className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                        {inventoryStats.totalMedicines +
                          inventoryStats.totalSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Thuốc: {inventoryStats.totalMedicines} | Vật tư:{" "}
                        {inventoryStats.totalSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                      <FiPackage className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Sắp hết hàng
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {inventoryStats.lowStockMedicines +
                          inventoryStats.lowStockSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Thuốc: {inventoryStats.lowStockMedicines} | Vật tư:{" "}
                        {inventoryStats.lowStockSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                      <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-700 p-6 rounded-lg border border-neutral-200 dark:border-neutral-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Ngừng sử dụng
                      </div>
                      <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
                        {inventoryStats.inactiveMedicines +
                          inventoryStats.inactiveSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Thuốc: {inventoryStats.inactiveMedicines} | Vật tư:{" "}
                        {inventoryStats.inactiveSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center">
                      <FiX className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New detailed inventory sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Medicine Inventory Details */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
              <div className="bg-primary-50 dark:bg-primary-900/30 p-4 border-b border-primary-100 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTablet className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="text-lg font-medium text-primary-800 dark:text-primary-200">
                      Kho Thuốc ({medicines.length})
                    </h3>
                  </div>
                  <Link
                    to="/manager/medicine-inventory"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="p-4">
                {medicines.length > 0 ? (
                  <div className="space-y-3">
                    {medicines.slice(0, 5).map((medicine) => (
                      <div
                        key={medicine.medicineId}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary-500 mr-3"></div>
                          <div>
                            <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              {medicine.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {medicine.isActive
                                ? "Đang sử dụng"
                                : "Ngưng sử dụng"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${
                              medicine.stockQuantity < 50
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {medicine.stockQuantity}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Tồn kho
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPackage className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Chưa có dữ liệu thuốc
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Supply Inventory Details */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 border-b border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiPackage className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                      Vật tư Y tế ({medicalSupplies.length})
                    </h3>
                  </div>
                  <Link
                    to="/manager/supply-inventory"
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="p-4">
                {medicalSupplies.length > 0 ? (
                  <div className="space-y-3">
                    {medicalSupplies.slice(0, 5).map((supply) => (
                      <div
                        key={supply.supplyId}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                          <div>
                            <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              {supply.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {supply.isActive
                                ? "Đang sử dụng"
                                : "Ngưng sử dụng"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${
                              supply.stockQuantity < 30
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {supply.stockQuantity}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Tồn kho
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPackage className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Chưa có dữ liệu vật tư y tế
                    </p>
                  </div>
                )}
              </div>ành
            </div>
          </div>

          {/* Section Sắp hết hàng full width */}
          <div className="mt-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden max-w-4xl mx-auto">
              <div className="bg-white dark:bg-neutral-800 p-4 border-b border-neutral-100 dark:border-neutral-700">
                <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
                  Sắp hết hàng
                </h2>
              </div>
              <div className="p-3">
                {lowStockItems.length > 0 ? (
                  <div className="space-y-2">
                    {lowStockItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-700 rounded"
                      >
                        <div className="flex items-center min-w-0">
                          <div
                            className={`p-1.5 rounded-full ${
                              item.type === "medicine"
                                ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400"
                                : "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
                            }`}
                          >
                            {item.type === "medicine" ? (
                              <FiTablet className="h-4 w-4" />
                            ) : (
                              <FiPackage className="h-4 w-4" />
                            )}
                          </div>
                          <div className="ml-2 min-w-0">
                            <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              {item.type === "medicine"
                                ? "Thuốc"
                                : "Vật tư y tế"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-red-600 dark:text-red-400">
                            {item.quantity} / {item.threshold}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-2">
                      <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-xs text-center">
                      Không có mặt hàng nào sắp hết
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
