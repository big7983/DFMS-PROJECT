"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { MdEditDocument } from "react-icons/md";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [requesterCount, setrequesterCount] = useState("");
  const [totalNotAcknowledged, setTotalNotAcknowledged] = useState("");
  const [totalApproved, setTotalApproved] = useState("");
  const [reporterCount, setReporterCount] = useState("");
  const [evaluatorCount, setEvaluatorCount] = useState("");

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("enduser");

  const fetchData = async (email: string) => {
    try {
      const resid = await axios.get(`/api/v2/user/select/${email}`);
      console.log("resid = ", resid.data.id);
      setRole(resid.data.role);

      const res = await axios.get(`/api/v3/dashboard/${resid.data.id}`);
      console.log("res dashboard = ", res);

      setrequesterCount(res.data.requesterCount + " คำร้อง");
      setTotalNotAcknowledged(res.data.totalNotAcknowledged + " คำร้อง");
      setTotalApproved(res.data.totalApproved + " คำร้อง");
      setReporterCount(res.data.reporterCount + " รายงาน");
      setEvaluatorCount(res.data.evaluatorCount + " คำร้อง");
      setLoading(false);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // ถ้าเป็น 404 ให้ตั้งค่าทั้งหมดเป็น 0
        setrequesterCount("0 คำร้อง");
        setTotalNotAcknowledged("0 คำร้อง");
        setTotalApproved("0 คำร้อง");
        setReporterCount("0 รายงาน");
        setEvaluatorCount("0 คำร้อง");
        console.error("ไม่พบคำร้อง 404");
        setLoading(false);
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData(session?.user?.email);
    }

  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div >
      {role === "enduser" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 ">
          <Link href="/trainingform">
            <CardDataStats
              title="แบบอนุมัติของฉัน"
              total={requesterCount}
            >
              <svg
                className="w-6 h-6 text-primary dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"
                />
              </svg>
            </CardDataStats>
          </Link>

          <Link href="/stakeholdersform">
            <CardDataStats
              title="รับทราบการมีส่วนร่วม"
              total={totalNotAcknowledged}
            >
              <svg
                className="w-6 h-6 text-primary dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                />
              </svg>
            </CardDataStats>
          </Link>

          <Link href="/trainingsurvey">
            <CardDataStats title="แบบรายงานของฉัน" total={reporterCount}>
              <MdEditDocument className="fill-primary" size={24} />
            </CardDataStats>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 ">
            <Link href="/trainingform">
              <CardDataStats
                title="แบบอนุมัติของฉัน"
                total={requesterCount}
              >
                <svg
                  className="w-6 h-6 text-primary dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"
                  />
                </svg>
              </CardDataStats>
            </Link>

            <Link href="/stakeholdersform">
              <CardDataStats
                title="รับทราบการมีส่วนร่วม"
                total={totalNotAcknowledged}
              >
                <svg
                  className="w-6 h-6 text-primary dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>
              </CardDataStats>
            </Link>

            <Link href="/trainingsurvey">
              <CardDataStats title="แบบรายงานของฉัน" total={reporterCount}>
                <MdEditDocument className="fill-primary" size={24} />
              </CardDataStats>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 ">
            <Link href="/approveform">
              <CardDataStats
                title="คำร้องขออนุมัติถึงฉัน"
                total={totalApproved}
              >
                <svg
                  className="w-6 h-6 text-primary dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
                </svg>
              </CardDataStats>
            </Link>

            <Link href="/evaluation">
              <CardDataStats
                title="คำร้องขอประเมินถึงฉัน"
                total={evaluatorCount}
              >
                <svg
                  className="w-6 h-6 text-primary dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
                  />
                </svg>
              </CardDataStats>
            </Link>
          </div>
        </div>
      )}
      <div className="border-t border-meta-9 my-6" />

      <div className="">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 ">
          <Link href="/inputtrainingform">
            <CardDataStats
              title="แบบขออนุมัติเข้ารับการอบรมสัมมนา"
              total="เพิ่มแบบคำร้อง"
            >
              <svg
                className="fill-primary dark:fill-white"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                  clip-rule="evenodd"
                />
              </svg>
            </CardDataStats>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
