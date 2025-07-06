import React from "react";
import { FiActivity } from "react-icons/fi";
import { InfoCard, EditableField } from "./SharedComponents";

const PhysicalTab = ({
  healthProfile,
  calculateBMI,
  getBMIStatus,
  isEditing,
  editData,
  onInputChange,
}) => {
  const bmi = calculateBMI(healthProfile.height, healthProfile.weight);
  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="grid grid-cols-1 gap-6">
      <InfoCard title="Chỉ số cơ thể" icon={FiActivity}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {healthProfile.height || 0}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              cm - Chiều cao
            </div>
          </div>
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {healthProfile.weight || 0}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              kg - Cân nặng
            </div>
          </div>
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {bmi}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              BMI - {bmiStatus.label}
            </div>
          </div>
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {healthProfile.bloodType || "N/A"}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Nhóm máu
            </div>
          </div>
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {healthProfile.bloodPressure || "N/A"}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Huyết áp
            </div>
          </div>
          <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {healthProfile.heartRate || 0}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              bpm - Nhịp tim
            </div>
          </div>
        </div>

        <div className="mt-6">
          <EditableField
            label="Thông tin liên hệ khẩn cấp"
            field="emergencyContact"
            value={healthProfile.emergencyContact}
            type="textarea"
            placeholder="Nhập thông tin liên hệ khẩn cấp..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>
    </div>
  );
};

export default PhysicalTab;
