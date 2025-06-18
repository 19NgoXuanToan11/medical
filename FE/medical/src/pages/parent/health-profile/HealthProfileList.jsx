import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HealthProfileCard from "./HealthProfileCard";
import axios from "axios";

const API_URL = "https://localhost:7111/api";

const HealthProfileList = () => {
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/HealthProfile`);
        setStudentProfiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching health profiles:", err);
        setError(
          "Không thể tải danh sách hồ sơ sức khỏe. Vui lòng thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

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
            <div className="flex gap-3">
              <Link
                to="/parent/health-profile/comprehensive"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors duration-200 text-sm font-medium"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Xem tổng quan
              </Link>
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
                Cập nhật hồ sơ
              </Link>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Empty state */}
          {!loading && studentProfiles.length === 0 && !error && (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Chưa có hồ sơ nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn chưa tạo hồ sơ sức khỏe nào. Hãy tạo hồ sơ mới ngay.
              </p>
            </div>
          )}

          {/* Health Profile Cards */}
          {!loading && studentProfiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentProfiles.map((profile) => (
                <HealthProfileCard
                  key={profile.healthProfileId || profile.id}
                  profile={profile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthProfileList;
