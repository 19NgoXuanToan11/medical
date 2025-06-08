import React from "react";
import { Outlet } from "react-router-dom";

const UserManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default UserManagement;
