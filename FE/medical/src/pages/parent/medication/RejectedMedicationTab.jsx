import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const RejectedMedicationTab = ({ medications, searchTerm }) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // Group medications by student, medicine, and refusal reason
  const groupedMedications = useMemo(() => {
    const groups = {};

    medications.forEach((med) => {
      // Create a key for grouping: student + medicine + refusal reason
      const studentKey = `${med.studentName}_${med.studentCode}`;
      const medicineKey = med.medicineName || med.medicationName;
      const refusalKey = med.refusalReason || "Không có lý do";

      // Special grouping for "missing medicine" cases
      const isMissingMedicine =
        refusalKey.toLowerCase().includes("thiếu thuốc") ||
        refusalKey.toLowerCase().includes("không có thuốc") ||
        refusalKey.toLowerCase().includes("hết thuốc");

      const groupKey = isMissingMedicine
        ? `${studentKey}_${medicineKey}_missing_medicine`
        : `${studentKey}_${medicineKey}_${refusalKey}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          studentName: med.studentName,
          studentCode: med.studentCode,
          className: med.className || med.class,
          medicineName: medicineKey,
          refusalReason: refusalKey,
          isMissingMedicine,
          medications: [],
          totalCount: 0,
          latestTimestamp: null,
          periods: new Set(), // Track different periods
          dosages: new Set(), // Track different dosages
        };
      }

      groups[groupKey].medications.push(med);
      groups[groupKey].totalCount++;

      // Track latest timestamp
      if (
        med.timestamp &&
        (!groups[groupKey].latestTimestamp ||
          new Date(med.timestamp) > new Date(groups[groupKey].latestTimestamp))
      ) {
        groups[groupKey].latestTimestamp = med.timestamp;
      }

      // Track periods and dosages
      if (med.timeOfDay) groups[groupKey].periods.add(med.timeOfDay);
      if (med.period && med.period !== "N/A")
        groups[groupKey].periods.add(med.period);
      if (med.dosage)
        groups[groupKey].dosages.add(
          `${med.dosage} ${med.dosageUnit || "viên"}`
        );
    });

    return Object.values(groups);
  }, [medications]);

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedMedications;

    return groupedMedications.filter((group) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (group.studentName &&
          group.studentName.toLowerCase().includes(searchLower)) ||
        (group.studentCode &&
          group.studentCode.toLowerCase().includes(searchLower)) ||
        (group.className &&
          group.className.toLowerCase().includes(searchLower)) ||
        (group.medicineName &&
          group.medicineName.toLowerCase().includes(searchLower)) ||
        (group.refusalReason &&
          group.refusalReason.toLowerCase().includes(searchLower))
      );
    });
  }, [groupedMedications, searchTerm]);

  const toggleGroup = (groupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getPeriodDisplay = (periods) => {
    if (periods.size === 0) return "Không có thông tin";

    const periodMap = {
      morning: "Sáng",
      afternoon: "Chiều",
      noon: "Trưa",
      evening: "Tối",
    };

    const displayPeriods = Array.from(periods).map((p) => periodMap[p] || p);
    return displayPeriods.join(", ");
  };

  const getDosageDisplay = (dosages) => {
    if (dosages.size === 0) return "Không có thông tin";
    return Array.from(dosages).join(", ");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Học sinh
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Thuốc
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Thông tin từ chối
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGroups.map((group) => (
              <React.Fragment key={group.key}>
                {/* Group Header Row */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {group.studentName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {group.className}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {group.medicineName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="mb-1 text-red-600 dark:text-red-400">
                          <span className="font-semibold">Lý do từ chối:</span>{" "}
                          <span>{group.refusalReason}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      {expandedGroups.has(group.key)
                        ? "Thu gọn"
                        : "Xem chi tiết"}
                    </button>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedGroups.has(group.key) && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan="4" className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="grid gap-3">
                          {group.medications.map((medication, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm">
                                    <div className="mb-1">
                                      <span className="font-semibold">
                                        Liều lượng:
                                      </span>{" "}
                                      {medication.dosage
                                        ? `${medication.dosage} ${
                                            medication.dosageUnit || "viên"
                                          }`
                                        : "Không có thông tin"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="font-semibold">
                                        Tần suất:
                                      </span>{" "}
                                      {medication.frequency
                                        ? `${medication.frequency} lần/ngày`
                                        : "Không có thông tin"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="font-semibold">
                                        Buổi:
                                      </span>{" "}
                                      {medication.timeOfDay === "morning"
                                        ? "Sáng"
                                        : medication.timeOfDay === "afternoon"
                                        ? "Chiều"
                                        : medication.timeOfDay === "noon"
                                        ? "Trưa"
                                        : medication.timeOfDay === "evening"
                                        ? "Tối"
                                        : medication.period &&
                                          medication.period !== "N/A"
                                        ? medication.period
                                        : medication.timeOfDay ||
                                          "Không có thông tin"}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm">
                                    <div className="mb-1">
                                      <span className="font-semibold">
                                        Hướng dẫn:
                                      </span>{" "}
                                      {medication.instructions
                                        ? medication.instructions
                                        : "Không có hướng dẫn"}
                                    </div>
                                    {medication.timestamp && (
                                      <div className="mb-1 text-red-600 dark:text-red-400">
                                        <span className="font-semibold">
                                          Thời gian từ chối:
                                        </span>{" "}
                                        {new Date(
                                          medication.timestamp
                                        ).toLocaleString("vi-VN")}
                                      </div>
                                    )}
                                    <div className="mb-1">
                                      <span className="font-semibold">
                                        Mã thuốc:
                                      </span>{" "}
                                      {medication.medicineRequestItemId ||
                                        "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            Không tìm thấy yêu cầu nào
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedMedicationTab;
