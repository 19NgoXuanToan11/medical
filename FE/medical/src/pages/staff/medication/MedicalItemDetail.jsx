import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const MedicalItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call to get item details
    setTimeout(() => {
      // Find the item with matching ID
      const mockItem = {
        id: "SUP001",
        name: "Băng gạc vô trùng",
        category: "supply",
        currentQuantity: 45,
        unit: "gói",
        minQuantity: 10,
        expiryDate: "2026-12-31",
        location: "Tủ Y tế 1",
        lastUpdated: "2023-11-12",
        supplier: "Công ty Thiết bị Y tế 123",
        description: "Băng gạc y tế vô trùng đóng gói riêng",
        batchNumber: "BG20230512",
        purchasePrice: "15000",
        dateReceived: "2023-11-01",
        imageUrl: "https://example.com/images/bandage.jpg",
      };

      setItem(mockItem);

      // Simulate API call to get transaction history for this item
      const mockTransactions = [
        {
          id: "TRX001",
          date: "2023-11-01T09:30:00",
          type: "in",
          quantity: 50,
          reason: "purchase",
          notes: "Nhập kho lần đầu",
          staffName: "Nguyễn Thị Tâm",
        },
        {
          id: "TRX003",
          date: "2023-11-16T14:20:00",
          type: "out",
          quantity: 2,
          reason: "used",
          studentId: "ST002",
          studentName: "Trần Thị Bình",
          studentClass: "5B",
          notes: "Bị trầy xước nhẹ ở đầu gối",
          staffName: "Nguyễn Thị Tâm",
        },
        {
          id: "TRX006",
          date: "2023-11-18T13:30:00",
          type: "out",
          quantity: 3,
          reason: "event",
          eventId: "EVT001",
          eventName: "Khám sức khỏe định kỳ lớp 1A",
          notes: "",
          staffName: "Nguyễn Thị Tâm",
        },
      ];

      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Format datetime for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate remaining days until expiry
  const getRemainingDays = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const expiryDate = new Date(dateString);
    const timeDiff = expiryDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      // In a real application, this would be an API call to delete the item
      console.log("Deleting item with ID:", id);

      // Simulate API call
      setTimeout(() => {
        navigate("/staff/medication/inventory");
      }, 1000);
    }
  };

  // Get category name
  const getCategoryName = (category) => {
    switch (category) {
      case "medicine":
        return "Thuốc";
      case "supply":
        return "Vật tư tiêu hao";
      case "equipment":
        return "Thiết bị y tế";
      default:
        return category;
    }
  };

  // Get transaction type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "in":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Nhập kho
          </span>
        );
      case "out":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Xuất kho
          </span>
        );
      default:
        return null;
    }
  };

  // Get reason text
  const getReasonText = (transaction) => {
    const reasonMap = {
      purchase: "Mua mới",
      donation: "Được tặng",
      return: "Trả lại",
      transfer: "Chuyển kho",
      used: `Cấp phát cho học sinh${
        transaction.studentName ? `: ${transaction.studentName}` : ""
      }`,
      expired: "Hết hạn",
      damaged: "Hỏng/Vỡ",
      event: `Sự kiện y tế${
        transaction.eventName ? `: ${transaction.eventName}` : ""
      }`,
    };

    return reasonMap[transaction.reason] || transaction.reason;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link
          to="/staff/medication/inventory"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : item ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Item details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-800">
                  Chi tiết sản phẩm
                </h1>
                <div className="flex space-x-2">
                  <Link
                    to={`/staff/medication/inventory/edit/${id}`}
                    className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa
                  </Link>
                  <Link
                    to={`/staff/medication/inventory/transaction/${id}`}
                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md shadow-sm hover:bg-green-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                    Nhập/Xuất
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md shadow-sm hover:bg-red-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">ID</p>
                    <p className="text-base text-gray-900">{item.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Tên sản phẩm
                    </p>
                    <p className="text-base text-gray-900">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Loại
                    </p>
                    <p className="text-base text-gray-900">
                      {getCategoryName(item.category)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Mô tả
                    </p>
                    <p className="text-base text-gray-900">
                      {item.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Số lượng hiện tại
                    </p>
                    <p className="text-base text-gray-900 font-medium">
                      {item.currentQuantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Số lượng tối thiểu
                    </p>
                    <p className="text-base text-gray-900">
                      {item.minQuantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Vị trí
                    </p>
                    <p className="text-base text-gray-900">{item.location}</p>
                  </div>
                  {item.category !== "equipment" && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Hạn sử dụng
                      </p>
                      <div>
                        <p className="text-base text-gray-900">
                          {formatDate(item.expiryDate)}
                        </p>
                        {getRemainingDays(item.expiryDate) < 30 &&
                          getRemainingDays(item.expiryDate) >= 0 && (
                            <p className="text-sm text-yellow-600">
                              Còn {getRemainingDays(item.expiryDate)} ngày
                            </p>
                          )}
                        {getRemainingDays(item.expiryDate) < 0 && (
                          <p className="text-sm text-red-600">Đã hết hạn</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Cập nhật lần cuối
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(item.lastUpdated)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Nhà cung cấp
                    </p>
                    <p className="text-base text-gray-900">
                      {item.supplier || "Không có thông tin"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Số lô
                    </p>
                    <p className="text-base text-gray-900">
                      {item.batchNumber || "Không có thông tin"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Giá mua
                    </p>
                    <p className="text-base text-gray-900">
                      {item.purchasePrice
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.purchasePrice)
                        : "Không có thông tin"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Ngày nhập
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(item.dateReceived)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent transactions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                <h2 className="text-lg font-medium text-blue-800">
                  Lịch sử giao dịch gần đây
                </h2>
                <Link
                  to={`/staff/medication/inventory/history?itemId=${id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Chưa có giao dịch nào
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mã giao dịch
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày giờ
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Loại
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Số lượng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Lý do
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Người thực hiện
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTypeBadge(transaction.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.type === "in" ? "+" : "-"}
                            {transaction.quantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getReasonText(transaction)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.staffName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Item status card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h2 className="text-lg font-medium text-blue-800">
                  Trạng thái sản phẩm
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Tình trạng tồn kho
                  </h3>
                  {item.currentQuantity <= 0 ? (
                    <div className="px-4 py-3 bg-red-50 text-red-700 rounded-md">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Hết hàng</span>
                      </div>
                    </div>
                  ) : item.currentQuantity <= item.minQuantity ? (
                    <div className="px-4 py-3 bg-yellow-50 text-yellow-700 rounded-md">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">
                          Sắp hết hàng (dưới ngưỡng tối thiểu)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-green-50 text-green-700 rounded-md">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Còn hàng</span>
                      </div>
                    </div>
                  )}
                </div>

                {item.category !== "equipment" && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Tình trạng hạn sử dụng
                    </h3>
                    {getRemainingDays(item.expiryDate) < 0 ? (
                      <div className="px-4 py-3 bg-red-50 text-red-700 rounded-md">
                        <div className="flex">
                          <svg
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">Đã hết hạn</span>
                        </div>
                      </div>
                    ) : getRemainingDays(item.expiryDate) < 30 ? (
                      <div className="px-4 py-3 bg-yellow-50 text-yellow-700 rounded-md">
                        <div className="flex">
                          <svg
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            Sắp hết hạn (còn {getRemainingDays(item.expiryDate)}{" "}
                            ngày)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-green-50 text-green-700 rounded-md">
                        <div className="flex">
                          <svg
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            Còn hạn (còn {getRemainingDays(item.expiryDate)}{" "}
                            ngày)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Tác vụ nhanh
                  </h3>
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={`/staff/medication/inventory/transaction/${id}?type=in`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      Nhập kho
                    </Link>
                    <Link
                      to={`/staff/medication/inventory/transaction/${id}?type=out`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        />
                      </svg>
                      Xuất kho
                    </Link>
                    <Link
                      to={`/staff/medication/inventory/edit/${id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa thông tin
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product image if available */}
            {item.imageUrl && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <h2 className="text-lg font-medium text-blue-800">
                    Hình ảnh sản phẩm
                  </h2>
                </div>
                <div className="p-6">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
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
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/staff/medication/inventory"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </Link>
        </div>
      )}
    </div>
  );
};

export default MedicalItemDetail;
