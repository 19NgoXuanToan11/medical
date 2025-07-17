import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiCalendar,
  FiClock,
  FiUser,
  FiActivity,
  FiAlertCircle,
  FiX,
  FiPlusCircle,
  FiPackage,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getHealthEventById,
  updateHealthEvent,
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

const HealthEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // State for inventory data
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [availableMedicalSupplies, setAvailableMedicalSupplies] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

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
    medications: [{ name: "", dosage: "", time: "" }],
    medicalSupplies: [{ name: "", quantity: 1, time: "" }],
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

  // Fetch event data and inventory on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch health event data and inventory in parallel
        const [eventResponse, medicinesResult, suppliesResult] =
          await Promise.all([
            getHealthEventById(id),
            medicineInventoryService.getActiveMedicines(),
            medicalSupplyInventoryService.getActiveMedicalSupplies(),
          ]);

        // Set inventory data
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

        // Map API data to form format
        const mappedData = {
          studentCode: eventResponse.studentCode || "",
          studentName: eventResponse.student
            ? `${eventResponse.student.firstName} ${eventResponse.student.lastName}`
            : "",
          class: eventResponse.student?.className || "",
          type: eventResponse.eventType || "illness",
          symptoms: eventResponse.symptoms || "",
          assessment: eventResponse.assessment || "",
          treatment: eventResponse.treatment || "",
          notes: eventResponse.notes || "",
          parentNotified: eventResponse.parentNotified || false,
          followUpRequired: eventResponse.followUpRequired || false,
          medications:
            eventResponse.healthEventMedicines &&
            eventResponse.healthEventMedicines.length > 0
              ? eventResponse.healthEventMedicines.map((med) => {
                  const medicineName = med.medicine?.name || "";
                  const unit = getMedicineUnit(medicineName);
                  const dosage = med.dosage || "";
                  // Extract number from dosage if it contains unit
                  const numericDosage = extractDosageNumber(dosage) || dosage;
                  return {
                    name: medicineName,
                    dosage: numericDosage,
                    time: med.time || "",
                    id: med.medicineId,
                    unit: unit,
                  };
                })
              : [{ name: "", dosage: "", time: "", unit: "" }],
          medicalSupplies:
            eventResponse.healthEventMedicalSupplies &&
            eventResponse.healthEventMedicalSupplies.length > 0
              ? eventResponse.healthEventMedicalSupplies.map((supply) => {
                  const supplyName = supply.medicalSupply?.name || "";
                  const supplyCategory = supply.medicalSupply?.category || "";
                  const unit = getMedicalSupplyUnit(supplyName, supplyCategory);
                  return {
                    name: supplyName,
                    quantity: supply.quantity || 1,
                    time: supply.time || "",
                    id: supply.medicalSupplyId,
                    unit: unit,
                  };
                })
              : [{ name: "", quantity: 1, time: "", unit: "" }],
          parentContacted: {
            contacted: eventResponse.parentNotified || false,
            time: "",
            person: "",
            method: "phone",
            response: "",
          },
        };

        setFormData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Không thể tải thông tin sự cố y tế");
      } finally {
        setLoading(false);
        setLoadingInventory(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setSaving(true);
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
          // Combine dosage with unit for API
          const dosageWithUnit =
            med.dosage && med.unit ? `${med.dosage} ${med.unit}` : med.dosage;
          // If medication already has ID (existing), use it; otherwise find from available medicines
          if (med.id) {
            return { ...med, dosage: dosageWithUnit, id: med.id };
          }
          const selectedMedicine = availableMedicines.find(
            (medicine) => medicine.name === med.name
          );
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
          // If supply already has ID (existing), use it; otherwise find from available supplies
          if (supply.id) {
            return { ...supply, id: supply.id };
          }
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

      // Update health event via API
      const response = await updateHealthEvent(id, apiData);

      // Show success message
      setSubmitStatus("success");

      // Send notification to parent if needed
      if (formData.parentNotified) {
        await notifyParent(formData.studentCode, {
          eventType: formData.type,
          symptoms: formData.symptoms,
          treatment: formData.treatment,
          studentName: formData.studentName,
        });
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/nurse/health-events");
      }, 2000);
    } catch (error) {
      console.error("Error updating health event:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "Có lỗi xảy ra khi cập nhật sự cố y tế");
      setSaving(false);
    }
  };

  // Function to notify parent
  const notifyParent = async (studentCode, eventDetails) => {
    try {
      // Prepare notification data
      const notificationData = {
        studentCode,
        type: "health_event_update",
        title: `Cập nhật sự cố y tế - ${eventDetails.studentName}`,
        message: `Thông tin sự cố y tế của học sinh ${
          eventDetails.studentName
        } đã được cập nhật: ${eventDetails.symptoms}. ${
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
      // Don't throw error here as the main event update was successful
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Đang tải...
        </span>
      </div>
    );
  }

  if (errorMessage && !formData.studentCode) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {errorMessage}
        </p>
        <Link
          to="/nurse/health-events"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

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
          Chỉnh sửa sự cố y tế
        </h1>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-green-800 dark:text-green-300 font-medium">
              Cập nhật sự cố y tế thành công! Đang chuyển hướng...
            </p>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-300 font-medium">
              {errorMessage}
            </p>
          </div>
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
              <input
                type="text"
                id="studentCode"
                name="studentCode"
                required
                value={formData.studentCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: ST001"
              />
            </div>
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Họ và tên học sinh
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Họ và tên học sinh"
              />
            </div>
            <div>
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lớp
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ví dụ: 3A"
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
              + Thêm vật tư
            </button>
          </div>

          {/* Loading or empty state message */}
          {loadingInventory && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Đang tải danh sách vật tư...
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

        {/* Parent Contact Section */}
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Thông báo phụ huynh
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="parentNotified"
                name="parentNotified"
                checked={formData.parentNotified}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentNotified: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="parentNotified"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Đã thông báo phụ huynh
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="followUpRequired"
                name="followUpRequired"
                checked={formData.followUpRequired}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    followUpRequired: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="followUpRequired"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Cần theo dõi tiếp
              </label>
            </div>
          </div>
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
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2 h-4 w-4" />
                Cập nhật sự cố
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthEventEdit;
