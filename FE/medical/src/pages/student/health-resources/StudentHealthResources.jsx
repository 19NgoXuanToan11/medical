import React from "react";
import { Link } from "react-router-dom";
import { FiDownload, FiBookOpen, FiExternalLink } from "react-icons/fi";

const StudentHealthResources = () => {
  const resources = [
    {
      title: "Dinh dưỡng học đường",
      description:
        "Hướng dẫn về chế độ dinh dưỡng cân đối cho học sinh các cấp.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/nutrition",
      category: "nutrition",
    },
    {
      title: "Phòng chống dịch bệnh",
      description:
        "Các biện pháp phòng chống dịch bệnh và ứng phó khi có dịch trong trường học.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/disease-prevention",
      category: "health",
    },
    {
      title: "Sức khỏe tâm thần",
      description:
        "Tài liệu và hướng dẫn về cách nhận biết, hỗ trợ sức khỏe tâm thần cho học sinh.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/mental-health",
      category: "mental-health",
    },
    {
      title: "Sơ cứu học đường",
      description: "Hướng dẫn các kỹ thuật sơ cứu cơ bản dành cho học sinh.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/first-aid",
      category: "first-aid",
    },
    {
      title: "Phát triển thể chất",
      description:
        "Tài liệu về các hoạt động thể chất phù hợp với lứa tuổi và sự phát triển.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/physical-development",
      category: "physical",
    },
    {
      title: "Quy trình y tế trường học",
      description: "Các quy trình và hướng dẫn y tế cần biết cho học sinh.",
      icon: <FiBookOpen className="w-5 h-5 text-primary-600" />,
      link: "/student/resources/medical-procedures",
      category: "procedures",
    },
  ];

  const popularDownloads = [
    {
      title: "Hướng dẫn chăm sóc mắt khi học online",
      format: "PDF",
      size: "1.2 MB",
      downloadLink: "#",
    },
    {
      title: "10 bài tập thể dục tại lớp",
      format: "PDF",
      size: "0.8 MB",
      downloadLink: "#",
    },
    {
      title: "Hướng dẫn phòng tránh cúm mùa",
      format: "PDF",
      size: "1.5 MB",
      downloadLink: "#",
    },
  ];

  const externalResources = [
    {
      title: "Bộ Y tế - Sức khỏe học đường",
      description: "Thông tin chính thức từ Bộ Y tế về sức khỏe học đường",
      link: "https://moh.gov.vn",
    },
    {
      title: "Cổng thông tin dinh dưỡng học đường",
      description: "Kiến thức dinh dưỡng và thực đơn cho học sinh",
      link: "https://dinhduonghocduong.vn",
    },
    {
      title: "Trang sức khỏe trẻ em",
      description:
        "Thông tin và lời khuyên về sức khỏe dành cho lứa tuổi học sinh",
      link: "https://suckhoetreem.vn",
    },
  ];

  // Filter functions for resource categories
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "all" || resource.category === activeCategory;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Tài liệu sức khỏe
        </h1>
        <p className="text-neutral-600">
          Thư viện tài liệu, hướng dẫn về sức khỏe dành cho học sinh
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-neutral-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-neutral-400">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === "all"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveCategory("nutrition")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === "nutrition"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Dinh dưỡng
            </button>
            <button
              onClick={() => setActiveCategory("mental-health")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === "mental-health"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Sức khỏe tâm thần
            </button>
            <button
              onClick={() => setActiveCategory("physical")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === "physical"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Thể chất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two column layout on larger screens */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Resource Cards */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-medium text-neutral-800">
                Tài liệu sức khỏe
              </h2>
            </div>
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredResources.map((resource, index) => (
                  <Link
                    key={index}
                    to={resource.link}
                    className="group block bg-neutral-50 rounded-lg border border-neutral-100 hover:border-primary-100 hover:shadow-sm transition-all duration-300 overflow-hidden p-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-primary-50 rounded-md mr-3 group-hover:bg-primary-100 transition-colors duration-300">
                        {resource.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-neutral-500 text-sm">
                          {resource.description}
                        </p>
                        <div className="mt-2 text-primary-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                          Xem chi tiết
                          <svg
                            className="w-3.5 h-3.5 ml-1"
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
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500">
                Không tìm thấy tài liệu phù hợp. Vui lòng thử tìm kiếm khác.
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Downloads and External Resources */}
        <div className="lg:w-1/3">
          {/* Popular Downloads */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-medium text-neutral-800">
                Tài liệu tải xuống
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {popularDownloads.map((download, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="p-2 bg-neutral-100 rounded-full">
                      <FiDownload className="h-4 w-4 text-neutral-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium text-neutral-800">
                          {download.title}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 flex justify-between items-center">
                        <span>
                          {download.format} · {download.size}
                        </span>
                        <a
                          href={download.downloadLink}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Tải xuống
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* External Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-medium text-neutral-800">
                Nguồn tham khảo bên ngoài
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {externalResources.map((resource, index) => (
                  <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiExternalLink className="h-4 w-4 text-primary-600 mr-2" />
                      <div className="text-sm font-medium text-neutral-800">
                        {resource.title}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">
                      {resource.description}
                    </p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center"
                    >
                      Truy cập trang web
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthResources;
