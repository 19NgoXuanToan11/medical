import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const HealthCheckResults = () => {
  const { checkId } = useParams();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [results, setResults] = useState([]);
  const [sending, setSending] = useState(false);
  const [appointmentScheduling, setAppointmentScheduling] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // Mock data - would be replaced by API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHealthCheck({
        id: checkId,
        scheduledDate: "2023-05-30",
        grade: "Lớp 3C",
        status: "completed",
        totalStudents: 5,
        confirmedParents: 5,
        abnormalResults: 2,
      });

      setResults([
        {
          studentId: 201,
          name: "Trần Văn Long",
          age: 9,
          gender: "Nam",
          height: 135,
          weight: 32,
          vision: "10/10",
          notes: "Sức khỏe tổng quát tốt",
          isAbnormal: false,
        },
        {
          studentId: 202,
          name: "Nguyễn Thị Mai",
          age: 9,
          gender: "Nữ",
          height: 132,
          weight: 30,
          vision: "8/10",
          notes: "Thị lực giảm nhẹ, cần theo dõi",
          isAbnormal: true,
          appointmentScheduled: false,
        },
        {
          studentId: 203,
          name: "Lê Hoàng Nam",
          age: 9,
          gender: "Nam",
          height: 138,
          weight: 40,
          vision: "10/10",
          notes: "Thừa cân nhẹ so với lứa tuổi",
          isAbnormal: true,
          appointmentScheduled: true,
          appointmentDate: "2023-06-15T09:00:00",
          appointmentNotes: "Tư vấn về chế độ dinh dưỡng",
        },
        {
          studentId: 204,
          name: "Phạm Hà My",
          age: 8,
          gender: "Nữ",
          height: 130,
          weight: 28,
          vision: "10/10",
          notes: "Sức khỏe tổng quát tốt",
          isAbnormal: false,
        },
        {
          studentId: 205,
          name: "Hoàng Minh Khôi",
          age: 9,
          gender: "Nam",
          height: 134,
          weight: 31,
          vision: "10/10",
          notes: "Sức khỏe tổng quát tốt",
          isAbnormal: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [checkId]);

  const openAppointmentModal = (student) => {
    setSelectedStudent(student);
    setAppointmentDate(student.appointmentDate || "");
    setAppointmentNotes(student.appointmentNotes || "");
    setAppointmentScheduling(true);
  };

  const scheduleAppointment = () => {
    // In a real app, this would send data to the backend
    console.log("Scheduling appointment for:", selectedStudent);
    console.log("Date:", appointmentDate);
    console.log("Notes:", appointmentNotes);

    // Update local state
    setResults(
      results.map((student) =>
        student.studentId === selectedStudent.studentId
          ? {
              ...student,
              appointmentScheduled: true,
              appointmentDate,
              appointmentNotes,
            }
          : student
      )
    );

    setAppointmentScheduling(false);
    setSelectedStudent(null);
  };

  const sendResultsToParents = () => {
    setSending(true);
    // In a real app, this would send data to the backend
    console.log("Sending results to parents for health check:", checkId);

    // Simulate API call
    setTimeout(() => {
      setSending(false);
      // Show success notification or update UI accordingly
      alert("Kết quả đã được gửi thành công cho tất cả phụ huynh!");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kết quả kiểm tra y tế
          </h1>
          <p className="text-gray-600 mt-1">
            {`${healthCheck.grade} - Ngày ${new Date(
              healthCheck.scheduledDate
            ).toLocaleDateString("vi-VN")}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={sendResultsToParents}
            disabled={sending}
            className={`${
              sending
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center`}
          >
            {sending ? (
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
                Đang gửi...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Gửi kết quả cho phụ huynh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tổng số học sinh
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {healthCheck.totalStudents}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Kết quả bình thường
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {results.filter((r) => !r.isAbnormal).length}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Cần theo dõi
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {healthCheck.abnormalResults}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Lịch hẹn đã xếp
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {results.filter((r) => r.appointmentScheduled).length}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Kết quả chi tiết
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Học sinh
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chiều cao / Cân nặng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thị lực
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ghi chú
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((student) => (
                <tr key={student.studentId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.age} tuổi • {student.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {`${student.height} cm / ${student.weight} kg`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.vision}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {student.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.isAbnormal ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Cần theo dõi
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Bình thường
                      </span>
                    )}
                    {student.appointmentScheduled && (
                      <div className="mt-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Có lịch hẹn
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {student.isAbnormal && !student.appointmentScheduled ? (
                      <button
                        onClick={() => openAppointmentModal(student)}
                        className="text-blue-600 hover:text-blue-900 ml-4"
                      >
                        Lịch hẹn
                      </button>
                    ) : student.appointmentScheduled ? (
                      <div className="text-sm text-gray-500">
                        {new Date(student.appointmentDate).toLocaleString(
                          "vi-VN",
                          {
                            dateStyle: "short",
                            timeStyle: "short",
                          }
                        )}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule appointment modal */}
      {appointmentScheduling && selectedStudent && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 overflow-hidden shadow-xl transform transition-all">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => {
                  setAppointmentScheduling(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lịch hẹn tư vấn sức khỏe
            </h3>
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-700">
                Xếp lịch hẹn tư vấn riêng cho học sinh{" "}
                <span className="font-semibold">{selectedStudent.name}</span>
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="appointment-date"
              >
                Ngày và giờ hẹn
              </label>
              <input
                type="datetime-local"
                id="appointment-date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="appointment-notes"
              >
                Ghi chú
              </label>
              <textarea
                id="appointment-notes"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Nhập nội dung cuộc hẹn"
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setAppointmentScheduling(false);
                  setSelectedStudent(null);
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={scheduleAppointment}
                disabled={!appointmentDate}
              >
                Xác nhận lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckResults;
