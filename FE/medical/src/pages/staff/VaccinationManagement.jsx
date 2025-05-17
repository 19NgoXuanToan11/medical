import { useState } from "react";
import { Link } from "react-router-dom";
import "./VaccinationManagement.css";

const VaccinationManagement = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [vaccinationType, setVaccinationType] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const classes = ["Lớp 1A", "Lớp 1B", "Lớp 2A", "Lớp 2B", "Lớp 3A"];
  const vaccineTypes = ["Sởi-Rubella", "Bại liệt", "Viêm gan B", "BCG", "DPT"];

  const mockStudents = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      class: "Lớp 1A",
      parentConsent: false,
      vaccinated: false,
      reaction: null,
    },
    {
      id: 2,
      name: "Trần Thị B",
      class: "Lớp 1A",
      parentConsent: false,
      vaccinated: false,
      reaction: null,
    },
    {
      id: 3,
      name: "Lê Văn C",
      class: "Lớp 1B",
      parentConsent: false,
      vaccinated: false,
      reaction: null,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      class: "Lớp 2A",
      parentConsent: false,
      vaccinated: false,
      reaction: null,
    },
  ];

  // Load students when class is selected
  const handleClassSelection = (className) => {
    setSelectedClass(className);
    const filteredStudents = mockStudents.filter(
      (student) => student.class === className
    );
    setStudentList(filteredStudents);
  };

  // Send notifications to parents
  const sendNotifications = () => {
    if (!selectedClass || !vaccinationType || !vaccinationDate) {
      alert(
        "Vui lòng chọn đầy đủ thông tin lớp học, loại vaccine và ngày tiêm chủng"
      );
      return;
    }

    // In a real application, this would send actual notifications
    setNotificationSent(true);

    // Move to next step after sending notifications
    setActiveStep(2);
  };

  // Update parent consent status
  const updateParentConsent = (studentId, consented) => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        student.id === studentId
          ? { ...student, parentConsent: consented }
          : student
      )
    );
  };

  // Prepare vaccination list based on parent consent
  const prepareVaccinationList = () => {
    // In a real app, this might involve additional steps
    setActiveStep(3);
  };

  // Record vaccination results
  const recordVaccination = (studentId, status, reactionNotes = null) => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        student.id === studentId
          ? { ...student, vaccinated: status, reaction: reactionNotes }
          : student
      )
    );
  };

  // Complete vaccination process and move to post-vaccination monitoring
  const completeVaccination = () => {
    setActiveStep(4);
  };

  // Filter students based on search term
  const filteredStudents = studentList.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Quản lý tiêm chủng tại trường
      </h1>

      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        <div className={`step-item ${activeStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-title">Gửi phiếu thông báo</div>
        </div>
        <div className="h-px bg-gray-300 flex-1 self-center mx-2"></div>
        <div className={`step-item ${activeStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-title">Chuẩn bị danh sách</div>
        </div>
        <div className="h-px bg-gray-300 flex-1 self-center mx-2"></div>
        <div className={`step-item ${activeStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-title">Tiêm chủng</div>
        </div>
        <div className="h-px bg-gray-300 flex-1 self-center mx-2"></div>
        <div className={`step-item ${activeStep >= 4 ? "active" : ""}`}>
          <div className="step-number">4</div>
          <div className="step-title">Theo dõi sau tiêm</div>
        </div>
      </div>

      {/* Step 1: Send notification forms */}
      {activeStep === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Gửi phiếu thông báo đồng ý tiêm chủng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn lớp học
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClass}
                onChange={(e) => handleClassSelection(e.target.value)}
              >
                <option value="">-- Chọn lớp --</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại vaccine
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={vaccinationType}
                onChange={(e) => setVaccinationType(e.target.value)}
              >
                <option value="">-- Chọn loại vaccine --</option>
                {vaccineTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tiêm chủng
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={vaccinationDate}
                onChange={(e) => setVaccinationDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung thông báo
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Nhập nội dung thông báo cho phụ huynh..."
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={sendNotifications}
            >
              Gửi thông báo cho phụ huynh
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Prepare student list */}
      {activeStep === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Chuẩn bị danh sách học sinh tiêm chủng
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm học sinh
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">STT</th>
                  <th className="py-2 px-4 border-b">Họ và tên</th>
                  <th className="py-2 px-4 border-b">Lớp</th>
                  <th className="py-2 px-4 border-b">Phụ huynh đồng ý</th>
                  <th className="py-2 px-4 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{student.name}</td>
                    <td className="py-2 px-4 border-b">{student.class}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <select
                        className={`p-1 rounded-md ${
                          student.parentConsent === true
                            ? "bg-green-100 text-green-800"
                            : student.parentConsent === false
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100"
                        }`}
                        value={
                          student.parentConsent === true
                            ? "yes"
                            : student.parentConsent === false
                            ? "no"
                            : ""
                        }
                        onChange={(e) =>
                          updateParentConsent(
                            student.id,
                            e.target.value === "yes"
                          )
                        }
                      >
                        <option value="">Chưa phản hồi</option>
                        <option value="yes">Đồng ý</option>
                        <option value="no">Không đồng ý</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button className="text-blue-600 hover:underline">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => setActiveStep(1)}
            >
              Quay lại
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={prepareVaccinationList}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Vaccination process */}
      {activeStep === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Tiêm chủng và ghi nhận kết quả
          </h2>

          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <p>
              <strong>Lớp:</strong> {selectedClass}
            </p>
            <p>
              <strong>Loại vaccine:</strong> {vaccinationType}
            </p>
            <p>
              <strong>Ngày tiêm:</strong> {vaccinationDate}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">STT</th>
                  <th className="py-2 px-4 border-b">Họ và tên</th>
                  <th className="py-2 px-4 border-b">Phụ huynh đồng ý</th>
                  <th className="py-2 px-4 border-b">Đã tiêm</th>
                  <th className="py-2 px-4 border-b">Phản ứng sau tiêm</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents
                  .filter((student) => student.parentConsent === true)
                  .map((student, index) => (
                    <tr key={student.id}>
                      <td className="py-2 px-4 border-b text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b">{student.name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Đã đồng ý
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <select
                          className={`p-1 rounded-md ${
                            student.vaccinated
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100"
                          }`}
                          value={student.vaccinated ? "yes" : "no"}
                          onChange={(e) =>
                            recordVaccination(
                              student.id,
                              e.target.value === "yes"
                            )
                          }
                        >
                          <option value="no">Chưa tiêm</option>
                          <option value="yes">Đã tiêm</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          placeholder="Ghi chú phản ứng (nếu có)"
                          disabled={!student.vaccinated}
                          value={student.reaction || ""}
                          onChange={(e) =>
                            recordVaccination(student.id, true, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => setActiveStep(2)}
            >
              Quay lại
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={completeVaccination}
            >
              Hoàn thành tiêm chủng
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Post-vaccination monitoring */}
      {activeStep === 4 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Theo dõi sau tiêm</h2>

          <div className="mb-6">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-700">
                <strong>Lưu ý:</strong> Theo dõi học sinh trong vòng 30 phút sau
                tiêm và báo cáo bất kỳ phản ứng bất thường.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">STT</th>
                  <th className="py-2 px-4 border-b">Họ và tên</th>
                  <th className="py-2 px-4 border-b">Thời gian tiêm</th>
                  <th className="py-2 px-4 border-b">Phản ứng</th>
                  <th className="py-2 px-4 border-b">Tình trạng</th>
                  <th className="py-2 px-4 border-b">Ghi chú bổ sung</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents
                  .filter((student) => student.vaccinated)
                  .map((student, index) => (
                    <tr key={student.id}>
                      <td className="py-2 px-4 border-b text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b">{student.name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        10:30 AM
                      </td>
                      <td className="py-2 px-4 border-b">
                        {student.reaction || "Không có"}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <select className="p-1 rounded-md bg-green-100 text-green-800">
                          <option value="normal">Bình thường</option>
                          <option value="minor">Phản ứng nhẹ</option>
                          <option value="severe">Phản ứng nặng</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          placeholder="Ghi chú bổ sung"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Báo cáo tổng hợp</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-md">
                <p className="text-sm text-gray-500">
                  Tổng số học sinh đã tiêm
                </p>
                <p className="text-2xl font-bold">
                  {filteredStudents.filter((s) => s.vaccinated).length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-gray-500">Có phản ứng nhẹ</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-4 bg-red-50 rounded-md">
                <p className="text-sm text-gray-500">Có phản ứng nặng</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => setActiveStep(3)}
            >
              Quay lại
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Hoàn thành và xuất báo cáo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement;
