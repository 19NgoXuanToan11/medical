import React from "react";
import { Link } from "react-router-dom";
import mother from "../../../../public/images/mother.jpg";
import mother2 from "../../../../public/images/mother2.jpg";

const Features = () => {
  const featureItems = [
    {
      title: "Hồ Sơ Sức Khỏe",
      description:
        "Quản lý thông tin sức khỏe học sinh với lịch sử bệnh án, tiêm chủng và điều trị một cách toàn diện.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      color: "bg-blue-500",
      link: "/parent/health-profile",
    },
    {
      title: "Tiêm Chủng",
      description:
        "Thông báo lịch tiêm chủng, xác nhận từ phụ huynh và ghi nhận kết quả tiêm chủng đúng thời điểm.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      title: "Quản Lý Thuốc",
      description:
        "Cho phép phụ huynh gửi thuốc, nhân viên y tế quản lý và theo dõi việc sử dụng thuốc theo đúng phác đồ.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
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
      ),
      color: "bg-purple-500",
    },
    {
      title: "Kiểm Tra Y Tế",
      description:
        "Lên lịch và quản lý các đợt kiểm tra y tế định kỳ cho học sinh với báo cáo chi tiết về tình trạng sức khỏe.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "bg-yellow-500",
    },
    {
      title: "Thông Báo",
      description:
        "Gửi thông báo về các sự kiện y tế, tình hình sức khỏe học sinh đến phụ huynh kịp thời qua nhiều kênh liên lạc.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      color: "bg-red-500",
    },
    {
      title: "Báo Cáo & Thống Kê",
      description:
        "Tổng hợp và phân tích số liệu sức khỏe học sinh thông qua biểu đồ trực quan để đưa ra quyết định kịp thời.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
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
      ),
      color: "bg-teal-500",
    },
  ];

  const audiences = [
    {
      title: "Học Sinh",
      description:
        "Tra cứu thông tin sức khỏe cá nhân, lịch tiêm chủng và kiểm tra sức khỏe.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "bg-yellow-100",
      buttonText: "Tìm hiểu thêm",
    },
    {
      title: "Phụ Huynh",
      description:
        "Theo dõi sức khỏe con em, xác nhận tiêm chủng và gửi thuốc đến trường.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "bg-green-100",
      buttonText: "Tìm hiểu thêm",
      link: "/parent/health-profile",
    },
    {
      title: "Y Tế Trường Học",
      description:
        "Quản lý sức khỏe học sinh, thuốc men và sự kiện y tế tại trường.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      color: "bg-red-100",
      buttonText: "Tìm hiểu thêm",
    },
    {
      title: "Quản Lý Trường",
      description:
        "Theo dõi chỉ số sức khỏe tổng thể, lên kế hoạch và quản lý chính sách y tế.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: "bg-purple-100",
      buttonText: "Tìm hiểu thêm",
    },
  ];

  return (
    <>
      {/* Global Care Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Image - On the left for this section */}
            <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
              <img
                src={mother}
                alt="Mother with baby"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Text Content - On the right for this section */}
            <div className="w-full md:w-1/2 pl-0 md:pl-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Chăm sóc sức khỏe lấy học sinh làm trung tâm
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Chúng tôi cung cấp giải pháp y tế đáng tin cậy, hỗ trợ học sinh
                phát triển toàn diện trong môi trường học đường an toàn và lành
                mạnh.
              </p>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Patient-Centered Care Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Text Content - On the left for this section */}
            <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Chăm sóc sức khỏe lấy học sinh làm trung tâm
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Chúng tôi cung cấp giải pháp y tế đáng tin cậy, hỗ trợ học sinh
                phát triển toàn diện trong môi trường học đường an toàn và lành
                mạnh.
              </p>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200">
                Tìm hiểu thêm
              </button>
            </div>

            {/* Image - On the right for this section */}
            <div className="w-full md:w-1/2 pl-0 md:pl-8">
              <img
                src={mother2}
                alt="Healthcare professional with student"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Ứng dụng cung cấp các tính năng quản lý sức khỏe học đường toàn
              diện, kết nối chặt chẽ giữa nhà trường và phụ huynh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`${item.color} p-6 flex justify-center items-center`}
                >
                  <div className="bg-white/20 p-4 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  {item.link && (
                    <Link
                      to={item.link}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xem chi tiết
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Đối tượng sử dụng
            </h2>
            <p className="text-lg text-gray-600">
              Ứng dụng được thiết kế để phục vụ các đối tượng khác nhau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audiences.map((audience, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`${audience.color} p-6 flex justify-center items-center`}
                >
                  <div className="bg-white/20 p-4 rounded-full">
                    {audience.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{audience.description}</p>
                  {audience.link ? (
                    <Link
                      to={audience.link}
                      className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                    >
                      {audience.buttonText}
                    </Link>
                  ) : (
                    <button className="inline-block py-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition-colors text-sm">
                      {audience.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Connection Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kết nối với phụ huynh
            </h2>
            <p className="text-lg text-gray-600">
              Hỗ trợ kết nối và quản lý hồ sơ sức khỏe cho phụ huynh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  Hồ sơ sức khỏe
                </h3>
                <p className="text-gray-600 mb-4">
                  Quản lý thông tin sức khỏe học sinh với lịch sử bệnh án, tiêm
                  chủng và điều trị một cách toàn diện.
                </p>
                <Link
                  to="/parent/health-profile"
                  className="inline-flex items-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
                >
                  Quản lý hồ sơ sức khỏe
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
