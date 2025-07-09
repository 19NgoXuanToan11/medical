import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiSearch,
  FiTag,
  FiLoader,
} from "react-icons/fi";
import { healthCheckItemService } from "../../../utils/api/healthCheckItem/healthCheckItemService";

const ExaminationCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState({
    code: "",
    name: "",
    category: "",
    estimatedTimeMinutes: 0,
    description: "",
    isActive: true,
  });

  const categoryTypes = [
    { value: "Khám thể lực", label: "Khám thể lực" },
    { value: "Sensory", label: "Khám giác quan" },
    { value: "Oral", label: "Khám răng miệng" },
    { value: "Khám tim mạch", label: "Khám tim mạch" },
    { value: "Respiratory", label: "Khám hô hấp" },
    { value: "Musculoskeletal", label: "Khám xương khớp" },
    { value: "Dermatology", label: "Khám da liễu" },
    { value: "Neurological", label: "Khám thần kinh" },
    { value: "Mental", label: "Khám sức khỏe tâm thần" },
  ];

  // Map backend DTO to frontend data structure
  const mapBackendToFrontend = (backendItem) => ({
    id: backendItem.itemId,
    code: backendItem.code,
    name: backendItem.name,
    type: backendItem.category,
    duration: backendItem.estimatedTimeMinutes,
    description: backendItem.description || "",
    isActive: backendItem.isActive,
  });

  // Map frontend data to backend DTO structure
  const mapFrontendToBackend = (frontendItem, isUpdate = false) => {
    const baseData = {
      code: frontendItem.code,
      name: frontendItem.name,
      category: frontendItem.category,
      estimatedTimeMinutes: frontendItem.estimatedTimeMinutes,
      description: frontendItem.description,
      isActive: frontendItem.isActive,
    };

    if (isUpdate) {
      // For updates, we only send changed fields
      return baseData;
    } else {
      // For creation, include required medical supplies array
      return {
        ...baseData,
        requiredMedicalSupplies: [], // Empty by default, can be updated later
      };
    }
  };

  // Load all health check items on component mount
  useEffect(() => {
    loadHealthCheckItems();
  }, []);

  const loadHealthCheckItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await healthCheckItemService.getAllHealthCheckItems();

      if (result.success) {
        const mappedCategories = result.data.map(mapBackendToFrontend);
        setCategories(mappedCategories);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách hạng mục khám");
      console.error("Error loading health check items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (
      newCategory.name &&
      newCategory.category &&
      newCategory.estimatedTimeMinutes > 0
    ) {
      try {
        setSubmitting(true);

        // Check if code already exists
        const codeCheckResult = await healthCheckItemService.checkCodeExists(
          newCategory.code
        );
        if (codeCheckResult.success && codeCheckResult.data) {
          setError("Mã hạng mục khám đã tồn tại");
          return;
        }

        const backendData = mapFrontendToBackend(newCategory);
        const result = await healthCheckItemService.createHealthCheckItem(
          backendData
        );

        if (result.success) {
          const newMappedCategory = mapBackendToFrontend(result.data);
          setCategories([...categories, newMappedCategory]);
          closeModal();
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể tạo hạng mục khám mới");
        console.error("Error creating health check item:", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      code: category.code,
      name: category.name,
      category: category.type,
      estimatedTimeMinutes: category.duration,
      description: category.description,
      isActive: category.isActive,
    });
    setShowAddModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      setSubmitting(true);

      // Check if code already exists (excluding current item)
      if (newCategory.code !== editingCategory.code) {
        const codeCheckResult = await healthCheckItemService.checkCodeExists(
          newCategory.code,
          editingCategory.id
        );
        if (codeCheckResult.success && codeCheckResult.data) {
          setError("Mã hạng mục khám đã tồn tại");
          return;
        }
      }

      const backendData = mapFrontendToBackend(newCategory, true);
      const result = await healthCheckItemService.updateHealthCheckItem(
        editingCategory.id,
        backendData
      );

      if (result.success) {
        const updatedMappedCategory = mapBackendToFrontend(result.data);
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? updatedMappedCategory : c
          )
        );
        closeModal();
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Không thể cập nhật hạng mục khám");
      console.error("Error updating health check item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hạng mục khám này?")) {
      try {
        const result = await healthCheckItemService.deleteHealthCheckItem(id);

        if (result.success) {
          setCategories(categories.filter((c) => c.id !== id));
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Không thể xóa hạng mục khám");
        console.error("Error deleting health check item:", err);
      }
    }
  };

  const toggleCategoryStatus = async (id) => {
    try {
      const category = categories.find((c) => c.id === id);
      if (!category) return;

      const updatedData = {
        code: category.code,
        name: category.name,
        category: category.type,
        estimatedTimeMinutes: category.duration,
        description: category.description,
        isActive: !category.isActive,
      };

      const result = await healthCheckItemService.updateHealthCheckItem(
        id,
        updatedData
      );

      if (result.success) {
        setCategories(
          categories.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          )
        );
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Không thể thay đổi trạng thái hạng mục khám");
      console.error("Error toggling category status:", err);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setNewCategory({
      code: "",
      name: "",
      category: "",
      estimatedTimeMinutes: 0,
      description: "",
      isActive: true,
    });
    setSubmitting(false);
  };

  const getTypeLabel = (type) => {
    const typeObj = categoryTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <FiLoader className="w-6 h-6 animate-spin text-primary-600" />
            <span className="text-neutral-600 dark:text-neutral-400">
              Đang tải danh sách hạng mục khám...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Quản lý hạng mục khám
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Quản lý các hạng mục khám sức khỏe cho học sinh
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hạng mục khám..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Thêm hạng mục
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-md transition-shadow ${
              !category.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {category.name}
                  </h3>
                  {!category.isActive && (
                    <span className="ml-2 px-2 py-1 bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400 text-xs rounded">
                      Tạm ngưng
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  <FiTag className="w-3 h-3 mr-1" />
                  <span>{getTypeLabel(category.type)}</span>
                </div>
                <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                  <FiClock className="w-3 h-3 mr-1" />
                  <span>{category.duration} phút</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => toggleCategoryStatus(category.id)}
                  className={`p-1 text-sm ${
                    category.isActive
                      ? "text-green-600 dark:text-green-400 hover:text-green-700"
                      : "text-red-600 dark:text-red-400 hover:text-red-700"
                  }`}
                  title={category.isActive ? "Tạm ngưng" : "Kích hoạt"}
                >
                  {category.isActive ? "●" : "○"}
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                {category.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FiTag className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            {searchTerm
              ? "Không tìm thấy hạng mục khám"
              : "Chưa có hạng mục khám nào"}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-500 mb-4">
            {searchTerm
              ? "Thử thay đổi từ khóa tìm kiếm"
              : "Thêm hạng mục khám đầu tiên để bắt đầu"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Thêm hạng mục khám
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {editingCategory
                ? "Chỉnh sửa hạng mục khám"
                : "Thêm hạng mục khám mới"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Mã hạng mục *
                </label>
                <input
                  type="text"
                  value={newCategory.code}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="Ví dụ: EYE001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên hạng mục *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="Ví dụ: Kiểm tra thị lực"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Loại khám *
                </label>
                <select
                  value={newCategory.category}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="">Chọn loại khám</option>
                  {categoryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Thời gian (phút) *
                </label>
                <input
                  type="number"
                  value={newCategory.estimatedTimeMinutes}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      estimatedTimeMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  min="1"
                  placeholder="Thời gian dự kiến"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  rows="3"
                  placeholder="Mô tả chi tiết về hạng mục khám này"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newCategory.isActive}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      isActive: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Kích hoạt hạng mục này
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={
                  editingCategory ? handleUpdateCategory : handleAddCategory
                }
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {submitting && (
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingCategory ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationCategoryManagement;
