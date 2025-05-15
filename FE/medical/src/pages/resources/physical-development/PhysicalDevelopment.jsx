import React from "react";
import { Link } from "react-router-dom";

const PhysicalDevelopment = () => {
  const physicalResources = [
    {
      title: "Hướng dẫn hoạt động thể chất phù hợp theo lứa tuổi",
      description:
        "Tài liệu phân loại các hoạt động thể chất phù hợp với từng độ tuổi, giúp phát triển thể chất toàn diện cho học sinh.",
      downloadLink: "#",
      icon: "📊",
    },
    {
      title: "Tài liệu về các bài tập tăng cường vận động",
      description:
        "Bộ sưu tập các bài tập đơn giản có thể thực hiện trong lớp học để tăng cường vận động cho học sinh.",
      downloadLink: "#",
      icon: "🤸",
    },
    {
      title: "Bài tập phát triển thể lực và sự khéo léo",
      description:
        "Các bài tập nhằm phát triển sức mạnh, sự dẻo dai và khéo léo cho học sinh các cấp học.",
      downloadLink: "#",
      icon: "💪",
    },
    {
      title: "Trò chơi vận động tập thể",
      description:
        "Bộ sưu tập các trò chơi vận động tập thể giúp tăng cường tinh thần đồng đội và phát triển thể chất.",
      downloadLink: "#",
      icon: "⚽",
    },
    {
      title: "Hướng dẫn đánh giá sự phát triển thể chất của học sinh",
      description:
        "Tài liệu hướng dẫn cách đánh giá sự phát triển thể chất của học sinh dựa trên các chỉ số và tiêu chuẩn quốc gia.",
      downloadLink: "#",
      icon: "📏",
    },
  ];

  const ageGroupActivities = [
    {
      age: "6-9 tuổi (Tiểu học cấp 1)",
      activities: [
        "Các trò chơi vận động đơn giản",
        "Chạy, nhảy, ném bóng",
        "Tập thể dục nhịp điệu",
        "Bơi lội cơ bản",
        "Đạp xe",
      ],
      icon: "🧒",
    },
    {
      age: "10-12 tuổi (Tiểu học cấp 2)",
      activities: [
        "Các môn thể thao đồng đội cơ bản (bóng đá, bóng rổ)",
        "Nhảy dây",
        "Điền kinh nhẹ",
        "Võ thuật cơ bản",
        "Bơi lội nâng cao",
      ],
      icon: "👦",
    },
    {
      age: "13-15 tuổi (THCS)",
      activities: [
        "Các môn thể thao đồng đội nâng cao",
        "Điền kinh",
        "Thể dục dụng cụ",
        "Võ thuật",
        "Yoga, aerobic",
      ],
      icon: "🧑",
    },
    {
      age: "16-18 tuổi (THPT)",
      activities: [
        "Các môn thể thao chuyên sâu",
        "Tập luyện sức bền, sức mạnh",
        "Các hoạt động thể thao cạnh tranh",
        "Võ thuật nâng cao",
        "Rèn luyện thể lực toàn diện",
      ],
      icon: "👨",
    },
  ];

  const physicalFacts = [
    {
      fact: "Học sinh tham gia ít nhất 60 phút hoạt động thể chất mỗi ngày có thể cải thiện kết quả học tập lên đến 40%",
    },
    {
      fact: "Chỉ 25% học sinh Việt Nam đạt đủ chỉ tiêu vận động thể chất theo khuyến nghị của WHO",
    },
    {
      fact: "Hoạt động thể chất thường xuyên giúp giảm 30% nguy cơ mắc các bệnh tim mạch, tiểu đường và trầm cảm",
    },
    {
      fact: "Học sinh tham gia thể thao đồng đội có khả năng phát triển kỹ năng lãnh đạo và làm việc nhóm tốt hơn 60%",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#health-resources"
            className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 mr-2 transition-colors duration-300">
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
          <div className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Tài liệu thể chất
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M47.9,-73.3C62.8,-67.3,76.5,-56.3,82.8,-42.1C89,-27.9,87.8,-10.6,83.8,4.7C79.9,20,73.2,33.1,64.3,44.6C55.4,56.1,44.3,65.8,31.7,70.8C19.1,75.9,5.1,76.1,-8.3,74.4C-21.7,72.6,-34.4,68.9,-44.2,61.2C-54,53.6,-60.7,42.1,-65.8,29.8C-70.8,17.5,-74.1,4.3,-73.6,-9C-73.2,-22.4,-69,-36,-60.9,-46.9C-52.8,-57.8,-40.9,-66.1,-27.9,-72.3C-14.9,-78.5,-0.8,-82.6,13.2,-80.6C27.2,-78.7,43,-79.3,47.9,-73.3Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Phát triển thể chất học đường
            </h1>
            <p className="text-green-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Hoạt động thể chất phù hợp giúp học sinh không chỉ phát triển cơ
              thể mà còn nâng cao khả năng học tập và kỹ năng xã hội.
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-6 text-center">
                Phát triển thể chất đóng vai trò quan trọng trong sự phát triển
                toàn diện của học sinh. Các hoạt động thể chất phù hợp không chỉ
                giúp học sinh phát triển thể chất khỏe mạnh mà còn hỗ trợ phát
                triển nhận thức, cảm xúc và kỹ năng xã hội.
              </p>
            </div>

            <div className="flex flex-wrap -mx-4 mt-8">
              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
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
                    Lợi ích của hoạt động thể chất
                  </h2>
                  <ul className="list-none pl-11 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Phát triển hệ cơ, xương và các chức năng vận động
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Tăng cường sức khỏe tim mạch và hệ hô hấp
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Cải thiện khả năng tập trung và thành tích học tập
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Giảm stress và cải thiện sức khỏe tinh thần
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Phát triển kỹ năng làm việc nhóm và tương tác xã hội
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Hình thành thói quen luyện tập thể thao suốt đời
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-4 mb-8">
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-500/20 backdrop-blur-sm"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Bạn có biết?
                    </h3>
                    <div className="space-y-3">
                      {physicalFacts.map((item, index) => (
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

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⏱️</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  Khuyến nghị về thời gian hoạt động thể chất
                </h3>
              </div>
              <p className="text-gray-700">
                <strong>Trẻ em và thanh thiếu niên (6-17 tuổi):</strong> Nên
                tham gia ít nhất 60 phút hoạt động thể chất cường độ vừa đến
                mạnh mỗi ngày, bao gồm các hoạt động tăng cường sức mạnh cơ và
                xương ít nhất 3 ngày/tuần.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              Hoạt động thể chất phù hợp theo lứa tuổi
            </h2>
            <div className="flex justify-center">
              <span className="text-4xl">🏃‍♂️</span>
            </div>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-green-100 to-green-200">
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">
                      Độ tuổi
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Hoạt động thể chất phù hợp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ageGroupActivities.map((group, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-green-50 transition-colors"
                          : "bg-gray-50 hover:bg-green-50 transition-colors"
                      }
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-2">{group.icon}</span>
                          {group.age}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {group.activities.map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                          ))}
                        </ul>
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
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">🏫</span>
                <h3 className="text-lg font-semibold">
                  Tích hợp hoạt động thể chất vào lớp học
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Giờ nghỉ năng động (active breaks) 3-5 phút giữa các tiết học
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Học tập kết hợp vận động (kinh nghiệm học tập thông qua chuyển
                  động)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Bài tập thể dục ngắn 10-15 phút vào đầu giờ học
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Trò chơi vận động kết hợp với nội dung học tập
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Sử dụng bàn ghế cho phép đứng hoặc chuyển động
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="text-2xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold">
                  Lưu ý khi tổ chức hoạt động thể chất
                </h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Đảm bảo an toàn cho học sinh trong quá trình tập luyện
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Điều chỉnh cường độ phù hợp với thể trạng của từng học sinh
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Cung cấp đủ nước uống và thời gian nghỉ ngơi
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Tạo môi trường tích cực, không gây áp lực hay cạnh tranh quá
                  mức
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Kết hợp nhiều loại hoạt động thể chất khác nhau
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
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
          Tài liệu phát triển thể chất
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {physicalResources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-medium truncate">
                  {resource.title}
                </h3>
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <a
                  href={resource.downloadLink}
                  className="inline-flex items-center text-green-600 hover:text-green-700 group-hover:translate-x-1 transition-transform duration-300"
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

export default PhysicalDevelopment;
