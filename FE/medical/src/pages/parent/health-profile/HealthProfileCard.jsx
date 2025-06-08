import React from "react";
import { Link } from "react-router-dom";

const HealthProfileCard = ({ profile }) => {
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
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-sm transition-shadow duration-200">
      <div className="border-b border-neutral-100 px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium text-neutral-800 truncate">
          {profile.name}
        </h3>
        {getStatusBadge(profile.healthStatus)}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Mã học sinh</p>
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
          <p className="text-xs text-neutral-500 mb-1">Cập nhật lần cuối</p>
          <p className="text-sm text-neutral-700">{profile.lastUpdated}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1">Các vấn đề</p>
          <div className="flex flex-wrap mt-1">{getHealthFlags(profile)}</div>
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
            to={`/parent/health-profile/edit/${profile.id}`}
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
  );
};

export default HealthProfileCard;
