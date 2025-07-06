import React from "react";
import { FiEye, FiHeadphones } from "react-icons/fi";
import { InfoCard, DataRow, EditableField } from "./SharedComponents";

const SensoryTab = ({ 
  healthProfile, 
  isEditing, 
  editData, 
  onInputChange 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Thị lực" icon={FiEye}>
        <div className="space-y-3">
          <DataRow
            label="Có vấn đề về mắt"
            value={healthProfile.hasVisionIssues}
            type="boolean"
          />
          <DataRow label="Mắt trái" value={healthProfile.leftEye} />
          <DataRow label="Mắt phải" value={healthProfile.rightEye} />
          <EditableField
            label="Ghi chú thị lực"
            field="visionNotes"
            value={healthProfile.visionNotes}
            type="textarea"
            placeholder="Ghi chú về tình trạng thị lực..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>

      <InfoCard title="Thính lực" icon={FiHeadphones}>
        <div className="space-y-3">
          <DataRow
            label="Có vấn đề về tai"
            value={healthProfile.hasHearingIssues}
            type="boolean"
          />
          <DataRow label="Tai trái" value={healthProfile.leftEar} />
          <DataRow label="Tai phải" value={healthProfile.rightEar} />
          <EditableField
            label="Ghi chú thính lực"
            field="hearingNotes"
            value={healthProfile.hearingNotes}
            type="textarea"
            placeholder="Ghi chú về tình trạng thính lực..."
            isEditing={isEditing}
            editData={editData}
            onInputChange={onInputChange}
          />
        </div>
      </InfoCard>
    </div>
  );
};

export default SensoryTab; 