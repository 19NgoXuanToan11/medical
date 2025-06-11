import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FormInput from "../../../components/layout/form/FormInput";
import axios from "axios";

const API_URL = "https://localhost:7111/api";

const StudentHealthProfile = ({ viewOnly = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    // Student Personal Information
    studentName: "",
    studentId: "",
    dateOfBirth: "",
    age: "",
    class: "",

    // Parent Information
    parentInfo: {
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      motherPhone: "",
    },

    // Medical History
    medicalHistory: {
      hasPreviousTreatment: "no",
      treatmentDetails: "",
    },

    // Vaccination History
    vaccinationHistory: {
      hasCompleteVaccinations: "no",
      vaccinationDetails: "",
      vaccinations: [],
    },

    // Vision Information
    vision: {
      hasVisionIssues: "no",
      leftEye: "",
      rightEye: "",
      visionNotes: "",
    },

    // Hearing Information
    hearing: {
      hasHearingIssues: "no",
      leftEar: "",
      rightEar: "",
      hearingNotes: "",
    },

    // Allergies
    allergies: {
      hasAllergies: "no",
      allergyDetails: "",
    },

    // Chronic Diseases
    chronicDiseases: {
      hasChronic: "no",
      chronicDetails: "",
    },

    // Other Health Information
    height: "",
    weight: "",
    bloodType: "",
    emergencyContact: "",
    otherInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data if in edit or view mode
  useEffect(() => {
    if (id && id !== "new") {
      const fetchHealthProfile = async () => {
        try {
          const response = await axios.get(`${API_URL}/HealthProfile/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching health profile:", error);
          setError("Không thể tải hồ sơ sức khỏe. Vui lòng thử lại sau.");
        }
      };

      fetchHealthProfile();
    }
  }, [id]);

  // Class options
  const classOptions = [
    { value: "1A", label: "1A" },
    { value: "1B", label: "1B" },
    { value: "2A", label: "2A" },
    { value: "2B", label: "2B" },
    { value: "3A", label: "3A" },
    { value: "3B", label: "3B" },
    { value: "4A", label: "4A" },
    { value: "4B", label: "4B" },
    { value: "5A", label: "5A" },
    { value: "5B", label: "5B" },
  ];

  // Blood type options
  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "unknown", label: "Không biết" },
  ];

  // Common vaccinations
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
    { id: "hpv", name: "HPV" },
    { id: "rotavirus", name: "Rotavirus" },
    { id: "pneumococcal", name: "Phế cầu khuẩn" },
    { id: "covid19", name: "COVID-19" },
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
        vaccinationHistory: {
          ...formData.vaccinationHistory,
          vaccinations: [...formData.vaccinationHistory.vaccinations, value],
        },
      });
    } else {
      setFormData({
        ...formData,
        vaccinationHistory: {
          ...formData.vaccinationHistory,
          vaccinations: formData.vaccinationHistory.vaccinations.filter(
            (item) => item !== value
          ),
        },
      });
    }
  };

  // Calculate age based on date of birth
  const calculateAge = (e) => {
    const dob = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    setFormData({
      ...formData,
      dateOfBirth: e.target.value,
      age: age.toString(),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (id && id !== "new") {
        // Update existing profile
        await axios.put(`${API_URL}/HealthProfile/${id}`, formData);
      } else {
        // Create new profile
        await axios.post(`${API_URL}/HealthProfile`, formData);
      }

      setSubmitSuccess(true);

      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate("/parent/health-profile");
      }, 1500);
    } catch (error) {
      console.error("Error saving health profile:", error);
      setError("Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="flex items-center mb-6 p-4">
          <Link
            to="/parent/health-profile"
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Quay lại danh sách
          </Link>
        </div>

        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black mb-2">
              {viewOnly
                ? "Hồ sơ sức khỏe học sinh"
                : id
                ? "Cập nhật hồ sơ sức khỏe học sinh"
                : "Khai báo hồ sơ sức khỏe học sinh"}
            </h1>
            <p className="text-sm">
              {viewOnly
                ? "Xem thông tin sức khỏe đầy đủ của học sinh"
                : "Cung cấp thông tin sức khỏe đầy đủ của học sinh để nhà trường có thể theo dõi và chăm sóc tốt nhất"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700">
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 p-4 rounded bg-green-50 border border-green-200 text-green-700">
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {id && id !== "new"
                  ? "Cập nhật hồ sơ thành công!"
                  : "Tạo hồ sơ mới thành công. Đang chuyển hướng..."}
              </p>
            </div>
          )}

          <div className="space-y-8">
            {/* Section 1: Student Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                Thông tin cơ bản học sinh
              </h2>

              <div className="rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    id="studentName"
                    name="studentName"
                    label="Họ và tên học sinh"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên học sinh"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="studentId"
                    name="studentId"
                    label="Mã học sinh"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="Nhập mã học sinh"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="dateOfBirth"
                    name="dateOfBirth"
                    label="Ngày tháng năm sinh"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={calculateAge}
                    required
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="age"
                    name="age"
                    label="Tuổi"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Nhập số"
                    disabled={viewOnly}
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
                    disabled={viewOnly}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Parent Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                Thông tin phụ huynh
              </h2>

              <div className="rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    id="fatherName"
                    name="parentInfo.fatherName"
                    label="Họ tên bố"
                    value={formData.parentInfo.fatherName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ tên bố"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="fatherPhone"
                    name="parentInfo.fatherPhone"
                    label="Số điện thoại bố"
                    value={formData.parentInfo.fatherPhone}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số điện thoại bố"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="motherName"
                    name="parentInfo.motherName"
                    label="Họ tên mẹ"
                    value={formData.parentInfo.motherName}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ tên mẹ"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="motherPhone"
                    name="parentInfo.motherPhone"
                    label="Số điện thoại mẹ"
                    value={formData.parentInfo.motherPhone}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số điện thoại mẹ"
                    disabled={viewOnly}
                  />

                  <FormInput
                    id="emergencyContact"
                    name="emergencyContact"
                    label="Liên hệ khẩn cấp (nếu khác bố mẹ)"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Nhập tên và số điện thoại liên hệ khẩn cấp"
                    disabled={viewOnly}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Medical History */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </span>
                Tiền sử bệnh
              </h2>

              <div className="rounded-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-3 font-medium">
                    Học sinh có tiền sử mắc bệnh nặng hoặc phải điều trị y tế
                    không?
                  </p>
                  <div className="flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="medicalHistory.hasPreviousTreatment"
                        value="no"
                        checked={
                          formData.medicalHistory.hasPreviousTreatment === "no"
                        }
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Không</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="medicalHistory.hasPreviousTreatment"
                        value="yes"
                        checked={
                          formData.medicalHistory.hasPreviousTreatment === "yes"
                        }
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Có</span>
                    </label>
                  </div>
                </div>

                {formData.medicalHistory.hasPreviousTreatment === "yes" && (
                  <div className="mt-4">
                    <FormInput
                      id="treatmentDetails"
                      name="medicalHistory.treatmentDetails"
                      label="Chi tiết về tiền sử bệnh"
                      type="textarea"
                      value={formData.medicalHistory.treatmentDetails}
                      onChange={handleChange}
                      required={
                        formData.medicalHistory.hasPreviousTreatment === "yes"
                      }
                      placeholder="Mô tả chi tiết về các bệnh đã mắc phải, thời gian mắc bệnh, quá trình điều trị, và kết quả điều trị"
                      disabled={viewOnly}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Vaccination History */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                Tiền sử tiêm chủng
              </h2>

              <div className="rounded-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-3 font-medium">
                    Học sinh đã được tiêm chủng đầy đủ theo lịch tiêm chủng quốc
                    gia chưa?
                  </p>
                  <div className="flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="vaccinationHistory.hasCompleteVaccinations"
                        value="yes"
                        checked={
                          formData.vaccinationHistory
                            .hasCompleteVaccinations === "yes"
                        }
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">
                        Đã tiêm đầy đủ
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="vaccinationHistory.hasCompleteVaccinations"
                        value="partial"
                        checked={
                          formData.vaccinationHistory
                            .hasCompleteVaccinations === "partial"
                        }
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">
                        Đã tiêm một phần
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="vaccinationHistory.hasCompleteVaccinations"
                        value="no"
                        checked={
                          formData.vaccinationHistory
                            .hasCompleteVaccinations === "no"
                        }
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Chưa tiêm</span>
                    </label>
                  </div>
                </div>

                {(formData.vaccinationHistory.hasCompleteVaccinations ===
                  "partial" ||
                  formData.vaccinationHistory.hasCompleteVaccinations ===
                    "yes") && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-neutral-700 mb-3">
                      Vắc-xin đã tiêm (đánh dấu tất cả những loại đã tiêm):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {commonVaccinations.map((vaccine) => (
                        <label
                          key={vaccine.id}
                          className="inline-flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name="vaccinations"
                            value={vaccine.id}
                            checked={formData.vaccinationHistory.vaccinations.includes(
                              vaccine.id
                            )}
                            onChange={handleVaccinationChange}
                            className="h-5 w-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                            disabled={viewOnly}
                          />
                          <span className="ml-2 text-neutral-700">
                            {vaccine.name}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <FormInput
                        id="vaccinationDetails"
                        name="vaccinationHistory.vaccinationDetails"
                        label="Chi tiết bổ sung về tiêm chủng"
                        type="textarea"
                        value={formData.vaccinationHistory.vaccinationDetails}
                        onChange={handleChange}
                        placeholder="Ghi chú thêm về lịch tiêm chủng (nếu có), các phản ứng sau tiêm, hoặc các loại vắc-xin khác không có trong danh sách"
                        disabled={viewOnly}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Vision & Hearing */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                Thị lực & Thính lực
              </h2>

              <div className="rounded-lg p-6">
                <div className="mb-6">
                  <h3 className="font-medium text-neutral-800 mb-3">
                    Thông tin thị lực
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-600 mb-3">
                      Học sinh có vấn đề về thị lực không?
                    </p>
                    <div className="flex items-center space-x-8">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vision.hasVisionIssues"
                          value="no"
                          checked={formData.vision.hasVisionIssues === "no"}
                          onChange={handleChange}
                          className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          disabled={viewOnly}
                        />
                        <span className="ml-2 text-neutral-700">Không</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vision.hasVisionIssues"
                          value="yes"
                          checked={formData.vision.hasVisionIssues === "yes"}
                          onChange={handleChange}
                          className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          disabled={viewOnly}
                        />
                        <span className="ml-2 text-neutral-700">Có</span>
                      </label>
                    </div>
                  </div>

                  {formData.vision.hasVisionIssues === "yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        id="leftEye"
                        name="vision.leftEye"
                        label="Thị lực mắt trái"
                        value={formData.vision.leftEye}
                        onChange={handleChange}
                        required={formData.vision.hasVisionIssues === "yes"}
                        placeholder="Ví dụ: 20/20, 6/6, hoặc các chỉ số khác"
                        disabled={viewOnly}
                      />

                      <FormInput
                        id="rightEye"
                        name="vision.rightEye"
                        label="Thị lực mắt phải"
                        value={formData.vision.rightEye}
                        onChange={handleChange}
                        required={formData.vision.hasVisionIssues === "yes"}
                        placeholder="Ví dụ: 20/20, 6/6, hoặc các chỉ số khác"
                        disabled={viewOnly}
                      />

                      <div className="md:col-span-2">
                        <FormInput
                          id="visionNotes"
                          name="vision.visionNotes"
                          label="Ghi chú về thị lực"
                          type="textarea"
                          value={formData.vision.visionNotes}
                          onChange={handleChange}
                          placeholder="Mô tả về tình trạng thị lực (cận thị, viễn thị, loạn thị), có đeo kính không, các vấn đề khác liên quan đến mắt"
                          disabled={viewOnly}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-medium text-neutral-800 mb-3">
                    Thông tin thính lực
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm text-neutral-600 mb-3">
                      Học sinh có vấn đề về thính lực không?
                    </p>
                    <div className="flex items-center space-x-8">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hearing.hasHearingIssues"
                          value="no"
                          checked={formData.hearing.hasHearingIssues === "no"}
                          onChange={handleChange}
                          className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          disabled={viewOnly}
                        />
                        <span className="ml-2 text-neutral-700">Không</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hearing.hasHearingIssues"
                          value="yes"
                          checked={formData.hearing.hasHearingIssues === "yes"}
                          onChange={handleChange}
                          className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                          disabled={viewOnly}
                        />
                        <span className="ml-2 text-neutral-700">Có</span>
                      </label>
                    </div>
                  </div>

                  {formData.hearing.hasHearingIssues === "yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        id="leftEar"
                        name="hearing.leftEar"
                        label="Thính lực tai trái"
                        value={formData.hearing.leftEar}
                        onChange={handleChange}
                        required={formData.hearing.hasHearingIssues === "yes"}
                        placeholder="Nhập chỉ số thính lực tai trái"
                        disabled={viewOnly}
                      />

                      <FormInput
                        id="rightEar"
                        name="hearing.rightEar"
                        label="Thính lực tai phải"
                        value={formData.hearing.rightEar}
                        onChange={handleChange}
                        required={formData.hearing.hasHearingIssues === "yes"}
                        placeholder="Nhập chỉ số thính lực tai phải"
                        disabled={viewOnly}
                      />

                      <div className="md:col-span-2">
                        <FormInput
                          id="hearingNotes"
                          name="hearing.hearingNotes"
                          label="Ghi chú về thính lực"
                          type="textarea"
                          value={formData.hearing.hearingNotes}
                          onChange={handleChange}
                          placeholder="Mô tả về tình trạng thính lực, có sử dụng thiết bị trợ thính không, các vấn đề khác liên quan đến tai"
                          disabled={viewOnly}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 6: Allergies */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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

              <div className="rounded-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-3 font-medium">
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
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Không</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="allergies.hasAllergies"
                        value="yes"
                        checked={formData.allergies.hasAllergies === "yes"}
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Có</span>
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
                      placeholder="Mô tả chi tiết về tình trạng dị ứng, nguyên nhân gây dị ứng (thực phẩm, thuốc, phấn hoa...), mức độ nghiêm trọng, và cách xử lý khi xảy ra dị ứng"
                      disabled={viewOnly}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 7: Chronic Diseases */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                Bệnh mãn tính
              </h2>

              <div className="rounded-lg p-6">
                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-3 font-medium">
                    Học sinh có mắc bệnh mãn tính nào không?
                  </p>
                  <div className="flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="chronicDiseases.hasChronic"
                        value="no"
                        checked={formData.chronicDiseases.hasChronic === "no"}
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        disabled={viewOnly}
                      />
                      <span className="ml-2 text-neutral-700">Không</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="chronicDiseases.hasChronic"
                        value="yes"
                        checked={formData.chronicDiseases.hasChronic === "yes"}
                        onChange={handleChange}
                        className="h-5 w-5 text-primary-600 border-neutral-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-neutral-700">Có</span>
                    </label>
                  </div>
                </div>

                {formData.chronicDiseases.hasChronic === "yes" && (
                  <div className="mt-4">
                    <FormInput
                      id="chronicDetails"
                      name="chronicDiseases.chronicDetails"
                      label="Chi tiết về bệnh mãn tính"
                      type="textarea"
                      value={formData.chronicDiseases.chronicDetails}
                      onChange={handleChange}
                      required={formData.chronicDiseases.hasChronic === "yes"}
                      placeholder="Mô tả chi tiết về các bệnh mãn tính (như hen suyễn, tiểu đường, động kinh...), thời gian mắc bệnh, phương pháp điều trị hiện tại, thuốc đang sử dụng, và lưu ý khi chăm sóc"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 8: Other Health Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <span className="flex items-center justify-center bg-primary-100 rounded-full w-10 h-10 mr-3 text-primary-600">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </span>
                Thông tin sức khỏe khác
              </h2>

              <div className="rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    id="height"
                    name="height"
                    label="Chiều cao (cm)"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Nhập chiều cao bằng cm"
                  />

                  <FormInput
                    id="weight"
                    name="weight"
                    label="Cân nặng (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Nhập cân nặng bằng kg"
                  />

                  <FormInput
                    id="bloodType"
                    name="bloodType"
                    label="Nhóm máu"
                    type="select"
                    value={formData.bloodType}
                    onChange={handleChange}
                    placeholder="Chọn nhóm máu nếu biết"
                    options={bloodTypeOptions}
                  />
                </div>

                <div className="mt-5">
                  <FormInput
                    id="otherInfo"
                    name="otherInfo"
                    label="Thông tin sức khỏe bổ sung"
                    type="textarea"
                    value={formData.otherInfo}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm về sức khỏe của học sinh mà nhà trường cần biết (tình trạng dinh dưỡng, các vấn đề về giấc ngủ, các thói quen đặc biệt, các thông tin sức khỏe khác...)"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="flex justify-end pt-6">
              {viewOnly ? (
                <Link
                  to={`/parent/health-profile/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded shadow-md transition-colors duration-200 mr-4"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Chỉnh sửa hồ sơ
                </Link>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded shadow-md transition-colors duration-200 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {id ? "Cập nhật hồ sơ" : "Tạo hồ sơ mới"}
                      </>
                    )}
                  </button>
                  {submitSuccess && (
                    <div className="ml-4 text-green-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Hồ sơ đã được lưu thành công
                    </div>
                  )}
                </>
              )}
              <Link
                to="/parent/health-profile"
                className="inline-flex items-center px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-sm font-medium rounded shadow-sm transition-colors duration-200 ml-4"
              >
                {viewOnly ? "Quay lại" : "Hủy"}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentHealthProfile;
