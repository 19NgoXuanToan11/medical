<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VaccinationCreate from "./VaccinationCreate";
import HealthCheckCreate from "./HealthCheckCreate";

const HealthServiceCreate = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState(""); // vaccination or health_check

  // Nếu đã chọn loại dịch vụ, hiển thị component tương ứng
  if (serviceType === "vaccination") {
    return <VaccinationCreate onBack={() => setServiceType("")} />;
  }

  if (serviceType === "health_check") {
    return <HealthCheckCreate onBack={() => setServiceType("")} />;
  }

  // Hiển thị màn hình chọn loại dịch vụ
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/nurse/health-services")}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo Dịch vụ Y tế mới
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Vui lòng chọn loại dịch vụ y tế mà bạn muốn tạo lịch
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Chọn loại dịch vụ y tế
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Lựa chọn dịch vụ phù hợp với nhu cầu chăm sóc sức khỏe học sinh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vaccination Option */}
            <button
              type="button"
              onClick={() => setServiceType("vaccination")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300">
                  <FiShield className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Tiêm chủng
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch tiêm phòng các loại vắc-xin cho học sinh theo độ tuổi và chương trình y tế học đường
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Phòng bệnh
                    </span>
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Theo lứa tuổi
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Health Check Option */}
            <button
              type="button"
              onClick={() => setServiceType("health_check")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-green-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-green-100 group-hover:text-green-500 transition-all duration-300">
                  <FiActivity className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Khám sức khỏe định kỳ
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch khám sức khỏe tổng quát và chuyên khoa cho học sinh theo quy định của Bộ Y tế
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Tổng quát
                    </span>
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Định kỳ
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
=======
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> 19ec55e (change the look of vaccinations and routine medical checkups)
import { useNavigate } from "react-router-dom";
import { FiActivity, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VaccinationCreate from "./VaccinationCreate";
import HealthCheckCreate from "./HealthCheckCreate";

const HealthServiceCreate = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState(""); // vaccination or health_check

  // Nếu đã chọn loại dịch vụ, hiển thị component tương ứng
  if (serviceType === "vaccination") {
    return <VaccinationCreate onBack={() => setServiceType("")} />;
  }

  if (serviceType === "health_check") {
    return <HealthCheckCreate onBack={() => setServiceType("")} />;
  }

  // Hiển thị màn hình chọn loại dịch vụ
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/nurse/health-services")}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo Dịch vụ Y tế mới
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Vui lòng chọn loại dịch vụ y tế mà bạn muốn tạo lịch
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Chọn loại dịch vụ y tế
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Lựa chọn dịch vụ phù hợp với nhu cầu chăm sóc sức khỏe học sinh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vaccination Option */}
            <button
              type="button"
              onClick={() => setServiceType("vaccination")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300">
                  <FiShield className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Tiêm chủng
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch tiêm phòng các loại vắc-xin cho học sinh theo độ tuổi và chương trình y tế học đường
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Phòng bệnh
                    </span>
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Theo lứa tuổi
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Health Check Option */}
            <button
              type="button"
              onClick={() => setServiceType("health_check")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-green-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-green-100 group-hover:text-green-500 transition-all duration-300">
                  <FiActivity className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Khám sức khỏe định kỳ
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch khám sức khỏe tổng quát và chuyên khoa cho học sinh theo quy định của Bộ Y tế
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Tổng quát
                    </span>
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Định kỳ
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
<<<<<<< HEAD

          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={`Nhập tiêu đề ${
                    serviceType === "vaccination"
                      ? "tiêm chủng"
                      : "khám sức khỏe"
                  }`}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Ngày thực hiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Mô tả chi tiết
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder={`Mô tả chi tiết về ${
                  serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
                } này...`}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Target Grades */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Lớp học mục tiêu
            </h2>
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Chọn các lớp tham gia{" "}
                {serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"}
              </p>
            </div>

            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4 content-start">
              {availableGrades.map((grade) => (
                <label
                  key={grade.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.targetGrades.includes(grade.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-neutral-200 dark:border-neutral-600 hover:border-primary-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.targetGrades.includes(grade.id)}
                    onChange={() => handleGradeSelection(grade.id)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium ${
                        formData.targetGrades.includes(grade.id)
                          ? "text-primary-800 dark:text-primary-200"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {grade.name}
                    </span>
                    <p
                      className={`text-xs ${
                        formData.targetGrades.includes(grade.id)
                          ? "text-primary-600 dark:text-primary-300"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {grade.studentCount} học sinh
                    </p>
                  </div>
                  {formData.targetGrades.includes(grade.id) && (
                    <FiUsers className="w-4 h-4 text-primary-600" />
                  )}
                </label>
              ))}
            </div>

            {formData.targetGrades.length > 0 && (
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-primary-800 dark:text-primary-200">
                    <FiInfo className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Tổng số học sinh: {calculateTotalStudents()} học sinh
                    </span>
                  </div>
                  <div className="text-xs text-primary-600 dark:text-primary-300">
                    Dự kiến chi phí:{" "}
                    {calculateEstimatedCost().toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service-Specific Configuration */}
          {serviceType === "vaccination" && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2 text-blue-600" />
                Cấu hình tiêm chủng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Loại vắc-xin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vaccineType"
                    value={formData.vaccineType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    required
                  >
                    <option value="">Chọn loại vắc-xin</option>
                    {vaccineTypes.map((vaccine) => (
                      <option key={vaccine.id} value={vaccine.id}>
                        {vaccine.name} - {vaccine.recommendedAges.join(", ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Liều lượng
                  </label>
                  <input
                    type="text"
                    name="vaccinationDetails.dosage"
                    value={formData.vaccinationDetails.dosage}
                    onChange={handleInputChange}
                    placeholder="VD: 0.5ml"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tác dụng phụ có thể xảy ra
                  </label>
                  <textarea
                    name="vaccinationDetails.sideEffects"
                    value={formData.vaccinationDetails.sideEffects}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả các tác dụng phụ có thể xảy ra sau khi tiêm..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Chống chỉ định
                  </label>
                  <textarea
                    name="vaccinationDetails.contraindications"
                    value={formData.vaccinationDetails.contraindications}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Các trường hợp không nên tiêm (dị ứng, bệnh lý, thuốc đang sử dụng...)..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/nurse/health-services")}
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || formData.targetGrades.length === 0}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Tạo {serviceType === "vaccination" ? "lịch tiêm chủng" : "lịch khám sức khỏe"}
              </>
            )}
          </button>
        </div>
      </form>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
          {serviceType === "health_check" && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                Cấu hình khám sức khỏe
              </h2>

              <div className="mb-6 flex-grow">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Hạng mục kiểm tra <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthCheckItems.map((item) => (
                    <label
                      key={item}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        formData.checkItems.includes(item)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-neutral-200 dark:border-neutral-600 hover:border-green-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.checkItems.includes(item)}
                        onChange={() => handleCheckItemToggle(item)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <span
                          className={`text-sm font-medium ${
                            formData.checkItems.includes(item)
                              ? "text-green-800 dark:text-green-200"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                      {formData.checkItems.includes(item) && (
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Quy trình xử lý bất thường
                  </label>
                  <textarea
                    name="abnormalityProtocol"
                    value={formData.abnormalityProtocol}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả quy trình xử lý khi phát hiện bất thường (thông báo phụ huynh, chuyển viện, theo dõi...)..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview and Summary */}
          {formData.targetGrades.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiInfo className="w-5 h-5 mr-2 text-blue-600" />
                Tóm tắt kế hoạch
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Tổng học sinh
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {calculateTotalStudents()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiClock className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Thời gian
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {formData.estimatedDuration}m
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Số phiên
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {Math.ceil(
                          calculateTotalStudents() /
                            formData.maxStudentsPerSession
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Chi phí dự kiến
                      </p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {calculateEstimatedCost().toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Requirements */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                  Yêu cầu tài nguyên:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Nhân sự cần thiết:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {calculateResourceRequirements().staff} người
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Thời gian thực hiện:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {Math.ceil(
                        (calculateResourceRequirements().timeSlots *
                          formData.estimatedDuration) /
                          60
                      )}{" "}
                      giờ
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Cần phê duyệt:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {calculateTotalStudents() > 100 ||
                      serviceType === "vaccination"
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings and Recommendations */}
              {checkSchedulingConflicts().length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Cảnh báo và đề xuất:
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        {checkSchedulingConflicts().map((conflict, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {conflict.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/nurse/health-services")}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <FiX className="w-4 h-4 mr-2 inline" />
                Hủy
              </button>

              <button
                type="button"
                onClick={() => {
                  const data = {
                    ...formData,
                    type: serviceType,
                    totalStudents: calculateTotalStudents(),
                    estimatedCost: calculateEstimatedCost(),
                    resourceRequirements: calculateResourceRequirements(),
                  };
                  localStorage.setItem(
                    "healthServiceDraft",
                    JSON.stringify(data)
                  );
                  alert("Đã lưu bản nháp!");
                }}
                disabled={loading}
                className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-900/20 transition-colors duration-200 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4 mr-2 inline" />
                Lưu nháp
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  formData.targetGrades.length === 0 ||
                  !formData.title.trim() ||
                  !formData.scheduledDate
                }
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Tạo{" "}
                    {serviceType === "vaccination"
                      ? "kế hoạch tiêm chủng"
                      : "lịch khám sức khỏe"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
=======
        </div>
>>>>>>> 19ec55e (change the look of vaccinations and routine medical checkups)
      </div>
>>>>>>> 512000a (edit nurse role medical service management interface)
    </div>
  );
};

export default HealthServiceCreate;
