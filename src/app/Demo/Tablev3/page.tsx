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

const initialRows = [
  { id: 1, name: "John Doe", position: "Developer", status: "active" },
  { id: 2, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 3, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 4, name: "John Doe", position: "Developer", status: "active" },
  { id: 5, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 6, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 7, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 8, name: "John Doe", position: "Developer", status: "active" },
  { id: 9, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 10, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 11, name: "John Doe", position: "Developer", status: "active" },
  { id: 12, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 13, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 14, name: "John Doe", position: "Developer", status: "active" },
  { id: 15, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 16, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 17, name: "Alex Johnson", position: "Manager", status: "active" },
  { id: 18, name: "John Doe", position: "Developer", status: "active" },
  { id: 19, name: "Jane Smith", position: "Designer", status: "inactive" },
  { id: 20, name: "Alex Johnson", position: "Manager", status: "active" },
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

export default function DataTable() {

  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchText, setSearchText] = useState(''); // ค่าที่ผู้ใช้กรอก
  const [statusFilter, setStatusFilter] = useState(''); // ค่าสถานะที่เลือกกรอง

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/data'); // แทนที่ด้วย URL ของ API ของคุณ
        setRows(res.data);
        setFilteredRows(res.data); // กำหนดข้อมูลเริ่มต้นที่กรองแล้ว
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // เรียกใช้งานฟังก์ชัน
  }, []);

  useEffect(() => {
    const filtered = rows.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter ? row.status.toLowerCase() === statusFilter.toLowerCase() : true; // กรองตามสถานะ
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
              // renderCell: (params: any) => getStatusChip(params.value), 
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
