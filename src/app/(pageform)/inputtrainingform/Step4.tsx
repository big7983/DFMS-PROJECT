import { Button } from "@mui/material";
import React from "react";
import { IoSaveOutline } from "react-icons/io5";
import Swal from "sweetalert2";

interface Step4Props {
  formData: {
    course: string;
    location: string;
    datestart: string;
    dateend: string;
    objective: string;
    received: number;
    remaining: number;
    registration: number;
    room: number;
    transportation: number;
    allowance: number;
    other: number;
    total: number;
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
        confirmButtonColor: "#219653"
      });
    }
  });
};

const Step4: React.FC<Step4Props> = ({
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
          <h3 className="font-semibold text-black dark:text-white mb-4">
            ประมาณการค่าใช้จ่าย
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">งบประมาณที่ได้รับ</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.received} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">งบประมาณคงเหลือ</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.remaining} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">ค่าลงทะเบียน</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.registration} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">ค่าที่พัก</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.room} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1" htmlFor="number2">
                ค่าพาหนะ
              </label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.transportation} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">ค่าเบี้ยเลี้ยง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.allowance} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">ค่าอื่น ๆ</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.other} บาท
                </label>
              </div>
            </div>

            <div className="w-35 sm:text-right text-left">
              <label className=" block mb-1">รวมทั้งหมด</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formData.total} บาท
                </label>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className="max-w-full overflow-x-auto">
          <h3 className="font-semibold text-black dark:text-white mb-4">
            รายชื่อพนักงานทั้งหมดที่เข้ารบการอบรม
          </h3>
          <table className="min-w-full table-auto">
            <thead className="whitespace-nowrap">
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="text-center   p-4 font-medium text-black dark:text-white ">
                  รหัสพนักงาน
                </th>
                <th className="text-left  p-4 font-medium text-black dark:text-white">
                  ชื่อ-นามสกุล
                </th>
                <th className="text-left   p-4 font-medium text-black dark:text-white">
                  ระดับ
                </th>
                <th className="text-left   p-4 font-medium text-black dark:text-white">
                  ตำแหน่ง
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedUsers.map((user) => (
                <tr className="pl-4 w-8" key={user.id}>
                  <td className="text-center border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      S2000
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.name}
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      Manager
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.department}
                    </h5>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Step4;
