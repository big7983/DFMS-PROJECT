// components/Step2.tsx
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Step1Props {
  formData: {
    course: string;
    location: string;
    datestart: string;
    dateend: string;
    objective: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  canProceed: boolean;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  handleChange,
  handleNextStep,
  canProceed,
}) => {
  useEffect(() => {
    console.log("Step 1 Data:", formData);
  }, [formData]);

  const router = useRouter();

  const handleClick = () => {
    router.push("/trainingform");
  };
  return (
    <motion.div
      //initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={handleNextStep}>
        <div className="mt-7 py-7 ">
          <div className="flex flex-col gap-9">
            {/* <!-- Contact Form --> */}
            <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
              <div className="border-b border-stroke px-4 sm:px-[50px] py-5.5 dark:border-strokedark">
                <h3 className="font-semibold text-black dark:text-white text-center sm:text-left">
                  ข้อมูลเกี่ยวกับหลักสูตร
                </h3>
              </div>
              <div className="py-6.5 px-4.5 sm:px-[50px]">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    ชื่อหลักสูตร
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    //placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 sm:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      วันที่เริ่มอบรม
                    </label>
                    <input
                      type="date"
                      name="datestart"
                      value={formData.datestart}
                      onChange={handleChange}
                      required
                      //placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      วันสุดท้ายของการอบรม
                    </label>
                    <input
                      type="date"
                      name="dateend"
                      value={formData.dateend}
                      onChange={handleChange}
                      required
                      //placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    สถานที่อบรม
                  </label>
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    //placeholder="Select subject"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    วัตถุประสงค์
                  </label>
                  <textarea
                    required
                    //rows={6}
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    //placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleClick}
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
                disabled={!canProceed}
                onClick={canProceed ? handleNextStep : undefined}
                className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${canProceed ? 'bg-meta-3 hover:bg-opacity-50' : 'bg-slate-300 '}`}
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

export default Step1;
