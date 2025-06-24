import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaEye,
  FaNotesMedical,
  FaExclamationTriangle,
} from "react-icons/fa";

const HealthCheckResultDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch health check result details
    setTimeout(() => {
      setHealthCheck({
        id: id,
        childName: "Nguyễn Minh Anh",
        grade: "Lớp 1A",
        checkDate: "2023-05-10",
        height: 128.5,
        weight: 27.3,
        bmi: 16.5,
        bmiStatus: "Bình thường",
        vision: {
          left: "6/6",
          right: "6/6",
          status: "Bình thường",
        },
        healthStatus: "Bình thường",
        abnormalities: [
          {
            type: "Dấu hiệu bất thường",
            description: "Có dấu hiệu thiếu máu",
            recommendation:
              "Cần bổ sung thực phẩm giàu sắt trong chế độ ăn hàng ngày",
          },
        ],
        recommendations: [
          "Duy trì chế độ ăn uống cân bằng, đủ dinh dưỡng",
          "Tập thể dục đều đặn, mỗi ngày ít nhất 30 phút",
          "Đảm bảo ngủ đủ giấc (8-10 giờ mỗi đêm)",
        ],
        appointmentScheduled: true,
        appointmentDate: "2023-05-20",
        appointmentDetails: "Khám chuyên khoa huyết học tại Bệnh viện Nhi",
        doctorNotes:
          "Cần theo dõi chỉ số hồng cầu và hemoglobin trong 3 tháng tới.",
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8">
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg overflow-hidden mb-6 border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center">
            Kết quả kiểm tra y tế của {healthCheck.childName}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1 flex items-center">
            <FaCalendarAlt className="mr-2 text-primary-500 dark:text-primary-400" />
            Ngày kiểm tra:{" "}
            {new Date(healthCheck.checkDate).toLocaleDateString("vi-VN")} -{" "}
            {healthCheck.grade}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Thông số cơ bản
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaRulerVertical />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Chiều cao
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.height} cm
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaWeight />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Cân nặng
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.weight} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Chỉ số BMI
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.bmi} -{" "}
                      <span
                        className={
                          healthCheck.bmiStatus === "Bình thường"
                            ? "text-green-600 dark:text-green-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }
                      >
                        {healthCheck.bmiStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Thị lực
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaEye />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Mắt trái
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.vision.left}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaEye />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Mắt phải
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.vision.right}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaNotesMedical />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Đánh giá
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {healthCheck.vision.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {healthCheck.abnormalities &&
            healthCheck.abnormalities.length > 0 && (
              <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center">
                  <FaExclamationTriangle className="text-yellow-500 dark:text-yellow-400 mr-2" />
                  Dấu hiệu cần lưu ý
                </h2>

                <div className="space-y-4">
                  {healthCheck.abnormalities.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-neutral-800 p-4 rounded-md border border-yellow-100 dark:border-yellow-800/30"
                    >
                      <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-100">
                        {item.type}
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                        {item.description}
                      </p>
                      {item.recommendation && (
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2 italic">
                          <strong className="text-neutral-700 dark:text-neutral-300">
                            Khuyến nghị:
                          </strong>{" "}
                          {item.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {healthCheck.recommendations &&
            healthCheck.recommendations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                  Khuyến nghị
                </h2>

                <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600">
                  <ul className="space-y-2">
                    {healthCheck.recommendations.map(
                      (recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-neutral-700 dark:text-neutral-300 flex-1">
                            {recommendation}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}

          {healthCheck.appointmentScheduled && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Lịch hẹn khám chuyên sâu
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FaCalendarAlt />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Ngày hẹn
                    </h3>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {new Date(healthCheck.appointmentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FaNotesMedical />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Chi tiết cuộc hẹn
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {healthCheck.appointmentDetails}
                    </p>
                  </div>
                </div>

                {healthCheck.doctorNotes && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Ghi chú của bác sĩ
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        {healthCheck.doctorNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/parent/health-check/results"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default HealthCheckResultDetail;
