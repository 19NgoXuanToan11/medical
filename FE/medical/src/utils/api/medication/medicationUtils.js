// Utility functions for medication calculations

/**
 * Calculate dosage per administration based on total dosage and frequency
 * @param {string} totalDosage - Total dosage string (e.g., "3 viên", "2.5 ml")
 * @param {string|number} frequency - Frequency string or number (e.g., "2 lần/ngày", "2", "as_needed")
 * @returns {string} Calculated dosage per administration
 */
export const calculateDosagePerAdministration = (totalDosage, frequency) => {
  if (!totalDosage || !frequency) return "";

  // Extract dosage number and unit from total dosage string
  const dosageMatch = totalDosage.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
  if (!dosageMatch) return totalDosage;

  const totalDosageNumber = parseFloat(dosageMatch[1]);
  const unit = dosageMatch[2];

  // Handle "as needed" or "khi cần thiết" cases
  if (
    frequency === "khi cần thiết" ||
    frequency === "as_needed" ||
    (typeof frequency === "string" && frequency.includes("cần thiết"))
  ) {
    return `${totalDosageNumber} ${unit}/lần (khi cần)`;
  }

  // Convert frequency to number - improved parsing
  let frequencyNumber = 1;
  if (typeof frequency === "string") {
    // Try to parse as direct number first
    const numericFreq = parseInt(frequency);
    if (!isNaN(numericFreq) && numericFreq > 0) {
      frequencyNumber = numericFreq;
    } else {
      // Fallback to old logic for text-based frequencies
      if (frequency.includes("2")) frequencyNumber = 2;
      else if (frequency.includes("3")) frequencyNumber = 3;
      else if (frequency.includes("4")) frequencyNumber = 4;
    }
  } else if (typeof frequency === "number" && frequency > 0) {
    frequencyNumber = frequency;
  }

  // Calculate dosage per administration
  const dosagePerTime = totalDosageNumber / frequencyNumber;
  const roundedDosage =
    dosagePerTime % 1 === 0
      ? dosagePerTime.toString()
      : dosagePerTime.toFixed(1);

  return `${roundedDosage} ${unit}/lần`;
};

/**
 * NEW: Calculate dosage per administration from separate dosage, dosageUnit, and frequency
 * @param {number|string} dosage - Numeric dosage amount
 * @param {string} dosageUnit - Unit of dosage (e.g., "viên", "mg", "gói")
 * @param {number|string} frequency - Number of times per day
 * @returns {string} Calculated dosage per administration
 */
export const calculateDosagePerTime = (dosage, dosageUnit, frequency) => {
  if (!dosage || !frequency) return "N/A";

  const dosageNumber = typeof dosage === "string" ? parseFloat(dosage) : dosage;
  const frequencyNumber =
    typeof frequency === "string" ? parseInt(frequency) : frequency;

  if (isNaN(dosageNumber) || isNaN(frequencyNumber) || frequencyNumber <= 0) {
    return "N/A";
  }

  // Calculate dosage per administration
  const dosagePerTime = dosageNumber / frequencyNumber;
  const roundedDosage =
    dosagePerTime % 1 === 0
      ? dosagePerTime.toString()
      : dosagePerTime.toFixed(1);

  return `${roundedDosage} ${dosageUnit}/lần`;
};

/**
 * NEW: Format total dosage display
 * @param {number|string} dosage - Numeric dosage amount
 * @param {string} dosageUnit - Unit of dosage
 * @returns {string} Formatted total dosage
 */
export const formatTotalDosage = (dosage, dosageUnit) => {
  if (!dosage) return "N/A";
  return `${dosage} ${dosageUnit || "viên"}`;
};

/**
 * NEW: Format frequency display
 * @param {number|string} frequency - Number of times per day
 * @returns {string} Formatted frequency
 */
export const formatFrequencyDisplay = (frequency) => {
  if (!frequency) return "N/A";

  const frequencyNumber =
    typeof frequency === "string" ? parseInt(frequency) : frequency;

  if (isNaN(frequencyNumber) || frequencyNumber <= 0) {
    return "N/A";
  }

  return `${frequencyNumber} lần/ngày`;
};

/**
 * Format frequency text to be more consistent
 * @param {string|number} frequency - Frequency value
 * @returns {string} Formatted frequency text
 */
export const formatFrequency = (frequency) => {
  if (typeof frequency === "number") {
    return `${frequency} lần/ngày`;
  }

  if (typeof frequency === "string") {
    // Check if it's a number string (e.g., "3", "2", "1")
    const numericFrequency = parseInt(frequency);
    if (!isNaN(numericFrequency) && numericFrequency > 0) {
      return `${numericFrequency} lần/ngày`;
    }

    // Convert old format to new format
    if (frequency === "once") return "1 lần/ngày";
    if (frequency === "twice") return "2 lần/ngày";
    if (frequency === "thrice") return "3 lần/ngày";
    if (frequency === "four") return "4 lần/ngày";
    if (frequency === "as_needed") return "Khi cần thiết";

    // Check if already contains "lần/ngày"
    if (frequency.includes("lần/ngày")) return frequency;

    // Return as is if already in correct format
    return frequency;
  }

  return "1 lần/ngày";
};

/**
 * Get medication administration summary
 * @param {string} totalDosage - Total dosage string
 * @param {string|number} frequency - Frequency value
 * @returns {object} Object containing formatted dosage info
 */
export const getMedicationSummary = (totalDosage, frequency) => {
  return {
    totalDosage,
    frequency: formatFrequency(frequency),
    dosagePerAdministration: calculateDosagePerAdministration(
      totalDosage,
      frequency
    ),
  };
};
