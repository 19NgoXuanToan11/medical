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
  disabled = false,
}) => {
  const inputClasses = `
    w-full focus:outline-none transition-all
    ${error ? "border-red-300 focus:border-red-400 focus:ring-red-300" : ""}
    ${disabled ? "opacity-70 cursor-not-allowed" : ""}
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
          disabled={disabled}
          className={inputClasses}
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
          disabled={disabled}
          className={inputClasses}
          placeholder={placeholder}
          rows="3"
        />
      );
    } else if (type === "radio" || type === "checkbox") {
      return (
        <div className="flex gap-6 mt-1">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type={type}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-700">
                {option.label}
              </span>
            </label>
          ))}
        </div>
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
          disabled={disabled}
          className={inputClasses}
          placeholder={placeholder}
        />
      );
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}{" "}
          {required && <span className="text-red-500 font-normal">*</span>}
        </label>
      )}

      {renderInput()}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
