import React from "react";
import { Link } from "react-router-dom";

const HealthProfileCard = ({ profile }) => {
  // Function to determine health status based on profile data
  const getHealthStatus = () => {
    const hasIssues =
      profile.hasAllergies ||
      profile.hasChronicDiseases ||
      profile.hasVisionIssues ||
      profile.hasHearingIssues ||
      profile.hasPreviousTreatment;

    return hasIssues ? "Cần theo dõi" : "Tốt";
  };

  const healthStatus = getHealthStatus();

  // Function to get status badge based on health status
  const getStatusBadge = (status) => {
    if (status === "Tốt") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-600/20">
          {status}
        </span>
      );
    } else if (status === "Cần theo dõi") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-600/20">
          {status}
        </span>
      );
    }
  };

  // Function to get health flags
  const getHealthFlags = () => {
    const flags = [];

    if (profile.hasAllergies) {
      flags.push(
        <span
          key="allergy"
          className="inline-flex items-center mr-2"
          title="Dị ứng"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
          <span className="text-xs text-neutral-600">Dị ứng</span>
        </span>
      );
    }

    if (profile.hasChronicDiseases) {
      flags.push(
        <span
          key="chronic"
          className="inline-flex items-center mr-2"
          title="Bệnh mãn tính"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
          <span className="text-xs text-neutral-600">Mãn tính</span>
        </span>
      );
    }

    if (profile.hasVisionIssues) {
      flags.push(
        <span
          key="vision"
          className="inline-flex items-center mr-2"
          title="Vấn đề thị lực"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500 mr-1"></span>
          <span className="text-xs text-neutral-600">Thị lực</span>
        </span>
      );
    }

    if (profile.hasHearingIssues) {
      flags.push(
        <span
          key="hearing"
          className="inline-flex items-center mr-2"
          title="Vấn đề thính lực"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
          <span className="text-xs text-neutral-600">Thính lực</span>
        </span>
      );
    }

    if (profile.hasPreviousTreatment) {
      flags.push(
        <span
          key="treatment"
          className="inline-flex items-center mr-2"
          title="Tiền sử điều trị"
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
          <span className="text-xs text-neutral-600">Tiền sử</span>
        </span>
      );
    }

    return flags.length > 0 ? (
      flags
    ) : (
      <span className="text-xs text-neutral-500">Không có</span>
    );
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch (err) {
      return dateString;
    }
  };

  // Helper function to format gender display
  const formatGender = (gender) => {
    if (!gender) return "N/A";

    // Handle both English and Vietnamese formats
    const genderLower = gender.toLowerCase();
    if (genderLower === "male" || genderLower === "nam") return "Nam";
    if (
      genderLower === "female" ||
      genderLower === "nữ" ||
      genderLower === "nu"
    )
      return "Nữ";

    return "N/A";
  };

  // Helper function to format vaccination status
  const formatVaccinationStatus = (value) => {
    if (value === true || value === "Yes" || value === "yes")
      return "Đã tiêm đầy đủ";
    if (value === false || value === "No" || value === "no")
      return "Chưa tiêm đầy đủ";
    return "Chưa cập nhật";
  };

  // Get student info
  const student = profile.student || {};

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="border-b border-neutral-100 px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium text-neutral-800 truncate">
          {student.firstName} {student.lastName}
        </h3>
        {getStatusBadge(healthStatus)}
      </div>

      <div className="p-4 space-y-4">
        {/* Student Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Mã học sinh</p>
            <p className="text-sm font-medium text-neutral-700">
              {profile.studentCode || student.studentCode || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Lớp</p>
            <p className="text-sm font-medium text-neutral-700">
              {student.className || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Ngày sinh</p>
            <p className="text-sm text-neutral-700">
              {formatDate(student.dateOfBirth)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Giới tính</p>
            <p className="text-sm text-neutral-700">
              {formatGender(student.gender)}
            </p>
          </div>
        </div>

        {/* Physical Info */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-100">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Chiều cao</p>
            <p className="text-sm text-neutral-700">
              {profile.height ? `${profile.height} cm` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Cân nặng</p>
            <p className="text-sm text-neutral-700">
              {profile.weight ? `${profile.weight} kg` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Nhóm máu</p>
            <p className="text-sm text-neutral-700">
              {profile.bloodType || "N/A"}
            </p>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Huyết áp</p>
            <p className="text-sm text-neutral-700">
              {profile.bloodPressure || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Nhịp tim</p>
            <p className="text-sm text-neutral-700">
              {profile.heartRate ? `${profile.heartRate} lần/phút` : "N/A"}
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 mb-1">Liên hệ khẩn cấp</p>
          <p className="text-sm text-neutral-700">
            {profile.emergencyContact || "N/A"}
          </p>
        </div>

        {/* Vaccination Status */}
        <div className="pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 mb-1">Tình trạng tiêm chủng</p>
          <p className="text-sm text-neutral-700">
            {formatVaccinationStatus(profile.hasCompleteVaccinations)}
          </p>
        </div>

        {/* Health Issues */}
        <div className="pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 mb-2">Các vấn đề sức khỏe</p>
          <div className="flex flex-wrap">{getHealthFlags()}</div>
        </div>

        {/* Last Updated */}
        <div className="pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 mb-1">Cập nhật lần cuối</p>
          <p className="text-sm text-neutral-700">
            {formatDate(profile.lastUpdated)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-neutral-100">
          <Link
            to={`/parent/health-profile/${profile.healthProfileId}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            Xem chi tiết
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileCard;
