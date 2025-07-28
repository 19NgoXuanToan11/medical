import React, { useState, useEffect } from "react";
import { FiSearch, FiUsers, FiX, FiCheck } from "react-icons/fi";
import { getStudentsByGrade } from "../../utils/api/student/studentService";

const MultiStudentSelector = ({
  selectedStudents,
  onStudentsChange,
  allowedGrades = [],
  maxStudents = 50,
  placeholder = "Chọn học sinh...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch students based on allowed grades
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        let allStudents = [];

        if (allowedGrades.length > 0) {
          const promises = allowedGrades.map((grade) =>
            getStudentsByGrade(grade)
          );
          const results = await Promise.all(promises);

          results.forEach((result, index) => {
            // API returns data directly, not wrapped in success/data object
            if (result && Array.isArray(result)) {
              allStudents = [...allStudents, ...result];
            }
          });
        } else {
          // If no grade restriction, don't fetch any students
          // This prevents unauthorized access to students from other grades
          allStudents = [];
        }

        setStudents(allStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [allowedGrades]);

  // Filter students based on search term and allowed grades
  const filteredStudents = students.filter((student) => {
    // First, filter by allowed grades if specified
    if (allowedGrades.length > 0) {
      const studentGrade = student.gradeLevel;
      if (!allowedGrades.includes(studentGrade)) {
        return false; // Skip students not in allowed grades
      }
    }

    // Then filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      student.studentCode?.toLowerCase().includes(searchLower) ||
      student.firstName?.toLowerCase().includes(searchLower) ||
      student.lastName?.toLowerCase().includes(searchLower) ||
      student.className?.toLowerCase().includes(searchLower)
    );
  });

  // Handle student selection
  const handleStudentToggle = (student) => {
    const isSelected = selectedStudents.some(
      (s) => s.studentCode === student.studentCode
    );

    if (isSelected) {
      // Remove student
      const updated = selectedStudents.filter(
        (s) => s.studentCode !== student.studentCode
      );
      onStudentsChange(updated);
    } else {
      // Add student (check max limit)
      if (selectedStudents.length >= maxStudents) {
        alert(`Chỉ có thể chọn tối đa ${maxStudents} học sinh`);
        return;
      }
      const updated = [...selectedStudents, student];
      onStudentsChange(updated);
    }
  };

  // Remove selected student
  const removeStudent = (studentCode) => {
    const updated = selectedStudents.filter(
      (s) => s.studentCode !== studentCode
    );
    onStudentsChange(updated);
  };

  // Clear all selections
  const clearAll = () => {
    onStudentsChange([]);
  };

  return (
    <div className="multi-student-selector">
      {/* Selected Students Display */}
      {selectedStudents.length > 0 && (
        <div className="selected-students mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Đã chọn ({selectedStudents.length}/{maxStudents})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStudents.map((student) => (
              <div
                key={student.studentCode}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                <span>
                  {student.studentCode} - {student.firstName} {student.lastName}
                </span>
                <button
                  onClick={() => removeStudent(student.studentCode)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
          <FiSearch className="ml-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100"
          />
          <FiUsers className="mr-3 text-gray-400" size={18} />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Đang tải danh sách học sinh...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Không tìm thấy học sinh"
                  : "Không có học sinh nào"}
              </div>
            ) : (
              <div className="py-2">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudents.some(
                    (s) => s.studentCode === student.studentCode
                  );
                  return (
                    <div
                      key={student.studentCode}
                      onClick={() => handleStudentToggle(student)}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isSelected ? "bg-blue-50 dark:bg-blue-900" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {student.studentCode} - {student.firstName}{" "}
                          {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Lớp {student.className} (Khối {student.gradeLevel})
                        </div>
                      </div>
                      {isSelected && (
                        <FiCheck
                          className="text-blue-600 dark:text-blue-400"
                          size={16}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default MultiStudentSelector;
