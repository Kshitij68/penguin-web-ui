import React from "react";

// COMPONENTS
import Field from "../../../../components/common/Field/Field";

// INTERFACE & TYPES
import { FormData } from "../../Dashboard";
import { useDataContext } from "../../../../context/DataContext";

export type SelectDatabaseProps = {
  formData: FormData;
  handleFormData: (key: string, value: string) => void;
};

const SelectDatabase: React.FC<SelectDatabaseProps> = ({
  formData,
  handleFormData,
}) => {
  const { databases } = useDataContext();
  return (
    <>
      <Field
        type="text"
        label="Report Name"
        value={formData.report_name}
        onChange={(e) => handleFormData("report_name", e.target.value)}
        name="report_name"
        placeholder="e.g Sales performance report"
      />
      <Field
        type="dropdown"
        label="Select Database"
        options={databases}
        value={formData.database}
        onChange={(e) => handleFormData("database", e.target.value)}
        name="database"
        placeholder="Choose a database"
      />
    </>
  );
};

export default SelectDatabase;
