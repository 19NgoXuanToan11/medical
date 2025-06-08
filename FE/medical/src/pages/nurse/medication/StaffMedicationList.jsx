import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";

const StaffMedicationList = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [medicationList, setMedicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMedicationList([
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          class: "3A",
          medication: "Paracetamol",
          dosage: "1 viên",
          frequency: "Khi sốt trên 38°C",
          requestDate: "2023-06-15",
          status: "pending",
          parentNote: "Con bị sốt nhẹ sáng nay, đã uống 1 viên lúc 7h.",
        },
        {
          id: 2,
          studentName: "Trần Thị Bình",
          class: "2B",
          medication: "Cetirizine",
          dosage: "5ml",
          frequency: "Sáng 1 lần",
          requestDate: "2023-06-14",
          status: "approved",
          scheduleEnd: "2023-06-20",
        },
        {
          id: 3,
          studentName: "Lê Minh Cường",
          class: "5C",
          medication: "Ventolin",
          dosage: "2 nhát xịt",
          frequency: "Khi khó thở",
          requestDate: "2023-06-10",
          status: "completed",
          scheduleEnd: "2023-06-17",
        },
        {
          id: 4,
          studentName: "Phạm Thị Dung",
          class: "4A",
          medication: "Probiotics",
          dosage: "1 gói",
          frequency: "Sau bữa trưa",
          requestDate: "2023-06-13",
          status: "rejected",
          rejectReason: "Cần giấy chỉ định của bác sĩ",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMedications = medicationList.filter(
    (medication) =>
      (activeTab === "all" || medication.status === activeTab) &&
      (medication.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        medication.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.medication.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 justify-center mx-auto">
            Chờ xử lý
          </span>
        );
      case "approved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 justify-center mx-auto">
            Đã duyệt
          </span>
        );
      case "completed":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 justify-center mx-auto">
            Hoàn thành
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 justify-center mx-auto">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const handleQuickApprove = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionLoading(id);

    // Simulate API call
    setTimeout(() => {
      setMedicationList((prevList) =>
        prevList.map((med) =>
          med.id === id ? { ...med, status: "approved" } : med
        )
      );
      setActionLoading(null);
    }, 1000);
  };

  const handleQuickReject = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActionLoading(id);

    // Simulate API call
    setTimeout(() => {
      setMedicationList((prevList) =>
        prevList.map((med) =>
          med.id === id ? { ...med, status: "rejected" } : med
        )
      );
      setActionLoading(null);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thuốc</h1>
        <p className="text-gray-600 mt-1">
          Quản lý yêu cầu cấp thuốc và lịch uống thuốc của học sinh
        </p>
      </div>

      {/* Filter Tabs - Match UI in screenshot */}
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-md ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200 whitespace-nowrap`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-md ${
              activeTab === "approved"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200 whitespace-nowrap`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2 rounded-md ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200 whitespace-nowrap`}
          >
            Hoàn thành
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-6 py-2 rounded-md ${
              activeTab === "rejected"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200 whitespace-nowrap`}
          >
            Từ chối
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-md ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200 whitespace-nowrap`}
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* Search Field - Matching screenshot */}
      <div className="flex justify-end mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HỌC SINH
                  </th>
                  <th className="w-2/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THUỐC & LIỀU LƯỢNG
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NGÀY YÊU CẦU
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TRẠNG THÁI
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.map((medication) => (
                  <tr key={medication.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {medication.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Lớp {medication.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {medication.medication}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.dosage} - {medication.frequency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(medication.requestDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(medication.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/nurse/medication/${medication.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </Link>
                        {medication.status === "pending" && (
                          <>
                            <button
                              onClick={(e) =>
                                handleQuickApprove(medication.id, e)
                              }
                              disabled={actionLoading === medication.id}
                              className="text-green-600 hover:text-green-900 ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === medication.id ? (
                                <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-green-600 animate-spin"></span>
                              ) : (
                                "Duyệt"
                              )}
                            </button>
                            <button
                              onClick={(e) =>
                                handleQuickReject(medication.id, e)
                              }
                              disabled={actionLoading === medication.id}
                              className="text-red-600 hover:text-red-900 ml-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === medication.id ? (
                                <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-red-600 animate-spin"></span>
                              ) : (
                                "Từ chối"
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Medication Button */}
      <div className="fixed bottom-8 right-8">
        <Link
          to="/nurse/medication/new"
          className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        >
          <FiPlus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default StaffMedicationList;
