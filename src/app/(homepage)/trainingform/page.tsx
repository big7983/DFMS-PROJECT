"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

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
import Link from "next/link";
import Loader from "@/components/Loader";

interface RowData {
  id: number;
  course: string; // ฟิลด์นี้ควรมีอยู่
  datestart: string;
  dateend: string;
  datesubmiss: string;
  statusfrom: string;
  acknowledged: boolean;
  acknowledgedStakeholders: number;
  totalStakeholders: number;
  approvedApprovers: number;
  totalApprovers: number;
  latestupdate: string;
  isfullyacknowledged: boolean;
  isfullyapproved: string; // เปลี่ยนเป็น string แทนที่จะเป็น boolean
  idform: string;
}

export default function Trainingform() {
  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>(""); // state สำหรับค้นหา
  const [statusFilter, setStatusFilter] = useState<string>(""); // state สำหรับกรองสถานะ

  const { data: session } = useSession();

  const fetchData = async (email: string) => {
    try {
      const resid = await axios.get(`/api/v2/user/select/justid/${email}`);
      console.log("resid = ", resid.data.id);
      const res = await axios.get(
        `/api/v3/fontend/trainingform/${resid.data.id}`
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

    const matchesStatus =
      statusFilter === "acknowledged"
        ? row.isfullyacknowledged === true // ตรวจสอบสถานะการรับทราบ
        : statusFilter === "notacknowledged"
        ? row.isfullyacknowledged === false // ตรวจสอบสถานะการไม่รับทราบ
        : statusFilter
        ? row.isfullyapproved === statusFilter // ค้นหาสถานะการอนุมัติ
        : true; // คืนค่า true ถ้าไม่มีการกรอง

    return matchesCourse && matchesStatus;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white p-10 rounded-[20px] font-inter">
      <div className="w-full">
        <p className="text-black font-bold mb-6 text-xl">
          รายการขออนุมัติเข้าอบรม
        </p>
        {/* ช่องค้นหา */}
        <div className="justify-between flex flex-col sm:flex-row">
          <TextField
            label="ค้นหา"
            variant="outlined"
            onChange={(e) => setSearchText(e.target.value)} // ค้นหาจากชื่อหลักสูตร
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
              <MenuItem value="acknowledged">
                ผู้มีส่วนร่วมรับทราบแล้ว
              </MenuItem>{" "}
              <MenuItem value="notacknowledged">
                ผู้มีส่วนร่วมยังไม่ได้รับทราบ
              </MenuItem>{" "}
              <MenuItem value="fullyapproved">คำร้องถูกอนุมัติครบแล้ว</MenuItem>
              <MenuItem value="unapproved">คำร้องไม่ได้รับอนุมัติ</MenuItem>
              <MenuItem value="pending">รออนุมัติ</MenuItem>
              
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
              headerName: "วันอบรม",
              width: 200,
              renderCell: (params: any) => (
                <>
                  {params.row.datestart} ถึง {params.row.dateend}
                </>
              ),
            },
            {
              field: "datesubmiss",
              headerName: "วันยื่นคำร้อง",
              width: 200,
            },
            {
              field: "statusfrom",
              headerName: "สถานะ",
              width: 250,
              renderCell: (params: any) => (
                <>
                  {params.row.isfullyacknowledged === false ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        ผู้มีส่วนร่วมรับทราบแล้ว (
                        {params.row.acknowledgedStakeholders}/
                        {params.row.totalStakeholders})
                      </div>
                    </div>
                  ) : params.row.isfullyapproved === "pending" ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        รอผู้อนุมัติ ({params.row.approvedApprovers}/
                        {params.row.totalApprovers})
                      </div>
                    </div>
                  ) : params.row.isfullyapproved === "fullyapproved" ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-3 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        อนุมัติแล้ว
                      </div>
                    </div>
                  ) : params.row.isfullyapproved === "unapproval" ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-1 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        ไม่ได้รับการอนุมัติ
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

              renderCell: (params: any) => (
                <>
                  <Link
                    href={{
                      pathname: "/detailltrainingform",
                      query: {
                        search: params.row.idform,
                      },
                    }}
                    className="p-2 rounded-2xl bg-meta-6 text-center font-medium text-black hover:bg-meta-8 "
                  >
                    รายละเอียด
                  </Link>
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
