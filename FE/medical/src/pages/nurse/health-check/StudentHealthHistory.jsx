import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentHealthHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const studentData = {
        id: id,
        name: `Nguyễn Văn A`,
        dateOfBirth: "2016-05-10",
        gender: "Nam",
        grade: "Lớp 2B",
        parentName: "Nguyễn Văn B",
        parentPhone: "0987654321",
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
        bloodType: "O+",
        allergies: "Không",
        chronicConditions: "Không",
      };

      // Generate mock health records for the past 2 years
      const now = new Date();
      const records = [];

      for (let i = 0; i < 6; i++) {
        const recordDate = new Date();
        recordDate.setMonth(now.getMonth() - i * 4); // Every 4 months

        const age = Math.floor(
          (recordDate - new Date(studentData.dateOfBirth)) /
            (365.25 * 24 * 60 * 60 * 1000)
        );

        records.push({
          id: i + 1,
          date: recordDate.toISOString().split("T")[0],
          height: 110 + age * 5 + Math.floor(Math.random() * 3),
          weight: 18 + age * 2 + Math.floor(Math.random() * 2),
          vision: i % 5 === 0 ? "Kém" : "Tốt",
          dental: i % 4 === 0 ? "Cần điều trị" : "Bình thường",
          generalHealth: i % 6 === 0 ? "Cần theo dõi" : "Tốt",
          notes: i % 3 === 0 ? "Cần tăng cường vận động" : "",
          doctor: "Bs. Trần Thị C",
        });
      }

      // Sort by date, most recent first
      records.sort((a, b) => new Date(b.date) - new Date(a.date));

      setStudent(studentData);
      setHealthRecords(records);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Calculate BMI for each record
  const recordsWithBMI = healthRecords.map((record) => {
    const heightInMeters = record.height / 100;
    const bmi = record.weight / (heightInMeters * heightInMeters);
    return {
      ...record,
      bmi: parseFloat(bmi.toFixed(1)),
    };
  });

  // Prepare chart data
  const chartData = {
    labels: [...recordsWithBMI].reverse().map((record) =>
      new Date(record.date).toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Chiều cao (cm)",
        data: [...recordsWithBMI].reverse().map((record) => record.height),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Cân nặng (kg)",
        data: [...recordsWithBMI].reverse().map((record) => record.weight),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "BMI",
        data: [...recordsWithBMI].reverse().map((record) => record.bmi),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: "y2",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Chiều cao (cm)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Cân nặng (kg)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "BMI",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { label: "Thiếu cân", color: "text-yellow-600" };
    if (bmi < 25) return { label: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { label: "Thừa cân", color: "text-orange-600" };
    return { label: "Béo phì", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Lịch sử sức khỏe - {student.name}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {student.grade} - Ngày sinh:{" "}
              {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Thông tin cá nhân
          </h3>
          <div className="space-y-2">
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Họ và tên:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.name}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Ngày sinh:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Giới tính:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.gender}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Lớp:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.grade}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Nhóm máu:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.bloodType}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Thông tin liên hệ
          </h3>
          <div className="space-y-2">
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Phụ huynh:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.parentName}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Điện thoại:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.parentPhone}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Địa chỉ:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.address}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Thông tin y tế
          </h3>
          <div className="space-y-2">
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Dị ứng:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.allergies}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                Bệnh mãn tính:
              </span>{" "}
              <span className="text-neutral-900 dark:text-neutral-100">
                {student.chronicConditions}
              </span>
            </p>
            <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Cập nhật thông tin y tế
            </button>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Biểu đồ tăng trưởng
        </h3>
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Health Records Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Lịch sử khám sức khỏe
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Ngày khám
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Chiều cao (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Cân nặng (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  BMI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Thị lực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Răng miệng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Tổng quan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Bác sĩ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {recordsWithBMI.map((record) => {
                const bmiStatus = getBmiStatus(record.bmi);
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {new Date(record.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {record.height}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {record.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {record.bmi}
                      </div>
                      <div className={`text-xs ${bmiStatus.color}`}>
                        {bmiStatus.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.vision === "Tốt"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {record.vision}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.dental === "Bình thường"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {record.dental}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.generalHealth === "Tốt"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {record.generalHealth}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {record.doctor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthHistory;
