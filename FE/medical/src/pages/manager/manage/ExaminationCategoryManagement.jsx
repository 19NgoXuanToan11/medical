import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiSearch,
  FiTag,
} from "react-icons/fi";

const ExaminationCategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Chiều cao & Cân nặng",
      type: "Khám thể lực",
      duration: 5,
      description: "Đo chiều cao, cân nặng và tính BMI",
      isActive: true,
    },
    {
      id: 2,
      name: "Thị lực",
      type: "sensory",
      duration: 10,
      description: "Kiểm tra thị lực, gần và màu sắc",
      isActive: true,
    },
    {
      id: 3,
      name: "Thính lực",
      type: "sensory",
      duration: 8,
      description: "Kiểm tra khả năng nghe và phân biệt âm thanh",
      isActive: true,
    },
    {
      id: 4,
      name: "Răng miệng",
      type: "oral",
      duration: 12,
      description: "Kiểm tra sâu răng, nướu và vệ sinh răng miệng",
      isActive: true,
    },
    {
      id: 5,
      name: "Tim mạch",
      type: "Khám tim mạch",
      duration: 10,
      description: "Nghe tim, đo huyết áp và kiểm tra mạch",
      isActive: true,
    },
    {
      id: 6,
      name: "Hô hấp",
      type: "respiratory",
      duration: 8,
      description: "Khám phổi và đường hô hấp",
      isActive: true,
    },
    {
      id: 7,
      name: "Xương khớp",
      type: "musculoskeletal",
      duration: 15,
      description: "Kiểm tra tư thế, cột sống và khớp",
      isActive: true,
    },
    {
      id: 8,
      name: "Da liều",
      type: "dermatology",
      duration: 8,
      description: "Kiểm tra da, tóc và móng",
      isActive: true,
    },
    {
      id: 9,
      name: "Thần kinh",
      type: "neurological",
      duration: 12,
      description: "Kiểm tra phản xạ và chức năng thần kinh",
      isActive: true,
    },
    {
      id: 10,
      name: "Sức khỏe tâm thần",
      type: "mental",
      duration: 20,
      description: "Đánh giá tâm lý và hành vi học đường",
      isActive: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "",
    duration: 0,
    description: "",
    isActive: true,
  });

  const categoryTypes = [
    { value: "Khám thể lực", label: "Khám thể lực" },
    { value: "sensory", label: "Sensory" },
    { value: "oral", label: "Oral" },
    { value: "Khám tim mạch", label: "Khám tim mạch" },
    { value: "respiratory", label: "Respiratory" },
    { value: "musculoskeletal", label: "Musculoskeletal" },
    { value: "dermatology", label: "Dermatology" },
    { value: "neurological", label: "Neurological" },
    { value: "mental", label: "Mental" },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.type && newCategory.duration > 0) {
      const id = Math.max(...categories.map((c) => c.id)) + 1;
      setCategories([...categories, { ...newCategory, id }]);
      setNewCategory({
        name: "",
        type: "",
        duration: 0,
        description: "",
        isActive: true,
      });
      setShowAddModal(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setShowAddModal(true);
  };

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((c) =>
        c.id === editingCategory.id
          ? { ...newCategory, id: editingCategory.id }
          : c
      )
    );
    setEditingCategory(null);
    setNewCategory({
      name: "",
      type: "",
      duration: 0,
      description: "",
      isActive: true,
    });
    setShowAddModal(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hạng mục khám này?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const toggleCategoryStatus = (id) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setNewCategory({
      name: "",
      type: "",
      duration: 0,
      description: "",
      isActive: true,
    });
  };

  const getTypeLabel = (type) => {
    const typeObj = categoryTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {editingCategory
                ? "Chỉnh sửa hạng mục khám"
                : "Thêm hạng mục khám mới"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên hạng mục
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
                  Loại khám
                </label>
                <select
                  value={newCategory.type}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, type: e.target.value })
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
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={newCategory.duration}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      duration: parseInt(e.target.value) || 0,
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
                className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Hủy
              </button>
              <button
                onClick={
                  editingCategory ? handleUpdateCategory : handleAddCategory
                }
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
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
