import React, { useState } from "react";
import { Link } from "react-router-dom";

const StaffMedicationList = () => {
  // Sample data - in a real application, this would come from an API
  const [medications, setMedications] = useState([
    {
      id: "MED781234",
      studentName: "Nguyễn Văn An",
      studentId: "ST123456",
      class: "3A",
      medicationName: "Paracetamol",
      requestDate: "2023-10-15",
      startDate: "2023-10-16",
      endDate: "2023-10-20",
      status: "active",
      dosage: "1 viên",
      frequency: "twice",
      timeOfDay: ["morning", "afternoon"],
      nextDose: "2023-10-18T14:30:00",
      parentName: "Nguyễn Văn Bình",
      parentPhone: "0912345678",
    },
    {
      id: "MED652198",
      studentName: "Nguyễn Văn An",
      studentId: "ST123456",
      class: "3A",
      medicationName: "Vitamin C",
      requestDate: "2023-10-10",
      startDate: "2023-10-12",
      endDate: "2023-10-25",
      status: "active",
      dosage: "5ml",
      frequency: "once",
      timeOfDay: ["morning"],
      nextDose: "2023-10-18T08:15:00",
      parentName: "Nguyễn Văn Bình",
      parentPhone: "0912345678",
    },
    {
      id: "MED439281",
      studentName: "Nguyễn Thị Minh",
      studentId: "ST654321",
      class: "5B",
      medicationName: "Thuốc chống dị ứng",
      requestDate: "2023-10-14",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      status: "pending",
      dosage: "1 viên",
      frequency: "once",
      timeOfDay: ["morning"],
      nextDose: null,
      parentName: "Nguyễn Thị Hương",
      parentPhone: "0987654321",
    },
    {
      id: "MED198765",
      studentName: "Trần Văn Học",
      studentId: "ST789012",
      class: "4C",
      medicationName: "Siro trị ho",
      requestDate: "2023-10-17",
      startDate: "2023-10-18",
      endDate: "2023-10-25",
      status: "pending",
      dosage: "10ml",
      frequency: "twice",
      timeOfDay: ["morning", "evening"],
      nextDose: null,
      parentName: "Trần Văn Dũng",
      parentPhone: "0923456789",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredMedications = medications.filter((med) => {
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    const matchesSearch =
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.class.toLowerCase().includes(searchTerm.toLowerCase());

    // For date filtering, check if the medication is active on the selected date
    const selectedDateObj = new Date(selectedDate);
    const startDateObj = new Date(med.startDate);
    const endDateObj = new Date(med.endDate);
    const matchesDate =
      selectedDateObj >= startDateObj && selectedDateObj <= endDateObj;

    return (
      matchesStatus &&
      matchesSearch &&
      (filterStatus === "pending" || matchesDate)
    );
  });

  const getTimeOfDayText = (timeCode) => {
    switch (timeCode) {
      case "morning":
        return "Buổi sáng";
      case "noon":
        return "Buổi trưa";
      case "afternoon":
        return "Buổi chiều";
      case "evening":
        return "Buổi tối";
      case "as_needed":
        return "Khi cần";
      default:
        return timeCode;
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

  // Group medications by class for easier management
  const medicationsByClass = filteredMedications.reduce((acc, medication) => {
    if (!acc[medication.class]) {
      acc[medication.class] = [];
    }
    acc[medication.class].push(medication);
    return acc;
  }, {});

  const sortedClasses = Object.keys(medicationsByClass).sort();

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate which medications need to be administered today
  const today = new Date().toISOString().split("T")[0];
  const pendingMedicationsCount = medications.filter(
    (med) => med.status === "pending"
  ).length;
  const todayMedicationsCount = medications.filter(
    (med) =>
      med.status === "active" && med.startDate <= today && med.endDate >= today
  ).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý thuốc học sinh
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi việc cấp phát thuốc cho học sinh
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/staff/medication/log"
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md shadow-sm border border-blue-200 hover:bg-blue-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Nhật ký cấp thuốc
          </Link>
          <Link
            to="/staff/medication/inventory"
            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md shadow-sm border border-green-200 hover:bg-green-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Quản lý kho thuốc
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Thuốc hôm nay</p>
              <p className="text-2xl font-bold text-gray-800">
                {todayMedicationsCount} yêu cầu
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Yêu cầu chờ xác nhận
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {pendingMedicationsCount} yêu cầu
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
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
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đã cấp phát hôm nay
              </p>
              <p className="text-2xl font-bold text-gray-800">0 liều</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">
            Lịch cấp phát thuốc
          </h2>
        </div>

        <div className="p-4 bg-white flex flex-col md:flex-row gap-4 border-b">
          <div className="md:w-64">
            <label
              htmlFor="date-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày cấp phát
            </label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-64">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trạng thái
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang thực hiện</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div className="flex-grow">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tìm kiếm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm theo tên học sinh, lớp, tên thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredMedications.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Không có yêu cầu nào phù hợp
            </h3>
            <p className="text-gray-500 mb-6">
              Không tìm thấy yêu cầu thuốc nào cho ngày và bộ lọc đã chọn
            </p>
          </div>
        ) : (
          <div>
            {sortedClasses.map((className) => (
              <div key={className} className="border-b last:border-b-0">
                <div className="px-6 py-3 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">
                    Lớp {className}
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
                          Mã yêu cầu
                        </th>
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
                          Thuốc & Liều lượng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thời gian dùng
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
                          Tùy chọn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicationsByClass[className].map((medication) => (
                        <tr
                          key={medication.id}
                          className="hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            #{medication.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {medication.studentName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {medication.studentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {medication.medicationName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {medication.dosage} (
                              {medication.timeOfDay
                                .map((time) => getTimeOfDayText(time))
                                .join(", ")}
                              )
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medication.status === "pending" ? (
                              <span className="italic">Chờ xác nhận</span>
                            ) : (
                              <div>
                                <div className="font-medium text-gray-900">
                                  {medication.nextDose
                                    ? formatTime(medication.nextDose)
                                    : "-"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    medication.startDate
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  -{" "}
                                  {new Date(
                                    medication.endDate
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(medication.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {medication.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="text-green-600 hover:text-green-800"
                                  onClick={() => {
                                    // Handle approval logic
                                    console.log("Approve", medication.id);
                                  }}
                                >
                                  Xác nhận
                                </button>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => {
                                    // Handle rejection logic
                                    console.log("Reject", medication.id);
                                  }}
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : medication.status === "active" ? (
                              <Link
                                to={`/staff/medication/administer/${medication.id}`}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                </svg>
                                Cấp thuốc
                              </Link>
                            ) : (
                              <Link
                                to={`/staff/medication/detail/${medication.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Chi tiết
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffMedicationList;
