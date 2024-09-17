"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { IoIosAddCircle } from "react-icons/io";

interface Column {
  id: "ID" | "name" | "datestart" | "formstatus" | "dateupdate";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "ID",
    label: "ลำดับ",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  { id: "name", label: "ชื่อหลักสูตร", minWidth: 200 },
  { id: "datestart", label: "วันเริ่มอบรม", minWidth: 150 },
  { id: "formstatus", label: "สถานะ", minWidth: 200 },
  { id: "dateupdate", label: "อัพเดทเมื่อ", minWidth: 150 },
  // {
  //   id: "population",
  //   label: "Population",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "size",
  //   label: "Size\u00a0(km\u00b2)",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "density",
  //   label: "Density",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value: number) => value.toFixed(2),
  // },
];

interface Data {
  ID: number;
  name: string;
  datestart: string;
  formstatus: string;
  dateupdate: string;
}

function createData(
  ID: number,
  name: string,
  datestart: string,
  formstatus: string,
  dateupdate: string
): Data {
  return { ID, name, datestart, formstatus, dateupdate };
}

const rows = [
  createData(
    1,
    "DataWareHouse",
    "Mon 2 May 2022",
    "รับทราบแล้ว (1/7)",
    "22 Apr 2022 13:00"
  ),
  // createData("China", "CN", 1403500365, 9596961),
  // createData("Italy", "IT", 60483973, 301340),
  // createData("United States", "US", 327167434, 9833520),
  // createData("Canada", "CA", 37602103, 9984670),
  // createData("Australia", "AU", 25475400, 7692024),
  // createData("Germany", "DE", 83019200, 357578),
  // createData("Ireland", "IE", 4857000, 70273),
  // createData("Mexico", "MX", 126577691, 1972550),
  // createData("Japan", "JP", 126317000, 377973),
  // createData("France", "FR", 67022000, 640679),
  // createData("United Kingdom", "GB", 67545757, 242495),
  // createData("Russia", "RU", 146793744, 17098246),
  // createData("Nigeria", "NG", 200962417, 923768),
  // createData("Brazil", "BR", 210147125, 8515767),
];

export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }} className="p-[25px] rounded-[20px]">
      <TableContainer sx={{ maxHeight: 440 }}>
        <div className=" justify-start items-center inline-flex w-full mb-7">
          <div className="flex-col justify-start items-start gap-[20px] inline-flex w-full">
            <div className="text-[#050505] text-[20px] font-bold font-['Inter'] leading-9">
              รายการขออนุมัติเข้าอบรม
            </div>
            <button className=" flex space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ">
              <IoIosAddCircle />
              <label className="text-sm">เพิ่มคำร้องขออนุมัติ</label>
            </button>
          </div>
          <div className="flex justify-end px-1">
            <div className="flex w-80 rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
              <input
                type="email"
                placeholder="Search Something..."
                className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"
              />
              <button
                type="button"
                className="flex items-center justify-center bg-[#007bff] px-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  width="16px"
                  className="fill-white"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 0,
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className="text-[#65676B]"
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="mt-7"
      />
    </Paper>
  );
}
