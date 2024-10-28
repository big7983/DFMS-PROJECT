import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface Step2Props {
  formData: {
    course_result: string;
    course_reason: string;
    lecturer_result: string;
    lecturer_reason: string;
    document_result: string;
    document_reason: string;
    service_result: string;
    service_reason: string;
  };
  handlePrevStep: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleNextStep: () => void;
  canProceed: boolean;
}

const Step2: React.FC<Step2Props> = ({
  formData,
  handlePrevStep,
  handleChange,
  handleNextStep,
  canProceed,
}) => {
  useEffect(() => {
    console.log("Step 2 Data:", formData);
  }, [formData]);

  // ฟังก์ชันในการเลือก radio button และอัปเดตค่าไปยัง formData
  const handleRadioChange = (group: string, option: string) => {
    handleChange({
      target: {
        name: group,
        value: option, // เก็บค่าเพียงตัวเดียว
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={handleNextStep}>
        <div className="mt-7 py-7">
          <div className="flex flex-col gap-9">
            <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px] ">
              <div className="border-b border-stroke px-[50px] py-5.5 dark:border-strokedark">
                <h3 className="font-semibold text-black dark:text-white text-center sm:text-left">
                  ความเห็น
                </h3>
              </div>
              <div className="py-6.5 px-[50px] flex flex-col gap-5">
                <div className="border-b border-stroke  dark:border-strokedark ">
                  <div className="justify-between flex flex-col lg:flex-row">
                    <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
                      คุณภาพหลักสูตรหรือหัวข้อวิชา
                    </label>
                    <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
                      {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio" // เปลี่ยนจาก checkbox เป็น radio
                            className="form-radio w-7 h-7 text-blue-600"
                            checked={formData.course_result === option} // ตรวจสอบว่าถูกเลือกหรือไม่
                            onChange={() =>
                              handleRadioChange("course_result", option)
                            } // เมื่อเปลี่ยนสถานะ radio
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      เหตุผล
                    </label>
                    <textarea
                      required
                      name="course_reason"
                      value={formData.course_reason}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>

                <div className="border-b border-stroke  dark:border-strokedark ">
                  <div className="justify-between flex flex-col lg:flex-row ">
                    <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
                      คุณภาพของวิทยากรผู้บรรยายโดยรวม
                    </label>
                    <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
                      {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio" // เปลี่ยนจาก checkbox เป็น radio
                            className="form-radio w-7 h-7 text-blue-600"
                            checked={formData.lecturer_result === option}
                            onChange={() =>
                              handleRadioChange("lecturer_result", option)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      เหตุผล
                    </label>
                    <textarea
                      required
                      name="lecturer_reason"
                      value={formData.lecturer_reason}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>

                <div className="border-b border-stroke  dark:border-strokedark ">
                  <div className="justify-between flex flex-col lg:flex-row ">
                    <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
                      คุณภาพของเอกสารประกอบการอบรม
                    </label>
                    <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
                      {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio" // เปลี่ยนจาก checkbox เป็น radio
                            className="form-radio w-7 h-7 text-blue-600"
                            checked={formData.document_result === option}
                            onChange={() =>
                              handleRadioChange("document_result", option)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      เหตุผล
                    </label>
                    <textarea
                      required
                      name="document_reason"
                      value={formData.document_reason}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <div className="justify-between flex flex-col lg:flex-row ">
                    <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
                      คุณภาพการบริการของสถาบันที่จัดฝึกอบรม
                    </label>
                    <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
                      {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio" // เปลี่ยนจาก checkbox เป็น radio
                            className="form-radio w-7 h-7 text-primary bg-primary"
                            checked={formData.service_result === option}
                            onChange={() =>
                              handleRadioChange("service_result", option)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-3 block font-medium text-black dark:text-white">
                      เหตุผล
                    </label>
                    <textarea
                      required
                      name="service_reason"
                      value={formData.service_reason}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center justify-center rounded-full bg-meta-6 px-7 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
              type="submit"
              className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${canProceed ? 'bg-meta-3 hover:bg-opacity-50' : 'bg-slate-300 '}`}
              disabled={!canProceed}
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
      </form>
    </motion.div>
  );
};

export default Step2;
