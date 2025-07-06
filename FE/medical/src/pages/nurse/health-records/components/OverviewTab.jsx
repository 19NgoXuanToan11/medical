import React from "react";
import { FiUser, FiUsers } from "react-icons/fi";
import { InfoCard, DataRow } from "./SharedComponents";

const OverviewTab = ({ healthProfile, formatDate }) => {
  const student = healthProfile.student;
  const mainParent =
    student?.parents?.find((p) => p.isMainContact) || student?.parents?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Student Information */}
      <InfoCard title="Thông tin học sinh" icon={FiUser}>
        <div className="space-y-3">
          <DataRow label="Mã học sinh" value={student?.studentCode} />
          <DataRow
            label="Họ tên"
            value={`${student?.firstName || ""} ${
              student?.lastName || ""
            }`.trim()}
          />
          <DataRow label="Ngày sinh" value={formatDate(student?.dateOfBirth)} />
          <DataRow label="Giới tính" value={student?.gender} />
          <DataRow label="Lớp" value={student?.className} />
          <DataRow label="Khối" value={student?.gradeLevel} />
          <DataRow label="Địa chỉ" value={student?.address} />
          <DataRow
            label="Liên hệ khẩn cấp"
            value={healthProfile.emergencyContact}
          />
        </div>
      </InfoCard>

      {/* Parent Information */}
      <InfoCard title="Thông tin phụ huynh" icon={FiUsers}>
        {mainParent ? (
          <div className="space-y-3">
            <DataRow
              label="Họ tên"
              value={`${mainParent.firstName || ""} ${
                mainParent.lastName || ""
              }`.trim()}
            />
            <DataRow label="Mối quan hệ" value={mainParent.relationship} />
            <DataRow label="Điện thoại" value={mainParent.phone} />
            <DataRow label="Email" value={mainParent.email} />
            <DataRow
              label="Liên hệ khẩn cấp"
              value={mainParent.isEmergencyContact}
              type="boolean"
            />
            <DataRow
              label="Liên hệ chính"
              value={mainParent.isMainContact}
              type="boolean"
            />
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">
            Chưa có thông tin phụ huynh
          </p>
        )}
      </InfoCard>
    </div>
  );
};

export default OverviewTab;
