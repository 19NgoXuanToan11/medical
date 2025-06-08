import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiCalendar,
  FiEye,
  FiEar,
  FiAlertCircle,
  FiActivity,
  FiInfo,
  FiHeart,
  FiArrowLeft,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const StudentHealthProfile = () => {
  // State for profile data
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfileData({
        studentName: "Nguyễn Văn An",
        studentId: "HS12345",
        dateOfBirth: "2018-05-10",
        age: "7",
        class: "2A",
        parentInfo: {
          fatherName: "Nguyễn Văn Hoàng",
          fatherPhone: "0912345678",
          motherName: "Phạm Thị Lan",
          motherPhone: "0987654321",
        },
        medicalHistory: {
          hasPreviousTreatment: "yes",
          treatmentDetails: "Điều trị cảm cúm tháng 2/2025",
          recentIllnesses: [
            {
              date: "12/02/2025",
              illness: "Cảm cúm",
              treatment: "Paracetamol",
            },
            {
              date: "05/01/2025",
              illness: "Đau họng",
              treatment: "Kháng sinh",
            },
          ],
        },
        vaccinationHistory: {
          hasCompleteVaccinations: "yes",
          vaccinationDetails: "Đã tiêm đầy đủ theo lịch",
          vaccinations: [
            { name: "Sởi", date: "10/05/2021" },
            { name: "Rubella", date: "10/05/2021" },
            { name: "Quai bị", date: "10/05/2021" },
            { name: "Covid-19", date: "15/08/2023" },
          ],
        },
        vision: {
          hasVisionIssues: "yes",
          leftEye: "0.8",
          rightEye: "1.0",
          visionNotes: "Cần theo dõi mắt trái",
          lastCheckDate: "20/05/2025",
        },
        hearing: {
          hasHearingIssues: "no",
          leftEar: "Bình thường",
          rightEar: "Bình thường",
          hearingNotes: "",
          lastCheckDate: "20/05/2025",
        },
        allergies: {
          hasAllergies: "yes",
          allergyDetails: "Dị ứng với bụi và phấn hoa",
          allergyList: ["Bụi", "Phấn hoa", "Lông thú"],
          severity: "Nhẹ",
        },
        chronicDiseases: {
          hasChronic: "no",
          chronicDetails: "",
        },
        height: "125",
        weight: "28",
        bloodType: "A+",
        bmi: "17.9",
        lastCheckupDate: "20/05/2025",
        nextCheckupDate: "20/11/2025",
        emergencyContact: "Nguyễn Văn Hoàng - 0912345678",
        otherInfo: "",
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to render status indicator
  const renderStatusIndicator = (status) => {
    if (status === "yes") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Cần chú ý
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Bình thường
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Quay lại trang chủ
        </Link>
        <h1 className="text-xl font-semibold text-neutral-800 mb-2">
          Hồ sơ sức khỏe học sinh
        </h1>
        <p className="text-neutral-600 text-sm">
          Thông tin về sức khỏe và tình trạng y tế cá nhân của học sinh
        </p>
      </div>

      {/* Main profile card */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
        <div className="p-4 bg-primary-50 border-b border-primary-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <FiUser className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-neutral-800">
                {profileData.studentName}
              </h2>
              <p className="text-neutral-500 text-sm">
                MSHS: {profileData.studentId} | Lớp: {profileData.class}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">
                THÔNG TIN CƠ BẢN
              </h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-500">Ngày sinh</p>
                    <p className="text-sm font-medium">
                      {profileData.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Tuổi</p>
                    <p className="text-sm font-medium">
                      {profileData.age} tuổi
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Nhóm máu</p>
                    <p className="text-sm font-medium">
                      {profileData.bloodType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">
                      Ngày khám gần nhất
                    </p>
                    <p className="text-sm font-medium">
                      {profileData.lastCheckupDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">
                CHỈ SỐ CƠ THỂ
              </h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Chiều cao</p>
                    <p className="text-sm font-medium">
                      {profileData.height} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Cân nặng</p>
                    <p className="text-sm font-medium">
                      {profileData.weight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Chỉ số BMI</p>
                    <p className="text-sm font-medium">{profileData.bmi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout for detailed info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Allergies */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">Dị ứng</h2>
            </div>
            <div className="p-4">
              {profileData.allergies.hasAllergies === "yes" ? (
                <div>
                  <p className="text-sm text-neutral-600 mb-3">
                    {profileData.allergies.allergyDetails}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.allergies.allergyList.map((allergy, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs"
                      >
                        {allergy}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs text-neutral-500 mr-2">Mức độ:</p>
                    <p className="text-sm text-neutral-800">
                      {profileData.allergies.severity}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">Không có dị ứng</p>
              )}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiEye className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">
                Thị lực
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-500 mb-1">Mắt trái</p>
                  <p className="text-base font-medium text-neutral-800">
                    {profileData.vision.leftEye}
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-500 mb-1">Mắt phải</p>
                  <p className="text-base font-medium text-neutral-800">
                    {profileData.vision.rightEye}
                  </p>
                </div>
              </div>
              {profileData.vision.hasVisionIssues === "yes" && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-sm text-neutral-600">
                    {profileData.vision.visionNotes}
                  </p>
                </div>
              )}
              <p className="text-xs text-neutral-500 mt-2">
                Kiểm tra lần cuối: {profileData.vision.lastCheckDate}
              </p>
            </div>
          </div>

          {/* Hearing */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiEar className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">
                Thính lực
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-500 mb-1">Tai trái</p>
                  <p className="text-base font-medium text-neutral-800">
                    {profileData.hearing.leftEar}
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-500 mb-1">Tai phải</p>
                  <p className="text-base font-medium text-neutral-800">
                    {profileData.hearing.rightEar}
                  </p>
                </div>
              </div>
              {profileData.hearing.hasHearingIssues === "yes" && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-sm text-neutral-600">
                    {profileData.hearing.hearingNotes}
                  </p>
                </div>
              )}
              <p className="text-xs text-neutral-500 mt-2">
                Kiểm tra lần cuối: {profileData.hearing.lastCheckDate}
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Medical History */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiHeart className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">
                Lịch sử y tế
              </h2>
            </div>
            <div className="p-4">
              {profileData.medicalHistory.hasPreviousTreatment === "yes" && (
                <div className="mb-4">
                  <p className="text-xs text-neutral-500 mb-1">
                    Điều trị trước đây
                  </p>
                  <p className="text-sm text-neutral-600 mb-3">
                    {profileData.medicalHistory.treatmentDetails}
                  </p>
                </div>
              )}

              {profileData.medicalHistory.recentIllnesses.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-2">Bệnh gần đây</p>
                  <div className="space-y-2">
                    {profileData.medicalHistory.recentIllnesses.map(
                      (illness, index) => (
                        <div
                          key={index}
                          className="bg-neutral-50 p-3 rounded-lg"
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-neutral-800">
                              {illness.illness}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {illness.date}
                            </p>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1">
                            Điều trị: {illness.treatment}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {profileData.chronicDiseases.hasChronic === "yes" && (
                <div className="mt-4">
                  <p className="text-xs text-neutral-500 mb-1">Bệnh mãn tính</p>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-sm text-neutral-600">
                      {profileData.chronicDiseases.chronicDetails}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vaccination History */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiActivity className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">
                Lịch sử tiêm chủng
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    {profileData.vaccinationHistory.hasCompleteVaccinations ===
                    "yes"
                      ? "Đầy đủ"
                      : "Chưa đầy đủ"}
                  </span>
                  <p className="text-sm text-neutral-600">
                    {profileData.vaccinationHistory.vaccinationDetails}
                  </p>
                </div>
              </div>

              {profileData.vaccinationHistory.vaccinations.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-500 mb-2">
                    Các mũi tiêm đã tiêm
                  </p>
                  <div className="space-y-2">
                    {profileData.vaccinationHistory.vaccinations.map(
                      (vaccination, index) => (
                        <div
                          key={index}
                          className="flex justify-between bg-neutral-50 p-2 rounded-md"
                        >
                          <p className="text-sm font-medium text-neutral-800">
                            {vaccination.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {vaccination.date}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center">
              <FiInfo className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-base font-medium text-neutral-800">
                Thông tin khẩn cấp
              </h2>
            </div>
            <div className="p-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <p className="text-xs text-neutral-500 mb-1">
                  Liên hệ khẩn cấp
                </p>
                <p className="text-sm font-medium text-neutral-800">
                  {profileData.emergencyContact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Checkup Reminder */}
      <div className="bg-primary-50 rounded-lg border border-primary-100 p-4 mb-6">
        <div className="flex items-start">
          <div className="bg-primary-100 p-2 rounded-full mr-3">
            <FiCalendar className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-800 mb-1">
              Lịch khám sức khỏe tiếp theo
            </h3>
            <p className="text-neutral-600">
              Khám sức khỏe định kỳ vào ngày {profileData.nextCheckupDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthProfile;
