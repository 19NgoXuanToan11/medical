import React from "react";

const MedicationInfoStep = ({
  medications,
  handleMedicationChange,
  handleTimeOfDayChange,
  handleFileChange,
  addMedication,
  removeMedication,
  getMaxTimeSlots,
  canSelectTimeSlot,
}) => {
  return (
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
        <React.Fragment key={medication.id}>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
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
                    <span className="text-red-500 dark:text-red-400">*</span>
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
                    <span className="text-red-500 dark:text-red-400">*</span>
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
                      value: "sáng",
                      label: "Buổi sáng",
                      desc: "(6:00 - 11:00)",
                    },
                    {
                      value: "trưa",
                      label: "Buổi trưa",
                      desc: "(11:00 - 14:00)",
                    },
                    {
                      value: "chiều",
                      label: "Buổi chiều",
                      desc: "(14:00 - 18:00)",
                    },
                    {
                      value: "khi cần thiết",
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
                          ⚠️ Lỗi: Tần suất {medication.frequency} lần/ngày cần
                          chọn đúng {getMaxTimeSlots(medication.frequency)} thời
                          điểm
                        </span>
                        <br />
                        Hiện tại đã chọn {medication.timeOfDay.length}/
                        {getMaxTimeSlots(medication.frequency)} thời điểm. Vui
                        lòng chọn{" "}
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
                        {getMaxTimeSlots(medication.frequency)} thời điểm (đã
                        đủ) ✓
                      </p>
                      {medication.dosage && medication.dosageUnit && (
                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                          {(() => {
                            const totalDosage = parseFloat(medication.dosage);
                            const frequency = parseInt(medication.frequency);
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

          {/* Nút thêm thuốc sau mỗi medication item */}
          <div className="flex justify-center mt-4 mb-2">
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors text-sm shadow-sm"
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
        </React.Fragment>
      ))}
    </div>
  );
};

export default MedicationInfoStep;
