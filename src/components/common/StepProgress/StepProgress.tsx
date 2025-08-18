import React from "react";
import classNames from "classnames";

// CSS
import "./StepProgress.scss";

type Step = {
  label: string;
};

type StepProgressProps = {
  steps: Step[];
  currentStep: number;
};

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="step-container">
      {steps.map((item, index) => {
        const visited = index <= currentStep;
        const stepClass = classNames("step", {
          visited,
        });

        const circleClass = classNames("circle", {
          visitedCircle: visited,
        });

        const lineClass = classNames("line", {
          visitedLine: index <= currentStep - 1,
        });

        return (
          <div key={index} className="stepWrapper">
            <div className={stepClass}>
              <div className={circleClass}>{index + 1}</div>
              <div className="label">{item.label}</div>
            </div>
            {index < steps.length - 1 && <div className={lineClass} />}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
