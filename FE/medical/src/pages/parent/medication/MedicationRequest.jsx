import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  medicationService,
  notificationService,
} from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";

const MedicationRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  const [formData, setFormData] = useState({
    studentCode: "",
    className: "",
    parentID: user?.id || 0, // Gán parent ID từ user đã đăng nhập
    status: "pending",
    date: "",
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
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch students của parent
  const fetchStudentsByParent = async (parentId) => {
    if (!parentId) return;

    setLoadingStudents(true);
    try {
      const API_URL = "https://localhost:7111/api";

      // Try to get students by parent first
      let response = await fetch(`${API_URL}/Student/parent/${parentId}`);

      if (response.ok) {
        const data = await response.json();
        setStudents(data || []);
      } else if (response.status === 404) {
        // If endpoint doesn't exist, try alternative approach
        // Get Student_Parent relationships first
        const studentParentResponse = await fetch(
          `${API_URL}/Student_Parent/parent/${parentId}`
        );

        if (studentParentResponse.ok) {
          const relationships = await studentParentResponse.json();

          // Then get student details for each relationship
          const studentPromises = relationships.map(async (rel) => {
            const studentResponse = await fetch(
              `${API_URL}/Student/code/${rel.studentCode}`
            );
            if (studentResponse.ok) {
              return await studentResponse.json();
            }
            return null;
          });

          const studentDetails = await Promise.all(studentPromises);
          setStudents(studentDetails.filter(Boolean));
        } else {
          // Final fallback: get all students and filter by parentId
          const allStudentsResponse = await fetch(`${API_URL}/Student`);
          if (allStudentsResponse.ok) {
            const allStudents = await allStudentsResponse.json();
            const parentStudents = allStudents.filter(
              (student) => student.parentId === parentId
            );
            setStudents(parentStudents);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      // Mock data for development/testing
      setStudents([
        {
          studentCode: "STU001",
          firstName: "Nguyễn",
          lastName: "Văn An",
          className: "10A1",
          parentId: parentId,
        },
      ]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Cập nhật parentID khi user thay đổi (sau khi đăng nhập)
  useEffect(() => {
    if (user?.id) {
      console.log("User data loaded:", user); // Debug log
      setFormData((prev) => ({
        ...prev,
        parentID: user.id,
      }));

      // Fetch students của parent này
      fetchStudentsByParent(user.id);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle student selection
    if (name === "studentCode") {
      const selectedStudent = students.find(
        (student) => student.studentCode === value
      );
      setFormData((prev) => ({
        ...prev,
        studentCode: value,
        className: selectedStudent ? selectedStudent.className : "",
      }));
      return;
    }

    // Allow typing for date field, but limit characters
    if (name === "date") {
      // Only allow numbers and dashes, max 10 characters (yyyy-mm-dd)
      const cleanValue = value.replace(/[^\d-]/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
      return;
    }

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

    // Validate date format before submitting
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(formData.date)) {
      alert(
        "Vui lòng nhập ngày đúng định dạng: yyyy-mm-dd (ví dụ: 2024-01-15)"
      );
      return;
    }

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

        // Prepare medication item according to API schema
        const medicationItem = {
          medicineName: medication.medicineName,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timeOfDay: medication.timeOfDay,
          instructions: medication.instructions,
        };

        processedMedications.push(medicationItem);
      }

      // Prepare request data according to API schema
      const requestData = {
        studentCode: formData.studentCode,
        className: formData.className,
        parentID: user?.id || parseInt(formData.parentID) || 1, // Ưu tiên lấy từ user đã đăng nhập
        status: formData.status,
        startDate: formData.date,
        endDate: formData.date,
        medicineRequestItems: processedMedications,
      };

      console.log(
        "Sending medication request with parentID:",
        requestData.parentID
      ); // Debug log
      console.log("Full request data:", requestData); // Debug log

      // Make API call using medication service
      const result = await medicationService.createMedicationRequest(
        requestData
      );

      if (result.success) {
        setIsSubmitted(true);
        // Send notification to nurse
        await notificationService.notifyNurseNewRequest(requestData);
      } else {
        throw new Error(result.message || "Không thể gửi yêu cầu thuốc");
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
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="studentCode"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Chọn học sinh <span className="text-red-500">*</span>
                  </label>
                  {loadingStudents ? (
                    <div className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500">
                      Đang tải danh sách học sinh...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-yellow-50 text-yellow-700">
                      Không có học sinh nào được liên kết với tài khoản này. Vui
                      lòng liên hệ nhà trường để cập nhật thông tin.
                    </div>
                  ) : (
                    <select
                      id="studentCode"
                      name="studentCode"
                      value={formData.studentCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">-- Chọn học sinh --</option>
                      {students.map((student) => (
                        <option
                          key={student.studentCode}
                          value={student.studentCode}
                        >
                          {student.studentCode} - {student.firstName}{" "}
                          {student.lastName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="className"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Lớp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    readOnly
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-600"
                    placeholder="Lớp sẽ tự động điền khi chọn học sinh"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  pattern="\d{4}-\d{2}-\d{2}"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="2024-01-15"
                />
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

            {step < 2 ? (
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
