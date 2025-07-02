import React, { useState } from 'react';
import {
    FiClipboard, FiClock, FiTool, FiInfo, FiChevronDown, FiChevronUp,
    FiActivity, FiEye, FiHeart, FiMaximize, FiUser, FiAlertCircle
} from 'react-icons/fi';
import { formatDuration } from '../../utils/healthCheckHelpers';

const HealthCheckItemsStep = ({
    formData,
    validationErrors,
    onCheckItemToggle,
    healthCheckItems,
    onInputChange
}) => {
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Group health check items by category
    const categorizedItems = healthCheckItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const categories = Object.keys(categorizedItems);

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'physical': return <FiActivity className="w-5 h-5" />;
            case 'vision': return <FiEye className="w-5 h-5" />;
            case 'cardiovascular': return <FiHeart className="w-5 h-5" />;
            case 'growth': return <FiMaximize className="w-5 h-5" />;
            case 'general': return <FiUser className="w-5 h-5" />;
            default: return <FiClipboard className="w-5 h-5" />;
        }
    };

    const getCategoryName = (category) => {
        const names = {
            'physical': 'Khám thể lực',
            'vision': 'Khám mắt',
            'cardiovascular': 'Khám tim mạch',
            'growth': 'Đo tăng trưởng',
            'general': 'Khám tổng quát'
        };
        return names[category] || category;
    };

    const getTotalSelectedTime = () => {
        return formData.checkItems.reduce((total, itemId) => {
            const item = healthCheckItems.find(h => h.id === itemId);
            return total + (item?.estimatedTime || 0);
        }, 0);
    };

    const getSelectedEquipment = () => {
        const equipment = new Set();
        formData.checkItems.forEach(itemId => {
            const item = healthCheckItems.find(h => h.id === itemId);
            if (item?.equipment) {
                item.equipment.forEach(eq => equipment.add(eq));
            }
        });
        return Array.from(equipment);
    };

    const filteredItems = selectedCategory === 'all'
        ? healthCheckItems
        : categorizedItems[selectedCategory] || [];

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FiClipboard className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-primary-900 dark:text-primary-200">Hạng mục đã chọn</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formData.checkItems.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-6 border border-success-200 dark:border-success-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FiClock className="h-8 w-8 text-success-600 dark:text-success-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-success-900 dark:text-success-200">Thời gian dự kiến</p>
                            <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                                {formatDuration(getTotalSelectedTime())}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-6 border border-warning-200 dark:border-warning-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FiTool className="h-8 w-8 text-warning-600 dark:text-warning-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-warning-900 dark:text-warning-200">Thiết bị cần</p>
                            <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{getSelectedEquipment().length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Error */}
            {validationErrors.checkItems && (
                <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 mr-2" />
                        <p className="text-sm text-error-600 dark:text-error-400">{validationErrors.checkItems}</p>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                        <FiClipboard className="mr-2" />
                        Chọn hạng mục khám sức khỏe
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Chọn các hạng mục kiểm tra phù hợp với mục tiêu khám sức khỏe
                    </p>
                </div>

                <div className="p-6">
                    {/* Category Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                                }`}
                        >
                            Tất cả ({healthCheckItems.length})
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${selectedCategory === category
                                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                                    }`}
                            >
                                {getCategoryIcon(category)}
                                <span className="ml-2">{getCategoryName(category)} ({categorizedItems[category].length})</span>
                            </button>
                        ))}
                    </div>

                    {/* Health Check Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.checkItems.includes(item.id)
                                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800'
                                    }`}
                                onClick={() => onCheckItemToggle(item.id)}
                            >
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={formData.checkItems.includes(item.id)}
                                        onChange={() => onCheckItemToggle(item.id)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded mt-1 bg-white dark:bg-neutral-900"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.name}
                                            </h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${item.category === 'physical' ? 'bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-300' :
                                                item.category === 'sensory' ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300' :
                                                    item.category === 'cardiovascular' ? 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-300' :
                                                        item.category === 'oral' ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300' :
                                                            'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300'
                                                }`}>
                                                {getCategoryName(item.category)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                                                <FiClock className="w-3 h-3 mr-1" />
                                                {item.estimatedTime} phút
                                            </div>
                                            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                                                <FiTool className="w-3 h-3 mr-1" />
                                                {item.equipment?.length || 0} thiết bị
                                            </div>
                                        </div>

                                        {/* Equipment details */}
                                        {item.equipment && item.equipment.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Thiết bị cần:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.equipment.slice(0, 2).map((eq, index) => (
                                                        <span key={index} className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded">
                                                            {eq}
                                                        </span>
                                                    ))}
                                                    {item.equipment.length > 2 && (
                                                        <span className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                            +{item.equipment.length - 2} khác
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Equipment Summary */}
            {formData.checkItems.length > 0 && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                            <FiTool className="mr-2" />
                            Thiết bị cần thiết
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getSelectedEquipment().map((equipment, index) => (
                                <div key={index} className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                                    <FiTool className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mr-2" />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{equipment}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Abnormality Protocol */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
                        <FiAlertCircle className="mr-2" />
                        Quy trình xử lý bất thường
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Mô tả quy trình xử lý khi phát hiện vấn đề sức khỏe
                    </p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="abnormalityProtocol" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                Quy trình xử lý bất thường <span className="text-error-600">*</span>
                            </label>
                            <textarea
                                id="abnormalityProtocol"
                                name="abnormalityProtocol"
                                value={formData.abnormalityProtocol}
                                onChange={(e) => onInputChange('abnormalityProtocol', e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${validationErrors.abnormalityProtocol
                                    ? 'border-error-300 dark:border-error-600 bg-error-50 dark:bg-error-900/20'
                                    : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900'
                                    } text-neutral-900 dark:text-neutral-100`}
                                placeholder="Mô tả chi tiết quy trình xử lý khi phát hiện bất thường trong quá trình khám sức khỏe..."
                            />
                            {validationErrors.abnormalityProtocol && (
                                <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                                    {validationErrors.abnormalityProtocol}
                                </p>
                            )}
                        </div>

                        {/* Suggested Protocol Templates */}
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Mẫu quy trình gợi ý:</h4>
                            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <button
                                    type="button"
                                    onClick={() => onInputChange('abnormalityProtocol', '1. Ghi nhận chi tiết vấn đề phát hiện\n2. Thông báo ngay cho y tá trưởng\n3. Liên hệ phụ huynh trong vòng 24h\n4. Lập phiếu chuyển tuyến nếu cần thiết\n5. Theo dõi và cập nhật tình trạng học sinh')}
                                    className="text-left w-full p-2 rounded border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <strong>Quy trình chuẩn:</strong> Ghi nhận - Báo cáo - Thông báo - Chuyển tuyến - Theo dõi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onInputChange('abnormalityProtocol', '1. Dừng ngay việc khám và đảm bảo an toàn cho học sinh\n2. Thực hiện sơ cứu ban đầu nếu cần\n3. Gọi cấp cứu 115 nếu tình trạng nghiêm trọng\n4. Thông báo ngay cho Ban Giám hiệu và phụ huynh\n5. Ghi chép đầy đủ diễn biến và biện pháp xử lý')}
                                    className="text-left w-full p-2 rounded border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    <strong>Quy trình khẩn cấp:</strong> Dừng khám - Sơ cứu - Gọi cấp cứu - Thông báo - Ghi chép
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-info-50 dark:bg-info-900/20 rounded-lg p-4 border border-info-200 dark:border-info-800">
                <div className="flex items-start">
                    <FiInfo className="flex-shrink-0 h-5 w-5 text-info-600 dark:text-info-400 mt-0.5" />
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-info-900 dark:text-info-200">Lưu ý về hạng mục khám</h4>
                        <div className="mt-2 text-sm text-info-800 dark:text-info-300">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Hạng mục khám sẽ được thực hiện theo thứ tự ưu tiên</li>
                                <li>Thời gian dự kiến đã bao gồm thời gian chuẩn bị và ghi chép</li>
                                <li>Một số hạng mục có thể cần thêm thời gian cho trẻ em nhỏ</li>
                                <li>Thiết bị sẽ được kiểm tra và hiệu chuẩn trước khi sử dụng</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthCheckItemsStep; 