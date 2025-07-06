import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  medicationService,
  notificationService,
} from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import { toast } from "react-toastify";

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
        console.log("Fetched students from Parent API:", mappedStudents);
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
      case "as_needed":
        return 4; // Không giới hạn cho khi cần thiết
      default:
        return 1;
    }
  };

  // Kiểm tra xem có thể chọn thêm thời điểm không
  const canSelectTimeSlot = (medication, timeValue) => {
    if (medication.frequency === "as_needed") return true;
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
                Bạn sẽ nhận được thông báo khi yêu cầu được xác nhận.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-primary-700 dark:text-primary-400 mb-2">
                  Mã theo dõi yêu cầu
                </h3>
                <p className="text-primary-600 dark:text-primary-300 font-bold text-xl">
                  #MED646560
                </p>
              </div>

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="studentCode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Chọn học sinh{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                {loadingStudents ? (
                  <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    Đang tải danh sách học sinh...
                  </div>
                ) : students.length === 0 ? (
                  <div className="w-full px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                    Không có học sinh nào được liên kết với tài khoản này. Vui
                    lòng liên hệ nhà trường để cập nhật thông tin.
                  </div>
                ) : (
                  <div>
                    <select
                      id="studentCode"
                      name="studentCode"
                      value={formData.studentCode}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        !formData.studentCode
                          ? "border-red-400 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
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
                    {!formData.studentCode && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        Vui lòng chọn học sinh
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="className"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Lớp <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="className"
                  name="className"
                  value={formData.className}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  placeholder="Lớp sẽ tự động điền khi chọn học sinh"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ngày <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Year Dropdown */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Năm
                  </label>
                  <select
                    value={formData.date ? formData.date.split("/")[0] || "" : ""}
                    onChange={(e) => {
                      const year = e.target.value;
                      const currentParts = formData.date ? formData.date.split("/") : ["", "", ""];
                      const month = currentParts[1] || "";
                      const day = currentParts[2] || "";
                      
                      if (!year) {
                        // If year is cleared, clear the whole date
                        handleInputChange({
                          target: {
                            name: "date",
                            value: ""
                          }
                        });
                        return;
                      }
                      
                      // Validate day when year changes
                      const maxDays = year && month ? new Date(year, month, 0).getDate() : 31;
                      const validDay = day && parseInt(day) <= maxDays ? day : "";
                      
                      // Update date, keeping partial selections
                      let newDate = year;
                      if (month) newDate += `/${month}`;
                      if (month && validDay) newDate += `/${validDay}`;
                      
                      handleInputChange({
                        target: {
                          name: "date",
                          value: newDate
                        }
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">Năm</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Month Dropdown */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Tháng
                  </label>
                  <select
                    value={formData.date && formData.date.split("/").length > 1 ? formData.date.split("/")[1] || "" : ""}
                    onChange={(e) => {
                      const month = e.target.value;
                      const currentParts = formData.date ? formData.date.split("/") : ["", "", ""];
                      const year = currentParts[0] || "";
                      const day = currentParts[2] || "";
                      
                      if (!year) {
                        // Need year first
                        return;
                      }
                      
                      if (!month) {
                        // If month is cleared, keep only year
                        handleInputChange({
                          target: {
                            name: "date",
                            value: year
                          }
                        });
                        return;
                      }
                      
                      // Validate day when month changes
                      const maxDays = new Date(year, month, 0).getDate();
                      const validDay = day && parseInt(day) <= maxDays ? day : "";
                      
                      // Update date
                      let newDate = `${year}/${month}`;
                      if (validDay) newDate += `/${validDay}`;
                      
                      handleInputChange({
                        target: {
                          name: "date",
                          value: newDate
                        }
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">Tháng</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      return (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Day Dropdown */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Ngày
                  </label>
                  <select
                    value={formData.date && formData.date.split("/").length > 2 ? formData.date.split("/")[2] || "" : ""}
                    onChange={(e) => {
                      const day = e.target.value;
                      const currentParts = formData.date ? formData.date.split("/") : ["", "", ""];
                      const year = currentParts[0] || "";
                      const month = currentParts[1] || "";
                      
                      if (!year || !month) {
                        // Need year and month first
                        return;
                      }
                      
                      if (!day) {
                        // If day is cleared, keep year/month
                        handleInputChange({
                          target: {
                            name: "date",
                            value: `${year}/${month}`
                          }
                        });
                        return;
                      }
                      
                      const newDate = `${year}/${month}/${day}`;
                      handleInputChange({
                        target: {
                          name: "date",
                          value: newDate
                        }
                      });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">Ngày</option>
                    {(() => {
                      const currentParts = formData.date ? formData.date.split("/") : ["", "", ""];
                      const year = currentParts[0];
                      const month = currentParts[1];
                      
                      // Only show days if year and month are selected
                      if (!year || !month) {
                        return null;
                      }
                      
                      const maxDays = new Date(year, month, 0).getDate();
                      
                      return Array.from({ length: maxDays }, (_, i) => {
                        const day = i + 1;
                        return (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        );
                      });
                    })()}
                  </select>
                </div>
              </div>
              
              {formData.date && !isValidDate(formData.date) && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  Ngày không hợp lệ. Vui lòng chọn đầy đủ năm/tháng/ngày
                </p>
              )}
              {formData.date &&
                isValidDate(formData.date) &&
                isPastDate(formData.date) && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    Không thể chọn ngày trong quá khứ
                  </p>
                )}
              {!formData.date && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Chọn ngày cần cấp thuốc (định dạng: năm/tháng/ngày)
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Thông tin thuốc
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors"
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
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                    Thuốc #{index + 1}
                  </h4>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên thuốc{" "}
                      <span className="text-red-500 dark:text-red-400">*</span>
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Nhập tên thuốc"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Liều lượng{" "}
                        <span className="text-red-500 dark:text-red-400">
                          *
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={medication.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              medication.id,
                              "dosage",
                              e.target.value
                            )
                          }
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="1"
                        />
                        <select
                          value={medication.dosageUnit}
                          onChange={(e) =>
                            handleMedicationChange(
                              medication.id,
                              "dosageUnit",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="viên">viên</option>
                          <option value="ml">ml</option>
                          <option value="mg">mg</option>
                          <option value="muỗng">muỗng</option>
                          <option value="gói">gói</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tần suất/ngày{" "}
                        <span className="text-red-500 dark:text-red-400">
                          *
                        </span>
                      </label>
                      <select
                        value={medication.frequency}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "frequency",
                            e.target.value
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="1">1 lần/ngày</option>
                        <option value="2">2 lần/ngày</option>
                        <option value="3">3 lần/ngày</option>
                        <option value="4">4 lần/ngày</option>
                        <option value="as_needed">Khi cần thiết</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Liều lượng/lần uống
                      </label>
                      <div className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                        {medication.dosage &&
                        medication.dosageUnit &&
                        medication.frequency
                          ? (() => {
                              const totalDosage = parseFloat(medication.dosage);

                              if (medication.frequency === "as_needed") {
                                return `${totalDosage} ${medication.dosageUnit}/lần (khi cần)`;
                              }

                              const frequency = parseInt(medication.frequency);
                              const dosagePerTime = totalDosage / frequency;

                              // Làm tròn đến 1 chữ số thập phân nếu cần
                              const roundedDosage =
                                dosagePerTime % 1 === 0
                                  ? dosagePerTime.toString()
                                  : dosagePerTime.toFixed(1);

                              return `${roundedDosage} ${medication.dosageUnit}/lần`;
                            })()
                          : "Nhập liều lượng"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Thời điểm dùng thuốc{" "}
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          value: "morning",
                          label: "Buổi sáng",
                          desc: "(6:00 - 11:00)",
                        },
                        {
                          value: "noon",
                          label: "Buổi trưa",
                          desc: "(11:00 - 14:00)",
                        },
                        {
                          value: "afternoon",
                          label: "Buổi chiều",
                          desc: "(14:00 - 18:00)",
                        },
                        {
                          value: "as_needed",
                          label: "Khi cần thiết",
                          desc: "(theo triệu chứng)",
                        },
                      ].map((timeOption) => {
                        const canSelect = canSelectTimeSlot(
                          medication,
                          timeOption.value
                        );
                        const isChecked = medication.timeOfDay.includes(
                          timeOption.value
                        );

                        return (
                          <div
                            key={timeOption.value}
                            className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors ${
                              canSelect || isChecked
                                ? "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 bg-white dark:bg-gray-700"
                                : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={`${medication.id}_${timeOption.value}`}
                              checked={isChecked}
                              disabled={!canSelect && !isChecked}
                              onChange={(e) =>
                                handleTimeOfDayChange(
                                  medication.id,
                                  timeOption.value,
                                  e.target.checked
                                )
                              }
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`${medication.id}_${timeOption.value}`}
                                className={`text-sm font-medium cursor-pointer ${
                                  canSelect || isChecked
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {timeOption.label}
                              </label>
                              <p
                                className={`text-xs ${
                                  canSelect || isChecked
                                    ? "text-gray-500 dark:text-gray-400"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {timeOption.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Validation messages */}
                    {medication.timeOfDay.length === 0 && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                        Vui lòng chọn ít nhất một thời điểm dùng thuốc
                      </p>
                    )}

                    {/* Validation for frequency and time slots mismatch */}
                    {medication.frequency !== "as_needed" &&
                      medication.timeOfDay.length > 0 &&
                      medication.timeOfDay.length !==
                        getMaxTimeSlots(medication.frequency) && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                          <p className="text-red-700 dark:text-red-300 text-sm">
                            <span className="font-medium">
                              ⚠️ Lỗi: Tần suất {medication.frequency} lần/ngày
                              cần chọn đúng{" "}
                              {getMaxTimeSlots(medication.frequency)} thời điểm
                            </span>
                            <br />
                            Hiện tại đã chọn {medication.timeOfDay.length}/
                            {getMaxTimeSlots(medication.frequency)} thời điểm.
                            Vui lòng chọn{" "}
                            {getMaxTimeSlots(medication.frequency) -
                              medication.timeOfDay.length >
                            0
                              ? "thêm"
                              : "bớt"}{" "}
                            {Math.abs(
                              getMaxTimeSlots(medication.frequency) -
                                medication.timeOfDay.length
                            )}{" "}
                            thời điểm.
                          </p>
                        </div>
                      )}

                    {medication.frequency !== "as_needed" &&
                      medication.timeOfDay.length > 0 &&
                      medication.timeOfDay.length ===
                        getMaxTimeSlots(medication.frequency) && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            <span className="font-medium">
                              {medication.frequency === "1" &&
                                "Thuốc uống 1 lần/ngày:"}
                              {medication.frequency === "2" &&
                                "Thuốc uống 2 lần/ngày:"}
                              {medication.frequency === "3" &&
                                "Thuốc uống 3 lần/ngày:"}
                              {medication.frequency === "4" &&
                                "Thuốc uống 4 lần/ngày:"}
                            </span>{" "}
                            Đã chọn {medication.timeOfDay.length}/
                            {getMaxTimeSlots(medication.frequency)} thời điểm
                            (đã đủ) ✓
                          </p>
                          {medication.dosage && medication.dosageUnit && (
                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                              {(() => {
                                const totalDosage = parseFloat(
                                  medication.dosage
                                );
                                const frequency = parseInt(
                                  medication.frequency
                                );
                                const dosagePerTime = totalDosage / frequency;
                                const roundedDosage =
                                  dosagePerTime % 1 === 0
                                    ? dosagePerTime.toString()
                                    : dosagePerTime.toFixed(1);

                                return `Mỗi lần uống: ${roundedDosage} ${medication.dosageUnit} (Tổng: ${totalDosage} ${medication.dosageUnit}/${frequency} lần)`;
                              })()}
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
