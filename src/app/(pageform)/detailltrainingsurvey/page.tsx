"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { HiBadgeCheck } from "react-icons/hi";
import { HiExclamationCircle } from "react-icons/hi";
import Loader from "@/components/Loader";

type Props = {};

export default function page({}: Props) {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("search");

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const res = await axios.get(`/api/form/trainingsurvey/${id}`); // แก้ URL ตามที่ต้องการ
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

  if (loading) {
    return <div className="w-full"><Loader /></div>;
  }

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
                    {item.requester.name}
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1">สังกัดฝ่าย</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.status.department} 
                  </label>
                </div>
              </div>
              <div className="w-full">
                <label className="block mb-1">ตำแหน่ง</label>
                <div className="w-full">
                  <label className="text-black dark:text-white font-medium">
                    {item.requester.position} 
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
          <h3 className="font-semibold text-black dark:text-white mb-9">
            รายงานผลการอบรม/สัมมนา
          </h3>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
              เนื้อหาสาระสำคัญโดยสรุปของผู้รายงาน
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {item.survey.keycontent}
            </label>
          </div>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
              เนื้อหาวิชาที่สอน สอดคล้องกับวัตถุประสงค์ของการอบรม ของผู้รายงาน
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {item.survey.remaining}
            </label>
          </div>

          <div className="mb-9">
            <label className="mb-3 block font-medium ">
              เทคนิคหริอวิธีที่ใช้ในการอบรม/สัมมนา
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {item.survey.matchesobjectives}
            </label>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพหลักสูตรหรือหัวข้อวิชา
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.course_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">เหตุผล</label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.course_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพหลักสูตรหรือหัวข้อวิชา
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.lecturer_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">เหตุผล</label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.lecturer_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพของเอกสารประกอบการอบรม
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.document_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">เหตุผล</label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.document_reason}
              </label>
            </div>
          </div>

          <div className="mb-9 flex flex-col gap-6 md:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">
                คุณภาพการบริการของสถาบันที่จัดฝึกอบรม
              </label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.service_result}
              </label>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block font-medium ">เหตุผล</label>
              <label className=" block text-sm font-medium text-black dark:text-white">
                {item.survey.service_reason}
              </label>
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-3 block font-medium ">
              เทคนิคหริอวิธีที่ใช้ในการอบรม/สัมมนา
            </label>
            <label className="block text-sm font-medium text-black dark:text-white">
              {item.survey.selectedOptions}
            </label>
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
                  {Object.values(item.approver)
                    .sort(
                      (a: any, b: any) =>
                        parseInt(a.sequence) - parseInt(b.sequence)
                    ) // เรียงตาม sequence
                    .map((approver: any) => (
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
                        <td className=" text-center border-b border-[#eee] p-4 dark:border-strokedark">
                          <h5 className="flex justify-center font-medium text-black dark:text-white">
                            {approver.status === "waiting" ? (
                              <HiExclamationCircle />
                            ) : (
                              <HiBadgeCheck />
                            )}
                          </h5>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>     
        </div>
      ))}
    </div>
  );
}
