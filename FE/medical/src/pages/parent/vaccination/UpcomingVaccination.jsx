import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UpcomingVaccination = () => {
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch upcoming vaccinations
    setTimeout(() => {
      const mockUpcomingVaccinations = [
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          studentId: "HS12345",
          class: "2A",
          vaccineName: "Sởi-Rubella",
          date: "20/07/2025",
          location: "Phòng y tế trường",
          status: "Chờ xác nhận",
          description:
            "Vaccine phòng bệnh Sởi và Rubella cho trẻ em trong độ tuổi tiểu học",
        },
        {
          id: 2,
          studentName: "Nguyễn Minh Cường",
          studentId: "HS12347",
          class: "3C",
          vaccineName: "Viêm não Nhật Bản",
          date: "25/07/2025",
          location: "Phòng y tế trường",
          status: "Chờ xác nhận",
          description: "Vaccine phòng bệnh viêm não Nhật Bản cho trẻ em",
        },
      ];

      setUpcomingVaccinations(mockUpcomingVaccinations);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black">
              Tiêm chủng sắp tới
            </h1>
            <Link
              to="/parent/vaccination/history"
              className="text-black hover:text-white flex items-center"
            >
              <span>Xem lịch sử tiêm chủng</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-6">
          <p className="text-neutral-600 mb-6">
            Danh sách các mũi tiêm chủng đã được lên lịch cho con của bạn tại
            trường. Vui lòng xác nhận đồng ý hoặc từ chối cho con tham gia tiêm
            chủng.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : upcomingVaccinations.length > 0 ? (
            <div className="space-y-6">
              {upcomingVaccinations.map((vaccination) => (
                <div
                  key={vaccination.id}
                  className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-800">
                          {vaccination.vaccineName}
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1">
                          Cho học sinh: {vaccination.studentName} - Lớp{" "}
                          {vaccination.class}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          vaccination.status === "Chờ xác nhận"
                            ? "bg-yellow-100 text-yellow-800"
                            : vaccination.status === "Đã xác nhận"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vaccination.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-neutral-700">
                            Ngày tiêm: {vaccination.date}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-neutral-700">
                            Địa điểm: {vaccination.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {vaccination.description && (
                      <div className="mt-4">
                        <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
                          <span className="font-medium">
                            Thông tin về vaccine:{" "}
                          </span>
                          {vaccination.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      {vaccination.status === "Chờ xác nhận" && (
                        <>
                          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Từ chối
                          </button>
                          <Link
                            to={`/parent/vaccination/consent/${vaccination.id}`}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Xác nhận đồng ý
                          </Link>
                        </>
                      )}
                      {vaccination.status === "Đã xác nhận" && (
                        <span className="text-green-600 font-medium">
                          Bạn đã đồng ý cho con tham gia tiêm chủng
                        </span>
                      )}
                      {vaccination.status === "Đã từ chối" && (
                        <span className="text-red-600 font-medium">
                          Bạn đã từ chối cho con tham gia tiêm chủng
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-neutral-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Không có tiêm chủng sắp tới
              </h2>
              <p className="text-neutral-600">
                Hiện tại không có kế hoạch tiêm chủng nào được lên lịch cho con
                của bạn tại trường.
              </p>
              <div className="mt-6">
                <Link
                  to="/parent/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingVaccination;
