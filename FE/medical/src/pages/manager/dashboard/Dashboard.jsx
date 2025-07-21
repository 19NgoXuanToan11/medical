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
} from "react-icons/fi";

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

  // Static mock data
  const mockMedicines = [
    {
      medicineId: 1,
      name: "Paracetamol 500mg",
      stockQuantity: 200,
      isActive: true,
    },
    {
      medicineId: 2,
      name: "Amoxicillin 250mg",
      stockQuantity: 45,
      isActive: true,
    },
    {
      medicineId: 3,
      name: "Ibuprofen 400mg",
      stockQuantity: 150,
      isActive: true,
    },
    { medicineId: 4, name: "Aspirin 100mg", stockQuantity: 30, isActive: true },
    { medicineId: 5, name: "Vitamin C", stockQuantity: 80, isActive: true },
    {
      medicineId: 6,
      name: "Antibiotics Old",
      stockQuantity: 20,
      isActive: false,
    },
  ];

  const mockSupplies = [
    {
      supplyId: 1,
      name: "Băng gạc vô trùng",
      stockQuantity: 150,
      isActive: true,
    },
    {
      supplyId: 2,
      name: "Khẩu trang phẫu thuật",
      stockQuantity: 300,
      isActive: true,
    },
    { supplyId: 3, name: "Ống tiêm 5ml", stockQuantity: 25, isActive: true },
    { supplyId: 4, name: "Găng tay y tế", stockQuantity: 180, isActive: true },
    { supplyId: 5, name: "Cồn y tế", stockQuantity: 20, isActive: true },
    { supplyId: 6, name: "Bông y tế cũ", stockQuantity: 10, isActive: false },
  ];

  const mockActivities = [
    {
      id: 1,
      action: "Thêm thuốc",
      item: "Paracetamol 500mg",
      quantity: 200,
      user: "Nguyễn Văn A",
      timestamp: "06/07/2025 09:15",
    },
    {
      id: 2,
      action: "Cập nhật vật tư",
      item: "Băng gạc vô trùng",
      quantity: 150,
      user: "Trần Thị B",
      timestamp: "06/07/2025 10:30",
    },
    {
      id: 3,
      action: "Đã ngưng sử dụng",
      item: "Ống tiêm 5ml",
      quantity: "N/A",
      user: "Lê Văn C",
      timestamp: "06/07/2025 11:45",
    },
    {
      id: 4,
      action: "Thêm vật tư",
      item: "Khẩu trang phẫu thuật",
      quantity: 300,
      user: "Phạm Thị D",
      timestamp: "05/07/2025 15:20",
    },
    {
      id: 5,
      action: "Cập nhật số lượng",
      item: "Amoxicillin",
      quantity: 180,
      user: "Hoàng Văn E",
      timestamp: "05/07/2025 16:10",
    },
  ];

  // Load mock data
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      loadMockData();
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const loadMockData = () => {
    // Process medicines
    const total = mockMedicines.length;
    const inactive = mockMedicines.filter((med) => !med.isActive).length;
    const lowStock = mockMedicines.filter(
      (med) => med.stockQuantity < 50
    ).length;

    // Find low stock medicines
    const lowStockMeds = mockMedicines
      .filter((med) => med.stockQuantity < 50 && med.isActive)
      .map((med) => ({
        id: med.medicineId,
        name: med.name,
        quantity: med.stockQuantity,
        type: "medicine",
        threshold: 50,
      }))
      .slice(0, 3);

    // Process supplies
    const totalSupplies = mockSupplies.length;
    const inactiveSupplies = mockSupplies.filter(
      (supply) => !supply.isActive
    ).length;
    const lowStockSupplies = mockSupplies.filter(
      (supply) => supply.stockQuantity < 30
    ).length;

    // Find low stock supplies
    const lowStockSupp = mockSupplies
      .filter((supply) => supply.stockQuantity < 30 && supply.isActive)
      .map((supply) => ({
        id: supply.supplyId,
        name: supply.name,
        quantity: supply.stockQuantity,
        type: "supply",
        threshold: 30,
      }))
      .slice(0, 3);

    setInventoryStats({
      totalMedicines: total,
      totalSupplies: totalSupplies,
      inactiveMedicines: inactive,
      inactiveSupplies: inactiveSupplies,
      lowStockMedicines: lowStock,
      lowStockSupplies: lowStockSupplies,
    });

    setLowStockItems([...lowStockMeds, ...lowStockSupp]);
    setRecentActivities(mockActivities);
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          <p className="ml-2 text-neutral-500">Đang tải dữ liệu...</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
              <div className="bg-white dark:bg-neutral-800 p-6 border-b border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
                    Hoạt động gần đây
                  </h2>
                  <div className="flex space-x-3">
                    <Link
                      to="/manager/medicine-inventory"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      Kho thuốc
                    </Link>
                    <Link
                      to="/manager/supply-inventory"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      Vật tư y tế
                    </Link>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                        Hành động
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                        Mặt hàng
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                        Người thực hiện
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {recentActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center text-neutral-800 dark:text-neutral-200">
                          {activity.action}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-neutral-600 dark:text-neutral-300">
                          {activity.item}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-neutral-600 dark:text-neutral-300">
                          {activity.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-neutral-600 dark:text-neutral-300">
                          {activity.user}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-neutral-600 dark:text-neutral-300">
                          {activity.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
              <div className="bg-white dark:bg-neutral-800 p-6 border-b border-neutral-100 dark:border-neutral-700">
                <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
                  Sắp hết hàng
                </h2>
              </div>
              <div className="p-6">
                {lowStockItems.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              item.type === "medicine"
                                ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400"
                                : "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400"
                            }`}
                          >
                            {item.type === "medicine" ? (
                              <FiTablet className="h-5 w-5" />
                            ) : (
                              <FiPackage className="h-5 w-5" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              {item.name}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {item.type === "medicine"
                                ? "Thuốc"
                                : "Vật tư y tế"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600 dark:text-red-400">
                            {item.quantity} / {item.threshold}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Số lượng
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                      <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-center">
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
