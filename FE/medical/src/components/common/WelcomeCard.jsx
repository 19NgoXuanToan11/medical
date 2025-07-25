import React from "react";
import { useAuth } from "../../utils/auth/AuthContext";
import { formatDate } from "../../utils/timeUtils";

const WelcomeCard = ({
  title,
  subtitle,
  roleDescription,
  gradientFrom,
  gradientTo,
  actions = [],
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} p-6 text-white shadow-lg`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <div className="mb-4">
          <p className="text-sm font-medium text-white/80">
            {getGreeting()}, {user?.firstName || "Người dùng"}!
          </p>
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          <p className="text-white/90 text-sm">{subtitle}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-semibold text-white">
                {user?.firstName?.charAt(0) || "U"}
                {user?.lastName?.charAt(0) || "S"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">
                {user?.firstName || ""} {user?.lastName || ""}
              </p>
              <p className="text-sm text-white/80">{roleDescription}</p>
            </div>
          </div>

          <p className="text-sm text-white/70">{getCurrentDate()}</p>
        </div>

        {/* Action buttons */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
              >
                {action.icon && action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeCard;
