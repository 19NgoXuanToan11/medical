import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiCalendar,
  FiUsers,
  FiInfo,
  FiAlertCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { vaccinationService } from "../../../utils/api/vaccination/vaccinationService";

const VaccinationPlanCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    vaccineType: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    location: "Phòng y tế trường",
    targetGrades: [],
    isVoluntary: false,
    reminderDaysBefore: 7,
    maxStudentsPerSession: 50,
    estimatedDuration: 30,
    notes: "",
    requireParentConsent: true,
    vaccinationDetails: {
      dosage: "",
      manufacturer: "",
      lotNumber: "",
      expiryDate: "",
      sideEffects: "",
      contraindications: "",
    },
  });

  const [availableGrades, setAvailableGrades] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentSelection, setShowStudentSelection] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load available grades
        const gradesResponse = await vaccinationService.getAvailableGrades();
        if (gradesResponse.success) {
          setAvailableGrades(gradesResponse.data);
        }

        // Load vaccine types
        const vaccineTypesResponse = await vaccinationService.getVaccineTypes();
        if (vaccineTypesResponse.success) {
          setVaccineTypes(vaccineTypesResponse.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("vaccinationDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vaccinationDetails: {
          ...prev.vaccinationDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleGradeSelection = (gradeId) => {
    setFormData((prev) => ({
      ...prev,
      targetGrades: prev.targetGrades.includes(gradeId)
        ? prev.targetGrades.filter((id) => id !== gradeId)
        : [...prev.targetGrades, gradeId],
    }));
  };

  const calculateTotalStudents = () => {
    return formData.targetGrades.reduce((total, gradeId) => {
      const grade = availableGrades.find((g) => g.id === gradeId);
      return total + (grade ? grade.studentCount : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API
      const planData = {
        ...formData,
        grades: formData.targetGrades, // Map targetGrades to grades for API compatibility
        vaccineInfo:
          vaccineTypes.find((v) => v.id === formData.vaccineType)?.name ||
          formData.vaccineType,
      };

      // Create vaccination plan using API service
      const response = await vaccinationService.createVaccinationPlan(planData);

      if (response.success) {
        alert(response.message);
        navigate("/nurse/vaccination");
      } else {
        alert(response.message || "Có lỗi xảy ra khi tạo kế hoạch");
      }
    } catch (error) {
      console.error("Lỗi khi tạo kế hoạch:", error);
      alert("Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.");

      setLoading(false);
    }
  };

  const selectedVaccine = vaccineTypes.find(
    (v) => v.id === formData.vaccineType
  );
  const totalStudents = calculateTotalStudents();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Tạo kế hoạch tiêm chủng mới
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Tạo kế hoạch tiêm chủng cho học sinh trong trường
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-neutral-900 dark:text-neutral-100">
            <FiInfo className="mr-2" />
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tên kế hoạch tiêm chủng *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Ví dụ: Tiêm vắc-xin cúm mùa 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Loại vắc-xin *
              </label>
              <select
                name="vaccineType"
                value={formData.vaccineType}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                required
              >
                <option value="">Chọn loại vắc-xin</option>
                {vaccineTypes.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
              {selectedVaccine && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {selectedVaccine.description} - Độ tuổi khuyến nghị:{" "}
                  {selectedVaccine.recommendedAge}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Mô tả chi tiết về kế hoạch tiêm chủng..."
              />
            </div>
          </div>
        </div>

        {/* Thời gian và địa điểm */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-neutral-900 dark:text-neutral-100">
            <FiCalendar className="mr-2" />
            Thời gian và địa điểm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ngày tiêm *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Phòng y tế trường"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Số ngày nhắc nhở trước
              </label>
              <input
                type="number"
                name="reminderDaysBefore"
                value={formData.reminderDaysBefore}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Số học sinh tối đa/phiên
              </label>
              <input
                type="number"
                name="maxStudentsPerSession"
                value={formData.maxStudentsPerSession}
                onChange={handleInputChange}
                min="10"
                max="100"
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Thời gian dự kiến (phút)
              </label>
              <input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                min="15"
                max="180"
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Chọn lớp học */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-neutral-900 dark:text-neutral-100">
            <FiUsers className="mr-2" />
            Chọn lớp học ({totalStudents} học sinh)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableGrades.map((grade) => (
              <div
                key={grade.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.targetGrades.includes(grade.id)
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                }`}
                onClick={() => handleGradeSelection(grade.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {grade.name}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {grade.studentCount} HS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết vắc-xin */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            Chi tiết vắc-xin
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Liều lượng
              </label>
              <input
                type="text"
                name="vaccinationDetails.dosage"
                value={formData.vaccinationDetails.dosage}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Ví dụ: 0.5ml"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nhà sản xuất
              </label>
              <input
                type="text"
                name="vaccinationDetails.manufacturer"
                value={formData.vaccinationDetails.manufacturer}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Tên nhà sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Số lô
              </label>
              <input
                type="text"
                name="vaccinationDetails.lotNumber"
                value={formData.vaccinationDetails.lotNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Số lô sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Hạn sử dụng
              </label>
              <input
                type="date"
                name="vaccinationDetails.expiryDate"
                value={formData.vaccinationDetails.expiryDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tác dụng phụ có thể xảy ra
              </label>
              <textarea
                name="vaccinationDetails.sideEffects"
                value={formData.vaccinationDetails.sideEffects}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Mô tả các tác dụng phụ có thể xảy ra..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Chống chỉ định
              </label>
              <textarea
                name="vaccinationDetails.contraindications"
                value={formData.vaccinationDetails.contraindications}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Các trường hợp không nên tiêm..."
              />
            </div>
          </div>
        </div>

        {/* Cài đặt bổ sung */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            Cài đặt bổ sung
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireParentConsent"
                name="requireParentConsent"
                checked={formData.requireParentConsent}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
              />
              <label
                htmlFor="requireParentConsent"
                className="ml-2 block text-sm text-neutral-900 dark:text-neutral-100"
              >
                Yêu cầu sự đồng ý của phụ huynh
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVoluntary"
                name="isVoluntary"
                checked={formData.isVoluntary}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
              />
              <label
                htmlFor="isVoluntary"
                className="ml-2 block text-sm text-neutral-900 dark:text-neutral-100"
              >
                Tiêm chủng tự nguyện
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ghi chú thêm
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                placeholder="Ghi chú thêm về kế hoạch tiêm chủng..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/nurse/vaccination")}
            className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <FiX className="mr-2 inline h-4 w-4" />
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <FiSave className="mr-2 inline h-4 w-4" />
                Tạo kế hoạch
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VaccinationPlanCreate;
