import React from "react";
import {
  FiHeart,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiBarChart,
} from "react-icons/fi";

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: "Tổng lượt khám",
      value: stats.totalHealthChecks,
      icon: FiHeart,
      color: "red",
    },
    {
      title: "Hoàn thành hôm nay",
      value: stats.completedToday,
      icon: FiCheckCircle,
      color: "green",
    },
    {
      title: "Sắp tới",
      value: stats.scheduled,
      icon: FiCalendar,
      color: "orange",
    },
    {
      title: "Chờ duyệt",
      value: stats.pending,
      icon: FiClock,
      color: "yellow",
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: `${stats.completionRate}%`,
      icon: FiBarChart,
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      red: {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/30",
      },
      green: {
        text: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-900/30",
      },
      orange: {
        text: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/30",
      },
      yellow: {
        text: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
      },
      purple: {
        text: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/30",
      },
    };
    return colorMap[color] || colorMap.red;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const IconComponent = stat.icon;

        return (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${colors.bg} rounded-full`}>
                <IconComponent className={`h-5 w-5 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
