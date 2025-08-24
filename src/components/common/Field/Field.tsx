import React, { ChangeEvent, useMemo, useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";
import { FaTimes } from "react-icons/fa"; // Added for the remove icon

// CSS
import "./Field.scss";

interface DropdownOption {
  value: string;
  label: string;
}

// BASE PROPS - Common to all field types
interface BaseFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

// PROPS FOR STANDARD FIELDS (text, textarea, dropdown)
interface StandardFieldProps extends BaseFieldProps {
  value: string | number;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  useDebounce?: boolean;
}

interface TextFieldProps extends StandardFieldProps {
  type: "text" | "password" | "email" | "number" | "date";
}

interface TextAreaFieldProps extends StandardFieldProps {
  type: "textarea";
  rows?: number;
}

interface DropdownFieldProps extends StandardFieldProps {
  type: "dropdown";
  options: DropdownOption[];
}

// PROPS FOR NEW MULTI-SELECT FIELD
interface MultiSelectDropdownFieldProps extends BaseFieldProps {
  type: "multiselect";
  options: DropdownOption[];
  value: string[]; // Value is an array of strings
  onChange: (name: string, value: string[]) => void; // Custom onChange handler
}

// Union type for all possible Field component props
type UnifiedFieldProps =
  | TextFieldProps
  | TextAreaFieldProps
  | DropdownFieldProps
  | MultiSelectDropdownFieldProps;

const Field: React.FC<UnifiedFieldProps> = (props) => {
  const { name, label, errorMessage, disabled, placeholder } = props;

  // --- RENDER LOGIC FOR MULTI-SELECT DROPDOWN ---
  if (props.type === "multiselect") {
    const { options, value: selectedValues, onChange } = props;

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
      if (selectedValue && !selectedValues.includes(selectedValue)) {
        onChange(name, [...selectedValues, selectedValue]);
      }
    };

    const handleRemove = (valueToRemove: string) => {
      onChange(name, selectedValues.filter((v) => v !== valueToRemove));
    };

    // Filter out already selected options from the dropdown
    const availableOptions = options.filter(
      (opt) => !selectedValues.includes(opt.value)
    );

    // Get full option objects for selected values to display labels in pills
    const selectedOptionsData = selectedValues.map(
      val => options.find(opt => opt.value === val) || { value: val, label: val }
    );

    return (
      <div
        className={`field-container ${errorMessage ? "field-container-error" : ""}`}
      >
        {label && <label className="field-label">{label}</label>}
        <div className="multiselect-container field-input-element">
          {selectedOptionsData.map((option) => (
            <div key={option.value} className="pill">
              <span className="pill-label">{option.label}</span>
              <button
                type="button"
                className="pill-remove-btn"
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <select
            id={name}
            value="" // Always reset to show the placeholder
            onChange={handleSelect}
            className="multiselect-select"
            disabled={disabled || availableOptions.length === 0}
          >
            <option value="" disabled>
              {placeholder || "Select..."}
            </option>
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {errorMessage && (
          <span className="field-error-message">{errorMessage}</span>
        )}
      </div>
    );
  }

  // --- RENDER LOGIC FOR ALL OTHER STANDARD FIELDS ---
  const { value, onChange, useDebounce = false, ...rest } = props;

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
      setInternalValue(e.target.value);

      if (useDebounce) {
        e.persist?.();
        debouncedEmitChange(e);
      } else {
        onChange(e);
      }
    },
    [useDebounce, debouncedEmitChange, onChange]
  );

  const commonProps = {
    id: name,
    name,
    value: internalValue,
    onChange: handleChange,
    placeholder,
    disabled,
    className: "field-input-element",
  };

  const renderInputField = () => {
    switch (rest.type) {
      case "text":
      case "password":
      case "email":
      case "number":
      case "date":
        return <input {...commonProps} type={rest.type} />;
      case "textarea":
        return (
          <textarea {...commonProps} rows={rest.rows || 4} />
        );
      case "dropdown":
        return (
          <select {...commonProps} className="field-input-element field-select-element">
            {placeholder && <option value="">{placeholder}</option>}
            {rest.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`field-container ${errorMessage ? "field-container-error" : ""}`}
    >
      {label && <label htmlFor={name} className="field-label">{label}</label>}
      {renderInputField()}
      {errorMessage && (
        <span className="field-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default Field;