import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiCalendar,
  FiClock,
  FiX,
  FiPlusCircle,
  FiMinusCircle,
} from "react-icons/fi";

const VaccinationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [newGrade, setNewGrade] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call to get available grades
    setTimeout(() => {
      setGradeList([
        "1A",
        "1B",
        "1C",
        "2A",
        "2B",
        "2C",
        "3A",
        "3B",
        "3C",
        "4A",
        "4B",
        "4C",
        "5A",
        "5B",
        "5C",
        "6A",
        "6B",
        "6C",
        "7A",
        "7B",
        "7C",
        "8A",
        "8B",
        "8C",
        "9A",
        "9B",
        "9C",
      ]);
    }, 500);

    // Simulate API call to get vaccination data
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
      };

      setFormData(mockVaccination);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      });
    }
  };

  const handleAddGrade = () => {
    if (newGrade && !formData.grades.includes(newGrade)) {
      setFormData({
        ...formData,
        grades: [...formData.grades, newGrade],
      });
      setNewGrade("");
    }
  };

  const handleRemoveGrade = (grade) => {
    setFormData({
      ...formData,
      grades: formData.grades.filter((g) => g !== grade),
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Vui lòng nhập tên tiêm chủng";
    }

    if (!formData.vaccineInfo.trim()) {
      errors.vaccineInfo = "Vui lòng nhập thông tin vắc-xin";
    }

    if (!formData.scheduledDate) {
      errors.scheduledDate = "Vui lòng chọn ngày tiêm chủng";
    }

    if (!formData.startTime) {
      errors.startTime = "Vui lòng nhập thời gian bắt đầu";
    }

    if (!formData.endTime) {
      errors.endTime = "Vui lòng nhập thời gian kết thúc";
    }

    if (!formData.location.trim()) {
      errors.location = "Vui lòng nhập địa điểm tiêm chủng";
    }

    if (!formData.healthcareProvider.trim()) {
      errors.healthcareProvider = "Vui lòng nhập đơn vị thực hiện";
    }

    if (formData.grades.length === 0) {
      errors.grades = "Vui lòng chọn ít nhất một lớp tham gia";
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
      navigate(`/nurse/vaccination/${id}`);
    }, 1500);
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
            to={`/nurse/vaccination/${id}`}
            className="mr-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Chỉnh sửa tiêm chủng
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Tên tiêm chủng <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.title
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vaccineInfo"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Loại vắc-xin <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="vaccineInfo"
                  name="vaccineInfo"
                  value={formData.vaccineInfo}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.vaccineInfo
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                />
                {validationErrors.vaccineInfo && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vaccineInfo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="planning">Lên kế hoạch</option>
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">
              Thời gian và địa điểm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Ngày tiêm chủng <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      validationErrors.scheduledDate
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    } pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {validationErrors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.scheduledDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Thời gian bắt đầu <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      validationErrors.startTime
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    } pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                  />
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {validationErrors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Thời gian kết thúc <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      validationErrors.endTime
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    } pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                  />
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {validationErrors.endTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.endTime}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Địa điểm <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.location
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                />
                {validationErrors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="healthcareProvider"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Đơn vị thực hiện <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="healthcareProvider"
                  name="healthcareProvider"
                  value={formData.healthcareProvider}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    validationErrors.healthcareProvider
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100`}
                />
                {validationErrors.healthcareProvider && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.healthcareProvider}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">
              Lớp tham gia
            </h2>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Chọn lớp tham gia <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.grades.map((grade) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md"
                  >
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {grade}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGrade(grade)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiMinusCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="">Chọn lớp</option>
                  {gradeList
                    .filter((grade) => !formData.grades.includes(grade))
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddGrade}
                  disabled={!newGrade}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md disabled:opacity-50 transition-colors"
                >
                  <FiPlusCircle className="h-4 w-4" />
                </button>
              </div>
              {validationErrors.grades && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.grades}
                </p>
              )}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">
              Thông tin bổ sung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="vaccinationMethod"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Phương pháp tiêm
                </label>
                <input
                  type="text"
                  id="vaccinationMethod"
                  name="vaccinationMethod"
                  value={formData.vaccinationMethod}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label
                  htmlFor="sideEffects"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Tác dụng phụ
                </label>
                <textarea
                  id="sideEffects"
                  name="sideEffects"
                  value={formData.sideEffects}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label
                  htmlFor="contraindications"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Chống chỉ định
                </label>
                <textarea
                  id="contraindications"
                  name="contraindications"
                  value={formData.contraindications}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Ghi chú
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            to={`/nurse/vaccination/${id}`}
            className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <FiX className="mr-2 inline h-4 w-4" />
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2 inline h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VaccinationEdit;
