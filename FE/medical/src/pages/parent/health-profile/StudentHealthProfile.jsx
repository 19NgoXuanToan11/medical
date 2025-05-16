import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../../../components/FormInput";

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

  // Class options
  const classOptions = [
    { value: "1A", label: "1A" },
    { value: "1B", label: "1B" },
    { value: "2A", label: "2A" },
    { value: "2B", label: "2B" },
    { value: "3A", label: "3A" },
    { value: "3B", label: "3B" },
  ];

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
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/parent/health-profile"
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm mr-2">
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
          <div className="bg-blue-600 text-white py-1.5 px-4 rounded-full text-sm font-medium">
            Thông tin sức khỏe
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="bg-blue-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                Khai báo hồ sơ sức khỏe học sinh
              </h1>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Cung cấp thông tin sức khỏe của học sinh để nhà trường có thể
                theo dõi và chăm sóc tốt nhất
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-3 text-blue-600">
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
                    <FormInput
                      id="studentName"
                      name="studentName"
                      label="Họ và tên học sinh"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên học sinh"
                    />

                    <FormInput
                      id="studentId"
                      name="studentId"
                      label="Mã học sinh"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mã học sinh"
                    />

                    <FormInput
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label="Ngày sinh"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />

                    <FormInput
                      id="class"
                      name="class"
                      label="Lớp"
                      type="select"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      placeholder="Chọn lớp"
                      options={classOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Allergies */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="flex items-center justify-center bg-red-100 rounded-full w-10 h-10 mr-3 text-red-600">
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
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      Học sinh có bị dị ứng không?
                    </p>
                    <div className="flex items-center space-x-8">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="allergies.hasAllergies"
                          value="no"
                          checked={formData.allergies.hasAllergies === "no"}
                          onChange={handleChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Không</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="allergies.hasAllergies"
                          value="yes"
                          checked={formData.allergies.hasAllergies === "yes"}
                          onChange={handleChange}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Có</span>
                      </label>
                    </div>
                  </div>

                  {formData.allergies.hasAllergies === "yes" && (
                    <div className="mt-4">
                      <FormInput
                        id="allergyDetails"
                        name="allergies.allergyDetails"
                        label="Chi tiết về tình trạng dị ứng"
                        type="textarea"
                        value={formData.allergies.allergyDetails}
                        onChange={handleChange}
                        required={formData.allergies.hasAllergies === "yes"}
                        placeholder="Mô tả chi tiết về tình trạng dị ứng, nguyên nhân gây dị ứng, mức độ nghiêm trọng, và cách xử lý khi xảy ra dị ứng"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-blue-300 text-blue-600 font-medium rounded-md shadow-sm"
                >
                  Quay lại
                </button>

                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm"
                >
                  Tiếp theo
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md"
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
