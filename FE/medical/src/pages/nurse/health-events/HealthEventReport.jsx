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
  FiThermometer,
  FiHeart,
  FiActivity,
  FiAlertTriangle,
  FiPhone,
  FiFileText,
} from "react-icons/fi";

const HealthEventReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    class: "",
    type: "illness",
    severity: "medium",
    description: "",
    symptoms: [],
    vitals: {
      temperature: "",
      pulse: "",
      bloodPressure: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
    medications: [{ name: "", dosage: "", time: "", notes: "" }],
    medicalSupplies: [{ name: "", quantity: 1, time: "", notes: "" }],
    parentContact: {
      contacted: false,
      time: "",
      person: "",
      method: "phone",
      response: "",
    },
    actionTaken: "",
    recommendation: "",
    followUpRequired: false,
    followUpNotes: "",
    nurseNotes: "",
  });

  const [customSymptom, setCustomSymptom] = useState("");

  const symptomOptions = [
    "Sốt",
    "Đau đầu",
    "Buồn nôn",
    "Nôn",
    "Đau bụng",
    "Tiêu chảy",
    "Khó thở",
    "Ho",
    "Đau họng",
    "Chóng mặt",
    "Mệt mỏi",
    "Phát ban",
    "Ngứa",
    "Đau cơ",
    "Đau khớp",
    "Mất ngủ",
    "Lo lắng",
    "Căng thẳng",
  ];

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

  const handleVitalsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [field]: value },
    }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const addCustomSymptom = () => {
    if (
      customSymptom.trim() &&
      !formData.symptoms.includes(customSymptom.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, customSymptom.trim()],
      }));
      setCustomSymptom("");
    }
  };

  const removeSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((s) => s !== symptom),
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
      medications: [
        ...prev.medications,
        { name: "", dosage: "", time: "", notes: "" },
      ],
    }));
  };

  const addMedicalSupply = () => {
    setFormData((prev) => ({
      ...prev,
      medicalSupplies: [
        ...prev.medicalSupplies,
        { name: "", quantity: 1, time: "", notes: "" },
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
    console.log("Health event report submitted:", formData);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to the health events monitoring page
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
          Báo cáo sự kiện y tế
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mã học sinh
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <option value="emergency">Cấp cứu</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="severity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mức độ nghiêm trọng <span className="text-red-500">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                required
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Nhẹ</option>
                <option value="medium">Trung bình</option>
                <option value="high">Nghiêm trọng</option>
                <option value="critical">Nguy hiểm</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mô tả sự kiện <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Mô tả chi tiết về sự kiện y tế..."
            />
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Triệu chứng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {symptomOptions.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                  className="rounded border-gray-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {symptom}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Thêm triệu chứng khác..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="button"
              onClick={addCustomSymptom}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Thêm
            </button>
          </div>
          {formData.symptoms.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Triệu chứng đã chọn:
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vital Signs Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Thông số sinh hiệu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nhiệt độ (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.vitals.temperature}
                onChange={(e) =>
                  handleVitalsChange("temperature", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mạch (bpm)
              </label>
              <input
                type="number"
                value={formData.vitals.pulse}
                onChange={(e) => handleVitalsChange("pulse", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Huyết áp (mmHg)
              </label>
              <input
                type="text"
                placeholder="120/80"
                value={formData.vitals.bloodPressure}
                onChange={(e) =>
                  handleVitalsChange("bloodPressure", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nhịp thở (/phút)
              </label>
              <input
                type="number"
                value={formData.vitals.respiratoryRate}
                onChange={(e) =>
                  handleVitalsChange("respiratoryRate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SpO2 (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.vitals.oxygenSaturation}
                onChange={(e) =>
                  handleVitalsChange("oxygenSaturation", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Actions and Recommendations */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Hành động và khuyến nghị
          </h2>
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
                required
                rows={3}
                value={formData.actionTaken}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Mô tả các hành động đã thực hiện..."
              />
            </div>
            <div>
              <label
                htmlFor="recommendation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Khuyến nghị
              </label>
              <textarea
                id="recommendation"
                name="recommendation"
                rows={3}
                value={formData.recommendation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Khuyến nghị cho việc chăm sóc tiếp theo..."
              />
            </div>
          </div>
        </div>

        {/* Follow-up Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Theo dõi
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="followUpRequired"
                name="followUpRequired"
                checked={formData.followUpRequired}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "followUpRequired",
                      value: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="followUpRequired"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Cần theo dõi thêm
              </label>
            </div>
            {formData.followUpRequired && (
              <div>
                <label
                  htmlFor="followUpNotes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ghi chú theo dõi
                </label>
                <textarea
                  id="followUpNotes"
                  name="followUpNotes"
                  rows={3}
                  value={formData.followUpNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ghi chú về việc theo dõi..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Nurse Notes */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Ghi chú của y tá
          </h2>
          <textarea
            id="nurseNotes"
            name="nurseNotes"
            rows={4}
            value={formData.nurseNotes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ghi chú bổ sung của y tá..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-neutral-700 flex justify-end space-x-4">
          <Link
            to="/nurse/health-events"
            className="px-6 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <FiCheck className="h-4 w-4" />
                <span>Gửi báo cáo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthEventReport;
