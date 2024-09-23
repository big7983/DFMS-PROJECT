import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface Step2Props {
  formData: {
    received: number;
    remaining: number;
    registration: number;
    room: number;
    transportation: number;
    allowance: number;
    other: number;
    total: number;
  };
  handlePrevStep: () => void, 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  return (
    <motion.div
      //initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <form onSubmit={handleNextStep}>
        <div className="mt-7 py-7">
          <div className="flex flex-col gap-9">
            {/* <!-- Contact Form --> */}
            <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
              <div className="border-b border-stroke px-[50px] py-5.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  ข้อมูลเกี่ยวกับหลักสูตร
                </h3>
              </div>
              <div className="py-6.5 px-[50px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number2"
                    >
                      งบประมาณที่ได้รับ
                    </label>
                    <input
                      name="received"
                      id="received"
                      type="number"
                      value={formData.received}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number3"
                    >
                      งบประมาณคงเหลือ
                    </label>
                    <input
                      name="remaining"
                      type="number"
                      value={formData.remaining}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number4"
                    >
                      ค่าลงทะเบียน
                    </label>
                    <input
                      name="registration"
                      type="number"
                      value={formData.registration}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number5"
                    >
                      ค่าที่พัก
                    </label>
                    <input
                      name="room"
                      type="number"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number6"
                    >
                      ค่าพาหนะ
                    </label>
                    <input
                      name="transportation"
                      type="number"
                      value={formData.transportation}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number7"
                    >
                      ค่าเบี้ยเลี้ยง
                    </label>
                    <input
                      name="allowance"
                      type="number"
                      value={formData.allowance}
                      onChange={handleChange}
                      placeholder="Enter number"
                     className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number8"
                    >
                      ค่าอื่น ๆ รวม
                    </label>
                    <input
                      name="other"
                      type="number"
                      value={formData.other}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      className="text-black dark:text-white block mb-1"
                      htmlFor="number9"
                    >
                      รวมทั้งหมด
                    </label>
                    <input
                      name="total"
                      type="number"
                      value={formData.total}
                      onChange={handleChange}
                      placeholder="Enter number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button                
                type="button"
                onClick={handlePrevStep}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
              <button
                disabled={!canProceed}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Step2;
