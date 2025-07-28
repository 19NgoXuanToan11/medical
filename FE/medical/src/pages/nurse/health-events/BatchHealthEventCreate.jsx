import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiSave,
  FiLoader,
  FiPackage,
  FiTablet,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";
import MultiStudentSelector from "../../../components/common/MultiStudentSelector";
import HealthEventTemplateSelector, {
  HEALTH_EVENT_TEMPLATES,
} from "../../../components/common/HealthEventTemplateSelector";
import {
  createBatchHealthEvents,
  mapHealthEventToAPI,
} from "../../../utils/api/health-events/healthEventService";
import { useAuth } from "../../../utils/auth/AuthContext";
import authService from "../../../utils/auth/authService";
import {
  medicineInventoryService,
  medicalSupplyInventoryService,
} from "../../../utils/api/medication/inventoryService";
import {
  getMedicineUnit,
  getMedicalSupplyUnit,
} from "../../../utils/medicine/medicineUnits";

const BatchHealthEventCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // State for batch creation
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [batchMode, setBatchMode] = useState(true); // true = batch, false = single
  const [allowedGrades, setAllowedGrades] = useState([]);

  // State for inventory
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [availableMedicalSupplies, setAvailableMedicalSupplies] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  // State for batch medications and supplies
  const [batchMedications, setBatchMedications] = useState([
    { name: "", dosage: "", time: "", unit: "" },
  ]);
  const [batchMedicalSupplies, setBatchMedicalSupplies] = useState([
    { name: "", quantity: 1, time: "", unit: "" },
  ]);

  // State for individual student customization
  const [customizedEvents, setCustomizedEvents] = useState({});

  // State for insufficient items warning
  const [insufficientItems, setInsufficientItems] = useState([]);
  const [showInsufficientWarning, setShowInsufficientWarning] = useState(false);

  // Thêm state cho modal ghi chú thiếu thuốc/vật tư
  const [showInsufficientNoteModal, setShowInsufficientNoteModal] =
    useState(false);
  const [insufficientNote, setInsufficientNote] = useState("");
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [insufficientItemsCache, setInsufficientItemsCache] = useState([]);

  // Fetch nurse's allowed grades
  useEffect(() => {
    const fetchAllowedGrades = async () => {
      try {
        const response = await fetch(
          `https://localhost:7111/api/Staff/my-assigned-grades`,
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const grades = await response.json();
          setAllowedGrades(grades);
        } else {
          console.error(
            "Failed to fetch allowed grades:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching allowed grades:", error);
      }
    };

    if (authService.getToken()) {
      fetchAllowedGrades();
    }
  }, [user]);

  // Fetch inventory data
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

  // Update customized events when template or students change
  useEffect(() => {
    if (selectedTemplate && selectedStudents.length > 0) {
      const newCustomizedEvents = {};
      selectedStudents.forEach((student) => {
        newCustomizedEvents[student.studentCode] = {
          ...selectedTemplate,
          studentCode: student.studentCode,
          studentName: `${student.firstName} ${student.lastName}`,
          className: student.className,
          medications: [...batchMedications],
          medicalSupplies: [...batchMedicalSupplies],
        };
      });
      setCustomizedEvents(newCustomizedEvents);
    }
  }, [
    selectedTemplate,
    selectedStudents,
    batchMedications,
    batchMedicalSupplies,
  ]);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // Handle batch medication changes
  const handleBatchMedicationChange = (index, field, value) => {
    const updatedMedications = [...batchMedications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };

    // If medicine name is changed, store the unit separately
    if (field === "name" && value) {
      const unit = getMedicineUnit(value);
      updatedMedications[index].unit = unit;
      if (
        !updatedMedications[index].dosage ||
        updatedMedications[index].dosage === unit
      ) {
        updatedMedications[index].dosage = "";
      }
    }

    setBatchMedications(updatedMedications);
  };

  // Handle batch medical supply changes
  const handleBatchMedicalSupplyChange = (index, field, value) => {
    const updatedSupplies = [...batchMedicalSupplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: value,
    };

    // If medical supply name is changed, determine the unit
    if (field === "name" && value) {
      const selectedSupply = availableMedicalSupplies.find(
        (supply) => supply.name === value
      );
      const unit = getMedicalSupplyUnit(value, selectedSupply?.category);
      updatedSupplies[index].unit = unit;
    }

    setBatchMedicalSupplies(updatedSupplies);
  };

  // Add batch medication
  const addBatchMedication = () => {
    setBatchMedications([
      ...batchMedications,
      { name: "", dosage: "", time: "", unit: "" },
    ]);
  };

  // Add batch medical supply
  const addBatchMedicalSupply = () => {
    setBatchMedicalSupplies([
      ...batchMedicalSupplies,
      { name: "", quantity: 1, time: "", unit: "" },
    ]);
  };

  // Remove batch medication
  const removeBatchMedication = (index) => {
    const updatedMedications = [...batchMedications];
    updatedMedications.splice(index, 1);
    setBatchMedications(updatedMedications);
  };

  // Remove batch medical supply
  const removeBatchMedicalSupply = (index) => {
    const updatedSupplies = [...batchMedicalSupplies];
    updatedSupplies.splice(index, 1);
    setBatchMedicalSupplies(updatedSupplies);
  };

  // Handle individual event customization
  const handleEventCustomization = (studentCode, field, value) => {
    setCustomizedEvents((prev) => ({
      ...prev,
      [studentCode]: {
        ...prev[studentCode],
        [field]: value,
      },
    }));
  };

  // Handle individual medication customization
  const handleIndividualMedicationChange = (
    studentCode,
    index,
    field,
    value
  ) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      const updatedMedications = [...studentEvent.medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };

      // If medicine name is changed, store the unit separately
      if (field === "name" && value) {
        const unit = getMedicineUnit(value);
        updatedMedications[index].unit = unit;
        if (
          !updatedMedications[index].dosage ||
          updatedMedications[index].dosage === unit
        ) {
          updatedMedications[index].dosage = "";
        }
      }

      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medications: updatedMedications,
        },
      };
    });
  };

  // Handle individual medical supply customization
  const handleIndividualMedicalSupplyChange = (
    studentCode,
    index,
    field,
    value
  ) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      const updatedSupplies = [...studentEvent.medicalSupplies];
      updatedSupplies[index] = {
        ...updatedSupplies[index],
        [field]: value,
      };

      // If medical supply name is changed, determine the unit
      if (field === "name" && value) {
        const selectedSupply = availableMedicalSupplies.find(
          (supply) => supply.name === value
        );
        const unit = getMedicalSupplyUnit(value, selectedSupply?.category);
        updatedSupplies[index].unit = unit;
      }

      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medicalSupplies: updatedSupplies,
        },
      };
    });
  };

  // Add individual medication
  const addIndividualMedication = (studentCode) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medications: [
            ...studentEvent.medications,
            { name: "", dosage: "", time: "", unit: "" },
          ],
        },
      };
    });
  };

  // Add individual medical supply
  const addIndividualMedicalSupply = (studentCode) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medicalSupplies: [
            ...studentEvent.medicalSupplies,
            { name: "", quantity: 1, time: "", unit: "" },
          ],
        },
      };
    });
  };

  // Remove individual medication
  const removeIndividualMedication = (studentCode, index) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      const updatedMedications = [...studentEvent.medications];
      updatedMedications.splice(index, 1);
      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medications: updatedMedications,
        },
      };
    });
  };

  // Remove individual medical supply
  const removeIndividualMedicalSupply = (studentCode, index) => {
    setCustomizedEvents((prev) => {
      const studentEvent = prev[studentCode];
      const updatedSupplies = [...studentEvent.medicalSupplies];
      updatedSupplies.splice(index, 1);
      return {
        ...prev,
        [studentCode]: {
          ...studentEvent,
          medicalSupplies: updatedSupplies,
        },
      };
    });
  };

  // Check for insufficient items
  const checkInsufficientItems = () => {
    const insufficient = [];

    // Check batch medications
    batchMedications.forEach((med) => {
      if (!med.name || !med.dosage) return;
      const selected = availableMedicines.find((m) => m.name === med.name);
      if (selected) {
        const required = parseFloat(med.dosage) * selectedStudents.length;
        const available = parseFloat(selected.stockQuantity);
        if (!isNaN(required) && available < required) {
          insufficient.push({
            type: "medicine",
            name: med.name,
            required,
            available,
          });
        }
      }
    });

    // Check batch supplies
    batchMedicalSupplies.forEach((supply) => {
      if (!supply.name || !supply.quantity) return;
      const selected = availableMedicalSupplies.find(
        (s) => s.name === supply.name
      );
      if (selected) {
        const required = parseFloat(supply.quantity) * selectedStudents.length;
        const available = parseFloat(selected.stockQuantity);
        if (!isNaN(required) && available < required) {
          insufficient.push({
            type: "supply",
            name: supply.name,
            required,
            available,
          });
        }
      }
    });

    // Check individual customizations
    Object.values(customizedEvents).forEach((event) => {
      event.medications?.forEach((med) => {
        if (!med.name || !med.dosage) return;
        const selected = availableMedicines.find((m) => m.name === med.name);
        if (selected) {
          const required = parseFloat(med.dosage);
          const available = parseFloat(selected.stockQuantity);
          if (!isNaN(required) && available < required) {
            const existing = insufficient.find(
              (item) => item.name === med.name
            );
            if (!existing) {
              insufficient.push({
                type: "medicine",
                name: med.name,
                required,
                available,
              });
            }
          }
        }
      });

      event.medicalSupplies?.forEach((supply) => {
        if (!supply.name || !supply.quantity) return;
        const selected = availableMedicalSupplies.find(
          (s) => s.name === supply.name
        );
        if (selected) {
          const required = parseFloat(supply.quantity);
          const available = parseFloat(selected.stockQuantity);
          if (!isNaN(required) && available < required) {
            const existing = insufficient.find(
              (item) => item.name === supply.name
            );
            if (!existing) {
              insufficient.push({
                type: "supply",
                name: supply.name,
                required,
                available,
              });
            }
          }
        }
      });
    });

    return insufficient;
  };

  // Handle form submission
  const handleSubmit = async (e, forceInsufficient = false, note = "") => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Validate required fields
      if (selectedStudents.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một học sinh");
      }

      if (!selectedTemplate) {
        throw new Error("Vui lòng chọn mẫu sự cố y tế");
      }

      if (!user || !user.id) {
        throw new Error(
          "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại."
        );
      }

      // Validate inventory data is loaded
      if (loadingInventory) {
        throw new Error(
          "Đang tải dữ liệu kho thuốc và vật tư, vui lòng đợi..."
        );
      }

      if (
        availableMedicines.length === 0 &&
        availableMedicalSupplies.length === 0
      ) {
        throw new Error(
          "Không thể tải dữ liệu kho thuốc và vật tư. Vui lòng thử lại."
        );
      }

      // Check for insufficient items
      const insufficient = checkInsufficientItems();
      if (insufficient.length > 0 && !forceInsufficient) {
        setInsufficientItems(insufficient);
        setInsufficientItemsCache(insufficient); // Lưu lại để hiển thị lại nếu cần
        setShowInsufficientWarning(false); // Đóng modal cũ nếu có
        setShowInsufficientNoteModal(true); // Mở modal nhập ghi chú
        setLoading(false);
        return;
      }

      // Helper function to find medicine ID by name
      const findMedicineIdByName = (medicineName) => {
        const medicine = availableMedicines.find(
          (m) => m.name === medicineName
        );
        return medicine ? medicine.medicineId : null;
      };
      // Helper function to find medical supply ID by name
      const findMedicalSupplyIdByName = (supplyName) => {
        const supply = availableMedicalSupplies.find(
          (s) => s.name === supplyName
        );
        return supply ? supply.supplyId : null;
      };
      // Prepare batch data
      const batchData = selectedStudents.map((student) => {
        const customizedEvent =
          customizedEvents[student.studentCode] || selectedTemplate;
        // Map medications with proper IDs
        const mappedMedications = (customizedEvent.medications || [])
          .filter((med) => med.name && med.name.trim() !== "")
          .map((med) => {
            const medicineId = findMedicineIdByName(med.name);
            return {
              id: medicineId,
              name: med.name,
              dosage: med.dosage,
              time: med.time,
              unit: med.unit,
            };
          })
          .filter((med) => med.id !== null); // Only include medications with valid IDs
        // Map medical supplies with proper IDs
        const mappedMedicalSupplies = (customizedEvent.medicalSupplies || [])
          .filter((supply) => supply.name && supply.name.trim() !== "")
          .map((supply) => {
            const supplyId = findMedicalSupplyIdByName(supply.name);
            return {
              id: supplyId,
              name: supply.name,
              quantity: supply.quantity,
              time: supply.time,
              unit: supply.unit,
            };
          })
          .filter((supply) => supply.id !== null); // Only include supplies with valid IDs
        const mappedData = {
          studentCode: student.studentCode,
          staffId: user.id,
          type: customizedEvent.type,
          severity: customizedEvent.severity,
          symptoms: customizedEvent.symptoms,
          assessment: customizedEvent.assessment,
          treatment: customizedEvent.treatment,
          followUpRequired: customizedEvent.followUpRequired,
          notes: customizedEvent.notes || "",
          medications: mappedMedications,
          medicalSupplies: mappedMedicalSupplies,
          insufficientItemsNote:
            note || customizedEvent.insufficientItemsNote || "",
        };
        return mapHealthEventToAPI(mappedData);
      });
      // Create batch health events
      const response = await createBatchHealthEvents(batchData);
      // Show success message
      setSubmitStatus("success");
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/nurse/health-events");
      }, 3000);
    } catch (error) {
      console.error("Error creating batch health events:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error.message || "Có lỗi xảy ra khi tạo sự cố y tế hàng loạt"
      );
    } finally {
      setLoading(false);
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
          Tạo sự cố y tế hàng loạt
        </h1>
      </div>

      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setBatchMode(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              batchMode
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FiUsers className="inline mr-2" />
            Chế độ hàng loạt
          </button>
          <button
            onClick={() => setBatchMode(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !batchMode
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FiAlertTriangle className="inline mr-2" />
            Chế độ đơn lẻ
          </button>
        </div>
      </div>

      {batchMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Chọn học sinh
            </h2>
            <MultiStudentSelector
              selectedStudents={selectedStudents}
              onStudentsChange={setSelectedStudents}
              allowedGrades={allowedGrades}
              maxStudents={50}
              placeholder="Tìm kiếm và chọn học sinh..."
            />
          </div>

          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <HealthEventTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>

          {/* Batch Medications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                <FiTablet className="inline mr-2" />
                Thuốc sử dụng (áp dụng cho tất cả học sinh)
              </h2>
              <button
                type="button"
                onClick={addBatchMedication}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                disabled={loadingInventory}
              >
                <FiPlus className="mr-1 h-4 w-4" /> Thêm thuốc
              </button>
            </div>

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

            {batchMedications.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên thuốc
                  </label>
                  <select
                    value={med.name}
                    onChange={(e) =>
                      handleBatchMedicationChange(index, "name", e.target.value)
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Liều lượng {med.unit && `(${med.unit})`}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={med.dosage}
                      onChange={(e) =>
                        handleBatchMedicationChange(
                          index,
                          "dosage",
                          e.target.value
                        )
                      }
                      placeholder={
                        med.unit ? `Nhập số lượng` : "Nhập liều lượng"
                      }
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thời gian
                  </label>
                  <input
                    type="text"
                    value={med.time}
                    onChange={(e) =>
                      handleBatchMedicationChange(index, "time", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Ví dụ: 09:30"
                  />
                </div>
                <div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBatchMedication(index)}
                      className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <FiX className="mr-1 h-4 w-4" /> Xóa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Batch Medical Supplies Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                <FiPackage className="inline mr-2" />
                Vật tư y tế sử dụng (áp dụng cho tất cả học sinh)
              </h2>
              <button
                type="button"
                onClick={addBatchMedicalSupply}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                disabled={loadingInventory}
              >
                <FiPlus className="mr-1 h-4 w-4" /> Thêm vật tư
              </button>
            </div>

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

            {batchMedicalSupplies.map((supply, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end border-b border-gray-100 pb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên vật tư
                  </label>
                  <select
                    value={supply.name}
                    onChange={(e) =>
                      handleBatchMedicalSupplyChange(
                        index,
                        "name",
                        e.target.value
                      )
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số lượng {supply.unit && `(${supply.unit})`}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={supply.quantity}
                    onChange={(e) =>
                      handleBatchMedicalSupplyChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder={
                      supply.unit ? `Nhập số lượng` : "Nhập số lượng"
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thời gian
                  </label>
                  <input
                    type="text"
                    value={supply.time}
                    onChange={(e) =>
                      handleBatchMedicalSupplyChange(
                        index,
                        "time",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Ví dụ: 09:30"
                  />
                </div>
                <div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBatchMedicalSupply(index)}
                      className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <FiX className="mr-1 h-4 w-4" /> Xóa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Individual Customization */}
          {selectedStudents.length > 0 && selectedTemplate && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Tùy chỉnh cho từng học sinh
              </h2>
              <div className="space-y-6">
                {selectedStudents.map((student) => {
                  const customizedEvent =
                    customizedEvents[student.studentCode] || selectedTemplate;

                  return (
                    <div
                      key={student.studentCode}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        {student.studentCode} - {student.firstName}{" "}
                        {student.lastName} (Lớp {student.className})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Triệu chứng
                          </label>
                          <textarea
                            value={customizedEvent.symptoms}
                            onChange={(e) =>
                              handleEventCustomization(
                                student.studentCode,
                                "symptoms",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            rows="3"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Đánh giá
                          </label>
                          <textarea
                            value={customizedEvent.assessment}
                            onChange={(e) =>
                              handleEventCustomization(
                                student.studentCode,
                                "assessment",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            rows="3"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Xử lý
                          </label>
                          <textarea
                            value={customizedEvent.treatment}
                            onChange={(e) =>
                              handleEventCustomization(
                                student.studentCode,
                                "treatment",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            rows="3"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ghi chú
                          </label>
                          <textarea
                            value={customizedEvent.notes || ""}
                            onChange={(e) =>
                              handleEventCustomization(
                                student.studentCode,
                                "notes",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            rows="3"
                            placeholder="Ghi chú riêng cho học sinh này..."
                          />
                        </div>
                      </div>

                      {/* Individual Medications */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FiTablet className="inline mr-1 h-4 w-4" />
                            Thuốc riêng cho học sinh này
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              addIndividualMedication(student.studentCode)
                            }
                            className="inline-flex items-center px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                          >
                            <FiPlus className="mr-1 h-3 w-3" /> Thêm
                          </button>
                        </div>
                        {customizedEvent.medications?.map((med, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-end"
                          >
                            <select
                              value={med.name}
                              onChange={(e) =>
                                handleIndividualMedicationChange(
                                  student.studentCode,
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="">Chọn thuốc</option>
                              {availableMedicines.map((medicine) => (
                                <option
                                  key={medicine.medicineId}
                                  value={medicine.name}
                                >
                                  {medicine.name} (Còn: {medicine.stockQuantity}
                                  )
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={med.dosage}
                              onChange={(e) =>
                                handleIndividualMedicationChange(
                                  student.studentCode,
                                  index,
                                  "dosage",
                                  e.target.value
                                )
                              }
                              placeholder="Liều lượng"
                              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              value={med.time}
                              onChange={(e) =>
                                handleIndividualMedicationChange(
                                  student.studentCode,
                                  index,
                                  "time",
                                  e.target.value
                                )
                              }
                              placeholder="Thời gian"
                              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeIndividualMedication(
                                  student.studentCode,
                                  index
                                )
                              }
                              className="inline-flex items-center px-2 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-50"
                            >
                              <FiX className="mr-1 h-3 w-3" /> Xóa
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Individual Medical Supplies */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <FiPackage className="inline mr-1 h-4 w-4" />
                            Vật tư riêng cho học sinh này
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              addIndividualMedicalSupply(student.studentCode)
                            }
                            className="inline-flex items-center px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                          >
                            <FiPlus className="mr-1 h-3 w-3" /> Thêm
                          </button>
                        </div>
                        {customizedEvent.medicalSupplies?.map(
                          (supply, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-end"
                            >
                              <select
                                value={supply.name}
                                onChange={(e) =>
                                  handleIndividualMedicalSupplyChange(
                                    student.studentCode,
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="">Chọn vật tư</option>
                                {availableMedicalSupplies.map((supply) => (
                                  <option
                                    key={supply.supplyId}
                                    value={supply.name}
                                  >
                                    {supply.name} - {supply.category} (Còn:{" "}
                                    {supply.stockQuantity})
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min="1"
                                value={supply.quantity}
                                onChange={(e) =>
                                  handleIndividualMedicalSupplyChange(
                                    student.studentCode,
                                    index,
                                    "quantity",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                placeholder="Số lượng"
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <input
                                type="text"
                                value={supply.time}
                                onChange={(e) =>
                                  handleIndividualMedicalSupplyChange(
                                    student.studentCode,
                                    index,
                                    "time",
                                    e.target.value
                                  )
                                }
                                placeholder="Thời gian"
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeIndividualMedicalSupply(
                                    student.studentCode,
                                    index
                                  )
                                }
                                className="inline-flex items-center px-2 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-50"
                              >
                                <FiX className="mr-1 h-3 w-3" /> Xóa
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/nurse/health-events"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={
                loading || selectedStudents.length === 0 || !selectedTemplate
              }
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Tạo sự cố hàng loạt ({selectedStudents.length} học sinh)
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng chuyển sang chế độ hàng loạt để tạo sự cố y tế cho nhiều
            học sinh cùng lúc.
          </p>
          <Link
            to="/nurse/health-events/new"
            className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tạo sự cố đơn lẻ
          </Link>
        </div>
      )}

      {/* Insufficient Items Warning Modal */}
      {showInsufficientWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Cảnh báo thiếu thuốc/vật tư
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Một số thuốc hoặc vật tư y tế không đủ số lượng trong kho:
              </p>
              <div className="space-y-2">
                {insufficientItems.map((item, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-600 dark:text-red-400"
                  >
                    <strong>{item.name}</strong>: Cần {item.required}{" "}
                    {item.type === "medicine" ? "liều" : "cái"}, chỉ còn{" "}
                    {item.available} trong kho
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowInsufficientWarning(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowInsufficientWarning(false);
                  setShowInsufficientNoteModal(true);
                  setPendingSubmit(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Tiếp tục tạo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal nhập ghi chú thiếu thuốc/vật tư */}
      {showInsufficientNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Nhập ghi chú lý do vẫn tiếp tục tạo sự cố
            </h3>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 mb-4"
              rows="3"
              value={insufficientNote}
              onChange={(e) => setInsufficientNote(e.target.value)}
              placeholder="Vui lòng nhập lý do hoặc hướng xử lý khi thiếu thuốc/vật tư..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowInsufficientNoteModal(false);
                  setInsufficientNote("");
                  setPendingSubmit(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (!insufficientNote.trim()) return;
                  setShowInsufficientNoteModal(false);
                  setPendingSubmit(false);
                  await handleSubmit(null, true, insufficientNote);
                  setInsufficientNote("");
                }}
                disabled={!insufficientNote.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Xác nhận & Tạo sự cố
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FiCheck className="mr-2" />
          Tạo sự cố y tế hàng loạt thành công! Đang chuyển hướng...
        </div>
      )}

      {submitStatus === "error" && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FiX className="mr-2" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default BatchHealthEventCreate;
