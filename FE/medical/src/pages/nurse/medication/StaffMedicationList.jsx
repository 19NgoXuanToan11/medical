import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiUser,
  FiCalendar,
  FiFileText,
  FiEye,
  FiCheck,
  FiX,
  FiClipboard,
  FiTablet,
  FiRefreshCw,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
import { medicationService } from "../../../utils/api/medication/medicationService";

const StaffMedicationList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [medicationRequests, setMedicationRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState({});
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 3, // Initialize with visible data from the table
    completed: 0,
    rejected: 0,
    today: 0,
    total: 0,
  });

  // Load initial data when component mounts
  useEffect(() => {
    loadAllStats();
    loadAvailableNurses();
    loadAllRequests(); // Load all by default
  }, []);

  // Load medication requests from API based on active tab
  useEffect(() => {
    if (activeTab === "pending") {
      loadPendingRequests();
    } else if (activeTab === "assigned") {
      loadAssignedRequests();
    } else if (activeTab === "completed") {
      loadCompletedRequests();
    } else if (activeTab === "all") {
      loadAllRequests();
    }
    // Always reload stats when switching tabs
    loadAllStats();
  }, [activeTab]);

  // Load stats for both tabs to ensure counters are always accurate
  const loadAllStats = async () => {
    try {
      // Load pending, assigned, and completed counts
      const [pendingResponse, assignedResponse, completedResponse] =
        await Promise.all([
          medicationService.getPendingMedicationRequests(),
          medicationService.getAssignedMedicationRequests(),
          medicationService.getCompletedMedicationRequests(),
        ]);

      let pendingCount = 0;
      let assignedCount = 0;
      let completedCount = 0;
      let todayCount = 0;

      // Calculate pending count
      if (pendingResponse.success && pendingResponse.data) {
        const pendingData = pendingResponse.data.filter(
          (req) =>
            req.status === "pending" || req.status === "Pending" || !req.status
        );
        pendingCount = pendingData.length;

        // Calculate today count from pending requests
        const todayString = new Date().toISOString().split("T")[0];
        todayCount = pendingData.filter((req) => {
          const reqDate = req.requestDate
            ? new Date(req.requestDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
          return reqDate === todayString;
        }).length;
      }

      // Calculate assigned count
      if (assignedResponse.success && assignedResponse.data) {
        const assignedData = assignedResponse.data.filter(
          (req) => req.status === "Assigned" || req.status === "assigned"
        );
        assignedCount = assignedData.length;
      }

      // Calculate completed count
      if (completedResponse.success && completedResponse.data) {
        const completedData = completedResponse.data.filter(
          (req) => req.status === "Completed" || req.status === "completed"
        );
        completedCount = completedData.length;
      }

      // Update stats with calculated values
      setStats({
        pending: pendingCount,
        assigned: assignedCount,
        completed: completedCount,
        rejected: 0, // Keep as 0 for now
        today: todayCount,
        total: pendingCount + assignedCount + completedCount,
      });

      console.log("Updated stats:", {
        pending: pendingCount,
        assigned: assignedCount,
        completed: completedCount,
        today: todayCount,
        total: pendingCount + assignedCount + completedCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Use local data as fallback
      const localStats = calculateLocalStats();
      setStats(localStats);
      console.log("Using local stats as fallback:", localStats);
    }
  };

  const loadAvailableNurses = async () => {
    try {
      const response = await medicationService.getAvailableNurses();
      if (response.success) {
        setAvailableNurses(response.data);
      }
    } catch (error) {
      console.error("Error loading available nurses:", error);
    }
  };

  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      const pendingResponse =
        await medicationService.getPendingMedicationRequests();

      if (pendingResponse.success) {
        // Transform API data to match component structure
        // Filter to ensure only pending requests are included
        const pendingOnly = pendingResponse.data.filter(
          (req) =>
            req.status === "pending" || req.status === "Pending" || !req.status
        );

        const transformedRequests = pendingOnly.map((req) => {
          // Extract medicine items into a single medicine name for now
          const medicineItems = req.medicineRequestItems || [];
          const firstMedicine = medicineItems[0];

          return {
            id: req.requestId || req.id,
            studentName: req.student
              ? `${req.student.firstName} ${req.student.lastName}`
              : "N/A",
            studentId: req.student?.studentId || 0,
            className: req.student?.className || req.className,
            medicineName: firstMedicine?.medicineName || "N/A",
            dosage: firstMedicine?.dosage || "N/A",
            frequency: firstMedicine?.frequency || "N/A",
            timeOfDay: firstMedicine?.timeOfDay || "N/A",
            instructions: firstMedicine?.instructions || "N/A",
            status: "pending", // Force status to pending since this is pending tab
            requestDate: req.requestDate
              ? new Date(req.requestDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            date: req.date,
            parentName: req.parent
              ? `${req.parent.firstName} ${req.parent.lastName}`
              : "N/A",
            staffName: req.staff
              ? `${req.staff.firstName} ${req.staff.lastName}`
              : "N/A",
            medicineRequestItems: medicineItems,
            // Add any existing approval/rejection data
            approvedBy: req.approvedBy,
            approvedDate: req.approvedDate,
            rejectedBy: req.rejectedBy,
            rejectedDate: req.rejectedDate,
            rejectionReason: req.rejectionReason,
            approvalNotes: req.approvalNotes,
          };
        });

        console.log("API Response data:", pendingResponse.data);
        console.log("Filtered pending requests:", transformedRequests);

        setMedicationRequests(transformedRequests);

        // Don't override stats here - let loadAllStats handle it
        console.log("Pending requests loaded successfully");
      } else {
        console.error(
          "Error loading pending requests:",
          pendingResponse.message
        );
        setMedicationRequests([]);
      }
    } catch (error) {
      console.error("Error loading pending medication requests:", error);
      // Fallback to empty data
      setMedicationRequests([]);
    }
    setLoading(false);
  };

  const loadAssignedRequests = async () => {
    setLoading(true);
    try {
      const assignedResponse =
        await medicationService.getAssignedMedicationRequests();

      if (assignedResponse.success) {
        console.log("Raw assigned API response:", assignedResponse.data);

        // Transform API data to match component structure
        const assignedOnly = assignedResponse.data.filter(
          (req) => req.status === "Assigned" || req.status === "assigned"
        );

        console.log("Filtered assigned requests:", assignedOnly);

        const transformedRequests = assignedOnly.map((req) => {
          const medicineItems = req.medicineRequestItems || [];
          const firstMedicine = medicineItems[0];

          console.log(
            `Request ${req.requestId} medicineRequestItems:`,
            medicineItems
          );

          return {
            id: req.requestId || req.id,
            studentName: req.student
              ? `${req.student.firstName} ${req.student.lastName}`
              : "N/A",
            studentId: req.student?.studentId || 0,
            className: req.student?.className || req.className,
            medicineName: firstMedicine?.medicineName || "N/A",
            dosage: firstMedicine?.dosage || "N/A",
            frequency: firstMedicine?.frequency || "N/A",
            timeOfDay: firstMedicine?.timeOfDay || "N/A",
            instructions: firstMedicine?.instructions || "N/A",
            status: "assigned",
            requestDate: req.requestDate
              ? new Date(req.requestDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            date: req.date,
            parentName: req.parent
              ? `${req.parent.firstName} ${req.parent.lastName}`
              : "N/A",
            staffName: req.staff
              ? `${req.staff.firstName} ${req.staff.lastName}`
              : "N/A",
            medicineRequestItems: medicineItems,
            // Add detailed assignment information
            staff: req.staff, // Full staff object for detailed info
            assignedDate: req.assignedDate,
            assignedBy: req.assignedBy,
            assignmentNotes: req.assignmentNotes,
            staffId: req.staffId,
          };
        });

        console.log("Transformed assigned requests:", transformedRequests);

        setAssignedRequests(transformedRequests);
      } else {
        console.error(
          "Error loading assigned requests:",
          assignedResponse.message
        );
        setAssignedRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned medication requests:", error);
      setAssignedRequests([]);
    }
    setLoading(false);
  };

  const loadCompletedRequests = async () => {
    setLoading(true);
    try {
      const completedResponse =
        await medicationService.getCompletedMedicationRequests();

      if (completedResponse.success) {
        console.log("Raw completed API response:", completedResponse.data);

        // Transform API data to match component structure
        const completedOnly = completedResponse.data.filter(
          (req) => req.status === "Completed" || req.status === "completed"
        );

        console.log("Filtered completed requests:", completedOnly);

        const transformedRequests = completedOnly.map((req) => {
          const medicineItems = req.medicineRequestItems || [];
          const firstMedicine = medicineItems[0];

          console.log(
            `Request ${req.requestId} medicineRequestItems:`,
            medicineItems
          );

          return {
            id: req.requestId || req.id,
            studentName: req.student
              ? `${req.student.firstName} ${req.student.lastName}`
              : "N/A",
            studentId: req.student?.studentId || 0,
            className: req.student?.className || req.className,
            medicineName: firstMedicine?.medicineName || "N/A",
            dosage: firstMedicine?.dosage || "N/A",
            frequency: firstMedicine?.frequency || "N/A",
            timeOfDay: firstMedicine?.timeOfDay || "N/A",
            instructions: firstMedicine?.instructions || "N/A",
            status: "completed",
            requestDate: req.requestDate
              ? new Date(req.requestDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            date: req.date,
            parentName: req.parent
              ? `${req.parent.firstName} ${req.parent.lastName}`
              : "N/A",
            staffName: req.staff
              ? `${req.staff.firstName} ${req.staff.lastName}`
              : "N/A",
            medicineRequestItems: medicineItems,
            // Add detailed completion information
            staff: req.staff, // Full staff object for detailed info
            assignedDate: req.assignedDate,
            assignedBy: req.assignedBy,
            assignmentNotes: req.assignmentNotes,
            staffId: req.staffId,
            completedDate: req.completedDate,
            completedBy: req.completedBy,
            completionNotes: req.completionNotes,
          };
        });

        console.log("Transformed completed requests:", transformedRequests);

        setCompletedRequests(transformedRequests);
      } else {
        console.error(
          "Error loading completed requests:",
          completedResponse.message
        );
        setCompletedRequests([]);
      }
    } catch (error) {
      console.error("Error loading completed medication requests:", error);
      setCompletedRequests([]);
    }
    setLoading(false);
  };

  const loadAllRequests = async () => {
    setLoading(true);
    try {
      const allResponse = await medicationService.getAllMedicationRequests();

      if (allResponse.success) {
        const transformedRequests = allResponse.data.map((req) => {
          const medicineItems = req.medicineRequestItems || [];
          const firstMedicine = medicineItems[0];

          return {
            id: req.requestId || req.id,
            studentName: req.student
              ? `${req.student.firstName} ${req.student.lastName}`
              : "N/A",
            studentId: req.student?.studentId || 0,
            className: req.student?.className || req.className,
            medicineName: firstMedicine?.medicineName || "N/A",
            dosage: firstMedicine?.dosage || "N/A",
            frequency: firstMedicine?.frequency || "N/A",
            timeOfDay: firstMedicine?.timeOfDay || "N/A",
            instructions: firstMedicine?.instructions || "N/A",
            status: req.status || "pending",
            requestDate: req.requestDate
              ? new Date(req.requestDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            date: req.date,
            parentName: req.parent
              ? `${req.parent.firstName} ${req.parent.lastName}`
              : "N/A",
            staffName: req.staff
              ? `${req.staff.firstName} ${req.staff.lastName}`
              : "N/A",
            staff: req.staff,
            medicineRequestItems: medicineItems,
            assignedDate: req.assignedDate,
            approvedBy: req.approvedBy,
            approvedDate: req.approvedDate,
            rejectedBy: req.rejectedBy,
            rejectedDate: req.rejectedDate,
            rejectionReason: req.rejectionReason,
            approvalNotes: req.approvalNotes,
          };
        });

        console.log("All requests API Response data:", allResponse.data);
        console.log("All transformed requests:", transformedRequests);

        setAllRequests(transformedRequests);

        console.log("All requests loaded successfully");
      } else {
        console.error("Error loading all requests:", allResponse.message);
        setAllRequests([]);
      }
    } catch (error) {
      console.error("Error loading all medication requests:", error);
      setAllRequests([]);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    loadAllStats(); // Always refresh stats
    if (activeTab === "pending") {
      loadPendingRequests();
    } else if (activeTab === "assigned") {
      loadAssignedRequests();
    } else if (activeTab === "completed") {
      loadCompletedRequests();
    } else if (activeTab === "all") {
      loadAllRequests();
    }
  };

  const handleRequestAction = async (
    requestId,
    action,
    staffId,
    notes = ""
  ) => {
    try {
      if (!staffId) {
        alert("Vui lòng chọn nhân viên y tế!");
        return;
      }

      console.log("Assigning request:", { requestId, action, staffId, notes });

      // Get the current request data before assignment
      const currentRequest = medicationRequests.find(
        (req) => req.id === requestId
      );
      console.log("Current request data before assignment:", currentRequest);

      const response = await medicationService.updateMedicationRequestWithStaff(
        requestId,
        staffId,
        action,
        notes
      );

      console.log("Assignment response:", response);

      if (response.success) {
        // Find selected staff info
        const selectedStaff = availableNurses.find(
          (nurse) => nurse.staffId === parseInt(staffId)
        );
        const staffName = selectedStaff
          ? `${selectedStaff.firstName} ${selectedStaff.lastName}`
          : "Y tá";

        // Send notification to parent
        if (currentRequest) {
          await sendParentNotification(
            requestId,
            "assigned",
            notes,
            currentRequest
          );
        }

        // Show success message immediately
        alert("Yêu cầu đã được giao nhiệm vụ thành công!");

        // Clear form states
        setSelectedNurse("");
        setShowActionDropdown({});

        // Immediately reload stats
        await loadAllStats();

        // Add delay to ensure backend has processed the update, then reload data
        setTimeout(async () => {
          console.log("Reloading data after assignment...");
          // Reload all tabs data to ensure consistency
          await Promise.all([
            loadPendingRequests(),
            loadAssignedRequests(),
            loadCompletedRequests(),
          ]);

          // Switch to assigned tab after assigning
          if (action === "approved") {
            setActiveTab("assigned");
            console.log("Switched to assigned tab");
          }

          // Final stats reload after switching tabs
          await loadAllStats();
        }, 1000); // Increased delay to 1 second
      } else {
        alert(
          response.message ||
            `Có lỗi xảy ra khi ${
              action === "approved" ? "phê duyệt" : "từ chối"
            } yêu cầu!`
        );
      }
    } catch (error) {
      console.error(
        `Error ${action === "approved" ? "approving" : "rejecting"} request:`,
        error
      );
      alert(
        `Có lỗi xảy ra khi ${
          action === "approved" ? "phê duyệt" : "từ chối"
        } yêu cầu!`
      );
    }
  };

  const toggleActionDropdown = (requestId) => {
    setShowActionDropdown((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-dropdown")) {
        setShowActionDropdown({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendParentNotification = async (requestId, action, notes, request) => {
    try {
      if (!request) {
        request =
          medicationRequests.find((req) => req.id === requestId) ||
          assignedRequests.find((req) => req.id === requestId) ||
          completedRequests.find((req) => req.id === requestId);
      }
      if (!request) return;

      let title = "";
      let message = "";

      if (action === "assigned") {
        title = "Yêu cầu thuốc đã được giao nhiệm vụ";
        message = `Yêu cầu cấp thuốc ${request.medicineName} cho ${
          request.studentName
        } đã được giao cho nhân viên y tế. ${notes ? `Ghi chú: ${notes}` : ""}`;
      } else if (action === "completed") {
        title = "Yêu cầu thuốc đã hoàn thành";
        message = `Yêu cầu cấp thuốc ${request.medicineName} cho ${
          request.studentName
        } đã được hoàn thành. ${notes ? `Ghi chú: ${notes}` : ""}`;
      }

      const notificationData = {
        type: "medication_response",
        title: title,
        message: message,
        recipientRole: "parent",
        studentId: request.studentId,
        medicationRequestId: requestId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo (in real app, use proper notification system)
      const existingNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "parentNotifications",
        JSON.stringify(existingNotifications)
      );

      console.log("Parent notification sent:", notificationData);
    } catch (error) {
      console.error("Error sending parent notification:", error);
    }
  };

  const handleCompleteRequest = async (requestId, notes = "") => {
    try {
      // Get the current request data before completion
      const currentRequest = assignedRequests.find(
        (req) => req.id === requestId
      );

      if (!currentRequest) {
        alert("Không tìm thấy yêu cầu!");
        return;
      }

      // Use the staff ID from the assigned request
      const staffId = currentRequest.staffId || currentRequest.staff?.staffId;

      if (!staffId) {
        alert("Không tìm thấy thông tin nhân viên!");
        return;
      }

      console.log("Completing request:", { requestId, staffId, notes });

      const response = await medicationService.completeMedicationRequest(
        requestId,
        staffId,
        notes
      );

      console.log("Completion response:", response);

      if (response.success) {
        // Send notification to parent
        await sendParentNotification(
          requestId,
          "completed",
          notes,
          currentRequest
        );

        // Show success message
        alert("Yêu cầu đã được hoàn thành thành công!");

        // Clear form states
        setShowActionDropdown({});

        // Reload all data
        await loadAllStats();
        setTimeout(async () => {
          await Promise.all([
            loadPendingRequests(),
            loadAssignedRequests(),
            loadCompletedRequests(),
          ]);

          // Switch to completed tab after completion
          setActiveTab("completed");
          console.log("Switched to completed tab");

          // Final stats reload
          await loadAllStats();
        }, 1000);
      } else {
        alert(response.message || "Có lỗi xảy ra khi hoàn thành yêu cầu!");
      }
    } catch (error) {
      console.error("Error in handleCompleteRequest:", error);
      alert("Có lỗi xảy ra khi hoàn thành yêu cầu thuốc!");
    }
  };

  // Get current requests based on active tab
  const getCurrentRequests = () => {
    if (activeTab === "pending") {
      return medicationRequests;
    } else if (activeTab === "assigned") {
      return assignedRequests;
    } else if (activeTab === "completed") {
      return completedRequests;
    } else if (activeTab === "all") {
      return allRequests;
    }
    return [];
  };

  // Filter requests based on search and date
  const filteredRequests = getCurrentRequests().filter((request) => {
    const matchesSearch =
      !searchTerm ||
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || request.requestDate === filterDate;

    return matchesSearch && matchesDate;
  });

  // Calculate stats from local data as fallback
  const calculateLocalStats = () => {
    const pendingCount = medicationRequests.length;
    const assignedCount = assignedRequests.length;
    const completedCount = completedRequests.length;
    const totalCount = allRequests.length;
    const todayString = new Date().toISOString().split("T")[0];
    const todayCount = allRequests.filter(
      (req) => req.requestDate === todayString
    ).length;

    return {
      pending: pendingCount,
      assigned: assignedCount,
      completed: completedCount,
      rejected: 0,
      today: todayCount,
      total: totalCount,
    };
  };

  // Update stats when local data changes
  useEffect(() => {
    if (!loading) {
      const localStats = calculateLocalStats();
      setStats((prevStats) => ({
        ...prevStats,
        ...localStats,
      }));
    }
  }, [
    medicationRequests,
    assignedRequests,
    completedRequests,
    allRequests,
    loading,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý yêu cầu thuốc
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem xét và phê duyệt các yêu cầu cấp thuốc từ phụ huynh
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ xử lý
              </p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã giao nhiệm vụ
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.assigned}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hôm nay
              </p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.today}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tất cả</p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiClipboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6 transition-colors duration-300">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "pending"
                    ? "bg-yellow-600 dark:bg-yellow-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setActiveTab("assigned")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "assigned"
                    ? "bg-green-600 dark:bg-green-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Đã giao nhiệm vụ
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "completed"
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Đã hoàn thành
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-purple-600 dark:bg-purple-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Tất cả
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thuốc
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Liều lượng
                </th>
                {/* Conditional column for assigned nurse */}
                {(activeTab === "assigned" ||
                  activeTab === "completed" ||
                  activeTab === "all") && (
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nhân viên Y tế
                  </th>
                )}
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  style={{ height: "80px" }}
                >
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {request.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex flex-col justify-center items-center min-h-[60px]">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {request.medicineName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.frequency}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      {request.dosage}
                    </div>
                  </td>
                  {/* Conditional column for assigned nurse */}
                  {(activeTab === "assigned" ||
                    activeTab === "completed" ||
                    activeTab === "all") && (
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="flex flex-col items-center justify-center min-h-[60px]">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {request.staffName || "N/A"}
                        </div>
                        {request.staff?.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {request.staff.email}
                          </div>
                        )}
                        {request.assignedDate && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            {new Date(request.assignedDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        )}
                        {activeTab === "completed" && request.completedDate && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Hoàn thành:{" "}
                            {new Date(request.completedDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      {new Date(request.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center min-h-[60px]">
                      {request.status === "pending" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                          <FiClock className="h-4 w-4" />
                          <span className="ml-1">Chờ xử lý</span>
                        </span>
                      ) : request.status === "assigned" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <FiCheckCircle className="h-4 w-4" />
                          <span className="ml-1">Đã giao nhiệm vụ</span>
                        </span>
                      ) : request.status === "completed" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <FiCheckCircle className="h-4 w-4" />
                          <span className="ml-1">Đã hoàn thành</span>
                        </span>
                      ) : request.status === "rejected" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                          <FiXCircle className="h-4 w-4" />
                          <span className="ml-1">Từ chối</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200">
                          <FiTablet className="h-4 w-4" />
                          <span className="ml-1">
                            {request.status || "Không xác định"}
                          </span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => {
                          console.log("Opening modal for request:", request);
                          console.log(
                            "medicineRequestItems in request:",
                            request.medicineRequestItems
                          );
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      {activeTab === "pending" &&
                        request.status === "pending" && (
                          <div className="relative action-dropdown">
                            <button
                              onClick={() => toggleActionDropdown(request.id)}
                              className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              Chọn hành động
                              <FiChevronDown className="ml-1 h-3 w-3" />
                            </button>
                            {showActionDropdown[request.id] && (
                              <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                                <div className="p-3">
                                  <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Chọn nhân viên y tế:
                                    </label>
                                    <select
                                      value={selectedNurse}
                                      onChange={(e) =>
                                        setSelectedNurse(e.target.value)
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                    >
                                      <option value="">
                                        -- Chọn nhân viên --
                                      </option>
                                      {availableNurses.map((nurse) => (
                                        <option
                                          key={nurse.staffId}
                                          value={nurse.staffId}
                                        >
                                          {nurse.firstName} {nurse.lastName} -{" "}
                                          {nurse.email}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        handleRequestAction(
                                          request.id,
                                          "approved",
                                          selectedNurse
                                        );
                                      }}
                                      disabled={!selectedNurse}
                                      className="flex-1 px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                      <FiCheck className="inline mr-1 h-3 w-3" />
                                      Gán
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      {activeTab === "assigned" &&
                        request.status === "assigned" && (
                          <button
                            onClick={() => {
                              const confirmed = window.confirm(
                                `Bạn có chắc chắn muốn đánh dấu yêu cầu thuốc cho ${request.studentName} là đã hoàn thành?`
                              );
                              if (confirmed) {
                                handleCompleteRequest(request.id);
                              }
                            }}
                            className="flex items-center px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
                          >
                            <FiCheckCircle className="mr-1 h-3 w-3" />
                            Hoàn thành
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FiTablet className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Không có yêu cầu nào
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "pending"
                ? "Chưa có yêu cầu thuốc nào đang chờ xử lý."
                : activeTab === "assigned"
                ? "Chưa có yêu cầu thuốc nào đã được gán cho nhân viên y tế. Click vào biểu tượng mắt để xem chi tiết thông tin nurse."
                : activeTab === "completed"
                ? "Chưa có yêu cầu thuốc nào đã hoàn thành."
                : "Chưa có yêu cầu thuốc nào trong hệ thống."}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 border border-gray-300 dark:border-gray-600 w-11/12 md:w-3/4 lg:w-3/5 xl:w-1/2 shadow-lg rounded-md bg-white dark:bg-neutral-800 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu #{selectedRequest.id}
                </h3>
                <button
                  onClick={() => {
                    console.log(
                      "Closing modal, selected request:",
                      selectedRequest
                    );
                    console.log(
                      "medicineRequestItems:",
                      selectedRequest.medicineRequestItems
                    );
                    setShowDetailModal(false);
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Thông tin cơ bản - compact grid */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Học sinh:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedRequest.studentName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {selectedRequest.studentId} • Lớp:{" "}
                        {selectedRequest.className}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Ngày yêu cầu:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date(
                          selectedRequest.requestDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Phụ huynh:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedRequest.parentName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nurse Information Section - Only show for assigned requests */}
                {selectedRequest.status === "assigned" && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Tên nhân viên:
                        </span>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedRequest.staffName || "N/A"}
                        </p>
                        {selectedRequest.staff && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {selectedRequest.staff.email || "N/A"}
                          </p>
                        )}
                      </div>
                      {selectedRequest.staff && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Số điện thoại:
                          </span>
                          <p className="text-gray-900 dark:text-gray-100">
                            {selectedRequest.staff.phone || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Medicine Items Table - Compact */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Danh sách thuốc yêu cầu
                  </h4>
                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                    <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            TÊN THUỐC
                          </th>
                          <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            LIỀU LƯỢNG
                          </th>
                          <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            TẦN SUẤT
                          </th>
                          <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            THỜI GIAN
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {selectedRequest.medicineRequestItems &&
                        selectedRequest.medicineRequestItems.length > 0 ? (
                          selectedRequest.medicineRequestItems.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                                  {item.medicineName}
                                </td>
                                <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                                  {item.dosage}
                                </td>
                                <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                                  {item.frequency}
                                </td>
                                <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                                  {item.timeOfDay}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center"
                            >
                              Không có thông tin thuốc
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Instructions - Compact */}
                  {selectedRequest.medicineRequestItems &&
                    selectedRequest.medicineRequestItems.some(
                      (item) => item.instructions
                    ) && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hướng dẫn sử dụng
                        </h5>
                        <div className="space-y-1">
                          {selectedRequest.medicineRequestItems.map(
                            (item, index) =>
                              item.instructions && (
                                <p
                                  key={index}
                                  className="text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 rounded"
                                >
                                  <strong>{item.medicineName}:</strong>{" "}
                                  {item.instructions}
                                </p>
                              )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Trạng thái và hướng dẫn đặc biệt - Compact */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Trạng thái:
                    </span>
                    <div>
                      {selectedRequest.status === "pending" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                          <FiClock className="h-3 w-3 mr-1" />
                          Chờ xử lý
                        </span>
                      ) : selectedRequest.status === "assigned" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <FiCheckCircle className="h-3 w-3 mr-1" />
                          Đã giao nhiệm vụ
                        </span>
                      ) : selectedRequest.status === "completed" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <FiCheckCircle className="h-3 w-3 mr-1" />
                          Đã hoàn thành
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200">
                          <FiInfo className="h-3 w-3 mr-1" />
                          {selectedRequest.status || "Không xác định"}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedRequest.instructions && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hướng dẫn đặc biệt:
                      </span>
                      <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                        {selectedRequest.instructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Details - Compact */}
                {selectedRequest.status === "approved" && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-md border border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-800 dark:text-green-200">
                      <p>
                        <strong>Phê duyệt bởi:</strong>{" "}
                        {selectedRequest.approvedBy}
                      </p>
                      <p>
                        <strong>Ngày phê duyệt:</strong>{" "}
                        {new Date(
                          selectedRequest.approvedDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                      {selectedRequest.approvalNotes && (
                        <p>
                          <strong>Ghi chú:</strong>{" "}
                          {selectedRequest.approvalNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.status === "rejected" && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md border border-red-200 dark:border-red-800">
                    <div className="text-xs text-red-800 dark:text-red-200">
                      <p>
                        <strong>Từ chối bởi:</strong>{" "}
                        {selectedRequest.rejectedBy}
                      </p>
                      <p>
                        <strong>Ngày từ chối:</strong>{" "}
                        {new Date(
                          selectedRequest.rejectedDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <strong>Lý do:</strong>{" "}
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex justify-end mt-4 space-x-2">
                {selectedRequest.status === "pending" && (
                  <div className="flex items-center space-x-2 w-full">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chọn nhân viên y tế:
                      </label>
                      <select
                        value={selectedNurse}
                        onChange={(e) => setSelectedNurse(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">-- Chọn nhân viên --</option>
                        {availableNurses.map((nurse) => (
                          <option key={nurse.staffId} value={nurse.staffId}>
                            {nurse.firstName} {nurse.lastName} - {nurse.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        handleRequestAction(
                          selectedRequest.id,
                          "approved",
                          selectedNurse
                        );
                        setShowDetailModal(false);
                      }}
                      disabled={!selectedNurse}
                      className="px-3 py-2 mt-5 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiCheck className="inline mr-1 h-4 w-4" />
                      Gán
                    </button>
                  </div>
                )}
                {selectedRequest.status === "assigned" && (
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Bạn có chắc chắn muốn đánh dấu yêu cầu thuốc cho ${selectedRequest.studentName} là đã hoàn thành?`
                      );
                      if (confirmed) {
                        handleCompleteRequest(selectedRequest.id);
                        setShowDetailModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <FiCheckCircle className="inline mr-1 h-4 w-4" />
                    Hoàn thành
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMedicationList;
