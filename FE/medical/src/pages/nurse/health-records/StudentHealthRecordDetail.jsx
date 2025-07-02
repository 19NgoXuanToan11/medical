import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiActivity,
  FiHeart,
  FiEye,
  FiThermometer,
  FiPrinter,
  FiEdit,
  FiSave,
  FiX,
  FiFileText,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import healthProfileService from "../../../utils/api/health-profile/healthProfileService";

const StudentHealthRecordDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchStudentHealthRecord = async () => {
      try {
        setLoading(true);

        // Fetch health profile by student code
        const profileData = await healthProfileService.getByStudentCode(
          studentId
        );

        // Transform API data to component format
        const studentData = {
          id: profileData.healthProfileId,
          studentId: profileData.studentCode,
          name: profileData.studentCode || "Không có tên", // API might need student name from another endpoint
          gender: "Chưa xác định", // This info might come from student table
          dateOfBirth: "Chưa xác định", // This info might come from student table
          className: "Chưa xác định", // This info might come from student table
          parentName: "Chưa xác định", // This info might come from student table
          parentPhone: "Chưa xác định", // This info might come from student table
          parentEmail: "Chưa xác định", // This info might come from student table
          address: "Chưa xác định", // This info might come from student table
          lastCheckup: profileData.createdAt
            ? new Date(profileData.createdAt).toISOString().split("T")[0]
            : "N/A",
          healthStatus: getHealthStatusFromProfile(profileData),
          physicalMeasurements: {
            height: profileData.height || 0,
            weight: profileData.weight || 0,
            bmi:
              profileData.height && profileData.weight
                ? (
                    profileData.weight / Math.pow(profileData.height / 100, 2)
                  ).toFixed(1)
                : 0,
            bloodPressure: profileData.bloodPressure || "N/A",
            heartRate: profileData.heartRate || 0,
            temperature: 36.5, // Default, might need separate measurement data
            vision: {
              left: profileData.leftEye || "N/A",
              right: profileData.rightEye || "N/A",
              status: profileData.hasVisionIssues ? "Có vấn đề" : "Bình thường",
            },
          },
          allergies: profileData.hasAllergies
            ? profileData.allergyDetails
              ? [profileData.allergyDetails]
              : ["Có dị ứng"]
            : ["Không có"],
          medications: profileData.hasPreviousTreatment
            ? profileData.treatmentDetails
              ? [profileData.treatmentDetails]
              : ["Có điều trị"]
            : ["Không có"],
          chronicConditions: profileData.hasChronicDiseases
            ? profileData.chronicDetails
              ? [profileData.chronicDetails]
              : ["Có bệnh mãn tính"]
            : ["Không có"],
          vaccinationHistory: profileData.hasCompleteVaccinations
            ? [
                {
                  vaccine: "Tiêm chủng đầy đủ",
                  date: "N/A",
                  dose: profileData.vaccinationDetails || "Đầy đủ",
                  status: "Hoàn thành",
                },
              ]
            : [],
          healthHistory: [
            {
              date: profileData.createdAt
                ? new Date(profileData.createdAt).toISOString().split("T")[0]
                : "N/A",
              event: "Hồ sơ sức khỏe được tạo",
              result: getHealthStatusFromProfile(profileData),
              notes: profileData.otherInfo || "Không có ghi chú đặc biệt",
              nurseId: "N/A",
              nurseName: "Hệ thống",
            },
          ],
          notes: profileData.otherInfo || "Không có ghi chú đặc biệt",
          recommendations: generateRecommendations(profileData),
        };

        setStudent(studentData);
        setEditData({
          notes: studentData.notes,
          recommendations: [...studentData.recommendations],
          allergies: [...studentData.allergies],
          medications: [...studentData.medications],
          chronicConditions: [...studentData.chronicConditions],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student health record:", error);
        setStudent(null);
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentHealthRecord();
    }
  }, [studentId]);

  // Helper function to determine health status from profile data
  const getHealthStatusFromProfile = (profile) => {
    if (profile.hasChronicDiseases || profile.hasPreviousTreatment) {
      return "Cần theo dõi";
    }
    if (
      profile.hasAllergies ||
      profile.hasVisionIssues ||
      profile.hasHearingIssues
    ) {
      return "Bình thường";
    }
    return "Tốt";
  };

  // Helper function to generate recommendations based on profile
  const generateRecommendations = (profile) => {
    const recommendations = [];

    if (profile.hasAllergies) {
      recommendations.push("Tránh tiếp xúc với các chất gây dị ứng đã biết");
    }
    if (profile.hasChronicDiseases) {
      recommendations.push("Theo dõi định kỳ tình trạng bệnh mãn tính");
    }
    if (profile.hasVisionIssues) {
      recommendations.push("Khám mắt định kỳ và đeo kính nếu cần");
    }
    if (profile.hasHearingIssues) {
      recommendations.push("Kiểm tra thính lực định kỳ");
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push("Duy trì chế độ ăn uống cân bằng");
      recommendations.push("Tập thể dục đều đặn");
    }
    recommendations.push("Khám sức khỏe định kỳ 6 tháng/lần");

    return recommendations;
  };

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { label: "Thiếu cân", color: "text-yellow-600" };
    if (bmi < 25) return { label: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { label: "Thừa cân", color: "text-orange-600" };
    return { label: "Béo phì", color: "text-red-600" };
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "Tốt":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Bình thường":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Cần theo dõi":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Yếu":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayItem = (field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API update
      const updateData = {
        ...student, // Keep existing data
        otherInfo: editData.notes,
        // Note: API might need different field mapping for other editable data
        // This is a simplified version focusing on notes
      };

      await healthProfileService.update(student.id, updateData);

      setStudent((prev) => ({
        ...prev,
        notes: editData.notes,
        recommendations: editData.recommendations,
        allergies: editData.allergies,
        medications: editData.medications,
        chronicConditions: editData.chronicConditions,
      }));
      setIsEditing(false);
      alert("Đã lưu thay đổi thành công!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Có lỗi xảy ra khi lưu thay đổi. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Không tìm thấy hồ sơ học sinh
          </h2>
        </div>
      </div>
    );
  }

  const bmiStatus = getBmiStatus(student.physicalMeasurements.bmi);

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/nurse/health-records")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
              Hồ sơ sức khỏe - {student.name}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Thông tin chi tiết sức khỏe học sinh
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              <FiPrinter className="w-4 h-4" />
              In hồ sơ
            </button>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  Lưu
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Info Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <FiUser className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  {student.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {student.studentId} - {student.className}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Giới tính:
                </span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Ngày sinh:
                </span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.dateOfBirth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Lớp:
                </span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.className}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Tình trạng:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(
                    student.healthStatus
                  )}`}
                >
                  {student.healthStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Thông tin liên hệ
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Phụ huynh:
                </span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.parentName}
                </p>
              </div>
              <div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Điện thoại:
                </span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.parentPhone}
                </p>
              </div>
              <div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Email:
                </span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.parentEmail}
                </p>
              </div>
              <div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Địa chỉ:
                </span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  {student.address}
                </p>
              </div>
            </div>
          </div>

          {/* Physical Measurements Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Chỉ số sinh lý
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {student.physicalMeasurements.height}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    cm
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">
                    Chiều cao
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {student.physicalMeasurements.weight}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    kg
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">
                    Cân nặng
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    BMI:
                  </span>
                  <div className="text-right">
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                      {student.physicalMeasurements.bmi}
                    </div>
                    <div className={`text-xs font-medium ${bmiStatus.color}`}>
                      {bmiStatus.label}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Huyết áp:
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {student.physicalMeasurements.bloodPressure} mmHg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Nhịp tim:
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {student.physicalMeasurements.heartRate} bpm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Thị lực:
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {student.physicalMeasurements.vision.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
              Thông tin y tế
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Dị ứng
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editData.allergies.map((allergy, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={allergy}
                          onChange={(e) =>
                            handleArrayChange(
                              "allergies",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                        <button
                          onClick={() =>
                            handleRemoveArrayItem("allergies", index)
                          }
                          className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem("allergies")}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Thêm dị ứng
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {student.allergies.map((allergy, index) => (
                      <li
                        key={index}
                        className="text-sm text-neutral-800 dark:text-neutral-200"
                      >
                        • {allergy}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Thuốc đang dùng
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editData.medications.map((medication, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={medication}
                          onChange={(e) =>
                            handleArrayChange(
                              "medications",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                        <button
                          onClick={() =>
                            handleRemoveArrayItem("medications", index)
                          }
                          className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem("medications")}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Thêm thuốc
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {student.medications.map((medication, index) => (
                      <li
                        key={index}
                        className="text-sm text-neutral-800 dark:text-neutral-200"
                      >
                        • {medication}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Bệnh mãn tính
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editData.chronicConditions.map((condition, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={condition}
                          onChange={(e) =>
                            handleArrayChange(
                              "chronicConditions",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                        <button
                          onClick={() =>
                            handleRemoveArrayItem("chronicConditions", index)
                          }
                          className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddArrayItem("chronicConditions")}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Thêm bệnh mãn tính
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {student.chronicConditions.map((condition, index) => (
                      <li
                        key={index}
                        className="text-sm text-neutral-800 dark:text-neutral-200"
                      >
                        • {condition}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Vaccination History */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
              Lịch sử tiêm chủng
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Vaccine
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Ngày tiêm
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Mũi số
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.vaccinationHistory.map((vaccination, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-100 dark:border-neutral-700"
                    >
                      <td className="py-3 text-sm text-neutral-800 dark:text-neutral-200">
                        {vaccination.vaccine}
                      </td>
                      <td className="py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {vaccination.date}
                      </td>
                      <td className="py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {vaccination.dose}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {vaccination.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Health History */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
              Lịch sử khám sức khỏe
            </h4>
            <div className="space-y-4">
              {student.healthHistory.map((history, index) => (
                <div
                  key={index}
                  className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-neutral-800 dark:text-neutral-200">
                        {history.event}
                      </h5>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {history.date} - Điều dưỡng: {history.nurseName}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getHealthStatusColor(
                        history.result
                      )}`}
                    >
                      {history.result}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {history.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Ghi chú
              </h4>
              {isEditing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 resize-none"
                  placeholder="Nhập ghi chú..."
                />
              ) : (
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                  {student.notes}
                </p>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Khuyến nghị
              </h4>
              {isEditing ? (
                <div className="space-y-2">
                  {editData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={recommendation}
                        onChange={(e) =>
                          handleArrayChange(
                            "recommendations",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                      <button
                        onClick={() =>
                          handleRemoveArrayItem("recommendations", index)
                        }
                        className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem("recommendations")}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Thêm khuyến nghị
                  </button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {student.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <FiInfo className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthRecordDetail;
