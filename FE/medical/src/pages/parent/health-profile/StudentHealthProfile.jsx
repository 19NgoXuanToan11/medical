import React, { useState } from "react";
import { Link } from "react-router-dom";

const StudentHealthProfile = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    dateOfBirth: "",
    class: "",
    allergies: {
      hasAllergies: "no",
      allergyDetails: "",
    },
    chronicDiseases: {
      hasChronic: "no",
      chronicDetails: "",
    },
    medicalHistory: {
      hasPreviousTreatment: "no",
      treatmentDetails: "",
    },
    vision: {
      hasVisionIssues: "no",
      leftEye: "",
      rightEye: "",
      visionNotes: "",
    },
    hearing: {
      hasHearingIssues: "no",
      hearingNotes: "",
    },
    vaccinations: [],
    otherInfo: "",
  });

  const commonVaccinations = [
    { id: "bcg", name: "BCG (Lao)" },
    { id: "dpt", name: "DPT (Bạch hầu, Ho gà, Uốn ván)" },
    { id: "opv", name: "OPV (Bại liệt)" },
    { id: "hepb", name: "Viêm gan B" },
    { id: "measles", name: "Sởi" },
    { id: "mmr", name: "MMR (Sởi, Quai bị, Rubella)" },
    { id: "hib", name: "Hib (Viêm màng não, Viêm phổi)" },
    { id: "chickenpox", name: "Thủy đậu" },
    { id: "jenceph", name: "Viêm não Nhật Bản" },
    { id: "typhoid", name: "Thương hàn" },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects in state
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle checkbox changes for vaccinations
  const handleVaccinationChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        vaccinations: [...formData.vaccinations, value],
      });
    } else {
      setFormData({
        ...formData,
        vaccinations: formData.vaccinations.filter((item) => item !== value),
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit data to backend would go here
    console.log("Submitting health profile:", formData);
    // Show success notification
    alert("Hồ sơ sức khỏe đã được lưu thành công!");
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/parent/health-profile"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 mr-2 transition-colors duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            <span className="font-medium">Quay lại danh sách</span>
          </Link>
          <div className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-medium">
            Thông tin sức khỏe
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#FFFFFF"
                  d="M47.7,-57.2C59.5,-45.8,65.9,-28.6,68.8,-10.8C71.6,7.1,71,25.5,62.3,39.7C53.6,53.9,36.9,63.8,19.1,68.7C1.2,73.5,-17.8,73.3,-35.1,66.2C-52.5,59.1,-68.3,45.1,-73.3,28.3C-78.4,11.5,-72.8,-8.1,-64.5,-25.6C-56.2,-43,-45.2,-58.3,-31.4,-68.8C-17.6,-79.3,-0.9,-85.1,13.9,-80.5C28.6,-75.9,36,-68.6,47.7,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 text-center">
              Khai báo hồ sơ sức khỏe học sinh
            </h1>
            <p className="text-blue-100 md:text-lg max-w-2xl relative z-10 mx-auto text-center">
              Cung cấp thông tin sức khỏe của học sinh để nhà trường có thể theo
              dõi và chăm sóc tốt nhất
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 rounded-full w-8 h-8 mr-3 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  Thông tin cơ bản
                </h2>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="studentName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Họ và tên học sinh{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nhập họ và tên học sinh"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="studentId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mã học sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nhập mã học sinh"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="class"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Lớp <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Chọn lớp</option>
                        <option value="1A">1A</option>
                        <option value="1B">1B</option>
                        <option value="2A">2A</option>
                        <option value="2B">2B</option>
                        <option value="3A">3A</option>
                        <option value="3B">3B</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Allergies */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="flex items-center justify-center bg-red-100 rounded-full w-8 h-8 mr-3 text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </span>
                  Thông tin dị ứng
                </h2>

                <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Học sinh có bị dị ứng không?
                    </p>
                    <div className="flex items-center space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="allergies.hasAllergies"
                          value="no"
                          checked={formData.allergies.hasAllergies === "no"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Không</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="allergies.hasAllergies"
                          value="yes"
                          checked={formData.allergies.hasAllergies === "yes"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Có</span>
                      </label>
                    </div>
                  </div>

                  {formData.allergies.hasAllergies === "yes" && (
                    <div className="mt-4">
                      <label
                        htmlFor="allergyDetails"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Chi tiết về tình trạng dị ứng{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="allergyDetails"
                        name="allergies.allergyDetails"
                        value={formData.allergies.allergyDetails}
                        onChange={handleChange}
                        required={formData.allergies.hasAllergies === "yes"}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Mô tả chi tiết về tình trạng dị ứng, nguyên nhân gây dị ứng, mức độ nghiêm trọng, và cách xử lý khi xảy ra dị ứng"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Lưu hồ sơ sức khỏe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthProfile;
