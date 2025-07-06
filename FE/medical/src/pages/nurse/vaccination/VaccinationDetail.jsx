import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiMessageCircle,
  FiEdit,
  FiTrash2,
  FiBell,
  FiInfo,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";

const VaccinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vaccination, setVaccination] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockVaccination = {
        id: parseInt(id),
        title: id === "1" ? "Tiêm vắc-xin cúm mùa" : "Tiêm nhắc vắc-xin MMR",
        scheduledDate: id === "1" ? "2023-07-15" : "2023-06-30",
        status: id === "1" ? "upcoming" : id === "2" ? "upcoming" : "completed",
        grades: id === "1" ? ["1A", "1B", "1C"] : ["5A", "5B"],
        totalStudents: id === "1" ? 75 : 52,
        confirmedParents: id === "1" ? 68 : 45,
        vaccineInfo:
          id === "1"
            ? "Vắc-xin cúm mùa 2023"
            : "Vắc-xin MMR (Sởi - Quai bị - Rubella)",
        description:
          id === "1"
            ? "Tiêm phòng cúm mùa cho học sinh khối lớp 1"
            : "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 5",
        location: "Phòng y tế trường học",
        startTime: "08:00",
        endTime: "11:30",
        healthcareProvider: "Trung tâm Y tế Dự phòng Quận 1",
        notes:
          "Học sinh cần mang theo sổ tiêm chủng. Phụ huynh có thể đến cùng nếu muốn.",
        vaccinationMethod: "Tiêm bắp",
        sideEffects: "Có thể gây sốt nhẹ, đau tại chỗ tiêm trong 1-2 ngày",
        contraindications:
          "Không tiêm cho học sinh đang sốt hoặc có tiền sử dị ứng với thành phần của vắc-xin",
        createdAt: "2023-06-01",
        createdBy: "Nguyễn Thị An - Y tá trường",
        lastUpdated: "2023-06-10",
        students: Array(id === "1" ? 75 : 52)
          .fill()
          .map((_, i) => ({
            id: i + 1,
            name: `Học sinh ${i + 1}`,
            class:
              id === "1"
                ? ["1A", "1B", "1C"][Math.floor(i / 25)]
                : ["5A", "5B"][Math.floor(i / 26)],
            parentConfirmed: Math.random() > 0.1,
            vaccinated: false,
            parentNote: Math.random() > 0.8 ? "Cháu bị dị ứng với..." : "",
            healthStatus: "Bình thường",
          })),
      };

      setVaccination(mockVaccination);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "planning":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Lên kế hoạch
          </span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Sắp diễn ra
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đã hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const handleDeleteVaccination = () => {
    // In a real app, this would be an API call
    // and you'd show a confirmation dialog
    navigate("/nurse/vaccination");
  };

  const handleMarkAsCompleted = () => {
    // In a real app, this would be an API call
    setVaccination({ ...vaccination, status: "completed" });
    // Display a success message or notification
  };

  const handleSendNotification = () => {
    // In a real app, this would be an API call
    setNotificationModal(false);
    // Display a success message
    alert("Đã gửi thông báo nhắc nhở đến phụ huynh!");
  };

  const filteredStudents = vaccination
    ? vaccination.students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/nurse/vaccination"
            className="mr-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Chi tiết tiêm chủng
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/nurse/vaccination/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-700"
          >
            <FiEdit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
          {vaccination.status === "upcoming" && (
            <button
              onClick={() => setConfirmationModal(true)}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Đánh dấu hoàn thành
            </button>
          )}
          {vaccination.status !== "completed" && (
            <button
              onClick={() => setNotificationModal(true)}
              className="inline-flex items-center px-3 py-2 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-50 dark:hover:bg-neutral-700"
            >
              <FiBell className="mr-2 h-4 w-4" />
              Gửi thông báo
            </button>
          )}
          <button
            onClick={handleDeleteVaccination}
            className="inline-flex items-center px-3 py-2 border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-neutral-700"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      {/* Vaccination Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm mb-6">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <FiClipboard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {vaccination.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {vaccination.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(vaccination.status)}
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                <FiCalendar className="mr-1 h-4 w-4" />
                {new Date(vaccination.scheduledDate).toLocaleDateString(
                  "vi-VN"
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              <div className="flex items-center">
                <FiUsers className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tổng học sinh
                  </p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {vaccination.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              <div className="flex items-center">
                <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Đã xác nhận
                  </p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {vaccination.confirmedParents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              <div className="flex items-center">
                <FiXCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Chưa xác nhận
                  </p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {vaccination.totalStudents - vaccination.confirmedParents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              <div className="flex items-center">
                <FiClock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Thời gian
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {vaccination.startTime} - {vaccination.endTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <FiInfo className="inline mr-2" />
              Thông tin tiêm chủng
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Loại vắc-xin
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {vaccination.vaccineInfo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Phương pháp tiêm
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {vaccination.vaccinationMethod}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Địa điểm
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {vaccination.location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Đơn vị thực hiện
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {vaccination.healthcareProvider}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <FiAlertCircle className="inline mr-2" />
              Lưu ý quan trọng
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Tác dụng phụ có thể xảy ra
                </p>
                <div className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {vaccination.sideEffects}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Chống chỉ định
                </p>
                <div className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {vaccination.contraindications}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Ghi chú
                </p>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {vaccination.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Danh sách học sinh
            </h3>
            <button
              onClick={() => setShowStudentList(!showStudentList)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              {showStudentList ? "Ẩn danh sách" : "Xem danh sách"}
            </button>
          </div>

          {showStudentList && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md leading-5 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {showStudentList && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Xác nhận PH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tình trạng sức khỏe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Đã tiêm
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {student.name}
                      </div>
                      {student.parentNote && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Ghi chú: {student.parentNote}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.parentConfirmed
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {student.parentConfirmed
                          ? "Đã xác nhận"
                          : "Chưa xác nhận"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                      {student.healthStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.vaccinated
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300"
                        }`}
                      >
                        {student.vaccinated ? "Đã tiêm" : "Chưa tiêm"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Xác nhận hoàn thành
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Bạn có chắc chắn muốn đánh dấu kế hoạch tiêm chủng này là đã hoàn
              thành?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmationModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                onClick={handleMarkAsCompleted}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Gửi thông báo nhắc nhở
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Gửi thông báo nhắc nhở về lịch tiêm chủng đến phụ huynh chưa xác
              nhận?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setNotificationModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationDetail;
