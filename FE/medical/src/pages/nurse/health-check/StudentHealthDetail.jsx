import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiActivity,
  FiAlertCircle,
  FiPrinter,
  FiEdit,
  FiSend,
  FiSave,
  FiX,
} from "react-icons/fi";

const StudentHealthDetail = () => {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Simulate API call to fetch student health data
    setTimeout(() => {
      // Mock health check data
      const checkData = {
        id,
        title: "Kiểm tra sức khỏe định kỳ học kỳ 2",
        grade: "Lớp 5B",
        scheduledDate: "2023-05-15",
        status: "completed",
        description: "Kiểm tra sức khỏe định kỳ cho học sinh cuối học kỳ 2",
      };

      // Mock student data
      const hasAbnormality = parseInt(studentId.replace("ST", "")) % 5 === 0;
      const studentData = {
        id: studentId,
        name: `Học sinh ${parseInt(studentId.replace("ST", "")) % 100}`,
        gender: parseInt(studentId) % 2 === 0 ? "Nam" : "Nữ",
        dateOfBirth: "2012-08-15",
        parentName: "Nguyễn Văn A",
        parentPhone: "0987654321",
        class: "5B",
        isConfirmed: true,
        hasAbnormality,
        height: 140,
        weight: 35,
        bmi: 17.9,
        vision: {
          left: hasAbnormality ? "6/9" : "6/6",
          right: hasAbnormality ? "6/12" : "6/6",
          status: hasAbnormality ? "Cần kiểm tra thêm" : "Bình thường",
        },
        bloodPressure: {
          systolic: 110,
          diastolic: 70,
          status: "Bình thường",
        },
        pulseRate: 75,
        temperature: 36.5,
        respiratoryRate: 20,
        notes: hasAbnormality
          ? ["Cần theo dõi thêm", "Dấu hiệu thiếu máu nhẹ"]
          : [],
        recommendations: hasAbnormality
          ? [
              "Khuyến nghị khám bác sĩ chuyên khoa",
              "Cần kiểm tra thị lực chuyên sâu",
              "Bổ sung thực phẩm giàu sắt",
            ]
          : ["Duy trì chế độ ăn uống lành mạnh", "Tập thể dục đều đặn"],
        history: [
          {
            date: "2022-11-10",
            event: "Kiểm tra sức khỏe định kỳ học kỳ 1",
            height: 138,
            weight: 33,
            bmi: 17.3,
          },
          {
            date: "2022-05-15",
            event: "Kiểm tra sức khỏe định kỳ học kỳ 2",
            height: 135,
            weight: 31,
            bmi: 17.0,
          },
        ],
      };

      setHealthCheck(checkData);
      setStudent(studentData);
      setEditData({
        height: studentData.height,
        weight: studentData.weight,
        vision: {
          left: studentData.vision.left,
          right: studentData.vision.right,
          status: studentData.vision.status,
        },
        bloodPressure: {
          systolic: studentData.bloodPressure.systolic,
          diastolic: studentData.bloodPressure.diastolic,
        },
        pulseRate: studentData.pulseRate,
        temperature: studentData.temperature,
        respiratoryRate: studentData.respiratoryRate,
        notes: [...studentData.notes],
        recommendations: [...studentData.recommendations],
        hasAbnormality: studentData.hasAbnormality,
      });
      setLoading(false);
    }, 1000);
  }, [id, studentId]);

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { label: "Thiếu cân", color: "text-yellow-600" };
    if (bmi < 25) return { label: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { label: "Thừa cân", color: "text-orange-600" };
    return { label: "Béo phì", color: "text-red-600" };
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNotifyParent = () => {
    alert("Đã gửi thông báo đến phụ huynh!");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditData({
        height: student.height,
        weight: student.weight,
        vision: {
          left: student.vision.left,
          right: student.vision.right,
          status: student.vision.status,
        },
        bloodPressure: {
          systolic: student.bloodPressure.systolic,
          diastolic: student.bloodPressure.diastolic,
        },
        pulseRate: student.pulseRate,
        temperature: student.temperature,
        respiratoryRate: student.respiratoryRate,
        notes: [...student.notes],
        recommendations: [...student.recommendations],
        hasAbnormality: student.hasAbnormality,
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...editData.notes];
    newNotes[index] = value;
    setEditData((prev) => ({
      ...prev,
      notes: newNotes,
    }));
  };

  const handleAddNote = () => {
    setEditData((prev) => ({
      ...prev,
      notes: [...prev.notes, ""],
    }));
  };

  const handleRemoveNote = (index) => {
    const newNotes = [...editData.notes];
    newNotes.splice(index, 1);
    setEditData((prev) => ({
      ...prev,
      notes: newNotes,
    }));
  };

  const handleRecommendationChange = (index, value) => {
    const newRecommendations = [...editData.recommendations];
    newRecommendations[index] = value;
    setEditData((prev) => ({
      ...prev,
      recommendations: newRecommendations,
    }));
  };

  const handleAddRecommendation = () => {
    setEditData((prev) => ({
      ...prev,
      recommendations: [...prev.recommendations, ""],
    }));
  };

  const handleRemoveRecommendation = (index) => {
    const newRecommendations = [...editData.recommendations];
    newRecommendations.splice(index, 1);
    setEditData((prev) => ({
      ...prev,
      recommendations: newRecommendations,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.height || editData.height <= 0)
      newErrors.height = "Chiều cao phải lớn hơn 0";

    if (!editData.weight || editData.weight <= 0)
      newErrors.weight = "Cân nặng phải lớn hơn 0";

    if (
      !editData.bloodPressure.systolic ||
      editData.bloodPressure.systolic < 60
    )
      newErrors["bloodPressure.systolic"] =
        "Huyết áp tâm thu phải lớn hơn hoặc bằng 60";

    if (
      !editData.bloodPressure.diastolic ||
      editData.bloodPressure.diastolic < 40
    )
      newErrors["bloodPressure.diastolic"] =
        "Huyết áp tâm trương phải lớn hơn hoặc bằng 40";

    if (!editData.pulseRate || editData.pulseRate < 40)
      newErrors.pulseRate = "Nhịp tim phải lớn hơn hoặc bằng 40";

    if (
      !editData.temperature ||
      editData.temperature < 35 ||
      editData.temperature > 42
    )
      newErrors.temperature = "Nhiệt độ phải nằm trong khoảng 35-42°C";

    if (!editData.respiratoryRate || editData.respiratoryRate < 10)
      newErrors.respiratoryRate = "Nhịp thở phải lớn hơn hoặc bằng 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;

    // Calculate BMI
    const bmi = calculateBMI(editData.height, editData.weight);

    // Update student data
    const updatedStudent = {
      ...student,
      height: editData.height,
      weight: editData.weight,
      bmi,
      vision: editData.vision,
      bloodPressure: {
        ...editData.bloodPressure,
        status:
          editData.bloodPressure.systolic > 120 ||
          editData.bloodPressure.diastolic > 80
            ? "Cao"
            : "Bình thường",
      },
      pulseRate: editData.pulseRate,
      temperature: editData.temperature,
      respiratoryRate: editData.respiratoryRate,
      notes: editData.notes,
      recommendations: editData.recommendations,
      hasAbnormality: editData.hasAbnormality,
    };

    setStudent(updatedStudent);
    setIsEditing(false);

    // Show success message
    alert("Đã cập nhật thông tin sức khỏe thành công!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const bmiStatus = getBmiStatus(
    isEditing ? calculateBMI(editData.height, editData.weight) : student.bmi
  );

  return (
    <div className="print:p-6">
      <div className="flex justify-between items-start mb-6 print:mb-8">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/nurse/health-check/${id}/results`)}
              className="mr-2 text-gray-600 hover:text-gray-900 print:hidden"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 print:text-3xl">
              Kết quả kiểm tra sức khỏe
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{student.name}</span> -{" "}
            {healthCheck.grade}
          </p>
          <p className="text-gray-600 mt-1">
            Ngày kiểm tra:{" "}
            {new Date(healthCheck.scheduledDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="flex space-x-2 print:hidden">
          {!isEditing && (
            <>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-primary-600 rounded-md text-primary-600 bg-white hover:bg-primary-50 flex items-center"
              >
                <FiPrinter className="mr-1" /> In kết quả
              </button>
              <button
                onClick={handleNotifyParent}
                className="px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              >
                <FiSend className="mr-1" /> Gửi cho phụ huynh
              </button>
            </>
          )}
          <button
            onClick={handleEditToggle}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              isEditing
                ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
            }`}
          >
            {isEditing ? (
              <>
                <FiX className="mr-1" /> Hủy
              </>
            ) : (
              <>
                <FiEdit className="mr-1" /> Chỉnh sửa
              </>
            )}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveChanges}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FiSave className="mr-1" /> Lưu thay đổi
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Student Information */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiUser className="mr-2 text-primary-500" /> Thông tin học sinh
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium">{student.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Giới tính</p>
              <p>{student.gender}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Ngày sinh</p>
              <p>{new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Lớp</p>
              <p>{student.class}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phụ huynh</p>
              <p>{student.parentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p>{student.parentPhone}</p>
            </div>
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiActivity className="mr-2 text-primary-500" /> Chỉ số cơ thể
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chiều cao</p>
                {isEditing ? (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="height"
                        value={editData.height}
                        onChange={handleInputChange}
                        className="mt-1 block w-24 rounded-md border border-gray-300 py-2 px-3 text-sm"
                      />
                      <span className="ml-2">cm</span>
                    </div>
                    {errors.height && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.height}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xl font-medium">{student.height} cm</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Cân nặng</p>
                {isEditing ? (
                  <div>
                    <div className="flex items-center justify-end">
                      <input
                        type="number"
                        name="weight"
                        value={editData.weight}
                        onChange={handleInputChange}
                        className="mt-1 block w-24 rounded-md border border-gray-300 py-2 px-3 text-sm text-right"
                      />
                      <span className="ml-2">kg</span>
                    </div>
                    {errors.weight && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.weight}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xl font-medium">{student.weight} kg</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">BMI</p>
                <p className={`text-sm font-medium ${bmiStatus.color}`}>
                  {bmiStatus.label}
                </p>
              </div>
              <p className="text-xl font-medium">
                {isEditing
                  ? calculateBMI(editData.height, editData.weight)
                  : student.bmi}
              </p>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${
                    bmiStatus.color === "text-green-600"
                      ? "bg-green-500"
                      : bmiStatus.color === "text-yellow-600"
                      ? "bg-yellow-500"
                      : bmiStatus.color === "text-orange-600"
                      ? "bg-orange-500"
                      : "bg-red-500"
                  } h-2 rounded-full`}
                  style={{
                    width: `${Math.min(
                      100,
                      ((isEditing
                        ? calculateBMI(editData.height, editData.weight)
                        : student.bmi) /
                        30) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Thị lực</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mắt trái</p>
                  {isEditing ? (
                    <select
                      name="vision.left"
                      value={editData.vision.left}
                      onChange={handleInputChange}
                      className="mt-1 block w-24 rounded-md border border-gray-300 py-2 px-3 text-sm"
                    >
                      <option value="6/6">6/6</option>
                      <option value="6/9">6/9</option>
                      <option value="6/12">6/12</option>
                      <option value="6/18">6/18</option>
                      <option value="6/24">6/24</option>
                      <option value="6/36">6/36</option>
                      <option value="6/60">6/60</option>
                    </select>
                  ) : (
                    <p className="font-medium">{student.vision.left}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Mắt phải</p>
                  {isEditing ? (
                    <select
                      name="vision.right"
                      value={editData.vision.right}
                      onChange={handleInputChange}
                      className="mt-1 block w-24 rounded-md border border-gray-300 py-2 px-3 text-sm"
                    >
                      <option value="6/6">6/6</option>
                      <option value="6/9">6/9</option>
                      <option value="6/12">6/12</option>
                      <option value="6/18">6/18</option>
                      <option value="6/24">6/24</option>
                      <option value="6/36">6/36</option>
                      <option value="6/60">6/60</option>
                    </select>
                  ) : (
                    <p className="font-medium">{student.vision.right}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <select
                  name="vision.status"
                  value={editData.vision.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Cần kiểm tra thêm">Cần kiểm tra thêm</option>
                  <option value="Cận thị nhẹ">Cận thị nhẹ</option>
                  <option value="Cận thị nặng">Cận thị nặng</option>
                </select>
              ) : (
                <p
                  className={`text-sm mt-1 ${
                    student.vision.status === "Bình thường"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {student.vision.status}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Huyết áp</p>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <div>
                    <input
                      type="number"
                      name="bloodPressure.systolic"
                      value={editData.bloodPressure.systolic}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border border-gray-300 py-2 px-3 text-sm"
                    />
                    {errors["bloodPressure.systolic"] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors["bloodPressure.systolic"]}
                      </p>
                    )}
                  </div>
                  <span>/</span>
                  <div>
                    <input
                      type="number"
                      name="bloodPressure.diastolic"
                      value={editData.bloodPressure.diastolic}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border border-gray-300 py-2 px-3 text-sm"
                    />
                    {errors["bloodPressure.diastolic"] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors["bloodPressure.diastolic"]}
                      </p>
                    )}
                  </div>
                  <span>mmHg</span>
                </div>
              ) : (
                <p className="font-medium">
                  {student.bloodPressure.systolic}/
                  {student.bloodPressure.diastolic} mmHg
                </p>
              )}
              <p
                className={`text-sm ${
                  student.bloodPressure.status === "Bình thường"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {student.bloodPressure.status}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Mạch</p>
                {isEditing ? (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="pulseRate"
                        value={editData.pulseRate}
                        onChange={handleInputChange}
                        className="mt-1 block w-20 rounded-md border border-gray-300 py-2 px-3 text-sm"
                      />
                      <span className="ml-1 text-xs">lần/phút</span>
                    </div>
                    {errors.pulseRate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.pulseRate}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{student.pulseRate} lần/phút</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhiệt độ</p>
                {isEditing ? (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="temperature"
                        value={editData.temperature}
                        onChange={handleInputChange}
                        className="mt-1 block w-20 rounded-md border border-gray-300 py-2 px-3 text-sm"
                        step="0.1"
                      />
                      <span className="ml-1">°C</span>
                    </div>
                    {errors.temperature && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.temperature}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{student.temperature}°C</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhịp thở</p>
                {isEditing ? (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="respiratoryRate"
                        value={editData.respiratoryRate}
                        onChange={handleInputChange}
                        className="mt-1 block w-20 rounded-md border border-gray-300 py-2 px-3 text-sm"
                      />
                      <span className="ml-1 text-xs">lần/phút</span>
                    </div>
                    {errors.respiratoryRate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.respiratoryRate}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">
                    {student.respiratoryRate} lần/phút
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiAlertCircle className="mr-2 text-primary-500" /> Đánh giá &
            Khuyến nghị
          </h2>

          {isEditing ? (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="hasAbnormality"
                  checked={editData.hasAbnormality}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      hasAbnormality: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
                <label
                  htmlFor="hasAbnormality"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Có dấu hiệu bất thường
                </label>
              </div>

              {editData.hasAbnormality && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-700 mb-2">
                    Ghi chú bất thường
                  </p>
                  {editData.notes.map((note, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) =>
                          handleNoteChange(index, e.target.value)
                        }
                        className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm"
                        placeholder="Nhập ghi chú"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNote(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Thêm ghi chú
                  </button>
                </div>
              )}
            </div>
          ) : (
            student.hasAbnormality && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm font-medium text-red-700">
                  Phát hiện bất thường
                </p>
                <ul className="mt-2 text-sm text-red-600 space-y-1">
                  {student.notes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              </div>
            )
          )}

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Khuyến nghị
            </p>

            {isEditing ? (
              <div>
                {editData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={rec}
                      onChange={(e) =>
                        handleRecommendationChange(index, e.target.value)
                      }
                      className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm"
                      placeholder="Nhập khuyến nghị"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRecommendation(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRecommendation}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Thêm khuyến nghị
                </button>
              </div>
            ) : (
              <ul className="space-y-1 text-sm text-gray-600">
                {student.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Lịch sử kiểm tra
            </p>
            <div className="space-y-3">
              {student.history.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 border border-gray-100 rounded-md"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FiCalendar className="mr-1" />
                    <span>
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{item.event}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className="mr-2">{item.height} cm</span>
                    <span className="mr-2">{item.weight} kg</span>
                    <span>BMI: {item.bmi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 mt-6 print:hidden">
        {!isEditing && (
          <Link
            to={`/nurse/health-check/${id}/results`}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Quay lại danh sách
          </Link>
        )}
      </div>
    </div>
  );
};

export default StudentHealthDetail;
