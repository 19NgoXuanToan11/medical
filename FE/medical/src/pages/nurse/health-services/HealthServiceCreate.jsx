import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VaccinationCreate from "./VaccinationCreate";
import HealthCheckCreate from "./HealthCheckCreate";

const HealthServiceCreate = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState(""); // vaccination or health_check

  // Nếu đã chọn loại dịch vụ, hiển thị component tương ứng
  if (serviceType === "vaccination") {
    return <VaccinationCreate onBack={() => setServiceType("")} />;
  }

  if (serviceType === "health_check") {
    return <HealthCheckCreate onBack={() => setServiceType("")} />;
  }

  // Hiển thị màn hình chọn loại dịch vụ
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/nurse/health-services")}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo Dịch vụ Y tế mới
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Vui lòng chọn loại dịch vụ y tế mà bạn muốn tạo lịch
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Chọn loại dịch vụ y tế
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Lựa chọn dịch vụ phù hợp với nhu cầu chăm sóc sức khỏe học sinh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vaccination Option */}
            <button
              type="button"
              onClick={() => setServiceType("vaccination")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300">
                  <FiShield className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Tiêm chủng
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch tiêm phòng các loại vắc-xin cho học sinh theo độ tuổi và chương trình y tế học đường
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Phòng bệnh
                    </span>
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Theo lứa tuổi
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Health Check Option */}
            <button
              type="button"
              onClick={() => setServiceType("health_check")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-green-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-green-100 group-hover:text-green-500 transition-all duration-300">
                  <FiActivity className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Khám sức khỏe định kỳ
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch khám sức khỏe tổng quát và chuyên khoa cho học sinh theo quy định của Bộ Y tế
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Tổng quát
                    </span>
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Định kỳ
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthServiceCreate;
