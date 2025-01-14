import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

interface FormData {
  keycontent: string;
  remaining: string;
  matchesobjectives: string;
  course_result: string;
  course_reason: string;
  lecturer_result: string;
  lecturer_reason: string;
  document_result: string;
  document_reason: string;
  service_result: string;
  service_reason: string;
  selectedOptions: never[];
  // Add other necessary fields if needed
}
const steps = [
  {
    id: "Step 1",
    component: Step1,
    name: "เนื้อหา",
    fields: ["keycontent", "remaining", "matchesobjectives"] as Array<
      keyof FormData
    >,
  },
  {
    id: "Step 2",
    component: Step2,
    name: "ความเห็น",
    fields: [
      "course_result",
      "course_reason",
      "lecturer_result",
      "lecturer_reason",
      "document_result",
      "document_reason",
      "service_result",
      "service_reason",
    ] as Array<keyof FormData>,
  },
  {
    id: "Step 3",
    component: Step3,
    name: "เทคนิค",
    fields: ["selectedOptions"] as Array<keyof FormData>,
  },
  {
    id: "Step 4",
    component: Step4,
    name: "ตรวจสอบ",
    fields: [] as Array<keyof FormData>,
  },
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    keycontent: "",
    remaining: "",
    matchesobjectives: "",
    course_result: "",
    course_reason: "",
    lecturer_result: "",
    lecturer_reason: "",
    document_result: "",
    document_reason: "",
    service_result: "",
    service_reason: "",
    selectedOptions: [],
  });
  const [stepCompleted, setStepCompleted] = useState([false, false, false]); // สถานะการเสร็จสิ้นของแต่ละขั้นตอน

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (isStepComplete(currentStep)) {
      setStepCompleted((prev) => {
        const newStepCompleted = [...prev];
        newStepCompleted[currentStep] = true; // ทำเครื่องหมายว่าขั้นตอนนี้เสร็จแล้ว
        return newStepCompleted;
      });
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (step: number) => {
    return steps[step].fields.every((field: keyof FormData) => {
      const value = formData[field];
      return value !== "" && value !== null && value !== undefined;
    });
  };

  const canNavigateToStep = (step: number) => {
    // เช็คว่าได้ไปยังขั้นตอนนั้นๆ หรือยัง
    if (step === 0) return true; // สามารถไป Step 1 ได้เสมอ
    return stepCompleted[step - 1]; // ตรวจสอบสถานะของขั้นตอนก่อนหน้า
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 lg:flex lg:space-x-8 lg:space-y-0">
          {steps.map((step, index) => (
            <li
              key={step.name}
              className="lg:flex-1 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-10 py-5 rounded-[20px] cursor-pointer"
              onClick={() => canNavigateToStep(index) && setCurrentStep(index)}
            >
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors lg:border-l-0 lg:border-t-4 lg:pb-0 lg:pl-0 lg:pt-4">
                  <span className="text-sm font-medium text-primary transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 lg:border-l-0 lg:border-t-4 lg:pb-0 lg:pl-0 lg:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-primary">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors lg:border-l-0 lg:border-t-4 lg:pb-0 lg:pl-0 lg:pt-4">
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
