import React from "react";
import { Link } from "react-router-dom";

const MentalHealth = () => {
  const mentalHealthResources = [
    {
      title: "Hướng dẫn nhận biết dấu hiệu stress ở học sinh",
      description:
        "Tài liệu giúp giáo viên và phụ huynh nhận biết các dấu hiệu stress, lo âu ở học sinh các cấp và cách hỗ trợ kịp thời.",
      downloadLink: "#",
      icon: "😌",
    },
    {
      title: "Kỹ năng quản lý cảm xúc cho học sinh",
      description:
        "Tài liệu hướng dẫn giáo viên và phụ huynh cách dạy học sinh nhận diện và quản lý cảm xúc hiệu quả.",
      downloadLink: "#",
      icon: "🧠",
    },
    {
      title: "Phòng chống bắt nạt học đường",
      description:
        "Hướng dẫn toàn diện về nhận biết, phòng ngừa và can thiệp tình trạng bắt nạt học đường, bao gồm cả bắt nạt trực tuyến.",
      downloadLink: "#",
      icon: "🛡️",
    },
    {
      title: "Xây dựng môi trường học đường tích cực",
      description:
        "Tài liệu về các hoạt động, biện pháp xây dựng môi trường học đường an toàn, thân thiện, tích cực cho học sinh.",
      downloadLink: "#",
      icon: "🌈",
    },
    {
      title: "Kỹ năng lắng nghe và trò chuyện với học sinh",
      description:
        "Hướng dẫn kỹ năng giao tiếp, lắng nghe và trò chuyện hiệu quả với học sinh về các vấn đề sức khỏe tâm thần.",
      downloadLink: "#",
      icon: "👂",
    },
  ];

  const supportResources = [
    {
      title: "Đường dây nóng hỗ trợ tâm lý học đường",
      phone: "1800 xxxx",
      hours: "24/7",
      icon: "☎️",
    },
    {
      title: "Tổng đài tư vấn tâm lý trẻ em quốc gia",
      phone: "111",
      hours: "7:30 - 21:00 hàng ngày",
      icon: "👶",
    },
    {
      title: "Đường dây tư vấn sức khỏe tâm thần",
      phone: "1900 xxxx",
      hours: "8:00 - 20:00 từ thứ 2 đến thứ 6",
      icon: "🧘",
    },
  ];

  const mentalHealthFacts = [
    {
      fact: "20% học sinh độ tuổi 14-18 gặp vấn đề về sức khỏe tâm thần, nhưng chỉ 30% được hỗ trợ kịp thời",
    },
    {
      fact: "Stress và lo âu có thể làm giảm 15-30% hiệu suất học tập của học sinh",
    },
    {
      fact: "Chỉ 25% học sinh cảm thấy thoải mái khi chia sẻ các vấn đề sức khỏe tâm thần với thầy cô",
    },
    {
      fact: "Việc quan tâm đến sức khỏe tâm thần có thể cải thiện kết quả học tập lên tới 40%",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#health-resources"
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 group-hover:bg-purple-200 mr-2 transition-colors duration-300">
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
          <div className="bg-purple-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Tài liệu tâm lý
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 relative">
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
              Sức khỏe tâm thần học đường
            </h1>
            <p className="text-purple-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Hỗ trợ phát triển kỹ năng xã hội, cảm xúc và nhận thức cho học
              sinh, nâng cao khả năng học tập và thích ứng với môi trường học
              đường.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Sức khỏe tâm thần học đường đóng vai trò quan trọng trong sự
                phát triển toàn diện của học sinh. Việc quan tâm đến sức khỏe
                tâm thần giúp học sinh phát triển kỹ năng xã hội, cảm xúc và
                nhận thức, đồng thời nâng cao khả năng học tập và thích ứng với
                môi trường học đường.
              </p>
            </div>

            <div className="flex flex-wrap -mx-4 mt-8">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3 text-purple-600">
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
                    Tầm quan trọng của sức khỏe tâm thần học đường
                  </h2>
                  <ul className="list-none pl-11 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      Nâng cao hiệu quả học tập và khả năng tập trung
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      Cải thiện kỹ năng xã hội và mối quan hệ giữa các học sinh
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      Giảm nguy cơ mắc các vấn đề về tâm lý như trầm cảm, lo âu
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      Phát triển khả năng phục hồi và đối phó với stress
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      Xây dựng nền tảng vững chắc cho sức khỏe tâm thần lâu dài
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20 backdrop-blur-sm"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Bạn có biết?
                    </h3>
                    <div className="space-y-3">
                      {mentalHealthFacts.map((item, index) => (
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

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded mb-6">
              <p className="text-yellow-700">
                <strong>Lưu ý quan trọng:</strong> Các tài liệu này chỉ mang
                tính chất tham khảo và hỗ trợ ban đầu. Đối với các vấn đề sức
                khỏe tâm thần nghiêm trọng, cần tham khảo ý kiến của chuyên gia
                tâm lý hoặc bác sĩ tâm thần.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-5 mt-8 text-center">
              Dấu hiệu cần quan tâm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-indigo-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🔍</span>
                  Thay đổi hành vi
                </h3>
                <p className="text-gray-600">
                  Học sinh trở nên thu mình, tách biệt khỏi bạn bè, gia đình
                  hoặc có hành vi hung hăng bất thường.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">📚</span>
                  Suy giảm học tập
                </h3>
                <p className="text-gray-600">
                  Kết quả học tập giảm sút đột ngột, mất tập trung hoặc không
                  quan tâm đến các hoạt động yêu thích trước đây.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">🕰️</span>
                  Thay đổi thói quen
                </h3>
                <p className="text-gray-600">
                  Thay đổi đáng kể trong thói quen ăn uống, ngủ nghỉ hoặc xuất
                  hiện các triệu chứng thể chất như đau đầu, đau bụng thường
                  xuyên.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200 transition-transform duration-300 hover:translate-y-[-5px]">
                <h3 className="font-medium text-pink-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">😰</span>
                  Biểu hiện lo âu
                </h3>
                <p className="text-gray-600">
                  Lo lắng quá mức, sợ hãi, khó thở, tim đập nhanh hoặc tránh né
                  các hoạt động xã hội, học tập.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Các đường dây hỗ trợ tâm lý
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportResources.map((resource, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-xl hover:bg-white/20 transition-colors duration-300"
              >
                <span className="text-3xl mb-3 block">{resource.icon}</span>
                <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
                <p className="text-2xl font-bold mb-1">{resource.phone}</p>
                <p className="text-sm opacity-80">
                  Hoạt động: {resource.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
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
          Tài liệu sức khỏe tâm thần học đường
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentalHealthResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-medium truncate">
                  {resource.title}
                </h3>
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <a
                  href={resource.downloadLink}
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 group-hover:translate-x-1 transition-transform duration-300"
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

export default MentalHealth;
