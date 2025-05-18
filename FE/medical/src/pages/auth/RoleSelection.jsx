import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import medicalVideo from "../../../public/videos/login.mp4";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  // Available roles with descriptions
  const roles = [
    {
      id: "student",
      label: "Student",
      description:
        "Access your health records, view appointments, and communicate with school nurses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      id: "parent",
      label: "Parent",
      description:
        "Monitor your child's health records, receive notifications, and communicate with school staff",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "nurse",
      label: "School Nurse",
      description:
        "Manage student health records, schedule health check-ups, and communicate with parents",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "manager",
      label: "School Manager",
      description:
        "Oversee the health management system, manage staff, and access administrative reports",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "admin",
      label: "Administrator",
      description:
        "Full system access to manage users, configure settings, and maintain the platform",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = (action) => {
    if (!selectedRole) return;
    navigate(`/${action}?role=${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Video Section - Left 40% */}
      <div className="w-2/5 relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={medicalVideo} />
          Your browser does not support the video tag.
        </video>

        {/* Overlay with school info */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-indigo-600/40 flex flex-col items-center justify-center p-10 text-white">
          <h2 className="text-3xl font-bold mb-4">MedSchool Health System</h2>
          <p className="text-lg text-center max-w-lg">
            A comprehensive platform for managing school healthcare, student
            health records, and communication with healthcare professionals.
          </p>
        </div>
      </div>

      {/* Role Selection Section - Right 60% */}
      <div className="w-3/5 flex flex-col items-center justify-center bg-white h-screen overflow-y-auto">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-8 right-8 px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-full shadow-md hover:bg-indigo-50 transition duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Back to Home
        </Link>

        <div className="w-4/5 max-w-4xl mx-auto py-12 px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to MedSchool Health System
            </h1>
            <p className="text-gray-600 text-lg">
              Please select your role to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group ${
                  selectedRole === role.id
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-gray-200"
                }`}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`mb-4 p-3 rounded-full transition-colors duration-300 ${
                      selectedRole === role.id
                        ? "bg-indigo-100"
                        : "bg-indigo-50 group-hover:bg-indigo-100"
                    }`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {role.label}
                  </h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedRole && (
            <div className="mt-10 flex flex-col items-center">
              <p className="text-center text-gray-700 mb-4">
                You selected:{" "}
                <span className="font-semibold">
                  {roles.find((r) => r.id === selectedRole)?.label}
                </span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleContinue("login")}
                  className="py-2 px-8 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleContinue("register")}
                  className="py-2 px-8 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">
              Already know your role?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in directly
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
