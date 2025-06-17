// Mock API service for vaccination management
const mockVaccinations = [
  {
    id: 1,
    title: "Tiêm vắc-xin cúm mùa",
    scheduledDate: "2024-07-15",
    status: "upcoming",
    grades: ["1A", "1B", "1C"],
    totalStudents: 75,
    confirmedParents: 68,
    vaccineInfo: "Vắc-xin cúm mùa 2024",
    description: "Tiêm phòng cúm mùa cho học sinh khối lớp 1",
    location: "Phòng y tế trường",
    scheduledTime: "08:00",
    estimatedDuration: 180,
    vaccineType: "flu",
    isVoluntary: false,
    requireParentConsent: true,
    vaccinationDetails: {
      dosage: "0.5ml",
      manufacturer: "Sanofi Pasteur",
      lotNumber: "FLU2024-001",
      expiryDate: "2025-12-31",
      sideEffects: "Có thể gây sốt nhẹ, đau tại chỗ tiêm trong 1-2 ngày",
      contraindications:
        "Không tiêm cho học sinh đang sốt hoặc có tiền sử dị ứng",
    },
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-15T14:30:00Z",
  },
  {
    id: 2,
    title: "Tiêm nhắc vắc-xin MMR",
    scheduledDate: "2024-06-30",
    status: "upcoming",
    grades: ["5A", "5B"],
    totalStudents: 52,
    confirmedParents: 45,
    vaccineInfo: "Vắc-xin MMR (Sởi - Quai bị - Rubella)",
    description: "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 5",
    location: "Phòng y tế trường",
    scheduledTime: "09:00",
    estimatedDuration: 150,
    vaccineType: "mmr",
    isVoluntary: false,
    requireParentConsent: true,
    vaccinationDetails: {
      dosage: "0.5ml",
      manufacturer: "Merck",
      lotNumber: "MMR2024-002",
      expiryDate: "2025-08-31",
      sideEffects: "Có thể gây sốt nhẹ, phát ban trong 7-12 ngày sau tiêm",
      contraindications: "Không tiêm cho học sinh có suy giảm miễn dịch",
    },
    createdAt: "2024-05-15T09:00:00Z",
    updatedAt: "2024-06-01T11:00:00Z",
  },
  {
    id: 3,
    title: "Tiêm vắc-xin Viêm gan B",
    scheduledDate: "2024-05-20",
    status: "completed",
    grades: ["3A", "3B", "3C"],
    totalStudents: 80,
    vaccinatedStudents: 76,
    vaccineInfo: "Vắc-xin Viêm gan B",
    description: "Tiêm nhắc vắc-xin Viêm gan B cho học sinh khối lớp 3",
    location: "Phòng y tế trường",
    scheduledTime: "08:30",
    estimatedDuration: 210,
    vaccineType: "hepatitisB",
    isVoluntary: false,
    requireParentConsent: true,
    vaccinationDetails: {
      dosage: "0.5ml",
      manufacturer: "GSK",
      lotNumber: "HBV2024-003",
      expiryDate: "2025-10-31",
      sideEffects: "Có thể gây đau nhẹ tại chỗ tiêm",
      contraindications:
        "Không tiêm cho học sinh có tiền sử dị ứng với men bánh mì",
    },
    createdAt: "2024-04-01T08:00:00Z",
    updatedAt: "2024-05-20T16:00:00Z",
  },
];

const mockVaccineTypes = [
  {
    id: "flu",
    name: "Vắc-xin cúm mùa",
    recommendedAge: "6 tháng - 18 tuổi",
    description: "Phòng ngừa bệnh cúm mùa",
    dosage: "0.5ml",
    route: "Tiêm bắp",
    frequency: "Hàng năm",
  },
  {
    id: "mmr",
    name: "Vắc-xin MMR (Sởi - Quai bị - Rubella)",
    recommendedAge: "12-15 tháng, 4-6 tuổi",
    description: "Phòng ngừa bệnh sởi, quai bị và rubella",
    dosage: "0.5ml",
    route: "Tiêm dưới da",
    frequency: "2 liều",
  },
  {
    id: "hepatitisB",
    name: "Vắc-xin Viêm gan B",
    recommendedAge: "Sơ sinh - 18 tuổi",
    description: "Phòng ngừa bệnh viêm gan B",
    dosage: "0.5ml",
    route: "Tiêm bắp",
    frequency: "3 liều",
  },
  {
    id: "varicella",
    name: "Vắc-xin Thủy đậu",
    recommendedAge: "12-15 tháng, 4-6 tuổi",
    description: "Phòng ngừa bệnh thủy đậu",
    dosage: "0.5ml",
    route: "Tiêm dưới da",
    frequency: "2 liều",
  },
  {
    id: "hpv",
    name: "Vắc-xin HPV",
    recommendedAge: "11-12 tuổi",
    description: "Phòng ngừa ung thư cổ tử cung",
    dosage: "0.5ml",
    route: "Tiêm bắp",
    frequency: "2-3 liều",
  },
  {
    id: "dpt",
    name: "Vắc-xin DPT (Bạch hầu - Ho gà - Uốn ván)",
    recommendedAge: "2, 4, 6 tháng",
    description: "Phòng ngừa bạch hầu, ho gà và uốn ván",
    dosage: "0.5ml",
    route: "Tiêm bắp",
    frequency: "3 liều cơ bản + nhắc lại",
  },
];

const mockGrades = [
  { id: "1A", name: "Lớp 1A", studentCount: 28 },
  { id: "1B", name: "Lớp 1B", studentCount: 25 },
  { id: "1C", name: "Lớp 1C", studentCount: 27 },
  { id: "2A", name: "Lớp 2A", studentCount: 30 },
  { id: "2B", name: "Lớp 2B", studentCount: 29 },
  { id: "2C", name: "Lớp 2C", studentCount: 31 },
  { id: "3A", name: "Lớp 3A", studentCount: 26 },
  { id: "3B", name: "Lớp 3B", studentCount: 28 },
  { id: "3C", name: "Lớp 3C", studentCount: 25 },
  { id: "4A", name: "Lớp 4A", studentCount: 24 },
  { id: "4B", name: "Lớp 4B", studentCount: 26 },
  { id: "4C", name: "Lớp 4C", studentCount: 29 },
  { id: "5A", name: "Lớp 5A", studentCount: 25 },
  { id: "5B", name: "Lớp 5B", studentCount: 27 },
  { id: "5C", name: "Lớp 5C", studentCount: 23 },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const vaccinationService = {
  // Get all vaccinations
  getAllVaccinations: async () => {
    await delay(800);
    return {
      data: mockVaccinations,
      success: true,
      message: "Lấy danh sách tiêm chủng thành công",
    };
  },

  // Get vaccination by ID
  getVaccinationById: async (id) => {
    await delay(600);
    const vaccination = mockVaccinations.find((v) => v.id === parseInt(id));
    if (!vaccination) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy kế hoạch tiêm chủng",
      };
    }
    return {
      data: vaccination,
      success: true,
      message: "Lấy thông tin tiêm chủng thành công",
    };
  },

  // Create new vaccination plan
  createVaccinationPlan: async (planData) => {
    await delay(1500);

    // Validate required fields
    if (!planData.title || !planData.vaccineType || !planData.scheduledDate) {
      return {
        data: null,
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      };
    }

    if (!planData.targetGrades || planData.targetGrades.length === 0) {
      return {
        data: null,
        success: false,
        message: "Vui lòng chọn ít nhất một lớp học",
      };
    }

    // Calculate total students
    const totalStudents = planData.targetGrades.reduce((total, gradeId) => {
      const grade = mockGrades.find((g) => g.id === gradeId);
      return total + (grade ? grade.studentCount : 0);
    }, 0);

    // Create new vaccination plan
    const newPlan = {
      id: mockVaccinations.length + 1,
      ...planData,
      totalStudents,
      confirmedParents: 0,
      status: "planning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockVaccinations.push(newPlan);

    return {
      data: newPlan,
      success: true,
      message: "Tạo kế hoạch tiêm chủng thành công",
    };
  },

  // Update vaccination plan
  updateVaccinationPlan: async (id, planData) => {
    await delay(1200);

    const index = mockVaccinations.findIndex((v) => v.id === parseInt(id));
    if (index === -1) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy kế hoạch tiêm chủng",
      };
    }

    // Calculate total students if grades changed
    let totalStudents = mockVaccinations[index].totalStudents;
    if (planData.targetGrades) {
      totalStudents = planData.targetGrades.reduce((total, gradeId) => {
        const grade = mockGrades.find((g) => g.id === gradeId);
        return total + (grade ? grade.studentCount : 0);
      }, 0);
    }

    mockVaccinations[index] = {
      ...mockVaccinations[index],
      ...planData,
      totalStudents,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: mockVaccinations[index],
      success: true,
      message: "Cập nhật kế hoạch tiêm chủng thành công",
    };
  },

  // Delete vaccination plan
  deleteVaccinationPlan: async (id) => {
    await delay(800);

    const index = mockVaccinations.findIndex((v) => v.id === parseInt(id));
    if (index === -1) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy kế hoạch tiêm chủng",
      };
    }

    // Don't allow deletion of completed vaccinations
    if (mockVaccinations[index].status === "completed") {
      return {
        data: null,
        success: false,
        message: "Không thể xóa kế hoạch tiêm chủng đã hoàn thành",
      };
    }

    mockVaccinations.splice(index, 1);

    return {
      data: { id: parseInt(id) },
      success: true,
      message: "Xóa kế hoạch tiêm chủng thành công",
    };
  },

  // Get available vaccine types
  getVaccineTypes: async () => {
    await delay(300);
    return {
      data: mockVaccineTypes,
      success: true,
      message: "Lấy danh sách loại vắc-xin thành công",
    };
  },

  // Get available grades
  getAvailableGrades: async () => {
    await delay(200);
    return {
      data: mockGrades,
      success: true,
      message: "Lấy danh sách lớp học thành công",
    };
  },

  // Get vaccination statistics
  getVaccinationStats: async () => {
    await delay(400);

    const today = new Date();
    const upcomingCount = mockVaccinations.filter(
      (v) => v.status === "upcoming" || v.status === "planning"
    ).length;

    const completedCount = mockVaccinations.filter(
      (v) => v.status === "completed"
    ).length;

    const thisMonthCount = mockVaccinations.filter((v) => {
      const vacDate = new Date(v.scheduledDate);
      return (
        vacDate.getMonth() === today.getMonth() &&
        vacDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const totalStudentsCount = mockGrades.reduce(
      (sum, grade) => sum + grade.studentCount,
      0
    );

    return {
      data: {
        upcoming: upcomingCount,
        completed: completedCount,
        thisMonth: thisMonthCount,
        totalStudents: totalStudentsCount,
      },
      success: true,
      message: "Lấy thống kê tiêm chủng thành công",
    };
  },

  // Mark vaccination as completed
  markVaccinationCompleted: async (id, vaccinatedStudents) => {
    await delay(1000);

    const index = mockVaccinations.findIndex((v) => v.id === parseInt(id));
    if (index === -1) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy kế hoạch tiêm chủng",
      };
    }

    mockVaccinations[index] = {
      ...mockVaccinations[index],
      status: "completed",
      vaccinatedStudents:
        vaccinatedStudents || mockVaccinations[index].totalStudents,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: mockVaccinations[index],
      success: true,
      message: "Đánh dấu hoàn thành tiêm chủng thành công",
    };
  },

  // Send reminder notification
  sendReminderNotification: async (id) => {
    await delay(800);

    const vaccination = mockVaccinations.find((v) => v.id === parseInt(id));
    if (!vaccination) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy kế hoạch tiêm chủng",
      };
    }

    return {
      data: {
        id: parseInt(id),
        sentAt: new Date().toISOString(),
        recipientCount: vaccination.totalStudents,
      },
      success: true,
      message: `Đã gửi thông báo nhắc nhở đến ${vaccination.totalStudents} phụ huynh`,
    };
  },
};

export default vaccinationService;
