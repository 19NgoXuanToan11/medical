import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiAlertTriangle,
  FiInfo,
  FiRefreshCw,
  FiLoader,
} from "react-icons/fi";
import { staffService } from "../../../../../utils/staff/staffService";

const TargetLogisticsHealthStep = ({
  formData,
  validationErrors,
  onInputChange,
  onGradeSelection,
  availableGrades,
  totalStudents,
  loadingGrades = false,
  gradesError = null,
  onRetryLoadGrades,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedGrades, setExpandedGrades] = useState({}); // { gradeId: true/false }
  const [expandedClasses, setExpandedClasses] = useState({}); // { classKey: true/false }
  const [assignedClasses, setAssignedClasses] = useState([]); // [{ classId, className, gradeLevel, students: [] }]
  const [loadingAssigned, setLoadingAssigned] = useState(true);

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoadingAssigned(true);
      try {
        const result = await staffService.getMyAssignedClasses();
        if (result.success && Array.isArray(result.data)) {
          setAssignedClasses(result.data);
        } else {
          setAssignedClasses([]);
        }
      } catch (e) {
        setAssignedClasses([]);
      } finally {
        setLoadingAssigned(false);
      }
    };
    fetchAssigned();
  }, []);

  // Toggle grade expansion
  const handleToggleGrade = (gradeId) => {
    setExpandedGrades((prev) => ({
      ...prev,
      [gradeId]: !prev[gradeId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Target Selection */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Đối tượng khám sức khỏe
        </h3>

        {/* Grade Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            <FiUsers className="inline w-4 h-4 mr-1" />
            Chọn khối lớp *
          </label>

          {/* Loading State */}
          {loadingGrades && (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="w-6 h-6 animate-spin text-primary-600 dark:text-primary-400 mr-3" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Đang tải danh sách lớp học...
              </span>
            </div>
          )}

          {/* Error State */}
          {gradesError && !loadingGrades && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-red-700 dark:text-red-300">
                    {gradesError}
                  </span>
                </div>
                {onRetryLoadGrades && (
                  <button
                    onClick={onRetryLoadGrades}
                    className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-1" />
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Automatic Grade Selection Info */}
          {!loadingGrades && !gradesError && availableGrades.length > 0 && (
            <>
              {/* Hiển thị thông báo về việc tự động chọn toàn bộ khối */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Tự động chọn toàn bộ khối lớp
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Hệ thống đã tự động chọn tất cả lớp trong khối được phân công cho bạn.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hiển thị danh sách lớp đã được chọn tự động */}
              {(() => {
                // Nhóm lớp theo gradeLevel
                const groupedByGrade = availableGrades.reduce((acc, cls) => {
                  const gradeLevel = cls.gradeLevel || 'Không xác định';
                  if (!acc[gradeLevel]) {
                    acc[gradeLevel] = [];
                  }
                  acc[gradeLevel].push(cls);
                  return acc;
                }, {});

                return Object.entries(groupedByGrade).map(([gradeLevel, classes]) => (
                  <div key={gradeLevel} className="mb-6">
                    <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                      Khối {gradeLevel} ({classes.length} lớp)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classes.map((cls) => (
                        <div key={cls.id} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {cls.name}
                            </h4>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {cls.studentCount} học sinh
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}

              {/* Validation Error */}
              {validationErrors.targetGrades && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.targetGrades}
                </p>
              )}
            </>
          )}


        </div>

        {/* Summary */}
        {formData.targetGrades.length > 0 && (
          <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Tổng kết đối tượng khám
              </h4>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
              >
                {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {totalStudents}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Học sinh
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formData.targetGrades.length}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Lớp học
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {(() => {
                  // Nhóm lớp được chọn theo khối
                  const selectedClasses = formData.targetGrades.map(classId => {
                    const selectedClass = assignedClasses.find((cls) => 
                      cls.classId === classId || cls.id === classId
                    );
                    return selectedClass;
                  }).filter(Boolean);

                  const groupedByGrade = selectedClasses.reduce((acc, cls) => {
                    const gradeLevel = cls.gradeLevel || 'Không xác định';
                    if (!acc[gradeLevel]) {
                      acc[gradeLevel] = [];
                    }
                    acc[gradeLevel].push(cls);
                    return acc;
                  }, {});

                  return Object.entries(groupedByGrade).map(([gradeLevel, classes]) => (
                    <div key={gradeLevel} className="mb-6">
                      <h5 className="text-md font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                        Khối {gradeLevel} ({classes.length} lớp)
                      </h5>
                      {classes.map((selectedClass) => (
                        <div key={selectedClass.classId || selectedClass.id} className="mb-4 ml-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {selectedClass.className || selectedClass.name}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {selectedClass.students?.length || 0} học sinh
                            </span>
                          </div>
                          
                          {/* Danh sách học sinh */}
                          {selectedClass.students && selectedClass.students.length > 0 && (
                            <div className="ml-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedClass.students.map((student, index) => (
                                  <div key={index} className="flex items-center p-2 bg-white dark:bg-neutral-600 rounded border border-neutral-200 dark:border-neutral-500">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                                        {student.hoTen || student.fullName || `Học sinh ${index + 1}`}
                                      </div>
                                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                        {student.maSoHocSinh || student.studentCode || `MS: ${index + 1}`}
                                      </div>
                                    </div>
                                    {student.sucKhoe && student.sucKhoe !== 'Tốt' && (
                                      <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                                        {student.sucKhoe}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetLogisticsHealthStep;
