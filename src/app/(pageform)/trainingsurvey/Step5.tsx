import Loader from "@/components/Loader";
import { Button } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

const Step5: React.FC<Step5Props> = ({
  formData,
  selectedUsers,
  handlePrevStep,
}) => {
  const router = useRouter();

  const date = new Date();
  const locale = "en-GB";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedDatetime = formatter.format(date);

  const options2: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formatter2 = new Intl.DateTimeFormat(locale, options2);
  const formattedDate = formatter2.format(date);

  console.log(formattedDate);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchdata(session.user.email);
    }
  }, [session?.user?.email]);

  const [user_id, setUserid] = useState("");
  const [employee_id, setEmployeeid] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [rank, setRank] = useState("");
  const [department, setdepartment] = useState("");
  const [approvers, setApprovers] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchdata = async (email: String) => {
    try {
      const res = await axios.get(`/api/user/select/${email}`);
      setUserid(res.data.id);
      setEmployeeid(res.data.employee_id);
      setName(res.data.name);
      setPosition(res.data.position);
      setRank(res.data.rank);
      setdepartment(res.data.department);
      const response = await axios.get(`/api/form/trainingsurvey/approved`); // เรียก API ตาม id_form
      setApprovers(response.data); // ตั้งค่า state ด้วยข้อมูลที่ได้รับ
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      const approversObject = approvers
        ? Object.entries(approvers).reduce((acc: any, [key, approver]) => {
            acc[approver.id] = {
              id: approver.id,
              sequence: approver.sequence,
              name: approver.name,
              department: approver.department,
              employee_id: approver.employee_id,
              rank: approver.rank,
              position: approver.position,
              status: "waiting", //approved, disapproved, waiting
              opinion: "test",
            };
            return acc;
          }, {})
        : {};

      const response = await axios.post("/api/form/trainingsurvey", {
        idform: "T002",
        name: "แบบขออนุมัติเข้ารับการอบรมสัมมนา",
        datesubmiss: formattedDate,
        requester_id: user_id,
        requester: {
          employee_id: employee_id,
          name: name,
          position: position,
          rank: rank,
          statusnoti: "",
          textnoti: "",
        },
        approver: approversObject,
        information: {
          course: formData.course,
          location: formData.location,
          datestart: formData.datestart,
          dateend: formData.dateend,
          objective: formData.objective,
        },
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
        status: {
          course: formData.course,
          datestart: formData.datestart,
          namerequester: name,
          department: department,
          workflow: "waiting",
          latestupdate: formattedDatetime,
        },
        active: true,
      });

      // Check if response is successful (status code 200)
      console.log("Training Form created:", response.data);

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
          router.push("/reporttrainingform");
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-9 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke  dark:border-strokedark">
          <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
            รายละเอียดทั้งหมด
          </h2>
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <div className="w-35">
              <label className=" block mb-1">วันยืนคำร้อง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {formattedDate}
                </label>
              </div>
            </div>
            <div className="w-35">
              <label className=" block mb-1">ผู้ยื่นคำร้อง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {name}
                </label>
              </div>
            </div>
            <div className="w-35">
              <label className=" block mb-1">สังกัดฝ่าย</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {department}
                </label>
              </div>
            </div>
            <div className="w-35">
              <label className=" block mb-1">ตำแหน่ง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {position}
                </label>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <h3 className="font-semibold text-black dark:text-white mb-4">
            ข้อมูลหลักสูตร
          </h3>
          <div className="mb-4.5 text-left">
            <label className="block font-medium mb-1">ชื่อหลักสูตร</label>
            <label className="font-medium text-black dark:text-white">
              {formData.course}
            </label>
          </div>
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
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

        <div>
          <div className="max-w-full overflow-x-auto">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              ผู้ประเมินแบบรายงาน
            </h3>
            <table className="min-w-full table-auto">
              <thead className="whitespace-nowrap">
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="text-center   p-4 font-medium text-black dark:text-white ">
                    ลำดับ
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
                {approvers &&
                  Object.entries(approvers).map(([key, approver]) => (
                    <tr className="pl-4 w-8" key={approver.sequence}>
                      <td className="text-center border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.sequence}
                        </h5>
                      </td>
                      <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.name}
                        </h5>
                      </td>
                      <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.rank}
                        </h5>
                      </td>
                      <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.position}
                        </h5>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
    </div>
  );
};

export default Step5;
