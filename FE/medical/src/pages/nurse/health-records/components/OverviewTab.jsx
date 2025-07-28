import React from "react";
import {
  FiUser,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiUserCheck,
} from "react-icons/fi";
import { InfoCard, DataRow } from "./SharedComponents";
import { formatNotificationTime } from "../../../../utils/timeUtils";

const OverviewTab = ({
  healthProfile,
  formatDate,
  criticalIncidents = [],
  loadingIncidents = false,
}) => {
  const student = healthProfile.student;
  const mainParent =
    student?.parents?.find((p) => p.isMainContact) || student?.parents?.[0];

  const getSeverityIcon = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "emergency":
        return <FiAlertTriangle className="w-5 h-5 text-red-500" />;
      case "severe":
        return <FiAlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "emergency":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      case "severe":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
      default:
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    }
  };

  const getSeverityLabel = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "emergency":
        return "Cấp cứu";
      case "severe":
        return "Nặng";
      case "moderate":
        return "Trung bình";
      case "light":
        return "Nhẹ";
      default:
        return severityLevel || "Không xác định";
    }
  };

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

      {/* Critical Medical Incidents */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Sự cố y tế nghiêm trọng gần đây
            </h3>
          </div>

          {loadingIncidents ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : criticalIncidents.length > 0 ? (
            <div className="space-y-4">
              {criticalIncidents.map((incident) => (
                <div
                  key={incident.incidentId}
                  className={`p-4 rounded-lg border ${getSeverityColor(
                    incident.severityLevel
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(incident.severityLevel)}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {getSeverityLabel(incident.severityLevel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <FiClock className="w-4 h-4" />
                      <span>{formatNotificationTime(incident.timestamp)}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      {incident.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                      <FiUserCheck className="w-4 h-4" />
                      <span>
                        Xử lý bởi: {incident.handledBy || "Chưa xác định"}
                      </span>
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400">
                      {incident.notifiedParent ? (
                        <span className="text-green-600 dark:text-green-400">
                          Đã thông báo PH
                        </span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Chưa thông báo PH
                        </span>
                      )}
                    </div>
                  </div>

                  {incident.actionsTaken && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-600">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        <strong>Hành động đã thực hiện:</strong>{" "}
                        {incident.actionsTaken}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiAlertTriangle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400">
                Không có sự cố nghiêm trọng nào được ghi nhận
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
