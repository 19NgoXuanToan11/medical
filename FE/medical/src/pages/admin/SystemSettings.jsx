import React, { useState } from "react";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: "Trường Tiểu học Hoàng Diệu",
    schoolEmail: "hoangdieu@example.edu.vn",
    schoolPhone: "028 1234 5678",
    schoolAddress: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
    academicYear: "2023-2024",
    termDates: "01/09/2023 - 31/05/2024",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appNotifications: true,
    emergencyNotifications: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionPeriod: "3",
    allowParentAccess: true,
    requireConsentForScreening: true,
    anonymousReporting: false,
    shareDataWithAuthorities: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // In a real app, this would save settings to the server
    alert("Cài đặt đã được lưu thành công!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
        <p className="text-gray-600">
          Quản lý cài đặt và cấu hình hệ thống y tế trường học
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "general"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "notifications"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông báo
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "privacy"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Quyền riêng tư & Bảo mật
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "backup"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sao lưu & Phục hồi
          </button>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên trường
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={generalSettings.schoolName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email trường
                    </label>
                    <input
                      type="email"
                      name="schoolEmail"
                      value={generalSettings.schoolEmail}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="schoolPhone"
                      value={generalSettings.schoolPhone}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ trường
                  </label>
                  <input
                    type="text"
                    name="schoolAddress"
                    value={generalSettings.schoolAddress}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm học
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={generalSettings.academicYear}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian năm học
                    </label>
                    <input
                      type="text"
                      name="termDates"
                      value={generalSettings.termDates}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Kênh thông báo
                </h3>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Thông báo qua email
                    </label>
                    <p className="text-gray-500">
                      Gửi thông báo về sức khỏe học sinh qua email
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Thông báo qua SMS
                    </label>
                    <p className="text-gray-500">
                      Gửi thông báo khẩn cấp về sức khỏe học sinh qua SMS
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="appNotifications"
                      checked={notificationSettings.appNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Thông báo trong ứng dụng
                    </label>
                    <p className="text-gray-500">
                      Hiển thị thông báo trong ứng dụng
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="emergencyNotifications"
                      checked={notificationSettings.emergencyNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Thông báo khẩn cấp
                    </label>
                    <p className="text-gray-500">
                      Gửi thông báo khẩn cấp qua tất cả các kênh khi có sự cố y
                      tế
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-700 mb-4 pt-4">
                  Báo cáo tự động
                </h3>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="dailyReports"
                      checked={notificationSettings.dailyReports}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Báo cáo hàng ngày
                    </label>
                    <p className="text-gray-500">
                      Gửi báo cáo tổng hợp hàng ngày
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="weeklyReports"
                      checked={notificationSettings.weeklyReports}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Báo cáo hàng tuần
                    </label>
                    <p className="text-gray-500">
                      Gửi báo cáo tổng hợp hàng tuần
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="monthlyReports"
                      checked={notificationSettings.monthlyReports}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Báo cáo hàng tháng
                    </label>
                    <p className="text-gray-500">
                      Gửi báo cáo tổng hợp hàng tháng
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian lưu trữ dữ liệu (năm)
                  </label>
                  <select
                    name="dataRetentionPeriod"
                    value={privacySettings.dataRetentionPeriod}
                    onChange={handlePrivacyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1 năm</option>
                    <option value="2">2 năm</option>
                    <option value="3">3 năm</option>
                    <option value="5">5 năm</option>
                    <option value="10">10 năm</option>
                  </select>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="allowParentAccess"
                      checked={privacySettings.allowParentAccess}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Cho phép phụ huynh truy cập
                    </label>
                    <p className="text-gray-500">
                      Cho phép phụ huynh xem toàn bộ dữ liệu y tế của con
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="requireConsentForScreening"
                      checked={privacySettings.requireConsentForScreening}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Yêu cầu đồng ý kiểm tra y tế
                    </label>
                    <p className="text-gray-500">
                      Yêu cầu phụ huynh đồng ý trước khi thực hiện kiểm tra y tế
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="anonymousReporting"
                      checked={privacySettings.anonymousReporting}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Báo cáo ẩn danh
                    </label>
                    <p className="text-gray-500">
                      Ẩn thông tin cá nhân trong các báo cáo thống kê
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="shareDataWithAuthorities"
                      checked={privacySettings.shareDataWithAuthorities}
                      onChange={handlePrivacyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      Chia sẻ dữ liệu với cơ quan y tế
                    </label>
                    <p className="text-gray-500">
                      Cho phép chia sẻ dữ liệu thống kê với cơ quan y tế địa
                      phương
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Backup Settings */}
          {activeTab === "backup" && (
            <div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Đảm bảo sao lưu dữ liệu thường xuyên để tránh mất mát dữ
                      liệu quan trọng.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Sao lưu dữ liệu thủ công
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Tạo một bản sao lưu ngay lập tức của tất cả dữ liệu trong hệ
                    thống.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Tạo bản sao lưu
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Sao lưu dữ liệu tự động
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Cấu hình tần suất sao lưu dữ liệu tự động.
                  </p>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4">
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="biweekly">Hai tuần một lần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Lưu cài đặt
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Phục hồi dữ liệu
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Phục hồi dữ liệu từ bản sao lưu trước đó.
                </p>
                <div className="border border-gray-200 rounded-md mb-4">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        backup_18052023_083045.zip
                      </span>
                      <p className="text-xs text-gray-500">
                        18/05/2023 08:30:45 • 45.2 MB
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                      Phục hồi
                    </button>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        backup_17052023_083045.zip
                      </span>
                      <p className="text-xs text-gray-500">
                        17/05/2023 08:30:45 • 44.8 MB
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                      Phục hồi
                    </button>
                  </div>
                  <div className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        backup_16052023_083045.zip
                      </span>
                      <p className="text-xs text-gray-500">
                        16/05/2023 08:30:45 • 44.5 MB
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                      Phục hồi
                    </button>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Xem tất cả bản sao lưu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
