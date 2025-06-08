import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaCheck,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

const HealthEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [formData, setFormData] = useState({
    consent: "",
    parentName: "",
    relationship: "",
    specialInstructions: "",
    acceptTerms: false,
  });

  // Sample data - in a real application, this would come from an API
  const event = {
    id: 2,
    title: "Tiêm chủng vắc-xin phòng cúm mùa",
    date: "20/09/2023",
    time: "09:00 - 15:00",
    location: "Phòng Y tế trường học",
    description:
      "Chương trình tiêm chủng vắc-xin phòng cúm mùa cho học sinh tự nguyện tham gia. Phụ huynh cần ký giấy đồng ý trước khi học sinh được tiêm.",
    details: [
      "Vắc-xin cúm mùa an toàn và hiệu quả trong việc phòng ngừa bệnh cúm.",
      "Tiêm phòng cúm đặc biệt quan trọng đối với trẻ em để giảm nguy cơ biến chứng nghiêm trọng.",
      "Vắc-xin được cung cấp miễn phí trong chương trình y tế học đường.",
      "Sau khi tiêm, học sinh sẽ được theo dõi 30 phút tại phòng y tế.",
    ],
    medicalPersonnel: [
      {
        name: "TS. BS. Nguyễn Văn A",
        title: "Bác sĩ phụ trách",
        hospital: "Bệnh viện Đa khoa Tỉnh",
      },
      {
        name: "BS. Trần Thị B",
        title: "Bác sĩ tiêm chủng",
        hospital: "Trung tâm Y tế Dự phòng",
      },
    ],
    requiredDocuments: ["Giấy đồng ý của phụ huynh", "Sổ tiêm chủng"],
    status: "needConsent",
    childName: "Nguyễn Văn An",
    childClass: "10A1",
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleConsentSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to an API
    console.log("Consent form submitted:", formData);
    setConsentGiven(true);
    setShowConsentForm(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <Link
        to="/parent/health-events"
        className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Quay lại danh sách sự kiện
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-neutral-800">
              {event.title}
            </h1>
            {event.status === "needConsent" && !consentGiven ? (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Cần xác nhận
              </span>
            ) : consentGiven ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Đã xác nhận
              </span>
            ) : (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Sắp diễn ra
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-600 mb-6">
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

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Thông tin học sinh
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Họ và tên học sinh</p>
                  <p className="font-medium">{event.childName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Lớp</p>
                  <p className="font-medium">{event.childClass}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Mô tả sự kiện
            </h2>
            <p className="text-neutral-700 mb-4">{event.description}</p>

            <ul className="list-disc pl-5 space-y-2 text-neutral-700">
              {event.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          {event.medicalPersonnel && event.medicalPersonnel.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">
                Nhân viên y tế phụ trách
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.medicalPersonnel.map((person, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-neutral-50 p-4 rounded-lg border border-neutral-200"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="bg-primary-100 rounded-full p-2">
                        <FaUserMd className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">
                        {person.name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {person.title} - {person.hospital}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.requiredDocuments && event.requiredDocuments.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-3">
                Giấy tờ cần mang theo
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                {event.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {!consentGiven && event.status === "needConsent" && (
            <div className="mt-6">
              {!showConsentForm ? (
                <button
                  onClick={() => setShowConsentForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaCheck className="mr-2" />
                  Xác nhận tham gia
                </button>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                  <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                    Xác nhận đồng ý tham gia
                  </h2>
                  <form onSubmit={handleConsentSubmit}>
                    <div className="mb-4">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Bạn có đồng ý cho phép con tham gia sự kiện này không?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="consent-yes"
                            name="consent"
                            type="radio"
                            value="yes"
                            required
                            checked={formData.consent === "yes"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          />
                          <label
                            htmlFor="consent-yes"
                            className="ml-3 block text-neutral-700"
                          >
                            Đồng ý
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="consent-no"
                            name="consent"
                            type="radio"
                            value="no"
                            required
                            checked={formData.consent === "no"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          />
                          <label
                            htmlFor="consent-no"
                            className="ml-3 block text-neutral-700"
                          >
                            Không đồng ý
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="parentName"
                        className="block text-neutral-700 text-sm font-medium mb-2"
                      >
                        Họ tên phụ huynh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="parentName"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="relationship"
                        className="block text-neutral-700 text-sm font-medium mb-2"
                      >
                        Quan hệ với học sinh{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="relationship"
                        name="relationship"
                        required
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">-- Chọn --</option>
                        <option value="father">Cha</option>
                        <option value="mother">Mẹ</option>
                        <option value="guardian">Người giám hộ</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="specialInstructions"
                        className="block text-neutral-700 text-sm font-medium mb-2"
                      >
                        Lưu ý đặc biệt (nếu có)
                      </label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={3}
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Ví dụ: dị ứng, bệnh nền, lưu ý khác..."
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            required
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="acceptTerms"
                            className="font-medium text-neutral-700"
                          >
                            Tôi xác nhận thông tin trên là chính xác{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <p className="text-neutral-500">
                            Tôi đã đọc và hiểu mọi thông tin liên quan đến sự
                            kiện và chịu trách nhiệm về quyết định của mình.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={
                          !formData.acceptTerms ||
                          !formData.consent ||
                          !formData.parentName ||
                          !formData.relationship
                        }
                        className={`px-4 py-2 rounded-md ${
                          !formData.acceptTerms ||
                          !formData.consent ||
                          !formData.parentName ||
                          !formData.relationship
                            ? "bg-neutral-400 cursor-not-allowed text-white"
                            : "bg-primary-600 hover:bg-primary-700 text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        }`}
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConsentForm(false)}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {consentGiven && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCheck className="text-green-500 mr-2" />
                <h3 className="font-medium text-green-800">
                  Xác nhận tham gia thành công
                </h3>
              </div>
              <p className="text-green-700">
                Bạn đã xác nhận cho phép {event.childName} tham gia sự kiện "
                {event.title}". Thông tin chi tiết sẽ được gửi tới bạn qua email
                hoặc tin nhắn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthEventDetail;
