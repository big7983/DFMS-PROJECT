import React, { useState } from "react";
import Swal from "sweetalert2";

interface FormData {
  objective: string;
  costEffectiveness: string;
  workBenefit: string;
  objectiveAlignment: string;
  futureRecommendation: string;
  reasonfutureRecommendation: string;
  additionalcomments: string;
}

type Props = {
  handleBack: () => void;
  handleSubmit: (formData: FormData) => void;
};

export default function SecondComponent({ handleBack, handleSubmit }: Props) {
  const [formData, setFormData] = useState({
    objective: "",
    costEffectiveness: "",
    workBenefit: "",
    objectiveAlignment: "",
    futureRecommendation: "",
    reasonfutureRecommendation: "",
    additionalcomments: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (group: keyof FormData, option: string) => {
    setFormData((prev) => ({ ...prev, [group]: option }));
  };


  const Submit = () => {
    Swal.fire({
      title: "ยืนยันการประเมินใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true, // สลับตำแหน่งปุ่ม
      confirmButtonColor: "#219653",
      cancelButtonColor: "#DC3545",
    }).then((result) => {
      if (result.isConfirmed) {
        onSubmit();
      }
    });
  };

  const onSubmit = () => {
    // ตรวจสอบว่าข้อมูลครบถ้วนก่อนที่จะทำการส่ง
    if (Object.values(formData).every((value) => value.trim() !== "")) {
      setError(null);
      handleSubmit(formData);
    } else {
      setError("กรุณากรอกข้อมูลให้ครบทุกฟิลด์");
      return;
    }
  };

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  return (
    <div className="font-inter text-base w-full p-4 md:w-[85%] xl:w-[70%] flex flex-col justify-between">
      <div className="flex flex-col gap-9 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke dark:border-strokedark">
          <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
            สำหรับผู้บังคับบัญชาประเมิน
          </h2>
        </div>

        <div className="border-b border-stroke dark:border-strokedark">
          <div className="mb-6">
            <label className="mb-3 block font-medium text-black dark:text-white">
              1. วัตถุประสงค์
              หรือประโยชน์ของการส่งพนักงานเข้ารับการอบรมในหลักสูตรข้างต้นนีที่คาดว่าจะได้รับ
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

        <div className="border-b border-stroke dark:border-strokedark">
          <label className="flex mb-10 items-center text-left font-medium text-black dark:text-white">
            2. จากการประเมินของท่าน ท่านคิดว่าผู้เข้ารับการอบรม
            ได้รับประโยชน์ในแต่ละด้าน มากน้อยเพียงใด
          </label>
          <div className="justify-between flex flex-col lg:flex-row mb-2 gap-3">
            <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
              ความสอดคล้องกับวัตถุประสงค์ของการส่งเข้าอบรม
            </label>
            <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
              {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio" // เปลี่ยนจาก checkbox เป็น radio
                    className="form-radio w-7 h-7 accent-primary ring-offset-white"
                    checked={formData.objectiveAlignment === option} // ตรวจสอบว่าถูกเลือกหรือไม่
                    onChange={() =>
                      handleRadioChange("objectiveAlignment", option)
                    } // เมื่อเปลี่ยนสถานะ radio
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="justify-between flex flex-col lg:flex-row mb-2 gap-3">
            <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
              ประโยชน์ที่ได้รับต่อการทำงาน
            </label>
            <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
              {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio" // เปลี่ยนจาก checkbox เป็น radio
                    className="form-radio w-7 h-7 accent-primary"
                    checked={formData.workBenefit === option} // ตรวจสอบว่าถูกเลือกหรือไม่
                    onChange={() => handleRadioChange("workBenefit", option)} // เมื่อเปลี่ยนสถานะ radio
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="justify-between flex flex-col lg:flex-row mb-2 gap-3">
            <label className="flex mb-4 items-center text-left font-medium text-black dark:text-white">
              ความคุ้มค่าเมื่อเทียบกับค่าธรรมเนียมในการอบรม
            </label>
            <div className="flex flex-col sm:flex-row gap-5 mb-6 text-black dark:text-white">
              {["ดีมาก", "ปานกลาง", "ต้องปรับปรุง"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio" // เปลี่ยนจาก checkbox เป็น radio
                    className="form-radio w-7 h-7 accent-primary"
                    checked={formData.costEffectiveness === option} // ตรวจสอบว่าถูกเลือกหรือไม่
                    onChange={() =>
                      handleRadioChange("costEffectiveness", option)
                    } // เมื่อเปลี่ยนสถานะ radio
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-stroke dark:border-strokedark ">
          <label className="mb-5 block font-medium text-black dark:text-white">
            3. ท่านคิดว่า
            บริษัทฯควรส่งพนักงานที่เกี่ยวข้องท่านอื่นเข้ารับการอบรม/สัมมนาในหลักสูตรนี้ในโอกาสต่อไปอีกหรือไม่
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-black dark:text-white">
            {["สมควรอย่างยิ่ง", "สมควร", "ไม่สมควร", "ไม่สมควรอย่างยิ่ง"].map(
              (option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio" // เปลี่ยนจาก checkbox เป็น radio
                    className="form-radio w-7 h-7 accent-primary"
                    checked={formData.futureRecommendation === option} // ตรวจสอบว่าถูกเลือกหรือไม่
                    onChange={() =>
                      handleRadioChange("futureRecommendation", option)
                    } // เมื่อเปลี่ยนสถานะ radio
                  />
                  <span>{option}</span>
                </label>
              )
            )}
          </div>
          <div className="mb-6">
            <label className="mb-1 block  font-medium text-black dark:text-white">
              เหตุผล
            </label>
            <textarea
              required
              //rows={6}
              name="reasonfutureRecommendation"
              value={formData.reasonfutureRecommendation}
              onChange={handleChange}
              //placeholder="Type your message"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
        </div>

        <div className="border-b border-stroke dark:border-strokedark">
          <div className="mb-6">
            <label className="mb-3 block  font-medium text-black dark:text-white">
              4. ความคิดเห็นหรือข้อเสนอแนะอื่น ๆ เพิ่มเติม
            </label>
            <textarea
              required
              //rows={6}
              name="additionalcomments"
              value={formData.additionalcomments}
              onChange={handleChange}
              //placeholder="Type your message"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between mt-10">
        <button
          className="inline-flex items-center justify-center rounded-full bg-meta-6 px-7 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={handleBack}
        >
          ย้อนกลับ
        </button>
        <button
className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${isFormComplete ? 'bg-meta-3 hover:bg-opacity-90' : 'bg-slate-300 '}`}          onClick={Submit}
          disabled={!isFormComplete}
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
