import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiActivity,
  FiClock,
  FiFileText,
  FiBookOpen,
  FiAward,
  FiAlertCircle,
  FiBell,
} from "react-icons/fi";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudentInfo({
        name: "Nguyễn Văn An",
        class: "Lớp 3A",
        age: 9,
        healthStatus: "Tốt",
        allergies: ["Không"],
        chronicConditions: ["Không"],
        height: "135 cm",
        weight: "32 kg",
        bmi: 17.6,
        lastCheckup: "15/05/2023",
        upcomingMedications: [
          {
            id: 1,
            name: "Vitamin D",
            time: "Sau bữa sáng",
            dosage: "1 viên",
            remainingDays: 7,
          },
        ],
        upcomingEvents: [
          {
            id: 1,
            title: "Khám sức khỏe định kỳ",
            date: "15/06/2023",
            type: "health-check",
          },
          {
            id: 2,
            title: "Tiêm chủng vắc-xin",
            date: "22/07/2023",
            type: "vaccination",
          },
        ],
        recentHealthEvents: [
          {
            id: 1,
            date: "02/06/2023",
            title: "Đau đầu nhẹ",
            description: "Được cấp thuốc giảm đau",
            severity: "minor",
          },
        ],
        healthTips: [
          {
            id: 1,
            title: "Uống đủ nước mỗi ngày",
            description:
              "Uống ít nhất 1.5 lít nước mỗi ngày để giữ cơ thể khỏe mạnh",
          },
          {
            id: 2,
            title: "Tập thể dục đều đặn",
            description: "30 phút vận động mỗi ngày giúp tăng cường sức khỏe",
          },
          {
            id: 3,
            title: "Ăn nhiều rau củ quả",
            description: "Bổ sung vitamin và khoáng chất từ rau củ quả tươi",
          },
        ],
        completedHealthActivities: 8,
        totalHealthActivities: 10,
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Get health status color
  const getHealthStatusColor = (status) => {
    switch (status) {
      case "Tốt":
        return "text-green-600 bg-green-100";
      case "Cần chú ý":
        return "text-yellow-600 bg-yellow-100";
      case "Cần theo dõi":
        return "text-orange-600 bg-orange-100";
      case "Cần điều trị":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          <p className="ml-2 text-neutral-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Student Welcome Card */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
                Xin chào, {studentInfo.name}
              </h1>
              <p className="text-neutral-600">
                {studentInfo.class} - Thông tin sức khỏe cá nhân
              </p>

              {/* Health Status Overview */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">
                        Tình trạng sức khỏe
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${getHealthStatusColor(
                            studentInfo.healthStatus
                          )}`}
                        >
                          {studentInfo.healthStatus}
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiActivity className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Chiều cao</p>
                      <p className="text-lg font-semibold text-neutral-800 mt-1">
                        {studentInfo.height}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <FiAward className="h-5 w-5 text-neutral-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Cân nặng</p>
                      <p className="text-lg font-semibold text-neutral-800 mt-1">
                        {studentInfo.weight}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <FiAward className="h-5 w-5 text-neutral-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Chỉ số BMI</p>
                      <p className="text-lg font-semibold text-neutral-800 mt-1">
                        {studentInfo.bmi}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <FiAward className="h-5 w-5 text-neutral-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Progress */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Tiến độ sức khỏe
                </h3>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (studentInfo.completedHealthActivities /
                          studentInfo.totalHealthActivities) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-neutral-600">
                    Hoàn thành {studentInfo.completedHealthActivities}/
                    {studentInfo.totalHealthActivities} hoạt động
                  </span>
                  <span className="text-sm font-medium text-primary-700">
                    {Math.round(
                      (studentInfo.completedHealthActivities /
                        studentInfo.totalHealthActivities) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upcoming Medications */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">
                  Lịch uống thuốc
                </h3>
                <Link
                  to="/student/medication"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="p-4">
                {studentInfo.upcomingMedications.length > 0 ? (
                  <div className="space-y-4">
                    {studentInfo.upcomingMedications.map((med) => (
                      <div
                        key={med.id}
                        className="flex p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FiClock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-neutral-800">
                            {med.name}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {med.dosage} - {med.time}
                          </div>
                          <div className="text-xs font-medium text-primary-600 mt-1">
                            Còn {med.remainingDays} ngày
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-500">
                    Không có thuốc cần uống
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Health Events */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">
                  Sự kiện sắp tới
                </h3>
                <Link
                  to="/student/health-events"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="p-4">
                {studentInfo.upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {studentInfo.upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex p-3 bg-neutral-50 rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-full ${
                            event.type === "health-check"
                              ? "bg-green-100"
                              : "bg-purple-100"
                          }`}
                        >
                          <FiCalendar
                            className={`h-5 w-5 ${
                              event.type === "health-check"
                                ? "text-green-600"
                                : "text-purple-600"
                            }`}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-neutral-800">
                            {event.title}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            Ngày: {event.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-500">
                    Không có sự kiện sắp tới
                  </div>
                )}
              </div>
            </div>

            {/* Health Tips */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-800">
                  Lời khuyên sức khỏe
                </h3>
                <Link
                  to="/student/resources"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Xem thêm
                </Link>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {studentInfo.healthTips.map((tip) => (
                    <div key={tip.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <FiBookOpen className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="ml-3 font-medium text-sm text-neutral-800">
                          {tip.title}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-neutral-600 pl-11">
                        {tip.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Health Events */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="text-lg font-medium text-neutral-800">
                Lịch sử sức khỏe gần đây
              </h3>
            </div>
            <div className="p-4">
              {studentInfo.recentHealthEvents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200 table-fixed max-w-4xl mx-auto">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th
                          scope="col"
                          className="w-1/6 px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          style={{ minWidth: "120px" }}
                        >
                          Ngày
                        </th>
                        <th
                          scope="col"
                          className="w-1/4 px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          style={{ minWidth: "200px" }}
                        >
                          Sự kiện
                        </th>
                        <th
                          scope="col"
                          className="w-5/12 px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          style={{ minWidth: "300px" }}
                        >
                          Mô tả
                        </th>
                        <th
                          scope="col"
                          className="w-1/6 px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          style={{ minWidth: "120px" }}
                        >
                          Mức độ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {studentInfo.recentHealthEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 text-left">
                            {event.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 text-left">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 truncate text-left">
                            {event.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                event.severity === "minor"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : event.severity === "moderate"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {event.severity === "minor"
                                ? "Nhẹ"
                                : event.severity === "moderate"
                                ? "Trung bình"
                                : "Nghiêm trọng"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-neutral-500">
                  Không có sự kiện y tế gần đây
                </div>
              )}
            </div>
          </div>

          {/* Health Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="text-lg font-medium text-neutral-800">
                Tài liệu sức khỏe học đường
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/student/resources/nutrition"
                  className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                >
                  <h4 className="font-medium text-green-800">Dinh dưỡng</h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    Thông tin về chế độ ăn uống lành mạnh
                  </p>
                </Link>
                <Link
                  to="/student/resources/physical"
                  className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <h4 className="font-medium text-blue-800">Thể chất</h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    Hướng dẫn về vận động và tập luyện
                  </p>
                </Link>
                <Link
                  to="/student/resources/mental"
                  className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <h4 className="font-medium text-purple-800">
                    Sức khỏe tinh thần
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    Kỹ năng quản lý cảm xúc và stress
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
