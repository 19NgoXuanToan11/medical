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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {status}
        </span>
      );
    } else if (status === "Cần theo dõi") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {status}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
          <span className="text-xs text-gray-600">Dị ứng</span>
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
          <span className="text-xs text-gray-600">Mãn tính</span>
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
          <span className="text-xs text-gray-600">Thị lực</span>
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
          <span className="text-xs text-gray-600">Thính lực</span>
        </span>
      );
    }

    return flags.length > 0 ? (
      flags
    ) : (
      <span className="text-xs text-gray-500">Không có</span>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 mr-2 transition-colors duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            <span className="font-medium">Quay lại trang chủ</span>
          </Link>
          <div className="bg-blue-600 text-white py-1.5 px-4 rounded-full text-sm font-medium">
            Hồ sơ sức khỏe
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M47.7,-57.2C59.5,-45.8,65.9,-28.6,68.8,-10.8C71.6,7.1,71,25.5,62.3,39.7C53.6,53.9,36.9,63.8,19.1,68.7C1.2,73.5,-17.8,73.3,-35.1,66.2C-52.5,59.1,-68.3,45.1,-73.3,28.3C-78.4,11.5,-72.8,-8.1,-64.5,-25.6C-56.2,-43,-45.2,-58.3,-31.4,-68.8C-17.6,-79.3,-0.9,-85.1,13.9,-80.5C28.6,-75.9,36,-68.6,47.7,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Hồ sơ sức khỏe học sinh
            </h1>
            <p className="text-blue-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Quản lý thông tin sức khỏe học sinh và cập nhật khi có thay đổi
            </p>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <p className="text-gray-600 mb-4 md:mb-0">
                Tổng số hồ sơ:{" "}
                <span className="font-semibold">{studentProfiles.length}</span>
              </p>
              <Link
                to="/parent/health-profile/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg shadow-md transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Thêm hồ sơ mới
              </Link>
            </div>

            {/* Health Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <h3 className="font-medium text-gray-700 truncate">
                      {profile.name}
                    </h3>
                    {getStatusBadge(profile.healthStatus)}
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Mã học sinh
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {profile.studentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lớp</p>
                        <p className="text-sm font-medium text-gray-700">
                          {profile.class}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Cập nhật lần cuối
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {profile.lastUpdated}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Các vấn đề</p>
                        <div className="flex flex-wrap">
                          {getHealthFlags(profile)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <Link
                        to={`/parent/health-profile/${profile.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
                      >
                        <span className="mr-1">Xem chi tiết</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
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
                      </Link>
                      <Link
                        to={`/parent/health-profile/edit/${profile.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
                      >
                        <span className="mr-1">Cập nhật</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
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
    </div>
  );
};

export default HealthProfileList;
