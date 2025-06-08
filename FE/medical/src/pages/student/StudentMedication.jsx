import React, { useState, useEffect } from "react";
import { FiClock, FiAlertCircle, FiCalendar, FiInfo } from "react-icons/fi";

const StudentMedication = () => {
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [todayMedications, setTodayMedications] = useState([]);
  const [upcomingMedications, setUpcomingMedications] = useState([]);
  const [completedMedications, setCompletedMedications] = useState([]);
  const [activeTab, setActiveTab] = useState("today");

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMedications = [
        {
          id: "MED781234",
          medicationName: "Paracetamol",
          dosage: "1 viên",
          frequency: "twice",
          startDate: "2025-07-06",
          endDate: "2025-07-11",
          timeOfDay: ["morning", "evening"],
          specialInstructions: "Uống sau bữa ăn 30 phút. Không uống khi đói.",
          reason: "Sốt nhẹ, đau đầu",
          status: "active",
          remainingDays: 3,
          schedules: [
            { date: "2025-07-06", time: "08:00", status: "completed" },
            { date: "2025-07-06", time: "19:00", status: "completed" },
            { date: "2025-07-07", time: "08:00", status: "completed" },
            { date: "2025-07-07", time: "19:00", status: "completed" },
            { date: "2025-07-08", time: "08:00", status: "completed" },
            { date: "2025-07-08", time: "19:00", status: "completed" },
            { date: "2025-07-09", time: "08:00", status: "upcoming" },
            { date: "2025-07-09", time: "19:00", status: "upcoming" },
            { date: "2025-07-10", time: "08:00", status: "upcoming" },
            { date: "2025-07-10", time: "19:00", status: "upcoming" },
            { date: "2025-07-11", time: "08:00", status: "upcoming" },
            { date: "2025-07-11", time: "19:00", status: "upcoming" },
          ],
        },
        {
          id: "MED652198",
          medicationName: "Vitamin C",
          dosage: "5ml",
          frequency: "once",
          startDate: "2025-07-01",
          endDate: "2025-07-15",
          timeOfDay: ["morning"],
          specialInstructions: "Uống trước bữa ăn sáng 15 phút.",
          reason: "Tăng cường sức đề kháng",
          status: "active",
          remainingDays: 7,
          schedules: [
            { date: "2025-07-06", time: "07:30", status: "completed" },
            { date: "2025-07-07", time: "07:30", status: "completed" },
            { date: "2025-07-08", time: "07:30", status: "completed" },
            { date: "2025-07-09", time: "07:30", status: "upcoming" },
            { date: "2025-07-10", time: "07:30", status: "upcoming" },
            { date: "2025-07-11", time: "07:30", status: "upcoming" },
            { date: "2025-07-12", time: "07:30", status: "upcoming" },
            { date: "2025-07-13", time: "07:30", status: "upcoming" },
            { date: "2025-07-14", time: "07:30", status: "upcoming" },
            { date: "2025-07-15", time: "07:30", status: "upcoming" },
          ],
        },
        {
          id: "MED541872",
          medicationName: "Siro ho",
          dosage: "10ml",
          frequency: "twice",
          startDate: "2025-06-29",
          endDate: "2025-07-05",
          timeOfDay: ["morning", "evening"],
          specialInstructions: "Uống sau bữa ăn",
          reason: "Ho khan",
          status: "completed",
          remainingDays: 0,
          schedules: [
            { date: "2025-06-29", time: "08:00", status: "completed" },
            { date: "2025-06-29", time: "19:00", status: "completed" },
            { date: "2025-06-30", time: "08:00", status: "completed" },
            { date: "2025-06-30", time: "19:00", status: "completed" },
            { date: "2025-07-01", time: "08:00", status: "completed" },
            { date: "2025-07-01", time: "19:00", status: "completed" },
            { date: "2025-07-02", time: "08:00", status: "completed" },
            { date: "2025-07-02", time: "19:00", status: "completed" },
            { date: "2025-07-03", time: "08:00", status: "completed" },
            { date: "2025-07-03", time: "19:00", status: "completed" },
            { date: "2025-07-04", time: "08:00", status: "completed" },
            { date: "2025-07-04", time: "19:00", status: "completed" },
            { date: "2025-07-05", time: "08:00", status: "completed" },
            { date: "2025-07-05", time: "19:00", status: "completed" },
          ],
        },
      ];

      setMedications(mockMedications);

      // Filter medications for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split("T")[0];

      // Get today's medications
      const todayMeds = mockMedications
        .filter((med) => med.status === "active")
        .map((med) => {
          const todaySchedules = med.schedules.filter(
            (schedule) => schedule.date === todayString
          );
          return { ...med, schedules: todaySchedules };
        })
        .filter((med) => med.schedules.length > 0);

      setTodayMedications(todayMeds);

      // Get upcoming medications (active but not today)
      const upcomingMeds = mockMedications.filter(
        (med) => med.status === "active" && med.remainingDays > 0
      );
      setUpcomingMedications(upcomingMeds);

      // Get completed medications
      const completedMeds = mockMedications.filter(
        (med) => med.status === "completed"
      );
      setCompletedMedications(completedMeds);

      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to format time
  const formatTime = (timeString) => {
    return timeString;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Helper function to get time of day text
  const getTimeOfDayText = (timeOfDay) => {
    switch (timeOfDay) {
      case "morning":
        return "Buổi sáng";
      case "afternoon":
        return "Buổi trưa";
      case "evening":
        return "Buổi tối";
      default:
        return timeOfDay;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đã uống
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Sắp đến giờ
          </span>
        );
      case "missed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Đã bỏ lỡ
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
          Lịch uống thuốc
        </h1>
        <p className="text-neutral-600">
          Theo dõi và quản lý lịch trình uống thuốc của bạn
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-neutral-800">Đang uống</h2>
            <div className="bg-primary-100 p-2 rounded-full">
              <FiClock className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {medications.filter((med) => med.status === "active").length}
          </p>
          <p className="text-sm text-neutral-500 mt-1">loại thuốc</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-neutral-800">Hôm nay</h2>
            <div className="bg-neutral-100 p-2 rounded-full">
              <FiCalendar className="h-5 w-5 text-neutral-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {todayMedications.reduce(
              (total, med) => total + med.schedules.length,
              0
            )}
          </p>
          <p className="text-sm text-neutral-500 mt-1">lần uống thuốc</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-neutral-800">Đã hoàn thành</h2>
            <div className="bg-neutral-100 p-2 rounded-full">
              <FiInfo className="h-5 w-5 text-neutral-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {completedMedications.length}
          </p>
          <p className="text-sm text-neutral-500 mt-1">liệu trình</p>
        </div>
      </div>

      {/* Tabs for different views */}
      <div className="mb-6">
        <div className="border-b border-neutral-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("today")}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === "today"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === "upcoming"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Sắp tới
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === "completed"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Đã hoàn thành
            </button>
          </nav>
        </div>
      </div>

      {/* Today's Medications */}
      {activeTab === "today" && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-lg font-medium text-neutral-800">
              Thuốc cần uống hôm nay
            </h2>
          </div>
          {todayMedications.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {todayMedications.map((medication) => (
                <div key={medication.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-neutral-800">
                      {medication.medicationName}
                    </h3>
                    <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md">
                      {medication.dosage}
                    </span>
                  </div>
                  <p className="text-neutral-600 text-sm mb-3">
                    {medication.specialInstructions}
                  </p>

                  <div className="space-y-3">
                    {medication.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="bg-neutral-100 p-2 rounded-full mr-3">
                            <FiClock className="h-4 w-4 text-neutral-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-800">
                              {formatTime(schedule.time)}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(schedule.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              Không có thuốc cần uống hôm nay.
            </div>
          )}
        </div>
      )}

      {/* Upcoming Medications */}
      {activeTab === "upcoming" && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-lg font-medium text-neutral-800">
              Thuốc đang sử dụng
            </h2>
          </div>
          {upcomingMedications.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {upcomingMedications.map((medication) => (
                <div key={medication.id} className="p-4">
                  <div className="flex flex-wrap justify-between mb-2">
                    <h3 className="text-lg font-medium text-neutral-800 mr-2">
                      {medication.medicationName}
                    </h3>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md mr-2">
                        {medication.dosage}
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                        Còn {medication.remainingDays} ngày
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Thời gian uống
                      </p>
                      <p className="text-sm text-neutral-800">
                        {medication.timeOfDay
                          .map((time) => getTimeOfDayText(time))
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Thời gian điều trị
                      </p>
                      <p className="text-sm text-neutral-800">
                        {formatDate(medication.startDate)} -{" "}
                        {formatDate(medication.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-lg mb-2">
                    <div className="flex items-start">
                      <FiInfo className="h-4 w-4 text-neutral-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">
                          Hướng dẫn sử dụng
                        </p>
                        <p className="text-sm text-neutral-800">
                          {medication.specialInstructions}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <FiAlertCircle className="h-4 w-4 text-neutral-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">
                          Lý do sử dụng
                        </p>
                        <p className="text-sm text-neutral-800">
                          {medication.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              Không có thuốc đang sử dụng.
            </div>
          )}
        </div>
      )}

      {/* Completed Medications */}
      {activeTab === "completed" && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-lg font-medium text-neutral-800">
              Thuốc đã hoàn thành
            </h2>
          </div>
          {completedMedications.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {completedMedications.map((medication) => (
                <div key={medication.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800">
                        {medication.medicationName}
                      </h3>
                      <p className="text-neutral-500 text-sm">
                        {formatDate(medication.startDate)} -{" "}
                        {formatDate(medication.endDate)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hoàn thành
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Liều lượng
                      </p>
                      <p className="text-sm text-neutral-800">
                        {medication.dosage}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Thời gian uống
                      </p>
                      <p className="text-sm text-neutral-800">
                        {medication.timeOfDay
                          .map((time) => getTimeOfDayText(time))
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">
                        Tổng số lần uống
                      </p>
                      <p className="text-sm text-neutral-800">
                        {medication.schedules.length} lần
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              Không có thuốc đã hoàn thành.
            </div>
          )}
        </div>
      )}

      {/* Health Tips Section */}
      <div className="mt-8 bg-primary-50 rounded-lg border border-primary-100 p-4">
        <div className="flex items-start">
          <div className="bg-primary-100 p-2 rounded-full mr-3">
            <FiInfo className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-800 mb-1">
              Lưu ý khi uống thuốc
            </h3>
            <ul className="text-neutral-600 text-sm space-y-2">
              <li>
                • Uống thuốc đúng giờ để đảm bảo hiệu quả điều trị tốt nhất
              </li>
              <li>• Luôn uống theo đúng liều lượng được chỉ định</li>
              <li>• Đọc kỹ hướng dẫn sử dụng trước khi uống thuốc</li>
              <li>
                • Nếu quên uống thuốc, hãy liên hệ với y tá của trường hoặc phụ
                huynh
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMedication;
