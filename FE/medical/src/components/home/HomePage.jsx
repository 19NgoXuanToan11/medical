import React from "react";
import Navbar from "../layout/Navbar";
import Hero from "./Hero";
import Features from "./Features";
import SchoolInfo from "./SchoolInfo";
import HealthResources from "./HealthResources";
import Blog from "./Blog";
import Footer from "../layout/Footer";

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
