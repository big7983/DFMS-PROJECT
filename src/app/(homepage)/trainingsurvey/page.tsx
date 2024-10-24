"use client";

import React, { useEffect, useState } from "react";

import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  TablePaginationProps,
} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useSession } from "next-auth/react";
import axios from "axios";
import Loader from "@/components/Loader";
import Link from "next/link";

interface RowData {
  id: number;
  course: string; // ฟิลด์นี้ควรมีอยู่
  datestart: string;
  dateend: string;
  isrepoeted: boolean;
  idform: string;
}

export default function Trainingsurvey() {
  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [searchText, setSearchText] = useState<string>(""); // state สำหรับค้นหา
  const [statusFilter, setStatusFilter] = useState<string>(""); // state สำหรับกรองสถานะ
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  const fetchData = async (email: string) => {
    try {
      const resid = await axios.get(`/api/v2/user/select/justid/${email}`);
      console.log("resid = ", resid.data.id);
      const res = await axios.get(
        `/api/v3/fontend/trainingsurvey/${resid.data.id}`
      );
      setRows(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData(session?.user?.email);
    }
  }, []);

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

  const filteredRows = rows.filter((row) => {
    const matchesCourse = row.course
      .toLowerCase()
      .includes(searchText.toLowerCase());
  
    let matchesStatus = true; // เริ่มต้นด้วยค่า true
  
    if (statusFilter === "true") {
      matchesStatus = row.isrepoeted === true; // ตรวจสอบสถานะการรับทราบ
    } else if (statusFilter === "false") {
      matchesStatus = row.isrepoeted === false; // ตรวจสอบสถานะการไม่รับทราบ
    }
  
    return matchesCourse && matchesStatus;
  });
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white p-10 rounded-[20px]">
      <div className="w-full">
        <p className="text-black font-bold mb-6 text-xl">รายงานการเข้าอบรม</p>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} // ตั้งค่าสถานะ
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
                ทำสำเร็จ
              </MenuItem>
              <MenuItem value="false">
                ยังไม่ได้ทำ
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
              field: "datestart",
              headerName: "วันเริ่มอบรม",
              width: 200,
              renderCell: (params: any) => (
                <>
                  {params.row.datestart} ถึง {params.row.dateend}
                </>
              ),
            },
            {
              field: "workflow",
              headerName: "สถานะ",
              width: 150,
              renderCell: (params: any) => (
                <>
                  {params.row.isrepoeted === false ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        ยังไม่ได้ทำรายงาน
                      </div>
                    </div>
                  ) : params.row.isevaluated === false ? (
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
              // renderCell: (params: any) => getStatusChip(params.value),
            },
            {
              field: "actions",
              headerName: "",
              headerAlign: "center",
              align: "center",
              sortable: false,
              disableColumnMenu: true,
              width: 130,

              renderCell: (params: any) => (
                <>{params.row.isrepoeted === false ? (
                  <Link
                    href={{
                      pathname: "/inputtrainingsurvey",
                      query: {
                        search: params.row.idform,
                      },
                    }}
                    className="p-2 rounded-2xl bg-meta-6 text-center font-medium text-black hover:bg-meta-8 "
                  >
                    ทำรายงาน
                  </Link>
                ): params.row.isrepoeted === true ? (
                  <Link
                    href={{
                      pathname: "/detailltrainingsurvey",
                      query: {
                        search: params.row.idform,
                      },
                    }}
                    className="p-2 rounded-2xl bg-meta-6 text-center font-medium text-black hover:bg-meta-8 "
                  >
                    รายละเอียด
                  </Link>
                ): (
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
