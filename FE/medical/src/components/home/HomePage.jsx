import React from "react";
import Hero from "./hero/Hero";
import Features from "./feature/Features";
import SchoolInfo from "./school-info/SchoolInfo";
import HealthResources from "./health-resource/HealthResources";
import Blog from "./blog/Blog";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
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
    </div>
  );
};

export default HomePage;
