import React from "react";
import { useAuth } from "../../utils/auth/AuthContext";

const SimpleGreeting = ({ roleTitle }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Xin chào buổi sáng";
    if (hour < 18) return "Xin chào buổi chiều";
    return "Xin chào buổi tối";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username;
    } else {
      return roleTitle || "Người dùng";
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-6 transition-colors duration-300">
      <h1 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
        {getGreeting()}, {getDisplayName()}!
      </h1>
    </div>
  );
};

export default SimpleGreeting;
