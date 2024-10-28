import React, { useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

interface Step4Props {
  formData: {
    course: string;
    location: string;
    datestart: string;
    dateend: string;
    objective: string;
    received?: number;
    remaining?: number;
    registration?: number;
    room?: number;
    transportation?: number;
    allowance?: number;
    other?: number;
    total: number;
  };
  selectedUsers: {
    id: number;
    name: string;
    section: string;
    department: string;
    employeeid: string;
    level: string;
    position: string;
    email: string;
    userid: string;
  }[];
  handlePrevStep: () => void;
}

const Step4: React.FC<Step4Props> = ({
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
  const formattedDate = formatter.format(date);
  console.log(formattedDate);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchdata(session.user.email);
    }
  }, [session?.user?.email]);

  const [user_id, setUserid] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [section, setsection] = useState("");
  const [department, setdepartment] = useState("");
  const [approvers, setApprovers] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchdata = async (email: string) => {
    try {
      const res = await axios.get(`/api/v2/user/select/${email}`);
      setUserid(res.data.id);
      setName(res.data.name);
      setPosition(res.data.position);
      setsection(res.data.section);
      setdepartment(res.data.department);
      const response = await axios.get(
        `/api/v3/trainingform/getlistapprover?section=${res.data.section}`
      ); // เรียก API ตาม id_form
      setApprovers(response.data); // ตั้งค่า state ด้วยข้อมูลที่ได้รับ
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // แสดง Loading spinner
    Swal.fire({
      title: "กำลังบันทึกข้อมูล...",
      html: '<div class="spinner"></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // จัดการข้อมูล approvers และ stakeholders
      const approversObject = approvers
        ? Object.entries(approvers).reduce((acc: any, [, approver], index) => {
            acc[index] = {
              id: approver.userid,
              name: approver.name,
              level: approver.level,
              position: approver.position,
              email: approver.email,
              approved: "pending",
              opinion: "",
            };
            return acc;
          }, {})
        : {};

      const stakeholdersObject = selectedUsers.reduce(
        (acc: any, user, index) => {
          acc[index] = {
            id: user.userid,
            employeeid: user.employeeid,
            name: user.name,
            level: user.level,
            position: user.position,
            email: user.email,
            acknowledged: user.userid === user_id,
          };
          return acc;
        },
        {}
      );

      let isfullyacknowledged; // ประกาศตัวแปรที่นี่เพื่อให้สามารถเข้าถึงได้จากทั้ง if และ else

      if (Object.values(stakeholdersObject).length <= 1) {
        const isUserAcknowledged = selectedUsers.reduce(
          (acc: boolean, user) => {
            return acc || user.userid === user_id; // ถ้า user.userid ตรงกับ user_id ให้ return true
          },
          false
        );
        isfullyacknowledged = isUserAcknowledged;
      } else {
        isfullyacknowledged = false; // ถ้ามีผู้มีส่วนได้ส่วนเสียมากกว่า 1 คน
      }

      // ส่งข้อมูลไปยัง API
      const success = await axios.post("/api/v3/trainingform", {
        idform: "T001",
        nameform: "แบบขออนุมัติเข้ารับการอบรมสัมมนา",
        datesubmiss: formattedDate,
        requester_id: user_id,
        requester_name: name,
        requester_section: section,
        requester_department: department,
        requester_position: position,
        approver: {
          member: approversObject,
          isfullyapproved: "pending", // กำหนดสถานะเริ่มต้น
        },
        stakeholders: {
          member: stakeholdersObject,
          isfullyacknowledged: isfullyacknowledged,
        },
        information: {
          course: formData.course,
          location: formData.location,
          datestart: inputformatDate(formData.datestart),
          dateend: inputformatDate(formData.dateend),
          objective: formData.objective,
        },
        budget: {
          received: formData.received,
          remaining: formData.remaining,
          registration: formData.registration,
          room: formData.room,
          transportation: formData.transportation,
          allowance: formData.allowance,
          other: formData.other,
          total: formData.total,
        },
        trainingstatus: "wait_stakeholders", // ตั้งค่า default status
      });

      return success
    } catch (error) {
      console.error("Error creating training form:", error);
      return false
    }
  };

  const sendemail = async () => {
    Swal.fire({
      title: "กำลังบันทึกข้อมูล...",
      html: '<div class="spinner"></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // สร้าง array สำหรับการส่งอีเมล
      // const emailPromises = selectedUsers.map(async (user) => {
      //   const response = await axios.post("/api/v3/sendemail", {
      //     recipient: user.email, // อีเมลผู้ใช้
      //     subject: `แจ้งเตือน: มีฟอร์มการฝึกอบรม ${formData.course} ให้คุณรับทราบการมีส่วนร่วม`, // หัวข้อ
      //     recieverName: user.name,
      //     message: `
      //     คุณได้รับเชิญเข้าร่วมการฝึกอบรม ${formData.course} กรุณาเข้าไปอ่านรายละเอียดและยืนยันการมีส่วนร่วม`, // เนื้อหา
      //   });
      //   console.log(`Email sent to ${user.email}: ${response.data.message}`);
      // });

      const hisporyPromises = selectedUsers.map(async (user) => {
        const response = await axios.patch("/api/v3/history", {
          userid: user.userid,
          formid: `newtrainingfrom`,
          fromname: "trainingfrom",
          nameuser: user.name,
          action: `คุณได้รับเชิญเข้าร่วมการฝึกอบรม ${formData.course} กรุณาเข้าไปอ่านรายละเอียดและยืนยันการมีส่วนร่วม`,
          requesterid: user_id,
        });
        console.log(`Email sent to ${user.email}: ${response.data.message}`);
      });
      // รอให้ส่งอีเมลทั้งหมดเสร็จสิ้น
      //const emailSuccess await Promise.all(emailPromises);
      const emailSuccess = true
      const hisporySuccess = await Promise.all(hisporyPromises);

      if(emailSuccess && hisporySuccess){
        return true
      }else{
        return false
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      return false
    }
  };

  const showAlert = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการบันทึกใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, บันทึก",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true, // สลับตำแหน่งปุ่ม
      confirmButtonColor: "#219653",
      cancelButtonColor: "#DC3545",
    });

    if (result.isConfirmed) {
      try {
        const submitSuccess = await handleSubmit(); // รอการทำงานของ handleSubmit สำเร็จ
        const emailSuccess = await sendemail(); // รอการทำงานของ sendemail สำเร็จ

        if (submitSuccess && emailSuccess) {
          // แสดงการแจ้งเตือนความสำเร็จ
          Swal.fire({
            title: "บันทึกสำเร็จ!",
            icon: "success",
            confirmButtonText: "กลับสู่หน้าหลัก",
            confirmButtonColor: "#219653",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/trainingform");
            }
          });
        } else {
          // ถ้ามีปัญหาในการทำงานใด ๆ
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#DC3545",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/trainingform");
            }
          });
        }
        
      } catch (error) {
        // แสดงข้อผิดพลาดถ้ามีปัญหาในการทำงาน
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#DC3545",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/trainingform");
          }
        });
        console.log(error);
      } 
    }
  };

  const inputformatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options); // 'en-GB' จะใช้รูปแบบวันที่เป็นวัน-เดือน-ปี
  };

  if (loading)
    return (
      <div className="mt-7 py-7">
        <Loader />
      </div>
    );

  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-9 border py-6.5 px-7 sm:px-[50px] border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke  dark:border-strokedark">
          <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
            รายละเอียดทั้งหมด
          </h2>
        </div>
        <div className="border-b border-stroke  dark:border-strokedark ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
            <div className="w-35">
              <label className=" block mb-1">วันยืนคำร้อง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {/* {new Date().toLocaleString("en-GB", {
                    timeZone: "Asia/Bangkok",
                  })} ,  */}
                  {formattedDate}
                </label>
              </div>
            </div>
            <div className="w-full">
              <label className=" block mb-1">ผู้ยื่นคำร้อง</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {name}
                </label>
              </div>
            </div>
            <div className="w-full">
              <label className=" block mb-1">สังกัด/ฝ่าย</label>
              <div className="w-full">
                <label className="text-black dark:text-white font-medium">
                  {department}/{section}
                </label>
              </div>
            </div>
            <div className="w-full">
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
          <div className=" grid grid-cols-1  lg:grid-cols-2 gap-2 ">
            <div>
              <label className=" block mb-1">วันที่เริ่มอบรม</label>
              <label className="text-left font-medium text-black dark:text-white">
                {inputformatDate(formData.datestart)}
              </label>
            </div>
            <div className="text-left ">
              <label className=" block mb-1">วันสุดท้ายของการอบรม</label>
              <label className="font-medium text-black dark:text-white">
                {inputformatDate(formData.dateend)}
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

        <div>
          <div className="max-w-full overflow-x-auto">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              ผู้อนุมัติแบบอบรม
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
                  Object.entries(approvers).map(([key, approver], index) => (
                    <tr className="pl-4 w-8" key={key}>
                      <td className="text-center border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {index + 1}
                        </h5>
                      </td>
                      <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.name}
                        </h5>
                      </td>
                      <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {approver.level}
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
                <tr className="pl-4 w-8" key={user.employeeid}>
                  <td className="text-center border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.employeeid}
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.name}
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.level}
                    </h5>
                  </td>
                  <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark ">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.position}
                    </h5>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-9">
        <button
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
          onClick={showAlert}
          className="inline-flex items-center justify-center rounded-full bg-meta-3 px-7 py-4 text-center font-medium text-white hover:bg-opacity-50 lg:px-8 xl:px-10"
        >
          <p className="text-xl">
            <IoSaveOutline />
          </p>{" "}
          <p className="ml-2 text-lg">บันทึก</p>
        </button>
      </div>
    </div>
  );
};

export default Step4;
