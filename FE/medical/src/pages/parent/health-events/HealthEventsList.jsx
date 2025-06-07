import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";

const HealthEventsList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Sample data - in a real application, this would come from an API
  const upcomingEvents = [
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
    },
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
    },
  ];

  const pastEvents = [
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
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Sự kiện y tế
        </h1>
        <p className="text-neutral-600">
          Thông tin về các sự kiện y tế sắp diễn ra và đã diễn ra tại trường
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-t-lg border-b-2 ${
                activeTab === "upcoming"
                  ? "text-primary-600 border-primary-600"
                  : "text-neutral-500 border-transparent hover:text-neutral-600 hover:border-neutral-300"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              <FaCalendarAlt className="mr-2" />
              Sắp diễn ra
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-t-lg border-b-2 ${
                activeTab === "past"
                  ? "text-primary-600 border-primary-600"
                  : "text-neutral-500 border-transparent hover:text-neutral-600 hover:border-neutral-300"
              }`}
              onClick={() => setActiveTab("past")}
            >
              <FaCalendarAlt className="mr-2" />
              Đã diễn ra
            </button>
          </li>
        </ul>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {activeTab === "upcoming" && (
          <>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500">Không có sự kiện sắp diễn ra</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200 border-l-4 border-l-primary-600"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-neutral-800">
                        {event.title}
                      </h2>
                      {event.status === "needConsent" && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Cần xác nhận
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-600 mb-4">
                      <div className="flex items-center mr-6 mb-2 sm:mb-0">
                        <FaCalendarAlt className="mr-2 text-primary-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center mr-6 mb-2 sm:mb-0">
                        <FaClock className="mr-2 text-primary-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-primary-500" />
                        {event.location}
                      </div>
                    </div>

                    <p className="text-neutral-600 mb-4">{event.description}</p>

                    {event.requiredDocuments &&
                      event.requiredDocuments.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-neutral-700 mb-2">
                            Giấy tờ cần mang theo:
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-neutral-600">
                            {event.requiredDocuments.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {event.status === "needConsent" && (
                        <Link
                          to={`/parent/health-events/${event.id}/consent`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Xác nhận tham gia
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {pastEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500">Không có sự kiện đã diễn ra</p>
              </div>
            ) : (
              pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200 border-l-4 border-l-neutral-400"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-neutral-800">
                        {event.title}
                      </h2>
                      <span className="bg-neutral-100 text-neutral-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Đã kết thúc
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-600 mb-4">
                      <div className="flex items-center mr-6 mb-2 sm:mb-0">
                        <FaCalendarAlt className="mr-2 text-neutral-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center mr-6 mb-2 sm:mb-0">
                        <FaClock className="mr-2 text-neutral-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-neutral-500" />
                        {event.location}
                      </div>
                    </div>

                    <p className="text-neutral-600 mb-4">{event.description}</p>

                    {event.result && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-neutral-700 mb-2">
                          Kết quả:
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {event.result}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        to={`/parent/health-events/${event.id}/results`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <FaInfoCircle className="mr-2" />
                        Xem kết quả
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthEventsList;
