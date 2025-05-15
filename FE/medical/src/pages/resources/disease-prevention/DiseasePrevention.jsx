import React from "react";
import { Link } from "react-router-dom";

const DiseasePrevention = () => {
  const preventionResources = [
    {
      title: "Hướng dẫn phòng chống các bệnh truyền nhiễm phổ biến",
      description:
        "Tài liệu hướng dẫn nhận biết, phòng ngừa và ứng phó với các bệnh truyền nhiễm thường gặp trong môi trường học đường.",
      downloadLink: "#",
      icon: "🦠",
    },
    {
      title: "Quy trình xử lý khi có dịch bệnh tại trường học",
      description:
        "Quy trình chi tiết về các bước cần thực hiện khi phát hiện ca bệnh hoặc có dịch bệnh bùng phát trong trường học.",
      downloadLink: "#",
      icon: "📋",
    },
    {
      title: "Vệ sinh trường học và phòng ngừa bệnh tật",
      description:
        "Hướng dẫn chi tiết về vệ sinh trường học, lớp học để phòng ngừa các bệnh truyền nhiễm và không truyền nhiễm.",
      downloadLink: "#",
      icon: "🧼",
    },
    {
      title: "Poster/infographic phòng chống dịch bệnh",
      description:
        "Bộ sưu tập các poster, infographic về phòng chống dịch bệnh dành cho học sinh các cấp.",
      downloadLink: "#",
      icon: "🖼️",
    },
    {
      title: "Bài giảng về phòng chống dịch bệnh trong trường học",
      description:
        "Bộ bài giảng dành cho giáo viên để tuyên truyền, giáo dục học sinh về phòng chống dịch bệnh.",
      downloadLink: "#",
      icon: "👨‍🏫",
    },
  ];

  const commonDiseases = [
    {
      name: "Cúm mùa",
      symptoms: "Sốt cao, ho, đau họng, đau nhức cơ thể, mệt mỏi",
      prevention:
        "Tiêm vắc-xin cúm hàng năm, rửa tay thường xuyên, tránh tiếp xúc với người bệnh",
      icon: "🤒",
    },
    {
      name: "Sởi",
      symptoms: "Sốt cao, phát ban đỏ, ho, chảy nước mũi, mắt đỏ",
      prevention: "Tiêm vắc-xin MMR, cách ly người bệnh",
      icon: "😷",
    },
    {
      name: "Thủy đậu",
      symptoms: "Phát ban ngứa, mụn nước, sốt nhẹ",
      prevention: "Tiêm vắc-xin thủy đậu, cách ly người bệnh 5-7 ngày",
      icon: "💉",
    },
    {
      name: "Tay chân miệng",
      symptoms: "Sốt, phát ban ở lòng bàn tay, lòng bàn chân, loét miệng",
      prevention: "Rửa tay thường xuyên, vệ sinh đồ dùng, đồ chơi",
      icon: "👐",
    },
    {
      name: "Viêm kết mạc (đau mắt đỏ)",
      symptoms: "Mắt đỏ, ngứa, chảy nước mắt, có gỉ mắt",
      prevention:
        "Rửa tay thường xuyên, không dùng chung khăn mặt, vật dụng cá nhân",
      icon: "👁️",
    },
  ];

  const preventionStats = [
    {
      stat: "80%",
      text: "các bệnh truyền nhiễm có thể phòng ngừa bằng vệ sinh cá nhân tốt",
    },
    {
      stat: "50%",
      text: "giảm nguy cơ lây nhiễm bệnh nhờ rửa tay đúng cách thường xuyên",
    },
    {
      stat: "90%",
      text: "hiệu quả của vắc-xin trong việc ngăn ngừa các bệnh truyền nhiễm nghiêm trọng",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#health-resources"
            className="flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 group-hover:bg-cyan-200 mr-2 transition-colors duration-300">
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
          <div className="bg-cyan-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Tài liệu y tế
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M39.9,-65.7C52.8,-60.1,65,-51,74.2,-38.1C83.4,-25.3,89.6,-8.8,87.7,6.6C85.7,21.9,75.6,36,63.3,45.2C51,54.3,36.5,58.5,22.7,63.1C8.9,67.8,-4.3,72.8,-17.2,70.9C-30.1,68.9,-42.6,59.9,-52.6,48.6C-62.7,37.3,-70.4,23.6,-73.6,8.3C-76.9,-7,-75.8,-23.9,-68.4,-37.5C-60.9,-51.1,-47.2,-61.5,-33.2,-66.5C-19.1,-71.5,-4.7,-71.1,8.5,-67.8C21.7,-64.5,27,-71.3,39.9,-65.7Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Phòng chống dịch bệnh trong trường học
            </h1>
            <p className="text-cyan-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Kiến thức và biện pháp thiết thực giúp ngăn ngừa, phát hiện sớm và
              ứng phó hiệu quả với các dịch bệnh trong môi trường học đường.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Phòng chống dịch bệnh trong trường học là nhiệm vụ quan trọng và
                cần thiết để bảo vệ sức khỏe của học sinh, giáo viên và nhân
                viên nhà trường. Việc phòng chống dịch bệnh hiệu quả giúp đảm
                bảo môi trường học tập an toàn và giảm thiểu sự gián đoạn trong
                hoạt động giáo dục.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
              {preventionStats.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-xl shadow-sm text-center"
                >
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    {item.stat}
                  </div>
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <span className="flex items-center justify-center w-8 h-8 bg-cyan-100 rounded-lg mr-3 text-cyan-600">
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
                Nguyên tắc chung về phòng chống dịch bệnh
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                <li className="flex items-start text-gray-600">
                  <span className="text-cyan-500 mr-2 flex-shrink-0">•</span>
                  Tăng cường công tác giám sát, phát hiện sớm ca bệnh
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-cyan-500 mr-2 flex-shrink-0">•</span>
                  Đảm bảo vệ sinh môi trường, vệ sinh cá nhân
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-cyan-500 mr-2 flex-shrink-0">•</span>
                  Thực hiện cách ly kịp thời đối với các ca bệnh nghi ngờ
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-cyan-500 mr-2 flex-shrink-0">•</span>
                  Tuyên truyền, giáo dục nâng cao nhận thức
                </li>
                <li className="flex items-start text-gray-600">
                  <span className="text-cyan-500 mr-2 flex-shrink-0">•</span>
                  Phối hợp chặt chẽ với cơ quan y tế địa phương
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-5 mt-8 text-center">
              Biện pháp phòng chống dịch bệnh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">👏</span>
                  Vệ sinh cá nhân
                </h3>
                <p className="text-gray-600">
                  Rửa tay thường xuyên bằng xà phòng hoặc dung dịch sát khuẩn.
                  Che miệng khi ho, hắt hơi bằng khăn giấy hoặc khuỷu tay.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-medium text-green-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🧹</span>
                  Vệ sinh môi trường
                </h3>
                <p className="text-gray-600">
                  Lau dọn, khử khuẩn bề mặt thường xuyên tiếp xúc. Đảm bảo không
                  gian học tập thông thoáng, đủ ánh sáng.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-medium text-amber-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🔍</span>
                  Giám sát sức khỏe
                </h3>
                <p className="text-gray-600">
                  Kiểm tra sức khỏe học sinh đầu giờ, phát hiện sớm các trường
                  hợp có biểu hiện bệnh để cách ly kịp thời.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">💉</span>
                  Tiêm chủng
                </h3>
                <p className="text-gray-600">
                  Đảm bảo học sinh được tiêm chủng đầy đủ các loại vắc-xin theo
                  quy định của Bộ Y tế.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              Các bệnh thường gặp ở trường học
            </h2>
            <div className="flex justify-center">
              <span className="text-4xl">🏥</span>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-100 to-cyan-200">
                    <th className="py-3 px-4 text-left font-semibold text-gray-700"></th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Bệnh
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Triệu chứng
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Phòng ngừa
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commonDiseases.map((disease, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-cyan-50 transition-colors"
                          : "bg-gray-50 hover:bg-cyan-50 transition-colors"
                      }
                    >
                      <td className="py-3 px-4 text-2xl">{disease.icon}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {disease.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {disease.symptoms}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {disease.prevention}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="bg-cyan-100 text-cyan-600 p-2 rounded-lg mr-3">
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
          Tài liệu phòng chống dịch bệnh
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preventionResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-medium truncate">
                  {resource.title}
                </h3>
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <a
                  href={resource.downloadLink}
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 group-hover:translate-x-1 transition-transform duration-300"
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

export default DiseasePrevention;
