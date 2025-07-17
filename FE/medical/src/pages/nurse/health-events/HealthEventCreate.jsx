import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiCheck,
  FiX,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  createHealthEvent,
  mapHealthEventToAPI,
  sendNotificationToParent,
} from "../../../utils/api/health-events/healthEventService";
import {
  medicineInventoryService,
  medicalSupplyInventoryService,
} from "../../../utils/api/medication/inventoryService";
import { useAuth } from "../../../utils/auth/AuthContext";
import {
  getMedicineUnit,
  getMedicalSupplyUnit,
  getDosagePlaceholder,
  formatDosageWithUnit,
  extractDosageNumber,
} from "../../../utils/medicineUnits";
import { getStudentByCode } from "../../../utils/api/student/studentService";

const HealthEventCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user information from AuthContext
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState("");

  // State for inventory data
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [availableMedicalSupplies, setAvailableMedicalSupplies] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  // State for student info loading
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(false);
  const [studentNotFound, setStudentNotFound] = useState(false);

  const [formData, setFormData] = useState({
    studentCode: "",
    studentName: "",
    class: "",
    type: "illness",
    symptoms: "",
    assessment: "",
    treatment: "",
    notes: "",
    temperature: "",
    pulse: "",
    bloodPressure: "",
    respiratoryRate: "",
    medications: [{ name: "", dosage: "", time: "", unit: "" }],
    medicalSupplies: [{ name: "", quantity: 1, time: "", unit: "" }],
    parentNotified: false,
    followUpRequired: false,
    parentContacted: {
      contacted: false,
      time: "",
      person: "",
      method: "phone",
      response: "",
    },
  });

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoadingInventory(true);
      try {
        // Fetch medicines and medical supplies in parallel
        const [medicinesResult, suppliesResult] = await Promise.all([
          medicineInventoryService.getActiveMedicines(),
          medicalSupplyInventoryService.getActiveMedicalSupplies(),
        ]);

        if (medicinesResult.success) {
          setAvailableMedicines(medicinesResult.data);
        } else {
          console.error("Failed to load medicines:", medicinesResult.message);
        }

        if (suppliesResult.success) {
          setAvailableMedicalSupplies(suppliesResult.data);
        } else {
          console.error(
            "Failed to load medical supplies:",
            suppliesResult.message
          );
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoadingInventory(false);
      }
    };

    fetchInventoryData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle student code change and auto-fetch student info
  const handleStudentCodeChange = async (e) => {
    const { value } = e.target;

    // Update the student code in form data
    setFormData((prev) => ({ ...prev, studentCode: value }));

    // Reset states
    setStudentNotFound(false);

    // If student code is empty, clear student info
    if (!value.trim()) {
      setFormData((prev) => ({
        ...prev,
        studentName: "",
        class: "",
      }));
      return;
    }

    // Fetch student info if student code has reasonable length
    if (value.trim().length >= 3) {
      setLoadingStudentInfo(true);
      try {
        const studentData = await getStudentByCode(value.trim());
        // Auto-fill student name and class
        setFormData((prev) => ({
          ...prev,
          studentName: `${studentData.firstName} ${studentData.lastName}`,
          class: studentData.className,
        }));
        setStudentNotFound(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStudentNotFound(true);
        // Clear student info if not found
        setFormData((prev) => ({
          ...prev,
          studentName: "",
          class: "",
        }));
      } finally {
        setLoadingStudentInfo(false);
      }
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };

    // If medicine name is changed, store the unit separately and clear dosage for number input
    if (field === "name" && value) {
      const unit = getMedicineUnit(value);
      updatedMedications[index].unit = unit;
      // Clear dosage to allow fresh number input
      if (
        !updatedMedications[index].dosage ||
        updatedMedications[index].dosage === updatedMedications[index].unit
      ) {
        updatedMedications[index].dosage = "";
      }
    }

    setFormData((prev) => ({ ...prev, medications: updatedMedications }));
  };

  const handleMedicalSupplyChange = (index, field, value) => {
    const updatedSupplies = [...formData.medicalSupplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: value,
    };

    // If medical supply name is changed, determine the unit and store it
    if (field === "name" && value) {
      const selectedSupply = availableMedicalSupplies.find(
        (supply) => supply.name === value
      );
      const unit = getMedicalSupplyUnit(value, selectedSupply?.category);
      updatedSupplies[index].unit = unit;
    }

    setFormData((prev) => ({ ...prev, medicalSupplies: updatedSupplies }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", time: "", unit: "" },
      ],
    }));
  };

  const addMedicalSupply = () => {
    setFormData((prev) => ({
      ...prev,
      medicalSupplies: [
        ...prev.medicalSupplies,
        { name: "", quantity: 1, time: "", unit: "" },
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
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Validate required fields
      if (!formData.studentCode || !formData.symptoms) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Check if user is logged in and has ID
      if (!user || !user.id) {
        throw new Error(
          "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại."
        );
      }

      // Map medications with correct IDs based on selected names
      const mappedMedications = formData.medications
        .filter((med) => med.name && med.name.trim() !== "")
        .map((med) => {
          const selectedMedicine = availableMedicines.find(
            (medicine) => medicine.name === med.name
          );
          // Combine dosage with unit for API
          const dosageWithUnit =
            med.dosage && med.unit ? `${med.dosage} ${med.unit}` : med.dosage;
          return {
            ...med,
            dosage: dosageWithUnit,
            id: selectedMedicine ? selectedMedicine.medicineId : 1,
          };
        });

      // Map medical supplies with correct IDs based on selected names
      const mappedMedicalSupplies = formData.medicalSupplies
        .filter((supply) => supply.name && supply.name.trim() !== "")
        .map((supply) => {
          const selectedSupply = availableMedicalSupplies.find(
            (medicalSupply) => medicalSupply.name === supply.name
          );
          return {
            ...supply,
            id: selectedSupply ? selectedSupply.supplyId : 1,
          };
        });

      // Map form data to API format with staff ID from AuthContext
      const apiData = mapHealthEventToAPI({
        ...formData,
        staffId: user.id, // Use staff ID from authenticated user
        medications: mappedMedications,
        medicalSupplies: mappedMedicalSupplies,
      });

      // Create health event via API
      const response = await createHealthEvent(apiData);

      // Show success message
      setSubmitStatus("success");

      // Send notification to parent
      await notifyParent(formData.studentCode, {
        eventType: formData.type,
        symptoms: formData.symptoms,
        treatment: formData.treatment,
        studentName: formData.studentName,
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/nurse/health-events");
      }, 2000);
    } catch (error) {
      console.error("Error creating health event:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "Có lỗi xảy ra khi tạo sự cố y tế");
      setLoading(false);
    }
  };

  // Function to notify parent
  const notifyParent = async (studentCode, eventDetails) => {
    try {
      // Prepare notification data
      const notificationData = {
        studentCode,
        type: "health_event",
        title: `Thông báo sự cố y tế - ${eventDetails.studentName}`,
        message: `Học sinh ${eventDetails.studentName} đã có sự cố y tế: ${
          eventDetails.symptoms
        }. ${
          eventDetails.treatment ? `Đã xử lý: ${eventDetails.treatment}.` : ""
        } Vui lòng liên hệ với trường để biết thêm chi tiết.`,
        eventDetails,
        timestamp: new Date().toISOString(),
        priority: eventDetails.severity || "medium",
      };

      // Send notification to parent
      await sendNotificationToParent(notificationData);
    } catch (error) {
      console.error("Error sending parent notification:", error);
      // Don't throw error here as the main event creation was successful
    }
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
          Tạo sự cố y tế mới
        </h1>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            submitStatus === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {submitStatus === "success" ? (
            <>
              <FiCheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Tạo sự cố y tế thành công!</h3>
                <p className="text-sm mt-1">
                  Thông báo đã được gửi đến phụ huynh. Đang chuyển hướng...
                </p>
              </div>
            </>
          ) : (
            <>
              <FiAlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Có lỗi xảy ra!</h3>
                <p className="text-sm mt-1">{errorMessage}</p>
              </div>
            </>
          )}
        </div>
      )}

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
                htmlFor="studentCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mã số học sinh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="studentCode"
                  name="studentCode"
                  required
                  value={formData.studentCode}
                  onChange={handleStudentCodeChange}
                  className={`w-full px-4 py-2 pr-10 border ${
                    studentNotFound
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-neutral-600 focus:border-blue-500"
                  } rounded-md focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Ví dụ: STU1C026"
                />
                {loadingStudentInfo && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              {studentNotFound && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Không tìm thấy học sinh với mã này
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Họ và tên học sinh
                {formData.studentName && (
                  <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                  </span>
                )}
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  formData.studentName
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-white dark:bg-neutral-700"
                } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Họ và tên học sinh"
              />
            </div>
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lớp
                {formData.class && (
                  <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                  </span>
                )}
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  formData.class
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-white dark:bg-neutral-700"
                } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Ví dụ: 3A"
                readOnly={!!formData.class}
              />
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Chi tiết sự cố
          </h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Loại sự cố <span className="text-red-500">*</span>
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
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Triệu chứng <span className="text-red-500">*</span>
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows="3"
                required
                value={formData.symptoms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Mô tả các triệu chứng quan sát được (ví dụ: Sốt nhẹ 37.8°C, ho khan, mệt mỏi)"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="assessment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Đánh giá ban đầu
              </label>
              <textarea
                id="assessment"
                name="assessment"
                rows="3"
                value={formData.assessment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Đánh giá tình trạng sức khỏe và mức độ nghiêm trọng"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="treatment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Biện pháp xử lý
              </label>
              <textarea
                id="treatment"
                name="treatment"
                rows="3"
                value={formData.treatment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Các biện pháp đã thực hiện (ví dụ: Cho uống thuốc hạ sốt, nghỉ ngơi)"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ghi chú thêm
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Thông tin bổ sung, lưu ý đặc biệt"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Medications Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Thuốc đã sử dụng
            </h2>
            <button
              type="button"
              onClick={addMedication}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              disabled={loadingInventory}
            >
              + Thêm thuốc
            </button>
          </div>

          {/* Loading or empty state message */}
          {loadingInventory && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Đang tải danh sách thuốc...
            </div>
          )}

          {!loadingInventory && availableMedicines.length === 0 && (
            <div className="text-center py-4 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <FiAlertCircle className="h-6 w-6 mx-auto mb-2" />
              Không có thuốc nào khả dụng trong kho
            </div>
          )}

          {formData.medications.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
            >
              <div>
                <label
                  htmlFor={`medication-name-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tên thuốc
                </label>
                <select
                  id={`medication-name-${index}`}
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  disabled={loadingInventory}
                >
                  <option value="">
                    {loadingInventory ? "Đang tải..." : "Chọn thuốc"}
                  </option>
                  {availableMedicines.map((medicine) => (
                    <option key={medicine.medicineId} value={medicine.name}>
                      {medicine.name} (Còn: {medicine.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`medication-dosage-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Liều lượng {med.unit && `(${med.unit})`}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    id={`medication-dosage-${index}`}
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicationChange(index, "dosage", e.target.value)
                    }
                    placeholder={med.unit ? `Nhập số lượng` : "Nhập liều lượng"}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {med.unit && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {med.unit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor={`medication-time-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian
                </label>
                <input
                  type="text"
                  id={`medication-time-${index}`}
                  value={med.time}
                  onChange={(e) =>
                    handleMedicationChange(index, "time", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: 09:30"
                />
              </div>
              <div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    <FiX className="mr-1 h-4 w-4" /> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Medical Supplies Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Vật tư y tế đã sử dụng
            </h2>
            <button
              type="button"
              onClick={addMedicalSupply}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              disabled={loadingInventory}
            >
              <FiPackage className="mr-1 h-4 w-4" /> Thêm vật tư
            </button>
          </div>

          {/* Loading or empty state message */}
          {loadingInventory && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Đang tải danh sách vật tư y tế...
            </div>
          )}

          {!loadingInventory && availableMedicalSupplies.length === 0 && (
            <div className="text-center py-4 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <FiAlertCircle className="h-6 w-6 mx-auto mb-2" />
              Không có vật tư y tế nào khả dụng trong kho
            </div>
          )}

          {formData.medicalSupplies.map((supply, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
            >
              <div>
                <label
                  htmlFor={`supply-name-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tên vật tư
                </label>
                <select
                  id={`supply-name-${index}`}
                  value={supply.name}
                  onChange={(e) =>
                    handleMedicalSupplyChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  disabled={loadingInventory}
                >
                  <option value="">
                    {loadingInventory ? "Đang tải..." : "Chọn vật tư"}
                  </option>
                  {availableMedicalSupplies.map((supply) => (
                    <option key={supply.supplyId} value={supply.name}>
                      {supply.name} - {supply.category} (Còn:{" "}
                      {supply.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor={`supply-quantity-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Số lượng {supply.unit && `(${supply.unit})`}
                </label>
                <input
                  type="number"
                  id={`supply-quantity-${index}`}
                  min="1"
                  value={supply.quantity}
                  onChange={(e) =>
                    handleMedicalSupplyChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder={
                    supply.unit
                      ? `Nhập số lượng (${supply.unit})`
                      : "Nhập số lượng"
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor={`supply-time-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Thời gian
                </label>
                <input
                  type="text"
                  id={`supply-time-${index}`}
                  value={supply.time}
                  onChange={(e) =>
                    handleMedicalSupplyChange(index, "time", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ví dụ: 09:30"
                />
              </div>
              <div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMedicalSupply(index)}
                    className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    <FiX className="mr-1 h-4 w-4" /> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-neutral-700 flex justify-end space-x-4">
          <Link
            to="/nurse/health-events"
            className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-600 bg-white dark:bg-neutral-800"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                Tạo sự cố
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthEventCreate;
