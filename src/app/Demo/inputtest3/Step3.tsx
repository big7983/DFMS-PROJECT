// components/Step3.tsx
import React from 'react';

interface Step3Props {
  handlePrevStep: () => void;
}

const Step3: React.FC<Step3Props> = ({ handlePrevStep }) => {
  return (
    <div>
      <h2>Step 3: Confirmation</h2>
      <p>Your information has been submitted!</p>
      <button onClick={handlePrevStep}>Back</button>
    </div>
  );
};

export default Step3;
