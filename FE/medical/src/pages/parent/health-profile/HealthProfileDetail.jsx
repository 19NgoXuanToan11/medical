import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://localhost:7111/api";

const HealthProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/HealthProfile/${id}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching health profile:", err);
        setError("Không thể tải hồ sơ sức khỏe. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  const formatBoolean = (value) => {
    if (value === true) return "Có";
    if (value === false) return "Không";
    return "N/A";
  };

  const getVaccinationStatus = (value) => {
    if (value === true) return "Đã tiêm đầy đủ";
    if (value === false) return "Chưa tiêm đầy đủ";
    return "N/A";
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">
            Không tìm thấy hồ sơ
          </h3>
        </div>
      </div>
    );
  }

  const student = profile.student || {};

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center">
            <Link
              to="/parent/health-profile"
              className="text-primary-600 hover:text-primary-700 flex items-center mr-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại danh sách
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Hồ sơ sức khỏe - {student.firstName} {student.lastName}
              </h1>
              <p className="text-sm text-neutral-600">
                Xem chi tiết đầy đủ thông tin sức khỏe học sinh
              </p>
            </div>
          </div>
          <Link
            to={`/parent/health-profile/edit/${profile.healthProfileId}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Chỉnh sửa
          </Link>
        </div>

        <div className="p-6 space-y-8">
          {/* Student Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              Thông tin học sinh
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Mã học sinh
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.studentCode || student.studentCode || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Họ và tên
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {student.firstName} {student.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Ngày sinh
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDate(student.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Giới tính
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatGender(student.gender)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {student.className || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Năm học
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {student.schoolYear || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-neutral-700">
                    Địa chỉ
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {student.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              Thông tin thể chất
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Chiều cao
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.height ? `${profile.height} cm` : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Cân nặng
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.weight ? `${profile.weight} kg` : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Nhóm máu
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.bloodType || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </span>
              Chỉ số sinh tồn
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Huyết áp
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.bloodPressure || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Nhịp tim
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.heartRate
                      ? `${profile.heartRate} lần/phút`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
              Tiền sử bệnh
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Có tiền sử điều trị
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatBoolean(profile.hasPreviousTreatment)}
                  </p>
                </div>
                {profile.treatmentDetails && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Chi tiết tiền sử điều trị
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {profile.treatmentDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vaccination History */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              Tiền sử tiêm chủng
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Tình trạng tiêm chủng
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {getVaccinationStatus(profile.hasCompleteVaccinations)}
                  </p>
                </div>
                {profile.vaccinationDetails && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Chi tiết tiêm chủng
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {profile.vaccinationDetails}
                    </p>
                  </div>
                )}
                {profile.vaccinations &&
                  Array.isArray(profile.vaccinations) &&
                  profile.vaccinations.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Các loại vắc-xin đã tiêm
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.vaccinations.map((vaccine, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {vaccine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Vision and Hearing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vision */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                Thông tin thị lực
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Có vấn đề về thị lực
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {formatBoolean(profile.hasVisionIssues)}
                    </p>
                  </div>
                  {profile.hasVisionIssues && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">
                          Thị lực mắt trái
                        </label>
                        <p className="mt-1 text-sm text-neutral-900">
                          {profile.leftEye || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">
                          Thị lực mắt phải
                        </label>
                        <p className="mt-1 text-sm text-neutral-900">
                          {profile.rightEye || "N/A"}
                        </p>
                      </div>
                      {profile.visionNotes && (
                        <div>
                          <label className="text-sm font-medium text-neutral-700">
                            Ghi chú về thị lực
                          </label>
                          <p className="mt-1 text-sm text-neutral-900">
                            {profile.visionNotes}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Hearing */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </span>
                Thông tin thính lực
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Có vấn đề về thính lực
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {formatBoolean(profile.hasHearingIssues)}
                    </p>
                  </div>
                  {profile.hasHearingIssues && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">
                          Thính lực tai trái
                        </label>
                        <p className="mt-1 text-sm text-neutral-900">
                          {profile.leftEar || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">
                          Thính lực tai phải
                        </label>
                        <p className="mt-1 text-sm text-neutral-900">
                          {profile.rightEar || "N/A"}
                        </p>
                      </div>
                      {profile.hearingNotes && (
                        <div>
                          <label className="text-sm font-medium text-neutral-700">
                            Ghi chú về thính lực
                          </label>
                          <p className="mt-1 text-sm text-neutral-900">
                            {profile.hearingNotes}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Allergies and Chronic Diseases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allergies */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
                Thông tin dị ứng
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Có bị dị ứng
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {formatBoolean(profile.hasAllergies)}
                    </p>
                  </div>
                  {profile.hasAllergies && profile.allergyDetails && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Chi tiết về dị ứng
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {profile.allergyDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chronic Diseases */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                Bệnh mãn tính
              </h2>
              <div className="bg-neutral-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Có mắc bệnh mãn tính
                    </label>
                    <p className="mt-1 text-sm text-neutral-900">
                      {formatBoolean(profile.hasChronicDiseases)}
                    </p>
                  </div>
                  {profile.hasChronicDiseases && profile.chronicDetails && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">
                        Chi tiết về bệnh mãn tính
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {profile.chronicDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact & Additional Info */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              Thông tin liên hệ & ghi chú
            </h2>
            <div className="bg-neutral-50 rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Số điện thoại liên hệ khẩn cấp
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {profile.emergencyContact || "N/A"}
                  </p>
                </div>
                {profile.otherInfo && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      Thông tin sức khỏe bổ sung
                    </label>
                    <p className="mt-1 text-sm text-neutral-900 whitespace-pre-wrap">
                      {profile.otherInfo}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Cập nhật lần cuối
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDate(profile.lastUpdated)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileDetail;
