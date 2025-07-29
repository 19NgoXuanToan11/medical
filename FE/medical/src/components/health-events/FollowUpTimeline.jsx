import React, { useState, useEffect } from "react";
import { healthEventFollowUpService } from "../../utils/api/health-events/healthEventFollowUpService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const FollowUpTimeline = ({ eventId, onFollowUpAdded }) => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (eventId) {
      loadFollowUps();
    }
  }, [eventId]);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      const data = await healthEventFollowUpService.getFollowUpsByEventId(
        eventId
      );
      setFollowUps(data);
      setError(null);
    } catch (err) {
      console.error("Error loading follow-ups:", err);
      setError("Không thể tải dữ liệu follow-up");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    try {
      return format(new Date(dateTime), "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateTime;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "đã khỏe lại":
      case "được đưa về nhà":
        return "bg-green-100 text-green-800 border-green-200";
      case "cần theo dõi thêm":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "tình trạng xấu":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (followUps.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Chưa có cập nhật follow-up nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {followUps.map((followUp, index) => (
            <li key={followUp.followUpId}>
              <div className="relative pb-8">
                {index !== followUps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            followUp.status
                          )}`}
                        >
                          {followUp.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          bởi {followUp.staffName}
                        </span>
                      </div>
                      {followUp.note && (
                        <p className="text-sm text-gray-700 mt-1">
                          {followUp.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {formatDateTime(followUp.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowUpTimeline;
