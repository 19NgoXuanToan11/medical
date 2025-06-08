import React from "react";
import { Link } from "react-router-dom";
import HealthProfileCard from "./HealthProfileCard";

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

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Hồ sơ sức khỏe học sinh
          </h1>
          <p className="text-black text-sm">
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
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors duration-200 text-sm font-medium"
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
              <HealthProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileList;
