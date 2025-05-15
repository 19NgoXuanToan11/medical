import React from "react";
import { Link } from "react-router-dom";

const FirstAid = () => {
  const firstAidResources = [
    {
      title: "Sơ cứu chấn thương nhẹ trong trường học",
      description:
        "Hướng dẫn chi tiết cách xử lý các chấn thương nhẹ thường gặp như trầy xước, bong gân, chảy máu mũi.",
      downloadLink: "#",
      icon: "🩹",
    },
    {
      title: "Sơ cứu gãy xương và bong gân",
      description:
        "Tài liệu hướng dẫn nhận biết và sơ cứu ban đầu đối với các trường hợp gãy xương và bong gân thường gặp trong hoạt động thể thao.",
      downloadLink: "#",
      icon: "🦴",
    },
    {
      title: "Sơ cứu đuối nước",
      description:
        "Quy trình sơ cứu đuối nước khi tham gia các hoạt động bơi lội, dã ngoại gần khu vực có nước.",
      downloadLink: "#",
      icon: "🏊‍♂️",
    },
    {
      title: "Hướng dẫn sơ cứu bỏng",
      description:
        "Các bước xử lý khi có người bị bỏng, phân loại mức độ bỏng và cách xử lý từng loại.",
      downloadLink: "#",
      icon: "🔥",
    },
    {
      title: "Sơ cứu khi học sinh bị ngất",
      description:
        "Quy trình xử lý khi học sinh bị ngất xỉu, cách nhận biết nguyên nhân và các bước sơ cứu an toàn.",
      downloadLink: "#",
      icon: "😴",
    },
  ];

  const emergencySteps = [
    {
      step: "1. Đảm bảo an toàn",
      description:
        "Kiểm tra khu vực xung quanh, đảm bảo không có nguy hiểm tiếp theo đe dọa nạn nhân và người sơ cứu.",
      icon: "🔍",
    },
    {
      step: "2. Kiểm tra tình trạng nạn nhân",
      description: "Kiểm tra ý thức, đường thở, nhịp thở và mạch của nạn nhân.",
      icon: "👨‍⚕️",
    },
    {
      step: "3. Gọi cấp cứu",
      description:
        "Gọi số cấp cứu 115 hoặc yêu cầu người khác gọi nếu tình trạng nghiêm trọng. Cung cấp thông tin chính xác về vị trí và tình trạng nạn nhân.",
      icon: "📞",
    },
    {
      step: "4. Thực hiện sơ cứu cơ bản",
      description:
        "Áp dụng các biện pháp sơ cứu phù hợp với tình trạng của nạn nhân.",
      icon: "🩺",
    },
    {
      step: "5. Theo dõi nạn nhân",
      description:
        "Tiếp tục theo dõi tình trạng của nạn nhân cho đến khi lực lượng y tế chuyên nghiệp tới.",
      icon: "⏱️",
    },
  ];

  const firstAidFacts = [
    {
      fact: "90% các tai nạn thường gặp ở trường học có thể được xử lý hiệu quả bằng kỹ năng sơ cứu cơ bản",
    },
    {
      fact: "Mỗi năm, khoảng 25% học sinh gặp phải tình huống cần sơ cứu trong môi trường học đường",
    },
    {
      fact: "Chỉ 30% giáo viên tự tin về khả năng sơ cứu của mình trong trường hợp khẩn cấp",
    },
    {
      fact: "Hành động trong 3 phút đầu tiên khi xảy ra tai nạn có thể quyết định tới 70% khả năng hồi phục của nạn nhân",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-red-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#health-resources"
            className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 group-hover:bg-red-200 mr-2 transition-colors duration-300">
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
          <div className="bg-red-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Tài liệu sơ cứu
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 relative">
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
              Sơ cứu học đường
            </h1>
            <p className="text-red-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Kỹ năng thiết yếu giúp đảm bảo an toàn và cứu sống học sinh trong
              các tình huống khẩn cấp tại trường học.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Sơ cứu học đường là một kỹ năng thiết yếu đối với giáo viên và
                nhân viên trường học. Việc nắm vững các kỹ thuật sơ cứu cơ bản
                giúp đảm bảo an toàn và có thể cứu sống học sinh trong các tình
                huống khẩn cấp.
              </p>
            </div>

            <div className="flex flex-wrap -mx-4 mt-8">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-amber-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mr-3 text-red-600">
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
                    Các trường hợp cần sơ cứu thường gặp
                  </h2>
                  <ul className="list-none pl-11 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Chảy máu nhẹ, trầy xước, vết thương hở
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Bong gân, gãy xương khi chơi thể thao
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Bỏng do tiếp xúc với nước nóng hoặc hóa chất
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Hóc dị vật đường thở
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Ngất xỉu, co giật
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      Sốc phản vệ do dị ứng
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-amber-500/20 backdrop-blur-sm"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Bạn có biết?
                    </h3>
                    <div className="space-y-3">
                      {firstAidFacts.map((item, index) => (
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

            <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded mb-6">
              <p className="text-red-700">
                <strong>Lưu ý quan trọng:</strong> Các tài liệu này chỉ cung cấp
                hướng dẫn sơ cứu ban đầu. Trong mọi trường hợp khẩn cấp, luôn
                gọi cấp cứu (115) và thông báo cho phụ huynh/người giám hộ của
                học sinh.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              Quy trình sơ cứu khẩn cấp cơ bản
            </h2>
            <div className="flex justify-center">
              <span className="text-4xl">🚑</span>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {emergencySteps.map((item, index) => (
                <div
                  key={index}
                  className="flex bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.step}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Những điều cần tránh khi sơ cứu
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Di chuyển nạn nhân khi nghi ngờ có chấn thương cột sống
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Cho nạn nhân bất tỉnh uống nước hoặc thuốc
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Rút bỏ dị vật đâm xuyên vào cơ thể
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Áp dụng ga-rô khi không cần thiết
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Đặt thuốc hoặc chất khác lên vết thương hở
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">🧰</span>
                <h3 className="text-lg font-semibold">
                  Trang bị túi sơ cứu cơ bản
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Băng gạc vô trùng các loại
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Băng dính y tế, băng cuộn
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Kéo, nhíp, găng tay y tế
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Dung dịch sát khuẩn, cồn
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Nhiệt kế, túi chườm nóng/lạnh
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Danh sách số điện thoại khẩn cấp
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
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
          Tài liệu sơ cứu học đường
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstAidResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-medium truncate">
                  {resource.title}
                </h3>
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <a
                  href={resource.downloadLink}
                  className="inline-flex items-center text-red-600 hover:text-red-700 group-hover:translate-x-1 transition-transform duration-300"
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

export default FirstAid;
