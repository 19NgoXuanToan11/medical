// Mock data for health check management
export const availableGradesData = [
  { 
    id: "grade-1", 
    name: "Khối 1", 
    studentCount: 75, // Total students across all classes in grade 1
    ageRange: "6-7 tuổi",
    classes: ["1A", "1B", "1C"],
    gradeLevel: 1
  },
  { 
    id: "grade-2", 
    name: "Khối 2", 
    studentCount: 80, // Total students across all classes in grade 2
    ageRange: "7-8 tuổi",
    classes: ["2A", "2B", "2C"],
    gradeLevel: 2
  },
  { 
    id: "grade-3", 
    name: "Khối 3", 
    studentCount: 87, // Total students across all classes in grade 3
    ageRange: "8-9 tuổi",
    classes: ["3A", "3B", "3C"],
    gradeLevel: 3
  },
  { 
    id: "grade-4", 
    name: "Khối 4", 
    studentCount: 53, // Total students across all classes in grade 4
    ageRange: "9-10 tuổi",
    classes: ["4A", "4B"],
    gradeLevel: 4
  },
  { 
    id: "grade-5", 
    name: "Khối 5", 
    studentCount: 49, // Total students across all classes in grade 5
    ageRange: "10-11 tuổi",
    classes: ["5A", "5B"],
    gradeLevel: 5
  }
];

export const healthCheckStepsConfig = [
  {
    step: 1,
    title: "Thông tin cơ bản",
    description: "Thời gian, địa điểm và mục tiêu",
    required: true,
  },
  {
    step: 2,
    title: "Hạng mục khám",
    description: "Chi tiết các mục kiểm tra sức khỏe",
    required: true,
  },
  {
    step: 3,
    title: "Thông tin lớp học",
    description: "Lớp học và tổ chức thực hiện",
    required: true,
  },
  {
    step: 4,
    title: "Kiểm tra & Xác nhận",
    description: "Xem trước và hoàn tất",
    required: true,
  },
];

export const healthCheckItemsData = [
  {
    id: "height_weight",
    name: "Chiều cao & Cân nặng",
    category: "physical",
    estimatedTime: 5,
    equipment: ["Thước đo chiều cao", "Cân điện tử"],
    normalRanges: "Theo tiêu chuẩn WHO",
    description: "Đo chiều cao, cân nặng và tính BMI",
  },
  {
    id: "vision",
    name: "Thị lực",
    category: "sensory",
    estimatedTime: 10,
    equipment: ["Bảng thị lực Snellen", "Đèn khám"],
    normalRanges: "20/20 hoặc tốt hơn",
    description: "Kiểm tra thị lực xa, gần và màu sắc",
  },
  {
    id: "hearing",
    name: "Thính lực",
    category: "sensory",
    estimatedTime: 8,
    equipment: ["Máy đo thính lực", "Nĩa âm"],
    normalRanges: "Nghe rõ ở 20dB",
    description: "Kiểm tra khả năng nghe và phân biệt âm thanh",
  },
  {
    id: "dental",
    name: "Răng miệng",
    category: "oral",
    estimatedTime: 12,
    equipment: ["Gương nha khoa", "Đèn khám", "Que gỗ"],
    normalRanges: "Không sâu răng, nướu khỏe",
    description: "Kiểm tra sâu răng, nướu và vệ sinh răng miệng",
  },
  {
    id: "cardiovascular",
    name: "Tim mạch",
    category: "cardiovascular",
    estimatedTime: 10,
    equipment: ["Ống nghe", "Máy đo huyết áp"],
    normalRanges: "Nhịp tim 70-100/phút, HA <120/80",
    description: "Nghe tim, đo huyết áp và kiểm tra mạch",
  },
  {
    id: "respiratory",
    name: "Hô hấp",
    category: "respiratory",
    estimatedTime: 8,
    equipment: ["Ống nghe"],
    normalRanges: "Phổi trong, không ran",
    description: "Khám phổi và đường hô hấp",
  },
  {
    id: "musculoskeletal",
    name: "Xương khớp",
    category: "musculoskeletal",
    estimatedTime: 15,
    equipment: ["Thước đo", "Búa phản xạ"],
    normalRanges: "Cử động bình thường, không đau",
    description: "Kiểm tra tư thế, cột sống và khớp",
  },
  {
    id: "skin",
    name: "Da liễu",
    category: "dermatology",
    estimatedTime: 8,
    equipment: ["Kính lúp", "Đèn UV"],
    normalRanges: "Da khỏe, không tổn thương",
    description: "Kiểm tra da, tóc và móng",
  },
  {
    id: "neurological",
    name: "Thần kinh",
    category: "neurological",
    estimatedTime: 12,
    equipment: ["Búa phản xạ", "Đèn pin"],
    normalRanges: "Phản xạ bình thường",
    description: "Kiểm tra phản xạ và chức năng thần kinh",
  },
  {
    id: "mental_health",
    name: "Sức khỏe tâm thần",
    category: "mental",
    estimatedTime: 20,
    equipment: ["Bảng câu hỏi", "Phiếu đánh giá"],
    normalRanges: "Phát triển tâm lý bình thường",
    description: "Đánh giá tâm lý và hành vi học đường",
  },
];

export const initialFormData = {
  // Core Form Fields (mapped to API)
  formId: 0,
  title: "",
  scheduledDate: "",
  startTime: "",
  estimatedDuration: 60,
  description: "",
  location: "Phòng y tế trường",
  studentId: 0,
  parentId: 0,
  createdDate: "",
  consentStatus: "pending",
  consentDate: "",
  confirmStatus: "pending",
  confirmedBy: 0,
  confirmedDate: "",
  className: "",
  gradeIds: "",
  totalStudents: 0,
  notifyParents: true,
  autoAdvance: true,
  saveResults: true,
  generateReport: true,
  requireParentConfirmation: true,
  selectedStations: "",
  staffAssigned: "",
  status: "draft",
  estimatedEndTime: "",

  // UI-specific fields (will be mapped to API fields)
  targetGrades: [], // Maps to gradeIds (JSON string) - single selection for grade blocks
  checkItems: [], // Maps to selectedStations (JSON string)
  scheduledTime: "", // Maps to startTime - session periods (morning/afternoon)

  // Student Selection (for single student forms)
  selectedStudent: null,
  selectedParent: null,

  // Additional fields for form management
  requiresConsent: true,
  requiresApproval: false,
  approvalLevel: "nurse_supervisor",
  urgencyLevel: "normal",
  maxStudentsPerSession: 50,
  reminderDaysBefore: 7,
  costPerStudent: 0,
  parentNotificationMessage: "",
  notes: "",
  checkDetails: {},
  followUpRequired: false,
  referralCriteria: "",
  equipmentNeeded: [],

  // Nested objects support (will be populated from API responses)
  student: null,
  parent: null,
  confirmedByStaff: null,
  results: [],
  grades: [],
};
