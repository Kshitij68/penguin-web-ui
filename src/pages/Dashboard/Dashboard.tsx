import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// COMPONENTS
import StepProgress from "../../components/common/StepProgress/StepProgress";
import Button from "../../components/common/Button/Button";
import SelectDatabase from "./components/SelectDatabase/SelectDatabase";
import ConfigureAccess from "./components/ConfigureAccess/ConfigureAccess";
import SelectQuery from "./components/SelectQuery/SelectQuery";
import Loader from "../../components/common/Loader/Loader";

// CONTEXT
import { useDataContext } from "../../context/DataContext";

// TYPES & INTERFACES
import { SelectDatabaseProps } from "./components/SelectDatabase/SelectDatabase";
import { SelectQueryProps } from "./components/SelectQuery/SelectQuery";

// CSS
import "./Dashboard.scss";

const FORM_STEPS = [
  { label: "Select Database" },
  { label: "Enter Query" },
  { label: "Configure Access" },
];

export type FormData = {
  report_name: string;
  database: string;
  query: string;
};

type ComponentMap = {
  [key: number]:
    | React.FC<SelectDatabaseProps>
    | React.FC<SelectQueryProps>
    | React.FC<{}>;
};

const STEP_COMPONENTS: ComponentMap = {
  0: SelectDatabase,
  1: SelectQuery,
  2: ConfigureAccess,
};

const Dashboard = () => {
  const {
    data,
    validateQuery,
    roles,
    createReport,
    loading,
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
  } = useDataContext();

  const handleFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      setFormData({
        report_name: "",
        database: "",
        query: "",
      });
    };
  }, []);

  const StepComponent = STEP_COMPONENTS[currentStep];

  const getDisabledRule = (step: number) => {
    switch (step) {
      case 0:
        return !formData.report_name || !formData.database;
      case 1:
        return !formData.query;
      default:
        return false;
    }
  };

  const handleValidate = () => {
    validateQuery({
      query: formData.query,
      db_name: formData.database,
      onSuccess: () => {
        setCurrentStep((prev) => prev + 1);
      },
    });
  };

  const handleSubmit = () => {
    const finalPayload = {
      reportName: formData.report_name,
      sqlScript: formData.query,
      columns: data.map((column) => {
        const writableBy = [];
        for (const role of roles) {
          if (column[role.name]) {
            writableBy.push(role.id);
          }
        }
        return {
          name: column.item,
          type: column.data_type,
          writableBy,
        };
      }),
    };
    createReport({ payload: finalPayload });
  };

  const isQueryStep = currentStep === 1;
  const isLastStep = currentStep === FORM_STEPS.length - 1;

  return (
    <div className="dashboard-container">
      <h3>Create New report</h3>
      <div className="form-container">
        <StepProgress steps={FORM_STEPS} currentStep={currentStep} />
        <StepComponent handleFormData={handleFormData} formData={formData} />
        <div className="footer">
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep((prev) => prev - 1)}>
              Previous
            </Button>
          )}
          <div>
            {isQueryStep && (
              <Button
                className="validate-button"
                disabled={getDisabledRule(currentStep)}
                onClick={() => handleValidate()}
              >
                Validate
              </Button>
            )}
            {!isQueryStep && (
              <Button
                onClick={() =>
                  isLastStep
                    ? handleSubmit()
                    : setCurrentStep((prev) => prev + 1)
                }
                disabled={getDisabledRule(currentStep)}
              >
                {isLastStep ? "Submit" : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {loading ? <Loader /> : null}
      <Toaster position="top-left" />
    </div>
  );
};

export default Dashboard;
