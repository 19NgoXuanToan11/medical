import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const MedicationAdminister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medication, setMedication] = useState(null);
  const [formData, setFormData] = useState({
    notes: "",
    reaction: "none",
    administeredDose: "",
    administeringStaff: "Nguyễn Thị Tâm",
    position: "Y tá trường",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Sample medication data - in a real application, this would be fetched from an API
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setMedication({
        id: "MED781234",
        studentName: "Nguyễn Văn An",
        studentId: "ST123456",
        class: "3A",
        medicationName: "Paracetamol",
        requestDate: "2023-10-15T09:30:00",
        startDate: "2023-10-16",
        endDate: "2023-10-20",
        status: "active",
        dosage: "1 viên",
        frequency: "twice",
        timeOfDay: ["morning", "afternoon"],
        specialInstructions: "Uống sau bữa ăn 30 phút. Không uống khi đói.",
        medicationImageUrl:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        allergies: "Không",
        healthConditions: "Cảm cúm nhẹ",
        parentName: "Nguyễn Văn Bình",
        parentPhone: "0912345678",
      });
      setFormData((prev) => ({
        ...prev,
        administeredDose: "1 viên",
      }));
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating API submission
    setSubmitStatus("submitting");

    // In a real application, this would be an API call
    setTimeout(() => {
      console.log("Submitting form data:", { medicationId: id, ...formData });
      setSubmitStatus("success");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy yêu cầu thuốc
          </h2>
          <p className="text-gray-600 mb-6">
            Yêu cầu thuốc với mã #{id} không tồn tại hoặc đã bị xóa
          </p>
          <Link
            to="/staff/medication"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (submitStatus === "success") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 border-t-4 border-green-500 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thuốc đã được cấp thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Thông tin về việc cấp thuốc đã được lưu vào hệ thống.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/staff/medication")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={() => {
                setSubmitStatus(null);
                setFormData({
                  ...formData,
                  notes: "",
                  reaction: "none",
                });
              }}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              Cấp thuốc khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/staff/medication"
              className="text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Cấp thuốc cho học sinh
            </h1>
          </div>
          <p className="text-gray-600">
            Mã yêu cầu: #{medication.id} | Ngày:{" "}
            {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md md:col-span-2">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Thông tin thuốc
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tên thuốc
                  </h3>
                  <p className="text-base text-gray-900 font-medium">
                    {medication.medicationName}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Liều lượng
                  </h3>
                  <p className="text-base text-gray-900">{medication.dosage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Hướng dẫn đặc biệt
                  </h3>
                  <p className="text-base text-gray-900">
                    {medication.specialInstructions || "Không có"}
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Hình ảnh thuốc
                  </h3>
                  <img
                    src={medication.medicationImageUrl}
                    alt="Medication"
                    className="w-full h-40 object-cover rounded-md border border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Thông tin học sinh
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Họ và tên
              </h3>
              <p className="text-base text-gray-900 font-medium">
                {medication.studentName}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lớp</h3>
              <p className="text-base text-gray-900">{medication.class}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Dị ứng</h3>
              <p className="text-base text-gray-900">{medication.allergies}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Tình trạng sức khỏe
              </h3>
              <p className="text-base text-gray-900">
                {medication.healthConditions}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">
            Thông tin cấp thuốc
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="administeredDose"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Liều lượng đã cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="administeredDose"
                name="administeredDose"
                value={formData.administeredDose}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="administeringStaff"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Người cấp thuốc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="administeringStaff"
                name="administeringStaff"
                value={formData.administeringStaff}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chức vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="reaction"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phản ứng của học sinh <span className="text-red-500">*</span>
            </label>
            <select
              id="reaction"
              name="reaction"
              value={formData.reaction}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">Không có phản ứng</option>
              <option value="mild">Phản ứng nhẹ</option>
              <option value="moderate">Phản ứng vừa</option>
              <option value="severe">Phản ứng nặng</option>
              <option value="refused">Học sinh từ chối uống thuốc</option>
            </select>
          </div>

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
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ghi chú (nếu có)"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/staff/medication"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md transition-colors ${
                submitStatus === "submitting"
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {submitStatus === "submitting" ? (
                <span className="flex items-center">
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
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận cấp thuốc"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationAdminister;
