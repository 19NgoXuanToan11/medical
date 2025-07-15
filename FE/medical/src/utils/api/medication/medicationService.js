import api from "../../staff/staffService";

// Medication Request API Service
export const medicationService = {
  // Create new medication request
  createMedicationRequest: async (requestData) => {
    try {
      const response = await api.post("/MedicineRequest", requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được gửi thành công",
      };
    } catch (error) {
      console.error("Error creating medication request:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể gửi yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all medication requests
  getAllMedicationRequests: async (params = {}) => {
    try {
      const response = await api.get("/MedicineRequest", { params });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication request by ID
  getMedicationRequestById: async (id) => {
    try {
      const response = await api.get(`/MedicineRequest/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication request by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update medication request status
  updateMedicationRequestStatus: async (id, statusData) => {
    try {
      const response = await api.put(
        `/MedicineRequest/${id}/status`,
        statusData
      );
      return {
        success: true,
        data: response.data,
        message: "Cập nhật trạng thái yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error updating medication request status:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật trạng thái yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Approve medication request
  approveMedicationRequest: async (id, approvalData) => {
    try {
      const requestData = {
        ...approvalData,
        status: "approved",
        approvedDate: new Date().toISOString(),
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được phê duyệt",
      };
    } catch (error) {
      console.error("Error approving medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể phê duyệt yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Reject medication request
  rejectMedicationRequest: async (id, rejectionData) => {
    try {
      const requestData = {
        ...rejectionData,
        status: "rejected",
        rejectedDate: new Date().toISOString(),
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã bị từ chối",
      };
    } catch (error) {
      console.error("Error rejecting medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể từ chối yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication requests by student code
  getMedicationRequestsByStudent: async (studentCode) => {
    try {
      const response = await api.get(`/MedicineRequest/student/${studentCode}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching medication requests by student:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc của học sinh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication requests progress by parent ID
  getMedicationRequestsByParent: async (parentId) => {
    try {
      const response = await api.get(
        `/Parent/${parentId}/medicine-request-progress`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc của phụ huynh thành công",
      };
    } catch (error) {
      console.error("Error fetching medication requests by parent:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc của phụ huynh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get pending medication requests
  getPendingMedicationRequests: async () => {
    try {
      const response = await api.get("/MedicineRequest/pending");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc chờ xử lý thành công",
      };
    } catch (error) {
      console.error("Error fetching pending medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc chờ xử lý",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get assigned medication requests
  getAssignedMedicationRequests: async () => {
    try {
      // First try to get all requests and filter by status
      const response = await api.get("/MedicineRequest");

      if (response.data) {
        // Filter for assigned status
        const assignedRequests = response.data.filter(
          (req) => req.status === "Assigned" || req.status === "assigned"
        );

        console.log("All requests from API:", response.data);
        console.log("Filtered assigned requests:", assignedRequests);

        // For any requests missing medicineRequestItems, fetch them individually
        const requestsWithCompleteData = await Promise.all(
          assignedRequests.map(async (request) => {
            if (
              !request.medicineRequestItems ||
              request.medicineRequestItems.length === 0
            ) {
              try {
                console.log(
                  `Fetching complete data for assigned request ${request.requestId}`
                );
                const detailResponse = await api.get(
                  `/MedicineRequest/${request.requestId}`
                );
                if (detailResponse.data) {
                  console.log(
                    `Complete data for request ${request.requestId}:`,
                    detailResponse.data
                  );
                  return { ...request, ...detailResponse.data };
                }
              } catch (error) {
                console.error(
                  `Error fetching detail for request ${request.requestId}:`,
                  error
                );
              }
            }
            return request;
          })
        );

        return {
          success: true,
          data: requestsWithCompleteData,
          message: "Lấy danh sách yêu cầu thuốc đã giao nhiệm vụ thành công",
        };
      }

      return {
        success: false,
        data: [],
        message: "Không có dữ liệu từ API",
      };
    } catch (error) {
      console.error("Error fetching assigned medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc đã giao nhiệm vụ",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get completed medication requests
  getCompletedMedicationRequests: async () => {
    try {
      // First try to get all requests and filter by status
      const response = await api.get("/MedicineRequest");

      if (response.data) {
        // Filter for completed status
        const completedRequests = response.data.filter(
          (req) => req.status === "Completed" || req.status === "completed"
        );

        console.log("All requests from API:", response.data);
        console.log("Filtered completed requests:", completedRequests);

        // For any requests missing medicineRequestItems, fetch them individually
        const requestsWithCompleteData = await Promise.all(
          completedRequests.map(async (request) => {
            if (
              !request.medicineRequestItems ||
              request.medicineRequestItems.length === 0
            ) {
              try {
                console.log(
                  `Fetching complete data for completed request ${request.requestId}`
                );
                const detailResponse = await api.get(
                  `/MedicineRequest/${request.requestId}`
                );
                if (detailResponse.data) {
                  console.log(
                    `Complete data for request ${request.requestId}:`,
                    detailResponse.data
                  );
                  return { ...request, ...detailResponse.data };
                }
              } catch (error) {
                console.error(
                  `Error fetching detail for request ${request.requestId}:`,
                  error
                );
              }
            }
            return request;
          })
        );

        return {
          success: true,
          data: requestsWithCompleteData,
          message: "Lấy danh sách yêu cầu thuốc đã hoàn thành thành công",
        };
      }

      return {
        success: false,
        data: [],
        message: "Không có dữ liệu từ API",
      };
    } catch (error) {
      console.error("Error fetching completed medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc đã hoàn thành",
        error: error.response?.data || error.message,
      };
    }
  },

  // Upload medication image
  uploadMedicationImage: async (file, type = "medication") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await api.post(
        "/MedicineRequest/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Tải lên hình ảnh thành công",
      };
    } catch (error) {
      console.error("Error uploading medication image:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tải lên hình ảnh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get failed medication requests
  getFailedMedicationRequests: async () => {
    try {
      // Use the specific failed requests endpoint
      const response = await api.get("/MedicineRequest/failed-requests");

      if (response.data) {
        console.log("Failed requests from API:", response.data);

        // For any requests missing medicineRequestItems, fetch them individually
        const requestsWithCompleteData = await Promise.all(
          response.data.map(async (request) => {
            if (
              !request.medicineRequestItems ||
              request.medicineRequestItems.length === 0
            ) {
              try {
                console.log(
                  `Fetching complete data for failed request ${request.requestId}`
                );
                const detailResponse = await api.get(
                  `/MedicineRequest/${request.requestId}`
                );
                if (detailResponse.data) {
                  console.log(
                    `Complete data for request ${request.requestId}:`,
                    detailResponse.data
                  );
                  return { ...request, ...detailResponse.data };
                }
              } catch (error) {
                console.error(
                  `Error fetching detail for request ${request.requestId}:`,
                  error
                );
              }
            }
            return request;
          })
        );

        return {
          success: true,
          data: requestsWithCompleteData,
          message: "Lấy danh sách yêu cầu thuốc thất bại thành công",
        };
      }

      return {
        success: false,
        data: [],
        message: "Không có dữ liệu từ API",
      };
    } catch (error) {
      console.error("Error fetching failed medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get rejected medication requests
  getRejectedMedicationRequests: async () => {
    try {
      // Use the specific refused requests endpoint
      const response = await api.get("/MedicineRequest/refused");

      if (response.data) {
        console.log("Refused requests from API:", response.data);

        // For any requests missing medicineRequestItems, fetch them individually
        const requestsWithCompleteData = await Promise.all(
          response.data.map(async (request) => {
            if (
              !request.medicineRequestItems ||
              request.medicineRequestItems.length === 0
            ) {
              try {
                console.log(
                  `Fetching complete data for refused request ${request.requestId}`
                );
                const detailResponse = await api.get(
                  `/MedicineRequest/${request.requestId}`
                );
                if (detailResponse.data) {
                  console.log(
                    `Complete data for request ${request.requestId}:`,
                    detailResponse.data
                  );
                  return { ...request, ...detailResponse.data };
                }
              } catch (error) {
                console.error(
                  `Error fetching detail for request ${request.requestId}:`,
                  error
                );
              }
            }
            return request;
          })
        );

        return {
          success: true,
          data: requestsWithCompleteData,
          message: "Lấy danh sách yêu cầu thuốc từ chối thành công",
        };
      }

      return {
        success: false,
        data: [],
        message: "Không có dữ liệu từ API",
      };
    } catch (error) {
      console.error("Error fetching refused medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc từ chối",
        error: error.response?.data || error.message,
      };
    }
  },

  // Retry failed medication request
  retryMedicationRequest: async (id, retryData) => {
    try {
      const requestData = {
        ...retryData,
        status: "pending",
        retryAttempts: (retryData.retryAttempts || 0) + 1,
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được thử lại thành công",
      };
    } catch (error) {
      console.error("Error retrying medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể thử lại yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Resubmit rejected medication request
  resubmitMedicationRequest: async (id, resubmitData) => {
    try {
      const requestData = {
        ...resubmitData,
        status: "pending",
        resubmittedDate: new Date().toISOString(),
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được gửi lại thành công",
      };
    } catch (error) {
      console.error("Error resubmitting medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể gửi lại yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication request statistics
  getMedicationRequestStats: async (dateRange = "today") => {
    try {
      const response = await api.get(
        `/MedicineRequest/stats?range=${dateRange}`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy thống kê yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication request stats:", error);
      return {
        success: false,
        data: {
          pending: 0,
          approved: 0,
          rejected: 0,
          failed: 0,
          total: 0,
        },
        message:
          error.response?.data?.message ||
          "Không thể lấy thống kê yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get available nurses
  getAvailableNurses: async () => {
    try {
      const response = await api.get("/MedicineRequest/available-nurses");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách y tá có sẵn thành công",
      };
    } catch (error) {
      console.error("Error fetching available nurses:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách y tá có sẵn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update medication request with selected staff
  updateMedicationRequestWithStaff: async (id, staffId, action, notes = "") => {
    try {
      // Use the specific assignment endpoint that preserves medicineRequestItems
      const response = await api.post(
        `/MedicineRequest/${id}/assign-nurse/${staffId}`
      );

      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được giao nhiệm vụ thành công",
      };
    } catch (error) {
      console.error("Error assigning medication request:", error);

      // Fallback to the old method if the new endpoint doesn't exist
      try {
        console.log("Assignment endpoint failed, trying fallback method");

        // First get the current request data to preserve all fields
        const currentRequest = await api.get(`/MedicineRequest/${id}`);

        if (currentRequest.data) {
          const requestData = {
            ...currentRequest.data, // Preserve all existing data including medicineRequestItems
            staffId: staffId,
            status: action === "approved" ? "Assigned" : action,
            assignedBy: staffId,
            assignedDate: new Date().toISOString(),
            assignmentNotes: notes,
          };

          const fallbackResponse = await api.put(
            `/MedicineRequest/${id}`,
            requestData
          );
          return {
            success: true,
            data: fallbackResponse.data,
            message: "Yêu cầu thuốc đã được giao nhiệm vụ thành công",
          };
        }
      } catch (fallbackError) {
        console.error("Error with fallback assignment:", fallbackError);
      }

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể giao nhiệm vụ yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Complete medication request
  completeMedicationRequest: async (id, staffId, notes = "") => {
    try {
      // Use the specific completion endpoint
      const response = await api.post(
        `/MedicineRequest/${id}/complete/${staffId}`,
        {
          completionNotes: notes,
          completedDate: new Date().toISOString(),
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được hoàn thành thành công",
      };
    } catch (error) {
      console.error("Error completing medication request:", error);

      // Fallback to the old method if the new endpoint doesn't exist
      try {
        console.log("Completion endpoint failed, trying fallback method");

        // First get the current request data to preserve all fields
        const currentRequest = await api.get(`/MedicineRequest/${id}`);

        if (currentRequest.data) {
          const requestData = {
            ...currentRequest.data, // Preserve all existing data including medicineRequestItems
            status: "Completed",
            completedBy: staffId,
            completedDate: new Date().toISOString(),
            completionNotes: notes,
          };

          const fallbackResponse = await api.put(
            `/MedicineRequest/${id}`,
            requestData
          );
          return {
            success: true,
            data: fallbackResponse.data,
            message: "Yêu cầu thuốc đã được hoàn thành thành công",
          };
        }
      } catch (fallbackError) {
        console.error("Error with fallback completion:", fallbackError);
      }

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể hoàn thành yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Record medicine administration
  recordMedicineAdministration: async (administrationData) => {
    try {
      // For now, use a generic endpoint. This should be replaced with actual API endpoint
      const response = await api.post(
        "/MedicineRequest/administration",
        administrationData
      );

      return {
        success: true,
        data: response.data,
        message: "Đã ghi nhận việc cho uống thuốc thành công",
      };
    } catch (error) {
      console.error("Error recording medicine administration:", error);

      // Fallback: update the request status to indicate administration has started
      try {
        const requestId = administrationData.requestId;
        if (requestId) {
          const updateData = {
            status: "Administered",
            administeredTime: administrationData.administeredTime,
            administrationStatus: administrationData.status,
            administrationNotes: administrationData.notes || "",
            administeredBy: administrationData.administeredByStaff?.staffId,
          };

          const fallbackResponse = await api.put(
            `/MedicineRequest/${requestId}/status`,
            updateData
          );
          return {
            success: true,
            data: fallbackResponse.data,
            message: "Đã ghi nhận việc cho uống thuốc thành công",
          };
        }
      } catch (fallbackError) {
        console.error(
          "Error with fallback administration recording:",
          fallbackError
        );
      }

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể ghi nhận việc cho uống thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Start administration for medication request
  startAdministrationRequest: async (id, staffId, notes = "") => {
    try {
      const response = await api.post(
        `/MedicineRequest/${id}/start-administration/${staffId}`,
        {
          administrationNotes: notes,
          startedDate: new Date().toISOString(),
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Đã bắt đầu quá trình cấp thuốc thành công",
      };
    } catch (error) {
      console.error("Error starting administration:", error);

      // Fallback to status update
      try {
        const currentRequest = await api.get(`/MedicineRequest/${id}`);
        if (currentRequest.data) {
          const requestData = {
            ...currentRequest.data,
            status: "Administering",
            administrationStartedBy: staffId,
            administrationStartedDate: new Date().toISOString(),
            administrationNotes: notes,
          };

          const fallbackResponse = await api.put(
            `/MedicineRequest/${id}`,
            requestData
          );
          return {
            success: true,
            data: fallbackResponse.data,
            message: "Đã bắt đầu quá trình cấp thuốc thành công",
          };
        }
      } catch (fallbackError) {
        console.error(
          "Error with fallback administration start:",
          fallbackError
        );
      }

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể bắt đầu quá trình cấp thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Start medication administration with full request result data
  startMedicationAdministration: async (requestId, staffId) => {
    try {
      const response = await api.post(
        `/MedicineRequest/${requestId}/start-administration/${staffId}`
      );

      return {
        success: true,
        data: response.data,
        message: "Đã bắt đầu quá trình cho uống thuốc thành công",
      };
    } catch (error) {
      console.error("Error starting medication administration:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể bắt đầu quá trình cho uống thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update time-based status for medication requests
  updateTimeBasedStatus: async () => {
    try {
      const response = await api.post(
        "/MedicineRequest/update-time-based-status"
      );

      return {
        success: true,
        data: response.data,
        message: "Cập nhật trạng thái theo thời gian thành công",
      };
    } catch (error) {
      console.error("Error updating time-based status:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật trạng thái theo thời gian",
        error: error.response?.data || error.message,
      };
    }
  },

  // ===== NEW FLOW FUNCTIONS =====

  // Verify medication request
  verifyRequest: async (id, staffId) => {
    try {
      const response = await api.post(`/MedicineRequest/${id}/verify`, staffId);
      return {
        success: true,
        data: response.data,
        message: "Xác nhận yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error verifying request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể xác nhận yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Refuse medication request
  refuseRequest: async (id, staffId, refusalReason) => {
    try {
      const response = await api.post(`/MedicineRequest/${id}/refuse`, {
        staffId,
        refusalReason,
      });
      return {
        success: true,
        data: response.data,
        message: "Từ chối yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error refusing request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể từ chối yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get verified medication requests
  getVerifiedMedicationRequests: async () => {
    try {
      const response = await api.get("/MedicineRequest/verified");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc đã xác nhận thành công",
      };
    } catch (error) {
      console.error("Error fetching verified requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc đã xác nhận",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get refused medication requests
  getRefusedMedicationRequests: async () => {
    try {
      const response = await api.get("/MedicineRequest/refused");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc bị từ chối thành công",
      };
    } catch (error) {
      console.error("Error fetching refused requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc bị từ chối",
        error: error.response?.data || error.message,
      };
    }
  },

  // Assign nurse to verified request
  assignNurseToRequest: async (requestId, staffId) => {
    try {
      const response = await api.post(
        `/MedicineRequest/${requestId}/assign-nurse/${staffId}`
      );
      return {
        success: true,
        data: response.data,
        message: "Giao nhiệm vụ cho y tá thành công",
      };
    } catch (error) {
      console.error("Error assigning nurse:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể giao nhiệm vụ cho y tá",
        error: error.response?.data || error.message,
      };
    }
  },

  // Start medication administration
  startMedicationAdministration: async (requestId, staffId) => {
    try {
      const response = await api.post(
        `/MedicineRequest/${requestId}/start-administration/${staffId}`
      );
      return {
        success: true,
        data: response.data,
        message: "Bắt đầu cho uống thuốc thành công",
      };
    } catch (error) {
      console.error("Error starting administration:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể bắt đầu cho uống thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get request results (In Progress requests)
  getRequestResults: async () => {
    try {
      const response = await api.get("/RequestResult");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách kết quả yêu cầu thành công",
      };
    } catch (error) {
      console.error("Error fetching request results:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách kết quả yêu cầu",
        error: error.response?.data || error.message,
      };
    }
  },

  // Administer medicine by frequency
  administerMedicineByFrequency: async (
    requestResultId,
    medicineRequestItemId,
    frequency,
    staffId,
    notes = ""
  ) => {
    try {
      const response = await api.post("/MedicineRequest/administer-frequency", {
        requestResultId,
        medicineRequestItemId,
        frequency,
        staffId,
        notes,
      });
      return {
        success: true,
        data: response.data,
        message: "Ghi nhận cho uống thuốc thành công",
      };
    } catch (error) {
      console.error("Error administering medicine:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể ghi nhận cho uống thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get progress info for medication
  getProgressInfo: async (requestResultId, medicineRequestItemId) => {
    try {
      const response = await api.get(
        `/MedicineRequest/${requestResultId}/progress/${medicineRequestItemId}`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin tiến độ thành công",
      };
    } catch (error) {
      console.error("Error fetching progress info:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy thông tin tiến độ",
        error: error.response?.data || error.message,
      };
    }
  },

  // Report medication failure
  reportMedicineFailure: async (
    requestResultId,
    medicineRequestItemId,
    frequency,
    failureReason,
    staffId
  ) => {
    try {
      const response = await api.post("/MedicineRequest/report-failure", {
        requestResultId,
        medicineRequestItemId,
        frequency,
        failureReason,
        staffId,
      });
      return {
        success: true,
        data: response.data,
        message: "Báo cáo thất bại thành công",
      };
    } catch (error) {
      console.error("Error reporting failure:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể báo cáo thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create re-request
  createReRequest: async (
    originalRequestResultId,
    reRequestReason,
    staffId
  ) => {
    try {
      const response = await api.post("/MedicineRequest/create-re-request", {
        originalRequestResultId,
        reRequestReason,
        staffId,
      });
      return {
        success: true,
        data: response.data,
        message: "Tạo yêu cầu lại thành công",
      };
    } catch (error) {
      console.error("Error creating re-request:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tạo yêu cầu lại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Mark request as failed
  markRequestAsFailed: async (requestResultId, reason) => {
    try {
      const response = await api.post(
        `/MedicineRequest/${requestResultId}/mark-failed`,
        reason
      );
      return {
        success: true,
        data: response.data,
        message: "Đánh dấu thất bại thành công",
      };
    } catch (error) {
      console.error("Error marking as failed:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể đánh dấu thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get re-requests for original request
  getReRequests: async (originalRequestResultId) => {
    try {
      const response = await api.get(
        `/MedicineRequest/${originalRequestResultId}/re-requests`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu lại thành công",
      };
    } catch (error) {
      console.error("Error fetching re-requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu lại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get failure summary
  getFailureSummary: async (requestResultId) => {
    try {
      const response = await api.get(
        `/MedicineRequest/${requestResultId}/failure-summary`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy tóm tắt thất bại thành công",
      };
    } catch (error) {
      console.error("Error fetching failure summary:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy tóm tắt thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get requests with frequency more than one
  getRequestsWithFrequencyMoreThanOne: async () => {
    try {
      const response = await api.get(
        "/MedicineRequest/frequency/more-than-one"
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy yêu cầu có tần suất nhiều buổi thành công",
      };
    } catch (error) {
      console.error("Error fetching frequency requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy yêu cầu có tần suất nhiều buổi",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get requests needing time of day
  getRequestsNeedingTimeOfDay: async (time) => {
    try {
      const response = await api.get(
        `/MedicineRequest/frequency/need-time-of-day?time=${time}`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy yêu cầu theo buổi thành công",
      };
    } catch (error) {
      console.error("Error fetching time-based requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy yêu cầu theo buổi",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Notification Service for Medication Requests
export const notificationService = {
  // Send notification to nurse about new medication request
  notifyNurseNewRequest: async (requestData) => {
    try {
      const notificationData = {
        type: "medication_request",
        title: "Yêu cầu cấp thuốc mới",
        message: `Phụ huynh của ${
          requestData.studentName || "học sinh"
        } đã gửi yêu cầu cấp thuốc ${requestData.medicineName}`,
        recipientRole: "nurse",
        isRead: false,
        createdAt: new Date().toISOString(),
        medicationRequestId: requestData.id || Date.now(),
      };

      // Store in localStorage for demo (in real app, use proper notification system)
      const existingNotifications = JSON.parse(
        localStorage.getItem("nurseNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "nurseNotifications",
        JSON.stringify(existingNotifications)
      );

      return {
        success: true,
        message: "Thông báo đã được gửi đến y tá",
      };
    } catch (error) {
      console.error("Error sending nurse notification:", error);
      return {
        success: false,
        message: "Không thể gửi thông báo đến y tá",
      };
    }
  },

  // Send notification to parent about request status
  notifyParentRequestStatus: async (requestId, action, notes, requestData) => {
    try {
      const notificationData = {
        type: "medication_response",
        title:
          action === "approved"
            ? "Yêu cầu thuốc được chấp thuận"
            : "Yêu cầu thuốc bị từ chối",
        message: `Yêu cầu cấp thuốc ${requestData.medicineName} cho ${
          requestData.studentName
        } đã ${action === "approved" ? "được chấp thuận" : "bị từ chối"}. ${
          notes ? `Ghi chú: ${notes}` : ""
        }`,
        recipientRole: "parent",
        studentId: requestData.studentId,
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

      return {
        success: true,
        message: "Thông báo đã được gửi đến phụ huynh",
      };
    } catch (error) {
      console.error("Error sending parent notification:", error);
      return {
        success: false,
        message: "Không thể gửi thông báo đến phụ huynh",
      };
    }
  },

  // Get notifications for current user
  getNotifications: async (role, userId = null) => {
    try {
      const storageKey =
        role === "nurse" ? "nurseNotifications" : "parentNotifications";
      const notifications = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      return {
        success: true,
        data: notifications,
        message: "Lấy danh sách thông báo thành công",
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        data: [],
        message: "Không thể lấy danh sách thông báo",
      };
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId, role) => {
    try {
      const storageKey =
        role === "nurse" ? "nurseNotifications" : "parentNotifications";
      const notifications = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      const updatedNotifications = notifications.map((notif) =>
        notif.createdAt === notificationId ? { ...notif, isRead: true } : notif
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

      return {
        success: true,
        message: "Đánh dấu thông báo đã đọc thành công",
      };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return {
        success: false,
        message: "Không thể đánh dấu thông báo đã đọc",
      };
    }
  },
};

export default medicationService;
