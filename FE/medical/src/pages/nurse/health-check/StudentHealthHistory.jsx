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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Lịch sử sức khỏe - {student.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {student.grade} - Ngày sinh:{" "}
              {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Quay lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-medium text-gray-700 mb-2">Thông tin cá nhân</h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Họ và tên:</span>
              <span>{student.name}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Ngày sinh:</span>
              <span>
                {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Giới tính:</span>
              <span>{student.gender}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Lớp:</span>
              <span>{student.grade}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Nhóm máu:</span>
              <span>{student.bloodType}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-medium text-gray-700 mb-2">Thông tin liên hệ</h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Phụ huynh:</span>
              <span>{student.parentName}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">
                Điện thoại:
              </span>
              <span>{student.parentPhone}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Địa chỉ:</span>
              <span>{student.address}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-medium text-gray-700 mb-2">Thông tin y tế</h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">Dị ứng:</span>
              <span>{student.allergies}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-32 text-gray-500">
                Bệnh mãn tính:
              </span>
              <span>{student.chronicConditions}</span>
            </div>
            <div className="flex items-center mt-4">
              <button className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Cập nhật thông tin y tế
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="font-medium text-gray-700 mb-4 text-center">
          Biểu đồ tăng trưởng
        </h2>
        <div className="h-64 w-full mb-2 px-2">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="font-medium text-gray-700 p-4 border-b text-center">
          Lịch sử kiểm tra sức khỏe
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chiều cao (cm)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cân nặng (kg)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  BMI
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thị lực
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Răng miệng
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sức khỏe tổng quát
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bác sĩ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recordsWithBMI.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {new Date(record.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {record.height}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {record.weight}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{record.bmi}</div>
                    <div
                      className={`text-xs ${getBmiStatus(record.bmi).color}`}
                    >
                      {getBmiStatus(record.bmi).label}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        record.vision === "Tốt"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.vision}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        record.dental === "Bình thường"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.dental}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          record.generalHealth === "Tốt"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.generalHealth}
                      </span>
                    </div>
                    {record.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        {record.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {record.doctor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthHistory;
