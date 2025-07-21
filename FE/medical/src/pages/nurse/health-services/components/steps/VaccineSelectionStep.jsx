import React, { useState, useEffect } from "react";
import {
  FiActivity,
  FiCheck,
  FiSearch,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { vaccineService } from "../../../../../utils/api/vaccination/vaccinationService";

const VaccineSelectionStep = ({
  formData,
  validationErrors,
  onInputChange,
}) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState(
    formData.vaccineId || null
  );

  // Load vaccines on component mount
  useEffect(() => {
    const loadVaccines = async () => {
      setLoading(true);
      try {
        const result = await vaccineService.getActiveVaccines();
        if (result.success) {
          setVaccines(result.data);
        } else {
          console.error("Failed to load vaccines:", result.message);
        }
      } catch (error) {
        console.error("Error loading vaccines:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVaccines();
  }, []);

  // Filter vaccines based on search term
  const filteredVaccines = vaccines.filter(
    (vaccine) =>
      vaccine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle vaccine selection
  const handleVaccineSelect = (vaccine) => {
    setSelectedVaccine(vaccine.vaccineId);
    onInputChange("vaccineId", vaccine.vaccineId);
    onInputChange("vaccineName", vaccine.name);
    onInputChange("vaccineInfo", {
      id: vaccine.vaccineId,
      name: vaccine.name,
      manufacturer: vaccine.manufacturer,
      type: vaccine.type,
      dose: vaccine.dose,
      administrationMethod: vaccine.administrationMethod,
      batchNumber: vaccine.batchNumber,
      expiryDate: vaccine.expiryDate,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">
          Đang tải danh sách vaccine...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
          <FiActivity className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Chọn Vaccine Tiêm Chủng
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Chọn loại vaccine muốn tổ chức tiêm chủng cho học sinh
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm vaccine theo tên, nhà sản xuất..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg 
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
      </div>

      {/* Validation Error */}
      {validationErrors.vaccineId && (
        <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-red-700 dark:text-red-300">
            {validationErrors.vaccineId}
          </span>
        </div>
      )}

      {/* Selected Vaccine Summary */}
      {selectedVaccine && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FiCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <span className="font-medium text-primary-900 dark:text-primary-100">
              Đã chọn vaccine
            </span>
          </div>
          {formData.vaccineInfo && (
            <div className="text-sm text-primary-800 dark:text-primary-200">
              <p className="font-medium">{formData.vaccineInfo.name}</p>
              <p>Nhà sản xuất: {formData.vaccineInfo.manufacturer}</p>
              <p>Liều lượng: {formData.vaccineInfo.dose}</p>
            </div>
          )}
        </div>
      )}

      {/* Vaccine List */}
      <div className="space-y-3">
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
          Danh sách vaccine có sẵn ({filteredVaccines.length})
        </h4>

        {filteredVaccines.length === 0 ? (
          <div className="text-center py-8">
            <FiInfo className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm
                ? "Không tìm thấy vaccine phù hợp"
                : "Không có vaccine nào"}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {filteredVaccines.map((vaccine) => (
              <div
                key={vaccine.vaccineId}
                onClick={() => handleVaccineSelect(vaccine)}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedVaccine === vaccine.vaccineId
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 hover:bg-primary-25 dark:hover:bg-primary-900/10"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {vaccine.name}
                      </h5>
                      {selectedVaccine === vaccine.vaccineId && (
                        <FiCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 ml-2" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                      <div>
                        <span className="font-medium">Nhà sản xuất:</span>
                        <br />
                        {vaccine.manufacturer || "Chưa xác định"}
                      </div>
                      <div>
                        <span className="font-medium">Liều lượng:</span>
                        <br />
                        {vaccine.dose || "Theo hướng dẫn"}
                      </div>
                      <div>
                        <span className="font-medium">Cách tiêm:</span>
                        <br />
                        {vaccine.administrationMethod || "Tiêm bắp"}
                      </div>
                      <div>
                        <span className="font-medium">Mô tả: </span>
                        <br />
                        {vaccine.description || "Không có mô tả"}
                      </div>
                    </div>

                    {vaccine.batchNumber && (
                      <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                        Lô sản xuất: {vaccine.batchNumber}
                        {vaccine.expiryDate && (
                          <span className="ml-2">
                            | HSD:{" "}
                            {new Date(vaccine.expiryDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    {vaccine.stockQuantity !== undefined && (
                      <div className="mt-2">
                        <span
                          className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${
                            vaccine.stockQuantity > 50
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : vaccine.stockQuantity > 0
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }
                        `}
                        >
                          Tồn kho: {vaccine.stockQuantity} liều
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineSelectionStep;
