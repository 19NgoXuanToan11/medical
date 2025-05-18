import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const HealthCheckExecution = () => {
  const { checkId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(0);
  const [results, setResults] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Mock data - would be replaced by API calls
  useEffect(() => {
    // Simulate API call to get health check details and student list
    setTimeout(() => {
      setHealthCheck({
        id: checkId,
        scheduledDate: "2023-06-22",
        grade: "Lớp 2B",
        status: "in_progress",
        totalStudents: 5,
        confirmedParents: 5,
      });

      setStudentList([
        {
          id: 101,
          name: "Nguyễn Văn An",
          age: 8,
          gender: "Nam",
          hasConfirmation: true,
        },
        {
          id: 102,
          name: "Trần Thị Bình",
          age: 7,
          gender: "Nữ",
          hasConfirmation: true,
        },
        {
          id: 103,
          name: "Lê Minh Cường",
          age: 8,
          gender: "Nam",
          hasConfirmation: true,
        },
        {
          id: 104,
          name: "Phạm Thu Dung",
          age: 7,
          gender: "Nữ",
          hasConfirmation: true,
        },
        {
          id: 105,
          name: "Hoàng Đức Em",
          age: 8,
          gender: "Nam",
          hasConfirmation: true,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [checkId]);

  const saveStudentResults = (studentId) => {
    // In a real app, this would send data to backend
    console.log(`Saved results for student ${studentId}:`, results[studentId]);

    // Move to next student if possible
    if (currentStudent < studentList.length - 1) {
      setCurrentStudent(currentStudent + 1);
    }
  };

  const handleResultChange = (field, value) => {
    const studentId = studentList[currentStudent].id;
    setResults({
      ...results,
      [studentId]: {
        ...results[studentId],
        [field]: value,
        studentId,
      },
    });
  };

  const handleSubmitAll = () => {
    setSubmitting(true);
    // In a real app, this would send all results to backend
    console.log("All results submitted:", results);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      // Redirect to results page
      navigate(`/staff/health-check/${checkId}/results`, { replace: true });
    }, 1500);
  };

  const isCurrentStudentComplete = () => {
    if (!studentList[currentStudent]) return false;

    const studentId = studentList[currentStudent].id;
    const studentResult = results[studentId];

    return (
      studentResult &&
      studentResult.height &&
      studentResult.weight &&
      studentResult.vision &&
      studentResult.notes !== undefined
    );
  };

  const isAllComplete = () => {
    return studentList.every(
      (student) =>
        results[student.id] &&
        results[student.id].height &&
        results[student.id].weight &&
        results[student.id].vision &&
        results[student.id].notes !== undefined
    );
  };

  const markAbnormal = (studentId, isAbnormal) => {
    setResults({
      ...results,
      [studentId]: {
        ...results[studentId],
        isAbnormal,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentStudentData = studentList[currentStudent];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thực hiện kiểm tra y tế
          </h1>
          <p className="text-gray-600 mt-1">
            {`${healthCheck.grade} - Ngày ${new Date(
              healthCheck.scheduledDate
            ).toLocaleDateString("vi-VN")}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">
            Học sinh: {currentStudent + 1}/{studentList.length}
          </span>
          <div className="w-64 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{
                width: `${((currentStudent + 1) / studentList.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentStudentData.name}
                </h2>
                <p className="text-gray-600">
                  {currentStudentData.age} tuổi • {currentStudentData.gender}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentStudentData.hasConfirmation ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Phụ huynh đã xác nhận
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                  Chưa có xác nhận
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="height"
                >
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={results[currentStudentData.id]?.height || ""}
                  onChange={(e) => handleResultChange("height", e.target.value)}
                  placeholder="Nhập chiều cao"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="weight"
                >
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={results[currentStudentData.id]?.weight || ""}
                  onChange={(e) => handleResultChange("weight", e.target.value)}
                  placeholder="Nhập cân nặng"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="vision"
                >
                  Thị lực
                </label>
                <input
                  type="text"
                  id="vision"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={results[currentStudentData.id]?.vision || ""}
                  onChange={(e) => handleResultChange("vision", e.target.value)}
                  placeholder="VD: 10/10 hoặc 7/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="notes"
                >
                  Ghi chú kiểm tra
                </label>
                <textarea
                  id="notes"
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={results[currentStudentData.id]?.notes || ""}
                  onChange={(e) => handleResultChange("notes", e.target.value)}
                  placeholder="Nhập ghi chú về tình trạng sức khỏe"
                ></textarea>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="abnormal"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={results[currentStudentData.id]?.isAbnormal || false}
                  onChange={(e) =>
                    markAbnormal(currentStudentData.id, e.target.checked)
                  }
                />
                <label
                  htmlFor="abnormal"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Đánh dấu có dấu hiệu bất thường (cần lịch hẹn riêng)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div>
              <button
                onClick={() => setCurrentStudent(currentStudent - 1)}
                disabled={currentStudent === 0}
                className={`px-4 py-2 rounded-md ${
                  currentStudent === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                } transition-colors duration-200 mr-2`}
              >
                Học sinh trước
              </button>
              <button
                onClick={() => saveStudentResults(currentStudentData.id)}
                disabled={!isCurrentStudentComplete()}
                className={`px-4 py-2 rounded-md ${
                  !isCurrentStudentComplete()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                Lưu kết quả
              </button>
            </div>
            <div>
              {currentStudent < studentList.length - 1 ? (
                <button
                  onClick={() => {
                    if (results[currentStudentData.id]) {
                      setCurrentStudent(currentStudent + 1);
                    } else if (
                      window.confirm(
                        "Bạn chưa lưu kết quả cho học sinh này. Tiếp tục?"
                      )
                    ) {
                      setCurrentStudent(currentStudent + 1);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                >
                  Học sinh tiếp theo
                </button>
              ) : (
                <button
                  onClick={handleSubmitAll}
                  disabled={!isAllComplete() || submitting}
                  className={`px-4 py-2 rounded-md ${
                    !isAllComplete() || submitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } transition-colors duration-200 flex items-center`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "Hoàn thành tất cả"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckExecution;
