// components/Step1.tsx
import React from 'react';

interface Step1Props {
  formData: {
    email: string;
    name: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
  canProceed: boolean;
}

const Step1: React.FC<Step1Props> = ({ formData, handleChange, handleNextStep, canProceed }) => {
  return (
    <div>
      <h2>Step 1: Contact Information</h2>
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} />
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />
      <button onClick={handleNextStep} disabled={!canProceed}>Next</button>
    </div>
  );
};

export default Step1;
