/**
 * Utility functions for determining medicine and medical supply units
 */

// Medicine unit mapping based on medicine name/type
const medicineUnitsMap = {
  // Common medicine units
  paracetamol: "viên",
  acetaminophen: "viên",
  ibuprofen: "viên",
  aspirin: "viên",
  amoxicillin: "viên",
  cetirizine: "viên",
  loratadine: "viên",
  prednisolone: "viên",
  metformin: "viên",
  amlodipine: "viên",
  atorvastatin: "viên",
  omeprazole: "viên",
  salbutamol: "ml",
  "cough syrup": "ml",
  syrup: "ml",
  solution: "ml",
  drops: "giọt",
  "eye drops": "giọt",
  "ear drops": "giọt",
  cream: "g",
  ointment: "g",
  gel: "g",
  tablet: "viên",
  capsule: "viên",
  inhaler: "lần xịt",
  spray: "lần xịt",
  injection: "ml",
  vaccine: "liều",
  insulin: "đơn vị",
  patch: "miếng",
};

// Medical supply unit mapping based on category/name
const medicalSupplyUnitsMap = {
  // Diagnostic equipment
  "nhiệt kế": "cái",
  thermometer: "cái",
  "blood pressure monitor": "cái",
  stethoscope: "cái",
  otoscope: "cái",
  ophthalmoscope: "cái",
  "reflex hammer": "cái",
  "measuring tape": "cái",
  scale: "cái",
  "height meter": "cái",

  // Consumable supplies
  "bông gòn": "cái",
  cotton: "cái",
  gauze: "cái",
  bandage: "cuộn",
  plaster: "cái",
  syringe: "cái",
  needle: "cái",
  gloves: "đôi",
  mask: "cái",
  alcohol: "ml",
  antiseptic: "ml",
  iodine: "ml",
  "hydrogen peroxide": "ml",
  saline: "ml",
  swab: "cái",
  "cotton swab": "cái",
  "tongue depressor": "cái",
  "specimen container": "cái",
  "urine cup": "cái",
  "test strip": "cái",
  lancet: "cái",
  tourniquet: "cái",
  "ice pack": "cái",
  "hot pack": "cái",
  "first aid kit": "bộ",
  "emergency kit": "bộ",

  // Wound care
  "băng y tế": "cuộn",
  "medical tape": "cuộn",
  "surgical tape": "cuộn",
  dressing: "cái",
  "wound pad": "cái",
  compress: "cái",

  // Protective equipment
  "face shield": "cái",
  goggles: "cái",
  apron: "cái",
  cap: "cái",
  "shoe cover": "đôi",

  // Cleaning supplies
  disinfectant: "ml",
  "hand sanitizer": "ml",
  soap: "ml",
  tissue: "hộp",
  "paper towel": "cuộn",
  "wet wipe": "cái",

  // Storage and organization
  "medicine box": "cái",
  "storage container": "cái",
  tray: "cái",
  basket: "cái",
  bag: "cái",

  // Default categories
  "chẩn đoán": "cái",
  "sơ cứu": "cái",
  "bảo hộ": "cái",
  "vệ sinh": "cái",
  "tiêu hao": "cái",
  "dụng cụ": "cái",
  "thiết bị": "cái",
};

/**
 * Get medicine unit based on medicine name
 * @param {string} medicineName - Name of the medicine
 * @returns {string} Unit for the medicine
 */
export const getMedicineUnit = (medicineName) => {
  if (!medicineName) return "viên";

  const nameLower = medicineName.toLowerCase();

  // Check direct matches first
  for (const [key, unit] of Object.entries(medicineUnitsMap)) {
    if (nameLower.includes(key)) {
      return unit;
    }
  }

  // Check for common patterns
  if (nameLower.includes("syrup") || nameLower.includes("siro")) {
    return "ml";
  }

  if (nameLower.includes("drops") || nameLower.includes("giọt")) {
    return "giọt";
  }

  if (
    nameLower.includes("cream") ||
    nameLower.includes("kem") ||
    nameLower.includes("gel") ||
    nameLower.includes("ointment")
  ) {
    return "g";
  }

  if (
    nameLower.includes("inhaler") ||
    nameLower.includes("spray") ||
    nameLower.includes("xịt")
  ) {
    return "lần xịt";
  }

  if (nameLower.includes("injection") || nameLower.includes("tiêm")) {
    return "ml";
  }

  if (nameLower.includes("vaccine") || nameLower.includes("vắc xin")) {
    return "liều";
  }

  // Default to tablets/pills
  return "viên";
};

/**
 * Get medical supply unit based on supply name and category
 * @param {string} supplyName - Name of the medical supply
 * @param {string} category - Category of the medical supply
 * @returns {string} Unit for the medical supply
 */
export const getMedicalSupplyUnit = (supplyName, category) => {
  if (!supplyName && !category) return "cái";

  const nameLower = (supplyName || "").toLowerCase();
  const categoryLower = (category || "").toLowerCase();

  // Check supply name first
  for (const [key, unit] of Object.entries(medicalSupplyUnitsMap)) {
    if (nameLower.includes(key)) {
      return unit;
    }
  }

  // Check category
  for (const [key, unit] of Object.entries(medicalSupplyUnitsMap)) {
    if (categoryLower.includes(key)) {
      return unit;
    }
  }

  // Check for common patterns in name
  if (
    nameLower.includes("alcohol") ||
    nameLower.includes("antiseptic") ||
    nameLower.includes("saline") ||
    nameLower.includes("solution")
  ) {
    return "ml";
  }

  if (
    nameLower.includes("bandage") ||
    nameLower.includes("băng") ||
    nameLower.includes("tape") ||
    nameLower.includes("băng dính")
  ) {
    return "cuộn";
  }

  if (
    nameLower.includes("gloves") ||
    nameLower.includes("găng tay") ||
    nameLower.includes("shoe cover") ||
    nameLower.includes("bao giày")
  ) {
    return "đôi";
  }

  if (
    nameLower.includes("kit") ||
    nameLower.includes("bộ") ||
    nameLower.includes("set")
  ) {
    return "bộ";
  }

  if (nameLower.includes("box") || nameLower.includes("hộp")) {
    return "hộp";
  }

  if (nameLower.includes("roll") || nameLower.includes("cuộn")) {
    return "cuộn";
  }

  // Default to pieces
  return "cái";
};

/**
 * Format dosage display with unit
 * @param {string} dosage - Dosage amount
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted dosage display
 */
export const formatDosageWithUnit = (dosage, unit) => {
  if (!dosage) return unit ? `${unit}` : "";
  if (!unit) return dosage;

  // Check if dosage already contains unit
  if (dosage.includes(unit)) {
    return dosage;
  }

  return `${dosage} ${unit}`;
};

/**
 * Extract numeric value from dosage string
 * @param {string} dosage - Dosage string (e.g., "2 viên", "5ml")
 * @returns {string} Numeric value only
 */
export const extractDosageNumber = (dosage) => {
  if (!dosage) return "";

  // Extract numbers from the beginning of the string
  const match = dosage.match(/^\d+(\.\d+)?/);
  return match ? match[0] : "";
};

/**
 * Get placeholder text for dosage input
 * @param {string} unit - Unit of measurement
 * @returns {string} Placeholder text
 */
export const getDosagePlaceholder = (unit) => {
  if (!unit) return "Nhập liều lượng";

  switch (unit) {
    case "viên":
      return `Số lượng (${unit})`;
    case "ml":
      return `Thể tích (${unit})`;
    case "g":
      return `Khối lượng (${unit})`;
    case "giọt":
      return `Số giọt (${unit})`;
    case "lần xịt":
      return `Số lần (${unit})`;
    case "liều":
      return `Số liều (${unit})`;
    case "đơn vị":
      return `Đơn vị (${unit})`;
    case "cái":
      return `Số lượng (${unit})`;
    case "cuộn":
      return `Số cuộn (${unit})`;
    case "đôi":
      return `Số đôi (${unit})`;
    case "bộ":
      return `Số bộ (${unit})`;
    case "hộp":
      return `Số hộp (${unit})`;
    case "miếng":
      return `Số miếng (${unit})`;
    default:
      return `Số lượng (${unit})`;
  }
};
