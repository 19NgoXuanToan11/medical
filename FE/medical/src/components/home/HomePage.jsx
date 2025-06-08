import React from "react";
import Hero from "./hero/Hero";
import RoleDemo from "./role-demo/RoleDemo";
import Features from "./feature/Features";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
      <Hero />

      {/* Role demonstration section */}
      <RoleDemo />

      <Features />
    </div>
  );
};

export default HomePage;
