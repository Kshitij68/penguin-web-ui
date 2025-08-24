import React, { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import classNames from "classnames";

// ASSETS
import { FaRegCircleCheck } from "react-icons/fa6"

// COMPONENTS
import StepProgress from "../../components/common/StepProgress/StepProgress";
import Button from "../../components/common/Button/Button";
import SelectDatabase, { SelectDatabaseProps } from "./components/SelectDatabase/SelectDatabase";
import ConfigureAccess from "./components/ConfigureAccess/ConfigureAccess";
import SelectQuery, { SelectQueryProps } from "./components/SelectQuery/SelectQuery";
import Loader from "../../components/common/Loader/Loader";
import CreateStages from "./components/CreateStages/CreateStages";

// CONTEXT
import { INITIAL_FORM_STATE, useDataContext } from "../../context/DataContext";

// CONSTANTS & UTILS
import { FLOW_TYPES, FORM_STEPS } from "../../utils/constants";

// CSS
import "./Dashboard.scss";


const { STAGED_FLOW } = FLOW_TYPES

export type FormData = {
  report_name: string;
  database: string;
  query: string;
  stages?: any[];
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
  3: CreateStages
};

const Dashboard = () => {
  const [flow, setFlow] = useState("")
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

  const isStageFlow = flow === STAGED_FLOW;
  const isQueryStep = currentStep === 2;
  const isLastStep = isStageFlow ? currentStep - 1 === FORM_STEPS.length : currentStep === FORM_STEPS.length;

  const handleFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      setFormData(INITIAL_FORM_STATE);
      setFlow("")
      setCurrentStep(null)
    };
  }, []);

  const StepComponent = STEP_COMPONENTS[currentStep - 1];

  const getDisabledRule = useMemo(() => {
    switch (currentStep - 1) {
      case 0:
        return !formData.report_name || !formData.database;
      case 1:
        return !formData.query;
      case 3:
        return formData.stages.some(item =>
          Object.values(item).some(value =>
            (typeof value === 'string' && value === '') ||
            (Array.isArray(value) && value.length === 0)
          )
        );
      default:
        return false;
    }
  }, [formData, currentStep]);

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

  return (
    <div className="dashboard-container">
      {!flow || !currentStep ?
        <div className="flow-container">
          <span>Select a flow to continue. Steps will be shown next.</span>
          <h3>Choose report creation flow</h3>
          <div className="separator" />
          <div className="toggle-flow">
            {Object.values(FLOW_TYPES).map(value => {
              const isSelected = flow === value;
              return <div className={classNames("card", { selected: isSelected })} onClick={() => setFlow(value)}>
                <div>
                  <span>{value}</span>
                  <span></span>
                </div>

                {isSelected && <FaRegCircleCheck />}
              </div>
            })}
          </div>
          <div className="flex" style={{ marginTop: "40px" }}>
            <Button style={{ marginLeft: "auto" }} variant="outlined" disabled={!flow} onClick={() => setCurrentStep(1)}>Continue</Button>
          </div>

        </div> : <>
          <h3>Create New report</h3>
          <div className="form-container">
            <StepProgress steps={!isStageFlow ? FORM_STEPS : [...FORM_STEPS, { label: "Create stage" }]} currentStep={currentStep - 1} />
            <StepComponent handleFormData={handleFormData} formData={formData} />
            <div className="footer">
              {currentStep > 1 && (
                <Button onClick={() => setCurrentStep((prev) => prev - 1)}>
                  Previous
                </Button>
              )}
              <div>
                {isQueryStep && (
                  <Button
                    className="validate-button"
                    disabled={getDisabledRule}
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
                    disabled={getDisabledRule}
                  >
                    {isLastStep ? "Submit" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          </div></>
      }
      {loading ? <Loader /> : null}
      <Toaster position="top-left" />
    </div>
  );
};

export default Dashboard;
