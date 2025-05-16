import React from "react";

/**
 * Basic form input component
 */
const FormInput = ({
  id,
  name,
  label,
  value,
  type = "text",
  required = false,
  placeholder,
  onChange,
  className = "",
  error = "",
  options = [],
}) => {
  const inputClasses = `
    w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500
    ${error ? "border-red-300" : ""}
    ${className}
  `;

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          className={`${inputClasses} appearance-none`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (type === "textarea") {
      return (
        <textarea
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          className={inputClasses}
          placeholder={placeholder}
          rows="3"
        />
      );
    } else {
      return (
        <input
          id={id}
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          className={inputClasses}
          placeholder={placeholder}
        />
      );
    }
  };

  return (
    <div className="mb-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {renderInput()}

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
