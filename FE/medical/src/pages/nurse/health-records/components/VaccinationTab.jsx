import React from "react";
import { FiShield } from "react-icons/fi";
import { InfoCard, DataRow, EditableField } from "./SharedComponents";

const VaccinationTab = ({
  healthProfile,
  isEditing,
  editData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <InfoCard title="Tiêm chủng" icon={FiShield}>
        <div className="space-y-3">
          <DataRow
            label="Tiêm chủng đầy đủ"
            value={healthProfile.hasCompleteVaccinations}
          />
          <EditableField
            label="Chi tiết tiêm chủng"
            field="vaccinationDetails"
            value={healthProfile.vaccinationDetails}
            type="textarea"
            placeholder="Mô tả chi tiết về tình trạng tiêm chủng..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Danh sách vaccine
            </label>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {healthProfile.vaccinations || "Chưa có thông tin chi tiết"}
              </p>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

export default VaccinationTab;
