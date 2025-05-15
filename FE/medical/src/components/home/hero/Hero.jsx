import React from "react";
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
      <div className="absolute inset-0"></div>

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
      </div>
    </section>
  );
};

export default Hero;
