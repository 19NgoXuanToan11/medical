import React, { useState, useEffect, useMemo } from "react";
import {
  FiRefreshCw,
  FiCheck,
  FiX,
  FiClipboard,
  FiActivity,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import {
  filterRequestsByStatus,
  deduplicateRequests,
} from "../../../../utils/medicationRequestUtils";
import PendingVerification from "./PendingVerification";
import VerifiedRequests from "./VerifiedRequests";
import RefusedRequests from "./RefusedRequests";

const MedicineVerification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [refusedRequests, setRefusedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPendingRequests(),
        loadVerifiedRequests(),
        loadRefusedRequests(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadPendingRequests = async () => {
    try {
      // Use new API that filters by nurse's assigned grades
      const response = await medicationService.getPendingMedicationRequests();
      if (response.success && response.data) {
        setPendingRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setPendingRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned pending requests:", error);
      setPendingRequests([]);
    }
  };

  const loadVerifiedRequests = async () => {
    try {
      // Use new API that filters by nurse's assigned grades
      const response = await medicationService.getVerifiedMedicationRequests();
      if (response.success && response.data) {
        setVerifiedRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setVerifiedRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned verified requests:", error);
      setVerifiedRequests([]);
    }
  };

  const loadRefusedRequests = async () => {
    try {
      // Use API endpoint /api/MedicineRequest/refused
      const response = await medicationService.getRefusedMedicationRequests();
      if (response.success && response.data) {
        setRefusedRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setRefusedRequests([]);
      }
    } catch (error) {
      console.error("Error loading refused requests:", error);
      setRefusedRequests([]);
    }
  };

  // Function to get the correct count for each tab using new logic
  const getTabCount = (tabKey) => {
    try {
      // Combine all requests and remove duplicates by requestId
      const allRequestsRaw = [
        ...(pendingRequests || []),
        ...(verifiedRequests || []),
        ...(refusedRequests || []),
      ];

      // Deduplicate requests by requestId to prevent same request appearing multiple times
      const allRequests = deduplicateRequests(allRequestsRaw);

      const count = filterRequestsByStatus(allRequests, tabKey)?.length || 0;

      return count;
    } catch (error) {
      console.error("Error in getTabCount:", error);
      return 0;
    }
  };

  // Inject CSS styles for period indicators
  useEffect(() => {
    const styleId = "period-indicator-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .period-indicator {
          display: inline-block;
          font-weight: 500;
          border: 1px solid;
        }
        
        .status-pending {
          background-color: #fff3cd !important;
          color: #856404 !important;
          border-color: #ffeaa7 !important;
        }
        
        .status-verified {
          background-color: #d4edda !important;
          color: #155724 !important;
          border-color: #c3e6cb !important;
        }
        
        .status-refused {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          border-color: #f5c6cb !important;
        }
        
        .status-completed {
          background-color: #cce5ff !important;
          color: #004085 !important;
          border-color: #b3d7ff !important;
        }
        
        .status-failed {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          border-color: #f5c6cb !important;
        }
        
        .status-assigned {
          background-color: #e2e3e5 !important;
          color: #383d41 !important;
          border-color: #d6d8db !important;
        }
        
        .status-redo {
          background-color: #ffeaa7;
          color: #6c757d;
          border-color: #fdcb6e;
        }
        
        .status-unknown {
          background-color: #f8f9fa;
          color: #6c757d;
          border-color: #dee2e6;
        }
        
        .partially-refused-row {
          background-color: #fff3cd;
          border-left: 4px solid #f97316;
        }
        
        .fully-refused-row {
          background-color: #f8d7da;
          border-left: 4px solid #dc2626;
        }
        
        .partially-verified-row {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
        }
        
        .request-row-with-mixed-status {
          border-left: 4px solid #ffc107;
        }
        
        .refused-tab-button {
          transition: all 0.2s ease-in-out;
        }
        
        .refused-tab-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .refused-tab-button.active {
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
        }
        
        .period-status-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .period-status-item {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }
        
        .period-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid;
        }
        
        .status-text {
          font-size: 11px;
          color: #6c757d;
        }
        
        /* Dark mode styles */
        .dark .status-pending {
          background-color: #3d3d00;
          color: #ffeb3b;
          border-color: #5d5d00;
        }
        
        .dark .status-verified {
          background-color: #1b5e20;
          color: #4caf50;
          border-color: #2e7d32;
        }
        
        .dark .status-refused {
          background-color: #5d1a1a;
          color: #f44336;
          border-color: #7d2d2d;
        }
        
        .dark .status-completed {
          background-color: #1a237e;
          color: #2196f3;
          border-color: #303f9f;
        }
        
        .dark .partially-refused-row {
          background-color: #3d3d00;
          border-left: 4px solid #f44336;
        }
        
        .dark .fully-refused-row {
          background-color: #5d1a1a;
        }
        
        .dark .partially-verified-row {
          background-color: #1b5e20;
          border-left: 4px solid #4caf50;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Kiểm tra số lượng thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kiểm tra số lượng thuốc và xác nhận/từ chối yêu cầu thuốc
          </p>
        </div>
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 p-1 rounded-lg">
        {[
          { key: "pending", label: "Chờ kiểm tra", icon: FiClipboard },
          { key: "verified", label: "Đã xác nhận", icon: FiCheck },
          { key: "refused", label: "Đã từ chối", icon: FiX },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveSubTab(key);
            }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              activeSubTab === key
                ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeSubTab === key
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
              }`}
            >
              {getTabCount(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Render appropriate component based on active tab */}
      {activeSubTab === "pending" && (
        <PendingVerification
          pendingRequests={pendingRequests}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadAllData}
          onRequestUpdate={loadAllData}
        />
      )}

      {activeSubTab === "verified" && (
        <VerifiedRequests
          verifiedRequests={verifiedRequests}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadAllData}
          onRequestUpdate={loadAllData}
        />
      )}

      {activeSubTab === "refused" && (
        <RefusedRequests
          refusedRequests={refusedRequests}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadAllData}
          onRequestUpdate={loadAllData}
        />
      )}
    </div>
  );
};

export default MedicineVerification;
