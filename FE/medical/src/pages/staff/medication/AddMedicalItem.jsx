import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddMedicalItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "medicine",
    currentQuantity: "",
    unit: "viên",
    minQuantity: "",
    expiryDate: "",
    location: "",
    supplier: "",
    description: "",
    imageUrl: "",
    batchNumber: "",
    purchasePrice: "",
    dateReceived: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    if (!formData.currentQuantity || formData.currentQuantity <= 0) {
      newErrors.currentQuantity = "Số lượng phải lớn hơn 0";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Đơn vị tính không được để trống";
    }

    if (!formData.minQuantity || formData.minQuantity < 0) {
      newErrors.minQuantity = "Số lượng tối thiểu phải lớn hơn hoặc bằng 0";
    }

    if (formData.category !== "equipment" && !formData.expiryDate) {
      newErrors.expiryDate =
        "Hạn sử dụng không được để trống với thuốc và vật tư tiêu hao";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Vị trí không được để trống";
    }

    if (formData.purchasePrice && isNaN(parseFloat(formData.purchasePrice))) {
      newErrors.purchasePrice = "Giá mua phải là số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    try {
      // In a real application, this would be an API call
      // await axios.post("/api/inventory", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus("success");
      setTimeout(() => {
        navigate("/staff/medication/inventory");
      }, 2000);
    } catch (error) {
      console.error("Error adding item:", error);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "medicine", label: "Thuốc" },
    { value: "supply", label: "Vật tư tiêu hao" },
    { value: "equipment", label: "Thiết bị y tế" },
  ];

  const unitOptions = {
    medicine: ["viên", "chai", "ống", "vỉ", "hộp", "gói"],
    supply: ["cái", "hộp", "gói", "túi", "bộ"],
    equipment: ["cái", "bộ", "máy"],
  };

  const locationOptions = [
    "Tủ thuốc A",
    "Tủ thuốc B",
    "Tủ Y tế 1",
    "Tủ Y tế 2",
    "Phòng y tế chính",
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link
          to="/staff/medication/inventory"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h1 className="text-xl font-bold text-blue-800">
            Thêm mới vật tư y tế
          </h1>
        </div>

        {submitStatus === "success" ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Thêm mới thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Sản phẩm mới đã được thêm vào hệ thống.
            </p>
            <Link
              to="/staff/medication/inventory"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : submitStatus === "error" ? (
          <div className="p-6 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Đã có lỗi xảy ra
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Không thể thêm sản phẩm mới. Vui lòng thử lại sau.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-800 hover:text-red-600"
                    onClick={() => setSubmitStatus(null)}
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 rounded-md border-l-4 border-red-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Vui lòng sửa các lỗi sau
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Thông tin cơ bản
                </h2>
              </div>

              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quantity & Unit */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-4">
                  Số lượng & Đơn vị
                </h2>
              </div>

              {/* Current Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng ban đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="currentQuantity"
                  value={formData.currentQuantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border ${
                    errors.currentQuantity
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.currentQuantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currentQuantity}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.unit ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  {unitOptions[formData.category].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                )}
              </div>

              {/* Min Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tối thiểu <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minQuantity"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border ${
                    errors.minQuantity ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cảnh báo khi số lượng nhỏ hơn hoặc bằng giá trị này
                </p>
                {errors.minQuantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minQuantity}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">-- Chọn vị trí --</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-4">
                  Thông tin bổ sung
                </h2>
              </div>

              {/* Expiry Date - Only for medicine and supplies */}
              {formData.category !== "equipment" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn sử dụng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              )}

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhà cung cấp
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lô
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá mua (VNĐ)
                </label>
                <input
                  type="text"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.purchasePrice ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purchasePrice}
                  </p>
                )}
              </div>

              {/* Date Received */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày nhập
                </label>
                <input
                  type="date"
                  name="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường dẫn hình ảnh
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nhập URL hình ảnh sản phẩm (không bắt buộc)
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                to="/staff/medication/inventory"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-4"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                {loading && (
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
                )}
                Thêm mới
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMedicalItem;
