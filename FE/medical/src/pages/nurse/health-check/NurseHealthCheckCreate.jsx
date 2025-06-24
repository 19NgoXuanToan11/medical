import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NurseHealthCheckCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    scheduledDate: "",
    gradeIds: [],
    description: "",
    notifyParents: true,
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call to get grades
    setGrades([
      { id: "1A", name: "Lớp 1A" },
      { id: "1B", name: "Lớp 1B" },
      { id: "2A", name: "Lớp 2A" },
      { id: "2B", name: "Lớp 2B" },
      { id: "3A", name: "Lớp 3A" },
      { id: "3B", name: "Lớp 3B" },
      { id: "3C", name: "Lớp 3C" },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGradeCheckbox = (e) => {
    const { value, checked } = e.target;
    let newGradeIds = [...formData.gradeIds];
    if (checked) {
      if (newGradeIds.length < 3) {
        newGradeIds.push(value);
      }
    } else {
      newGradeIds = newGradeIds.filter((id) => id !== value);
    }
    setFormData({ ...formData, gradeIds: newGradeIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.scheduledDate || formData.gradeIds.length === 0) {
        throw new Error("Vui lòng nhập đầy đủ các trường bắt buộc");
      }

      // Simulate API call
      console.log("Submitting health check schedule:", formData);

      // Wait for a moment to simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to health check list
      navigate("/nurse/health-check");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lên lịch kiểm tra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Lên lịch kiểm tra y tế mới
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Tạo lịch kiểm tra sức khỏe định kỳ mới cho học sinh
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label
                htmlFor="scheduledDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ngày kiểm tra <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div className="col-span-1">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lớp <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {grades.map((grade) => (
                  <label key={grade.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={grade.id}
                      checked={formData.gradeIds.includes(grade.id)}
                      onChange={handleGradeCheckbox}
                      disabled={
                        !formData.gradeIds.includes(grade.id) && formData.gradeIds.length >= 3
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>{grade.name}</span>
                  </label>
                ))}
              </div>
              {formData.gradeIds.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Vui lòng chọn ít nhất 1 lớp (tối đa 3 lớp)</p>
              )}
            </div>

            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mô tả kiểm tra
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nhập thông tin chi tiết về đợt kiểm tra sức khỏe..."
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifyParents"
                    name="notifyParents"
                    type="checkbox"
                    checked={formData.notifyParents}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-blue-500 bg-white dark:bg-neutral-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="notifyParents"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Thông báo cho phụ huynh
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Gửi thông báo đến phụ huynh của học sinh trong lớp được chọn
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/nurse/health-check")}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "Lên lịch kiểm tra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NurseHealthCheckCreate;
