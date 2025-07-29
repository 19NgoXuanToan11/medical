import React, { useState } from "react";
import { healthEventFollowUpService } from "../../utils/api/health-events/healthEventFollowUpService";
import { useAuth } from "../../utils/auth/AuthContext";

const FollowUpForm = ({ eventId, onFollowUpAdded, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    status: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    "Đã khỏe lại",
    "Được đưa về nhà",
    "Cần theo dõi thêm",
    "Tình trạng xấu",
    "Đã chuyển viện",
    "Khác",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status.trim()) {
      setError("Vui lòng chọn tình trạng");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const followUpData = {
        eventId: eventId,
        status: formData.status,
        note: formData.note.trim() || null,
      };

      await healthEventFollowUpService.createFollowUp(followUpData);

      // Reset form
      setFormData({
        status: "",
        note: "",
      });

      // Notify parent component
      if (onFollowUpAdded) {
        onFollowUpAdded();
      }
    } catch (err) {
      console.error("Error creating follow-up:", err);
      setError("Không thể tạo follow-up. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thêm Cập Nhật Tình Trạng
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tình Trạng <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Chọn tình trạng</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ghi Chú
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập ghi chú chi tiết về tình trạng học sinh..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !formData.status.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </div>
            ) : (
              "Tạo Cập Nhật"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FollowUpForm;
