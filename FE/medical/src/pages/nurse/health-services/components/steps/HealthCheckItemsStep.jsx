import React, { useState, useEffect } from "react";
import {
  FiClipboard,
  FiClock,
  FiTool,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiActivity,
  FiEye,
  FiHeart,
  FiMaximize,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiPackage,
} from "react-icons/fi";
import { formatDuration } from "../../utils/healthCheckHelpers";

const HealthCheckItemsStep = ({
  formData,
  validationErrors,
  onCheckItemToggle,
  healthCheckItems,
  onInputChange,
  equipmentStatus,
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Show message when no health check items are available
  if (!healthCheckItems || healthCheckItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Chưa có hạng mục khám
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Hiện tại chưa có hạng mục khám sức khỏe nào được cấu hình trong hệ
          thống.
          <br />
          Vui lòng liên hệ quản trị viên để thêm dữ liệu.
        </p>
      </div>
    );
  }

  // Group health check items by category
  const categorizedItems = healthCheckItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(categorizedItems);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "physical":
        return <FiActivity className="w-5 h-5" />;
      case "vision":
        return <FiEye className="w-5 h-5" />;
      case "cardiovascular":
        return <FiHeart className="w-5 h-5" />;
      case "growth":
        return <FiMaximize className="w-5 h-5" />;
      case "general":
        return <FiUser className="w-5 h-5" />;
      default:
        return <FiClipboard className="w-5 h-5" />;
    }
  };

  const getCategoryName = (category) => {
    const names = {
      physical: "Khám thể lực",
      vision: "Khám mắt",
      cardiovascular: "Khám tim mạch",
      growth: "Đo tăng trưởng",
      general: "Khám tổng quát",
    };
    return names[category] || category;
  };

  const getTotalSelectedTime = () => {
    return formData.checkItems.reduce((total, itemId) => {
      const item = healthCheckItems.find((h) => h.id === itemId);
      return total + (item?.estimatedTime || 0);
    }, 0);
  };

  const getSelectedEquipment = () => {
    const equipment = new Set();
    formData.checkItems.forEach((itemId) => {
      const item = healthCheckItems.find((h) => h.id === itemId);
      if (item?.equipment) {
        item.equipment.forEach((eq) => equipment.add(eq));
      }
    });
    return Array.from(equipment);
  };

  const getEquipmentStatusIcon = (equipment) => {
    if (!equipment.available) {
      return <FiXCircle className="w-4 h-4 text-red-500" />;
    } else if (!equipment.isInStock) {
      return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
    } else if (equipment.stockQuantity <= 5) {
      return <FiAlertCircle className="w-4 h-4 text-orange-500" />;
    } else {
      return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getEquipmentStatusText = (equipment) => {
    if (!equipment.available) {
      return "Không có trong kho";
    } else if (!equipment.isInStock) {
      return "Hết hàng";
    } else if (equipment.stockQuantity <= 5) {
      return `Sắp hết (${equipment.stockQuantity} đơn vị)`;
    } else {
      return `Còn ${equipment.stockQuantity} đơn vị`;
    }
  };

  const getEquipmentRequiredQuantity = (equipmentName) => {
    let totalRequired = 0;
    formData.checkItems.forEach((itemId) => {
      const item = healthCheckItems.find((h) => h.id === itemId);
      if (item?.requiredMedicalSupplies) {
        item.requiredMedicalSupplies.forEach((supply) => {
          if (supply.medicalSupply?.name === equipmentName) {
            totalRequired += supply.quantityRequired || 1;
          }
        });
      } else if (item?.equipment) {
        item.equipment.forEach((eq) => {
          if (eq === equipmentName) {
            totalRequired += 1; // Default quantity
          }
        });
      }
    });
    return totalRequired || 1; // Default to 1 if not specified
  };

  const filteredItems =
    selectedCategory === "all"
      ? healthCheckItems
      : categorizedItems[selectedCategory] || [];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClipboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Hạng mục đã chọn
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formData.checkItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                Tổng thời gian
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatDuration(getTotalSelectedTime())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Status Alert */}
      {equipmentStatus && !equipmentStatus.allAvailable && (
        <div
          className={`rounded-lg p-4 border ${
            equipmentStatus.hasUnavailable
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {equipmentStatus.hasUnavailable ? (
                <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              ) : (
                <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3
                className={`text-sm font-medium ${
                  equipmentStatus.hasUnavailable
                    ? "text-red-800 dark:text-red-300"
                    : "text-yellow-800 dark:text-yellow-300"
                }`}
              >
                {equipmentStatus.hasUnavailable
                  ? "Thiết bị không có sẵn"
                  : "Thiết bị hết hàng"}
              </h3>
              <p
                className={`text-sm mt-1 ${
                  equipmentStatus.hasUnavailable
                    ? "text-red-700 dark:text-red-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {equipmentStatus.hasUnavailable
                  ? `${equipmentStatus.unavailableEquipment.length} thiết bị không có trong kho. Cần liên hệ quản lý để bổ sung.`
                  : `${equipmentStatus.outOfStockEquipment.length} thiết bị đã hết hàng. Cần nhập thêm trước khi thực hiện khám.`}
              </p>
              {equipmentStatus.hasUnavailable && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Thiết bị thiếu:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 mt-1">
                    {equipmentStatus.unavailableEquipment.map((eq, index) => (
                      <li key={index}>{eq.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {equipmentStatus.hasOutOfStock && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Thiết bị hết hàng:
                  </p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {equipmentStatus.outOfStockEquipment.map((eq, index) => (
                      <li key={index}>{eq.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationErrors.checkItems && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {validationErrors.checkItems}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <FiClipboard className="mr-2" />
            Chọn hạng mục khám sức khỏe
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Chọn các hạng mục kiểm tra phù hợp với mục tiêu khám sức khỏe
          </p>
        </div>

        <div className="p-6">
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Tất cả ({healthCheckItems.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  selectedCategory === category
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {getCategoryIcon(category)}
                <span className="ml-2">
                  {getCategoryName(category)} (
                  {categorizedItems[category].length})
                </span>
              </button>
            ))}
          </div>

          {/* Health Check Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  formData.checkItems.includes(item.id)
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                }`}
                onClick={() => onCheckItemToggle(item.id)}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.checkItems.includes(item.id)}
                    onChange={() => onCheckItemToggle(item.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded mt-1 bg-white dark:bg-gray-900"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.category === "physical"
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                            : item.category === "sensory"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                            : item.category === "cardiovascular"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                            : item.category === "oral"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {getCategoryName(item.category)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FiClock className="w-3 h-3 mr-1" />
                        {item.estimatedTime} phút
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FiTool className="w-3 h-3 mr-1" />
                        {(item.equipment?.length || 0) +
                          (!item.equipment || item.equipment.length === 0
                            ? item.requiredMedicalSupplies?.length || 0
                            : 0)}{" "}
                        thiết bị
                      </div>
                    </div>

                    {/* Equipment details */}
                    {((item.equipment && item.equipment.length > 0) ||
                      (item.requiredMedicalSupplies &&
                        item.requiredMedicalSupplies.length > 0)) && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Thiết bị cần:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {/* Show equipment from equipment array */}
                          {item.equipment &&
                            item.equipment.length > 0 &&
                            item.equipment.slice(0, 2).map((eq, index) => (
                              <span
                                key={`eq-${index}`}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {eq}
                              </span>
                            ))}
                          {/* Fallback: Show equipment from requiredMedicalSupplies */}
                          {(!item.equipment || item.equipment.length === 0) &&
                            item.requiredMedicalSupplies &&
                            item.requiredMedicalSupplies
                              .slice(0, 2)
                              .map((supply, index) => (
                                <span
                                  key={`supply-${index}`}
                                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                >
                                  {supply.medicalSupply?.name ||
                                    supply.name ||
                                    "Unknown"}
                                </span>
                              ))}
                          {/* Show +X more count */}
                          {((item.equipment && item.equipment.length > 2) ||
                            ((!item.equipment || item.equipment.length === 0) &&
                              item.requiredMedicalSupplies &&
                              item.requiredMedicalSupplies.length > 2)) && (
                            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                              +
                              {item.equipment && item.equipment.length > 2
                                ? item.equipment.length - 2
                                : item.requiredMedicalSupplies.length - 2}{" "}
                              khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Equipment Summary with Availability Status */}
      {formData.checkItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiPackage className="mr-2" />
                Thiết bị cần thiết
              </h3>
            </div>
          </div>
          <div className="p-6">
            {equipmentStatus ? (
              <>
                {/* Equipment Status Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Tổng thiết bị
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {equipmentStatus.equipment.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 ${
                      equipmentStatus.allAvailable
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {equipmentStatus.allAvailable ? (
                        <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : (
                        <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            equipmentStatus.allAvailable
                              ? "text-green-900 dark:text-green-200"
                              : "text-red-900 dark:text-red-200"
                          }`}
                        >
                          Trạng thái
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            equipmentStatus.allAvailable
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {equipmentStatus.allAvailable
                            ? "Sẵn sàng"
                            : "Thiếu hàng"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 ${
                      equipmentStatus.hasOutOfStock ||
                      equipmentStatus.hasUnavailable
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {equipmentStatus.hasOutOfStock ||
                      equipmentStatus.hasUnavailable ? (
                        <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      ) : (
                        <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            equipmentStatus.hasOutOfStock ||
                            equipmentStatus.hasUnavailable
                              ? "text-yellow-900 dark:text-yellow-200"
                              : "text-green-900 dark:text-green-200"
                          }`}
                        >
                          Cảnh báo
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            equipmentStatus.hasOutOfStock ||
                            equipmentStatus.hasUnavailable
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {(equipmentStatus.hasUnavailable
                            ? equipmentStatus.unavailableEquipment.length
                            : 0) +
                            (equipmentStatus.hasOutOfStock
                              ? equipmentStatus.outOfStockEquipment.length
                              : 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Equipment List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Chi tiết thiết bị cần thiết:
                  </h4>
                  {equipmentStatus.equipment.map((equipment, index) => {
                    const requiredQty = getEquipmentRequiredQuantity(
                      equipment.name
                    );
                    const isLowStock =
                      equipment.available &&
                      equipment.isInStock &&
                      equipment.stockQuantity <= 5;
                    const isInsufficient =
                      equipment.available &&
                      equipment.isInStock &&
                      equipment.stockQuantity < requiredQty;

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          equipment.available &&
                          equipment.isInStock &&
                          !isInsufficient
                            ? isLowStock
                              ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : equipment.available && !equipment.isInStock
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center flex-1">
                          {getEquipmentStatusIcon(equipment)}
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {equipment.name}
                              </span>
                              <div className="flex items-center space-x-4 text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Cần:{" "}
                                  <span className="font-semibold">
                                    {requiredQty}
                                  </span>
                                </span>
                                <span
                                  className={`font-semibold ${
                                    equipment.available &&
                                    equipment.isInStock &&
                                    !isInsufficient
                                      ? isLowStock
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-green-600 dark:text-green-400"
                                      : equipment.available &&
                                        !equipment.isInStock
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {getEquipmentStatusText(equipment)}
                                </span>
                              </div>
                            </div>

                            {/* Additional info for problematic equipment */}
                            {!equipment.available && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                ⚠️ Thiết bị này chưa có trong hệ thống kho
                              </p>
                            )}
                            {equipment.available && !equipment.isInStock && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                ⚠️ Cần nhập thêm {requiredQty} đơn vị để thực
                                hiện khám
                              </p>
                            )}
                            {isInsufficient && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                ⚠️ Thiếu {requiredQty - equipment.stockQuantity}{" "}
                                đơn vị so với yêu cầu
                              </p>
                            )}
                            {isLowStock && !isInsufficient && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                📦 Tồn kho thấp, nên bổ sung thêm
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSelectedEquipment().map((equipment, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <FiTool className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {equipment}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckItemsStep;
