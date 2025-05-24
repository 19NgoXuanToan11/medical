import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HealthCheckForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: "",
    classes: [],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Mock class data - in a real app this would come from an API
  const classList = [
    "Lớp 1A",
    "Lớp 1B",
    "Lớp 1C",
    "Lớp 2A",
    "Lớp 2B",
    "Lớp 2C",
    "Lớp 3A",
    "Lớp 3B",
    "Lớp 3C",
    "Lớp 4A",
    "Lớp 4B",
    "Lớp 4C",
    "Lớp 5A",
    "Lớp 5B",
    "Lớp 5C",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleClassToggle = (className) => {
    const newClasses = formData.classes.includes(className)
      ? formData.classes.filter((c) => c !== className)
      : [...formData.classes, className];

    setFormData({
      ...formData,
      classes: newClasses,
    });

    // Clear class error if at least one class is selected
    if (newClasses.length > 0 && formErrors.classes) {
      setFormErrors({
        ...formErrors,
        classes: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.scheduledDate) {
      errors.scheduledDate = "Vui lòng chọn ngày kiểm tra";
    } else {
      // Check if date is in the future
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.scheduledDate = "Ngày kiểm tra phải là ngày trong tương lai";
      }
    }

    if (formData.classes.length === 0) {
      errors.classes = "Vui lòng chọn ít nhất một lớp";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      // In a real app, this would be an API call to create a new health check
      console.log("Submitting health check:", formData);

      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        navigate("/staff/health-check");
      }, 1000);
    }
  };

  // Filter classes based on search term
  const filteredClasses = classList.filter((className) =>
    className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Lên lịch kiểm tra y tế mới
        </h1>
        <p className="text-gray-600 mt-1">
          Tạo lịch kiểm tra sức khỏe định kỳ cho học sinh
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="scheduledDate"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Ngày kiểm tra
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.scheduledDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.scheduledDate && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.scheduledDate}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="classes"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Chọn lớp (có thể chọn nhiều)
            </label>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Tìm kiếm lớp..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
            </div>
            <div
              className={`border rounded-md p-2 max-h-60 overflow-y-auto ${
                formErrors.classes ? "border-red-500" : "border-gray-300"
              }`}
            >
              {filteredClasses.map((className) => (
                <div
                  key={className}
                  className="flex items-center p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id={`class-${className}`}
                    checked={formData.classes.includes(className)}
                    onChange={() => handleClassToggle(className)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`class-${className}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {className}
                  </label>
                </div>
              ))}
              {filteredClasses.length === 0 && (
                <p className="text-gray-500 text-sm p-2">
                  Không tìm thấy lớp phù hợp
                </p>
              )}
            </div>
            {formData.classes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.classes.map((className) => (
                  <span
                    key={className}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {className}
                    <button
                      type="button"
                      onClick={() => handleClassToggle(className)}
                      className="ml-1 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            {formErrors.classes && (
              <p className="text-red-500 text-xs mt-1">{formErrors.classes}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Ghi chú (tùy chọn)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập ghi chú cho lịch kiểm tra này (nếu có)"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/staff/health-check")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : (
                "Lưu lịch kiểm tra"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthCheckForm;
