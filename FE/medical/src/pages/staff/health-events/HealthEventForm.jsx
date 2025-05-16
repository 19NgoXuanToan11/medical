import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "../../../components/FormInput";

const HealthEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    class: "",
    eventType: "",
    eventDate: new Date().toISOString().slice(0, 16),
    description: "",
    severity: "minor",
    location: "",
    treatedBy: "",
    treatment: "",
    notifyParent: true,
    parentNotificationMethod: "phone",
    parentResponse: "",
    status: "monitoring",
    followUp: "",
    attachments: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Mock student data - in a real app this would come from an API
  const mockStudents = [
    { id: "ST123456", name: "Nguyễn Văn An", class: "3A" },
    { id: "ST123789", name: "Trần Minh Đức", class: "5B" },
    { id: "ST128456", name: "Lê Thị Hoa", class: "2C" },
    { id: "ST145236", name: "Phạm Tuấn Anh", class: "4A" },
    { id: "ST162345", name: "Ngô Gia Huy", class: "1B" },
  ];

  // Mock event data for edit mode
  const mockEvent = {
    id: "EV123456",
    studentName: "Nguyễn Văn An",
    studentId: "ST123456",
    class: "3A",
    eventType: "accident",
    eventDate: "2023-10-15T09:30:00",
    description: "Té ngã ở sân chơi, bị trầy xước đầu gối",
    status: "monitoring",
    severity: "minor",
    location: "Sân chơi",
    treatedBy: "Nguyễn Thị Hương",
    treatment: "Vệ sinh vết thương, băng vết thương nhẹ",
    notifyParent: true,
    parentNotificationMethod: "phone",
    parentResponse: "Đã thông báo, phụ huynh ghi nhận",
    followUp: "Kiểm tra lại vào ngày mai",
    attachments: [],
  };

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the event data from an API
      setFormData({
        ...mockEvent,
        eventDate: mockEvent.eventDate.slice(0, 16),
      });
    }
  }, [isEditMode, id]);

  // Handle student search
  useEffect(() => {
    if (studentSearchTerm.trim().length > 0) {
      const filteredStudents = mockStudents.filter(
        (student) =>
          student.name
            .toLowerCase()
            .includes(studentSearchTerm.toLowerCase()) ||
          student.id.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(studentSearchTerm.toLowerCase())
      );
      setStudentResults(filteredStudents);
      setShowStudentDropdown(true);
    } else {
      setShowStudentDropdown(false);
    }
  }, [studentSearchTerm]);

  // Handle student selection
  const handleStudentSelect = (student) => {
    setFormData({
      ...formData,
      studentId: student.id,
      studentName: student.name,
      class: student.class,
    });
    setStudentSearchTerm(student.name);
    setShowStudentDropdown(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for the field being updated
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.studentId) errors.studentId = "Vui lòng chọn học sinh";
    if (!formData.eventType) errors.eventType = "Vui lòng chọn loại sự kiện";
    if (!formData.eventDate) errors.eventDate = "Vui lòng nhập thời gian";
    if (!formData.description) errors.description = "Vui lòng nhập mô tả";
    if (!formData.location) errors.location = "Vui lòng nhập địa điểm";
    if (!formData.severity) errors.severity = "Vui lòng chọn mức độ";
    if (!formData.treatedBy) errors.treatedBy = "Vui lòng nhập người xử lý";

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would send the form data to an API
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      navigate("/staff/health-events");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Cập nhật sự kiện y tế" : "Ghi nhận sự kiện y tế mới"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Thông tin học sinh
            </h2>
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm học sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border ${
                  formErrors.studentId ? "border-red-300" : "border-gray-300"
                } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Nhập tên, ID hoặc lớp học sinh..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
              />
              {formErrors.studentId && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.studentId}
                </p>
              )}

              {showStudentDropdown && studentResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {studentResults.map((student) => (
                    <div
                      key={student.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {student.id} - Lớp: {student.class}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.studentId && (
              <div className="p-4 bg-blue-50 rounded-md mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{formData.studentName}</h3>
                    <p className="text-sm text-gray-600">
                      ID: {formData.studentId} - Lớp: {formData.class}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        studentId: "",
                        studentName: "",
                        class: "",
                      });
                      setStudentSearchTerm("");
                    }}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Thông tin sự kiện
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="eventType"
                name="eventType"
                label="Loại sự kiện"
                type="select"
                value={formData.eventType}
                onChange={handleChange}
                required={true}
                error={formErrors.eventType}
                options={[
                  { value: "accident", label: "Tai nạn" },
                  { value: "illness", label: "Ốm đau" },
                  { value: "injury", label: "Chấn thương" },
                  { value: "disease", label: "Dịch bệnh" },
                  { value: "other", label: "Khác" },
                ]}
              />

              <FormInput
                id="eventDate"
                name="eventDate"
                label="Thời gian xảy ra"
                type="datetime-local"
                value={formData.eventDate}
                onChange={handleChange}
                required={true}
                error={formErrors.eventDate}
              />

              <FormInput
                id="location"
                name="location"
                label="Địa điểm"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required={true}
                placeholder="Nơi xảy ra sự kiện..."
                error={formErrors.location}
              />

              <FormInput
                id="severity"
                name="severity"
                label="Mức độ"
                type="select"
                value={formData.severity}
                onChange={handleChange}
                required={true}
                error={formErrors.severity}
                options={[
                  { value: "minor", label: "Nhẹ" },
                  { value: "moderate", label: "Trung bình" },
                  { value: "major", label: "Nặng" },
                ]}
              />
            </div>

            <div className="mt-4">
              <FormInput
                id="description"
                name="description"
                label="Mô tả sự kiện"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                required={true}
                placeholder="Mô tả chi tiết về sự kiện y tế..."
                error={formErrors.description}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Xử lý và điều trị
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="treatedBy"
                name="treatedBy"
                label="Người xử lý"
                type="text"
                value={formData.treatedBy}
                onChange={handleChange}
                required={true}
                placeholder="Nhân viên y tế xử lý..."
                error={formErrors.treatedBy}
              />

              <FormInput
                id="status"
                name="status"
                label="Trạng thái"
                type="select"
                value={formData.status}
                onChange={handleChange}
                required={true}
                error={formErrors.status}
                options={[
                  { value: "urgent", label: "Khẩn cấp" },
                  { value: "monitoring", label: "Đang theo dõi" },
                  { value: "resolved", label: "Đã xử lý" },
                ]}
              />
            </div>

            <div className="mt-4">
              <FormInput
                id="treatment"
                name="treatment"
                label="Biện pháp xử lý và điều trị"
                type="textarea"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Mô tả biện pháp xử lý và điều trị..."
                error={formErrors.treatment}
              />
            </div>

            <div className="mt-4">
              <FormInput
                id="followUp"
                name="followUp"
                label="Theo dõi và tái khám"
                type="textarea"
                value={formData.followUp}
                onChange={handleChange}
                placeholder="Hướng dẫn theo dõi và tái khám (nếu có)..."
                error={formErrors.followUp}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Thông báo cho phụ huynh
            </h2>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  id="notifyParent"
                  name="notifyParent"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={formData.notifyParent}
                  onChange={handleChange}
                />
                <label
                  htmlFor="notifyParent"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Thông báo cho phụ huynh
                </label>
              </div>
            </div>

            {formData.notifyParent && (
              <>
                <div className="mb-4">
                  <FormInput
                    id="parentNotificationMethod"
                    name="parentNotificationMethod"
                    label="Phương thức thông báo"
                    type="select"
                    value={formData.parentNotificationMethod}
                    onChange={handleChange}
                    required={formData.notifyParent}
                    error={formErrors.parentNotificationMethod}
                    options={[
                      { value: "phone", label: "Điện thoại" },
                      { value: "sms", label: "Tin nhắn SMS" },
                      { value: "app", label: "Thông báo qua ứng dụng" },
                      { value: "email", label: "Email" },
                      { value: "other", label: "Phương thức khác" },
                    ]}
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    id="parentResponse"
                    name="parentResponse"
                    label="Phản hồi của phụ huynh"
                    type="textarea"
                    value={formData.parentResponse}
                    onChange={handleChange}
                    placeholder="Ghi nhận phản hồi của phụ huynh..."
                    error={formErrors.parentResponse}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Tài liệu đính kèm
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đính kèm hình ảnh, tài liệu
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Chọn tệp đính kèm
                    </p>
                  </div>
                  <input
                    type="file"
                    name="attachments"
                    className="opacity-0"
                    multiple
                    onChange={handleChange}
                  />
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center"
                    >
                      <span className="truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          const newAttachments = [...formData.attachments];
                          newAttachments.splice(index, 1);
                          setFormData({
                            ...formData,
                            attachments: newAttachments,
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
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
                </span>
              ) : isEditMode ? (
                "Cập nhật"
              ) : (
                "Lưu thông tin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthEventForm;
