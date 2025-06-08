import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VaccinationHistory = () => {
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
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-black mb-2">Tiêm chủng</h1>
        </div>

        {/* Child selector */}
        {children.length > 0 && (
          <div className="px-6 pt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Chọn con của bạn:
            </label>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedChild?.id === child.id
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
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
            <div className="p-6">
              <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin học sinh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">
                      Họ và tên học sinh
                    </p>
                    <p className="font-medium">{selectedChild.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Mã học sinh</p>
                    <p className="font-medium">{selectedChild.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Lớp</p>
                    <p className="font-medium">{selectedChild.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Ngày sinh</p>
                    <p className="font-medium">{selectedChild.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-neutral-200">
                <nav className="flex space-x-8">
                  <button
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "upcoming"
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Tiêm chủng sắp tới
                    {selectedChild.upcomingVaccinations.length > 0 && (
                      <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {selectedChild.upcomingVaccinations.length}
                      </span>
                    )}
                  </button>
                  <button
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "history"
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
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
                        <p className="text-neutral-600">
                          Các mũi tiêm đã lên lịch cho con bạn tại trường
                        </p>
                      </div>
                      <div className="space-y-4">
                        {selectedChild.upcomingVaccinations.map(
                          (vaccination) => (
                            <div
                              key={vaccination.id}
                              className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-primary-500"
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
                                      <span>Ngày tiêm: {vaccination.date}</span>
                                    </div>
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
                                      <span>
                                        Địa điểm: {vaccination.location}
                                      </span>
                                    </div>
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
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <span>
                                        Trạng thái: {vaccination.status}
                                      </span>
                                    </div>
                                  </div>
                                  {vaccination.description && (
                                    <p className="mt-3 text-neutral-600">
                                      {vaccination.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      vaccination.status === "Chờ xác nhận"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {vaccination.status}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Link
                                  to={`/parent/vaccination/consent/${vaccination.id}`}
                                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  Xác nhận đồng ý
                                </Link>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
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
                        Hiện tại không có kế hoạch tiêm chủng nào được lên lịch
                        cho con bạn tại trường.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Vaccination history tab */}
              {activeTab === "history" && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                      Lịch sử tiêm chủng
                    </h2>
                    <p className="text-neutral-600">
                      Các mũi tiêm chủng con bạn đã thực hiện
                    </p>
                  </div>

                  {selectedChild.vaccinationHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
                              style={{ width: "30%" }}
                            >
                              Loại vaccine
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
                              style={{ width: "20%" }}
                            >
                              Ngày tiêm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
                              style={{ width: "30%" }}
                            >
                              Địa điểm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
                              style={{ width: "20%" }}
                            >
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {selectedChild.vaccinationHistory.map(
                            (vaccination) => (
                              <tr
                                key={vaccination.id}
                                className="hover:bg-neutral-50"
                              >
                                <td className="px-6 py-4 text-center">
                                  <div className="text-sm font-medium text-neutral-900">
                                    {vaccination.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="text-sm text-neutral-500">
                                    {vaccination.date}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="text-sm text-neutral-500">
                                    {vaccination.location}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      vaccination.status === "Đã tiêm"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {vaccination.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
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
                        Chưa có lịch sử tiêm chủng
                      </h2>
                      <p className="text-neutral-600">
                        Chưa có thông tin về các mũi tiêm chủng của con bạn.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VaccinationHistory;
