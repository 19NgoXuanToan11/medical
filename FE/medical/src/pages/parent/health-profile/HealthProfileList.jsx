import React from "react";
import { Link } from "react-router-dom";

const HealthProfileList = () => {
  // Mock data for demonstration
  const studentProfiles = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      studentId: "HS12345",
      class: "2A",
      healthStatus: "Tốt",
      lastUpdated: "15/05/2025",
      hasAllergies: true,
      hasChronicDiseases: false,
      hasVisionIssues: true,
      hasHearingIssues: false,
    },
    {
      id: 2,
      name: "Nguyễn Thị Bình",
      studentId: "HS12346",
      class: "5B",
      healthStatus: "Cần theo dõi",
      lastUpdated: "10/05/2025",
      hasAllergies: true,
      hasChronicDiseases: true,
      hasVisionIssues: false,
      hasHearingIssues: false,
    },
    {
      id: 3,
      name: "Nguyễn Minh Cường",
      studentId: "HS12347",
      class: "3C",
      healthStatus: "Tốt",
      lastUpdated: "12/05/2025",
      hasAllergies: false,
      hasChronicDiseases: false,
      hasVisionIssues: false,
      hasHearingIssues: false,
    },
  ];

  // Function to get status badge based on health status
  const getStatusBadge = (status) => {
    if (status === "Tốt") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-600/20">
          {status}
        </span>
      );
    } else if (status === "Cần theo dõi") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-600/20">
          {status}
        </span>
      );
    }
  };

  // Function to get health flags
  const getHealthFlags = (profile) => {
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

    return flags.length > 0 ? (
      flags
    ) : (
      <span className="text-xs text-neutral-500">Không có</span>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="bg-primary-600 p-6">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Hồ sơ sức khỏe học sinh
          </h1>
          <p className="text-primary-100 text-sm">
            Quản lý thông tin sức khỏe học sinh và cập nhật khi có thay đổi
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-neutral-600 text-sm mb-4 sm:mb-0">
              Tổng số hồ sơ:{" "}
              <span className="font-medium">{studentProfiles.length}</span>
            </p>
            <Link
              to="/parent/health-profile/new"
              className="bg-primary-600 hover:bg-primary-700 text-black px-4 py-2 rounded flex items-center justify-center transition-colors duration-200 text-sm font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Thêm hồ sơ
            </Link>
          </div>

          {/* Health Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-sm transition-shadow duration-200"
              >
                <div className="border-b border-neutral-100 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-medium text-neutral-800 truncate">
                    {profile.name}
                  </h3>
                  {getStatusBadge(profile.healthStatus)}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Mã học sinh
                      </p>
                      <p className="text-sm font-medium text-neutral-700">
                        {profile.studentId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Lớp</p>
                      <p className="text-sm font-medium text-neutral-700">
                        {profile.class}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-neutral-500 mb-1">
                      Cập nhật lần cuối
                    </p>
                    <p className="text-sm text-neutral-700">
                      {profile.lastUpdated}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-neutral-500 mb-1">Các vấn đề</p>
                    <div className="flex flex-wrap mt-1">
                      {getHealthFlags(profile)}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t border-neutral-100">
                    <Link
                      to={`/parent/health-profile/${profile.id}`}
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
                    <Link
                      to={`/parent/health-profile/${profile.id}/edit`}
                      className="text-neutral-600 hover:text-neutral-700 text-sm font-medium flex items-center"
                    >
                      Cập nhật
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileList;
