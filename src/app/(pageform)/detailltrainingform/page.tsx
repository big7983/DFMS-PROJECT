"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { HiBadgeCheck } from "react-icons/hi";
import { HiExclamationCircle } from "react-icons/hi";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Props = {};

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

export default function page({}: Props) {
  const [data, setData] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("search");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const res = await axios.get(`/api/v3/trainingform/${id}`); // แก้ URL ตามที่ต้องการ
        setData(res.data); // สมมติว่า res.data เป็นข้อมูลที่คุณได้รับ
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  const showAlert = () => {
    Swal.fire({
      title: "คุณต้องการส่งแบบประเมินให้ผู้มีส่วนร่วมใช่หรือไม่ ?",
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
      // ฟังก์ชัน trainingsurveyData เพื่อทำการ POST ข้อมูล
      const trainingsurveyData = async (data: any) => {
        // ใช้ Promise.all เพื่อรอให้ axios.post เสร็จในแต่ละการเรียก
        await Promise.all(
          Object.values(data).map(async (item: any) => {
            // ใช้ Object.values กับ stakeholders
            const stakeholders = Object.values(item.stakeholders?.member || {});

            // ส่ง axios.post ตามจำนวน stakeholders
            return Promise.all(
              stakeholders.map(async (stakeholder: any) => {
                // สร้างข้อมูลที่ต้องการส่งไป
                const postData = {
                  trainingform_id: item.id || "ไม่มีข้อมูล",
                  reporter_id: stakeholder.id || "ไม่มีข้อมูล",
                  reporter_name: stakeholder.name || "ไม่มีข้อมูล",
                  reporter_level: stakeholder.level || "ไม่มีข้อมูล",
                  reporter_position: stakeholder.position || "ไม่มีข้อมูล",
                  reporter_email: stakeholder.email || "ไม่มีข้อมูล",
                };

                await axios.post("/api/v3/sendemail", {
                  recipient: stakeholder.email, // อีเมลผู้ใช้
                  subject: `แจ้งเตือน: มีแบบรายงาน ${item.information.course} ให้คุณรับทราบการมีส่วนร่วม`, // หัวข้อ
                  recieverName: stakeholder.name,
                  message: `
                  คุณได้แบบรายงาน ${item.information.course} `, // เนื้อหา
                });

                // รอ axios.post ในแต่ละรายการ
                await axios.post("/api/v3/trainingsurvey", postData);
              })
            );
          })
        );
      };

      // เรียกใช้ trainingsurveyData และรอให้สำเร็จ
      await trainingsurveyData(data); // ส่งข้อมูลไปยัง API

      // ถ้าไม่มี error แสดงข้อความสำเร็จ
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
    } catch (error) {
      console.error("Error creating training form:", error);
      // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Loader />
      </div>
    );
  }

  console.log(data);

  return (
    <div className="font-inter text-base w-full p-4 md:w-[85%] xl:w-[70%] flex flex-col justify-between">
      {data.map((item: any) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  {Object.values(item.approver.member).map(
                    (approver: any, index: number) => (
                      <tr className="pl-4 w-8" key={approver.index}>
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
                              <HiBadgeCheck />
                            ) : approver.approved === "pending" ? (
                              <HiExclamationCircle />
                            ) : (
                              <>???</>
                            )}
                          </h5>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
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
                {Object.values(item.stakeholders.member).map(
                  (stakeholder: any) => (
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
                          {stakeholder.acknowledged === true ? (
                            <HiBadgeCheck />
                          ) : stakeholder.acknowledged === false ? (
                            <HiExclamationCircle />
                          ) : (
                            <>???</>
                          )}
                        </h5>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div>
        <button
          className="bg-meta-3 text-white p-5 rounded-md"
          onClick={showAlert}
        >
          ส่งให้ผู้มีส่วนร่วมทำแบบประเมิน
        </button>
      </div>
    </div>
  );
}
