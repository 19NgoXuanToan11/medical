import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiFilter,
  FiSearch,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";

const HealthCheckResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call to fetch health check data
    setTimeout(() => {
      const checkData = {
        id: id,
        title: "Kiểm tra sức khỏe định kỳ học kỳ 2",
        grade: "Lớp 5B",
        scheduledDate: "2023-05-15",
        status: "completed",
        description: "Kiểm tra sức khỏe định kỳ cho học sinh cuối học kỳ 2",
        totalStudents: 30,
        confirmedParents: 30,
        abnormalResults: 5,
        completedBy: "Nguyễn Thị Hương - Y tá trường",
        completedDate: "2023-05-15",
      };

      const studentsData = Array.from({ length: 30 }, (_, i) => {
        const hasAbnormality = i < 5; // First 5 students have abnormalities
        return {
          id: `ST${1000 + i}`,
          name: `Học sinh ${i + 1}`,
          gender: i % 2 === 0 ? "Nam" : "Nữ",
          parentName: `Phụ huynh ${i + 1}`,
          parentPhone: `098${100000 + i}`,
          isConfirmed: true,
          hasAbnormality,
          height: 130 + Math.floor(Math.random() * 30),
          weight: 30 + Math.floor(Math.random() * 20),
          bmi: (18 + Math.random() * 6).toFixed(1),
          vision: {
            left: hasAbnormality && i === 0 ? "6/9" : "6/6",
            right: hasAbnormality && i === 0 ? "6/12" : "6/6",
            status:
              hasAbnormality && i === 0 ? "Cần kiểm tra thêm" : "Bình thường",
          },
          bloodPressure: {
            systolic: 90 + Math.floor(Math.random() * 30),
            diastolic: 60 + Math.floor(Math.random() * 20),
            status: hasAbnormality && i === 1 ? "Cao" : "Bình thường",
          },
          notes: hasAbnormality
            ? [
                "Cần theo dõi thêm",
                i === 2 ? "Dấu hiệu dị ứng thức ăn" : "",
                i === 3 ? "Có dấu hiệu thiếu máu nhẹ" : "",
                i === 4 ? "Thừa cân" : "",
              ].filter(Boolean)
            : [],
          recommendations: hasAbnormality
            ? [
                "Khuyến nghị khám bác sĩ chuyên khoa",
                i === 0 ? "Cần kiểm tra thị lực chuyên sâu" : "",
                i === 1 ? "Theo dõi huyết áp định kỳ" : "",
                i === 2 ? "Hạn chế tiếp xúc với thực phẩm gây dị ứng" : "",
                i === 3 ? "Bổ sung thực phẩm giàu sắt" : "",
                i === 4 ? "Điều chỉnh chế độ ăn và tăng cường vận động" : "",
              ].filter(Boolean)
            : [],
        };
      });

      setHealthCheck(checkData);
      setStudents(studentsData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const filteredStudents = students.filter((student) => {
    // Filter by tab
    if (activeTab === "abnormal" && !student.hasAbnormality) return false;
    if (activeTab === "normal" && student.hasAbnormality) return false;

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

  const handlePrintResults = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    alert("Xuất file Excel sẽ được triển khai sau!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="print:p-6">
      <div className="flex justify-between items-start mb-6 print:mb-8">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/nurse/health-check/${id}`)}
              className="mr-2 text-gray-600 hover:text-gray-900 print:hidden"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 print:text-3xl">
              Kết quả kiểm tra y tế {healthCheck.grade}
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            Ngày kiểm tra:{" "}
            {new Date(healthCheck.scheduledDate).toLocaleDateString("vi-VN")}
          </p>
          {healthCheck.description && (
            <p className="text-gray-600 mt-1">{healthCheck.description}</p>
          )}
        </div>
        <div className="flex space-x-2 print:hidden">
          <button
            onClick={handlePrintResults}
            className="px-3 py-1.5 border border-primary-600 rounded-md text-primary-600 bg-white hover:bg-primary-50 flex items-center"
          >
            <FiPrinter className="mr-1" /> In kết quả
          </button>
          <button
            onClick={handleExportToExcel}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FiDownload className="mr-1" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <FiCheck className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số học sinh</p>
              <p className="text-xl font-bold text-gray-800">
                {healthCheck.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <FiCheck className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kết quả bình thường</p>
              <p className="text-xl font-bold text-gray-800">
                {healthCheck.totalStudents - healthCheck.abnormalResults}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-3">
              <FiAlertCircle className="text-red-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kết quả bất thường</p>
              <p className="text-xl font-bold text-gray-800">
                {healthCheck.abnormalResults}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-3">
              <FiClock className="text-purple-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hoàn thành bởi</p>
              <p className="text-sm font-medium text-gray-800">
                {healthCheck.completedBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 print:hidden">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-auto flex mb-4 sm:mb-0">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-l-md ${
                activeTab === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                activeTab === "normal"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border-t border-b border-gray-300"
              }`}
              onClick={() => setActiveTab("normal")}
            >
              Bình thường
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-r-md ${
                activeTab === "abnormal"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
              onClick={() => setActiveTab("abnormal")}
            >
              Bất thường
            </button>
          </div>

          <div className="w-full sm:w-auto relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Tìm kiếm học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                >
                  Học sinh
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                >
                  Chiều cao (cm)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                >
                  Cân nặng (kg)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                >
                  BMI
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                >
                  Thị lực
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                >
                  Huyết áp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"
                >
                  Tình trạng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12 print:hidden"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const bmiStatus = getBmiStatus(student.bmi);
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.gender}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {student.height}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {student.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{student.bmi}</div>
                      <div className={"text-xs " + bmiStatus.color}>
                        {bmiStatus.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        T: {student.vision.left} | P: {student.vision.right}
                      </div>
                      <div
                        className={
                          "text-xs " +
                          (student.vision.status === "Bình thường"
                            ? "text-green-600"
                            : "text-yellow-600")
                        }
                      >
                        {student.vision.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {student.bloodPressure.systolic}/
                        {student.bloodPressure.diastolic} mmHg
                      </div>
                      <div
                        className={
                          "text-xs " +
                          (student.bloodPressure.status === "Bình thường"
                            ? "text-green-600"
                            : "text-red-600")
                        }
                      >
                        {student.bloodPressure.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {student.hasAbnormality ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Bất thường
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Bình thường
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium print:hidden">
                      <Link
                        to={
                          "/nurse/health-check/" + id + "/student/" + student.id
                        }
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy kết quả nào phù hợp
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckResults;
