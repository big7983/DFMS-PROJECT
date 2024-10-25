"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ApproverStakeholdersPage() {
  const [formIds, setFormIds] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFormIds = async () => {
      try {
        const response = await axios.get("/api/v3/trainingform");
        setFormIds(response.data);
      } catch (error) {
        console.error("Error fetching form IDs:", error);
      }
    };
    fetchFormIds();
  }, []);

  // Fetch stakeholders and approvers when a form ID is selected
  useEffect(() => {
    if (selectedFormId) {
      fetchData();
    }
  }, [selectedFormId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/v3/trainingform/${selectedFormId}`
      );
      console.log("dd", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  const updateStakeholderStatus = async (sid: any,name:any,course:any) => {
    Swal.fire({
      title: "กำลังโหลด...", // ข้อความที่แสดงในหัวข้อ
      html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
      allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
      showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
      didOpen: () => {
        Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
      },
    });

    try {
      await axios.patch(`/api/v3/trainingform/updatestatus/stakeholders`, {
        id: selectedFormId,
        stakeholderId: sid,
      });

      await axios.patch(
        `/api/v3/history`,{
          id:selectedFormId,
          name:name,
          action: "รับทราบการมีส่วนร่วมแล้วแบบคำร้อง "+course+" สำเร็จ"
        }
      );


      Swal.fire("สำเร็จ", "อัปเดตสถานะสำเร็จ", "success");
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
      console.error("Error updating stakeholder status:", error);
    }
    fetchData();
  };

  const updateApproverStatus = async (
    idform: string,
    course: string,
    userid: string,
    name: string,
    statusapproved: string
  ) => {
    try {
      Swal.fire({
        title: "กำลังโหลด...", // ข้อความที่แสดงในหัวข้อ
        html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
        allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
        showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
        didOpen: () => {
          Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
        },
      });

      // ส่งคำขอ PATCH โดยใช้ axios
      const response = await axios.patch(
        "/api/v3/trainingform/updatestatus/approver/",
        {
          id: idform,
          approverId: userid,
          opinion: "test updateApproverStatus",
          statusapproved,
        }
      );

      await axios.patch(
        `/api/v3/history`,{
          id:idform,
          name:name,
          action: "พิจารณาแบบคำร้อง "+course+" สำเร็จ ผลการพิจารณาคือ "+statusapproved+" "
        }
      );    

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200) {
        Swal.fire("สำเร็จ", "อัปเดตสถานะสำเร็จ", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองอีกครั้งในภายหลัง", "error");
    }
    fetchData();
  };

  const handleChange = (e: any) => {
    setSelectedFormId(e.target.value); // เก็บค่าจาก input ลงใน state
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Manage Approvers & Stakeholders
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium">Select Form ID:</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md"
          onChange={handleChange}
        >
          <option value="">Select a Form</option>
          {formIds.map((forma) => (
            <option
              key={(forma as { id: string }).id}
              value={(forma as { id: string }).id}
            >
              {(forma as { id: string }).id}
            </option>
          ))}
        </select>
      </div>

      {selectedFormId && (
        <div className="space-y-8">
          {data.map((item: any) => (
            <div key={item.id}>
              <div>
                <h2 className="text-xl font-semibold mb-2">Stakeholders</h2>
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">Name</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(item.stakeholders.member).map(
                      (stakeholder: any) => (
                        <tr key={stakeholder.id}>
                          <td className="py-2 px-4 border">
                            {stakeholder.name}
                          </td>
                          <td className="py-2 px-4 border">
                            {stakeholder.acknowledged === true
                              ? "รับทราบแล้ว"
                              : "ยังไม่ได้รับทราบ"}
                          </td>
                          <td className="py-2 px-4 border">
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                              onClick={() =>
                                updateStakeholderStatus(stakeholder.id,stakeholder.name,item.information.course)
                              }
                            >
                              Set True
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Approvers</h2>
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">Name</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(item.approver.member)
                    .map((approver: any) => (
                      <tr key={approver.id}>
                        <td className="py-2 px-4 border">{approver.name}</td>
                        <td className="py-2 px-4 border">
                          {approver.approved}
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="flex space-x-3 ">
                            <button
                              className="bg-meta-3 text-white px-4 py-2 rounded-[20px]"
                              onClick={() =>
                                updateApproverStatus(
                                  item.id,
                                    item.information.course ,
                                    approver.id,
                                    approver.name,
                                    "approved"
                                )
                              }
                            >
                              อนุมัติ
                            </button>
                            <button
                              className="bg-meta-1 text-white px-4 py-2 rounded-[20px] whitespace-nowrap"
                              onClick={() =>
                                updateApproverStatus(
                                  item.id,
                                    item.information.course ,
                                    approver.id,
                                    approver.name,
                                    "unapproved"
                                )
                              }
                            >
                              ไม่อนุมัติ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
