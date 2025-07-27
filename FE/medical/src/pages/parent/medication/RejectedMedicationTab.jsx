import React from "react";
import { Link } from "react-router-dom";

const RejectedMedicationTab = ({ medications, searchTerm }) => {
  console.log("RejectedMedicationTab received medications:", medications);
  console.log("RejectedMedicationTab received searchTerm:", searchTerm);

  // Filter medications based on search term
  const filteredMedications = medications.filter((med) => {
    if (!searchTerm) return true; // Show all if no search term

    const medicationName = med.medicineName || med.medicationName;
    const matchesSearch =
      (medicationName &&
        medicationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.id && med.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.studentName &&
        med.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.className &&
        med.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.medicineRequestItemId &&
        med.medicineRequestItemId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  console.log("Filtered medications:", filteredMedications);
  console.log("Filtered medications length:", filteredMedications.length);

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
            {filteredMedications.map((medication, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {medication.studentName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {medication.className || medication.class}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {medication.medicineName}
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {medication.medicineName}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      <div className="mb-1">
                        <span className="font-semibold">Liều lượng:</span>{" "}
                        {medication.dosage
                          ? `${medication.dosage} ${
                              medication.dosageUnit || "viên"
                            }`
                          : "Không có thông tin"}
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold">Tần suất:</span>{" "}
                        {medication.frequency
                          ? `${medication.frequency} lần/ngày`
                          : "Không có thông tin"}
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold">Buổi:</span>{" "}
                        {medication.timeOfDay === "morning"
                          ? "Sáng"
                          : medication.timeOfDay === "afternoon"
                          ? "Chiều"
                          : medication.timeOfDay === "noon"
                          ? "Trưa"
                          : medication.timeOfDay === "evening"
                          ? "Tối"
                          : medication.period && medication.period !== "N/A"
                          ? medication.period
                          : medication.timeOfDay || "Không có thông tin"}
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold">Hướng dẫn:</span>{" "}
                        {medication.instructions
                          ? medication.instructions
                          : "Không có hướng dẫn"}
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold">Lý do từ chối:</span>{" "}
                        <span className="text-red-600 dark:text-red-400">
                          {medication.refusalReason || "Không có lý do"}
                        </span>
                      </div>
                      {medication.timestamp && (
                        <div className="mb-1">
                          <span className="font-semibold">
                            Thời gian từ chối:
                          </span>{" "}
                          {new Date(medication.timestamp).toLocaleString(
                            "vi-VN"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {(() => {
                    const detailId = medication.medicineRequestItemId
                      ? `MED${medication.medicineRequestItemId}`
                      : medication.id;

                    return detailId &&
                      detailId !== "undefined" &&
                      !detailId.includes("undefined") ? (
                      <Link
                        to={`/parent/medication/detail/${detailId}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Chi tiết
                      </Link>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed">
                        Chi tiết
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedMedicationTab;
