import React, { useEffect } from "react";
import { useTheme } from "../../utils/theme/ThemeContext";
import Hero from "./hero/Hero";
import RoleDemo from "./role-demo/RoleDemo";
import Features from "./feature/Features";

const HomePage = () => {
  const { setLightTheme } = useTheme();

  useEffect(() => {
    // Ensure homepage always uses light theme for optimal display
    setLightTheme();
  }, [setLightTheme]);

  return (
    <div className="min-h-screen w-full bg-white">
      <Hero />

      {/* Role demonstration section */}
      <RoleDemo />

      <Features />
    </div>
  );
};

export default HomePage;
