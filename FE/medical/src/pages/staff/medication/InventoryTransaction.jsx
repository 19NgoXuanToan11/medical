import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const InventoryTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    transactionType: "in", // "in" for adding stock, "out" for removing stock
    quantity: "",
    reason: "",
    notes: "",
    eventId: "",
    studentId: "",
    location: "",
    staffName: "Nguyễn Thị Tâm",
    staffPosition: "Y tá trường",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    if (id) {
      // Simulate API call to get item details
      setTimeout(() => {
        setItem({
          id: "MED001",
          name: "Paracetamol 500mg",
          category: "medicine",
          currentQuantity: 120,
          unit: "viên",
          minQuantity: 20,
          expiryDate: "2025-12-31",
          location: "Tủ thuốc A",
          lastUpdated: "2023-11-10",
          supplier: "Công ty Dược phẩm ABC",
        });
        setFormData((prev) => ({
          ...prev,
          location: "Tủ thuốc A",
        }));
        setLoading(false);
      }, 1000);
    } else {
      // If no ID is provided, just show the form without item details
      setLoading(false);
    }
  }, [id]);

  // Mock data for events and students
  const events = [
    { id: "EVT001", name: "Khám sức khỏe định kỳ lớp 1A" },
    { id: "EVT002", name: "Tiêm chủng vắc-xin lớp 3B" },
    { id: "EVT003", name: "Khám nha khoa lớp 5C" },
  ];

  const students = [
    { id: "ST001", name: "Nguyễn Văn An", class: "3A" },
    { id: "ST002", name: "Trần Thị Bình", class: "5B" },
    { id: "ST003", name: "Lê Hoàng Cường", class: "1A" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here would go API call to submit the transaction
    console.log("Submitting transaction:", formData);

    // Simulate successful submission
    setSubmitStatus("success");
    setTimeout(() => {
      navigate("/staff/medication/inventory");
    }, 2000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getReasonOptions = () => {
    if (formData.transactionType === "in") {
      return [
        { value: "purchase", label: "Mua mới" },
        { value: "donation", label: "Được tặng" },
        { value: "return", label: "Trả lại" },
        { value: "transfer", label: "Chuyển từ kho khác" },
      ];
    } else {
      return [
        { value: "used", label: "Sử dụng cho học sinh" },
        { value: "expired", label: "Hết hạn" },
        { value: "damaged", label: "Hỏng/Vỡ" },
        { value: "transfer", label: "Chuyển đến kho khác" },
        { value: "event", label: "Sử dụng cho sự kiện y tế" },
      ];
    }
  };

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
            {id ? `Giao dịch kho: ${item?.name || ""}` : "Giao dịch kho"}
          </h1>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : submitStatus === "success" ? (
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
              Giao dịch thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Thông tin đã được cập nhật vào hệ thống.
            </p>
            <Link
              to="/staff/medication/inventory"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Item information section */}
            {id && item && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Thông tin sản phẩm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Tên sản phẩm
                    </p>
                    <p className="text-base text-gray-900">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Mã sản phẩm
                    </p>
                    <p className="text-base text-gray-900">{item.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Số lượng hiện tại
                    </p>
                    <p className="text-base text-gray-900">
                      {item.currentQuantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Vị trí
                    </p>
                    <p className="text-base text-gray-900">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Hạn sử dụng
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(item.expiryDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Cập nhật lần cuối
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(item.lastUpdated)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giao dịch <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="transactionType"
                    value="in"
                    checked={formData.transactionType === "in"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Nhập kho</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="transactionType"
                    value="out"
                    checked={formData.transactionType === "out"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Xuất kho</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md">
                    {item?.unit || "đơn vị"}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lý do <span className="text-red-500">*</span>
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn lý do --</option>
                  {getReasonOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conditional fields based on reason */}
            {formData.reason === "used" && (
              <div className="mb-6">
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Học sinh <span className="text-red-500">*</span>
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn học sinh --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.reason === "event" && (
              <div className="mb-6">
                <label
                  htmlFor="eventId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sự kiện y tế <span className="text-red-500">*</span>
                </label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn sự kiện --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.transactionType === "in" && (
              <div className="mb-6">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vị trí lưu trữ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập vị trí lưu trữ"
                />
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập ghi chú nếu có"
              ></textarea>
            </div>

            {/* Staff information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label
                  htmlFor="staffName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Người thực hiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="staffName"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="staffPosition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="staffPosition"
                  name="staffPosition"
                  value={formData.staffPosition}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end gap-4">
              <Link
                to="/staff/medication/inventory"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                Hủy
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
              >
                Lưu giao dịch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InventoryTransaction;
