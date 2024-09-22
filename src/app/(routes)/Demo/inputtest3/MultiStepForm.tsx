// components/MultiStepForm.tsx
import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const steps = [
  { id: 'Step 1', component: Step1, fields: ['email', 'name'] },
  { id: 'Step 2', component: Step2, fields: ['address', 'city', 'state'] },
  { id: 'Step 3', component: Step3, fields: [] },
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
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
    return steps[step].fields.every((field) => formData[field]);
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
    <div>
      <nav>
        <ol className="flex space-x-4">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`cursor-pointer ${currentStep === index ? 'font-bold' : ''} ${canNavigateToStep(index) ? '' : 'text-gray-400'}`}
              onClick={() => canNavigateToStep(index) && setCurrentStep(index)}
            >
              {step.id}
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
    </div>
  );
};

export default MultiStepForm;
