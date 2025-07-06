import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NurseHealthCheckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [healthCheck, setHealthCheck] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const checkData = {
        id: id,
        scheduledDate: "2023-06-22",
        grade: "Lớp 2B",
        status: "completed", // or "upcoming", "pending"
        totalStudents: 30,
        confirmedParents: 27,
        description:
          "Kiểm tra sức khỏe định kỳ cuối học kỳ 2 năm học 2022-2023",
        createdAt: "2023-06-01",
        updatedAt: "2023-06-22",
      };

      const studentsData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `Học sinh ${i + 1}`,
        gender: i % 2 === 0 ? "Nam" : "Nữ",
        parentName: `Phụ huynh ${i + 1}`,
        parentPhone: `098765432${i % 10}`,
        isConfirmed: i < 27,
        height: 120 + Math.floor(Math.random() * 30),
        weight: 20 + Math.floor(Math.random() * 15),
        bmi:
          (20 + Math.floor(Math.random() * 15)) /
          ((120 + Math.floor(Math.random() * 30)) / 100) ** 2,
        vision: i % 5 === 0 ? "Kém" : "Tốt",
        dental: i % 7 === 0 ? "Cần điều trị" : "Bình thường",
        generalHealth: i % 11 === 0 ? "Cần theo dõi" : "Tốt",
        notes: i % 10 === 0 ? "Cần tái khám sau 3 tháng" : "",
        hasAbnormality: i % 5 === 0 || i % 7 === 0 || i % 11 === 0,
      }));

      setHealthCheck(checkData);
      setStudents(studentsData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const filteredStudents = students.filter((student) => {
    // Filter by tab
    if (activeTab === "abnormal" && !student.hasAbnormality) return false;
    if (activeTab === "normal" && student.hasAbnormality) return false;
    if (activeTab === "unconfirmed" && student.isConfirmed) return false;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.parentName.toLowerCase().includes(term) ||
        student.parentPhone.includes(term)
      );
    }

    return true;
  });

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { label: "Thiếu cân", color: "text-yellow-600" };
    if (bmi < 25) return { label: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { label: "Thừa cân", color: "text-orange-600" };
    return { label: "Béo phì", color: "text-red-600" };
  };

  const handleExportToExcel = () => {
    alert("Xuất file Excel sẽ được triển khai sau!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="print:p-6">
      <div className="flex items-center mb-6 print:mb-8">
        <button
          onClick={() => navigate("/nurse/health-check")}
          className="flex items-center text-gray-600 hover:text-blue-600 mr-4 px-2 py-1 rounded transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 print:text-3xl">
              Kết quả kiểm tra y tế {healthCheck.grade}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ngày kiểm tra:{" "}
              {new Date(healthCheck.scheduledDate).toLocaleDateString("vi-VN")}
            </p>
            {healthCheck.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {healthCheck.description}
              </p>
            )}
          </div>
          <div className="flex space-x-2 print:hidden">
            <button
              onClick={() => navigate("/nurse/health-check")}
              className="px-3 py-1.5 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              Quay lại
            </button>

            <button
              onClick={handleExportToExcel}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 overflow-hidden print:shadow-none">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-700 print:hidden">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-md ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                }`}
              >
                Tất cả ({students.length})
              </button>
              <button
                onClick={() => setActiveTab("abnormal")}
                className={`px-3 py-1.5 rounded-md ${
                  activeTab === "abnormal"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                }`}
              >
                Bất thường ({students.filter((s) => s.hasAbnormality).length})
              </button>
              <button
                onClick={() => setActiveTab("normal")}
                className={`px-3 py-1.5 rounded-md ${
                  activeTab === "normal"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                }`}
              >
                Bình thường ({students.filter((s) => !s.hasAbnormality).length})
              </button>
              <button
                onClick={() => setActiveTab("unconfirmed")}
                className={`px-3 py-1.5 rounded-md ${
                  activeTab === "unconfirmed"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
                }`}
              >
                Chưa xác nhận ({students.filter((s) => !s.isConfirmed).length})
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-900">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  STT
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Học sinh
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Chiều cao (cm)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Cân nặng (kg)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  BMI
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Thị lực
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Răng miệng
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Sức khỏe tổng quát
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:hidden"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={
                    student.hasAbnormality
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-neutral-700"
                  }
                >
                  <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 text-center">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {student.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {student.gender}
                    </div>
                    {!student.isConfirmed && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Chưa xác nhận
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 text-center">
                    {student.height}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 text-center">
                    {student.weight}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="text-xs text-gray-900 dark:text-gray-100">
                      {student.bmi.toFixed(1)}
                    </div>
                    <div
                      className={`text-xs ${getBmiStatus(student.bmi).color}`}
                    >
                      {getBmiStatus(student.bmi).label}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        student.vision === "Tốt"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {student.vision}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        student.dental === "Bình thường"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {student.dental}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          student.generalHealth === "Tốt"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {student.generalHealth}
                      </span>
                    </div>
                    {student.notes && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {student.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs font-medium print:hidden text-center">
                    <Link
                      to={`/nurse/student/${student.id}/health-history`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      Xem lịch sử
                    </Link>
                    <Link
                      to={`/nurse/health-check/${id}/student/${student.id}/edit`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      Chỉnh sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 print:hidden">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Thống kê tổng quát
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              BMI
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Thiếu cân
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.bmi < 18.5).length} học sinh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Bình thường
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.bmi >= 18.5 && s.bmi < 25).length}{" "}
                  học sinh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Thừa cân
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.bmi >= 25 && s.bmi < 30).length} học
                  sinh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Béo phì
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.bmi >= 30).length} học sinh
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Thị lực
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Tốt
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.vision === "Tốt").length} học sinh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Kém
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.vision === "Kém").length} học sinh
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg shadow-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Răng miệng
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Bình thường
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.dental === "Bình thường").length}{" "}
                  học sinh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Cần điều trị
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {students.filter((s) => s.dental === "Cần điều trị").length}{" "}
                  học sinh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseHealthCheckDetail;
