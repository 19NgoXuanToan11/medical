import React, { useState } from "react";
import { Link } from "react-router-dom";

const MedicationRequest = () => {
  const initialMedicationData = {
    medicationName: "",
    dosage: "",
    frequency: "once",
    startDate: "",
    endDate: "",
    timeOfDay: [],
    mealRelation: "",
    specialInstructions: "",
    medicationImage: null,
    prescriptionImage: null,
  };

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    studentClass: "",
    medications: [{ ...initialMedicationData }],
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentMedicationIndex, setCurrentMedicationIndex] = useState(0);

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMedicationChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedMedications = [...formData.medications];

    if (type === "checkbox") {
      if (checked) {
        updatedMedications[index] = {
          ...updatedMedications[index],
          timeOfDay: [...updatedMedications[index].timeOfDay, value],
        };
      } else {
        updatedMedications[index] = {
          ...updatedMedications[index],
          timeOfDay: updatedMedications[index].timeOfDay.filter(
            (time) => time !== value
          ),
        };
      }
    } else if (type === "file") {
      updatedMedications[index] = {
        ...updatedMedications[index],
        [name]: e.target.files[0],
      };
    } else {
      updatedMedications[index] = {
        ...updatedMedications[index],
        [name]: value,
      };
    }

    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { ...initialMedicationData }],
    });
    setCurrentMedicationIndex(formData.medications.length);
  };

  const removeMedication = (index) => {
    if (formData.medications.length <= 1) return;

    const updatedMedications = formData.medications.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      medications: updatedMedications,
    });

    if (currentMedicationIndex >= index) {
      setCurrentMedicationIndex(Math.max(0, currentMedicationIndex - 1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here would go API call to submit the medication request
    console.log("Submitting form data:", formData);
    setIsSubmitted(true);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const selectMedication = (index) => {
    setCurrentMedicationIndex(index);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-blue-500">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Yêu cầu đã được gửi thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Yêu cầu thuốc của bạn đã được gửi đến nhân viên y tế trường học.
              Bạn sẽ nhận được thông báo khi yêu cầu được xác nhận.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-700 mb-2">
                Mã theo dõi yêu cầu
              </h3>
              <p className="text-blue-800 font-bold text-xl">
                #MED{Math.floor(Math.random() * 1000000)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/parent/medication/history"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Xem lịch sử yêu cầu
              </Link>
              <Link
                to="/parent/dashboard"
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Gửi yêu cầu cấp thuốc
        </h1>
        <p className="text-gray-600">
          Hoàn thành mẫu đơn này để gửi yêu cầu thuốc cho con bạn tại trường
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <div
            className={`flex-1 text-center py-3 ${
              step === 1 ? "bg-blue-50 text-blue-600 font-medium" : "bg-gray-50"
            }`}
          >
            1. Thông tin học sinh
          </div>
          <div
            className={`flex-1 text-center py-3 ${
              step === 2 ? "bg-blue-50 text-blue-600 font-medium" : "bg-gray-50"
            }`}
          >
            2. Thông tin thuốc
          </div>
          <div
            className={`flex-1 text-center py-3 ${
              step === 3 ? "bg-blue-50 text-blue-600 font-medium" : "bg-gray-50"
            }`}
          >
            3. Lịch sử uống thuốc
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="studentName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleStudentInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ tên học sinh"
                  />
                </div>
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mã học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleStudentInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mã học sinh"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="studentClass"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentClass"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleStudentInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập lớp học sinh"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              {formData.medications.length > 1 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-700 mb-2">
                    Danh sách thuốc
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((med, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm ${
                          currentMedicationIndex === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => selectMedication(index)}
                      >
                        {med.medicationName || `Thuốc ${index + 1}`}
                        {formData.medications.length > 1 && (
                          <span
                            className="ml-2 text-xs hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMedication(index);
                            }}
                          >
                            ✕
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm flex items-center"
                      onClick={addMedication}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Thêm thuốc
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`medicationName-${currentMedicationIndex}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên thuốc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`medicationName-${currentMedicationIndex}`}
                    name="medicationName"
                    value={
                      formData.medications[currentMedicationIndex]
                        .medicationName
                    }
                    onChange={(e) =>
                      handleMedicationChange(e, currentMedicationIndex)
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên thuốc"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`dosage-${currentMedicationIndex}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Liều lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`dosage-${currentMedicationIndex}`}
                      name="dosage"
                      value={
                        formData.medications[currentMedicationIndex].dosage
                      }
                      onChange={(e) =>
                        handleMedicationChange(e, currentMedicationIndex)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: 1 viên, 5ml,..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`frequency-${currentMedicationIndex}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tần suất <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`frequency-${currentMedicationIndex}`}
                      name="frequency"
                      value={
                        formData.medications[currentMedicationIndex].frequency
                      }
                      onChange={(e) =>
                        handleMedicationChange(e, currentMedicationIndex)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="once">Một lần mỗi ngày</option>
                      <option value="twice">Hai lần mỗi ngày</option>
                      <option value="thrice">Ba lần mỗi ngày</option>
                      <option value="as_needed">Khi cần thiết</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`startDate-${currentMedicationIndex}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id={`startDate-${currentMedicationIndex}`}
                      name="startDate"
                      value={
                        formData.medications[currentMedicationIndex].startDate
                      }
                      onChange={(e) =>
                        handleMedicationChange(e, currentMedicationIndex)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`endDate-${currentMedicationIndex}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id={`endDate-${currentMedicationIndex}`}
                      name="endDate"
                      value={
                        formData.medications[currentMedicationIndex].endDate
                      }
                      onChange={(e) =>
                        handleMedicationChange(e, currentMedicationIndex)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Thời điểm uống thuốc <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="morning"
                        checked={formData.medications[
                          currentMedicationIndex
                        ].timeOfDay.includes("morning")}
                        onChange={(e) =>
                          handleMedicationChange(e, currentMedicationIndex)
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Buổi sáng</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="noon"
                        checked={formData.medications[
                          currentMedicationIndex
                        ].timeOfDay.includes("noon")}
                        onChange={(e) =>
                          handleMedicationChange(e, currentMedicationIndex)
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Buổi trưa</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="afternoon"
                        checked={formData.medications[
                          currentMedicationIndex
                        ].timeOfDay.includes("afternoon")}
                        onChange={(e) =>
                          handleMedicationChange(e, currentMedicationIndex)
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Buổi chiều</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="as_needed"
                        checked={formData.medications[
                          currentMedicationIndex
                        ].timeOfDay.includes("as_needed")}
                        onChange={(e) =>
                          handleMedicationChange(e, currentMedicationIndex)
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>Khi cần</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`mealRelation-${currentMedicationIndex}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thời điểm dùng thuốc <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`mealRelation-${currentMedicationIndex}`}
                    name="mealRelation"
                    value={
                      formData.medications[currentMedicationIndex].mealRelation
                    }
                    onChange={(e) =>
                      handleMedicationChange(e, currentMedicationIndex)
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Chọn thời điểm --</option>
                    <option value="before_meal">Trước khi ăn</option>
                    <option value="with_meal">Cùng với bữa ăn</option>
                    <option value="after_meal">Sau khi ăn</option>
                    <option value="regardless">Không phụ thuộc bữa ăn</option>
                  </select>
                </div>
              </div>

              {formData.medications.length === 1 && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    onClick={addMedication}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Thêm thuốc khác
                  </button>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              {formData.medications.length > 1 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-700 mb-2">
                    Chọn thuốc để cung cấp chi tiết
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((med, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm ${
                          currentMedicationIndex === index
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => selectMedication(index)}
                      >
                        {med.medicationName || `Thuốc ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor={`specialInstructions-${currentMedicationIndex}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hướng dẫn đặc biệt
                  </label>
                  <textarea
                    id={`specialInstructions-${currentMedicationIndex}`}
                    name="specialInstructions"
                    value={
                      formData.medications[currentMedicationIndex]
                        .specialInstructions
                    }
                    onChange={(e) =>
                      handleMedicationChange(e, currentMedicationIndex)
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Các lưu ý khi sử dụng thuốc (nếu có)"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh thuốc <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.medications[currentMedicationIndex]
                        .medicationImage ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(
                              formData.medications[currentMedicationIndex]
                                .medicationImage
                            )}
                            alt="Medication preview"
                            className="max-h-36 mb-2 rounded"
                          />
                          <span className="text-sm text-gray-500">
                            {
                              formData.medications[currentMedicationIndex]
                                .medicationImage.name
                            }
                          </span>
                          <button
                            type="button"
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                            onClick={() => {
                              const updatedMedications = [
                                ...formData.medications,
                              ];
                              updatedMedications[currentMedicationIndex] = {
                                ...updatedMedications[currentMedicationIndex],
                                medicationImage: null,
                              };
                              setFormData({
                                ...formData,
                                medications: updatedMedications,
                              });
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor={`medicationImage-${currentMedicationIndex}`}
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              Chọn hình ảnh
                            </label>
                            <input
                              id={`medicationImage-${currentMedicationIndex}`}
                              name="medicationImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleMedicationChange(
                                  e,
                                  currentMedicationIndex
                                )
                              }
                              required
                              className="sr-only"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF lên đến 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn thuốc (nếu có)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.medications[currentMedicationIndex]
                        .prescriptionImage ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(
                              formData.medications[currentMedicationIndex]
                                .prescriptionImage
                            )}
                            alt="Prescription preview"
                            className="max-h-36 mb-2 rounded"
                          />
                          <span className="text-sm text-gray-500">
                            {
                              formData.medications[currentMedicationIndex]
                                .prescriptionImage.name
                            }
                          </span>
                          <button
                            type="button"
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                            onClick={() => {
                              const updatedMedications = [
                                ...formData.medications,
                              ];
                              updatedMedications[currentMedicationIndex] = {
                                ...updatedMedications[currentMedicationIndex],
                                prescriptionImage: null,
                              };
                              setFormData({
                                ...formData,
                                medications: updatedMedications,
                              });
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor={`prescriptionImage-${currentMedicationIndex}`}
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              Chọn hình ảnh
                            </label>
                            <input
                              id={`prescriptionImage-${currentMedicationIndex}`}
                              name="prescriptionImage"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleMedicationChange(
                                  e,
                                  currentMedicationIndex
                                )
                              }
                              className="sr-only"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF lên đến 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Thông tin về thuốc và liều lượng cần được cung cấp chính
                        xác. Nhân viên y tế trường học sẽ xem xét trước khi chấp
                        nhận yêu cầu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                onClick={prevStep}
              >
                Quay lại
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={nextStep}
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Gửi yêu cầu
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationRequest;
