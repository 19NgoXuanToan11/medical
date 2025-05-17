import { useState } from "react";

const VaccinationConsent = () => {
  const [consentGiven, setConsentGiven] = useState(null);
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock data
  const studentInfo = {
    name: "Nguyễn Văn A",
    class: "Lớp 1A",
    dateOfBirth: "15/05/2017",
    parentName: "Nguyễn Văn B",
  };

  const vaccineInfo = {
    name: "Sởi-Rubella",
    date: "25/05/2023",
    location: "Phòng y tế trường Tiểu học XYZ",
    description:
      "Vaccine phòng bệnh Sởi và Rubella cho trẻ em trong độ tuổi tiểu học",
    sideEffects: "Có thể gây sốt nhẹ, đau tại chỗ tiêm trong vòng 24-48 giờ",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (consentGiven !== null && (consentGiven === false || signature)) {
      setSubmitted(true);
      // In a real app, this would send the data to the server
    } else {
      alert("Vui lòng ký tên nếu đồng ý cho con tiêm chủng");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {!submitted ? (
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              Phiếu đồng ý tiêm chủng
            </h1>
            <p className="text-gray-600">Trường Tiểu học XYZ</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin học sinh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên học sinh</p>
                <p className="font-medium">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lớp</p>
                <p className="font-medium">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-medium">{studentInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phụ huynh/Người giám hộ</p>
                <p className="font-medium">{studentInfo.parentName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin tiêm chủng</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Loại vaccine</p>
                <p className="font-medium">{vaccineInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tiêm dự kiến</p>
                <p className="font-medium">{vaccineInfo.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa điểm</p>
                <p className="font-medium">{vaccineInfo.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mô tả vaccine</p>
                <p>{vaccineInfo.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Tác dụng phụ có thể xảy ra
                </p>
                <p>{vaccineInfo.sideEffects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Xác nhận đồng ý</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">
                    Tôi, {studentInfo.parentName}, là phụ huynh/người giám hộ
                    của {studentInfo.name}:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="consent"
                        className="mr-2"
                        onChange={() => setConsentGiven(true)}
                        checked={consentGiven === true}
                      />
                      <span>
                        Đồng ý cho con tôi được tiêm vaccine {vaccineInfo.name}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="consent"
                        className="mr-2"
                        onChange={() => setConsentGiven(false)}
                        checked={consentGiven === false}
                      />
                      <span>Không đồng ý cho con tôi tiêm vaccine này</span>
                    </label>
                  </div>
                </div>

                {consentGiven === true && (
                  <div>
                    <p className="mb-2">Tôi xác nhận rằng:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tôi đã đọc và hiểu thông tin về vaccine.</li>
                      <li>Con tôi không có tiền sử dị ứng với vaccine này.</li>
                      <li>
                        Tôi đồng ý cho phép nhà trường và nhân viên y tế tiến
                        hành tiêm chủng cho con tôi.
                      </li>
                    </ul>
                  </div>
                )}

                {consentGiven === false && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-yellow-700">
                      Bạn đã chọn không đồng ý cho con tiêm chủng. Vui lòng nhấn
                      "Xác nhận" để hoàn tất.
                    </p>
                  </div>
                )}

                {consentGiven === true && (
                  <div>
                    <label className="block font-medium mb-2">
                      Chữ ký điện tử (gõ họ tên đầy đủ của bạn)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Nhập họ tên đầy đủ của bạn"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn!</h2>
          <p className="text-gray-600 mb-6">
            {consentGiven
              ? `Bạn đã đồng ý cho ${studentInfo.name} tham gia tiêm chủng vaccine ${vaccineInfo.name} vào ngày ${vaccineInfo.date}.`
              : `Bạn đã xác nhận không đồng ý cho ${studentInfo.name} tham gia tiêm chủng.`}
          </p>
          <p className="text-sm text-gray-500">
            Thông tin này đã được gửi đến nhà trường. Bạn có thể đóng trang này.
          </p>
        </div>
      )}
    </div>
  );
};

export default VaccinationConsent;
