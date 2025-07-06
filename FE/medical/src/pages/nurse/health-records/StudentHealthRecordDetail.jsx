import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiActivity,
  FiHeart,
  FiEye,
  FiEdit,
  FiSave,
  FiX,
  FiFileText,
  FiPhone,
  FiMail,
  FiMapPin,
  FiDroplet,
  FiShield,
  FiClock,
  FiUsers,
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiInfo,
  FiHeadphones,
} from "react-icons/fi";
import healthProfileService from "../../../utils/api/health-profile/healthProfileService";

const StudentHealthRecordDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthProfile, setHealthProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchStudentHealthRecord = async () => {
      try {
        setLoading(true);
        const profileData = await healthProfileService.getByStudentCode(
          studentId
        );
        setHealthProfile(profileData);

        setEditData({
          allergyDetails: profileData.allergyDetails || "",
          chronicDetails: profileData.chronicDetails || "",
          treatmentDetails: profileData.treatmentDetails || "",
          vaccinationDetails: profileData.vaccinationDetails || "",
          visionNotes: profileData.visionNotes || "",
          hearingNotes: profileData.hearingNotes || "",
          otherInfo: profileData.otherInfo || "",
          emergencyContact: profileData.emergencyContact || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student health record:", error);
        setHealthProfile(null);
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentHealthRecord();
    }
  }, [studentId]);

  const getHealthStatusFromProfile = (profile) => {
    if (profile.hasChronicDiseases || profile.hasPreviousTreatment) {
      return "Cần theo dõi";
    }
    if (
      profile.hasAllergies ||
      profile.hasVisionIssues ||
      profile.hasHearingIssues
    ) {
      return "Bình thường";
    }
    return "Tốt";
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 0;
    return (weight / Math.pow(height / 100, 2)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5)
      return {
        label: "Thiếu cân",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      };
    if (bmi < 25)
      return {
        label: "Bình thường",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
      };
    if (bmi < 30)
      return {
        label: "Thừa cân",
        color: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-900/20",
      };
    return {
      label: "Béo phì",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "Tốt":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Bình thường":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Cần theo dõi":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Yếu":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...healthProfile,
        ...editData,
      };

      await healthProfileService.update(
        healthProfile.healthProfileId,
        updateData
      );

      setHealthProfile((prev) => ({
        ...prev,
        ...editData,
      }));
      setIsEditing(false);
      alert("Đã lưu thay đổi thành công!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Có lỗi xảy ra khi lưu thay đổi. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!healthProfile) {
    return (
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Không tìm thấy hồ sơ học sinh
          </h2>
        </div>
      </div>
    );
  }

  const student = healthProfile.student;
  const bmi = calculateBMI(healthProfile.height, healthProfile.weight);
  const bmiStatus = getBMIStatus(bmi);
  const healthStatus = getHealthStatusFromProfile(healthProfile);
  const mainParent =
    student?.parents?.find((p) => p.isMainContact) || student?.parents?.[0];

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: FiUser },
    { id: "physical", label: "Thể lực", icon: FiActivity },
    { id: "medical", label: "Y tế", icon: FiHeart },
    { id: "sensory", label: "Cảm giác", icon: FiEye },
    { id: "vaccination", label: "Tiêm chủng", icon: FiShield },
  ];

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const DataRow = ({ label, value, type = "text", status = null }) => (
    <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
      <span className="text-neutral-600 dark:text-neutral-400 text-sm">
        {label}:
      </span>
      <div className="flex items-center gap-2">
        {type === "boolean" ? (
          <div className="flex items-center gap-1">
            {value ? (
              <FiCheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <FiXCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {value ? "Có" : "Không"}
            </span>
          </div>
        ) : (
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {value || "N/A"}
          </span>
        )}
        {status && (
          <span
            className={`px-2 py-1 text-xs rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );

  const EditableField = ({
    label,
    field,
    value,
    type = "text",
    placeholder = "",
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={isEditing ? editData[field] : value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:text-neutral-500 resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={isEditing ? editData[field] : value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:text-neutral-500"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
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
                <DataRow
                  label="Ngày sinh"
                  value={formatDate(student?.dateOfBirth)}
                />
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
                  <DataRow
                    label="Mối quan hệ"
                    value={mainParent.relationship}
                  />
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

      case "physical":
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
                />
              </div>
            </InfoCard>
          </div>
        );

      case "medical":
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
                />
              </div>
            </InfoCard>
          </div>
        );

      case "sensory":
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
                />
              </div>
            </InfoCard>
          </div>
        );

      case "vaccination":
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
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Danh sách vaccine
                  </label>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {healthProfile.vaccinations ||
                        "Chưa có thông tin chi tiết"}
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        );

      case "notes":
        return (
          <div className="grid grid-cols-1 gap-6">
            <InfoCard title="Ghi chú khác" icon={FiFileText}>
              <EditableField
                label="Thông tin bổ sung"
                field="otherInfo"
                value={healthProfile.otherInfo}
                type="textarea"
                placeholder="Nhập thông tin bổ sung về sức khỏe học sinh..."
              />
            </InfoCard>

            <InfoCard title="Thông tin hệ thống" icon={FiInfo}>
              <div className="space-y-3">
                <DataRow
                  label="ID hồ sơ"
                  value={healthProfile.healthProfileId}
                />
                <DataRow
                  label="Ngày tạo"
                  value={formatDate(healthProfile.lastUpdated)}
                />
                <DataRow
                  label="Số lượng sự kiện sức khỏe"
                  value={student?.healthEventCount || 0}
                />
                <DataRow
                  label="Số lượng phụ huynh"
                  value={student?.parentCount || 0}
                />
              </div>
            </InfoCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/nurse/health-records")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-neutral-200">
              Hồ sơ sức khỏe - {student?.firstName} {student?.lastName}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Mã học sinh: {student?.studentCode} • Lớp: {student?.className} •
              Cập nhật: {formatDate(healthProfile.lastUpdated)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(
                healthStatus
              )}`}
            >
              {healthStatus}
            </div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  Lưu
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">{renderTabContent()}</div>
    </div>
  );
};

export default StudentHealthRecordDetail;
