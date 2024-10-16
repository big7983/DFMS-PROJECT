"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import FirstComponent from "./Preview";
import SecondComponent from "./evalution";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

type Props = {};

export default function Page({}: Props) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("search");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const res = await axios.get(`/api/form/trainingsurvey/${id}`);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchUser = async (email: string) => {
      try {
        const resid = await axios.get(`/api/user/select/justid/${email}`);
        setUser(resid.data.id);
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
  }, [id]);

  const handleNext = () => {
    setShowFirstComponent(false);
  };

  const handleBack = () => {
    setShowFirstComponent(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      console.log("Data to submit:", formData);

      Swal.fire({
        title: "กำลังโหลด...", // ข้อความที่แสดงในหัวข้อ
        html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
        allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
        showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
        didOpen: () => {
          Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
        },
      });

      const response = await axios.patch(
        `/api/form/trainingsurvey/approved/feedback`,
        {
          id: id,
          userid: user,
          feedback: {
            ...formData,
          },
        }
      );

      console.log("Response from API:", response.data);
      Swal.fire({
        title: "บันทึกสำเร็จ!",
        icon: "success",
        confirmButtonText: "กลับสู่หน้าหลัก",
        confirmButtonColor: "#219653",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard");
        }
      });
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองอีกครั้งในภายหลัง", "error");
      console.error("Error submitting data:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Loader />
      </div>
    );
  }

  return showFirstComponent ? (
    <FirstComponent data={data} handleNext={handleNext} />
  ) : (
    <SecondComponent handleBack={handleBack} handleSubmit={handleSubmit} />
  );
}
