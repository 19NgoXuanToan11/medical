import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const MedicalEventSupplies = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call to get event details
    setTimeout(() => {
      setEvent({
        id: "EVT001",
        name: "Khám sức khỏe định kỳ lớp 1A",
        date: "2023-11-25T08:00:00",
        location: "Phòng y tế trường",
        status: "upcoming",
        description: "Khám sức khỏe định kỳ cho học sinh lớp 1A",
        organizer: "Nguyễn Thị Tâm",
        participants: 32,
      });

      // Simulate API call to get supplies allocated to this event
      setSupplies([
        {
          id: "SUP001",
          itemId: "MED001",
          itemName: "Paracetamol 500mg",
          category: "medicine",
          allocatedQuantity: 15,
          usedQuantity: 0,
          unit: "viên",
          notes: "Dự phòng cho học sinh sốt sau khám",
        },
        {
          id: "SUP002",
          itemId: "SUP001",
          itemName: "Băng gạc vô trùng",
          category: "supply",
          allocatedQuantity: 5,
          usedQuantity: 0,
          unit: "gói",
          notes: "",
        },
        {
          id: "SUP003",
          itemId: "SUP002",
          itemName: "Cồn y tế 70%",
          category: "supply",
          allocatedQuantity: 2,
          usedQuantity: 0,
          unit: "chai",
          notes: "",
        },
      ]);

      // Simulate API call to get available inventory
      setInventory([
        {
          id: "MED001",
          name: "Paracetamol 500mg",
          category: "medicine",
          currentQuantity: 120,
          unit: "viên",
        },
        {
          id: "MED002",
          name: "Vitamin C 1000mg",
          category: "medicine",
          currentQuantity: 60,
          unit: "viên",
        },
        {
          id: "MED003",
          name: "Thuốc ho Bảo Thanh",
          category: "medicine",
          currentQuantity: 8,
          unit: "chai",
        },
        {
          id: "SUP001",
          name: "Băng gạc vô trùng",
          category: "supply",
          currentQuantity: 45,
          unit: "gói",
        },
        {
          id: "SUP002",
          name: "Cồn y tế 70%",
          category: "supply",
          currentQuantity: 12,
          unit: "chai",
        },
        {
          id: "SUP003",
          name: "Nhiệt kế điện tử",
          category: "equipment",
          currentQuantity: 4,
          unit: "cái",
        },
        {
          id: "SUP004",
          name: "Khẩu trang y tế",
          category: "supply",
          currentQuantity: 150,
          unit: "cái",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  // Filter inventory based on search term
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get category badge
  const getCategoryBadge = (category) => {
    switch (category) {
      case "medicine":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Thuốc
          </span>
        );
      case "supply":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Vật tư
          </span>
        );
      case "equipment":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            Thiết bị
          </span>
        );
      default:
        return null;
    }
  };

  // Handle selecting an item from inventory
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowAddModal(true);
  };

  // Handle adding an item to the event supplies
  const handleAddSupply = () => {
    // In a real application, this would be an API call
    const newSupply = {
      id: `SUP${Math.floor(Math.random() * 10000)}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      category: selectedItem.category,
      allocatedQuantity: quantity,
      usedQuantity: 0,
      unit: selectedItem.unit,
      notes: "",
    };

    setSupplies([...supplies, newSupply]);
    setShowAddModal(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  // Handle removing an item from event supplies
  const handleRemoveSupply = (supplyId) => {
    // In a real application, this would be an API call
    setSupplies(supplies.filter((supply) => supply.id !== supplyId));
  };

  // Handle updating used quantity
  const handleUpdateUsed = (supplyId, usedQuantity) => {
    // In a real application, this would be an API call
    setSupplies(
      supplies.map((supply) =>
        supply.id === supplyId
          ? { ...supply, usedQuantity: parseInt(usedQuantity) || 0 }
          : supply
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link
          to={`/staff/health-events/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại chi tiết sự kiện
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Quản lý vật tư y tế cho sự kiện
              </h1>
              <p className="text-gray-600">{event.name}</p>
              <p className="text-gray-500 text-sm">
                Thời gian: {formatDate(event.date)}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
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
              Thêm vật tư
            </button>
          </div>

          {/* Event supplies list */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">
                Vật tư y tế đã phân bổ
              </h2>
            </div>

            {supplies.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  Chưa có vật tư y tế nào được phân bổ cho sự kiện này
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tên sản phẩm
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loại
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Số lượng phân bổ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Đã sử dụng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ghi chú
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
                    {supplies.map((supply) => (
                      <tr key={supply.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {supply.itemName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {supply.itemId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCategoryBadge(supply.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {supply.allocatedQuantity} {supply.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max={supply.allocatedQuantity}
                            value={supply.usedQuantity}
                            onChange={(e) =>
                              handleUpdateUsed(supply.id, e.target.value)
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-1 text-sm text-gray-500">
                            / {supply.allocatedQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={supply.notes}
                            onChange={(e) =>
                              setSupplies(
                                supplies.map((s) =>
                                  s.id === supply.id
                                    ? { ...s, notes: e.target.value }
                                    : s
                                )
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Thêm ghi chú"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveSupply(supply.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add supply modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-blue-800">
                    Thêm vật tư y tế
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedItem(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  {/* Search inventory */}
                  <div className="mb-6">
                    <label
                      htmlFor="searchTerm"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tìm kiếm vật tư
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="searchTerm"
                        placeholder="Nhập tên vật tư..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
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
                  </div>

                  {/* Inventory list */}
                  <div className="border border-gray-200 rounded-md overflow-hidden mb-6">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tên sản phẩm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Loại
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Số lượng có sẵn
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Chọn
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredInventory.length === 0 ? (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-6 py-4 text-center text-gray-500"
                              >
                                Không tìm thấy vật tư phù hợp
                              </td>
                            </tr>
                          ) : (
                            filteredInventory.map((item) => (
                              <tr
                                key={item.id}
                                className={`hover:bg-gray-50 ${
                                  selectedItem?.id === item.id
                                    ? "bg-blue-50"
                                    : ""
                                }`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.id}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {getCategoryBadge(item.category)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {item.currentQuantity} {item.unit}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => handleSelectItem(item)}
                                    className={`px-3 py-1 rounded-md ${
                                      selectedItem?.id === item.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                  >
                                    {selectedItem?.id === item.id
                                      ? "Đã chọn"
                                      : "Chọn"}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected item details */}
                  {selectedItem && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Thông tin vật tư đã chọn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Tên sản phẩm
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedItem.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Mã sản phẩm
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedItem.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Loại
                          </p>
                          <p className="text-base text-gray-900">
                            {getCategoryBadge(selectedItem.category)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Số lượng có sẵn
                          </p>
                          <p className="text-base text-gray-900">
                            {selectedItem.currentQuantity} {selectedItem.unit}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Số lượng cần phân bổ{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={selectedItem.currentQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md">
                            {selectedItem.unit}
                          </span>
                        </div>
                        {quantity > selectedItem.currentQuantity && (
                          <p className="mt-1 text-sm text-red-600">
                            Số lượng không thể vượt quá số lượng có sẵn (
                            {selectedItem.currentQuantity} {selectedItem.unit})
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddSupply}
                      disabled={
                        !selectedItem ||
                        quantity <= 0 ||
                        quantity > selectedItem.currentQuantity
                      }
                      className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm transition-colors ${
                        !selectedItem ||
                        quantity <= 0 ||
                        quantity > selectedItem.currentQuantity
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }`}
                    >
                      Thêm vào sự kiện
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MedicalEventSupplies;
