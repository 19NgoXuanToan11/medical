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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/nurse/vaccination"
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết tiêm chủng
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/nurse/vaccination/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
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
              className="inline-flex items-center px-3 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
            >
              <FiBell className="mr-2 h-4 w-4" />
              Gửi thông báo
            </button>
          )}
          <button
            onClick={handleDeleteVaccination}
            className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            Xóa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Vaccination Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-blue-100">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {vaccination.title}
                  </h2>
                  {getStatusBadge(vaccination.status)}
                </div>
                <p className="text-gray-600">{vaccination.description}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1 h-4 w-4" />
                {new Date(vaccination.scheduledDate).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                ({vaccination.startTime} - {vaccination.endTime})
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column - Vaccination Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thông tin tiêm chủng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Loại vắc-xin</p>
                  <p className="font-medium">{vaccination.vaccineInfo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa điểm</p>
                  <p className="font-medium">{vaccination.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đơn vị thực hiện</p>
                  <p className="font-medium">
                    {vaccination.healthcareProvider}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phương pháp tiêm</p>
                  <p className="font-medium">{vaccination.vaccinationMethod}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Lớp tham gia</p>
                  <p className="font-medium">{vaccination.grades.join(", ")}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    Tác dụng phụ có thể gặp
                  </p>
                  <p className="font-medium">{vaccination.sideEffects}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Chống chỉ định</p>
                  <p className="font-medium">{vaccination.contraindications}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Ghi chú</p>
                  <p className="font-medium">{vaccination.notes}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Danh sách học sinh
              </h3>
              <div className="mb-4 flex justify-between items-center">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Tìm kiếm học sinh..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowStudentList(!showStudentList)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showStudentList ? "Ẩn danh sách" : "Hiện danh sách"}
                  </button>
                  <button className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium">
                    <FiDownload className="mr-1 h-4 w-4" />
                    Xuất Excel
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-blue-100">
                      <FiUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">
                      Tổng số học sinh: {vaccination.totalStudents}
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">
                        {vaccination.status === "completed"
                          ? "Đã tiêm: " + vaccination.confirmedParents
                          : "Đã xác nhận: " + vaccination.confirmedParents}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">
                        {vaccination.status === "completed"
                          ? "Chưa tiêm: " +
                            (vaccination.totalStudents -
                              vaccination.confirmedParents)
                          : "Chưa xác nhận: " +
                            (vaccination.totalStudents -
                              vaccination.confirmedParents)}
                      </span>
                    </div>
                  </div>
                </div>

                {showStudentList && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            STT
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Họ và tên
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lớp
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ghi chú
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.slice(0, 10).map((student, index) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              {student.class}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                              {vaccination.status === "completed" ? (
                                student.vaccinated ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Đã tiêm
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Chưa tiêm
                                  </span>
                                )
                              ) : student.parentConfirmed ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Đã xác nhận
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Chưa xác nhận
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              {student.parentNote || "Không có"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <div className="flex justify-center space-x-3">
                                <button className="text-blue-600 hover:text-blue-900">
                                  Chi tiết
                                </button>
                                {vaccination.status === "upcoming" &&
                                  !student.parentConfirmed && (
                                    <button className="text-purple-600 hover:text-purple-900">
                                      Nhắc nhở
                                    </button>
                                  )}
                                {vaccination.status === "completed" && (
                                  <button className="text-green-600 hover:text-green-900">
                                    Cập nhật
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredStudents.length > 10 && (
                      <div className="px-6 py-4 border-t border-gray-200 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Xem thêm ({filteredStudents.length - 10} học sinh)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Progress and Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Tiến độ tiêm chủng
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {vaccination.status === "completed"
                      ? "Đã tiêm"
                      : "Đã xác nhận"}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {vaccination.confirmedParents}/{vaccination.totalStudents} (
                    {Math.round(
                      (vaccination.confirmedParents /
                        vaccination.totalStudents) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (vaccination.confirmedParents /
                          vaccination.totalStudents) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <FiCalendar className="text-gray-500" />
                  </div>
                  <div className="col-span-11">
                    <p className="text-sm font-medium">Ngày tiêm chủng</p>
                    <p className="text-sm text-gray-600">
                      {new Date(vaccination.scheduledDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <FiClock className="text-gray-500" />
                  </div>
                  <div className="col-span-11">
                    <p className="text-sm font-medium">Thời gian</p>
                    <p className="text-sm text-gray-600">
                      {vaccination.startTime} - {vaccination.endTime}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <FiInfo className="text-gray-500" />
                  </div>
                  <div className="col-span-11">
                    <p className="text-sm font-medium">Tạo bởi</p>
                    <p className="text-sm text-gray-600">
                      {vaccination.createdBy}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <FiClock className="text-gray-500" />
                  </div>
                  <div className="col-span-11">
                    <p className="text-sm font-medium">Cập nhật lần cuối</p>
                    <p className="text-sm text-gray-600">
                      {vaccination.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <div className="flex">
                <FiAlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-md font-medium text-blue-800 mb-1">
                    Lưu ý về tiêm chủng
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Chuẩn bị đầy đủ hồ sơ tiêm chủng của học sinh</li>
                    <li>
                      • Kiểm tra tình trạng sức khỏe học sinh trước khi tiêm
                    </li>
                    <li>• Đảm bảo có sự đồng ý của phụ huynh</li>
                    <li>• Theo dõi phản ứng sau tiêm ít nhất 30 phút</li>
                    <li>• Cập nhật kết quả tiêm chủng vào hồ sơ y tế</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận hoàn thành tiêm chủng
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn đánh dấu đợt tiêm chủng này là đã hoàn
              thành? Hành động này sẽ lưu trữ kết quả hiện tại và không thể hoàn
              tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  handleMarkAsCompleted();
                  setConfirmationModal(false);
                }}
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gửi thông báo nhắc nhở
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề thông báo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                defaultValue={`Nhắc nhở: Tiêm chủng ${
                  vaccination.title
                } ngày ${new Date(vaccination.scheduledDate).toLocaleDateString(
                  "vi-VN"
                )}`}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung thông báo
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                defaultValue={`Kính gửi Quý phụ huynh,\n\nNhà trường xin thông báo về lịch tiêm chủng ${
                  vaccination.title
                } vào ngày ${new Date(
                  vaccination.scheduledDate
                ).toLocaleDateString("vi-VN")} từ ${
                  vaccination.startTime
                } đến ${
                  vaccination.endTime
                }.\n\nXin vui lòng xác nhận tham gia hoặc không tham gia để nhà trường nắm được thông tin.`}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setNotificationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
