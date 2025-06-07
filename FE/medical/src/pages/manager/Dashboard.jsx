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

  const API_URL = "http://localhost:7111/api";

  // Fetch data from API
  useEffect(() => {
    Promise.all([fetchMedicines(), fetchSupplies()])
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
        (supply) => supply.stockQuantity < 50
      ).length;

      // Find low stock supplies
      const lowStockSups = supplies
        .filter((supply) => supply.stockQuantity < 50 && supply.isActive)
        .map((supply) => ({
          id: supply.supplyId,
          name: supply.name,
          quantity: supply.stockQuantity,
          type: "supply",
          category: supply.category,
          threshold: 50,
        }))
        .slice(0, 3);

      setInventoryStats((prev) => ({
        ...prev,
        totalSupplies: total,
        inactiveSupplies: inactive,
        lowStockSupplies: lowStock,
      }));

      setLowStockItems((prev) =>
        [...prev, ...lowStockSups]
          .sort((a, b) => a.quantity - b.quantity)
          .slice(0, 6)
      );
    } catch (error) {
      console.error("Error fetching supplies:", error);
    }
  };

  // Mock data for recent activities (would come from an API in a real application)
  const recentActivities = [
    {
      id: 1,
      action: "Thêm thuốc",
      item: "Paracetamol 500mg",
      quantity: "200",
      user: "Nguyễn Văn A",
      timestamp: "06/07/2025 09:15",
    },
    {
      id: 2,
      action: "Cập nhật vật tư",
      item: "Băng gạc vô trùng",
      quantity: "150",
      user: "Trần Thị B",
      timestamp: "06/07/2025 10:30",
    },
    {
      id: 3,
      action: "Đã ngừng sử dụng",
      item: "Ống tiêm 5ml",
      quantity: "N/A",
      user: "Lê Văn C",
      timestamp: "06/07/2025 11:45",
    },
    {
      id: 4,
      action: "Thêm vật tư",
      item: "Khẩu trang phẫu thuật",
      quantity: "300",
      user: "Phạm Thị D",
      timestamp: "05/07/2025 15:20",
    },
    {
      id: 5,
      action: "Cập nhật số lượng",
      item: "Amoxicillin",
      quantity: "180",
      user: "Hoàng Văn E",
      timestamp: "05/07/2025 16:10",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          <p className="ml-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Inventory Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quản lý kho thuốc và vật tư y tế
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">
                      Tổng số mặt hàng
                    </div>
                    <div className="text-3xl font-bold">
                      {inventoryStats.totalMedicines +
                        inventoryStats.totalSupplies}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Thuốc: {inventoryStats.totalMedicines} | Vật tư:{" "}
                      {inventoryStats.totalSupplies}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <FiPackage className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Sắp hết hàng</div>
                    <div className="text-3xl font-bold">
                      {inventoryStats.lowStockMedicines +
                        inventoryStats.lowStockSupplies}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Thuốc: {inventoryStats.lowStockMedicines} | Vật tư:{" "}
                      {inventoryStats.lowStockSupplies}
                    </div>
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
                    <div className="text-3xl font-bold">
                      {inventoryStats.inactiveMedicines +
                        inventoryStats.inactiveSupplies}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Thuốc: {inventoryStats.inactiveMedicines} | Vật tư:{" "}
                      {inventoryStats.inactiveSupplies}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiX className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Hoạt động gần đây
                </h2>
                <div className="flex space-x-3">
                  <Link
                    to="/manager/medicines"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    Kho thuốc
                  </Link>
                  <Link
                    to="/manager/supplies"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    Vật tư y tế
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mặt hàng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người thực hiện
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {activity.action}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {activity.item}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {activity.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {activity.user}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {activity.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Sắp hết hàng
                </h2>
                <div className="flex space-x-3">
                  <Link
                    to="/manager/medicines?filter=low-stock"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    Kho thuốc
                  </Link>
                  <Link
                    to="/manager/supplies?filter=low-stock"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    Vật tư y tế
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start mb-2">
                        {item.type === "medicine" ? (
                          <FiTablet className="h-5 w-5 text-teal-600 mr-2 mt-0.5" />
                        ) : (
                          <FiPackage className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        )}
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.name}
                        </h3>
                      </div>
                      <div className="ml-7 text-sm text-gray-600">
                        <p className="flex items-center">
                          <FiAlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                          <span>
                            Còn lại:{" "}
                            <span className="font-medium text-red-600">
                              {item.quantity}
                            </span>
                          </span>
                        </p>
                        {item.type === "supply" && item.category && (
                          <p>Loại: {item.category}</p>
                        )}
                      </div>
                      <div className="mt-3 ml-7">
                        <Link
                          to={`/manager/${
                            item.type === "medicine" ? "medicines" : "supplies"
                          }?filter=low-stock`}
                          className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiCheck className="mx-auto h-10 w-10 mb-3 text-green-500" />
                    <p>Không có mặt hàng nào sắp hết</p>
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
