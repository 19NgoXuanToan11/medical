import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 ${className}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export const DataRow = ({ label, value, type = "text", status = null }) => (
  <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
    <span className="text-neutral-600 dark:text-neutral-400 text-sm">
      {label}:
    </span>
    <div className="flex items-center gap-2">
      {type === "boolean" ? (
        <div className="flex items-center gap-1">
          {value ? (
            <FiCheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <FiXCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {value ? "Có" : "Không"}
          </span>
        </div>
      ) : (
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          {value || "N/A"}
        </span>
      )}
      {status && (
        <span className={`px-2 py-1 text-xs rounded-full ${status.className}`}>
          {status.label}
        </span>
      )}
    </div>
  </div>
);

export const EditableField = ({
  label,
  field,
  value,
  type = "text",
  placeholder = "",
  isEditing,
  editData,
  onInputChange,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        value={isEditing ? editData[field] : value}
        onChange={(e) => onInputChange(field, e.target.value)}
        disabled={!isEditing}
        rows={3}
        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:text-neutral-500 resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={isEditing ? editData[field] : value}
        onChange={(e) => onInputChange(field, e.target.value)}
        disabled={!isEditing}
        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-700 disabled:text-neutral-500"
        placeholder={placeholder}
      />
    )}
  </div>
);
