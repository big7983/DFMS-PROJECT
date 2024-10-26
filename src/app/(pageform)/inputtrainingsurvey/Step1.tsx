import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Button } from "@mui/material";

interface BaseFormData {
  keycontent: string;
  remaining: string;
  matchesobjectives: string;
}

interface Step1Props {
  formData: BaseFormData;
  handlePrevStep: () => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void; // อัปเดตประเภทที่นี่
  handleNextStep: () => void;
  canProceed: boolean;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  handlePrevStep,
  handleChange,
  handleNextStep,
  canProceed,
}) => {
  useEffect(() => {
    console.log("Step 2 Data:", formData);
  }, [formData]);

  // ฟังก์ชันในการเลือก checkbox และอัปเดตค่าไปยัง formData
  const handleCheckboxChange = (option: string) => {
    const event = {
      target: {
        name: "remaining",
        value: option === formData.remaining ? "" : option, // ถ้าเลือกซ้ำจะยกเลิก
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(event); // เรียก handleChange เพื่ออัปเดต formData
  };

  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={handleNextStep}>
        <div className="mt-7 py-7">
          <div className="flex flex-col gap-9">
            <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
              <div className="border-b border-stroke px-[50px] py-5.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  เนื้อหา
                </h3>
              </div>
              <div className="py-6.5 px-[50px]">
                <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    วัตถุประสงค์ในการเข้าอบรม
                  </label>
                  <textarea
                    required
                    name="keycontent"
                    value={formData.keycontent}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
                <label className="mb-5 block text-sm font-medium text-black dark:text-white">
                  ท่านคิดว่าเนื้อหาที่สอน
                  สอดคล้องกับวัตถุประสงค์ของการอบรมในครั้งนี้หรือไม่
                </label>
                <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox w-7 h-7 text-blue-600"
                      checked={formData.remaining === "สอดคล้อง"} // ตรวจสอบว่าถูกเลือกหรือไม่
                      onChange={() => handleCheckboxChange("สอดคล้อง")} // เมื่อเปลี่ยนสถานะ checkbox
                    />
                    <span>สอดคล้อง</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox w-7 h-7 text-blue-600"
                      checked={formData.remaining === "ไม่สอดคล้อง"} // ตรวจสอบว่าถูกเลือกหรือไม่
                      onChange={() => handleCheckboxChange("ไม่สอดคล้อง")} // เมื่อเปลี่ยนสถานะ checkbox
                    />
                    <span>ไม่สอดคล้อง</span>
                  </label>
                </div>
                <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    ความรู้และประโยชน์ที่ได้รับจากการเข้ารับการอบรมในครั้งนี้ต่องานของท่าน
                  </label>
                  <textarea
                    required
                    name="matchesobjectives"
                    value={formData.matchesobjectives}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center justify-center rounded-full bg-meta-6 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
              </Button>
              <Button
                variant="contained"
                onClick={canProceed ? handleNextStep : undefined}
                disabled={!canProceed}
                className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Step1;
