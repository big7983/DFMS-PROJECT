"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import FirstComponent from "./Preview";
import SecondComponent from "./evalution";
import Swal from "sweetalert2";

interface TrainingSurvey {
  id:  string;
  idform: string;
  nameform: string;
  trainingform_id: string;
  datesubmiss: string;
  evaluationstatus: string;
  latestupdate: string;
  reporter_id: string;
  evaluator_id: string;
  section: string;
  department: string;
  isreported: boolean;
  isevaluated: boolean;
  active: boolean;
  survey: {
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
    selectedOptions: string;
  };
  evaluatorfeedback: FormData
  information: {
    course: string;
    datestart: string;
    dateend: string;
    location: string;
    objective: string;
  };
  reporter: {
    name: string;
    level: string;
    position: string;
    email: string;

  };
  evaluator: {
    name: string;
    level: string;
    position: string;
    email: string;

  };
}

interface FormData {
  objective: string;
  costEffectiveness: string;
  workBenefit: string;
  objectiveAlignment: string;
  futureRecommendation: string;
  reasonfutureRecommendation: string;
  additionalcomments: string;
}

export default function Page() {
  const [data, setData] = useState<TrainingSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("search");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const res = await axios.get(`/api/v3/trainingsurvey/${id}`);
        setData(res.data);
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

  const handleNext = () => {
    setShowFirstComponent(false);
  };

  const handleBack = () => {
    setShowFirstComponent(true);
  };

  const handleSubmit = async (formData:FormData ) => {
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
        `/api/v3/trainingsurvey/evaluator/${id}`,
        {
          evaluatorfeedback: {
            objective: formData.objective,
            costEffectiveness: formData.costEffectiveness,
            workBenefit: formData.workBenefit,
            objectiveAlignment: formData.objectiveAlignment,
            futureRecommendation: formData.futureRecommendation,
            reasonfutureRecommendation: formData.reasonfutureRecommendation,
            additionalcomments: formData.additionalcomments,
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
