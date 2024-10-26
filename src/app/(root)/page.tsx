"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { MdEditDocument } from "react-icons/md";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [totalNotFullyApproved, setTotalNotFullyApproved] = useState("");
  const [totalNotAcknowledged, setTotalNotAcknowledged] = useState("");
  const [totalApproved, setTotalApproved] = useState("");
  const [reporterCount, setReporterCount] = useState("");
  const [evaluatorCount, setEvaluatorCount] = useState("");

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async (email: string) => {
    try {
      const resid = await axios.get(`/api/v2/user/select/justid/${email}`);
      console.log("resid = ", resid.data.id);

      const res = await axios.get(`/api/v3/dashboard/${resid.data.id}`);
      setTotalNotFullyApproved(res.data.totalNotFullyApproved + " คำร้อง");
      setTotalNotAcknowledged(res.data.totalNotAcknowledged + " คำร้อง");
      setTotalApproved(res.data.totalApproved + " คำร้อง");
      setReporterCount(res.data.reporterCount + " รายงาน");
      setEvaluatorCount(res.data.evaluatorCount + " คำร้อง");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // ถ้าเป็น 404 ให้ตั้งค่าทั้งหมดเป็น 0
        setTotalNotFullyApproved("0 คำร้อง");
        setTotalNotAcknowledged("0 คำร้อง");
        setTotalApproved("0 คำร้อง");
        setReporterCount("0 รายงาน");
        setEvaluatorCount("0 คำร้อง");
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false); // หยุด loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData(session?.user?.email);
    }

    if (!session) {
      router.push("/login");
    }
  } );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 ">
        <Link href="/trainingform">
          <CardDataStats title="แบบอนุมัติของฉัน" total={totalNotFullyApproved}>
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
              <MdEditDocument color="#3c50e0" size={24} />
          </CardDataStats>
        </Link>
        {/* <CardDataStats title="Total Users" total="3.456"  >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats> */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 ">
        <Link href="/approveform">
          <CardDataStats title="คำร้องขออนุมัติถึงฉัน" total={totalApproved}>
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
          <CardDataStats title="คำร้องขอประเมินถึงฉัน" total={evaluatorCount}>
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
  );
};

export default Dashboard;
