// Mock medical supply data for testing equipment availability
export const mockMedicalSupplies = [
  // Vision testing equipment
  {
    supplyId: 1,
    name: "Bảng đo thị lực Snellen",
    category: "vision",
    description: "Bảng đo thị lực tiêu chuẩn",
    stockQuantity: 5,
    isActive: true,
  },
  {
    supplyId: 2,
    name: "Thiết bị đo khúc xạ",
    category: "vision",
    description: "Máy đo độ cận thị, viễn thị",
    stockQuantity: 2,
    isActive: true,
  },
  {
    supplyId: 3,
    name: "Đèn soi mắt",
    category: "vision",
    description: "Đèn chiếu sáng để kiểm tra mắt",
    stockQuantity: 0, // Out of stock
    isActive: true,
  },

  // Physical examination equipment
  {
    supplyId: 4,
    name: "Cân điện tử",
    category: "physical",
    description: "Cân đo cân nặng chính xác",
    stockQuantity: 3,
    isActive: true,
  },
  {
    supplyId: 5,
    name: "Thước đo chiều cao",
    category: "physical",
    description: "Thước đo chiều cao gắn tường",
    stockQuantity: 4,
    isActive: true,
  },
  {
    supplyId: 6,
    name: "Thước dây đo chu vi",
    category: "physical",
    description: "Thước dây đo chu vi cơ thể",
    stockQuantity: 8,
    isActive: true,
  },

  // Cardiovascular equipment
  {
    supplyId: 7,
    name: "Máy đo huyết áp",
    category: "cardiovascular",
    description: "Máy đo huyết áp điện tử",
    stockQuantity: 6,
    isActive: true,
  },
  {
    supplyId: 8,
    name: "Ống nghe",
    category: "cardiovascular",
    description: "Ống nghe y tế chuyên dụng",
    stockQuantity: 10,
    isActive: true,
  },
  {
    supplyId: 9,
    name: "Máy đo nhịp tim",
    category: "cardiovascular",
    description: "Thiết bị theo dõi nhịp tim",
    stockQuantity: 0, // Out of stock
    isActive: true,
  },

  // General examination equipment
  {
    supplyId: 10,
    name: "Nhiệt kế điện tử",
    category: "general",
    description: "Nhiệt kế đo nhiệt độ cơ thể",
    stockQuantity: 15,
    isActive: true,
  },
  {
    supplyId: 11,
    name: "Găng tay y tế",
    category: "general",
    description: "Găng tay nitrile dùng một lần",
    stockQuantity: 500,
    isActive: true,
  },
  {
    supplyId: 12,
    name: "Khẩu trang y tế",
    category: "general",
    description: "Khẩu trang phẫu thuật",
    stockQuantity: 1000,
    isActive: true,
  },

  // Oral examination equipment
  {
    supplyId: 13,
    name: "Gương soi răng",
    category: "oral",
    description: "Dụng cụ khám răng miệng",
    stockQuantity: 20,
    isActive: true,
  },
  {
    supplyId: 14,
    name: "Đèn pin khám răng",
    category: "oral",
    description: "Đèn chiếu sáng khám răng miệng",
    stockQuantity: 5,
    isActive: true,
  },

  // Equipment that doesn't exist (for testing unavailable items)
  // These items will be flagged as "unavailable" when health check items require them
];

// Equipment mapping for health check items
export const healthCheckEquipmentMapping = {
  // Vision items
  "Bảng thị lực": "Bảng đo thị lực Snellen",
  "Máy đo thị lực": "Thiết bị đo khúc xạ",
  "Đèn khám mắt": "Đèn soi mắt",

  // Physical items
  Cân: "Cân điện tử",
  "Thước đo": "Thước đo chiều cao",
  "Thước dây": "Thước dây đo chu vi",

  // Cardiovascular items
  "Máy huyết áp": "Máy đo huyết áp",
  "Ống nghe": "Ống nghe",
  "Máy đo tim": "Máy đo nhịp tim",

  // General items
  "Nhiệt kế": "Nhiệt kế điện tử",
  "Găng tay": "Găng tay y tế",
  "Khẩu trang": "Khẩu trang y tế",

  // Oral items
  "Gương răng": "Gương soi răng",
  "Đèn pin": "Đèn pin khám răng",
};

export default {
  mockMedicalSupplies,
  healthCheckEquipmentMapping,
};
