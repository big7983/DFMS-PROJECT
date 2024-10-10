"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const List = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/data");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const deletePost = async (id: Number) => {
  //   try {
  //     await axios.delete(`/api/data/${id}`);
  //     fetchPosts();
  //   } catch (error) {
  //     console.error("Failed to delete the post", error);
  //   }
  // };

  const router = useRouter();

  const handleClick = (
    id: String,
    email: string,
    name: string,
    rank: string,
    position: string,
    employee_id: string,
    department: string,
    role: string
  ) => {
    Swal.fire({
      title: "Edit User Details",
      html:
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left"> Email <span class="text-meta-1">*</span></label>' +
        '<input type="email" id="swal-input1" disabled class="w-full rounded border-[1.5px] border-stroke bg-bodydark px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your email address" value="' +
        email +
        '" />' +
        '<div class="pt-5 mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left">Employee ID <span class="text-meta-1">*</span></label>' +
        '<input type="text" id="swal-input5" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your employee ID" value="' +
        employee_id +
        '" />' +
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left"> Name <span class="text-meta-1">*</span></label>' +
        '<input type="text" id="swal-input2" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your name" value="' +
        name +
        '" />' +
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left"> Rank <span class="text-meta-1">*</span></label>' +
        '<input type="text" id="swal-input3" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your rank" value="' +
        rank +
        '" />' +
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left">Position <span class="text-meta-1">*</span></label>' +
        '<input type="text" id="swal-input4" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your position" value="' +
        position +
        '" />' +
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left">department <span class="text-meta-1">*</span></label>' +
        '<input type="text" id="swal-input6" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" placeholder="Enter your position" value="' +
        department +
        '" />' +
        "</div>" +
        '<div class="mb-4.5">' +
        '<label class="mb-3 block text-sm font-medium text-black dark:text-white text-left">department <span class="text-meta-1">*</span></label>' +
        '<select id="swal-input7" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">' +
        '<option value="" disabled selected>'+role+'</option>' +
        '<option value="enduser">enduser</option>' +
        '<option value="approver">approver</option>' +
        '<option value="admin">admin</option>' +
        "</select>" +
        "</div>",

      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Save",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      preConfirm: () => {
        const email = (
          document.getElementById("swal-input1") as HTMLInputElement
        ).value;
        const name = (
          document.getElementById("swal-input2") as HTMLInputElement
        ).value;
        const rank = (
          document.getElementById("swal-input3") as HTMLInputElement
        ).value;
        const position = (
          document.getElementById("swal-input4") as HTMLInputElement
        ).value;
        const employee_id = (
          document.getElementById("swal-input5") as HTMLInputElement
        ).value;
        const department = (
          document.getElementById("swal-input6") as HTMLInputElement
        ).value;
        const role = (
          document.getElementById("swal-input7") as HTMLInputElement
        ).value;

        if (
          !email ||
          !name ||
          !rank ||
          !position ||
          !employee_id ||
          !department ||
          !role
        ) {
          Swal.showValidationMessage("All fields are required");
        }

        return { email, name, rank, position, employee_id, department, role };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { email, name, rank, position, employee_id, department, role } =
          result.value;

        try {
          Swal.fire({
            title: "กำลังบันทึกข้อมูล...", // ข้อความที่แสดงในหัวข้อ
            html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
            allowOutsideClick: false, // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
            showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
            didOpen: () => {
              Swal.showLoading(); // ใช้ showLoading() ของ SweetAlert2
            },
          });
          await axios.put(`/api/data/${id}`, {
            email,
            name,
            rank,
            position,
            employee_id,
            department,
            role,
          });
          Swal.fire({
            title: "Updated!",
            text: `แก้ไขสำเร็จ`,
            icon: "success",
          });
          fetchPosts();
        } catch (error) {
          Swal.fire({
            title: "error!",
            text: `เกิดข้อผิดพลาดขึ้น`,
            icon: "error",
          });
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">จัดการสิทธิ์ผู้ใช้งานระบบ</h1>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post: any) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() =>
                      handleClick(
                        post.id,
                        post.email,
                        post.name,
                        post.rank,
                        post.position,
                        post.employee_id,
                        post.department,
                        post.role
                      )
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
