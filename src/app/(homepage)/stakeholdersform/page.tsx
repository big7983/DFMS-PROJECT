"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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
  TablePaginationProps,
} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { useSession } from "next-auth/react";
import Link from "next/link";

import Loader from "@/components/Loader";

interface RowData {
  name: string;
  status: string;
}

export default function Stakeholdersform() {
  const [rows, setRows] = useState<RowData[]>([]); // กำหนดประเภทข้อมูลของ rows เป็นอาร์เรย์ของ RowData
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [searchText, setSearchText] = useState(""); // ค่าที่ผู้ใช้กรอก
  const [statusFilter, setStatusFilter] = useState(""); // ค่าสถานะที่เลือกกรอง
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  const fetchData = async (email: string) => {
    try {
      const resid = await axios.get(`/api/user/select/justid/${email}`);
      const res = await axios.get(
        `/api/fontend/stakeholdersform/${resid.data.id}`
      );
      setRows(res.data);
      setFilteredRows(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData(session?.user?.email);
    }
  }, []);

  // useEffect(() => {
  //   const filtered = rows.filter((row) => {
  //     const matchesSearch = row.name
  //       .toLowerCase()
  //       .includes(searchText.toLowerCase());
  //     const matchesStatus = statusFilter
  //       ? row.status.toLowerCase() === statusFilter.toLowerCase()
  //       : true; // กรองตามสถานะ
  //     return matchesSearch && matchesStatus; // เงื่อนไขการกรอง
  //   });
  //   setFilteredRows(filtered); // อัปเดตข้อมูลที่กรองแล้ว
  // }, [searchText, statusFilter, rows]);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-boxdark-2 p-10 rounded-[20px]">
      <div className="w-full">
        <p className="text-black dark:text-bodydark font-bold mb-6 text-xl">
          รับทราบการมีส่วนร่วม
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
              {/* <Button
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
              </Button> */}
            </div>
          </div>
        </div>

        <DataGrid
          autoHeight
          rows={rows}
          columns={[
            {
              field: "id",
              headerName: "ลำดับ",
              width: 75,
              align: "center",
              headerAlign: "center",
            },
            { field: "course", headerName: "ชื่อหลักสูตร", width: 200 },
            { field: "datestart", headerName: "วันอบรม", width: 200 },
            {
              field: "statuslist",
              headerName: "สถานะรับทราบ",
              headerAlign: "center",
              width: 110,
              renderCell: (params: any) => (
                <>
                  {params.row.statuslist === "true" ? (
                    <div className="w-full h-full justify-center items-center inline-flex ">
                      <svg
                        className="w-6 h-6 text-meta-3 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : params.row.statuslist === "false" ? (
                    <div className="w-full h-full justify-center items-center inline-flex ">
                      <svg
                        className="w-6 h-6 text-meta-6 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full justify-center items-center inline-flex ">
                      <svg
                        className="w-6 h-6 text-meta-1 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </>
              ),
            },
            {
              field: "namerequester",
              headerName: "ผู้ยื่นคำร้อง",
              width: 200,
            },
            {
              field: "statusfrom",
              headerName: "สถานะแบบอนุมัติ",
              width: 250,

              //`ผู้มีส่วนร่วมรับทราบแล้ว (${params.row.stakeholdersconfirmed}/${params.row.totalstakeholders})`
              renderCell: (params: any) => (
                <>
                  {params.row.workflowsequence === 1 ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        ผู้มีส่วนร่วมรับทราบแล้ว (
                        {params.row.stakeholdersconfirmed}/
                        {params.row.totalstakeholders})
                      </div>
                    </div>
                  ) : params.row.workflowsequence === 2 ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-6 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        รอผู้อนุมัติ ({params.row.approversconfirmed}/
                        {params.row.totalapprover})
                      </div>
                    </div>
                  ) : params.row.workflowsequence === 3 ? (
                    <div className="w-full justify-start items-center gap-2 inline-flex ">
                      <div className="w-4 h-4 bg-meta-3 rounded-full"></div>
                      <div className="font-normal font-['Inter']">
                        อนุมัติแล้ว
                      </div>
                    </div>
                  ) : params.row.workflowsequence === 4 ? (
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
                  {/* <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    รายละเอียด
                  </Button> */}
                  <Link
                    href={{
                      pathname: "/detaillststakeholders",
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
