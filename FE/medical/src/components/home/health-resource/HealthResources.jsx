import React from "react";

const HealthResources = () => {
  const resources = [
    {
      title: "Dinh dưỡng học đường",
      description:
        "Hướng dẫn về chế độ dinh dưỡng cân đối cho học sinh các cấp.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
      link: "/resources/nutrition",
    },
    {
      title: "Phòng chống dịch bệnh",
      description:
        "Các biện pháp phòng chống dịch bệnh và ứng phó khi có dịch trong trường học.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      link: "/resources/disease-prevention",
    },
    {
      title: "Sức khỏe tâm thần",
      description:
        "Tài liệu và hướng dẫn về cách nhận biết, hỗ trợ sức khỏe tâm thần cho học sinh.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      link: "/resources/mental-health",
    },
    {
      title: "Sơ cứu học đường",
      description:
        "Hướng dẫn các kỹ thuật sơ cứu cơ bản dành cho giáo viên và nhân viên trường học.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      link: "/resources/first-aid",
    },
    {
      title: "Phát triển thể chất",
      description:
        "Tài liệu về các hoạt động thể chất phù hợp với lứa tuổi và sự phát triển của học sinh.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      link: "/resources/physical-development",
    },
    {
      title: "Quy trình y tế trường học",
      description:
        "Các quy trình, biểu mẫu và hướng dẫn cần thiết cho công tác y tế trường học.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      link: "/resources/medical-procedures",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Tổng hợp các tài liệu, hướng dẫn về sức khỏe học đường dành cho giáo
            viên, phụ huynh và học sinh.
          </h2>
          <div className="w-16 h-0.5 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="group block bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md mr-4 group-hover:bg-blue-100 transition-colors duration-300">
                    {resource.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {resource.title}
                  </h3>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {resource.description}
                </p>

                <div className="mt-4 text-blue-500 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                  Xem chi tiết
                  <svg
                    className="w-3.5 h-3.5 ml-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/resources"
            className="inline-flex items-center px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Xem tất cả tài liệu
            <svg
              className="w-3.5 h-3.5 ml-2"
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default HealthResources;
