import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch } from "react-icons/fi";

const ClassManagement = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "Lớp 1A", studentCount: 25, grade: "1", section: "A" },
    { id: 2, name: "Lớp 1B", studentCount: 24, grade: "1", section: "B" },
    { id: 3, name: "Lớp 1C", studentCount: 26, grade: "1", section: "C" },
    { id: 4, name: "Lớp 2A", studentCount: 28, grade: "2", section: "A" },
    { id: 5, name: "Lớp 2B", studentCount: 27, grade: "2", section: "B" },
    { id: 6, name: "Lớp 2C", studentCount: 25, grade: "2", section: "C" },
    { id: 7, name: "Lớp 3A", studentCount: 30, grade: "3", section: "A" },
    { id: 8, name: "Lớp 3B", studentCount: 29, grade: "3", section: "B" },
    { id: 9, name: "Lớp 3C", studentCount: 28, grade: "3", section: "C" },
    { id: 10, name: "Lớp 4A", studentCount: 27, grade: "4", section: "A" },
    { id: 11, name: "Lớp 4B", studentCount: 26, grade: "4", section: "B" },
    { id: 12, name: "Lớp 5A", studentCount: 24, grade: "5", section: "A" },
    { id: 13, name: "Lớp 5B", studentCount: 25, grade: "5", section: "B" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    name: "",
    grade: "",
    section: "",
    studentCount: 0,
  });

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.grade.includes(searchTerm) ||
      classItem.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = () => {
    if (newClass.name && newClass.grade && newClass.section) {
      const id = Math.max(...classes.map((c) => c.id)) + 1;
      setClasses([...classes, { ...newClass, id }]);
      setNewClass({ name: "", grade: "", section: "", studentCount: 0 });
      setShowAddModal(false);
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setNewClass(classItem);
    setShowAddModal(true);
  };

  const handleUpdateClass = () => {
    setClasses(
      classes.map((c) =>
        c.id === editingClass.id ? { ...newClass, id: editingClass.id } : c
      )
    );
    setEditingClass(null);
    setNewClass({ name: "", grade: "", section: "", studentCount: 0 });
    setShowAddModal(false);
  };

  const handleDeleteClass = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp này?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClass(null);
    setNewClass({ name: "", grade: "", section: "", studentCount: 0 });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Quản lý lớp
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Quản lý thông tin các lớp học trong trường
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm lớp..."
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
          Thêm lớp
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {classItem.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Khối {classItem.grade}
                </p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditClass(classItem)}
                  className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClass(classItem.id)}
                  className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center text-neutral-600 dark:text-neutral-400">
              <FiUsers className="w-4 h-4 mr-1" />
              <span className="text-sm">{classItem.studentCount} học sinh</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {editingClass ? "Chỉnh sửa lớp" : "Thêm lớp mới"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tên lớp
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="Ví dụ: Lớp 1A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Khối
                </label>
                <select
                  value={newClass.grade}
                  onChange={(e) =>
                    setNewClass({ ...newClass, grade: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="">Chọn khối</option>
                  <option value="1">Khối 1</option>
                  <option value="2">Khối 2</option>
                  <option value="3">Khối 3</option>
                  <option value="4">Khối 4</option>
                  <option value="5">Khối 5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Ban
                </label>
                <input
                  type="text"
                  value={newClass.section}
                  onChange={(e) =>
                    setNewClass({ ...newClass, section: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  placeholder="Ví dụ: A, B, C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Số học sinh
                </label>
                <input
                  type="number"
                  value={newClass.studentCount}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      studentCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-200"
                  min="0"
                />
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
                onClick={editingClass ? handleUpdateClass : handleAddClass}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingClass ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
