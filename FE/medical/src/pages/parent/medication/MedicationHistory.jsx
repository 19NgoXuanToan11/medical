import React, { useState } from "react";
import { Link } from "react-router-dom";

const MedicationHistory = () => {
  // Sample data - in a real application, this would come from an API
  const [medications, setMedications] = useState([
    {
      id: "MED781234",
      studentName: "Nguyễn Văn An",
      class: "3A",
      medicationName: "Paracetamol",
      requestDate: "2023-10-15",
      startDate: "2023-10-16",
      endDate: "2023-10-20",
      status: "active",
      dosage: "1 viên",
      frequency: "twice",
      lastAdministered: "2023-10-16 12:30",
      completedDoses: 2,
      totalDoses: 10,
    },
    {
      id: "MED652198",
      studentName: "Nguyễn Văn An",
      class: "3A",
      medicationName: "Vitamin C",
      requestDate: "2023-10-10",
      startDate: "2023-10-12",
      endDate: "2023-10-25",
      status: "active",
      dosage: "5ml",
      frequency: "once",
      lastAdministered: "2023-10-16 08:15",
      completedDoses: 5,
      totalDoses: 14,
    },
    {
      id: "MED541872",
      studentName: "Nguyễn Văn An",
      class: "3A",
      medicationName: "Siro ho",
      requestDate: "2023-09-28",
      startDate: "2023-09-29",
      endDate: "2023-10-05",
      status: "completed",
      dosage: "10ml",
      frequency: "twice",
      lastAdministered: "2023-10-05 12:30",
      completedDoses: 14,
      totalDoses: 14,
    },
    {
      id: "MED439281",
      studentName: "Nguyễn Thị Minh",
      class: "5B",
      medicationName: "Thuốc chống dị ứng",
      requestDate: "2023-10-14",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      status: "pending",
      dosage: "1 viên",
      frequency: "once",
      lastAdministered: null,
      completedDoses: 0,
      totalDoses: 6,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedications = medications.filter((med) => {
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    const matchesSearch =
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-600/20">
            Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-50 text-neutral-700 ring-1 ring-neutral-600/20">
            Đã hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20">
            Chờ xác nhận
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-600/20">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="bg-primary-600 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black mb-2">
                Lịch sử yêu cầu thuốc
              </h1>
              <p className="text-primary-100 text-sm">
                Theo dõi tình trạng và lịch sử uống thuốc của học sinh
              </p>
            </div>
            <Link
              to="/parent/medication/request"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-black border border-black rounded-md shadow-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Tạo yêu cầu mới
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-6">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-neutral-400"
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
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tìm kiếm theo tên thuốc, mã yêu cầu hoặc tên học sinh"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-40">
                <select
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="active">Đang thực hiện</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>

            {filteredMedications.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-neutral-100">
                  <svg
                    className="h-8 w-8 text-neutral-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  Không tìm thấy yêu cầu nào
                </h3>
                <p className="text-neutral-500 mb-6">
                  Hãy tạo yêu cầu thuốc mới hoặc thay đổi bộ lọc tìm kiếm
                </p>
                <Link
                  to="/parent/medication/request"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-black rounded-md transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tạo yêu cầu mới
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Mã yêu cầu
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Học sinh
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Thuốc & Liều lượng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Ngày bắt đầu - kết thúc
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Tiến độ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        Tùy chọn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredMedications.map((medication) => (
                      <tr key={medication.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                          #{medication.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {medication.studentName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            Lớp {medication.class}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {medication.medicationName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {medication.dosage} (
                            {medication.frequency === "once"
                              ? "1 lần/ngày"
                              : medication.frequency === "twice"
                              ? "2 lần/ngày"
                              : medication.frequency === "thrice"
                              ? "3 lần/ngày"
                              : "Khi cần"}
                            )
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {new Date(medication.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
                            {" - "}
                            {new Date(medication.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Yêu cầu:{" "}
                            {new Date(
                              medication.requestDate
                            ).toLocaleDateString("vi-VN")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-2">
                            <div
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (medication.completedDoses /
                                    medication.totalDoses) *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-neutral-500">
                            {medication.completedDoses}/{medication.totalDoses}{" "}
                            liều
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(medication.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/parent/medication/detail/${medication.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationHistory;
