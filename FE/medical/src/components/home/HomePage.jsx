import React from "react";
import Hero from "./hero/Hero";
import RoleDemo from "./role-demo/RoleDemo";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full">
      <Hero />
      <RoleDemo />
    </div>
  );
};

export default HomePage;
