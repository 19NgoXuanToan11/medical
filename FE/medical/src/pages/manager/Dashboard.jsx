import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

  const API_URL = "http://localhost:7111/api";

  // Fetch data from API
  useEffect(() => {
    Promise.all([fetchMedicines(), fetchSupplies(), fetchRecentActivities()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${API_URL}/Medicine`);
      const medicines = response.data;

      // Calculate stats
      const total = medicines.length;
      const inactive = medicines.filter((med) => !med.isActive).length;
      const lowStock = medicines.filter((med) => med.stockQuantity < 50).length;

      // Find low stock medicines
      const lowStockMeds = medicines
        .filter((med) => med.stockQuantity < 50 && med.isActive)
        .map((med) => ({
          id: med.medicineId,
          name: med.name,
          quantity: med.stockQuantity,
          type: "medicine",
          threshold: 50,
        }))
        .slice(0, 3);

      setInventoryStats((prev) => ({
        ...prev,
        totalMedicines: total,
        inactiveMedicines: inactive,
        lowStockMedicines: lowStock,
      }));

      setLowStockItems((prev) => [...lowStockMeds, ...prev]);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchSupplies = async () => {
    try {
      const response = await axios.get(`${API_URL}/MedicalSupply`);
      const supplies = response.data;

      // Calculate stats
      const total = supplies.length;
      const inactive = supplies.filter((supply) => !supply.isActive).length;
      const lowStock = supplies.filter(
        (supply) => supply.stockQuantity < 30
      ).length;

      // Find low stock supplies
      const lowStockSupp = supplies
        .filter((supply) => supply.stockQuantity < 30 && supply.isActive)
        .map((supply) => ({
          id: supply.supplyId,
          name: supply.name,
          quantity: supply.stockQuantity,
          type: "supply",
          threshold: 30,
        }))
        .slice(0, 3);

      setInventoryStats((prev) => ({
        ...prev,
        totalSupplies: total,
        inactiveSupplies: inactive,
        lowStockSupplies: lowStock,
      }));

      setLowStockItems((prev) => [...prev, ...lowStockSupp]);
    } catch (error) {
      console.error("Error fetching supplies:", error);
    }
  };

  const fetchRecentActivities = async () => {
    // Simulated data - would be replaced with a real API call
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
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                Quản lý kho thuốc và vật tư y tế
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Tổng số mặt hàng
                      </div>
                      <div className="text-3xl font-bold text-primary-700">
                        {inventoryStats.totalMedicines +
                          inventoryStats.totalSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Thuốc: {inventoryStats.totalMedicines} | Vật tư:{" "}
                        {inventoryStats.totalSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiPackage className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Sắp hết hàng
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {inventoryStats.lowStockMedicines +
                          inventoryStats.lowStockSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Thuốc: {inventoryStats.lowStockMedicines} | Vật tư:{" "}
                        {inventoryStats.lowStockSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FiAlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Ngừng sử dụng
                      </div>
                      <div className="text-3xl font-bold text-neutral-700">
                        {inventoryStats.inactiveMedicines +
                          inventoryStats.inactiveSupplies}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Thuốc: {inventoryStats.inactiveMedicines} | Vật tư:{" "}
                        {inventoryStats.inactiveSupplies}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center">
                      <FiX className="h-6 w-6 text-neutral-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="bg-white p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-neutral-800">
                    Hoạt động gần đây
                  </h2>
                  <div className="flex space-x-3">
                    <Link
                      to="/manager/medicine-inventory"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Kho thuốc
                    </Link>
                    <Link
                      to="/manager/supply-inventory"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Vật tư y tế
                    </Link>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Hành động
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Mặt hàng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Người thực hiện
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-800">
                          {activity.action}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {activity.item}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {activity.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {activity.user}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                          {activity.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="bg-white p-6 border-b border-neutral-100">
                <h2 className="text-lg font-medium text-neutral-800">
                  Sắp hết hàng
                </h2>
              </div>
              <div className="p-6">
                {lowStockItems.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              item.type === "medicine"
                                ? "bg-primary-100 text-primary-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.type === "medicine" ? (
                              <FiTablet className="h-5 w-5" />
                            ) : (
                              <FiPackage className="h-5 w-5" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-neutral-800">
                              {item.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {item.type === "medicine"
                                ? "Thuốc"
                                : "Vật tư y tế"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">
                            {item.quantity} / {item.threshold}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Số lượng
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <FiCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-neutral-600 text-center">
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
