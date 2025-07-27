import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  medicationService,
  notificationService,
} from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import { toast } from "react-toastify";
import StudentInfoStep from "./components/StudentInfoStep";
import MedicationInfoStep from "./components/MedicationInfoStep";

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
      dosageUnit: "viên", // đơn vị liều lượng
      frequency: "1", // số lần trong ngày
      timeOfDay: [], // array chứa các thời điểm: morning, afternoon, as_needed
      instructions: "",
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

  // Fetch students của parent từ API Parent/{id}
  const fetchStudentsByParent = async (parentId) => {
    if (!parentId) return;

    setLoadingStudents(true);
    try {
      const API_URL = "https://localhost:7111/api";

      // Sử dụng API Parent/{id} để lấy thông tin parent và students
      const response = await fetch(`${API_URL}/Parent/${parentId}`);

      if (response.ok) {
        const parentData = await response.json();

        // Lấy danh sách students từ response
        const studentsList = parentData.students || [];

        // Students đã có className từ API, không cần mapping
        const mappedStudents = studentsList;

        setStudents(mappedStudents);
      } else {
        console.error("Failed to fetch parent data:", response.status);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students from Parent API:", error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Cập nhật parentID khi user thay đổi (sau khi đăng nhập)
  useEffect(() => {
    if (user?.id) {
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

    // Allow typing for date field with y/d/m format and auto-format

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicationChange = (medicationId, field, value) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medicationId) {
          const updatedMed = { ...med, [field]: value };

          // Nếu thay đổi tần suất, kiểm tra và điều chỉnh thời điểm đã chọn
          if (field === "frequency") {
            const maxTimeSlots = getMaxTimeSlots(value);
            if (
              value !== "as_needed" &&
              updatedMed.timeOfDay.length > maxTimeSlots
            ) {
              // Giữ lại những thời điểm đầu tiên theo thứ tự ưu tiên
              const priorityOrder = [
                "morning",
                "noon",
                "afternoon",
                "as_needed",
              ];
              const sortedTimeOfDay = updatedMed.timeOfDay.sort(
                (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b)
              );
              updatedMed.timeOfDay = sortedTimeOfDay.slice(0, maxTimeSlots);
            }
          }

          return updatedMed;
        }
        return med;
      })
    );
  };

  // Xử lý checkbox cho thời điểm dùng thuốc với validation
  const handleTimeOfDayChange = (medicationId, timeValue, isChecked) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medicationId) {
          let newTimeOfDay = [...med.timeOfDay];

          // Lấy giới hạn số thời điểm dựa trên tần suất
          const maxTimeSlots = getMaxTimeSlots(med.frequency);

          if (isChecked) {
            // Kiểm tra xem có vượt quá giới hạn không
            if (
              newTimeOfDay.length >= maxTimeSlots &&
              med.frequency !== "as_needed"
            ) {
              // Không cho phép thêm nếu đã đạt giới hạn
              return med;
            }
            // Thêm thời điểm nếu chưa có
            if (!newTimeOfDay.includes(timeValue)) {
              newTimeOfDay.push(timeValue);
            }
          } else {
            // Xóa thời điểm
            newTimeOfDay = newTimeOfDay.filter((time) => time !== timeValue);
          }
          return { ...med, timeOfDay: newTimeOfDay };
        }
        return med;
      })
    );
  };

  // Hàm lấy số thời điểm tối đa dựa trên tần suất
  const getMaxTimeSlots = (frequency) => {
    switch (frequency) {
      case "1":
        return 1;
      case "2":
        return 2;
      case "3":
        return 3;
      case "4":
        return 4;
      case "khi cần thiết":
        return 4; // Không giới hạn cho khi cần thiết
      default:
        return 1;
    }
  };

  // Kiểm tra xem có thể chọn thêm thời điểm không
  const canSelectTimeSlot = (medication, timeValue) => {
    if (medication.frequency === "khi cần thiết") return true;
    if (medication.timeOfDay.includes(timeValue)) return true;

    const maxTimeSlots = getMaxTimeSlots(medication.frequency);
    return medication.timeOfDay.length < maxTimeSlots;
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
        dosageUnit: "viên",
        frequency: "1",
        timeOfDay: [],
        instructions: "",
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

        // Prepare medication item according to API schema
        const medicationItem = {
          medicineName: medication.medicineName,
          dosage: medication.dosage,
          dosageUnit: medication.dosageUnit, // Include dosage unit
          frequency: medication.frequency,
          timeOfDay: medication.timeOfDay.join(", "), // Convert array to string
          instructions: medication.instructions,
        };

        processedMedications.push(medicationItem);
      }

      // Convert date from y/m/d to yyyy-mm-dd format for API
      const convertDateFormat = (dateString) => {
        if (dateString.includes("/")) {
          const [year, month, day] = dateString.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateString;
      };

      // Prepare request data according to API schema
      const requestData = {
        studentCode: formData.studentCode,
        className: formData.className,
        parentID: user?.id || parseInt(formData.parentID) || 1, // Ưu tiên lấy từ user đã đăng nhập
        status: formData.status,
        date: convertDateFormat(formData.date),
        medicineRequestItems: processedMedications,
      };

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
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra xem bước 1 đã hoàn thành chưa
  const isStep1Valid = () => {
    return (
      formData.studentCode.trim() !== "" &&
      formData.className.trim() !== "" &&
      formData.date.trim() !== "" &&
      isValidDate(formData.date) && // Check if date is actually valid
      !isPastDate(formData.date) // Check if date is not in the past
    );
  };

  // Kiểm tra xem tất cả thuốc có hợp lệ không (bao gồm validation frequency và time slots)
  const isStep2Valid = () => {
    return medications.every((medication) => {
      // Kiểm tra thông tin cơ bản
      if (
        !medication.medicineName.trim() ||
        !medication.dosage ||
        !medication.frequency ||
        medication.timeOfDay.length === 0
      ) {
        return false;
      }

      // Kiểm tra validation frequency và time slots
      if (medication.frequency !== "as_needed") {
        const requiredTimeSlots = getMaxTimeSlots(medication.frequency);
        if (medication.timeOfDay.length !== requiredTimeSlots) {
          return false;
        }
      }

      return true;
    });
  };

  // Kiểm tra ngày có hợp lệ không - định dạng y/m/d
  const isValidDate = (dateString) => {
    if (!dateString || !dateString.includes("/")) return false;

    const parts = dateString.split("/");
    if (parts.length !== 3) return false;

    const [year, month, day] = parts.map(Number);

    // Kiểm tra các giá trị số hợp lệ
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Kiểm tra ngày có tồn tại trong tháng không
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // Kiểm tra có phải ngày trong quá khứ không
  const isPastDate = (dateString) => {
    if (!isValidDate(dateString)) return false;

    const [year, month, day] = dateString.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  };

  const nextStep = () => {
    if (step === 1 && !isStep1Valid()) {
      return; // Không cho phép chuyển sang bước 2 nếu chưa điền đủ thông tin
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-400"
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yêu cầu đã được gửi thành công!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Yêu cầu thuốc của bạn đã được gửi đến nhân viên y tế trường học.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/parent/medication/history"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  Xem lịch sử yêu cầu
                </Link>
                <Link
                  to="/parent/dashboard"
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
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
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Gửi yêu cầu cấp thuốc
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Hoàn thành mẫu đơn này để gửi yêu cầu thuốc cho con bạn tại trường
        </p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <div
          className={`flex-1 text-center py-3 ${
            step === 1
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400"
              : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          1. Thông tin học sinh
        </div>
        <div
          className={`flex-1 text-center py-3 ${
            step === 2
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-b-2 border-blue-600 dark:border-blue-400"
              : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          2. Thông tin thuốc
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800">
        {step === 1 && (
          <StudentInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            students={students}
            loadingStudents={loadingStudents}
            isValidDate={isValidDate}
            isPastDate={isPastDate}
            isStep1Valid={isStep1Valid}
          />
        )}

        {step === 2 && (
          <MedicationInfoStep
            medications={medications}
            handleMedicationChange={handleMedicationChange}
            handleTimeOfDayChange={handleTimeOfDayChange}
            handleFileChange={handleFileChange}
            addMedication={addMedication}
            removeMedication={removeMedication}
            getMaxTimeSlots={getMaxTimeSlots}
            canSelectTimeSlot={canSelectTimeSlot}
          />
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={prevStep}
              disabled={isLoading}
            >
              Quay lại
            </button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <div className="flex flex-col items-end">
              <button
                type="button"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isStep1Valid()
                    ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                onClick={nextStep}
                disabled={isLoading || !isStep1Valid()}
              >
                Tiếp theo
              </button>
              {!isStep1Valid() && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                  Vui lòng điền đầy đủ thông tin trước khi tiếp tục
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <button
                type="submit"
                className={`px-6 py-2 rounded-md transition-colors flex items-center ${
                  isStep2Valid()
                    ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={isLoading || !isStep2Valid()}
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
              {!isStep2Valid() && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-right">
                  Vui lòng điền đầy đủ thông tin thuốc và chọn đúng số thời điểm
                  theo tần suất
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicationRequest;
