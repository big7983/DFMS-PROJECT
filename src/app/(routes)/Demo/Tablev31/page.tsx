"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  DataGrid,
  GridActionsCellItem,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import {
  TextField,
  Select,
  MenuItem,
  Chip,
  Button,
  TablePaginationProps,
  Box,
  IconButton,
  Menu,
} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Swal from "sweetalert2";
// ตัวอย่างข้อมูล

// ฟังก์ชันสร้างสีตามสถานะ
const getStatusChip = (status: any) => {
  let colors = status === "active" ? "success" : "error";
  return <Chip label={status} color={colors} />;
};

export default function DataTable() {
  const [rows, setRows] = useState([]); // ข้อมูลทั้งหมดที่ได้จาก API
  const [filteredRows, setFilteredRows] = useState([]); // ข้อมูลที่กรองแล้ว
  const [searchText, setSearchText] = useState(""); // ค่าที่ผู้ใช้กรอก
  const [statusFilter, setStatusFilter] = useState(""); // ค่าสถานะที่เลือกกรอง

  const columns = [
    { field: "name", headerName: "ชื่อ", width: 150 },
    { field: "position", headerName: "ตำแหน่ง", width: 150 },
    {
      field: "status",
      headerName: "สถานะ",
      width: 150,
      renderCell: (params: any) => getStatusChip(params.value), // ใช้ Chip แสดงสี
    },
    {
      field: "actions",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 200,

      renderCell: (params: any) => (
        <>
          {/* <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            รายละเอียด
          </Button> */}
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            // onClick={handleEditClick(id)}
            color="inherit"
          />

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            // onClick={handleDeleteClick(id)}
            color="inherit"
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data'); // แทนที่ด้วย URL ของ API ของคุณ
        const data = await response.json();
        setRows(data);
        setFilteredRows(data); // กำหนดข้อมูลเริ่มต้นที่กรองแล้ว
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // เรียกใช้งานฟังก์ชัน
  }, []);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const matchesSearch = row.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus = statusFilter
        ? row.status.toLowerCase() === statusFilter.toLowerCase()
        : true; // กรองตามสถานะ
      return matchesSearch && matchesStatus; // เงื่อนไขการกรอง
    });
    setFilteredRows(filtered); // อัปเดตข้อมูลที่กรองแล้ว
  }, [searchText, statusFilter, rows]);

  function Pagination({
    page,
    onPageChange,
    className,
  }: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <MuiPagination
        color="primary"
        className={className}
        count={pageCount}
        page={page + 1}
        onChange={(event, newPage) => {
          onPageChange(event as any, newPage - 1);
        }}
      />
    );
  }

  function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
  }

  const handleClick = (
    id: String,
    email: string,
    name: string,
    rank: string,
    position: string,
    employee_id: string
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

        if (!email || !name || !rank || !position || !employee_id) {
          Swal.showValidationMessage("All fields are required");
        }

        return { email, name, rank, position, employee_id };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { email, name, rank, position, employee_id } = result.value;

        try {
          Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',  // ข้อความที่แสดงในหัวข้อ
            html: '<div class="spinner"></div>', // แสดง HTML สำหรับ loading spinner
            allowOutsideClick: false,  // ไม่ให้ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
            showConfirmButton: false,  // ไม่แสดงปุ่มยืนยัน
            didOpen: () => {
              Swal.showLoading();  // ใช้ showLoading() ของ SweetAlert2
            }
          });
          await axios.put(`/api/data/${id}`, {
            email,
            name,
            rank,
            position,
            employee_id,
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
    <div className="bg-white p-10 rounded-[20px]">
      <div className="w-full">
        <p className="text-black font-bold mb-6 text-xl">
          ระบบจัดการฟอร์มดิจิทัล
        </p>
        {/* ช่องค้นหา */}
        <div className="justify-between flex flex-col sm:flex-row">
          <TextField
            label="ค้นหา"
            variant="outlined"
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            style={{
              marginBottom: "1rem",
              marginRight: "1rem",
              minWidth: "225px",
              width: "100%",
              maxWidth: "350px",
            }}
          />
          <div className="flex justify-between max-w-[350px]">
            {/* ตัวกรองสถานะ */}
            <Select
              // value={statusFilter}
              // onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              size="small"
              style={{
                marginBottom: "1rem",
                width: "120px",
                border: 0,
              }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            <div className="ml-4">
              <Button
                variant="contained"
                color="primary"
                style={{
                  marginBottom: "1rem",
                  width: "130px",
                  border: 0,
                }}
              >
                <AddCircleIcon className="mr-1" />
                เพิ่มคำร้อง
              </Button>
            </div>
          </div>
        </div>
        
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={[
            { field: "name", headerName: "ชื่อ", width: 150 },
            { field: "position", headerName: "ตำแหน่ง", width: 150 },
            {
              field: "status",
              headerName: "สถานะ",
              width: 150,
              renderCell: (params: any) => getStatusChip(params.value), // ใช้ Chip แสดงสี
            },
            {
              field: "actions",
              headerName: "Action",
              headerAlign: "center",
              align: "center",
              sortable: false,
              disableColumnMenu: true,
              width: 200,

              renderCell: (params: any) => (
                <>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    รายละเอียด
                  </Button> */}
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={() =>
                      handleClick(
                        params.row.id,
                        params.row.email,
                        params.row.name,
                        params.row.rank,
                        params.row.position,
                        params.row.employee_id
                      )
                      
                    }
                    color="inherit"
                  />
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    // onClick={handleDeleteClick(id)}
                    color="inherit"
                  />
                </>
              ),
            },
          ]}
          slots={{
            pagination: CustomPagination,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          sx={{
            boxShadow: 0,
            border: 0,
          }}
        />
      </div>
    </div>
  );
}
