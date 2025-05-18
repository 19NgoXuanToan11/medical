import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import medicalVideo from "../../../../public/videos/register.mp4";

const Register = () => {
  const location = useLocation();

  // Get role from URL parameter if available
  const getInitialRole = () => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    return roleParam || "student"; // Default to student if not specified
  };

  // Add current step to state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: getInitialRole(),
    // Role-specific fields
    studentId: "",
    grade: "",
    schoolName: "",
    specialization: "",
    department: "",
    parentOfStudentId: "",
  });

  // Add validation state
  const [errors, setErrors] = useState({});

  // Update role if URL parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate the current step
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        // Validate basic information
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.username.trim())
          newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Email is invalid";
        break;

      case 2:
        // Validate role-specific information
        switch (formData.role) {
          case "student":
            if (!formData.studentId.trim())
              newErrors.studentId = "Student ID is required";
            if (!formData.grade.trim())
              newErrors.grade = "Grade/Year is required";
            break;
          case "parent":
            if (!formData.parentOfStudentId.trim())
              newErrors.parentOfStudentId = "Child's Student ID is required";
            break;
          case "nurse":
            if (!formData.specialization.trim())
              newErrors.specialization = "Specialization is required";
            break;
          case "admin":
          case "manager":
            if (!formData.department.trim())
              newErrors.department = "Department is required";
            break;
        }
        break;

      case 3:
        // Validate password information
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";

        if (!formData.confirmPassword)
          newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords don't match";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Functions to navigate between steps
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On final step, submit the form if valid
    if (currentStep === totalSteps) {
      if (validateCurrentStep()) {
        // Here you would typically handle registration logic
        console.log("Registration attempt with:", formData);
      }
    } else {
      // Otherwise, move to next step if valid
      nextStep();
    }
  };

  // Available roles in the system
  const roles = [
    { id: "student", label: "Student" },
    { id: "parent", label: "Parent" },
    { id: "admin", label: "Administrator" },
    { id: "manager", label: "School Manager" },
    { id: "nurse", label: "School Nurse" },
  ];

  // Helper to display error messages
  const ErrorMessage = ({ name }) =>
    errors[name] ? (
      <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
    ) : null;

  // Role-specific additional fields
  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "student":
        return (
          <>
            <div className="space-y-2">
              <label
                htmlFor="studentId"
                className="text-sm font-medium text-gray-700"
              >
                Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.studentId ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
                  placeholder="e.g., STD12345"
                />
              </div>
              <ErrorMessage name="studentId" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="grade"
                className="text-sm font-medium text-gray-700"
              >
                Grade/Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.grade ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
                  placeholder="e.g., 10th Grade"
                />
              </div>
              <ErrorMessage name="grade" />
            </div>
          </>
        );

      case "parent":
        return (
          <div className="space-y-2">
            <label
              htmlFor="parentOfStudentId"
              className="text-sm font-medium text-gray-700"
            >
              Your Child's Student ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="parentOfStudentId"
                name="parentOfStudentId"
                value={formData.parentOfStudentId}
                onChange={handleChange}
                required
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.parentOfStudentId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
                placeholder="e.g., STD12345"
              />
            </div>
            <ErrorMessage name="parentOfStudentId" />
            <p className="text-xs text-gray-500 mt-1">
              This will be verified by the school administrator
            </p>
          </div>
        );

      case "nurse":
        return (
          <div className="space-y-2">
            <label
              htmlFor="specialization"
              className="text-sm font-medium text-gray-700"
            >
              Medical Specialization
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.specialization ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
                placeholder="e.g., Pediatric Nurse"
              />
            </div>
            <ErrorMessage name="specialization" />
          </div>
        );

      case "admin":
      case "manager":
        return (
          <div className="space-y-2">
            <label
              htmlFor="department"
              className="text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.department ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
                placeholder="e.g., Administration"
              />
            </div>
            <ErrorMessage name="department" />
          </div>
        );

      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <>
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium text-gray-700">
          I am registering as a
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 appearance-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.role === "admin" ||
          formData.role === "manager" ||
          formData.role === "nurse"
            ? "Your account will need to be approved by an administrator"
            : ""}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
            placeholder="John Doe"
          />
        </div>
        <ErrorMessage name="name" />
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
            placeholder="johndoe123"
          />
        </div>
        <ErrorMessage name="username" />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
            placeholder="your@email.com"
          />
        </div>
        <ErrorMessage name="email" />
      </div>
    </>
  );

  // Step 2: Role-specific information
  const renderStep2 = () => (
    <div className="space-y-6">{renderRoleSpecificFields()}</div>
  );

  // Step 3: Password and confirmation
  const renderStep3 = () => (
    <>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
            placeholder="••••••••"
          />
        </div>
        <ErrorMessage name="password" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`block w-full pl-10 pr-3 py-3 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50`}
            placeholder="••••••••"
          />
        </div>
        <ErrorMessage name="confirmPassword" />
      </div>
    </>
  );

  // Render the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Video Section - Left 50% */}
      <div className="w-1/2 relative overflow-hidden">
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
      </div>

      {/* Form Section - Right 50% */}
      <div className="w-1/2 flex items-center justify-center bg-white h-screen overflow-y-auto">
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

        <div className="w-4/5 max-w-md mx-auto py-12 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us to get started with our services
            </p>
          </div>

          {/* Step Progress Bar */}
          <div className="mb-10 flex justify-center">
            <div className="w-[300px] flex justify-between items-center relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10">
                {currentStep > 1 ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    1
                  </div>
                )}
                <span className="text-xs mt-1 text-indigo-600 font-medium">
                  Basic Info
                </span>
              </div>

              {/* Line between 1 and 2 */}
              <div className="absolute h-[3px] w-[110px] bg-gray-200 left-[35px] top-4 z-0">
                {currentStep > 1 && (
                  <div className="h-full bg-indigo-600 w-full"></div>
                )}
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                {currentStep > 2 ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : currentStep === 2 ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    2
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400">
                    2
                  </div>
                )}
                <span
                  className={`text-xs mt-1 font-medium ${
                    currentStep >= 2 ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  Role Details
                </span>
              </div>

              {/* Line between 2 and 3 */}
              <div className="absolute h-[3px] w-[110px] bg-gray-200 right-[35px] top-4 z-0">
                {currentStep > 2 && (
                  <div className="h-full bg-indigo-600 w-full"></div>
                )}
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                {currentStep === 3 ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    3
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400">
                    3
                  </div>
                )}
                <span
                  className={`text-xs mt-1 font-medium ${
                    currentStep >= 3 ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  Security
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Step Content */}
            <div className="min-h-[340px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <div>
              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  {currentStep === totalSteps ? "Create Account" : "Next"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
