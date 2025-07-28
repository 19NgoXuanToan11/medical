import React from "react";
import {
  FiAlertTriangle,
  FiActivity,
  FiDroplet,
  FiHeart,
} from "react-icons/fi";

const HEALTH_EVENT_TEMPLATES = {
  tai_nan_te_nga: {
    id: "tai_nan_te_nga",
    name: "Tai nạn té ngã",
    icon: FiAlertTriangle,
    type: "injury",
    severity: "moderate",
    symptoms: "Đau đầu, chóng mặt, có thể có vết thương nhẹ",
    assessment: "Cần kiểm tra mức độ chấn thương",
    treatment: "Sơ cứu vết thương, theo dõi triệu chứng",
    followUpRequired: true,
    color:
      "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
  },
  ngo_doc_thuc_pham: {
    id: "ngo_doc_thuc_pham",
    name: "Ngộ độc thực phẩm",
    icon: FiActivity,
    type: "illness",
    severity: "moderate",
    symptoms: "Buồn nôn, đau bụng, tiêu chảy",
    assessment: "Nghi ngờ ngộ độc thực phẩm",
    treatment: "Cho uống nước, theo dõi triệu chứng",
    followUpRequired: true,
    color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  },
  dich_ung: {
    id: "dich_ung",
    name: "Dị ứng",
    icon: FiDroplet,
    type: "allergy",
    severity: "moderate",
    symptoms: "Nổi mẩn, ngứa, khó thở nhẹ",
    assessment: "Phản ứng dị ứng",
    treatment: "Cho uống thuốc kháng histamine",
    followUpRequired: true,
    color:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
  },
  benh_tim: {
    id: "benh_tim",
    name: "Vấn đề tim mạch",
    icon: FiHeart,
    type: "chronic",
    severity: "severe",
    symptoms: "Đau ngực, khó thở, tim đập nhanh",
    assessment: "Cần kiểm tra tim mạch khẩn cấp",
    treatment: "Gọi cấp cứu, theo dõi nhịp tim",
    followUpRequired: true,
    color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  },
};

const HealthEventTemplateSelector = ({
  selectedTemplate,
  onTemplateSelect,
}) => {
  return (
    <div className="health-event-template-selector">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Chọn mẫu sự cố y tế:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(HEALTH_EVENT_TEMPLATES).map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${template.color}`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.symptoms}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Đánh giá:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {template.assessment}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Xử lý:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {template.treatment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Lưu ý:</strong> Sau khi chọn mẫu, bạn có thể tùy chỉnh thông
          tin cho từng học sinh nếu cần thiết.
        </p>
      </div>
    </div>
  );
};

export default HealthEventTemplateSelector;
export { HEALTH_EVENT_TEMPLATES };
