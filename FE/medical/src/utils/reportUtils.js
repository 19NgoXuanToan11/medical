import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * Generate an Excel file from inventory data
 * @param {Array} inventory - Array of inventory items
 * @param {string} filename - Name of the exported file (without extension)
 */
export const generateExcelReport = (
  inventory,
  filename = "inventory-report"
) => {
  // Create a new workbook and worksheet
  const wb = XLSX.utils.book_new();

  // Transform data for Excel
  const inventoryData = inventory.map((item) => ({
    ID: item.id,
    "Tên sản phẩm": item.name,
    Loại: getCategoryName(item.category),
    "Số lượng": item.currentQuantity,
    "Đơn vị": item.unit,
    "Mức tối thiểu": item.minQuantity,
    "Vị trí": item.location,
    "Hạn sử dụng": formatDate(item.expiryDate),
    "Nhà cung cấp": item.supplier || "",
    "Ngày cập nhật": formatDate(item.lastUpdated),
  }));

  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(inventoryData);

  // Set column widths
  const columnWidths = [
    { wch: 10 }, // ID
    { wch: 30 }, // Name
    { wch: 15 }, // Category
    { wch: 10 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 10 }, // Min Quantity
    { wch: 15 }, // Location
    { wch: 15 }, // Expiry Date
    { wch: 25 }, // Supplier
    { wch: 15 }, // Last Updated
  ];
  ws["!cols"] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  // Generate Excel file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Generate a PDF report from inventory data
 * @param {Array} inventory - Array of inventory items
 * @param {string} filename - Name of the exported file (without extension)
 * @param {Object} filters - Optional filters applied to the data
 */
export const generatePdfReport = (
  inventory,
  filename = "inventory-report",
  filters = {}
) => {
  // Create new PDF document
  const doc = new jsPDF("landscape");

  // Add title
  doc.setFontSize(18);
  doc.text("Báo cáo kho thuốc và vật tư y tế", 14, 22);

  // Add date and filters information
  doc.setFontSize(10);
  doc.text(
    `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`,
    14,
    30
  );

  // Add filters info if any
  let filterText = "";
  if (filters.category && filters.category !== "all") {
    filterText += `Loại: ${getCategoryName(filters.category)}, `;
  }
  if (filters.searchTerm) {
    filterText += `Tìm kiếm: "${filters.searchTerm}", `;
  }
  if (filterText) {
    doc.text(`Bộ lọc: ${filterText.slice(0, -2)}`, 14, 35);
  }

  // Generate summary statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(
    (item) => item.currentQuantity <= item.minQuantity
  ).length;
  const expiringItems = inventory.filter(
    (item) => item.expiryDate && isExpiringWithin(item.expiryDate, 30)
  ).length;

  doc.text(`Tổng số sản phẩm: ${totalItems}`, 14, 40);
  doc.text(`Sản phẩm sắp hết: ${lowStockItems}`, 14, 45);
  doc.text(`Sản phẩm sắp hết hạn: ${expiringItems}`, 14, 50);

  // Create table data from inventory
  const tableColumn = [
    "ID",
    "Tên sản phẩm",
    "Loại",
    "Số lượng",
    "Vị trí",
    "Hạn sử dụng",
    "Trạng thái",
  ];
  const tableRows = [];

  inventory.forEach((item) => {
    const status = getItemStatus(item);
    const itemData = [
      item.id,
      item.name,
      getCategoryName(item.category),
      `${item.currentQuantity} ${item.unit}`,
      item.location,
      formatDate(item.expiryDate) || "N/A",
      status,
    ];
    tableRows.push(itemData);
  });

  // Add the table to the PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    willDrawCell: function (data) {
      // Highlight low stock or expiring items
      const rowIndex = data.row.index;
      if (rowIndex >= 0) {
        const item = inventory[rowIndex];
        if (
          item &&
          (item.currentQuantity <= item.minQuantity ||
            (item.expiryDate && isExpiringWithin(item.expiryDate, 30)))
        ) {
          data.cell.styles.fillColor = [255, 240, 240]; // Light red background
        }
      }
    },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Trang ${i} / ${pageCount} - MedSchool Inventory Management System`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save PDF file
  doc.save(`${filename}.pdf`);
};

/**
 * Generate a transaction history report as PDF
 * @param {Array} transactions - Array of transaction records
 * @param {string} filename - Name of the exported file (without extension)
 * @param {Object} filters - Optional filters applied to the data
 */
export const generateTransactionReport = (
  transactions,
  filename = "transaction-report",
  filters = {}
) => {
  // Create new PDF document
  const doc = new jsPDF("landscape");

  // Add title
  doc.setFontSize(18);
  doc.text("Báo cáo giao dịch kho thuốc và vật tư y tế", 14, 22);

  // Add date and filters information
  doc.setFontSize(10);
  doc.text(
    `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`,
    14,
    30
  );

  // Add filters info if any
  let filterText = "";
  if (filters.type && filters.type !== "all") {
    filterText += `Loại giao dịch: ${
      filters.type === "in" ? "Nhập kho" : "Xuất kho"
    }, `;
  }
  if (
    filters.dateRange &&
    filters.dateRange.startDate &&
    filters.dateRange.endDate
  ) {
    filterText += `Từ ngày: ${new Date(
      filters.dateRange.startDate
    ).toLocaleDateString("vi-VN")} đến ${new Date(
      filters.dateRange.endDate
    ).toLocaleDateString("vi-VN")}, `;
  }
  if (filterText) {
    doc.text(`Bộ lọc: ${filterText.slice(0, -2)}`, 14, 35);
  }

  // Generate summary statistics
  const totalTransactions = transactions.length;
  const inboundTransactions = transactions.filter(
    (t) => t.type === "in"
  ).length;
  const outboundTransactions = transactions.filter(
    (t) => t.type === "out"
  ).length;

  doc.text(`Tổng số giao dịch: ${totalTransactions}`, 14, 40);
  doc.text(`Giao dịch nhập kho: ${inboundTransactions}`, 14, 45);
  doc.text(`Giao dịch xuất kho: ${outboundTransactions}`, 14, 50);

  // Create table data from transactions
  const tableColumn = [
    "Mã GD",
    "Ngày",
    "Loại GD",
    "Sản phẩm",
    "Số lượng",
    "Lý do",
    "Người thực hiện",
  ];
  const tableRows = [];

  transactions.forEach((transaction) => {
    const transactionType = transaction.type === "in" ? "Nhập kho" : "Xuất kho";
    const itemData = [
      transaction.id,
      formatDateTime(transaction.date),
      transactionType,
      transaction.itemName,
      `${transaction.type === "in" ? "+" : "-"}${transaction.quantity} ${
        transaction.unit
      }`,
      getReasonText(transaction),
      transaction.staffName,
    ];
    tableRows.push(itemData);
  });

  // Add the table to the PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    willDrawCell: function (data) {
      if (data.row.index >= 0 && data.column.index === 2) {
        const transaction = transactions[data.row.index];
        if (transaction.type === "in") {
          data.cell.styles.textColor = [0, 128, 0]; // Green for inbound
        } else if (transaction.type === "out") {
          data.cell.styles.textColor = [192, 0, 0]; // Red for outbound
        }
      }
    },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Trang ${i} / ${pageCount} - MedSchool Inventory Management System`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save PDF file
  doc.save(`${filename}.pdf`);
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

/**
 * Format datetime for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Check if a date is expiring within a specified number of days
 * @param {string} dateString - ISO date string
 * @param {number} days - Number of days
 * @returns {boolean} - Whether the date is expiring within the specified days
 */
export const isExpiringWithin = (dateString, days) => {
  if (!dateString) return false;
  const today = new Date();
  const expiryDate = new Date(dateString);
  const timeDiff = expiryDate - today;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff > 0 && daysDiff <= days;
};

/**
 * Get category display name from category code
 * @param {string} category - Category code
 * @returns {string} - Display name
 */
export const getCategoryName = (category) => {
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

/**
 * Get item status based on quantity and expiry date
 * @param {Object} item - Inventory item
 * @returns {string} - Status description
 */
export const getItemStatus = (item) => {
  if (item.currentQuantity <= 0) {
    return "Hết hàng";
  }

  if (item.expiryDate) {
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    if (expiryDate < today) {
      return "Hết hạn";
    }

    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) {
      return `Sắp hết hạn (${daysDiff} ngày)`;
    }
  }

  if (item.currentQuantity <= item.minQuantity) {
    return "Sắp hết hàng";
  }

  return "Bình thường";
};

/**
 * Get reason text for transaction
 * @param {Object} transaction - Transaction object
 * @returns {string} - Formatted reason text
 */
export const getReasonText = (transaction) => {
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
