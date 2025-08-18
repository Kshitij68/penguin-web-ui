import React from "react";
import Field from "../../../components/common/Field/Field";

// INTERFACE & TYPES
import { FormData } from "../Dashboard";

export type SelectQueryProps = {
  formData: FormData;
  handleFormData: (key: string, value: string) => void;
};

const SelectQuery: React.FC<SelectQueryProps> = ({
  formData,
  handleFormData,
}) => {
  return (
    <Field
      type="textarea"
      name="query"
      placeholder="enter the sql query"
      onChange={(e) => handleFormData("query", e.target.value)}
      value={formData.query}
      label="Enter SQL Query"
    />
  );
};

export default SelectQuery;
