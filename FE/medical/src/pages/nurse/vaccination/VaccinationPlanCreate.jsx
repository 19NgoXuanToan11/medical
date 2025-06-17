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
    } finally {
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
        <h1 className="text-2xl font-bold text-gray-800">
          Tạo kế hoạch tiêm chủng mới
        </h1>
        <p className="text-gray-600 mt-1">
          Tạo kế hoạch tiêm chủng cho học sinh trong trường
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiInfo className="mr-2" />
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên kế hoạch tiêm chủng *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Tiêm vắc-xin cúm mùa 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại vắc-xin *
              </label>
              <select
                name="vaccineType"
                value={formData.vaccineType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                <p className="text-sm text-gray-500 mt-1">
                  {selectedVaccine.description} - Độ tuổi khuyến nghị:{" "}
                  {selectedVaccine.recommendedAge}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả chi tiết về kế hoạch tiêm chủng..."
              />
            </div>
          </div>
        </div>

        {/* Thời gian và địa điểm */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiCalendar className="mr-2" />
            Thời gian và địa điểm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tiêm *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phòng y tế trường"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số ngày nhắc nhở trước
              </label>
              <input
                type="number"
                name="reminderDaysBefore"
                value={formData.reminderDaysBefore}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số học sinh tối đa/phiên
              </label>
              <input
                type="number"
                name="maxStudentsPerSession"
                value={formData.maxStudentsPerSession}
                onChange={handleInputChange}
                min="10"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian dự kiến (phút)
              </label>
              <input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                min="15"
                max="180"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Chọn lớp học */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiUsers className="mr-2" />
            Chọn lớp học ({totalStudents} học sinh)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableGrades.map((grade) => (
              <div
                key={grade.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.targetGrades.includes(grade.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleGradeSelection(grade.id)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.targetGrades.includes(grade.id)}
                    onChange={() => handleGradeSelection(grade.id)}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-medium">{grade.name}</p>
                    <p className="text-sm text-gray-500">
                      {grade.studentCount} học sinh
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết vắc-xin */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết vắc-xin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liều lượng
              </label>
              <input
                type="text"
                name="vaccinationDetails.dosage"
                value={formData.vaccinationDetails.dosage}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: 0.5ml"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhà sản xuất
              </label>
              <input
                type="text"
                name="vaccinationDetails.manufacturer"
                value={formData.vaccinationDetails.manufacturer}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tên nhà sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lô
              </label>
              <input
                type="text"
                name="vaccinationDetails.lotNumber"
                value={formData.vaccinationDetails.lotNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Số lô sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hạn sử dụng
              </label>
              <input
                type="date"
                name="vaccinationDetails.expiryDate"
                value={formData.vaccinationDetails.expiryDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tác dụng phụ có thể xảy ra
              </label>
              <textarea
                name="vaccinationDetails.sideEffects"
                value={formData.vaccinationDetails.sideEffects}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả các tác dụng phụ có thể xảy ra..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chống chỉ định
              </label>
              <textarea
                name="vaccinationDetails.contraindications"
                value={formData.vaccinationDetails.contraindications}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Các trường hợp không nên tiêm..."
              />
            </div>
          </div>
        </div>

        {/* Cài đặt bổ sung */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Cài đặt bổ sung</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVoluntary"
                checked={formData.isVoluntary}
                onChange={handleInputChange}
                className="mr-3"
              />
              <label className="text-sm font-medium text-gray-700">
                Tiêm chủng tự nguyện (không bắt buộc)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="requireParentConsent"
                checked={formData.requireParentConsent}
                onChange={handleInputChange}
                className="mr-3"
              />
              <label className="text-sm font-medium text-gray-700">
                Yêu cầu sự đồng ý của phụ huynh
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú thêm
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ghi chú thêm về kế hoạch tiêm chủng..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/nurse/vaccination")}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiX className="inline mr-2" />
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <FiSave className="inline mr-2" />
                Tạo kế hoạch
              </>
            )}
          </button>
        </div>
      </form>

      {/* Warning */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex">
          <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Lưu ý</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Sau khi tạo kế hoạch, hệ thống sẽ tự động gửi thông báo đến phụ
              huynh của các học sinh được chọn. Vui lòng kiểm tra kỹ thông tin
              trước khi lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationPlanCreate;
