import React, { useState, useEffect } from "react";
import schoolImage from "../../../../public/images/school.jpg";
import schoolImage2 from "../../../../public/images/school2.jpg";
import schoolImage3 from "../../../../public/images/school3.jpg";

const SchoolInfo = () => {
  // Sample data for multiple schools
  const schools = [
    {
      id: 1,
      name: "Trường Tiểu Học XYZ",
      image: schoolImage,
      description:
        "Trường Tiểu Học XYZ được thành lập từ năm 2005 với sứ mệnh cung cấp môi trường giáo dục toàn diện, chất lượng cao cho học sinh. Chúng tôi tự hào về đội ngũ giáo viên giàu kinh nghiệm và cơ sở vật chất hiện đại.",
      features: [
        "Giáo viên chất lượng",
        "Cơ sở vật chất hiện đại",
        "Chương trình toàn diện",
        "Y tế học đường",
      ],
    },
    {
      id: 2,
      name: "Trường THCS Hoa Hồng",
      image: schoolImage2,
      description:
        "Trường THCS Hoa Hồng là ngôi trường với truyền thống lâu đời từ năm 1998. Với phương châm 'Học để phát triển toàn diện', chúng tôi cung cấp môi trường học tập sáng tạo, năng động và phù hợp với sự phát triển của từng học sinh.",
      features: [
        "Phương pháp giảng dạy hiện đại",
        "Hoạt động ngoại khóa phong phú",
        "Hỗ trợ tâm lý học đường",
        "Câu lạc bộ đa dạng",
      ],
    },
    {
      id: 3,
      name: "Trường THPT Tương Lai",
      image: schoolImage3,
      description:
        "Trường THPT Tương Lai tự hào là một trong những ngôi trường có tỷ lệ học sinh đỗ đại học cao trong khu vực. Được thành lập vào năm 2010, chúng tôi không ngừng đổi mới phương pháp giảng dạy và nâng cao chất lượng đào tạo.",
      features: [
        "Chú trọng luyện thi đại học",
        "Đội ngũ giáo viên giỏi chuyên môn",
        "Cơ sở vật chất đạt chuẩn quốc gia",
        "Học bổng cho học sinh xuất sắc",
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % schools.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [schools.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % schools.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + schools.length) % schools.length
    );
  };

  const currentSchool = schools[currentIndex];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Thông Tin Trường Học
          </h2>
          <div className="w-20 h-1 mx-auto bg-blue-500 rounded"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 md:left-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition duration-300"
            aria-label="Previous school"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 md:right-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition duration-300"
            aria-label="Next school"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <div className="md:w-1/2 relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={currentSchool.image}
              alt={currentSchool.name}
              className="w-full h-auto object-cover transform hover:scale-105 transition duration-500"
              style={{ minHeight: "300px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Trường+Học";
              }}
            />
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {currentSchool.name}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {currentSchool.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentSchool.features.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                Xem chi tiết
              </button>

              <div className="flex space-x-2">
                {schools.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolInfo;
