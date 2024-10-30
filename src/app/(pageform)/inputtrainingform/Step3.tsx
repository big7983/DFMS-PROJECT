import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type {} from '@mui/x-data-grid/themeAugmentation';

interface User {
  id: number;
  name: string;
  section: string;
  department: string;
  employeeid: string;
  level: string;
  position: string;
  email: string;
  userid: string;
}

const Step3: React.FC<{
  selectedUsers: { id: number; name: string; department: string }[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;

  handlePrevStep: () => void;
  handleNextStep: () => void;
}> = ({ selectedUsers, setSelectedUsers, handlePrevStep, handleNextStep }) => {
  const [searchText, setSearchText] = useState<string>(""); // state สำหรับค้นหา

  // กำหนด columns สำหรับ DataGrid
  const columns: GridColDef[] = [
    { field: "employeeid", headerName: "รหัสพนักงาน", width: 100 },
    { field: "name", headerName: "ชื่อ", width: 200 },
    { field: "level", headerName: "ระดับ", width: 150 },
    { field: "position", headerName: "ตำแหน่ง", width: 300 },
  ];

  const toggleUserSelection = (selectionModel: GridRowSelectionModel) => {
    const selected = selectionModel.map(
      (id) => users.find((user: User) => user.id === id)!
    );
    setSelectedUsers(selected);
  };

  const canProceed = selectedUsers.length > 0;

  const [users, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchUser(session.user.email);
    }
  }, [session?.user?.email]);

  const fetchUser = async (email: string) => {
    try {
      const resuser = await axios.get(`/api/v2/user/select/${email}`);
      const res = await axios.get(
        `/api/v3/organization/select?name=${resuser.data.section}`
      );
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const filteredRows = users.filter((users) => {
    const matchesname = users.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesemployeeid = users.employeeid
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesname || matchesemployeeid;
  });

  const theme = createTheme({
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: '#FF6500', // สีพื้นฐานของ checkbox
            '&.Mui-checked': {
              color: '#FF6500', // สีเมื่อ checkbox ถูกเลือก
            },
            
          },
        },
      },
    }
  });

  if (loading)
    return (
      <div className="mt-7 py-7">
        <Loader />
      </div>
    );

  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-4 border px-4.5 sm:px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke dark:border-strokedark ">
          <div className="grid sm:grid-flow-col mb-5">
            <div className="flex items-center ">
              <h2 className=" text-xl items-center text-left text-black dark:text-white">
                พนักงานที่สามารถเข้าร่วมได้
              </h2>
            </div>
            <div className="flex ">
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ รหัสพนักงาน"
                onChange={(e) => setSearchText(e.target.value)} // ค้นหาจากชื่อหลักสูตร
                className="w-full p-2 border rounded-md  border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={toggleUserSelection}
              rowSelectionModel={selectedUsers.map((user) => user.id)}
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
        </ThemeProvider>
      </div>

      <div className="flex justify-between mt-9">
        <button
          onClick={handlePrevStep}
          className="inline-flex items-center justify-center rounded-full bg-meta-6 px-7 py-4 text-center font-medium text-white hover:bg-opacity-50 lg:px-8 xl:px-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Previous
        </button>
        <button
          onClick={canProceed ? handleNextStep : undefined}
          disabled={!canProceed}
          className={`inline-flex items-center justify-center rounded-full px-7 py-4 text-center font-medium text-white lg:px-8 xl:px-10 ${
            canProceed ? "bg-meta-3 hover:bg-opacity-90" : "bg-slate-300 "
          }`}
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step3;
