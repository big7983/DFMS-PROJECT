import { Button } from "@mui/material";
import React from "react";
import { IoSaveOutline } from "react-icons/io5";
import Swal from "sweetalert2";

interface Step5Props {
  formData: {
    course: string;
    location: string;
    datestart: string;
    dateend: string;
    objective: string;
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
    selectedOptions: string[];
  };
  selectedUsers: { id: number; name: string; department: string }[];
  handlePrevStep: () => void;
}

const showAlert = () => {
  Swal.fire({
    title: "คุณต้องการบันทึกใช่หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, บันทึก",
    cancelButtonText: "ยกเลิก",
    reverseButtons: true, // สลับตำแหน่งปุ่ม
    confirmButtonColor: "#219653",
    cancelButtonColor: "#DC3545",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "บันทึกสำเร็จ!",
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#219653",
      });
    }
  });
};

const Step5: React.FC<Step5Props> = ({
  formData,
  selectedUsers,
  handlePrevStep,
}) => {
  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-9 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke  dark:border-strokedark">
          <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
            รายละเอียดทั้งหมด
          </h2>
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <p>วันที่ยืนอนุมัติ: 22 Apr 2022</p>
          <br />
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <h3 className="font-semibold text-black dark:text-white mb-4">
            ข้อมูลหลักสูตร
          </h3>
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <div className="">
              <label className="block mb-1">ชื่อหลักสูตร</label>
              <label className="font-medium text-left text-black dark:text-white">
                {formData.course}
              </label>
            </div>
            <div>
              <label className=" block mb-1">วันที่เริ่มอบรม</label>
              <label className="text-left font-medium text-black dark:text-white">
                {formData.datestart}
              </label>
            </div>
            <div className="text-left ">
              <label className=" block mb-1">วันสุดท้ายของการอบรม</label>
              <label className="font-medium text-black dark:text-white">
                {formData.dateend}
              </label>
            </div>
          </div>
          <div className="mt-4.5 text-left">
            <label className="block font-medium mb-1">สถานที่อบรม</label>
            <label className="font-medium text-black dark:text-white">
              {formData.location}
            </label>
          </div>
          <div className="mt-4.5 text-left">
            <label className="block font-medium mb-1">วัตถุประสงค์</label>
            <label className="font-medium text-black dark:text-white">
              {formData.objective}
            </label>
          </div>
          <br />
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <h3 className="font-semibold text-black dark:text-white mb-9">
            รายงานผลการอบรม/สัมมนา
          </h3>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
            เนื้อหาสาระสำคัญโดยสรุปของผู้รายงาน
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {formData.keycontent}
            </label>
          </div>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
            เนื้อหาวิชาที่สอน สอดคล้องกับวัตถุประสงค์ของการอบรม ของผู้รายงาน
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {formData.remaining}
            </label>
          </div>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
              เทคนิคหริอวิธีที่ใช้ในการอบรม/สัมมนา
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {formData.matchesobjectives}
            </label>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพหลักสูตรหรือหัวข้อวิชา
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.course_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                เหตุผล
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.course_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพหลักสูตรหรือหัวข้อวิชา
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.lecturer_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                เหตุผล
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.lecturer_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพของเอกสารประกอบการอบรม
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.document_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                เหตุผล
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.document_reason}
              </label>
            </div>
          </div>

          <div className="mb-9 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพการบริการของสถาบันที่จัดฝึกอบรม
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.service_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                เหตุผล
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {formData.service_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block font-medium ">
              เทคนิคหริอวิธีที่ใช้ในการอบรม/สัมมนา
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {formData.service_reason}
            </label>
          </div>

          <br />
        </div>
      </div>
      <div className="flex justify-between mt-9">
        <Button
          onClick={handlePrevStep}
          variant="contained"
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
          onClick={showAlert}
          variant="contained"
          className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <p className="text-xl">
            <IoSaveOutline />
          </p>{" "}
          <p className="ml-2 text-lg">บันทึก</p>
        </Button>
      </div>
    </div>
  );
};

export default Step5;
