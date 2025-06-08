import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FloatingCards, SpotlightCard, FadeIn } from "../../animation";

const RoleDemo = () => {
  const [activeRole, setActiveRole] = useState("parent");

  const roles = [
    {
      id: "student",
      title: "Học Sinh",
      description: "Xem thông tin thuốc, sự kiện y tế và tài liệu sức khỏe",
      features: [
        {
          title: "Thuốc của tôi",
          description: "Xem thông tin về thuốc đang được sử dụng",
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
        },
        {
          title: "Sự kiện y tế",
          description: "Xem thông tin về các sự kiện y tế liên quan",
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Tài liệu sức khỏe",
          description: "Truy cập tài liệu và thông tin về sức khỏe",
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "parent",
      title: "Phụ Huynh",
      description:
        "Quản lý hồ sơ sức khỏe con em, gửi thuốc, xem lịch tiêm chủng, và theo dõi sự kiện y tế",
      features: [
        {
          title: "Hồ sơ sức khỏe",
          description: "Khai báo và theo dõi hồ sơ sức khỏe của học sinh",
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        },
        {
          title: "Gửi thuốc",
          description:
            "Đăng ký gửi thuốc cho học sinh và theo dõi lịch sử gửi thuốc",
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
        },
        {
          title: "Tiêm chủng",
          description:
            "Xác nhận phiếu đồng ý tiêm chủng và xem lịch tiêm chủng",
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
                d="M12 14l9-5-9-5-9 5 9 5m0 0l9-5-9-5-9 5 9 5m0 0v6"
              />
            </svg>
          ),
        },
        {
          title: "Sự kiện y tế",
          description: "Theo dõi các sự kiện y tế tại trường và kết quả xử lý",
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Kiểm tra y tế",
          description: "Xác nhận phiếu kiểm tra y tế và xem kết quả kiểm tra",
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "nurse",
      title: "Nhân Viên Y Tế",
      description:
        "Quản lý sự kiện y tế, tiêm chủng, thuốc và kiểm tra y tế định kỳ",
      features: [
        {
          title: "Quản lý thuốc",
          description:
            "Quản lý yêu cầu gửi thuốc từ phụ huynh và theo dõi việc sử dụng thuốc",
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
        },
        {
          title: "Kiểm tra y tế",
          description:
            "Tạo kế hoạch kiểm tra y tế và ghi nhận kết quả kiểm tra",
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Sự kiện y tế",
          description: "Ghi nhận và xử lý các sự kiện y tế tại trường",
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Tiêm chủng",
          description:
            "Quản lý kế hoạch tiêm chủng và ghi nhận kết quả tiêm chủng",
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
                d="M12 14l9-5-9-5-9 5 9 5m0 0l9-5-9-5-9 5 9 5m0 0v6"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "manager",
      title: "Quản Lý",
      description:
        "Quản lý hồ sơ phụ huynh, học sinh, và kho thuốc, vật tư y tế",
      features: [
        {
          title: "Quản lý phụ huynh",
          description: "Quản lý tài khoản và thông tin của phụ huynh",
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
        },
        {
          title: "Quản lý học sinh",
          description: "Quản lý hồ sơ và thông tin của học sinh",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
          ),
        },
        {
          title: "Kho thuốc",
          description: "Quản lý kho thuốc và theo dõi tồn kho",
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        },
        {
          title: "Vật tư y tế",
          description: "Quản lý vật tư y tế và theo dõi tồn kho",
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "admin",
      title: "Quản Trị Viên",
      description: "Quản lý người dùng, vai trò và quyền hạn trong hệ thống",
      features: [
        {
          title: "Quản lý người dùng",
          description: "Quản lý tài khoản người dùng trong hệ thống",
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
        },
        {
          title: "Vai trò người dùng",
          description: "Quản lý vai trò của người dùng trong hệ thống",
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
        },
        {
          title: "Quyền hạn",
          description: "Quản lý quyền hạn của người dùng trong hệ thống",
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
        },
        {
          title: "Báo cáo & Phân tích",
          description: "Xem báo cáo và phân tích dữ liệu trong hệ thống",
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Khám phá các chức năng theo vai trò
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nền tảng y tế học đường cung cấp các chức năng khác nhau cho từng
            vai trò người dùng. Đăng nhập để trải nghiệm đầy đủ các tính năng
            dành cho vai trò của bạn.
          </p>
        </div>

        {/* Role tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeRole === role.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveRole(role.id)}
            >
              {role.title}
            </button>
          ))}
        </div>

        {/* Active role description */}
        {roles.map(
          (role) =>
            activeRole === role.id && (
              <div key={role.id} className="mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {role.description}
                  </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {role.features.map((feature, index) => (
                    <FadeIn key={index} delay={index * 0.1} direction="up">
                      <FloatingCards
                        className="h-full"
                        scale={1.03}
                        perspective={800}
                        tiltDegree={10}
                      >
                        <SpotlightCard
                          className="bg-white rounded-lg shadow-md p-6 h-full relative overflow-hidden group"
                          spotlightSize={250}
                          spotlightColor="rgba(59, 130, 246, 0.15)"
                          background="white"
                          border="none"
                        >
                          <div className="absolute top-0 right-0 p-2 bg-blue-100 text-blue-600 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Đăng nhập để truy cập
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="text-blue-600 mb-4">
                              {feature.icon}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </SpotlightCard>
                      </FloatingCards>
                    </FadeIn>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Login CTA */}
        <FadeIn direction="up" delay={0.3}>
          <div className="text-center mt-10">
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Đăng nhập để trải nghiệm
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default RoleDemo;
