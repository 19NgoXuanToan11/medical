import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaSyringe,
  FaStethoscope,
} from "react-icons/fa";

const HealthEventsList = () => {
  const [activeTab, setActiveTab] = useState("vaccination");

  // Sample data - categorized by type instead of status
  const vaccinationEvents = [
    {
      id: 2,
      title: "Tiêm chủng vắc-xin phòng cúm mùa",
      date: "20/09/2023",
      time: "09:00 - 15:00",
      location: "Phòng Y tế trường học",
      description:
        "Chương trình tiêm chủng vắc-xin phòng cúm mùa cho học sinh tự nguyện tham gia. Phụ huynh cần ký giấy đồng ý trước khi học sinh được tiêm.",
      requiredDocuments: ["Giấy đồng ý của phụ huynh", "Sổ tiêm chủng"],
      status: "needConsent",
      type: "vaccination",
    },
    {
      id: 4,
      title: "Tiêm chủng vắc-xin sởi-rubella",
      date: "15/02/2023",
      time: "09:00 - 15:00",
      location: "Phòng Y tế trường học",
      description:
        "Chương trình tiêm chủng bổ sung vắc-xin sởi-rubella cho học sinh.",
      requiredDocuments: [],
      status: "completed",
      result: "Đã tiêm",
      type: "vaccination",
    },
  ];

  const regularHealthEvents = [
    {
      id: 1,
      title: "Khám sức khỏe định kỳ học kỳ 1",
      date: "15/08/2023",
      time: "08:00 - 16:00",
      location: "Phòng Y tế trường học",
      description:
        "Khám sức khỏe định kỳ cho học sinh bao gồm: đo chiều cao, cân nặng, kiểm tra thị lực, khám răng miệng, khám nội khoa và tư vấn dinh dưỡng.",
      requiredDocuments: ["Sổ khám sức khỏe", "Thẻ bảo hiểm y tế"],
      status: "upcoming",
      type: "regular",
    },
    {
      id: 3,
      title: "Khám sức khỏe răng miệng",
      date: "10/03/2023",
      time: "08:30 - 11:30",
      location: "Phòng Y tế trường học",
      description:
        "Khám răng miệng, phát hiện sâu răng và tư vấn chăm sóc răng miệng cho học sinh.",
      requiredDocuments: [],
      status: "completed",
      result: "Đã khám",
      type: "regular",
    },
  ];

  const renderEventCard = (event) => {
    const isCompleted = event.status === "completed";

    return (
      <div
        key={event.id}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 ${
          isCompleted
            ? "border-l-4 border-l-gray-400 dark:border-l-gray-500"
            : ""
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {event.title}
            </h2>
            {event.status === "needConsent" && (
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Cần xác nhận
              </span>
            )}
            {event.status === "completed" && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Đã kết thúc
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaCalendarAlt
                className={`mr-2 ${
                  isCompleted
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              {event.date}
            </div>
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaClock
                className={`mr-2 ${
                  isCompleted
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              {event.time}
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt
                className={`mr-2 ${
                  isCompleted
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              />
              {event.location}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {event.description}
          </p>

          {event.requiredDocuments && event.requiredDocuments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Giấy tờ cần mang theo:
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                {event.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {event.result && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Kết quả:
              </h3>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  <FaCheckCircle className="mr-1" />
                  {event.result}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {event.type === "vaccination"
                    ? "Đã hoàn thành tiêm chủng, nhấn nút bên dưới để xem chi tiết"
                    : "Đã hoàn thành khám sức khỏe, nhấn nút bên dưới để xem chi tiết"}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {event.status === "needConsent" && (
              <Link
                to={`/parent/vaccination/consent/new`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Xác nhận tham gia
              </Link>
            )}
            {event.status === "completed" && (
              <Link
                to={`/parent/health-events/${event.id}/results`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                <FaInfoCircle className="mr-2" />
                Xem kết quả chi tiết
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sự cố y tế
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thông tin về các sự cố y tế sắp diễn ra và đã diễn ra tại trường
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeTab === "vaccination"
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("vaccination")}
              >
                <FaSyringe className="mr-2" />
                Tiêm chủng
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeTab === "regular"
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setActiveTab("regular")}
              >
                <FaStethoscope className="mr-2" />Y tế định kỳ
              </button>
            </li>
          </ul>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {activeTab === "vaccination" && (
            <>
              {vaccinationEvents.length === 0 ? (
                <div className="text-center py-8">
                  <FaSyringe className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Không có sự kiện tiêm chủng nào
                  </p>
                </div>
              ) : (
                vaccinationEvents.map((event) => renderEventCard(event))
              )}
            </>
          )}

          {activeTab === "regular" && (
            <>
              {regularHealthEvents.length === 0 ? (
                <div className="text-center py-8">
                  <FaStethoscope className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Không có sự kiện y tế định kỳ nào
                  </p>
                </div>
              ) : (
                regularHealthEvents.map((event) => renderEventCard(event))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthEventsList;
