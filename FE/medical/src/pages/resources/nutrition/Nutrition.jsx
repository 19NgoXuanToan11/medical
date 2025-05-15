import React from "react";
import { Link } from "react-router-dom";

const Nutrition = () => {
  const nutritionResources = [
    {
      title: "Chế độ dinh dưỡng cho học sinh tiểu học",
      description:
        "Hướng dẫn chi tiết về khẩu phần ăn, lượng calories và các dưỡng chất cần thiết cho học sinh tiểu học để phát triển toàn diện.",
      downloadLink: "#",
      icon: "🍎",
    },
    {
      title: "Thực đơn mẫu cho bữa ăn học đường",
      description:
        "Bộ sưu tập các thực đơn cân bằng dinh dưỡng theo tuần, theo mùa dành cho các bếp ăn trường học.",
      downloadLink: "#",
      icon: "🍱",
    },
    {
      title: "Dinh dưỡng cho học sinh thi đấu thể thao",
      description:
        "Hướng dẫn đặc biệt về dinh dưỡng cho học sinh tham gia các hoạt động thể thao, thi đấu các giải đấu học sinh.",
      downloadLink: "#",
      icon: "🏃‍♂️",
    },
    {
      title: "Phòng chống thừa cân, béo phì ở trẻ em",
      description:
        "Tài liệu hướng dẫn phát hiện sớm và can thiệp tình trạng thừa cân, béo phì ở học sinh các cấp.",
      downloadLink: "#",
      icon: "⚖️",
    },
    {
      title: "Xây dựng thói quen ăn uống lành mạnh",
      description:
        "Các hoạt động, trò chơi và bài học giúp học sinh hình thành thói quen ăn uống khoa học, lành mạnh.",
      downloadLink: "#",
      icon: "🥗",
    },
  ];

  const nutritionFacts = [
    {
      fact: "30% học sinh Việt Nam bỏ bữa sáng, ảnh hưởng đến khả năng tập trung và học tập",
    },
    {
      fact: "Trẻ em cần khoảng 20-30% lượng protein hàng ngày từ bữa ăn trưa ở trường",
    },
    {
      fact: "Chỉ 25% học sinh trung học được cung cấp đủ rau và trái cây theo khuyến nghị hàng ngày",
    },
    {
      fact: "Hơn 50% học sinh tăng lượng đường hàng ngày từ nước ngọt có gas và đồ ăn vặt",
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
            Tài liệu giáo dục
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M47.7,-57.2C59.5,-45.8,65.9,-28.6,68.8,-10.8C71.6,7.1,71,25.5,62.3,39.7C53.6,53.9,36.9,63.8,19.1,68.7C1.2,73.5,-17.8,73.3,-35.1,66.2C-52.5,59.1,-68.3,45.1,-73.3,28.3C-78.4,11.5,-72.8,-8.1,-64.5,-25.6C-56.2,-43,-45.2,-58.3,-31.4,-68.8C-17.6,-79.3,-0.9,-85.1,13.9,-80.5C28.6,-75.9,36,-68.6,47.7,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Dinh dưỡng học đường
            </h1>
            <p className="text-blue-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Hỗ trợ phát triển toàn diện cho học sinh thông qua chế độ dinh
              dưỡng khoa học, cân bằng và phù hợp với lứa tuổi.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Dinh dưỡng đóng vai trò quan trọng trong sự phát triển toàn diện
                của học sinh. Chế độ dinh dưỡng hợp lý không chỉ giúp các em
                phát triển thể chất mà còn nâng cao khả năng học tập và tăng
                cường sức đề kháng. Trang này cung cấp các tài liệu, hướng dẫn
                về dinh dưỡng học đường cho giáo viên, phụ huynh và học sinh.
              </p>
            </div>

            <div className="flex flex-wrap -mx-4 mt-8">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3 text-green-600">
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
                    Tầm quan trọng của dinh dưỡng học đường
                  </h2>
                  <ul className="list-none pl-11 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Hỗ trợ phát triển thể chất và trí tuệ
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Tăng cường hệ miễn dịch, phòng chống bệnh tật
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Cải thiện khả năng tập trung và học tập
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Hình thành thói quen ăn uống lành mạnh suốt đời
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 backdrop-blur-sm"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Bạn có biết?
                    </h3>
                    <div className="space-y-3">
                      {nutritionFacts.map((item, index) => (
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
              Các khuyến nghị về dinh dưỡng học đường
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🍳</span>
                  Bữa sáng quan trọng
                </h3>
                <p className="text-gray-600">
                  Học sinh nên ăn sáng đầy đủ trước khi đến trường. Bữa sáng
                  cung cấp năng lượng cho các hoạt động buổi sáng và tăng khả
                  năng tập trung.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🥗</span>
                  Đa dạng thực phẩm
                </h3>
                <p className="text-gray-600">
                  Khẩu phần ăn của học sinh nên đa dạng, bao gồm đủ các nhóm
                  thực phẩm: tinh bột, đạm, chất béo, rau xanh, trái cây.
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-red-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🍔</span>
                  Hạn chế đồ ăn nhanh
                </h3>
                <p className="text-gray-600">
                  Giảm thiểu tiêu thụ đồ ăn nhanh, đồ uống có ga và thực phẩm
                  chứa nhiều đường, muối và chất béo bão hòa.
                </p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-teal-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">💧</span>
                  Uống đủ nước
                </h3>
                <p className="text-gray-600">
                  Khuyến khích học sinh uống đủ nước, đặc biệt là nước lọc thay
                  vì các loại nước ngọt có đường.
                </p>
              </div>
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
          Tài liệu dinh dưỡng học đường
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white flex items-center justify-between">
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

export default Nutrition;
