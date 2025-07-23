import React, { useState } from "react";
import {
  FiUsers,
  FiAlertTriangle,
  FiInfo,
  FiRefreshCw,
  FiLoader,
} from "react-icons/fi";
import { useEffect } from "react";
import { staffService } from "../../../../../utils/staff/staffService";
import { getStudentCountByGrade } from "../../../../../utils/api/class/classService";

const TargetLogisticsStep = ({
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
  const [studentCountsByGrade, setStudentCountsByGrade] = useState({});

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

  useEffect(() => {
    async function fetchCounts() {
      const counts = {};
      // Fetch counts for ALL available grades, not just selected ones
      for (const grade of availableGrades) {
        try {
          const res = await getStudentCountByGrade(grade.gradeLevel);
          counts[grade.id] = res.studentCount;
        } catch (error) {
          console.error(
            `Error fetching count for grade ${grade.gradeLevel}:`,
            error
          );
          counts[grade.id] = 0;
        }
      }
      setStudentCountsByGrade(counts);
    }

    // Only fetch when availableGrades is loaded and not empty
    if (availableGrades.length > 0) {
      fetchCounts();
    }
  }, [availableGrades]); // Remove formData.targetGrades dependency

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
          Đối tượng tiêm chủng
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

          {/* Classes Grid */}
          {!loadingGrades && !gradesError && availableGrades.length === 0 && (
            <div className="text-center py-8">
              <FiInfo className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Không có lớp học nào đang hoạt động
              </p>
              {onRetryLoadGrades && (
                <button
                  onClick={onRetryLoadGrades}
                  className="mt-3 flex items-center justify-center mx-auto px-4 py-2 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Tải lại danh sách
                </button>
              )}
            </div>
          )}

          {!loadingGrades && !gradesError && availableGrades.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {availableGrades.map((grade) => (
                <label
                  key={grade.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md w-full ${
                    formData.targetGrades.includes(grade.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800"
                      : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.targetGrades.includes(grade.id)}
                    onChange={(e) => {
                      const newSelectedGrades = e.target.checked
                        ? [...formData.targetGrades, grade.id]
                        : formData.targetGrades.filter((id) => id !== grade.id);
                      onInputChange("targetGrades", newSelectedGrades);
                    }}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      {grade.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {studentCountsByGrade[grade.id] ?? 0} học sinh
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      Lớp:{" "}
                      {grade.classes ? grade.classes.join(", ") : "Không có"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {grade.ageRange}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Validation Error */}
          {validationErrors.targetGrades && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {validationErrors.targetGrades}
            </p>
          )}
        </div>

        {/* Summary */}
        {formData.targetGrades.length > 0 && (
          <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Tổng kết đối tượng tiêm
              </h4>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
              >
                {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {/* Count unique grade levels */}
                  {
                    new Set(
                      formData.targetGrades
                        .map((gradeId) => {
                          const grade = availableGrades.find(
                            (g) => g.id === gradeId
                          );
                          return grade?.gradeLevel;
                        })
                        .filter(Boolean)
                    ).size
                  }
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Khối lớp
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formData.targetGrades.reduce(
                    (sum, gradeId) =>
                      sum + (studentCountsByGrade[gradeId] ?? 0),
                    0
                  )}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Học sinh
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {/* Calculate total number of classes across all selected grades */}
                  {formData.targetGrades.reduce((total, gradeId) => {
                    const grade = availableGrades.find((g) => g.id === gradeId);
                    return total + (grade?.classCount || 0);
                  }, 0)}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Lớp học
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {formData.targetGrades.map((gradeId) => {
                  const grade = availableGrades.find((g) => g.id === gradeId);
                  if (!grade) return null;
                  // Lọc các lớp thuộc khối này từ assignedClasses
                  const classesInGrade = assignedClasses.filter(
                    (cls) => `${cls.gradeLevel}` === `${grade.gradeLevel}`
                  );
                  return (
                    <div key={gradeId} className="mb-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setExpandedGrades((prev) => ({
                            ...prev,
                            [gradeId]: !prev[gradeId],
                          }))
                        }
                      >
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {grade.name}
                        </span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {studentCountsByGrade[gradeId] ?? 0} học sinh
                        </span>
                      </div>
                      {expandedGrades[gradeId] && (
                        <div className="ml-4 mt-2">
                          {loadingAssigned ? (
                            <div className="text-xs text-gray-500">
                              Đang tải danh sách lớp...
                            </div>
                          ) : classesInGrade.length > 0 ? (
                            classesInGrade.map((cls) => {
                              const classKey = `${gradeId}-${cls.classId}`;
                              return (
                                <div key={classKey} className="mb-2">
                                  <div
                                    className="flex items-center justify-between cursor-pointer px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                                    onClick={() =>
                                      setExpandedClasses((prev) => ({
                                        ...prev,
                                        [classKey]: !prev[classKey],
                                      }))
                                    }
                                  >
                                    <span className="font-medium text-blue-700 dark:text-blue-300">
                                      Lớp {cls.className}
                                    </span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400">
                                      {cls.students?.length || 0} học sinh
                                    </span>
                                  </div>
                                  {expandedClasses[classKey] && (
                                    <div className="ml-4 mt-2">
                                      {cls.students &&
                                      cls.students.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {cls.students.map((student, sIdx) => {
                                            const health =
                                              student.sucKhoe ||
                                              student.healthProfile ||
                                              {};
                                            const highlight = (cond) =>
                                              cond
                                                ? "text-red-600 font-semibold"
                                                : "";
                                            return (
                                              <div
                                                key={
                                                  student.studentCode || sIdx
                                                }
                                                className="p-2 bg-white dark:bg-neutral-800 rounded border border-gray-200 dark:border-gray-700"
                                              >
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                  {(student.soThuTu ||
                                                    sIdx + 1) + ". "}
                                                  {student.hoTen} {""}(
                                                  {student.gioiTinh})
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                  MSHS: {student.maSoHocSinh}
                                                </div>
                                                <div className="text-xs mt-1">
                                                  <span
                                                    className={highlight(
                                                      health.hasAllergies
                                                    )}
                                                  >
                                                    Dị ứng:{" "}
                                                    {health.allergyDetails ||
                                                      "Không"}
                                                  </span>
                                                </div>
                                                <div className="text-xs mt-1">
                                                  <span
                                                    className={highlight(
                                                      health.hasChronicDiseases
                                                    )}
                                                  >
                                                    Bệnh mãn tính:{" "}
                                                    {health.chronicDetails ||
                                                      "Không"}
                                                  </span>
                                                </div>
                                                <div className="text-xs mt-1">
                                                  <span
                                                    className={highlight(
                                                      health.hasPreviousTreatment
                                                    )}
                                                  >
                                                    Đang điều trị:{" "}
                                                    {health.treatmentDetails ||
                                                      "Không"}
                                                  </span>
                                                </div>
                                                <div className="text-xs mt-1">
                                                  Đủ tiêm chủng:{" "}
                                                  {health.hasCompleteVaccinations ===
                                                  "Yes"
                                                    ? "Có"
                                                    : "Không"}
                                                </div>
                                                <div className="text-xs mt-1">
                                                  Huyết áp:{" "}
                                                  {health.bloodPressure || "-"}
                                                </div>
                                                <div className="text-xs mt-1">
                                                  Nhịp tim:{" "}
                                                  {health.heartRate !==
                                                    undefined &&
                                                  health.heartRate !== null
                                                    ? health.heartRate
                                                    : "-"}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <div className="text-xs text-gray-500">
                                          Không có học sinh nào
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-xs text-gray-500">
                              Không có lớp nào
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <FiAlertTriangle className="w-5 h-5 text-red-400 dark:text-red-500" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                Vui lòng kiểm tra lại các thông tin sau:
              </h4>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {Object.entries(validationErrors).map(([key, error]) => (
                  <li key={key}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetLogisticsStep;
