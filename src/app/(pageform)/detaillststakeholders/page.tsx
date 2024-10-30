"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { HiBadgeCheck } from "react-icons/hi";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { BiError, BiTime } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";

interface TrainingFormData {
  id: string;
  idform: string;
  nameform: string;
  datesubmiss: string;
  requester_id: string;
  requester_name: string;
  requester_section: string;
  requester_department: string;
  requester_position: string;
  latestupdate: string;
  active: boolean;
  trainingstatus: string;
  history: Array<{
    name: string;
    action: string;
    datetime: string;
  }>;
  stakeholders: {
    member: {
      [key: string]: {
        id: string;
        employeeid: string;
        name: string;
        level: string;
        position: string;
        email: string;
        acknowledged: boolean;
      };
    };
    isfullyacknowledged: boolean;
  };
  approver: {
    member: {
      [key: string]: {
        id: string;
        name: string;
        level: string;
        position: string;
        email: string;
        approved: string;
        opinion: string;
      };
    };
    isfullyapproved: string;
    approvalorder: {
      $numberLong: string;
    };
  };
  information: {
    course: string;
    location: string;
    datestart: string;
    dateend: string;
    objective: string;
  };
  budget: {
    received: number;
    remaining: number;
    registration: number;
    room: number;
    transportation: number;
    allowance: number;
    other: number;
    total: number;
  };
}

const Page = () => {
  const [data, setData] = useState<TrainingFormData[]>([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("search");

  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v3/trainingform/${id}`); // แก้ URL ตามที่ต้องการ
        setData(res.data); // สมมติว่า res.data เป็นข้อมูลที่คุณได้รับ
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUser = async (email: string) => {
      try {
        const resid = await axios.get(`/api/v2/user/select/justid/${email}`);
        setUser(resid.data.id);
        console.log("data id = ", resid.data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) {
      fetchData(id);
    }

    if (session?.user?.email) {
      fetchUser(session?.user?.email);
    }

    setLoading(false);
  }, [id, session?.user?.email]);

  const UpdateStatus = async (
    sid: string,
    formid: string,
    name: string,
    course: string
  ) => {
    try {
      // 1. แสดง SweetAlert2 แบบ loading
      Swal.fire({
        title: "กำลังโหลด...", // ข้อความที่แสดงในหัวข้อ
        html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
        allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
        showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
        didOpen: () => {
          Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
        },
      });

      // 2. เรียกใช้ axios.get เพื่ออัปเดตสถานะ
      const responstatus = await axios.patch(
        `/api/v3/trainingform/updatestatus/stakeholders`,
        {
          id: formid,
          stakeholderId: sid,
        }
      );

      const hisporyPromises = Object.values(data[0].stakeholders.member).map(
        async (user) => {
           await axios.patch("/api/v3/history", {
            userid: user.id,
            nameuser: name,
            action: `รับทราบการมีส่วนร่วมแล้วแบบคำร้อง  ${course} สำเร็จ `,
          });
          console.log(`Email sent to ${user.email}: ${formid} ${user.id}`);
         
        }   
      );

      const requesterFound = Object.values(data[0].stakeholders.member).some(
        (user) => user.id === data[0].requester_id
      );

      const responsehistory = await Promise.all(hisporyPromises);

      if (!requesterFound) {
        await axios.patch("/api/v3/history", {
          userid: data[0].requester_id,
          nameuser: name,
          action: `รับทราบการมีส่วนร่วมแล้วแบบคำร้อง ${course} สำเร็จ `,
        });
        console.log(`Email sent to requester: ${data[0].requester_id}`);
      }

      if (responstatus && responsehistory) {
        Swal.fire({
          title: "บันทึกสำเร็จ!",
          icon: "success",
          confirmButtonText: "กลับสู่หน้าหลัก",
          confirmButtonColor: "#219653",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/stakeholdersform");
          }
        });
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองอีกครั้งในภายหลัง", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองอีกครั้งในภายหลัง", "error");
    }
  };

  const handleSubmit = async (
    sid: string,
    formid: string,
    name: string,
    course: string
  ) => {
    Swal.fire({
      title: "ยืนยันการมีส่วนร่วมใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true, // สลับตำแหน่งปุ่ม
      confirmButtonColor: "#219653",
      cancelButtonColor: "#DC3545",
    }).then((result) => {
      if (result.isConfirmed) {
        UpdateStatus(formid, sid, name, course);
        console.log("update id ", id);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:w-[85%] xl:w-[75%] flex flex-col justify-between">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-9 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]"
        >
          <div className="border-b border-stroke dark:border-strokedark">
            <h2 className="font-semibold text-ml text-black dark:text-white mb-4">
              รายละเอียดทั้งหมด
            </h2>
          </div>

          <div className="border-b border-stroke dark:border-strokedark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
              <div className="w-35">
                <label className="block mb-1">วันยืนคำร้อง</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.datesubmiss}
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1">ผู้ยื่นคำร้อง</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.requester_name}
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1">สังกัดฝ่าย</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.requester_section}
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1">ตำแหน่ง</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.requester_position}
                  </label>
                </div>
              </div>
              <br />
            </div>
          </div>

          <div className="border-b border-stroke dark:border-strokedark ">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              ข้อมูลหลักสูตร
            </h3>
            <div className="mb-4.5 text-left">
              <label className="block font-medium mb-1">ชื่อหลักสูตร</label>
              <label className="font-medium text-black dark:text-white">
                {item.information.course}
              </label>
            </div>
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-2">
              <div>
                <label className="block mb-1">วันที่เริ่มอบรม</label>
                <label className="text-left font-medium text-black dark:text-white">
                  {item.information.datestart}
                </label>
              </div>
              <div className="text-left">
                <label className="block mb-1">วันสุดท้ายของการอบรม</label>
                <label className="font-medium text-black dark:text-white">
                  {item.information.dateend}
                </label>
              </div>
            </div>
            <div className="mt-4.5 text-left">
              <label className="block font-medium mb-1">สถานที่อบรม</label>
              <label className="font-medium text-black dark:text-white">
                {item.information.location}
              </label>
            </div>
            <div className="mt-4.5 text-left">
              <label className="block font-medium mb-1">วัตถุประสงค์</label>
              <label className="font-medium text-black dark:text-white">
                {item.information.objective}
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
                    {item.budget.received} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">งบประมาณคงเหลือ</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.remaining} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">ค่าลงทะเบียน</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.registration} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">ค่าที่พัก</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.room} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1" htmlFor="number2">
                  ค่าพาหนะ
                </label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.transportation} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">ค่าเบี้ยเลี้ยง</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.allowance} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">ค่าอื่น ๆ</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.other} บาท
                  </label>
                </div>
              </div>

              <div className="w-35 sm:text-right text-left">
                <label className=" block mb-1">รวมทั้งหมด</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.budget.total} บาท
                  </label>
                </div>
              </div>
            </div>
            <br />
          </div>

          <div className=" ">
            <div className="max-w-full overflow-x-auto">
              <h3 className="font-semibold text-black dark:text-white mb-4">
                ผู้อนุมัติแบบอบรม / สัมมนา
              </h3>
              <table className="min-w-full table-auto">
                <thead className="whitespace-nowrap">
                  <tr className="bg-gray-2 dark:bg-meta-4">
                    <th className="text-center p-4 font-medium text-black dark:text-white">
                      ลำดับ
                    </th>
                    <th className="text-left p-4 font-medium text-black dark:text-white">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="text-left p-4 font-medium text-black dark:text-white">
                      ระดับ
                    </th>
                    <th className="text-left p-4 font-medium text-black dark:text-white">
                      ตำแหน่ง
                    </th>
                    <th className="text-center p-4 font-medium text-black dark:text-white">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(item.approver.member)
                    .sort()
                    .map((approver, index: number) => (
                      <tr className="pl-4 w-8" key={index}>
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
                        <td className=" text-center border-b border-[#eee] p-4 dark:border-strokedark">
                          <h5 className="flex justify-center font-medium text-black dark:text-white">
                            {approver.approved === "approved" ? (
                              <HiBadgeCheck
                                className="fill-success"
                                size={24}
                              />
                            ) : approver.approved === "pending" ? (
                              <BiTime className="fill-warning" size={24} />
                            ) : approver.approved === "unapproved" ? (
                              <AiFillCloseCircle
                                className="fill-danger"
                                size={24}
                              />
                            ) : (
                              <BiError className="fill-danger" size={24} />
                            )}
                          </h5>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-b border-stroke  dark:border-strokedark ">
            <div className="mb-9">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 ">
                {Object.values(item.approver.member).map(
                  (approver, index: number) => (
                    
                      <div key={index}>
                        <label className="block mb-1">
                          ความเห็นหรือข้อแนะอื่น ๆ เพิ่มเติมจาก ผู้อนุมัติลำดับ {+index +1}
                        </label>
                        <label className="text-left font-medium text-black dark:text-white">
                          {approver.opinion === ""
                            ? "ยังไม่ได้พิจารณา"
                            : approver.opinion}
                        </label>
                      </div>
                      
                    
                  )
                )}
              </div>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              รายชื่อพนักงานทั้งหมดที่เข้ารับการอบรม
            </h3>
            <table className="min-w-full table-auto">
              <thead className="whitespace-nowrap">
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="text-center p-4 font-medium text-black dark:text-white">
                    รหัสพนักงาน
                  </th>
                  <th className="text-left p-4 font-medium text-black dark:text-white">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="text-left p-4 font-medium text-black dark:text-white">
                    ระดับ
                  </th>
                  <th className="text-left p-4 font-medium text-black dark:text-white">
                    ตำแหน่ง
                  </th>
                  <th className="text-center p-4 font-medium text-black dark:text-white">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(item.stakeholders.member).map((stakeholder) => (
                  <tr className="pl-4 w-8" key={stakeholder.id}>
                    <td className="text-center border-b border-[#eee] p-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {stakeholder.employeeid}
                      </h5>
                    </td>
                    <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {stakeholder.name}
                      </h5>
                    </td>
                    <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {stakeholder.level}
                      </h5>
                    </td>
                    <td className="text-left border-b border-[#eee] p-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {stakeholder.position}
                      </h5>
                    </td>
                    <td className=" text-center border-b border-[#eee] p-4 dark:border-strokedark">
                      <h5 className="flex justify-center font-medium text-black dark:text-white">
                        {stakeholder.acknowledged === false &&
                        stakeholder.id === user ? (
                          <button
                            className="bg-meta-3 text-white px-4 py-2 rounded-[20px]"
                            onClick={() =>
                              handleSubmit(
                                item.id,
                                stakeholder.id,
                                stakeholder.name,
                                item.information.course
                              )
                            }
                          >
                            ยืนยัน
                          </button>
                        ) : stakeholder.acknowledged === true ? (
                          <HiBadgeCheck className="fill-success" size={24} />
                        ) : stakeholder.acknowledged === false ? (
                          <BiTime className="fill-warning" size={24} />
                        ) : (
                          <BiError className="fill-danger" size={24} />
                        )}
                      </h5>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Page;
