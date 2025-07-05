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
    frequency === "as_needed" ||
    (typeof frequency === "string" && frequency.includes("cần thiết"))
  ) {
    return `${totalDosageNumber} ${unit}/lần (khi cần)`;
  }

  // Convert frequency to number
  let frequencyNumber = 1;
  if (typeof frequency === "string") {
    if (frequency.includes("2")) frequencyNumber = 2;
    else if (frequency.includes("3")) frequencyNumber = 3;
    else if (frequency.includes("4")) frequencyNumber = 4;
  } else if (typeof frequency === "number") {
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
