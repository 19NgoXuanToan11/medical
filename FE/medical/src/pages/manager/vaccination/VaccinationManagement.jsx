import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiFileText,
} from "react-icons/fi";

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data for vaccination stats
  const stats = {
    totalVaccinations: 245,
    completedToday: 12,
    scheduled: 18,
    pending: 5,
    completionRate: 92.3,
  };

  // Mock data for pending vaccination requests from nurses
  const pendingRequests = [
    {
      id: 1,
      title: "Tiêm chủng phòng cúm mùa 2024",
      requestedBy: "Y tá Nguyễn Thị Hoa",
      requestedById: "nurse_001",
      requestDate: "2024-01-20",
      scheduledDate: "2024-02-15",
      scheduledTime: "08:00",
      targetGrades: ["1A", "1B", "1C"],
      totalStudents: 75,
      vaccineType: "Cúm mùa",
      location: "Phòng y tế trường",
      estimatedDuration: 180,
      description:
        "Tiêm phòng cúm mùa cho học sinh khối lớp 1 nhằm phòng ngừa dịch bệnh trong mùa đông",
      justification:
        "Theo khuyến cáo của Bộ Y tế về việc tiêm phòng cúm mùa cho trẻ em trong độ tuổi học đường",
      parentConsent: "Đã có 68/75 phụ huynh đồng ý",
      urgencyLevel: "normal",
      estimatedCost: 2250000,
      supplies: [
        "Vắc-xin cúm mùa x75",
        "Kim tiêm x75",
        "Cồn y tế",
        "Băng cá nhân",
      ],
      contraindications: "Học sinh đang sốt, có tiền sử dị ứng với vắc-xin",
      status: "pending",
    },
    {
      id: 2,
      title: "Tiêm nhắc vắc-xin MMR",
      requestedBy: "Y tá Trần Văn Nam",
      requestedById: "nurse_002",
      requestDate: "2024-01-18",
      scheduledDate: "2024-02-20",
      scheduledTime: "09:00",
      targetGrades: ["5A", "5B"],
      totalStudents: 52,
      vaccineType: "MMR (Sởi - Quai bị - Rubella)",
      location: "Phòng y tế trường",
      estimatedDuration: 150,
      description: "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 5",
      justification:
        "Theo lịch tiêm chủng quốc gia, học sinh lớp 5 cần tiêm nhắc mũi 2 MMR",
      parentConsent: "Đã có 48/52 phụ huynh đồng ý",
      urgencyLevel: "high",
      estimatedCost: 1560000,
      supplies: ["Vắc-xin MMR x52", "Kim tiêm x52", "Cồn y tế", "Băng cá nhân"],
      contraindications: "Học sinh có suy giảm miễn dịch, đang sốt",
      status: "pending",
    },
    {
      id: 3,
      title: "Tiêm vắc-xin Viêm gan B",
      requestedBy: "Y tá Lê Thị Mai",
      requestedById: "nurse_003",
      requestDate: "2024-01-15",
      scheduledDate: "2024-02-10",
      scheduledTime: "08:30",
      targetGrades: ["3A", "3B"],
      totalStudents: 60,
      vaccineType: "Viêm gan B",
      location: "Phòng y tế trường",
      estimatedDuration: 120,
      description:
        "Tiêm bổ sung vắc-xin Viêm gan B cho học sinh chưa hoàn thành lịch tiêm",
      justification:
        "Một số học sinh chưa hoàn thành lịch tiêm Viêm gan B theo quy định",
      parentConsent: "Đã có 55/60 phụ huynh đồng ý",
      urgencyLevel: "normal",
      estimatedCost: 1800000,
      supplies: [
        "Vắc-xin Viêm gan B x60",
        "Kim tiêm x60",
        "Cồn y tế",
        "Băng cá nhân",
      ],
      contraindications: "Học sinh đang sốt, có tiền sử dị ứng",
      status: "pending",
    },
  ];

  // Mock data for vaccination programs
  const vaccinationPrograms = [
    {
      id: 1,
      name: "Tiêm chủng phòng cúm mùa",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      targetStudents: 150,
      completedStudents: 135,
      status: "Đang diễn ra",
    },
    {
      id: 2,
      name: "Tiêm vaccine COVID-19",
      startDate: "2024-01-10",
      endDate: "2024-01-25",
      targetStudents: 200,
      completedStudents: 200,
      status: "Hoàn thành",
    },
    {
      id: 3,
      name: "Tiêm chủng phòng viêm gan B",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      targetStudents: 80,
      completedStudents: 45,
      status: "Đang diễn ra",
    },
  ];

  // Handle view request detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle approval action
  const handleApprovalAction = (action) => {
    setApprovalAction(action);
    setShowDetailModal(false);
    setShowApprovalModal(true);
  };

  // Handle approve/reject request
  const handleApprovalSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const actionText = approvalAction === "approve" ? "duyệt" : "từ chối";
      alert(`Yêu cầu đã được ${actionText} thành công!`);

      // Close modals and reset form
      setShowApprovalModal(false);
      setApprovalNotes("");
      setSelectedRequest(null);

      // In real app, refresh the pending requests list
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Render pending requests tab
  const renderPendingRequests = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center gap-2">
            <FiFilter className="h-4 w-4" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Pending Requests List */}
      <div className="grid grid-cols-1 gap-6">
        {pendingRequests
          .filter(
            (request) =>
              request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              request.requestedBy
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Yêu cầu bởi: {request.requestedBy} •{" "}
                          {new Date(request.requestDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      Chờ duyệt
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ngày thực hiện
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(request.scheduledDate).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      • {request.scheduledTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Đối tượng
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {request.targetGrades.join(", ")} ({request.totalStudents}{" "}
                      học sinh)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loại vắc-xin
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {request.vaccineType}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Mô tả
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {request.description}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      navigate(`/manager/vaccination/${request.id}`)
                    }
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                  >
                    <FiEye className="h-4 w-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      handleApprovalAction("approve");
                    }}
                    className="px-3 py-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-1"
                  >
                    <FiCheck className="h-4 w-4" />
                    Duyệt
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      handleApprovalAction("reject");
                    }}
                    className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                  >
                    <FiX className="h-4 w-4" />
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {pendingRequests.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
          <FiShield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không có yêu cầu chờ duyệt
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tất cả yêu cầu tiêm chủng đã được xử lý
          </p>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng mũi tiêm
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.totalVaccinations}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hoàn thành hôm nay
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completedToday}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã lên lịch
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.scheduled}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ duyệt
              </p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.completionRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Programs Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300 align-middle">
                    Tên chương trình
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300 align-middle">
                    Thời gian
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300 align-middle">
                    Tiến độ
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300 align-middle">
                    Trạng thái
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300 align-middle">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {vaccinationPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className="border-b border-gray-100 dark:border-neutral-700"
                  >
                    <td className="py-4 px-6 align-middle">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-center">
                        {program.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 align-middle text-center">
                      {program.startDate} đến {program.endDate}
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-24">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (program.completedStudents /
                                  program.targetStudents) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {program.completedStudents}/{program.targetStudents}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                          program.status === "Hoàn thành"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-middle text-center">
                      <button
                        onClick={() =>
                          navigate(`/manager/vaccination/${program.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        Xem chi tiết
                      </button>
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý tiêm chủng
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý các chương trình tiêm chủng và duyệt yêu cầu từ y tá
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700 overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              { id: "overview", label: "Tổng quan", icon: FiCalendar },
              {
                id: "pending",
                label: "Chờ duyệt",
                icon: FiClock,
                count: pendingRequests.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 border-b-2 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "pending" && renderPendingRequests()}
        {activeTab === "programs" && (
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Quản lý chương trình tiêm chủng
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chức năng này đang được phát triển
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu tiêm chủng
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tiêu đề
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Người yêu cầu
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.requestedBy}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày yêu cầu
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {new Date(selectedRequest.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule & Target */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-4">
                  Lịch trình & Đối tượng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày thực hiện
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {new Date(
                        selectedRequest.scheduledDate
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Thời gian
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.scheduledTime}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Địa điểm
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Thời gian dự kiến
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.estimatedDuration} phút
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Lớp đối tượng
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.targetGrades.join(", ")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Số học sinh
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.totalStudents} học sinh
                    </p>
                  </div>
                </div>
              </div>

              {/* Vaccine Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Thông tin vắc-xin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Loại vắc-xin
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.vaccineType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description & Justification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Mô tả & Lý do
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mô tả
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Căn cứ/Lý do
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.justification}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supplies & Consent */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Vật tư & Đồng ý
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Vật tư cần thiết
                    </label>
                    <ul className="mt-1 text-gray-900 dark:text-gray-100 list-disc list-inside">
                      {selectedRequest.supplies.map((supply, index) => (
                        <li key={index} className="text-sm">
                          {supply}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Đồng ý của phụ huynh
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {selectedRequest.parentConsent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contraindications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Chống chỉ định
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedRequest.contraindications}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Đóng
              </button>
              <button
                onClick={() => handleApprovalAction("reject")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2"
              >
                <FiX className="h-4 w-4" />
                Từ chối
              </button>
              <button
                onClick={() => handleApprovalAction("approve")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2"
              >
                <FiCheck className="h-4 w-4" />
                Duyệt yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {approvalAction === "approve"
                    ? "Duyệt yêu cầu"
                    : "Từ chối yêu cầu"}
                </h2>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {approvalAction === "approve"
                    ? `Bạn có chắc chắn muốn duyệt yêu cầu "${selectedRequest.title}"?`
                    : `Bạn có chắc chắn muốn từ chối yêu cầu "${selectedRequest.title}"?`}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú{" "}
                  {approvalAction === "reject" ? "(bắt buộc)" : "(tùy chọn)"}
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder={
                    approvalAction === "approve"
                      ? "Nhập ghi chú cho việc duyệt yêu cầu..."
                      : "Nhập lý do từ chối yêu cầu..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleApprovalSubmit}
                disabled={
                  loading ||
                  (approvalAction === "reject" && !approvalNotes.trim())
                }
                className={`px-4 py-2 text-white rounded-md flex items-center gap-2 disabled:opacity-50 ${
                  approvalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    {approvalAction === "approve" ? (
                      <FiCheck className="h-4 w-4" />
                    ) : (
                      <FiX className="h-4 w-4" />
                    )}
                    {approvalAction === "approve"
                      ? "Xác nhận duyệt"
                      : "Xác nhận từ chối"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement;
