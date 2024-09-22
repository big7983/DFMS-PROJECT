// components/MultiStepForm.tsx
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const steps = [
  {
    id: "Step 1",
    component: Step1,
    name: "information",
    fields: ["course", "location", "datestart", "dateend", "objective"],
  },
  {
    id: "Step 2",
    component: Step2,
    name: "budget",
    fields: [
      "received",
      "remaining",
      "registration",
      "room",
      "transportation",
      "allowance",
      "other",
      "total"
    ],
  },
  { id: "Step 3", component: Step3, name: "information3", fields: [] },
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    course: "",
    location: "",
    datestart: "",
    dateend: "",
    objective: "",
    received: 0,
    remaining: 0,
    registration: 0,
    room: 0,
    transportation: 0,
    allowance: 0,
    other: 0,
    total: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (step: number) => {
    return steps[step].fields.every((field: any) => formData[field]);
  };

  const canNavigateToStep = (step: number) => {
    if (step === 2) {
      // Ensure Step 1 and Step 2 are complete before going to Step 3
      return isStepComplete(0) && isStepComplete(1);
    }
    return isStepComplete(step);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li
              key={step.name}
              className="md:flex-1"
              onClick={() => canNavigateToStep(index) && setCurrentStep(index)}
            >
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <CurrentStepComponent
        formData={formData}
        handleChange={handleChange}
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        canProceed={isStepComplete(currentStep)}
      />
    </>
  );
};

export default MultiStepForm;
