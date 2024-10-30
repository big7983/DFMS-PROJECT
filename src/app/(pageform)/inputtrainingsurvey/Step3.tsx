import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface Step3Props {
  formData: { selectedOptions: string[] };

  handlePrevStep: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
}

const Step3: React.FC<Step3Props> = ({
  formData,
  handlePrevStep,
  handleChange,
  handleNextStep,
}) => {
  useEffect(() => {
    console.log("Step 4 Data:", formData);
  }, [formData]);

  // ฟังก์ชันในการเลือก checkbox และอัปเดตค่าไปยัง formData
  const handleCheckboxChange = (option: string) => {
    const updatedOptions = formData.selectedOptions.includes(option)
      ? formData.selectedOptions.filter((item) => item !== option) // Remove the option if it's already selected
      : [...formData.selectedOptions, option]; // Add the new option

    // Pass the updated options array directly to handleChange
    handleChange({
      target: {
        name: "selectedOptions",
        value: updatedOptions,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>); // Use 'unknown' to bypass type checking temporarily
  };

  // Function to handle the next step with validation
  const handleNext = () => {
    if (formData.selectedOptions.length === 0) {
      alert("กรุณาเลือกอย่างน้อยหนึ่งตัวเลือกเพื่อดำเนินการต่อ."); // Alert if no options are selected
    } else {
      handleNextStep(); // Proceed to the next step
    }
  };

  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {" "}
        {/* Prevent default form submission */}
        <div className="mt-7 py-7">
          <div className="flex flex-col gap-9">
            <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
              <div className="border-b border-stroke px-[50px] py-5.5 dark:border-strokedark">
                <h3 className="font-semibold text-black dark:text-white text-center sm:text-left">
                  วิธีเทคนิคที่ใช้ในการอบรม/สัมมนา
                </h3>
              </div>
              <div className="py-6.5 px-[50px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[
                    "บรรยาย",
                    "อภิปราย",
                    "แสดงความคิดเห็น/ปรึกษาหารือ",
                    "กิจกรรมกลุ่ม",
                    "แสดงบทบาท (Role-Play)",
                    "กรณีศึกษา (Case Study)",
                  ].map((option) => (
                    <label className="flex items-center space-x-2" key={option}>
                      <input
                        type="checkbox"
                        className="form-checkbox w-7 h-7 text-blue-600"
                        checked={formData.selectedOptions.includes(option)} // ตรวจสอบว่าถูกเลือกหรือไม่
                        onChange={() => handleCheckboxChange(option)} // เมื่อเปลี่ยนสถานะ checkbox
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center justify-center rounded-full bg-meta-6 px-7 py-4 text-center font-medium text-white hover:bg-opacity-40 lg:px-8 xl:px-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNext} // Call the new handleNext function
                disabled={formData.selectedOptions.length === 0} // Disable if no options are selected
                className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${formData.selectedOptions.length > 0 ? 'bg-meta-3 hover:bg-opacity-50' : 'bg-slate-300 '}`}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Step3;
