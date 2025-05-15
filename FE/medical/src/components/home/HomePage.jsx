import React from "react";
import Navbar from "../layout/Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "../layout/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
