import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const MedicationDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [medication, setMedication] = useState(null);

  // Sample medication data - in a real application, this would be fetched from an API
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setMedication({
        id: "MED781234",
        studentName: "Nguyễn Văn An",
        studentId: "ST123456",
        class: "3A",
        medicationName: "Paracetamol",
        requestDate: "2023-10-15T09:30:00",
        startDate: "2023-10-16",
        endDate: "2023-10-20",
        status: "active",
        dosage: "1 viên",
        frequency: "twice",
        timeOfDay: ["morning", "afternoon"],
        specialInstructions: "Uống sau bữa ăn 30 phút. Không uống khi đói.",
        medicationImageUrl:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prescriptionImageUrl:
          "https://images.unsplash.com/photo-1583912267670-5c72c3466b73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        administrationLog: [
          {
            date: "2023-10-16T08:30:00",
            status: "completed",
            administrator: "Nguyễn Thị Tâm",
            notes: "Uống thuốc đầy đủ",
          },
          {
            date: "2023-10-16T14:30:00",
            status: "completed",
            administrator: "Trần Văn Minh",
            notes: "Uống thuốc đầy đủ",
          },
          {
            date: "2023-10-17T08:45:00",
            status: "completed",
            administrator: "Nguyễn Thị Tâm",
            notes: "Uống thuốc đầy đủ",
          },
          {
            date: "2023-10-17T14:30:00",
            status: "missed",
            administrator: null,
            notes: "Học sinh vắng mặt",
          },
          {
            date: "2023-10-18T08:30:00",
            status: "upcoming",
            administrator: null,
            notes: "",
          },
          {
            date: "2023-10-18T14:30:00",
            status: "upcoming",
            administrator: null,
            notes: "",
          },
        ],
        notes: [
          {
            date: "2023-10-15T10:15:00",
            author: "Trần Thị Hoa",
            role: "Y tá trường",
            content: "Đã kiểm tra thuốc, phù hợp với yêu cầu của phụ huynh",
          },
          {
            date: "2023-10-17T09:00:00",
            author: "Nguyễn Thị Tâm",
            role: "Y tá trường",
            content:
              "Học sinh đã quen với việc uống thuốc, không có phản ứng phụ",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy yêu cầu thuốc
          </h2>
          <p className="text-gray-600 mb-6">
            Yêu cầu thuốc với mã #{id} không tồn tại hoặc đã bị xóa
          </p>
          <Link
            to="/parent/medication/history"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const getAdministrationStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Đã uống
          </span>
        );
      case "missed":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Đã bỏ lỡ
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Sắp tới
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Đã hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Chờ xác nhận
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getTimeOfDayText = (timeCode) => {
    switch (timeCode) {
      case "morning":
        return "Buổi sáng";
      case "noon":
        return "Buổi trưa";
      case "afternoon":
        return "Buổi chiều";
      case "as_needed":
        return "Khi cần";
      default:
        return timeCode;
    }
  };

  const completedDoses = medication.administrationLog.filter(
    (log) => log.status === "completed"
  ).length;
  const totalDoses = medication.administrationLog.length;
  const progressPercentage = Math.min(100, (completedDoses / totalDoses) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/parent/medication/history"
              className="text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết yêu cầu thuốc
            </h1>
            {getStatusBadge(medication.status)}
          </div>
          <p className="text-gray-600">
            Mã yêu cầu: #{medication.id} | Ngày tạo:{" "}
            {new Date(medication.requestDate).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            In
          </button>
          <Link
            to={`/parent/medication/edit/${medication.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">
            Thông tin học sinh
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Họ và tên học sinh
                </h3>
                <p className="text-base text-gray-900">
                  {medication.studentName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Mã học sinh
                </h3>
                <p className="text-base text-gray-900">
                  {medication.studentId}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Lớp</h3>
                <p className="text-base text-gray-900">{medication.class}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">Thông tin thuốc</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Tên thuốc
                </h3>
                <p className="text-base text-gray-900">
                  {medication.medicationName}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Liều lượng
                </h3>
                <p className="text-base text-gray-900">{medication.dosage}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Tần suất
                </h3>
                <p className="text-base text-gray-900">
                  {medication.frequency === "once"
                    ? "Một lần mỗi ngày"
                    : medication.frequency === "twice"
                    ? "Hai lần mỗi ngày"
                    : medication.frequency === "thrice"
                    ? "Ba lần mỗi ngày"
                    : "Khi cần thiết"}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Thời điểm uống thuốc
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {medication.timeOfDay.map((time) => (
                    <span
                      key={time}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                    >
                      {getTimeOfDayText(time)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Hướng dẫn đặc biệt
                </h3>
                <p className="text-base text-gray-900">
                  {medication.specialInstructions || "Không có"}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Thời gian sử dụng
                </h3>
                <p className="text-base text-gray-900">
                  {new Date(medication.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(medication.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Tiến độ sử dụng
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {completedDoses}/{totalDoses} liều (
                  {Math.round(progressPercentage)}%)
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Hình ảnh thuốc
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <img
                      src={medication.medicationImageUrl}
                      alt="Medication"
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hình ảnh thuốc</p>
                  </div>
                  {medication.prescriptionImageUrl && (
                    <div>
                      <img
                        src={medication.prescriptionImageUrl}
                        alt="Prescription"
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Đơn thuốc</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">
            Lịch sử sử dụng thuốc
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày & Thời gian
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người thực hiện
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medication.administrationLog.map((log, index) => (
                <tr
                  key={index}
                  className={log.status === "upcoming" ? "bg-gray-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.date).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getAdministrationStatusBadge(log.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.administrator || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {medication.notes && medication.notes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Ghi chú của nhân viên y tế
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {medication.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{note.author}</h3>
                    <p className="text-sm text-gray-500">{note.role}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(note.date).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="text-gray-700">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationDetail;
