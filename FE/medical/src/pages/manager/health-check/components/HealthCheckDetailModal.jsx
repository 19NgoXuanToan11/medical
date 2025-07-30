import React from "react";
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";

const HealthCheckDetailModal = ({
  showModal,
  onClose,
  selectedRequest,
  onApprovalAction,
}) => {
  if (!showModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết yêu cầu khám sức khỏe
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Equipment Status - Priority Section */}
            <EquipmentStatusSection selectedRequest={selectedRequest} />

            {/* Basic Information */}
            <BasicInformation selectedRequest={selectedRequest} />

            {/* Schedule and Location Details */}
            <ScheduleDetails selectedRequest={selectedRequest} />

            {/* Target Information */}
            <TargetInformation selectedRequest={selectedRequest} />

            {/* Detailed Class and Student Information */}
            <ClassStudentDetails selectedRequest={selectedRequest} />

            {/* Check Items */}
            <CheckItems selectedRequest={selectedRequest} />

            {/* Description */}
            <Description selectedRequest={selectedRequest} />

            {/* Action Buttons */}
            <ActionButtons
              selectedRequest={selectedRequest}
              onApprovalAction={onApprovalAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EquipmentStatusSection = ({ selectedRequest }) => {
  if (selectedRequest.equipmentReport?.requiresAction) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-full">
            <FiAlertTriangle className="h-6 w-6 text-yellow-800 dark:text-yellow-200" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">
              ⚠️ CẢNH BÁO THIẾT BỊ
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4 font-medium">
              {selectedRequest.equipmentReport.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Missing Equipment */}
              {selectedRequest.equipmentReport.hasUnavailable && (
                <MissingEquipment
                  unavailableEquipment={
                    selectedRequest.equipmentReport.unavailableEquipment
                  }
                />
              )}

              {/* Out of Stock Equipment */}
              {selectedRequest.equipmentReport.hasOutOfStock && (
                <OutOfStockEquipment
                  outOfStockEquipment={
                    selectedRequest.equipmentReport.outOfStockEquipment
                  }
                />
              )}
            </div>

            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                🔧 Hành động cần thiết:
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                {selectedRequest.equipmentReport.actionRequired}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRequest.equipmentStatus === "ready") {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
            <FiCheck className="h-5 w-5 text-green-800 dark:text-green-200" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              ✅ Thiết bị sẵn sàng
            </h4>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Tất cả thiết bị cần thiết đã có sẵn và đủ số lượng
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const MissingEquipment = ({ unavailableEquipment }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
      <span className="text-lg">🚫</span>
      Thiết bị không có sẵn ({unavailableEquipment?.length || 0})
    </h5>
    <div className="space-y-2">
      {unavailableEquipment?.map((eq, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded"
        >
          <span className="text-red-800 dark:text-red-200 font-medium">
            {eq.name}
          </span>
          <span className="text-xs text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
            Cần mua
          </span>
        </div>
      ))}
    </div>
  </div>
);

const OutOfStockEquipment = ({ outOfStockEquipment }) => (
  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
    <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
      <span className="text-lg">📦</span>
      Thiết bị hết hàng ({outOfStockEquipment?.length || 0})
    </h5>
    <div className="space-y-2">
      {outOfStockEquipment?.map((eq, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded"
        >
          <span className="text-orange-800 dark:text-orange-200 font-medium">
            {eq.name}
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">
            Còn {eq.stock}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BasicInformation = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tiêu đề
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {selectedRequest.title}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Người yêu cầu
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.requestedBy}
      </p>
    </div>
  </div>
);

const ScheduleDetails = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Ngày thực hiện
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {new Date(selectedRequest.scheduledDate).toLocaleDateString("vi-VN")}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Thời gian
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.scheduledTime}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Địa điểm
      </label>
      <p className="text-gray-900 dark:text-white">
        {selectedRequest.location}
      </p>
    </div>
  </div>
);

const TargetInformation = ({ selectedRequest }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Khối lớp
      </label>
      <p className="text-gray-900 dark:text-white">
        {(() => {
          // Lấy danh sách khối từ targetGrades
          if (selectedRequest.targetGrades && Array.isArray(selectedRequest.targetGrades)) {
            // Giả sử targetGrades chứa ID của lớp, cần map sang khối
            const gradeLevels = [...new Set(selectedRequest.targetGrades.map(gradeId => {
              // Tìm khối từ gradeId (có thể cần API call để lấy thông tin chi tiết)
              // Tạm thời hiển thị theo format hiện tại
              return gradeId;
            }))].sort();
            return gradeLevels.join(", ");
          }
          return "Chưa phân công";
        })()}
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Số học sinh
      </label>
      <p className="text-gray-900 dark:text-white font-medium">
        {selectedRequest.totalStudents} học sinh
      </p>
    </div>
  </div>
);

const ClassStudentDetails = ({ selectedRequest }) => {
  const [expandedClasses, setExpandedClasses] = React.useState({});
  const [classData, setClassData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const toggleClass = async (gradeInfo) => {
    const isExpanded = expandedClasses[gradeInfo];
    
    if (!isExpanded && !classData[gradeInfo]) {
      setLoading(true);
      try {
        // Import classService dynamically
        const { getClassesByGrade, getClassStudents } = await import("../../../../utils/api/class/classService");
        
        // Extract grade level from gradeInfo (e.g., "grade-2" -> 2)
        let gradeLevel;
        if (gradeInfo.includes('grade-')) {
          gradeLevel = parseInt(gradeInfo.split('-')[1]);
        } else {
          // If it's already a class name like "1A", extract the grade
          gradeLevel = parseInt(gradeInfo.charAt(0));
        }
        
        // Get all classes for this grade level
        const classesInGrade = await getClassesByGrade(gradeLevel);
        
        if (classesInGrade && classesInGrade.length > 0) {
          // Get students for all classes in this grade
          const allStudentsInGrade = [];
          const classNames = [];
          
          for (const classItem of classesInGrade) {
            try {
              const students = await getClassStudents(classItem.classId);
              if (students && students.length > 0) {
                allStudentsInGrade.push(...students);
                classNames.push(classItem.className);
              }
            } catch (error) {
              console.error(`Error fetching students for class ${classItem.className}:`, error);
            }
          }
          
          setClassData(prev => ({
            ...prev,
            [gradeInfo]: {
              gradeLevel: gradeLevel,
              classNames: classNames,
              students: allStudentsInGrade,
              totalClasses: classesInGrade.length
            }
          }));
        } else {
          setClassData(prev => ({
            ...prev,
            [gradeInfo]: {
              gradeLevel: gradeLevel,
              classNames: [],
              students: [],
              error: `Không tìm thấy lớp nào cho khối ${gradeLevel}`
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setClassData(prev => ({
          ...prev,
          [gradeInfo]: {
            gradeLevel: gradeInfo,
            students: [],
            error: "Không thể tải dữ liệu lớp"
          }
        }));
      } finally {
        setLoading(false);
      }
    }

    setExpandedClasses(prev => ({
      ...prev,
      [gradeInfo]: !isExpanded
    }));
  };

  if (!selectedRequest.targetGrades || selectedRequest.targetGrades.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
          <FiUsers className="h-5 w-5 text-blue-800 dark:text-blue-200" />
        </div>
        <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200">
          Chi tiết danh sách lớp và học sinh
        </h4>
      </div>

      <div className="space-y-4">
        {selectedRequest.targetGrades.map((gradeInfo, index) => (
          <div key={index} className="bg-white dark:bg-neutral-700 rounded-lg border border-blue-200 dark:border-blue-700">
            <button
              onClick={() => toggleClass(gradeInfo)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              disabled={loading}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {gradeInfo.includes('grade-') ? `Khối ${gradeInfo.split('-')[1]}` : gradeInfo}
                </span>
                {classData[gradeInfo]?.students && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                    {classData[gradeInfo].students.length} học sinh
                  </span>
                )}
                {classData[gradeInfo]?.classNames && classData[gradeInfo].classNames.length > 0 && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                    {classData[gradeInfo].totalClasses} lớp
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {loading && expandedClasses[gradeInfo] === undefined && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                {expandedClasses[gradeInfo] ? (
                  <FiChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>

            {expandedClasses[gradeInfo] && (
              <div className="px-4 pb-4">
                {classData[gradeInfo]?.error ? (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {classData[gradeInfo].error}
                  </div>
                ) : classData[gradeInfo]?.students ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Khối {classData[gradeInfo].gradeLevel} • {classData[gradeInfo].students.length} học sinh • {classData[gradeInfo].totalClasses} lớp
                      {classData[gradeInfo].classNames.length > 0 && (
                        <div className="mt-1">
                          <strong>Các lớp:</strong> {classData[gradeInfo].classNames.join(", ")}
                        </div>
                      )}
                    </div>
                    
                    {classData[gradeInfo].students.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                        Không có học sinh nào trong khối này
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {classData[gradeInfo].students.map((student, studentIndex) => (
                          <div
                            key={studentIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-600 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                MSHS: {student.studentCode}
                                {student.className && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs">
                                    {student.className}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.gender === "Male" ? "Nam" : "Nữ"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <div className="flex items-start gap-2">
          <FiInfo className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lưu ý:</strong> Danh sách học sinh sẽ được tải khi bạn mở rộng từng khối lớp. 
            Tất cả học sinh trong các lớp của khối này sẽ tham gia khám sức khỏe.
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckItems = ({ selectedRequest }) => {
  const [healthCheckItems, setHealthCheckItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchHealthCheckItems = async () => {
      if (!selectedRequest.checkItems || selectedRequest.checkItems.length === 0) return;
      
      setLoading(true);
      try {
        // Dynamic import to get health check items
        const response = await fetch('https://localhost:7111/api/HealthCheckItem/active');
        if (response.ok) {
          const allItems = await response.json();
          
          // Map checkItems (which might be IDs or names) to actual health check items
          const mappedItems = selectedRequest.checkItems.map(checkItem => {
            // Try to find by ID first (if checkItem is a number)
            let foundItem = allItems.find(item => item.itemId === parseInt(checkItem));
            
            // If not found, try to find by code or name
            if (!foundItem) {
              foundItem = allItems.find(item => 
                item.code === checkItem || 
                item.name === checkItem ||
                item.itemId.toString() === checkItem.toString()
              );
            }
            
            // Return the found item or create a fallback
            return foundItem || {
              itemId: checkItem,
              name: checkItem,
              category: 'Unknown',
              estimatedTimeMinutes: 0
            };
          });
          
          setHealthCheckItems(mappedItems);
        } else {
          // Fallback: display as-is if API call fails
          setHealthCheckItems(selectedRequest.checkItems.map(item => ({
            itemId: item,
            name: item,
            category: 'Unknown',
            estimatedTimeMinutes: 0
          })));
        }
      } catch (error) {
        console.error("Error fetching health check items:", error);
        // Fallback: display as-is if error occurs
        setHealthCheckItems(selectedRequest.checkItems.map(item => ({
          itemId: item,
          name: item,
          category: 'Unknown',
          estimatedTimeMinutes: 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCheckItems();
  }, [selectedRequest.checkItems]);

  if (!selectedRequest.checkItems || selectedRequest.checkItems.length === 0) {
    return (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Hạng mục khám
    </label>
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          Chưa có hạng mục khám nào được chọn
        </p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Hạng mục khám ({healthCheckItems.length} hạng mục)
      </label>
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Đang tải thông tin hạng mục khám...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthCheckItems.map((item, index) => (
            <div
          key={index}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-xs">
                      {item.category}
                    </span>
                    {item.estimatedTimeMinutes > 0 && (
                      <span className="text-xs">
                        ~{item.estimatedTimeMinutes} phút
        </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
        <strong>Tổng thời gian ước tính:</strong> {healthCheckItems.reduce((total, item) => total + (item.estimatedTimeMinutes || 0), 0)} phút
      </div>
  </div>
);
};

const Description = ({ selectedRequest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Mô tả chi tiết
    </label>
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
        {selectedRequest.description}
      </p>
    </div>
  </div>
);

const ActionButtons = ({ selectedRequest, onApprovalAction }) => (
  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
    {selectedRequest?.equipmentReport?.requiresAction ? (
      <>
        <button
          onClick={() => onApprovalAction("approve")}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiCheck className="h-5 w-5" />
          Phê duyệt có điều kiện
        </button>
        <button
          onClick={() => onApprovalAction("reject")}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiX className="h-5 w-5" />
          Tạm hoãn
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => onApprovalAction("approve")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiCheck className="h-5 w-5" />
          Phê duyệt
        </button>
        <button
          onClick={() => onApprovalAction("reject")}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <FiX className="h-5 w-5" />
          Từ chối
        </button>
      </>
    )}
  </div>
);

export default HealthCheckDetailModal;
