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
// ตัวอย่างข้อมูล

const rows1 = [
  {
    id: 1,
    course: "datawarehouse",
    datestart: "Mon 2 May 2022",
    status: "รับทราบแล้ว",
    datestatus: "22 Apr 2022 13:00",
  },
];

// ฟังก์ชันสร้างสีตามสถานะ
// const getStatusChip = (status: any) => {
//   let colors = status === "active" ? "success" : "error";
//   return <Chip label={status} color={colors} />;
// };

interface RowData {
  name: string;
  status: string;
}

export default function Trainingform() {
  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchText, setSearchText] = useState(""); // ค่าที่ผู้ใช้กรอก
  const [statusFilter, setStatusFilter] = useState(""); // ค่าสถานะที่เลือกกรอง

  useEffect(() => {
    const fetchData = async () => {
      try {      
        // const res = await axios.get("/api/data"); 
        // setRows(res.data);
        // setFilteredRows(res.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
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

  return (
    <div className="bg-white p-10 rounded-[20px]">
      <div className="w-full">
        <p className="text-black font-bold mb-6 text-xl">
          รายการขออนุมัติเข้าอบรม
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
                href="/inputtrainingform"
                variant="contained"
                color="primary"
                style={{
                  marginBottom: "1rem",
                  width: "130px",
                  border: 0,
                }}
                className="bg-meta-4"
              >
                <AddCircleIcon className="mr-1" />
                เพิ่มคำร้อง
              </Button>
            </div>
          </div>
        </div>

        <DataGrid
          autoHeight
          rows={rows1}
          columns={[
            {
              field: "id",
              headerName: "ลำดับ",
              width: 75,
              align: "center",
              headerAlign: "center",
            },
            { field: "course", headerName: "ชื่อหลักสูตร", width: 200 },
            { field: "datestart", headerName: "วันเริ่มอบรม", width: 200 },
            {
              field: "status",
              headerName: "สถานะ",
              width: 150,
              // renderCell: (params: any) => getStatusChip(params.value),
            },
            {
              field: "datestatus",
              headerName: "อัพเดทล่าสุด",
              width: 150,
              // renderCell: (params: any) => getStatusChip(params.value),
            },
            {
              field: "actions",
              headerName: "",
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
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className="rounded-2xl bg-meta-6 text-center font-medium text-black hover:bg-opacity-90 "
                  >                 
                    รายละเอียด
                  </Button>
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
