import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiCalendar,
  FiClock,
  FiUser,
  FiActivity,
  FiAlertCircle,
  FiX,
  FiPlusCircle,
} from "react-icons/fi";

const HealthEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockEvent = {
        id: parseInt(id),
        studentName: "Nguyễn Văn An",
        class: "3A",
        type: "illness",
        description: "Sốt nhẹ 37.8°C, đã cấp thuốc hạ sốt",
        time: "2023-06-15T09:30:00",
        status: "resolved",
        actionTaken: "Đã cho uống thuốc hạ sốt và thông báo cho phụ huynh",
        details: [
          "Học sinh có biểu hiện sốt từ sáng",
          "Thân nhiệt đo được: 37.8°C",
          "Không có các triệu chứng khác như ho, đau họng",
          "Đã uống 1 liều Paracetamol 250mg lúc 9:30",
        ],
        vitalSigns: {
          temperature: "37.8",
          pulse: "88",
          bloodPressure: "110/70",
          respiratoryRate: "20",
        },
        medications: [
          {
            name: "Paracetamol",
            dosage: "250mg",
            time: "09:30",
            administeredBy: "Y tá Trần Thị B",
          },
        ],
        parentContacted: {
          time: "09:45",
          person: "Mẹ - Nguyễn Thị X",
          method: "Điện thoại",
          response: "Đã nắm thông tin, không đón về",
        },
        followUp:
          "Theo dõi sát thân nhiệt, liên hệ lại phụ huynh nếu sốt trên 38.5°C",
      };

      setFormData(mockEvent);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties (e.g., vitalSigns.temperature)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      });
    }
  };

  const handleDetailChange = (index, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index] = value;
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, ""],
    });
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          name: "",
          dosage: "",
          time: "",
          administeredBy: "",
        },
      ],
    });
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const handleParentContactChange = (field, value) => {
    setFormData({
      ...formData,
      parentContacted: {
        ...formData.parentContacted,
        [field]: value,
      },
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentName.trim()) {
      errors.studentName = "Vui lòng nhập tên học sinh";
    }

    if (!formData.class.trim()) {
      errors.class = "Vui lòng nhập lớp";
    }

    if (!formData.type) {
      errors.type = "Vui lòng chọn loại sự kiện";
    }

    if (!formData.description.trim()) {
      errors.description = "Vui lòng nhập mô tả";
    }

    if (!formData.time) {
      errors.time = "Vui lòng chọn thời gian";
    }

    if (!formData.status) {
      errors.status = "Vui lòng chọn trạng thái";
    }

    if (!formData.vitalSigns.temperature) {
      errors["vitalSigns.temperature"] = "Vui lòng nhập thân nhiệt";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    // Simulate API call to save data
    setTimeout(() => {
      setSaving(false);
      // Navigate back to detail page after saving
      navigate(`/nurse/health-events/${id}`);
    }, 1500);
  };

  const formatDateTimeForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
  };

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
            to={`/nurse/health-events/${id}`}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa sự kiện y tế
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Basic Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên học sinh <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.studentName
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {validationErrors.studentName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.studentName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lớp <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.class
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {validationErrors.class && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.class}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loại sự kiện <span className="text-red-600">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.type ? "border-red-500" : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">-- Chọn loại sự kiện --</option>
                  <option value="illness">Bệnh tật</option>
                  <option value="injury">Chấn thương</option>
                  <option value="allergy">Dị ứng</option>
                  <option value="chronic">Bệnh mãn tính</option>
                </select>
                {validationErrors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.type}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trạng thái <span className="text-red-600">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.status
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="resolved">Đã xử lý</option>
                </select>
                {validationErrors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.status}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thời gian <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="time"
                    name="time"
                    value={formatDateTimeForInput(formData.time)}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      validationErrors.time
                        ? "border-red-500"
                        : "border-gray-300"
                    } pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {validationErrors.time && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.time}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full rounded-md border ${
                    validationErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Dấu hiệu sinh tồn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label
                  htmlFor="temperature"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thân nhiệt (°C) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="temperature"
                  name="vitalSigns.temperature"
                  value={formData.vitalSigns.temperature}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors["vitalSigns.temperature"]
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {validationErrors["vitalSigns.temperature"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors["vitalSigns.temperature"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pulse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mạch (lần/phút)
                </label>
                <input
                  type="text"
                  id="pulse"
                  name="vitalSigns.pulse"
                  value={formData.vitalSigns.pulse}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="bloodPressure"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Huyết áp (mmHg)
                </label>
                <input
                  type="text"
                  id="bloodPressure"
                  name="vitalSigns.bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="respiratoryRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhịp thở (lần/phút)
                </label>
                <input
                  type="text"
                  id="respiratoryRate"
                  name="vitalSigns.respiratoryRate"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Chi tiết sự kiện
              </h2>
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              >
                <FiPlusCircle className="mr-1" /> Thêm chi tiết
              </button>
            </div>
            <div className="space-y-3">
              {formData.details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FiAlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(index)}
                    className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Thuốc đã sử dụng
              </h2>
              <button
                type="button"
                onClick={handleAddMedication}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              >
                <FiPlusCircle className="mr-1" /> Thêm thuốc
              </button>
            </div>
            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      Thuốc #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label
                        htmlFor={`medication-name-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tên thuốc
                      </label>
                      <input
                        type="text"
                        id={`medication-name-${index}`}
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`medication-dosage-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Liều lượng
                      </label>
                      <input
                        type="text"
                        id={`medication-dosage-${index}`}
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`medication-time-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Thời gian
                      </label>
                      <input
                        type="time"
                        id={`medication-time-${index}`}
                        value={medication.time}
                        onChange={(e) =>
                          handleMedicationChange(index, "time", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`medication-admin-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Người thực hiện
                      </label>
                      <input
                        type="text"
                        id={`medication-admin-${index}`}
                        value={medication.administeredBy}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "administeredBy",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parent Contact */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Liên hệ phụ huynh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contactTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thời gian liên hệ
                </label>
                <input
                  type="time"
                  id="contactTime"
                  value={formData.parentContacted.time}
                  onChange={(e) =>
                    handleParentContactChange("time", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Người được liên hệ
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  value={formData.parentContacted.person}
                  onChange={(e) =>
                    handleParentContactChange("person", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="contactMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phương thức liên hệ
                </label>
                <select
                  id="contactMethod"
                  value={formData.parentContacted.method}
                  onChange={(e) =>
                    handleParentContactChange("method", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="phone">Điện thoại</option>
                  <option value="message">Tin nhắn</option>
                  <option value="email">Email</option>
                  <option value="in_person">Trực tiếp</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contactResponse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phản hồi
                </label>
                <input
                  type="text"
                  id="contactResponse"
                  value={formData.parentContacted.response}
                  onChange={(e) =>
                    handleParentContactChange("response", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="actionTaken"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hành động đã thực hiện
                </label>
                <textarea
                  id="actionTaken"
                  name="actionTaken"
                  value={formData.actionTaken}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="followUp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Theo dõi tiếp theo
                </label>
                <textarea
                  id="followUp"
                  name="followUp"
                  value={formData.followUp}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            to={`/nurse/health-events/${id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-300"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthEventEdit;
