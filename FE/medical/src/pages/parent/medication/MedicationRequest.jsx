import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  medicationService,
  notificationService,
} from "../../../utils/api/medication/medicationService";

const MedicationRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: 0,
    studentName: "",
    staffId: 0,
    status: "pending",
  });

  const [medications, setMedications] = useState([
    {
      id: 1,
      medicineName: "",
      dosage: "",
      frequency: "",
      instructions: "",
      timeOfDay: "",
      medicationImagePath: "",
      prescriptionImagePath: "",
      medicationImage: null,
      prescriptionImage: null,
    },
  ]);

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicationChange = (medicationId, field, value) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId ? { ...med, [field]: value } : med
      )
    );
  };

  const handleFileChange = (medicationId, fileType, file) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medicationId ? { ...med, [fileType]: file } : med
      )
    );
  };

  const addMedication = () => {
    const newId = Math.max(...medications.map((m) => m.id)) + 1;
    setMedications((prev) => [
      ...prev,
      {
        id: newId,
        medicineName: "",
        dosage: "",
        frequency: "",
        instructions: "",
        timeOfDay: "",
        medicationImagePath: "",
        prescriptionImagePath: "",
        medicationImage: null,
        prescriptionImage: null,
      },
    ]);
  };

  const removeMedication = (medicationId) => {
    if (medications.length > 1) {
      setMedications((prev) => prev.filter((med) => med.id !== medicationId));
    }
  };

  const uploadImage = async (file, type) => {
    if (!file) return "";

    try {
      const result = await medicationService.uploadMedicationImage(file, type);
      if (result.success) {
        return (
          result.data.filePath ||
          result.data.url ||
          `uploads/${type}/${Date.now()}_${file.name}`
        );
      } else {
        console.error("Image upload failed:", result.message);
        // Fallback to mock URL for demo
        return `uploads/${type}/${Date.now()}_${file.name}`;
      }
    } catch (error) {
      console.error("Image upload error:", error);
      // Fallback to mock URL for demo
      return `uploads/${type}/${Date.now()}_${file.name}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process each medication
      const processedMedications = [];

      for (const medication of medications) {
        // Upload images if present
        const medicationImagePath = await uploadImage(
          medication.medicationImage,
          "medication"
        );
        const prescriptionImagePath = await uploadImage(
          medication.prescriptionImage,
          "prescription"
        );

        // Prepare data according to API schema
        const requestData = {
          medicineName: medication.medicineName,
          dosage: medication.dosage,
          frequency: medication.frequency,
          instructions: medication.instructions,
          timeOfDay: medication.timeOfDay,
          medicationImagePath: medicationImagePath,
          prescriptionImagePath: prescriptionImagePath,
          studentId: parseInt(formData.studentId) || 1, // Mock student ID
          studentName: formData.studentName,
          staffId: parseInt(formData.staffId) || 1, // Mock staff ID
          status: "pending",
        };

        // Make API call using medication service
        const result = await medicationService.createMedicationRequest(
          requestData
        );

        if (result.success) {
          processedMedications.push(requestData);
          // Send notification to nurse
          await notificationService.notifyNurseNewRequest(requestData);
        } else {
          throw new Error(
            result.message ||
              `Không thể gửi yêu cầu thuốc ${medication.medicineName}`
          );
        }
      }

      if (processedMedications.length > 0) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting medication request:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8">
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
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                Yêu cầu đã được gửi thành công!
              </h2>
              <p className="text-neutral-600 mb-6">
                Yêu cầu thuốc của bạn đã được gửi đến nhân viên y tế trường học.
                Bạn sẽ nhận được thông báo khi yêu cầu được xác nhận.
              </p>
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-primary-700 mb-2">
                  Mã theo dõi yêu cầu
                </h3>
                <p className="text-primary-800 font-bold text-xl">
                  #MED{Math.floor(Math.random() * 1000000)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="h-5 w-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    Quy trình tiếp theo
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  <p>1. Nhân viên y tế sẽ xem xét yêu cầu của bạn</p>
                  <p>2. Bạn sẽ nhận được thông báo về quyết định phê duyệt</p>
                  <p>
                    3. Nếu được phê duyệt, thuốc sẽ được cấp theo lịch trình
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/parent/medication/history"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  Xem lịch sử yêu cầu
                </Link>
                <Link
                  to="/parent/notifications"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Xem thông báo
                </Link>
                <Link
                  to="/parent/dashboard"
                  className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md transition-colors"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Gửi yêu cầu cấp thuốc
          </h1>
          <p className="text-black text-sm">
            Hoàn thành mẫu đơn này để gửi yêu cầu thuốc cho con bạn tại trường
          </p>
        </div>

        <div className="flex border-b">
          <div
            className={`flex-1 text-center py-3 ${
              step === 1
                ? "bg-primary-50 text-primary-600 font-medium"
                : "bg-neutral-50"
            }`}
          >
            1. Thông tin học sinh
          </div>
          <div
            className={`flex-1 text-center py-3 ${
              step === 2
                ? "bg-primary-50 text-primary-600 font-medium"
                : "bg-neutral-50"
            }`}
          >
            2. Thông tin thuốc
          </div>
          <div
            className={`flex-1 text-center py-3 ${
              step === 3
                ? "bg-primary-50 text-primary-600 font-medium"
                : "bg-neutral-50"
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
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Họ và tên học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập họ tên học sinh"
                  />
                </div>
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Mã học sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập mã học sinh"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-neutral-800">
                  Thông tin thuốc
                </h3>
                <button
                  type="button"
                  onClick={addMedication}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              {medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-neutral-700">
                      Thuốc #{index + 1}
                    </h4>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(medication.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Xóa thuốc"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Tên thuốc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.medicineName}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "medicineName",
                            e.target.value
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập tên thuốc"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Liều lượng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              medication.id,
                              "dosage",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Ví dụ: 1 viên, 5ml,..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Tần suất <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) =>
                            handleMedicationChange(
                              medication.id,
                              "frequency",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Ví dụ: 3 lần/ngày"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Thời điểm dùng thuốc{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={medication.timeOfDay}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "timeOfDay",
                            e.target.value
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">-- Chọn thời điểm --</option>
                        <option value="morning">Buổi sáng</option>
                        <option value="afternoon">Buổi chiều</option>
                        <option value="evening">Buổi tối</option>
                        <option value="as_needed">Khi cần thiết</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Hướng dẫn đặc biệt
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "instructions",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Các lưu ý khi sử dụng thuốc (nếu có)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-neutral-800">
                Hình ảnh thuốc
              </h3>

              {medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
                >
                  <h4 className="text-md font-medium text-neutral-700 mb-4">
                    Hình ảnh cho{" "}
                    {medication.medicineName || `Thuốc #${index + 1}`}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Hình ảnh thuốc <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        {medication.medicationImage ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={URL.createObjectURL(
                                medication.medicationImage
                              )}
                              alt="Medication preview"
                              className="max-h-36 mb-2 rounded"
                            />
                            <span className="text-sm text-neutral-500">
                              {medication.medicationImage.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleFileChange(
                                  medication.id,
                                  "medicationImage",
                                  null
                                )
                              }
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="mx-auto h-12 w-12 text-neutral-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex justify-center mt-2">
                              <label
                                htmlFor={`medicationImage-${medication.id}`}
                                className="cursor-pointer"
                              >
                                <span className="text-sm text-primary-600 hover:text-primary-800">
                                  Chọn hình ảnh
                                </span>
                              </label>
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              PNG, JPG, GIF lên đến 10MB
                            </p>
                          </div>
                        )}
                        <input
                          id={`medicationImage-${medication.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              medication.id,
                              "medicationImage",
                              e.target.files[0]
                            )
                          }
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Đơn thuốc (nếu có)
                      </label>
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        {medication.prescriptionImage ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={URL.createObjectURL(
                                medication.prescriptionImage
                              )}
                              alt="Prescription preview"
                              className="max-h-36 mb-2 rounded"
                            />
                            <span className="text-sm text-neutral-500">
                              {medication.prescriptionImage.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleFileChange(
                                  medication.id,
                                  "prescriptionImage",
                                  null
                                )
                              }
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="mx-auto h-12 w-12 text-neutral-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex justify-center mt-2">
                              <label
                                htmlFor={`prescriptionImage-${medication.id}`}
                                className="cursor-pointer"
                              >
                                <span className="text-sm text-primary-600 hover:text-primary-800">
                                  Chọn hình ảnh
                                </span>
                              </label>
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">
                              PNG, JPG, GIF lên đến 10MB
                            </p>
                          </div>
                        )}
                        <input
                          id={`prescriptionImage-${medication.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              medication.id,
                              "prescriptionImage",
                              e.target.files[0]
                            )
                          }
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
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
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-md hover:bg-neutral-200"
                onClick={prevStep}
                disabled={isLoading}
              >
                Quay lại
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={nextStep}
                disabled={isLoading}
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationRequest;
