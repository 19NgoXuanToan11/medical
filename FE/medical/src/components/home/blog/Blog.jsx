import React from "react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Mẹo Giúp Tăng Cường Hệ Miễn Dịch Cho Học Sinh",
      excerpt:
        "Khám phá 10 cách đơn giản và hiệu quả để tăng cường hệ miễn dịch cho học sinh, giúp các em phòng tránh bệnh tật trong mùa học.",
      author: "BS. Nguyễn Văn A",
      date: "15/09/2023",
      category: "Sức khỏe",
      image: "https://placehold.co/600x400?text=Blog+Post+1",
      readTime: "5 phút đọc",
    },
    {
      id: 2,
      title: "Cách Nhận Biết Dấu Hiệu Trẻ Gặp Vấn Đề Về Sức Khỏe Tâm Thần",
      excerpt:
        "Hướng dẫn cho phụ huynh và giáo viên cách nhận biết các dấu hiệu trẻ đang gặp vấn đề về sức khỏe tâm thần và cách hỗ trợ kịp thời.",
      author: "ThS. Trần Thị B",
      date: "28/08/2023",
      category: "Tâm lý",
      image: "https://placehold.co/600x400?text=Blog+Post+2",
      readTime: "7 phút đọc",
    },
    {
      id: 3,
      title: "Chế Độ Dinh Dưỡng Cân Đối Cho Học Sinh Tiểu Học",
      excerpt:
        "Bí quyết xây dựng thực đơn dinh dưỡng cân đối, phù hợp với nhu cầu phát triển thể chất và trí tuệ của học sinh tiểu học.",
      author: "TS. Lê Văn C",
      date: "05/10/2023",
      category: "Dinh dưỡng",
      image: "https://placehold.co/600x400?text=Blog+Post+3",
      readTime: "6 phút đọc",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Blog Chia Sẻ Kinh Nghiệm
          </h2>
          <div className="w-20 h-1 mx-auto bg-blue-500 rounded"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Nơi chia sẻ kinh nghiệm, kiến thức về sức khỏe học đường từ các
            chuyên gia y tế, giáo dục và phụ huynh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {post.author}
                    </span>
                  </div>

                  <button className="text-blue-600 font-medium hover:text-blue-800 transition duration-300 flex items-center">
                    Đọc thêm
                    <svg
                      className="w-4 h-4 ml-1"
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
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
