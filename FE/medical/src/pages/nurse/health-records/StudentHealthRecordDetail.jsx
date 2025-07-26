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
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";
import healthProfileService from "../../../utils/api/health-profile/healthProfileService";
import {
  OverviewTab,
  PhysicalTab,
  MedicalTab,
  SensoryTab,
  VaccinationTab,
  HealthIncidentsTab,
} from "./components";

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
  const healthStatus = getHealthStatusFromProfile(healthProfile);

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: FiUser },
    { id: "physical", label: "Thể lực", icon: FiActivity },
    { id: "medical", label: "Y tế", icon: FiHeart },
    { id: "sensory", label: "Cảm giác", icon: FiEye },
    { id: "vaccination", label: "Tiêm chủng", icon: FiShield },
    { id: "health-incidents", label: "Sự cố y tế", icon: FiAlertTriangle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab healthProfile={healthProfile} formatDate={formatDate} />
        );

      case "physical":
        return (
          <PhysicalTab
            healthProfile={healthProfile}
            calculateBMI={calculateBMI}
            getBMIStatus={getBMIStatus}
            isEditing={isEditing}
            editData={editData}
            onInputChange={handleInputChange}
          />
        );

      case "medical":
        return (
          <MedicalTab
            healthProfile={healthProfile}
            isEditing={isEditing}
            editData={editData}
            onInputChange={handleInputChange}
          />
        );

      case "sensory":
        return (
          <SensoryTab
            healthProfile={healthProfile}
            isEditing={isEditing}
            editData={editData}
            onInputChange={handleInputChange}
          />
        );

      case "vaccination":
        return (
          <VaccinationTab
            healthProfile={healthProfile}
            isEditing={isEditing}
            editData={editData}
            onInputChange={handleInputChange}
          />
        );

      case "health-incidents":
        return (
          <HealthIncidentsTab
            healthProfile={healthProfile}
          />
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
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
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
