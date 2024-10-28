"use client";

import React, { useEffect, useState } from "react";

import {
  DataGrid,
} from "@mui/x-data-grid";
import {
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";

interface RowData {
  id: number;
  course: string; // ฟิลด์นี้ควรมีอยู่
  datestart: string;
  dateend: string;
  isevaluated: boolean;
  idform: string;
}

const Evaluation = () => {
  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [searchText, setSearchText] = useState<string>(""); // state สำหรับค้นหา
  const [statusFilter, setStatusFilter] = useState<string>(""); // state สำหรับกรองสถานะ
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchData = async (id: string) => {
    try {
      const res = await axios.get(
        `/api/v3/fontend/evaluation/${id}`
      );
      setRows(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchData(session?.user?.id);
    }
  }, [session?.user?.id]);

  const filteredRows = rows.filter((row) => {
    const matchesCourse = row.course
      .toLowerCase()
      .includes(searchText.toLowerCase());
  
    let matchesStatus = true; // เริ่มต้นด้วยค่า true
  
    if (statusFilter === "true") {
      matchesStatus = row.isevaluated === true; // ตรวจสอบสถานะการรับทราบ
    } else if (statusFilter === "false") {
      matchesStatus = row.isevaluated === false; // ตรวจสอบสถานะการไม่รับทราบ
    }
  
    return matchesCourse && matchesStatus;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white sm:p-10 py-10 px-4 rounded-[20px]">
      <div className="w-full">
        <p className="text-black font-bold mb-6 text-xl">รายการขอประเมิน</p>
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
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <div className="flex justify-between max-w-[350px]">
            {/* ตัวกรองสถานะ */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              size="small"
              style={{
                marginBottom: "1rem",
                width: "120px",
                border: 0,
              }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="true">
                ประเมินแล้ว
              </MenuItem>
              <MenuItem value="false">
                ยังไม่ได้ประเมิน
              </MenuItem>
            </Select>          
          </div>
        </div>

        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={[
            {
              field: "id",
              headerName: "ลำดับ",
              width: 75,
              align: "center",
              headerAlign: "center",
            },
            { field: "course", headerName: "ชื่อหลักสูตร", width: 200 },
            {
              field: "requester_name",
              headerName: "ผู้ยื่นรายงาน",
              width: 225,
            },
            {
              field: "datestart",
              headerName: "วันอบรม",
              width: 200,
              renderCell: (params) => (
                <>
                  {params.row.datestart} ถึง {params.row.dateend}
                </>
              ),
            },
            {
              field: "workflow",
              headerName: "สถานะ",
              width: 150,
              renderCell: (params) => (
                <>
                  {params.row.isevaluated === false ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        รอประเมิน
                      </div>
                    </div>
                  ) : params.row.isevaluated === true ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-3 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        ประเมินสำเร็จ
                      </div>
                    </div>
                  ) : (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-1 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        เกิดข้อผิดพลาด
                      </div>
                    </div>
                  )}
                </>
              ),
            },
            {
              field: "latestupdate",
              headerName: "อัพเดทล่าสุด",
              width: 150,             
            },
            {
              field: "actions",
              headerName: "",
              headerAlign: "center",
              align: "center",
              sortable: false,
              disableColumnMenu: true,
              width: 200,

              renderCell: (params) => (
                <Link
                  href={{
                    pathname: "/detaillevaluation",
                    query: {
                      search: params.row.idform,
                    },
                  }}
                  className="items-center justify-center rounded-full bg-primary px-4 py-2.5 text-center font-medium text-white hover:bg-opacity-70 "
                  >
                  รายละเอียด
                </Link>
              ),
            },
          ]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            filter: {
              filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: false,
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

export default Evaluation