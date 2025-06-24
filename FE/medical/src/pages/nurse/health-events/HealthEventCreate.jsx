import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiCheck,
  FiX,
  FiPackage,
} from "react-icons/fi";

const HealthEventCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    class: "",
    type: "illness",
    description: "",
    details: "",
    temperature: "",
    pulse: "",
    bloodPressure: "",
    respiratoryRate: "",
    medications: [{ name: "", dosage: "", time: "" }],
    medicalSupplies: [{ name: "", quantity: 1, time: "" }],
    parentContacted: {
      contacted: false,
      time: "",
      person: "",
      method: "phone",
      response: "",
    },
    actionTaken: "",
    followUp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, medications: updatedMedications }));
  };

  const handleMedicalSupplyChange = (index, field, value) => {
    const updatedSupplies = [...formData.medicalSupplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, medicalSupplies: updatedSupplies }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", time: "" }],
    }));
  };

  const addMedicalSupply = () => {
    setFormData((prev) => ({
      ...prev,
      medicalSupplies: [
        ...prev.medicalSupplies,
        { name: "", quantity: 1, time: "" },
      ],
    }));
  };

  const removeMedication = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData((prev) => ({ ...prev, medications: updatedMedications }));
  };

  const removeMedicalSupply = (index) => {
    const updatedSupplies = [...formData.medicalSupplies];
    updatedSupplies.splice(index, 1);
    setFormData((prev) => ({ ...prev, medicalSupplies: updatedSupplies }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // In a real application, this would be an API call
    console.log("Form submitted with data:", formData);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to the health events list page
      navigate("/nurse/health-events");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link
          to="/nurse/health-events"
          className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Tạo sự kiện y tế mới
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-neutral-700"
      >
        {/* Student Information Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Thông tin học sinh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Họ và tên học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                required
                value={formData.studentName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lớp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="class"
                name="class"
                required
                value={formData.class}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Chi tiết sự kiện
          </h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              >
                <option value="illness">Bệnh tật</option>
                <option value="injury">Chấn thương</option>
                <option value="allergy">Dị ứng</option>
                <option value="chronic">Bệnh mãn tính</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mô tả ngắn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: Sốt nhẹ 37.8°C, đã cấp thuốc hạ sốt"
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Chi tiết
              </label>
              <textarea
                id="details"
                name="details"
                rows="4"
                value={formData.details}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Mô tả chi tiết về tình trạng của học sinh"
              ></textarea>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Mỗi dòng sẽ được hiển thị như một mục riêng biệt
              </p>
            </div>
          </div>
        </div>

        {/* Vital Signs Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Dấu hiệu sinh tồn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Thân nhiệt
              </label>
              <input
                type="text"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: 37.8°C"
              />
            </div>
            <div>
              <label
                htmlFor="pulse"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mạch
              </label>
              <input
                type="text"
                id="pulse"
                name="pulse"
                value={formData.pulse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: 88 lần/phút"
              />
            </div>
            <div>
              <label
                htmlFor="bloodPressure"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Huyết áp
              </label>
              <input
                type="text"
                id="bloodPressure"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: 110/70 mmHg"
              />
            </div>
            <div>
              <label
                htmlFor="respiratoryRate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nhịp thở
              </label>
              <input
                type="text"
                id="respiratoryRate"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: 20 lần/phút"
              />
            </div>
          </div>
        </div>

        {/* Medications Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Thuốc đã sử dụng
            </h2>
            <button
              type="button"
              onClick={addMedication}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              + Thêm thuốc
            </button>
          </div>

          {formData.medications.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
            >
              <div>
                <label
                  htmlFor={`medication-name-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tên thuốc
                </label>
                <input
                  type="text"
                  id={`medication-name-${index}`}
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor={`medication-dosage-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Liều lượng
                </label>
                <input
                  type="text"
                  id={`medication-dosage-${index}`}
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedicationChange(index, "dosage", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor={`medication-time-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian
                </label>
                <input
                  type="text"
                  id={`medication-time-${index}`}
                  value={med.time}
                  onChange={(e) =>
                    handleMedicationChange(index, "time", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: 09:30"
                />
              </div>
              <div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    <FiX className="mr-1 h-4 w-4" /> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Medical Supplies Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Vật tư y tế đã sử dụng
            </h2>
            <button
              type="button"
              onClick={addMedicalSupply}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              <FiPackage className="mr-1 h-4 w-4" /> Thêm vật tư
            </button>
          </div>

          {formData.medicalSupplies.map((supply, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
            >
              <div>
                <label
                  htmlFor={`supply-name-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tên vật tư
                </label>
                <input
                  type="text"
                  id={`supply-name-${index}`}
                  value={supply.name}
                  onChange={(e) =>
                    handleMedicalSupplyChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: Băng dính y tế"
                />
              </div>
              <div>
                <label
                  htmlFor={`supply-quantity-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Số lượng
                </label>
                <input
                  type="number"
                  id={`supply-quantity-${index}`}
                  min="1"
                  value={supply.quantity}
                  onChange={(e) =>
                    handleMedicalSupplyChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor={`supply-time-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian
                </label>
                <input
                  type="text"
                  id={`supply-time-${index}`}
                  value={supply.time}
                  onChange={(e) =>
                    handleMedicalSupplyChange(index, "time", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: 09:30"
                />
              </div>
              <div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMedicalSupply(index)}
                    className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    <FiX className="mr-1 h-4 w-4" /> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Parent Contact Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Liên hệ phụ huynh
          </h2>
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="parentContacted"
                checked={formData.parentContacted.contacted}
                onChange={(e) =>
                  handleNestedChange(
                    "parentContacted",
                    "contacted",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="parentContacted"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Đã liên hệ với phụ huynh
              </label>
            </div>
          </div>

          {formData.parentContacted.contacted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="parentTime"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian liên hệ
                </label>
                <input
                  type="text"
                  id="parentTime"
                  value={formData.parentContacted.time}
                  onChange={(e) =>
                    handleNestedChange(
                      "parentContacted",
                      "time",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: 09:45"
                />
              </div>
              <div>
                <label
                  htmlFor="parentPerson"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Người được liên hệ
                </label>
                <input
                  type="text"
                  id="parentPerson"
                  value={formData.parentContacted.person}
                  onChange={(e) =>
                    handleNestedChange(
                      "parentContacted",
                      "person",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: Mẹ - Nguyễn Thị X"
                />
              </div>
              <div>
                <label
                  htmlFor="contactMethod"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phương thức liên hệ
                </label>
                <select
                  id="contactMethod"
                  value={formData.parentContacted.method}
                  onChange={(e) =>
                    handleNestedChange(
                      "parentContacted",
                      "method",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="phone">Điện thoại</option>
                  <option value="message">Tin nhắn</option>
                  <option value="app">Ứng dụng</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="parentResponse"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phản hồi
                </label>
                <input
                  type="text"
                  id="parentResponse"
                  value={formData.parentContacted.response}
                  onChange={(e) =>
                    handleNestedChange(
                      "parentContacted",
                      "response",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: Đã nắm thông tin, không đón về"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action & Follow-up Section */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="actionTaken"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Hành động đã thực hiện <span className="text-red-500">*</span>
              </label>
              <textarea
                id="actionTaken"
                name="actionTaken"
                rows="3"
                required
                value={formData.actionTaken}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Mô tả các hành động đã thực hiện để xử lý tình huống"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="followUp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Theo dõi tiếp theo
              </label>
              <textarea
                id="followUp"
                name="followUp"
                rows="3"
                value={formData.followUp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Các bước tiếp theo cần thực hiện để theo dõi tình trạng học sinh"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-neutral-700 flex justify-end space-x-4">
          <Link
            to="/nurse/health-events"
            className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-600 bg-white dark:bg-neutral-800"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                Lưu sự kiện
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthEventCreate;
