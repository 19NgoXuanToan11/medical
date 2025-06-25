import React from "react";
import { useTheme } from "../../utils/theme/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center 
        rounded-lg bg-white dark:bg-neutral-800 
        border-2 border-neutral-200 dark:border-neutral-600
        text-neutral-700 dark:text-neutral-200
        hover:bg-neutral-50 dark:hover:bg-neutral-700
        hover:border-neutral-300 dark:hover:border-neutral-500
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        dark:focus:ring-offset-neutral-800 dark:focus:ring-primary-400
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        ${className}
      `}
      title={
        theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"
      }
      aria-label={
        theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"
      }
    >
      {theme === "light" ? (
        // Moon icon for dark mode with enhanced contrast
        <svg
          className="h-5 w-5 text-neutral-600 dark:text-neutral-300 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for light mode with enhanced contrast
        <svg
          className="h-5 w-5 text-neutral-600 dark:text-neutral-300 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}

      {/* Visual indicator for current theme */}
      <span className="sr-only">
        Chế độ hiện tại: {theme === "light" ? "sáng" : "tối"}
      </span>
    </button>
  );
};

export default ThemeToggle;
