import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
