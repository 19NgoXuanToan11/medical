import React from "react";
import { Link } from "react-router-dom";
import medicalBg from "../../../../public/videos/hero.mp4";

const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src={medicalBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
          Nền Tảng Y Tế Học Đường Thông Minh
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl font-light leading-relaxed text-blue-50/90">
          Quản lý hồ sơ sức khỏe học sinh toàn diện, kết nối phụ huynh, nhà
          trường và cơ sở y tế để nâng cao chất lượng chăm sóc sức khỏe học
          đường
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            to="/login"
            className="px-8 py-3 bg-transparent text-white font-medium border border-white rounded-lg hover:bg-white/10 transition duration-300 flex items-center justify-center"
          >
            <span>Đăng Nhập</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
