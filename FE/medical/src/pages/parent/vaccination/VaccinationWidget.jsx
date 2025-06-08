import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VaccinationWidget = () => {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch vaccination statistics
    setTimeout(() => {
      // This would be replaced with a real API call in a production environment
      setUpcomingCount(2);
      setPendingCount(2);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-sm transition-shadow duration-200">
      <div className="border-b border-neutral-100 px-4 py-3 flex justify-between items-center">
        <h2 className="font-medium text-neutral-800">Tiêm chủng</h2>
        <Link
          to="/parent/vaccination"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="p-5 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-primary-50 rounded-lg">
              <span className="text-2xl font-bold text-primary-700">
                {upcomingCount}
              </span>
              <span className="text-sm text-neutral-600">Sắp tới</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <span className="text-2xl font-bold text-yellow-700">
                {pendingCount}
              </span>
              <span className="text-sm text-neutral-600">Chờ xác nhận</span>
            </div>
          </div>

          <div className="mt-5">
            {upcomingCount > 0 ? (
              <Link
                to="/parent/vaccination/upcoming"
                className="w-full block text-center px-4 py-2 border border-primary-600 rounded-md text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-200"
              >
                Xem tiêm chủng sắp tới
              </Link>
            ) : (
              <p className="text-center text-neutral-600 text-sm">
                Không có lịch tiêm chủng sắp tới
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationWidget;
