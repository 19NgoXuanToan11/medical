// Mock data for health check management
export const availableGradesData = [
    { id: "1A", name: "Lớp 1A", studentCount: 25, ageRange: "6-7 tuổi" },
    { id: "1B", name: "Lớp 1B", studentCount: 24, ageRange: "6-7 tuổi" },
    { id: "1C", name: "Lớp 1C", studentCount: 26, ageRange: "6-7 tuổi" },
    { id: "2A", name: "Lớp 2A", studentCount: 28, ageRange: "7-8 tuổi" },
    { id: "2B", name: "Lớp 2B", studentCount: 27, ageRange: "7-8 tuổi" },
    { id: "2C", name: "Lớp 2C", studentCount: 25, ageRange: "7-8 tuổi" },
    { id: "3A", name: "Lớp 3A", studentCount: 30, ageRange: "8-9 tuổi" },
    { id: "3B", name: "Lớp 3B", studentCount: 29, ageRange: "8-9 tuổi" },
    { id: "3C", name: "Lớp 3C", studentCount: 28, ageRange: "8-9 tuổi" },
    { id: "4A", name: "Lớp 4A", studentCount: 27, ageRange: "9-10 tuổi" },
    { id: "4B", name: "Lớp 4B", studentCount: 26, ageRange: "9-10 tuổi" },
    { id: "5A", name: "Lớp 5A", studentCount: 24, ageRange: "10-11 tuổi" },
    { id: "5B", name: "Lớp 5B", studentCount: 25, ageRange: "10-11 tuổi" }
];

export const healthCheckStepsConfig = [
    {
        id: 1,
        title: "Thông tin cơ bản",
        description: "Thời gian, địa điểm và mục tiêu",
        required: true
    },
    {
        id: 2,
        title: "Hạng mục khám",
        description: "Chi tiết các mục kiểm tra sức khỏe",
        required: true
    },
    {
        id: 3,
        title: "Đối tượng & Logistics",
        description: "Lớp học và tổ chức thực hiện",
        required: true
    },
    {
        id: 4,
        title: "Kiểm tra & Xác nhận",
        description: "Xem trước và hoàn tất",
        required: true
    }
];

export const healthCheckItemsData = [
    {
        id: "height_weight",
        name: "Chiều cao & Cân nặng",
        category: "physical",
        estimatedTime: 5,
        equipment: ["Thước đo chiều cao", "Cân điện tử"],
        normalRanges: "Theo tiêu chuẩn WHO",
        description: "Đo chiều cao, cân nặng và tính BMI"
    },
    {
        id: "vision",
        name: "Thị lực",
        category: "sensory",
        estimatedTime: 10,
        equipment: ["Bảng thị lực Snellen", "Đèn khám"],
        normalRanges: "20/20 hoặc tốt hơn",
        description: "Kiểm tra thị lực xa, gần và màu sắc"
    },
    {
        id: "hearing",
        name: "Thính lực",
        category: "sensory",
        estimatedTime: 8,
        equipment: ["Máy đo thính lực", "Nĩa âm"],
        normalRanges: "Nghe rõ ở 20dB",
        description: "Kiểm tra khả năng nghe và phân biệt âm thanh"
    },
    {
        id: "dental",
        name: "Răng miệng",
        category: "oral",
        estimatedTime: 12,
        equipment: ["Gương nha khoa", "Đèn khám", "Que gỗ"],
        normalRanges: "Không sâu răng, nướu khỏe",
        description: "Kiểm tra sâu răng, nướu và vệ sinh răng miệng"
    },
    {
        id: "cardiovascular",
        name: "Tim mạch",
        category: "cardiovascular",
        estimatedTime: 10,
        equipment: ["Ống nghe", "Máy đo huyết áp"],
        normalRanges: "Nhịp tim 70-100/phút, HA <120/80",
        description: "Nghe tim, đo huyết áp và kiểm tra mạch"
    },
    {
        id: "respiratory",
        name: "Hô hấp",
        category: "respiratory",
        estimatedTime: 8,
        equipment: ["Ống nghe"],
        normalRanges: "Phổi trong, không ran",
        description: "Khám phổi và đường hô hấp"
    },
    {
        id: "musculoskeletal",
        name: "Xương khớp",
        category: "musculoskeletal",
        estimatedTime: 15,
        equipment: ["Thước đo", "Búa phản xạ"],
        normalRanges: "Cử động bình thường, không đau",
        description: "Kiểm tra tư thế, cột sống và khớp"
    },
    {
        id: "skin",
        name: "Da liễu",
        category: "dermatology",
        estimatedTime: 8,
        equipment: ["Kính lúp", "Đèn UV"],
        normalRanges: "Da khỏe, không tổn thương",
        description: "Kiểm tra da, tóc và móng"
    },
    {
        id: "neurological",
        name: "Thần kinh",
        category: "neurological",
        estimatedTime: 12,
        equipment: ["Búa phản xạ", "Đèn pin"],
        normalRanges: "Phản xạ bình thường",
        description: "Kiểm tra phản xạ và chức năng thần kinh"
    },
    {
        id: "mental_health",
        name: "Sức khỏe tâm thần",
        category: "mental",
        estimatedTime: 20,
        equipment: ["Bảng câu hỏi", "Phiếu đánh giá"],
        normalRanges: "Phát triển tâm lý bình thường",
        description: "Đánh giá tâm lý và hành vi học đường"
    }
];

export const initialFormData = {
    // Basic Information
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    endTime: "",
    location: "Phòng y tế trường",
    targetGrades: [],

    // Workflow & Approval
    requiresConsent: true,
    requiresApproval: false,
    approvalLevel: "nurse_supervisor",
    urgencyLevel: "normal",

    // Logistics
    maxStudentsPerSession: 50,
    estimatedDuration: 60,
    reminderDaysBefore: 7,
    costPerStudent: 0,

    // Communication
    parentNotificationMessage: "",
    teacherInstructions: "",
    notes: "",

    // Health check specific fields
    checkItems: [],
    checkDetails: {},
    abnormalityProtocol: "",
    followUpRequired: false,
    referralCriteria: "",
    equipmentNeeded: []
}; 