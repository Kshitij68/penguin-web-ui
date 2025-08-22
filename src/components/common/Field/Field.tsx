import React, { ChangeEvent, useMemo, useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";

// CSS
import "./Field.scss";

interface DropdownOption {
  value: string;
  label: string;
}

interface FieldProps {
  label?: string;
  name: string;
  value: string | number; // Value can be string or number (e.g., for type="number")
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  errorMessage?: string; // Optional prop to display error messages
  disabled?: boolean;
  useDebounce?: boolean;
}

interface TextFieldProps extends FieldProps {
  type: "text" | "password" | "email" | "number" | "date"; // Other HTML input types
}

interface TextAreaFieldProps extends FieldProps {
  type: "textarea";
  rows?: number; // Specific for textarea
}

interface DropdownFieldProps extends FieldProps {
  type: "dropdown";
  options: DropdownOption[]; // Specific for dropdown
}

// Union type for all possible Field component props
type UnifiedFieldProps =
  | TextFieldProps
  | TextAreaFieldProps
  | DropdownFieldProps;

const Field: React.FC<UnifiedFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  errorMessage,
  disabled = false,
  useDebounce = false,
  ...rest // To capture type-specific props like 'options' or 'rows'
}) => {

  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const debouncedEmitChange = useMemo(() => {
    return debounce((e: ChangeEvent<any>) => {
      onChange(e);
    }, 500);
  }, [onChange]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const newVal = e.target.value;
      setInternalValue(newVal); // update immediately for UI

      if (useDebounce) {
        e.persist?.(); // keep event for debounce
        debouncedEmitChange(e);
      } else {
        onChange(e);
      }
    },
    [useDebounce, debouncedEmitChange, onChange]
  );

  const commonProps = {
    id: name, // Use name as id for accessibility
    name,
    value: internalValue,
    onChange: handleChange,
    placeholder,
    disabled,
    className: "field-input-element", // Common class for input, select, textarea
  };

  const renderInputField = () => {
    switch ((rest as UnifiedFieldProps).type) {
      case "text":
      case "password":
      case "email":
      case "number":
      case "date":
        return <input {...commonProps} type={(rest as TextFieldProps).type} />;
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={(rest as TextAreaFieldProps).rows || 4} // Default rows
          />
        );
      case "dropdown":
        const dropdownProps = rest as DropdownFieldProps;
        return (
          <select
            {...commonProps}
            className="field-input-element field-select-element" // Specific class for select
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}{" "}
            {dropdownProps.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null; // Should ideally not happen with union types, but good for safety
    }
  };

  return (
    <div
      className={`field-container ${errorMessage ? "field-container-error" : ""
        }`}
    >
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      {renderInputField()}
      {errorMessage && (
        <span className="field-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default Field;
