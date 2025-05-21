import React from "react";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  // Sample data - in a real application, this would come from an API
  const students = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      medicalInfo: "Dị ứng đậu phộng",
      class: "1A",
    },
    { id: 2, name: "Trần Thị B", medicalInfo: "Hen suyễn", class: "1A" },
    { id: 3, name: "Phạm Văn C", medicalInfo: "Không có", class: "1A" },
    { id: 4, name: "Lê Thị D", medicalInfo: "Dị ứng hải sản", class: "1A" },
  ];

  const recentReports = [
    {
      id: 1,
      studentName: "Nguyễn Văn A",
      issueType: "Đau đầu",
      date: "2023-06-01",
      status: "Đã xử lý",
    },
    {
      id: 2,
      studentName: "Trần Thị B",
      issueType: "Ho",
      date: "2023-06-03",
      status: "Đang theo dõi",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Xin chào, Giáo viên
        </h1>
        <p className="text-gray-600">
          Theo dõi sức khỏe học sinh và báo cáo vấn đề y tế
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-green-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Báo cáo sức khỏe mới
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Gửi báo cáo về vấn đề sức khỏe của học sinh
            </p>
            <Link
              to="/teacher/health-report/new"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Tạo báo cáo mới
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Phiếu xin nghỉ y tế
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Tạo phiếu xin phép đến phòng y tế cho học sinh
            </p>
            <Link
              to="/teacher/medical-pass"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Tạo phiếu mới
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-yellow-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Thông báo y tế
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Xem thông báo về tiêm chủng, khám sức khỏe và các vấn đề y tế khác
            </p>
            <Link
              to="/teacher/notifications"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Xem thông báo
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Danh sách học sinh có vấn đề y tế đặc biệt */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Học sinh cần lưu ý đặc biệt
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full h-16 border-gray-300 border-b py-8">
                  <th className="text-left pl-4">Họ tên</th>
                  <th className="text-left">Lớp</th>
                  <th className="text-left">Thông tin y tế</th>
                  <th className="text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="h-16 border-gray-300 border-b"
                  >
                    <td className="pl-4">{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          student.medicalInfo !== "Không có"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.medicalInfo}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/teacher/student/${student.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Báo cáo gần đây */}
      <div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Báo cáo y tế gần đây
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full h-16 border-gray-300 border-b py-8">
                  <th className="text-left pl-4">Học sinh</th>
                  <th className="text-left">Loại vấn đề</th>
                  <th className="text-left">Ngày báo cáo</th>
                  <th className="text-left">Trạng thái</th>
                  <th className="text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="h-16 border-gray-300 border-b">
                    <td className="pl-4">{report.studentName}</td>
                    <td>{report.issueType}</td>
                    <td>{new Date(report.date).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "Đã xử lý"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/teacher/health-report/${report.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
