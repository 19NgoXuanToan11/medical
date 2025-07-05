import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiClock,
  FiUser,
  FiActivity,
  FiPackage,
  FiCheck,
  FiAlertTriangle,
  FiFileText,
  FiPhone,
  FiCalendar,
  FiHeart,
  FiThermometer,
  FiTrendingUp,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";

const NurseHealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    vitals: {
      temperature: "",
      pulse: "",
      bloodPressure: "",
      oxygenSaturation: "",
    },
    notes: "",
    actionTaken: "",
  });

  useEffect(() => {
    // Mock data - in a real application, this would come from an API
    setTimeout(() => {
      const mockEvent = {
        id: 1,
        studentName: "Nguyễn Văn An",
        class: "3A",
        type: "illness",
        description: "Sốt nhẹ 37.8°C",
        time: "2023-06-15T09:30:00",
        status: "monitoring",
        priority: "medium",
        assignedToMe: true,
        lastUpdate: "2023-06-15T10:00:00",
        vitals: {
          temperature: "37.8°C",
          pulse: "85 bpm",
          bloodPressure: "110/70 mmHg",
          oxygenSaturation: "98%",
          status: "stable",
        },
        symptoms: ["Sốt", "Mệt mỏi", "Đau đầu nhẹ"],
        medications: [
          {
            name: "Paracetamol",
            dosage: "250mg",
            time: "09:35",
            administeredBy: "Y tá Nguyễn Thị Hoa",
          },
        ],
        actionTaken: "Đã cho uống thuốc hạ sốt và thông báo cho phụ huynh",
        parentContact: {
          contacted: true,
          time: "09:40",
          person: "Nguyễn Văn Bình (Bố)",
          method: "Điện thoại",
          response: "Đã nhận thông tin, sẽ đến đón con",
        },
        nurseNotes: "Học sinh có dấu hiệu sốt nhẹ, cần theo dõi thêm",
        timeline: [
          {
            time: "09:30",
            action: "Phát hiện học sinh sốt",
            by: "Y tá Nguyễn Thị Hoa",
          },
          {
            time: "09:35",
            action: "Cho uống thuốc hạ sốt",
            by: "Y tá Nguyễn Thị Hoa",
          },
          {
            time: "09:40",
            action: "Liên hệ phụ huynh",
            by: "Y tá Nguyễn Thị Hoa",
          },
          {
            time: "10:00",
            action: "Cập nhật trạng thái theo dõi",
            by: "Y tá Nguyễn Thị Hoa",
          },
        ],
      };
      setEvent(mockEvent);
      setUpdateData({
        status: mockEvent.status,
        vitals: {
          temperature: mockEvent.vitals.temperature.replace("°C", ""),
          pulse: mockEvent.vitals.pulse.replace(" bpm", ""),
          bloodPressure: mockEvent.vitals.bloodPressure.replace(" mmHg", ""),
          oxygenSaturation: mockEvent.vitals.oxygenSaturation.replace("%", ""),
        },
        notes: mockEvent.nurseNotes,
        actionTaken: mockEvent.actionTaken,
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "illness":
        return "Bệnh tật";
      case "injury":
        return "Chấn thương";
      case "allergy":
        return "Dị ứng";
      case "chronic":
        return "Bệnh mãn tính";
      default:
        return "Khác";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "urgent":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            <FiAlertTriangle className="h-3 w-3 mr-1" />
            Khẩn cấp
          </span>
        );
      case "monitoring":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            <FiClock className="h-3 w-3 mr-1" />
            Đang theo dõi
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            <FiCheck className="h-3 w-3 mr-1" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            Cao
          </span>
        );
      case "medium":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            Trung bình
          </span>
        );
      case "low":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      console.log("Update submitted:", updateData);
      setIsEditing(false);
      setLoading(false);
      // Update local state
      setEvent((prev) => ({
        ...prev,
        status: updateData.status,
        vitals: {
          ...prev.vitals,
          temperature: updateData.vitals.temperature + "°C",
          pulse: updateData.vitals.pulse + " bpm",
          bloodPressure: updateData.vitals.bloodPressure + " mmHg",
          oxygenSaturation: updateData.vitals.oxygenSaturation + "%",
        },
        nurseNotes: updateData.notes,
        actionTaken: updateData.actionTaken,
        lastUpdate: new Date().toISOString(),
      }));
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Không tìm thấy sự kiện
          </h2>
          <Link
            to="/nurse/health-events"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/nurse/health-events"
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Chi tiết sự kiện y tế
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sự kiện #{event.id} - {event.studentName}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {event.assignedToMe && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit className="h-4 w-4" />
              {isEditing ? "Hủy chỉnh sửa" : "Cập nhật"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Học sinh
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {event.studentName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lớp
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {event.class}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Thời gian
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(event.time).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cập nhật lần cuối
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(event.lastUpdate).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loại sự kiện
                </label>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  {getEventTypeLabel(event.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mức độ ưu tiên
                </label>
                {getPriorityBadge(event.priority)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Mô tả sự kiện
            </h2>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Symptoms */}
          {event.symptoms && event.symptoms.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Triệu chứng
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Current Vitals */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Thông số sinh hiệu hiện tại
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <FiThermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhiệt độ
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.vitals.temperature}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <FiHeart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Mạch</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.vitals.pulse}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <FiTrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Huyết áp
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.vitals.bloodPressure}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <FiActivity className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">SpO2</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {event.vitals.oxygenSaturation}
                </p>
              </div>
            </div>
          </div>

          {/* Update Form */}
          {isEditing && event.assignedToMe && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Cập nhật thông tin
              </h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={updateData.status}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="monitoring">Đang theo dõi</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nhiệt độ (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={updateData.vitals.temperature}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          vitals: {
                            ...prev.vitals,
                            temperature: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mạch (bpm)
                    </label>
                    <input
                      type="number"
                      value={updateData.vitals.pulse}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          vitals: { ...prev.vitals, pulse: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      value={updateData.vitals.bloodPressure}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          vitals: {
                            ...prev.vitals,
                            bloodPressure: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SpO2 (%)
                    </label>
                    <input
                      type="number"
                      value={updateData.vitals.oxygenSaturation}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          vitals: {
                            ...prev.vitals,
                            oxygenSaturation: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hành động đã thực hiện
                  </label>
                  <textarea
                    rows={3}
                    value={updateData.actionTaken}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        actionTaken: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ghi chú của y tá
                  </label>
                  <textarea
                    rows={3}
                    value={updateData.notes}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="h-4 w-4" />
                    {loading ? "Đang lưu..." : "Lưu cập nhật"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Lịch sử xử lý
            </h2>
            <div className="space-y-4">
              {event.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.time}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        bởi {item.by}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Trạng thái hiện tại
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tình trạng:
                </span>
                {getStatusBadge(event.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Ưu tiên:
                </span>
                {getPriorityBadge(event.priority)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Phân công:
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.assignedToMe
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {event.assignedToMe ? "Được phân công" : "Không phân công"}
                </span>
              </div>
            </div>
          </div>

          {/* Parent Contact */}
          {event.parentContact && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Liên hệ phụ huynh
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiCheck className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 dark:text-green-400">
                    Đã liên hệ
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thời gian:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.parentContact.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Người liên hệ:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.parentContact.person}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phương thức:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.parentContact.method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phản hồi:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {event.parentContact.response}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Medications */}
          {event.medications && event.medications.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Thuốc đã sử dụng
              </h3>
              <div className="space-y-3">
                {event.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {medication.name}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {medication.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Liều lượng: {medication.dosage}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Người thực hiện: {medication.administeredBy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseHealthEventDetail;
