import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VaccinationPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // In a real application, this would be fetched from an API
    const mockChildren = [
      {
        id: 1,
        name: "Nguyễn Văn An",
        studentId: "HS12345",
        class: "2A",
        dateOfBirth: "15/05/2017",
        upcomingVaccinations: [
          {
            id: 1,
            name: "Sởi-Rubella",
            date: "20/07/2025",
            location: "Phòng y tế trường",
            status: "Chờ xác nhận",
            description:
              "Vaccine phòng bệnh Sởi và Rubella cho trẻ em trong độ tuổi tiểu học",
          },
        ],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "15/06/2017",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "DPT (Bạch hầu, Ho gà, Uốn ván)",
            date: "20/08/2017",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Viêm gan B",
            date: "10/10/2017",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 4,
            name: "Thủy đậu",
            date: "15/05/2022",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
      {
        id: 2,
        name: "Nguyễn Thị Bình",
        studentId: "HS12346",
        class: "5B",
        dateOfBirth: "10/03/2015",
        upcomingVaccinations: [],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "20/04/2015",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "Viêm gan B",
            date: "15/06/2015",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Sởi-Rubella",
            date: "10/08/2021",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
      {
        id: 3,
        name: "Nguyễn Minh Cường",
        studentId: "HS12347",
        class: "3C",
        dateOfBirth: "12/09/2016",
        upcomingVaccinations: [
          {
            id: 1,
            name: "Viêm não Nhật Bản",
            date: "25/07/2025",
            location: "Phòng y tế trường",
            status: "Chờ xác nhận",
            description: "Vaccine phòng bệnh viêm não Nhật Bản cho trẻ em",
          },
        ],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "20/10/2016",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "DPT (Bạch hầu, Ho gà, Uốn ván)",
            date: "15/12/2016",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Sởi",
            date: "10/05/2020",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
    ];

    setChildren(mockChildren);
    setSelectedChild(mockChildren[0]);
  }, []);

  const handleChildSelect = (childId) => {
    const child = children.find((c) => c.id === childId);
    setSelectedChild(child);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-bold text-blue-800 mb-6">Tiêm chủng</h1>

      {/* Child selector */}
      {children.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn con của bạn:
          </label>
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedChild?.id === child.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {child.name} - {child.class}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChild && (
        <>
          {/* Student info card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin học sinh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên học sinh</p>
                <p className="font-medium">{selectedChild.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mã học sinh</p>
                <p className="font-medium">{selectedChild.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lớp</p>
                <p className="font-medium">{selectedChild.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-medium">{selectedChild.dateOfBirth}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "upcoming"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Tiêm chủng sắp tới
                {selectedChild.upcomingVaccinations.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {selectedChild.upcomingVaccinations.length}
                  </span>
                )}
              </button>
              <button
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("history")}
              >
                Lịch sử tiêm chủng
              </button>
            </nav>
          </div>

          {/* Upcoming vaccinations tab */}
          {activeTab === "upcoming" && (
            <div>
              {selectedChild.upcomingVaccinations.length > 0 ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                      Tiêm chủng sắp tới
                    </h2>
                    <p className="text-gray-600">
                      Các mũi tiêm đang chờ duyệt cho con bạn tại trường
                    </p>
                  </div>
                  <div className="space-y-4">
                    {selectedChild.upcomingVaccinations.map((vaccination) => (
                      <div
                        key={vaccination.id}
                        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {vaccination.name}
                            </h3>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-500 mr-2"
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
                                <span>Ngày tiêm: {vaccination.date}</span>
                              </div>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-500 mr-2"
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
                                <span>Địa điểm: {vaccination.location}</span>
                              </div>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-500 mr-2"
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
                                <span>Trạng thái: {vaccination.status}</span>
                              </div>
                            </div>
                            {vaccination.description && (
                              <p className="mt-3 text-gray-600">
                                {vaccination.description}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <div
                              className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
                                vaccination.status === "Chờ xác nhận"
                                  ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-700/50 shadow-amber-200/50 dark:shadow-amber-900/30"
                                  : vaccination.status === "Đã xác nhận"
                                  ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                                  : vaccination.status === "Đã hoàn thành"
                                  ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-blue-200/50 dark:shadow-blue-900/30"
                                  : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                  vaccination.status === "Chờ xác nhận"
                                    ? "bg-amber-200 dark:bg-amber-800/60"
                                    : vaccination.status === "Đã xác nhận"
                                    ? "bg-emerald-200 dark:bg-emerald-800/60"
                                    : vaccination.status === "Đã hoàn thành"
                                    ? "bg-blue-200 dark:bg-blue-800/60"
                                    : "bg-emerald-200 dark:bg-emerald-800/60"
                                }`}
                              >
                                <svg
                                  className={`w-3 h-3 ${
                                    vaccination.status === "Chờ xác nhận"
                                      ? "text-amber-700 dark:text-amber-300"
                                      : vaccination.status === "Đã xác nhận"
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : vaccination.status === "Đã hoàn thành"
                                      ? "text-blue-700 dark:text-blue-300"
                                      : "text-emerald-700 dark:text-emerald-300"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  {vaccination.status === "Chờ xác nhận" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  ) : vaccination.status === "Đã hoàn thành" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  )}
                                </svg>
                              </div>
                              <span className="font-bold tracking-wide">
                                {vaccination.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link
                            to={`/parent/vaccination/consent/${vaccination.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Xác nhận đồng ý
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
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
                  <p className="text-gray-600">
                    Hiện tại không có kế hoạch tiêm chủng nào được lên lịch cho
                    con bạn tại trường.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vaccination history tab */}
          {activeTab === "history" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Lịch sử tiêm chủng</h2>
                <p className="text-gray-600">
                  Các mũi tiêm chủng con bạn đã thực hiện
                </p>
              </div>

              {selectedChild.vaccinationHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Loại vaccine
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày tiêm
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Địa điểm
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedChild.vaccinationHistory.map((vaccination) => (
                        <tr key={vaccination.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {vaccination.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {vaccination.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {vaccination.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-3 py-2 rounded-2xl text-xs font-bold shadow-md transition-all duration-300 hover:scale-105 ${
                                vaccination.status === "Đã tiêm" ||
                                vaccination.status === "Đã hoàn thành"
                                  ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                                  : vaccination.status === "Chờ xác nhận"
                                  ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-700/50 shadow-amber-200/50 dark:shadow-amber-900/30"
                                  : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-blue-200/50 dark:shadow-blue-900/30"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                                  vaccination.status === "Đã tiêm" ||
                                  vaccination.status === "Đã hoàn thành"
                                    ? "bg-emerald-200 dark:bg-emerald-800/60"
                                    : vaccination.status === "Chờ xác nhận"
                                    ? "bg-amber-200 dark:bg-amber-800/60"
                                    : "bg-blue-200 dark:bg-blue-800/60"
                                }`}
                              >
                                <svg
                                  className={`w-2.5 h-2.5 ${
                                    vaccination.status === "Đã tiêm" ||
                                    vaccination.status === "Đã hoàn thành"
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : vaccination.status === "Chờ xác nhận"
                                      ? "text-amber-700 dark:text-amber-300"
                                      : "text-blue-700 dark:text-blue-300"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  {vaccination.status === "Chờ xác nhận" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  ) : vaccination.status === "Đã hoàn thành" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  )}
                                </svg>
                              </div>
                              <span className="font-bold tracking-wide">
                                {vaccination.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
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
                    Chưa có lịch sử tiêm chủng
                  </h2>
                  <p className="text-gray-600">
                    Chưa có thông tin về các mũi tiêm chủng của con bạn.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaccinationPage;
