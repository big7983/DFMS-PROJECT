import { Button } from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IoSaveOutline } from "react-icons/io5";
import Swal from "sweetalert2";

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

interface Step4Props {
  formData: FormData
  handlePrevStep: () => void;
}

const Step4: React.FC<Step4Props> = ({
  formData,
  handlePrevStep,
}) => {
  const router = useRouter();

  const date = new Date();
  const locale = "en-GB";
  // const options: Intl.DateTimeFormatOptions = {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  // };
  // const formatter = new Intl.DateTimeFormat(locale, options);
  // const formattedDatetime = formatter.format(date);

  const options2: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formatter2 = new Intl.DateTimeFormat(locale, options2);
  const formattedDate = formatter2.format(date);

  console.log(formattedDate);


  const searchParams = useSearchParams();
  const id = searchParams.get("search");

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
        handleSubmit();
      }
    });
  };

  const handleSubmit = async () => {
    Swal.fire({
      title: "กำลังบันทึกข้อมูล...", // ข้อความที่แสดงในหัวข้อ
      html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
      allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
      showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
      didOpen: () => {
        Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
      },
    });

    try {
      await axios.patch(`/api/v3/trainingsurvey/reporter/${id}`, {
        survey: {
          keycontent: formData.keycontent,
          matchesobjectives: formData.matchesobjectives,
          remaining: formData.remaining,
          course_result: formData.course_result,
          course_reason: formData.course_reason,
          lecturer_result: formData.lecturer_result,
          lecturer_reason: formData.lecturer_reason,
          document_result: formData.document_result,
          document_reason: formData.document_reason,
          service_result: formData.service_result,
          service_reason: formData.service_reason,
          selectedOptions: formData.selectedOptions,
        },
      });

      // Show success alert
      Swal.fire({
        title: "บันทึกสำเร็จ!",
        icon: "success",
        confirmButtonText: "กลับสู่หน้าหลัก",
        confirmButtonColor: "#219653",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "กำลังโหลด...", // ข้อความที่แสดงในหัวข้อ
            html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
            allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
            showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
            didOpen: () => {
              Swal.showLoading();
            },
          });
          router.push("/trainingsurvey");
        }
      });
    } catch (error) {
      console.error("Error creating training form:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <>
      <div className="mt-7 py-7">

        <div
          className="flex flex-col gap-9 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]"
        >
          <div className="border-b border-stroke  dark:border-strokedark">
            <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
              รายละเอียดทั้งหมด
            </h2>
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
                <label className="mb-3 block font-medium ">เหตุผล</label>
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
                <label className="mb-3 block font-medium ">เหตุผล</label>
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
                <label className="mb-3 block font-medium ">เหตุผล</label>
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
                <label className="mb-3 block font-medium ">เหตุผล</label>
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
                {formData.selectedOptions}
              </label>
            </div>

            <br />
          </div>          
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
    </>
  );
};

export default Step4;
