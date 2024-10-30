import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface Step2Props {
  formData: {
    received?: number;
    remaining?: number;
    registration?: number;
    room?: number;
    transportation?: number;
    allowance?: number;
    other?: number;
    total: number;
  };
  handlePrevStep: () => void;
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

  formData.total =
    0 +
    Number(formData.registration || 0) +
    Number(formData.room || 0) +
    Number(formData.transportation || 0) +
    Number(formData.allowance || 0) +
    Number(formData.other || 0);

  formData.remaining = Number(formData.received || 0) - formData.total;

  const checkremaining = formData.remaining >= 0;

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
                <h3 className="text-center sm:text-left font-semibold text-black dark:text-white">
                  งบประมาณ
                </h3>
              </div>
              <div className="py-6.5 px-4.5 sm:px-[50px]">
                <div className="border-b border-stroke dark:border-strokedark">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
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
                  </div>
                </div>
                <div className="border-b border-stroke dark:border-strokedark">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 my-5">
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
                        ค่าใช้จ่ายรวมทั้งหมด
                      </label>
                      <input
                        name="total"
                        type="number"
                        value={formData.total}
                        onChange={handleChange}
                        placeholder="Enter number"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="border-b border-stroke dark:border-strokedark">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
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
                        disabled
                        className={`w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter 
                      ${
                        formData.remaining < 0
                          ? "border-red "
                          : "border-stroke dark:border-form-strokedark"
                      }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center justify-center rounded-full bg-meta-6 px-7 py-4 text-center font-medium text-white hover:bg-opacity-50 lg:px-8 xl:px-10"
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
                onClick={
                  canProceed && checkremaining ? handleNextStep : undefined
                }
                disabled={!canProceed && checkremaining}
                className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${
                  canProceed && checkremaining
                    ? "bg-meta-3 hover:bg-opacity-50"
                    : "bg-slate-300 "
                }`}
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

export default Step2;
