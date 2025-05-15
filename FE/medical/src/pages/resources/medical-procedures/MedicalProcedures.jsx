import React from "react";
import { Link } from "react-router-dom";

const MedicalProcedures = () => {
  const procedureResources = [
    {
      title: "Quy trình kiểm tra sức khỏe định kỳ cho học sinh",
      description:
        "Hướng dẫn chi tiết về quy trình tổ chức kiểm tra sức khỏe định kỳ cho học sinh các cấp, bao gồm biểu mẫu và lịch trình thực hiện.",
      downloadLink: "#",
      icon: "🔍",
    },
    {
      title: "Hệ thống quản lý hồ sơ sức khỏe học sinh",
      description:
        "Tài liệu hướng dẫn xây dựng và quản lý hệ thống hồ sơ sức khỏe học sinh, đảm bảo theo dõi liên tục và bảo mật thông tin.",
      downloadLink: "#",
      icon: "📊",
    },
    {
      title: "Quy trình xử lý các trường hợp học sinh bị bệnh tại trường",
      description:
        "Quy trình chi tiết về các bước cần thực hiện khi học sinh có dấu hiệu bệnh tại trường, bao gồm quy trình thông báo cho phụ huynh.",
      downloadLink: "#",
      icon: "🤒",
    },
    {
      title: "Biểu mẫu báo cáo y tế trường học",
      description:
        "Bộ biểu mẫu báo cáo y tế trường học theo quy định, bao gồm báo cáo định kỳ và báo cáo đột xuất.",
      downloadLink: "#",
      icon: "📝",
    },
    {
      title: "Quy trình phối hợp với cơ sở y tế địa phương",
      description:
        "Hướng dẫn về quy trình phối hợp giữa trường học và cơ sở y tế địa phương trong chăm sóc sức khỏe học sinh.",
      downloadLink: "#",
      icon: "🏥",
    },
  ];

  const medicalForms = [
    {
      name: "Phiếu khám sức khỏe học sinh",
      purpose: "Sử dụng trong các đợt khám sức khỏe định kỳ",
      downloadLink: "#",
      icon: "📋",
    },
    {
      name: "Sổ theo dõi sức khỏe cá nhân",
      purpose: "Theo dõi tình trạng sức khỏe của từng học sinh",
      downloadLink: "#",
      icon: "📔",
    },
    {
      name: "Biên bản sự cố y tế",
      purpose: "Ghi nhận các sự cố y tế xảy ra trong trường học",
      downloadLink: "#",
      icon: "⚠️",
    },
    {
      name: "Giấy xác nhận sức khỏe",
      purpose:
        "Xác nhận tình trạng sức khỏe học sinh khi tham gia các hoạt động đặc biệt",
      downloadLink: "#",
      icon: "✅",
    },
    {
      name: "Báo cáo tình hình sức khỏe định kỳ",
      purpose:
        "Báo cáo tổng hợp về tình hình sức khỏe học sinh theo học kỳ/năm học",
      downloadLink: "#",
      icon: "📈",
    },
  ];

  const medicalFacts = [
    {
      fact: "Trường học có quy trình y tế rõ ràng giảm 40% nguy cơ lây lan bệnh truyền nhiễm",
    },
    {
      fact: "Kiểm tra sức khỏe định kỳ giúp phát hiện sớm 65% các vấn đề sức khỏe tiềm ẩn ở học sinh",
    },
    {
      fact: "Chỉ 35% trường học có hồ sơ sức khỏe đầy đủ và cập nhật thường xuyên cho học sinh",
    },
    {
      fact: "Phối hợp tốt với cơ sở y tế địa phương giúp xử lý hiệu quả 80% các tình huống y tế khẩn cấp",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#health-resources"
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
          <div className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Tài liệu y tế
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M45.3,-76.3C59.9,-69.9,73.8,-59.2,81.3,-45.1C88.7,-31,89.7,-13.5,86.9,2.7C84.2,18.9,77.6,34,67.9,46.9C58.3,59.9,45.6,70.8,31.1,77.1C16.6,83.4,0.3,85,-15.7,81.5C-31.8,78,-47.7,69.5,-58.4,57.4C-69.1,45.3,-74.7,29.7,-78.8,13.1C-83,-3.5,-85.7,-21.1,-80.3,-36C-74.9,-50.9,-61.3,-63.2,-46.4,-69.5C-31.4,-75.9,-15.7,-76.4,0.6,-77.4C16.9,-78.3,33.7,-79.7,45.3,-76.3Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Quy trình y tế trường học
            </h1>
            <p className="text-blue-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Hướng dẫn, quy định và biểu mẫu cần thiết giúp đảm bảo sức khỏe
              của học sinh trong suốt quá trình học tập.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Quy trình y tế trường học là các hướng dẫn, quy định và biểu mẫu
                cần thiết cho công tác y tế học đường, giúp đảm bảo sức khỏe của
                học sinh trong suốt quá trình học tập. Các quy trình này bao gồm
                các biện pháp phòng ngừa, theo dõi và xử lý các vấn đề sức khỏe
                của học sinh trong môi trường trường học.
              </p>
            </div>

            <div className="flex flex-wrap -mx-4 mt-8">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 text-blue-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </span>
                    Tầm quan trọng của quy trình y tế
                  </h2>
                  <ul className="list-none pl-11 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Đảm bảo an toàn và sức khỏe cho học sinh, giáo viên và
                      nhân viên
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Giúp phát hiện sớm các vấn đề sức khỏe và có biện pháp can
                      thiệp kịp thời
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Tạo cơ sở để theo dõi sức khỏe học sinh một cách hệ thống,
                      liên tục
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Xây dựng môi trường học đường lành mạnh, an toàn
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Đảm bảo tuân thủ các quy định pháp luật về y tế trường học
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 backdrop-blur-sm"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Bạn có biết?
                    </h3>
                    <div className="space-y-3">
                      {medicalFacts.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start bg-white bg-opacity-80 p-3 rounded-lg shadow-sm"
                        >
                          <span className="flex-shrink-0 text-xl mr-3">💡</span>
                          <p className="text-sm text-gray-700">{item.fact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-5 mt-8 text-center">
              Các quy trình y tế cơ bản trong trường học
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🩺</span>
                  Khám sức khỏe định kỳ
                </h3>
                <p className="text-gray-600">
                  Tổ chức khám sức khỏe toàn diện cho học sinh ít nhất một lần
                  mỗi năm học, với sự tham gia của các chuyên gia y tế.
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-indigo-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">📁</span>
                  Quản lý hồ sơ sức khỏe
                </h3>
                <p className="text-gray-600">
                  Lập và quản lý hồ sơ sức khỏe cho mỗi học sinh, cập nhật
                  thường xuyên trong suốt quá trình học tập.
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-red-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🚨</span>
                  Xử lý tình huống khẩn cấp
                </h3>
                <p className="text-gray-600">
                  Quy trình xử lý các tình huống y tế khẩn cấp, bao gồm sơ cứu,
                  thông báo cho phụ huynh và chuyển đến cơ sở y tế khi cần
                  thiết.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-green-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🦠</span>
                  Giám sát bệnh truyền nhiễm
                </h3>
                <p className="text-gray-600">
                  Theo dõi, phát hiện sớm và có biện pháp ứng phó kịp thời đối
                  với các bệnh truyền nhiễm trong trường học.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              Biểu mẫu y tế trường học
            </h2>
            <div className="flex justify-center">
              <span className="text-4xl">📑</span>
            </div>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">
                      Icon
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Tên biểu mẫu
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Mục đích sử dụng
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">
                      Tải xuống
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {medicalForms.map((form, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-blue-50 transition-colors"
                          : "bg-gray-50 hover:bg-blue-50 transition-colors"
                      }
                    >
                      <td className="py-3 px-4 text-center text-2xl">
                        {form.icon}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {form.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {form.purpose}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a
                          href={form.downloadLink}
                          className="text-blue-600 hover:text-blue-700 inline-flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Tải xuống
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">👨‍⚕️</span>
                <h3 className="text-lg font-semibold">
                  Vai trò của nhân viên y tế trường học
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Triển khai các chương trình chăm sóc sức khỏe cho học sinh
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Thực hiện công tác sơ cứu và xử lý tình huống khẩn cấp
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Quản lý hồ sơ sức khỏe của học sinh
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Tuyên truyền, giáo dục sức khỏe cho học sinh và giáo viên
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Phối hợp với cơ sở y tế địa phương trong chăm sóc sức khỏe học
                  sinh
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">✅</span>
                <h3 className="text-lg font-semibold">
                  Tiêu chuẩn phòng y tế trường học
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Đảm bảo diện tích tối thiểu theo quy định
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Trang bị đầy đủ dụng cụ y tế, thuốc thiết yếu
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Có nhân viên y tế được đào tạo chuyên môn
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Hệ thống lưu trữ hồ sơ y tế an toàn, bảo mật
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Tuân thủ các quy định vệ sinh, khử khuẩn
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </span>
          Tài liệu quy trình y tế trường học
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedureResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-medium truncate">
                  {resource.title}
                </h3>
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <a
                  href={resource.downloadLink}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform duration-300"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Tải xuống tài liệu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalProcedures;
