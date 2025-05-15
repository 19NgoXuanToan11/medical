import React from "react";
import Navbar from "../layout/navbar/Navbar";
import Hero from "./hero/Hero";
import Features from "./feature/Features";
import SchoolInfo from "./school-info/SchoolInfo";
import HealthResources from "./health-resource/HealthResources";
import Blog from "./blog/Blog";
import Footer from "../layout/footer/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* School Information Section */}
      <SchoolInfo />

      {/* Features Section */}
      <Features />

      {/* Health Resources Section */}
      <HealthResources />

      {/* Blog Section */}
      <Blog />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
