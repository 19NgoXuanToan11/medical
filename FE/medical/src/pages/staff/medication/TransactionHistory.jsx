import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTransactions([
        {
          id: "TRX001",
          date: "2023-11-15T09:30:00",
          type: "in",
          itemId: "MED001",
          itemName: "Paracetamol 500mg",
          category: "medicine",
          quantity: 100,
          unit: "viên",
          reason: "purchase",
          notes: "Bổ sung kho thuốc",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX002",
          date: "2023-11-16T10:15:00",
          type: "out",
          itemId: "MED001",
          itemName: "Paracetamol 500mg",
          category: "medicine",
          quantity: 5,
          unit: "viên",
          reason: "used",
          studentId: "ST001",
          studentName: "Nguyễn Văn An",
          studentClass: "3A",
          notes: "Sốt nhẹ",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX003",
          date: "2023-11-16T14:20:00",
          type: "out",
          itemId: "SUP001",
          itemName: "Băng gạc vô trùng",
          category: "supply",
          quantity: 2,
          unit: "gói",
          reason: "used",
          studentId: "ST002",
          studentName: "Trần Thị Bình",
          studentClass: "5B",
          notes: "Bị trầy xước nhẹ ở đầu gối",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX004",
          date: "2023-11-17T08:45:00",
          type: "in",
          itemId: "SUP002",
          itemName: "Cồn y tế 70%",
          category: "supply",
          quantity: 10,
          unit: "chai",
          reason: "purchase",
          notes: "",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX005",
          date: "2023-11-18T13:10:00",
          type: "out",
          itemId: "MED001",
          itemName: "Paracetamol 500mg",
          category: "medicine",
          quantity: 15,
          unit: "viên",
          reason: "event",
          eventId: "EVT001",
          eventName: "Khám sức khỏe định kỳ lớp 1A",
          notes: "Dự phòng cho học sinh sốt sau khám",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX006",
          date: "2023-11-18T13:30:00",
          type: "out",
          itemId: "SUP001",
          itemName: "Băng gạc vô trùng",
          category: "supply",
          quantity: 5,
          unit: "gói",
          reason: "event",
          eventId: "EVT001",
          eventName: "Khám sức khỏe định kỳ lớp 1A",
          notes: "",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX007",
          date: "2023-11-19T09:20:00",
          type: "out",
          itemId: "MED003",
          itemName: "Thuốc ho Bảo Thanh",
          category: "medicine",
          quantity: 1,
          unit: "chai",
          reason: "used",
          studentId: "ST003",
          studentName: "Lê Hoàng Cường",
          studentClass: "1A",
          notes: "Ho nhẹ",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX008",
          date: "2023-11-20T11:05:00",
          type: "out",
          itemId: "SUP002",
          itemName: "Cồn y tế 70%",
          category: "supply",
          quantity: 1,
          unit: "chai",
          reason: "damaged",
          notes: "Chai bị vỡ khi sử dụng",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
        {
          id: "TRX009",
          date: "2023-11-20T15:30:00",
          type: "in",
          itemId: "MED002",
          itemName: "Vitamin C 1000mg",
          category: "medicine",
          quantity: 50,
          unit: "viên",
          reason: "purchase",
          notes: "Bổ sung kho thuốc",
          staffName: "Nguyễn Thị Tâm",
          staffPosition: "Y tá trường",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search term (item name or transaction ID)
    const matchesSearch =
      transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by transaction type
    const matchesType = filterType === "all" || transaction.type === filterType;

    // Filter by item category
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    // Filter by date range
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      matchesDateRange =
        transactionDate >= startDate && transactionDate <= endDate;
    }

    return matchesSearch && matchesType && matchesCategory && matchesDateRange;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get badge for transaction type
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

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Lịch sử giao dịch kho
          </h1>
          <p className="text-gray-600">
            Xem lịch sử nhập xuất kho thuốc và vật tư y tế
          </p>
        </div>
        <Link
          to="/staff/medication/inventory/export"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Xuất báo cáo
        </Link>
      </div>

      {/* Filter and search */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium text-gray-800">Bộ lọc</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div>
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Tên sản phẩm, mã giao dịch..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="filterType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loại giao dịch
              </label>
              <select
                id="filterType"
                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="in">Nhập kho</option>
                <option value="out">Xuất kho</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filterCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loại sản phẩm
              </label>
              <select
                id="filterCategory"
                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="medicine">Thuốc</option>
                <option value="supply">Vật tư</option>
                <option value="equipment">Thiết bị</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng thời gian
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="date"
                    name="startDate"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    name="endDate"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Không có dữ liệu phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Thời gian
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
                    Sản phẩm
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.itemName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.itemId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          transaction.type === "in"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "in" ? "+" : "-"}
                        {transaction.quantity} {transaction.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getReasonText(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.staffName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/staff/medication/inventory/transaction-detail/${transaction.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
