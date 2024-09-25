// components/Step2.tsx
import React from 'react';

interface Step2Props {
  formData: {
    address: string;
    city: string;
    state: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  canProceed: string;
}

const Step2: React.FC<Step2Props> = ({ formData, handleChange, handleNextStep, handlePrevStep, canProceed }) => {
  return (
    <div>
      <h2>Step 2: Address</h2>
      <label>Address:</label>
      <input type="text" name="address" value={formData.address} onChange={handleChange} />
      <label>City:</label>
      <input type="text" name="city" value={formData.city} onChange={handleChange} />
      <label>State:</label>
      <input type="text" name="state" value={formData.state} onChange={handleChange} />
      <button onClick={handlePrevStep}>Back</button>
      <button onClick={handleNextStep} disabled={!canProceed}>Next</button>
    </div>
  );
};

export default Step2;
