import axios from "axios";
import { mockMedicalSupplies } from "./mockSupplyData";

const API_BASE_URL = "https://localhost:7111/api/MedicalSupply";

const USE_MOCK_DATA = true; // Changed to true temporarily for testing

// Get all medical supplies
export const getAllMedicalSupplies = async () => {
  console.log("🔍 getAllMedicalSupplies called, USE_MOCK_DATA:", USE_MOCK_DATA);

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("📦 Returning mock medical supplies:", mockMedicalSupplies);
    return mockMedicalSupplies;
  }

  try {
    console.log("🌐 Making API call to:", API_BASE_URL);
    const response = await axios.get(API_BASE_URL);
    console.log("✅ API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching medical supplies:", error);
    // Fallback to mock data if API fails
    console.log("🔄 Falling back to mock data...");
    return mockMedicalSupplies;
  }
};

// Get active medical supplies only
export const getActiveMedicalSupplies = async () => {
  console.log(
    "🔍 getActiveMedicalSupplies called, USE_MOCK_DATA:",
    USE_MOCK_DATA
  );

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const activeSupplies = mockMedicalSupplies.filter(
      (supply) => supply.isActive
    );
    console.log("📦 Returning active mock supplies:", activeSupplies);
    return activeSupplies;
  }

  try {
    console.log("🌐 Making API call to:", `${API_BASE_URL}/active`);
    const response = await axios.get(`${API_BASE_URL}/active`);
    console.log("✅ API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching active medical supplies:", error);
    // Fallback to mock data if API fails
    console.log("🔄 Falling back to mock data...");
    return mockMedicalSupplies.filter((supply) => supply.isActive);
  }
};

// Get medical supply by ID
export const getMedicalSupplyById = async (id) => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const supply = mockMedicalSupplies.find((s) => s.supplyId === id);
    if (!supply) {
      throw new Error("Medical supply not found");
    }
    return supply;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medical supply:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch medical supply"
    );
  }
};

// Create new medical supply
export const createMedicalSupply = async (supplyData) => {
  try {
    const response = await axios.post(API_BASE_URL, supplyData);
    return response.data;
  } catch (error) {
    console.error("Error creating medical supply:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create medical supply"
    );
  }
};

// Update medical supply
export const updateMedicalSupply = async (id, supplyData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, supplyData);
    return response.data;
  } catch (error) {
    console.error("Error updating medical supply:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update medical supply"
    );
  }
};

// Delete medical supply
export const deleteMedicalSupply = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting medical supply:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete medical supply"
    );
  }
};

// Check equipment availability for health check items
export const checkEquipmentAvailability = async (requiredEquipment) => {
  try {
    console.log(
      "🔍 checkEquipmentAvailability called with:",
      requiredEquipment
    );
    const supplies = await getActiveMedicalSupplies();
    console.log("📦 Got supplies:", supplies);

    const availabilityCheck = requiredEquipment.map((equipmentName) => {
      console.log("🔍 Checking equipment:", equipmentName);

      // Try to find exact match first
      let supply = supplies.find(
        (s) =>
          s.name.toLowerCase().trim() === equipmentName.toLowerCase().trim()
      );
      console.log("🎯 Exact match found:", supply);

      // If no exact match, try partial matching
      if (!supply) {
        supply = supplies.find(
          (s) =>
            s.name.toLowerCase().includes(equipmentName.toLowerCase()) ||
            equipmentName.toLowerCase().includes(s.name.toLowerCase())
        );
        console.log("🔍 Partial match found:", supply);
      }

      // If still no match, try specific equipment mappings based on health check data
      if (!supply) {
        const equipmentMappings = {
          // Physical examination mappings
          "thước đo chiều cao": "thước đo chiều cao",
          "cân điện tử": "cân điện tử y tế",
          "thước đo": "thước đo chiều cao",
          cân: "cân điện tử y tế",

          // Vision examination mappings
          "bảng thị lực snellen": "bảng đo thị lực snellen",
          "bảng thị lực": "bảng đo thị lực snellen",
          "đèn khám": "đèn soi mắt",
          "đèn soi": "đèn soi mắt",

          // Oral examination mappings
          "gương nha khoa": "gương soi răng",
          "gương nhỏ": "gương soi răng",
          gương: "gương soi răng",
          "que gỗ": "que gỗ khám răng",

          // Cardiovascular mappings
          "ống nghe": "ống nghe y tế",
          "máy đo huyết áp": "máy đo huyết áp điện tử",

          // Musculoskeletal mappings
          "búa phản xạ": "búa gõ phản xạ",
          búa: "búa gõ phản xạ",

          // Dermatology mappings
          "kính lúp": "kính lúp da liễu",
          "đèn uv": "đèn wood",

          // Neurological mappings
          "đèn pin": "đèn pin thần kinh",

          // Mental health mappings
          "bảng câu hỏi": "bảng đánh giá tâm lý",
          "phiếu đánh giá": "phiếu đánh giá hành vi",

          // General equipment
          "nhiệt kế": "nhiệt kế điện tử",
          "găng tay": "găng tay y tế",
          "găng tay y tế": "găng tay y tế",
          "khẩu trang": "khẩu trang y tế",
        };

        const mappedName = equipmentMappings[equipmentName.toLowerCase()];
        console.log("🗺️ Mapped name for", equipmentName, ":", mappedName);
        if (mappedName) {
          supply = supplies.find((s) =>
            s.name.toLowerCase().includes(mappedName.toLowerCase())
          );
          console.log("🎯 Mapped match found:", supply);
        }
      }

      const result = {
        name: equipmentName,
        available: !!supply,
        stockQuantity: supply?.stockQuantity || 0,
        isInStock: supply ? supply.stockQuantity > 0 : false,
        supply: supply || null,
        mappedSupplyName: supply?.name || null,
      };

      console.log("📋 Equipment check result:", result);
      return result;
    });

    const unavailableEquipment = availabilityCheck.filter(
      (eq) => !eq.available
    );
    const outOfStockEquipment = availabilityCheck.filter(
      (eq) => eq.available && !eq.isInStock
    );

    const result = {
      equipment: availabilityCheck,
      hasUnavailable: unavailableEquipment.length > 0,
      hasOutOfStock: outOfStockEquipment.length > 0,
      unavailableEquipment,
      outOfStockEquipment,
      allAvailable:
        unavailableEquipment.length === 0 && outOfStockEquipment.length === 0,
    };

    console.log("🎯 Final equipment status:", result);
    return result;
  } catch (error) {
    console.error("❌ Error checking equipment availability:", error);
    throw error;
  }
};

// Get equipment by category
export const getEquipmentByCategory = async (category) => {
  try {
    const supplies = await getActiveMedicalSupplies();
    return supplies.filter(
      (supply) => supply.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching equipment by category:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch equipment by category"
    );
  }
};

export default {
  getAllMedicalSupplies,
  getActiveMedicalSupplies,
  getMedicalSupplyById,
  createMedicalSupply,
  updateMedicalSupply,
  deleteMedicalSupply,
  checkEquipmentAvailability,
  getEquipmentByCategory,
};
