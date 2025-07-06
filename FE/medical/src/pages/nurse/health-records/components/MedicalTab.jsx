import React from "react";
import { FiAlertCircle, FiHeart, FiClock } from "react-icons/fi";
import { InfoCard, DataRow, EditableField } from "./SharedComponents";

const MedicalTab = ({ healthProfile, isEditing, editData, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Dị ứng" icon={FiAlertCircle}>
        <div className="space-y-3">
          <DataRow
            label="Có dị ứng"
            value={healthProfile.hasAllergies}
            type="boolean"
          />
          <EditableField
            label="Chi tiết dị ứng"
            field="allergyDetails"
            value={healthProfile.allergyDetails}
            type="textarea"
            placeholder="Mô tả chi tiết về dị ứng..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>

      <InfoCard title="Bệnh mãn tính" icon={FiHeart}>
        <div className="space-y-3">
          <DataRow
            label="Có bệnh mãn tính"
            value={healthProfile.hasChronicDiseases}
            type="boolean"
          />
          <EditableField
            label="Chi tiết bệnh mãn tính"
            field="chronicDetails"
            value={healthProfile.chronicDetails}
            type="textarea"
            placeholder="Mô tả chi tiết về bệnh mãn tính..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>

      <InfoCard
        title="Điều trị trước đây"
        icon={FiClock}
        className="lg:col-span-2"
      >
        <div className="space-y-3">
          <DataRow
            label="Đã từng điều trị"
            value={healthProfile.hasPreviousTreatment}
            type="boolean"
          />
          <EditableField
            label="Chi tiết điều trị"
            field="treatmentDetails"
            value={healthProfile.treatmentDetails}
            type="textarea"
            placeholder="Mô tả chi tiết về điều trị trước đây..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>
    </div>
  );
};

export default MedicalTab;
